-- Fix: Make the 'date' column in news optional (allow NULL),
-- since we now use created_at / updated_at for timestamps instead.
-- Run this in Supabase SQL Editor.

ALTER TABLE public.news
  ALTER COLUMN date DROP NOT NULL,
  ALTER COLUMN date SET DEFAULT NULL;
