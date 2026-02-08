-- Migration: Make option_text nullable in questions_has_options table
-- This migration allows option_text to be NULL for image-only options

-- Make option_text column nullable
ALTER TABLE questions_has_options ALTER COLUMN option_text DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN questions_has_options.option_text IS 'Option text - can be NULL for image-only options';
