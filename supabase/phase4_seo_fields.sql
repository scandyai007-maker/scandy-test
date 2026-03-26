-- Phase 4: Enhanced SEO Settings Fields
-- Adds additional SEO-critical columns to site_settings

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS canonical_base_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_site_verification TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_analytics_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS footer_copyright TEXT DEFAULT '';
