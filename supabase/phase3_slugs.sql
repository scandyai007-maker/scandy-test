-- Phase 3: Add SEO-friendly slug columns to platforms, news, collections
-- Slugs are derived from name/title: lowercase, replace non-alphanumeric with hyphens, trim

-- ===== 1. PLATFORMS =====
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs from name
UPDATE platforms
SET slug = LOWER(
  TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '[\s]+', '-', 'g'
    )
  )
)
WHERE slug IS NULL;

-- Handle duplicates by appending row number
WITH dupes AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) AS rn
  FROM platforms
)
UPDATE platforms p
SET slug = dupes.slug || '-' || dupes.rn
FROM dupes
WHERE p.id = dupes.id AND dupes.rn > 1;

ALTER TABLE platforms ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_platforms_slug ON platforms(slug);

-- ===== 2. NEWS =====
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE news
SET slug = LOWER(
  TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '[\s]+', '-', 'g'
    )
  )
)
WHERE slug IS NULL;

WITH dupes AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) AS rn
  FROM news
)
UPDATE news n
SET slug = dupes.slug || '-' || dupes.rn
FROM dupes
WHERE n.id = dupes.id AND dupes.rn > 1;

ALTER TABLE news ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- ===== 3. COLLECTIONS =====
ALTER TABLE collections ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE collections
SET slug = LOWER(
  TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '[\s]+', '-', 'g'
    )
  )
)
WHERE slug IS NULL;

WITH dupes AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) AS rn
  FROM collections
)
UPDATE collections c
SET slug = dupes.slug || '-' || dupes.rn
FROM dupes
WHERE c.id = dupes.id AND dupes.rn > 1;

ALTER TABLE collections ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
