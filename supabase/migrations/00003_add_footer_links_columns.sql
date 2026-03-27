-- Migration: Add JSONB columns for footer links
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS footer_column_1_links JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS footer_column_2_links JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS footer_column_3_links JSONB DEFAULT '[]';

-- Optional: Initialize with current defaults to avoid empty footer on first load
UPDATE site_settings
SET 
  footer_column_1_links = '[
    {"label": "Top 10 Overall", "url": "/"},
    {"label": "Best Bonuses", "url": "/collections"},
    {"label": "Crypto Platforms", "url": "/games"},
    {"label": "Newest Additions", "url": "/news"}
  ]',
  footer_column_2_links = '[
    {"label": "Review Methodology", "url": "#"},
    {"label": "Player Guides", "url": "#"},
    {"label": "Scam Alerts", "url": "#"}
  ]',
  footer_column_3_links = '[
    {"label": "Our Team", "url": "#"},
    {"label": "Contact", "url": "#"},
    {"label": "Privacy Policy", "url": "#"},
    {"label": "Terms of Service", "url": "#"}
  ]'
WHERE id = 1 AND (footer_column_1_links IS NULL OR footer_column_1_links = '[]');
