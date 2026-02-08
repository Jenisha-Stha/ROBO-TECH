-- Migration: Remove old URL fields from courses table
-- This migration removes the old image_url, video_url fields and keeps only asset_id fields

-- Remove old URL fields from courses table
ALTER TABLE courses DROP COLUMN IF EXISTS image_url;
ALTER TABLE courses DROP COLUMN IF EXISTS video_url;
ALTER TABLE courses DROP COLUMN IF EXISTS top_image_url;
ALTER TABLE courses DROP COLUMN IF EXISTS bottom_image_url;
ALTER TABLE courses DROP COLUMN IF EXISTS background_image_url;

-- Remove old URL fields from other tables as well
ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE lessons DROP COLUMN IF EXISTS image_url;
ALTER TABLE lessons DROP COLUMN IF EXISTS video_url;
ALTER TABLE questions DROP COLUMN IF EXISTS question_image_url;
ALTER TABLE questions_has_options DROP COLUMN IF EXISTS option_image_url;

-- Add comments for documentation
COMMENT ON TABLE courses IS 'Courses table now uses asset_id fields instead of direct URLs';
COMMENT ON COLUMN courses.image_asset_id IS 'Reference to assets table for main course image';
COMMENT ON COLUMN courses.video_asset_id IS 'Reference to assets table for course video';
COMMENT ON COLUMN courses.top_image_asset_id IS 'Reference to assets table for top banner image';
COMMENT ON COLUMN courses.bottom_image_asset_id IS 'Reference to assets table for bottom banner image';
COMMENT ON COLUMN courses.background_image_asset_id IS 'Reference to assets table for background image';
