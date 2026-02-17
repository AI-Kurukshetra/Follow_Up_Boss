-- Seed data (requires users to exist in auth)
-- Admin user should be created via scripts/seed.mjs

-- Agents
insert into public.profiles (id, role, name, email, phone_number, brokerage_percentage, description, address, city, state, country)
select p.id, 'agent', 'Avery Cole', 'agent1@followupboss.local', '+1-555-0101', 2.5, 'Residential specialist', '12 Market St', 'Austin', 'TX', 'USA'
from public.profiles p
where p.email = 'agent1@followupboss.local'
on conflict (id) do nothing;

insert into public.profiles (id, role, name, email, phone_number, brokerage_percentage, description, address, city, state, country)
select p.id, 'agent', 'Jordan Park', 'agent2@followupboss.local', '+1-555-0102', 3.0, 'Commercial specialist', '88 River Rd', 'Denver', 'CO', 'USA'
from public.profiles p
where p.email = 'agent2@followupboss.local'
on conflict (id) do nothing;

insert into public.profiles (id, role, name, email, phone_number, brokerage_percentage, description, address, city, state, country)
select p.id, 'agent', 'Agent Three', 'agent3@followupboss.local', '+1-555-0103', 2.75, 'Agent', '50 Center St', 'Phoenix', 'AZ', 'USA'
from public.profiles p
where p.email = 'agent3@followupboss.local'
on conflict (id) do nothing;

-- Customers
insert into public.customers
  (name, email, phone_number, address, city, state, country, pincode, description, agent_id, created_by)
select
  'Taylor Reed',
  'taylor.reed@example.com',
  '+1-555-0201',
  '45 Oak Lane',
  'Austin',
  'TX',
  'USA',
  '73301',
  'Looking for a 3BR in north Austin',
  p.id,
  p.id
from public.profiles p
where p.email = 'agent1@followupboss.local'
on conflict (email) do nothing;

insert into public.customers
  (name, email, phone_number, address, city, state, country, pincode, description, agent_id, created_by)
select
  'Morgan Lee',
  'morgan.lee@example.com',
  '+1-555-0202',
  '901 Pine Ave',
  'Denver',
  'CO',
  'USA',
  '80202',
  'Interested in commercial lease',
  p.id,
  p.id
from public.profiles p
where p.email = 'agent2@followupboss.local'
on conflict (email) do nothing;

-- Properties
insert into public.properties
  (property_number, description, status, price, rate_per_sqft, agent_id, created_by)
select
  'PROP-1001',
  'Modern 3BR with backyard',
  'available',
  520000,
  260,
  p.id,
  p.id
from public.profiles p
where p.email = 'agent1@followupboss.local'
on conflict (property_number) do nothing;

insert into public.properties
  (property_number, description, status, price, rate_per_sqft, agent_id, created_by)
select
  'PROP-2001',
  'Downtown retail space',
  'on_hold',
  1400000,
  420,
  p.id,
  p.id
from public.profiles p
where p.email = 'agent2@followupboss.local'
on conflict (property_number) do nothing;
