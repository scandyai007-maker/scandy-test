-- Create site_settings table (singleton pattern)
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name text NOT NULL DEFAULT 'GamePortal',
  seo_title text NOT NULL DEFAULT 'GamePortal - The Ultimate Crypto Gaming Destination',
  seo_description text NOT NULL DEFAULT 'Discover the best crypto casinos, blockchain games, and web3 experiences.',
  seo_keywords text NOT NULL DEFAULT 'crypto casino, bitcoin casino, web3 gaming',
  hero_banner_url text,
  robots_txt text DEFAULT 'User-agent: *\nAllow: /',
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Insert the default configuration
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);

-- Allow authenticated users (admin) to update the settings
CREATE POLICY "Allow authenticated full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
