# PaisaPulse - Monthly Budget Tracker

A smartphone-first, dark-mode PWA for tracking monthly expenses.

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    - Copy `.env.local.example` to `.env.local`
    - Fill in your Supabase URL and Anon Key.

3.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📱 PWA Setup

- The app is PWA-ready.
- Manifest is located at `public/manifest.json`.
- Icons should be placed in `public/` as `icon-192x192.png` and `icon-512x512.png`.

## 🗄️ Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create Users Table (handled by Supabase Auth usually, but for custom data linkage)
-- We will link data to auth.users.id

-- 1. Create Categories Table
create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text not null,
  color text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Expenses Table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  category_id uuid references categories(id),
  payment_method text not null,
  note text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Budget Settings Table
create table budget_settings (
  user_id uuid references auth.users not null primary key,
  monthly_limit numeric default 20000,
  currency text default 'INR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table categories enable row level security;
alter table expenses enable row level security;
alter table budget_settings enable row level security;

-- Policies (Simple: Users can only see their own data)
create policy "Users can translate their own categories" on categories for all using (auth.uid() = user_id);
create policy "Users can translate their own expenses" on expenses for all using (auth.uid() = user_id);
create policy "Users can translate their own settings" on budget_settings for all using (auth.uid() = user_id);
```

## 🛠️ Deploy to Vercel

1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4.  Deploy!
