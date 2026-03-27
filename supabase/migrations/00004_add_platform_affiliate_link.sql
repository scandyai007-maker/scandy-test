-- Migration: Add affiliate_link to platforms table
ALTER TABLE public.platforms ADD COLUMN affiliate_link text;

-- Add comment for documentation
COMMENT ON COLUMN public.platforms.affiliate_link IS 'The redirect URL for Play Now and Claim Bonus buttons';
