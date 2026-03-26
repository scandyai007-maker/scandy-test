-- SQL Script: Create Tags table and append to platforms and news
-- Run this in Supabase SQL Editor

-- 1. Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add tags array to platforms
ALTER TABLE public.platforms ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- 3. Add tags array to news
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- 4. Insert some default tags if table is empty
INSERT INTO public.tags (name)
VALUES 
  ('Crypto Casino'),
  ('Live Dealer'),
  ('High Roller'),
  ('Sports Betting'),
  ('Fast Payouts'),
  ('Regulation'),
  ('Industry Update'),
  ('Mobile Friendly')
ON CONFLICT (name) DO NOTHING;
