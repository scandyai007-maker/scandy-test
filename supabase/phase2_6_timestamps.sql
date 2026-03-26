-- SQL Script: Add auto-updating updated_at timestamps
-- Run this in Supabase SQL Editor

-- 1. Create a trigger function that automatically sets updated_at to the current time
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Add updated_at to platforms and news
ALTER TABLE public.platforms ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 3. Attach the trigger to the platforms table (fires before every UPDATE query)
DROP TRIGGER IF EXISTS update_platforms_modtime ON public.platforms;
CREATE TRIGGER update_platforms_modtime
BEFORE UPDATE ON public.platforms
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 4. Attach the trigger to the news table (fires before every UPDATE query)
DROP TRIGGER IF EXISTS update_news_modtime ON public.news;
CREATE TRIGGER update_news_modtime
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
