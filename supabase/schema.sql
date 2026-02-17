-- Schema for Follow Up Boss
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'agent')) default 'agent',
  name text not null default '',
  email text unique not null,
  phone_number text,
  brokerage_percentage numeric(5,2),
  description text,
  address text,
  city text,
  state text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone_number text,
  address text,
  city text,
  state text,
  country text,
  pincode text,
  description text,
  next_followup_at timestamptz default (now() + interval '7 days'),
  last_followup_at timestamptz,
  agent_id uuid references public.profiles (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  property_number text unique not null,
  description text,
  status text not null check (status in ('available', 'sold', 'on_hold')) default 'available',
  price numeric(12,2),
  rate_per_sqft numeric(12,2),
  agent_id uuid references public.profiles (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, email)
  values (new.id, 'agent', coalesce(new.raw_user_meta_data->>'name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.properties enable row level security;

-- Profiles policies
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Customers policies
create policy "Admins can manage customers" on public.customers
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "Agents can view their customers" on public.customers
  for select using (agent_id = auth.uid());

create policy "Agents can create their customers" on public.customers
  for insert with check (agent_id = auth.uid());

create policy "Agents can update their customers" on public.customers
  for update using (agent_id = auth.uid())
  with check (agent_id = auth.uid());

create policy "Agents can delete their customers" on public.customers
  for delete using (agent_id = auth.uid());

-- Properties policies
create policy "Admins can manage properties" on public.properties
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "Agents can view their properties" on public.properties
  for select using (agent_id = auth.uid());

create policy "Agents can create their properties" on public.properties
  for insert with check (agent_id = auth.uid());

create policy "Agents can update their properties" on public.properties
  for update using (agent_id = auth.uid())
  with check (agent_id = auth.uid());

create policy "Agents can delete their properties" on public.properties
  for delete using (agent_id = auth.uid());
