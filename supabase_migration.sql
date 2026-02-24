-- Run this safely in your Supabase SQL Editor
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'expense';
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS category_limits JSONB DEFAULT '{}'::jsonb;
