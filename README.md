# PaisaPulse - Personal Finance Tracker

A premium, fully responsive PWA for tracking monthly expenses — built with a **Neon Nocturne** (Black & Purple) aesthetic.

## ✨ Features

- 📊 **Dashboard** — Monthly budget overview, income vs spend metrics, recent transactions
- ➕ **Add Expenses / Income** — Categorized transactions with icon pickers and payment method
- 📈 **Analytics** — Daily trend charts, category breakdown pie chart, budget usage, annual projections
- 🕰️ **History** — Year/Month accordion view of all past transactions with swipe-to-delete
- ⚙️ **Settings** — Monthly budget limits, category caps, CSV export, global timeframe filter
- 📱 **PWA Ready** — Installable on Android/iOS/Desktop as a Chrome App

## 🎨 Design System

**Neon Nocturne** — Deep black backgrounds with Neon Purple (#B026FF) and Fuchsia (#FF2E93) accents, glassmorphism cards, and ambient glows.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase URL and Anon Key

3. **Run Locally**
   ```bash
   npm run dev
   ```

## 📱 Responsive Layout

| Breakpoint | Layout |
|---|---|
| Mobile (`< md`) | Single column, bottom navigation bar |
| Tablet / Desktop (`≥ md`) | Sidebar navigation, multi-column grids |

## 🗄️ Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor:

```sql
-- 1. Categories Table
create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text not null,
  color text,
  is_default boolean default false,
  created_at timestamp with time zone default now() not null
);

-- 2. Expenses Table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  category_id uuid references categories(id),
  payment_method text not null,
  note text,
  date timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null
);

-- 3. User Settings Table
create table user_settings (
  user_id uuid references auth.users not null primary key,
  monthly_limit numeric default 20000,
  display_name text,
  currency text default 'INR',
  category_limits jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table categories enable row level security;
alter table expenses enable row level security;
alter table user_settings enable row level security;

-- Policies
create policy "Own data only" on categories for all using (auth.uid() = user_id);
create policy "Own data only" on expenses for all using (auth.uid() = user_id);
create policy "Own data only" on user_settings for all using (auth.uid() = user_id);
```

## 🛠️ Deploy

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy ✅

## 🧱 Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 | Framework |
| Tailwind CSS v4 | Styling |
| Supabase | Auth + Database |
| Framer Motion | Animations |
| Recharts | Charts |
| Lucide React | Icons |
