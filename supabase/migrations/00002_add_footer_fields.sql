-- Migration: Add extra footer configuration fields to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS footer_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS footer_column_1_title TEXT DEFAULT 'Rankings',
  ADD COLUMN IF NOT EXISTS footer_column_2_title TEXT DEFAULT 'Resources',
  ADD COLUMN IF NOT EXISTS footer_column_3_title TEXT DEFAULT 'About Us';

-- Update the existing record with default values if they are empty
UPDATE site_settings 
SET 
  footer_description = 'Independent, data-driven reviews and rankings for premium online platforms. We analyze, verify, and rank so you can play with confidence.',
  footer_column_1_title = 'Rankings',
  footer_column_2_title = 'Resources',
  footer_column_3_title = 'About Us'
WHERE id = 1 AND (footer_description = '' OR footer_description IS NULL);
