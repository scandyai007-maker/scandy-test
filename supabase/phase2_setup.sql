-- ==========================================
-- Phase 2 Setup Script: Categories, SEO, Storage
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('platform', 'news')),
  rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running safely)
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated full access on categories" ON categories;

CREATE POLICY "Allow public read access on categories" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access on categories" 
ON categories FOR ALL USING (auth.role() = 'authenticated');

-- 2. Insert Default Categories
INSERT INTO categories (name, type, rank) VALUES 
('Crypto Casinos', 'platform', 1),
('Live Dealer', 'platform', 2),
('Sports Betting', 'platform', 3),
('High Roller', 'platform', 4),
('Fast Payouts', 'platform', 5),
('Industry Updates', 'news', 1),
('Game Releases', 'news', 2),
('Bonus Offers', 'news', 3),
('Regulations', 'news', 4);

-- 3. Add SEO Fields to existing tables
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text;

ALTER TABLE news 
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text;

-- 4. Create images Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies (Allow public read, Authenticated write)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users can delete images" ON storage.objects;

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Authenticated Users can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users can update images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');
