-- Phase 2.9: Add 'content' rich-text field to platforms table
ALTER TABLE public.platforms
  ADD COLUMN IF NOT EXISTS content text;
