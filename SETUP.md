# PaisaPulse Setup Guide

## 1. Environment Configuration

To connect the app to your database, you need to create a `.env.local` file in the root directory.

1.  Copy the example file:
    ```bash
    cp .env.local.example .env.local
    ```
2.  Open `.env.local` and fill in your Supabase credentials.

### Getting Supabase Credentials

1.  Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2.  Once created, go to **Project Settings** -> **API**.
3.  Find proper values:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Setup under "Project URL"
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Setup under "Project API keys" (anon public)

Your `.env.local` should look like this:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. Database Schema

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create Expenses Table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  category jsonb not null,
  note text,
  payment_method text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.expenses enable row level security;

-- Create Policy
create policy "Users can manage their own expenses"
on public.expenses for all
using (auth.uid() = user_id);
```

## 3. GitHub Push

To push this project to GitHub:

1.  Create a new repository on GitHub.
2.  Run these commands:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/paisapulse.git
    git branch -M main
    git push -u origin main
    ```
