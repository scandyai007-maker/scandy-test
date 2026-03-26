-- ==========================================
-- Phase 2.8 Fix: News table missing columns + NOT NULL constraint
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Add missing 'author' column to news table
ALTER TABLE public.news 
  ADD COLUMN IF NOT EXISTS author text DEFAULT 'System';

-- 2. Drop NOT NULL from 'date' column (we no longer manage it from the CMS)
ALTER TABLE public.news 
  ALTER COLUMN date DROP NOT NULL;

-- Done! Now the news edit form can save without errors.
