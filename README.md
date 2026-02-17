# Follow Up Boss

Production-ready real estate lead management system for admins and agents.

## Features

- Admin creates agents, customers, and properties.
- Agents manage their own customers and properties.
- Weekly Gmail follow-up reminders via cron.
- Supabase Auth, database tables, and row-level security.
- Clean UI ready for Vercel deployment.

## Tech Stack

- Next.js App Router (latest)
- Supabase (Auth + Postgres)
- Tailwind CSS (v4)
- Nodemailer (Gmail SMTP)

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. **Allow any email for sign-up (e.g. Gmail):** In Supabase go to **Authentication → Sign In / Providers → Email**. If "Email domain allowlist" is set, clear it or add `gmail.com` (and any other domains you need). Otherwise agent registration may show "Email address is invalid" for addresses like `user@gmail.com`.
4. Copy `.env.example` to `.env.local` and fill in the values.
5. Run the seed script (optional):

```bash
npm install
npm run seed
```

Seed creates:

- Admin user `ADMIN_EMAIL` with password `ADMIN_PASSWORD` (default `admin123`)
- Two agents (`agent1@followupboss.local`, `agent2@followupboss.local`)
- Sample customers and properties

## Local Development

```bash
npm run dev
```

Open http://localhost:3000.

## Gmail Follow-ups

1. Create a Gmail app password.
2. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
3. Set `CRON_SECRET` and update `vercel.json` with the same value.

The cron endpoint:

```
/api/cron/weekly-followup?secret=YOUR_CRON_SECRET
```

## Vercel

Deploy the app normally and add the same environment variables in Vercel.
Cron schedule is configured in `vercel.json`.
