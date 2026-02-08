-- Migration: Add Assets Table and Update Existing Tables to Use Asset IDs
-- This migration creates a centralized assets table for both images and videos
-- and updates all existing tables to reference asset IDs instead of storing direct URLs

-- Drop the images table if it exists (from previous migration)
DROP TABLE IF EXISTS images CASCADE;

-- Create assets table (supports both images and videos)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,                    -- Public URL of the asset in R2
  file_name TEXT NOT NULL,              -- Filename as stored in R2
  file_size BIGINT NOT NULL,            -- File size in bytes
  mime_type TEXT NOT NULL,              -- MIME type (e.g., image/jpeg, video/mp4)
  original_name TEXT,                   -- Original filename when uploaded
  alt_text TEXT,                        -- Alternative text for accessibility
  description TEXT,                     -- Description of asset content
  asset_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  duration INTEGER,                     -- Duration in seconds (for videos)
  width INTEGER,                        -- Width in pixels (for images/videos)
  height INTEGER,                       -- Height in pixels (for images/videos)
  thumbnail_url TEXT,                  -- Thumbnail URL (for videos)
  is_erased BOOLEAN DEFAULT FALSE,      -- Soft delete flag
  is_active BOOLEAN DEFAULT TRUE,       -- Active status
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_assets_url ON assets(url);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);
CREATE INDEX idx_assets_mime_type ON assets(mime_type);
CREATE INDEX idx_assets_created_by ON assets(created_by);
CREATE INDEX idx_assets_created_at ON assets(created_at);

-- Update existing tables to use asset_id columns instead of image_id

-- Update profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_image_id;
ALTER TABLE profiles ADD COLUMN avatar_asset_id UUID REFERENCES assets(id);

-- Update courses table
ALTER TABLE courses DROP COLUMN IF EXISTS image_id;
ALTER TABLE courses DROP COLUMN IF EXISTS top_image_id;
ALTER TABLE courses DROP COLUMN IF EXISTS bottom_image_id;
ALTER TABLE courses DROP COLUMN IF EXISTS background_image_id;
ALTER TABLE courses ADD COLUMN image_asset_id UUID REFERENCES assets(id);
ALTER TABLE courses ADD COLUMN top_image_asset_id UUID REFERENCES assets(id);
ALTER TABLE courses ADD COLUMN bottom_image_asset_id UUID REFERENCES assets(id);
ALTER TABLE courses ADD COLUMN background_image_asset_id UUID REFERENCES assets(id);
ALTER TABLE courses ADD COLUMN video_asset_id UUID REFERENCES assets(id);

-- Update lessons table
ALTER TABLE lessons DROP COLUMN IF EXISTS image_id;
ALTER TABLE lessons ADD COLUMN image_asset_id UUID REFERENCES assets(id);
ALTER TABLE lessons ADD COLUMN video_asset_id UUID REFERENCES assets(id);

-- Update questions table
ALTER TABLE questions DROP COLUMN IF EXISTS question_image_id;
ALTER TABLE questions ADD COLUMN question_asset_id UUID REFERENCES assets(id);

-- Update questions_has_options table
ALTER TABLE questions_has_options DROP COLUMN IF EXISTS option_image_id;
ALTER TABLE questions_has_options ADD COLUMN option_asset_id UUID REFERENCES assets(id);

-- Add indexes for the new asset_id columns
CREATE INDEX idx_profiles_avatar_asset_id ON profiles(avatar_asset_id);
CREATE INDEX idx_courses_image_asset_id ON courses(image_asset_id);
CREATE INDEX idx_courses_top_image_asset_id ON courses(top_image_asset_id);
CREATE INDEX idx_courses_bottom_image_asset_id ON courses(bottom_image_asset_id);
CREATE INDEX idx_courses_background_image_asset_id ON courses(background_image_asset_id);
CREATE INDEX idx_courses_video_asset_id ON courses(video_asset_id);
CREATE INDEX idx_lessons_image_asset_id ON lessons(image_asset_id);
CREATE INDEX idx_lessons_video_asset_id ON lessons(video_asset_id);
CREATE INDEX idx_questions_question_asset_id ON questions(question_asset_id);
CREATE INDEX idx_questions_has_options_option_asset_id ON questions_has_options(option_asset_id);

-- Create a function to automatically create asset records
CREATE OR REPLACE FUNCTION create_asset_record(
  p_url TEXT,
  p_file_name TEXT,
  p_file_size BIGINT,
  p_mime_type TEXT,
  p_original_name TEXT DEFAULT NULL,
  p_alt_text TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_asset_type TEXT DEFAULT 'image',
  p_duration INTEGER DEFAULT NULL,
  p_width INTEGER DEFAULT NULL,
  p_height INTEGER DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  asset_id UUID;
BEGIN
  INSERT INTO assets (
    url,
    file_name,
    file_size,
    mime_type,
    original_name,
    alt_text,
    description,
    asset_type,
    duration,
    width,
    height,
    thumbnail_url,
    created_by,
    updated_by
  ) VALUES (
    p_url,
    p_file_name,
    p_file_size,
    p_mime_type,
    p_original_name,
    p_alt_text,
    p_description,
    p_asset_type,
    p_duration,
    p_width,
    p_height,
    p_thumbnail_url,
    p_created_by,
    p_created_by
  ) RETURNING id INTO asset_id;
  
  RETURN asset_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get asset URL by ID
CREATE OR REPLACE FUNCTION get_asset_url(asset_id UUID) RETURNS TEXT AS $$
DECLARE
  asset_url TEXT;
BEGIN
  SELECT url INTO asset_url FROM assets WHERE id = asset_id AND is_active = TRUE AND is_erased = FALSE;
  RETURN asset_url;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get asset details by ID
CREATE OR REPLACE FUNCTION get_asset_details(asset_id UUID) 
RETURNS TABLE (
  id UUID,
  url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  original_name TEXT,
  alt_text TEXT,
  description TEXT,
  asset_type TEXT,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  thumbnail_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.url,
    a.file_name,
    a.file_size,
    a.mime_type,
    a.original_name,
    a.alt_text,
    a.description,
    a.asset_type,
    a.duration,
    a.width,
    a.height,
    a.thumbnail_url,
    a.created_at,
    a.updated_at
  FROM assets a
  WHERE a.id = asset_id 
    AND a.is_active = TRUE 
    AND a.is_erased = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to soft delete an asset
CREATE OR REPLACE FUNCTION delete_asset(asset_id UUID, deleted_by UUID DEFAULT NULL) 
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE assets 
  SET 
    is_erased = TRUE,
    updated_by = deleted_by,
    updated_at = now()
  WHERE id = asset_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update asset details
CREATE OR REPLACE FUNCTION update_asset(
  asset_id UUID,
  p_alt_text TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_duration INTEGER DEFAULT NULL,
  p_width INTEGER DEFAULT NULL,
  p_height INTEGER DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL,
  updated_by UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE assets 
  SET 
    alt_text = COALESCE(p_alt_text, alt_text),
    description = COALESCE(p_description, description),
    duration = COALESCE(p_duration, duration),
    width = COALESCE(p_width, width),
    height = COALESCE(p_height, height),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    updated_by = COALESCE(updated_by, updated_by),
    updated_at = now()
  WHERE id = asset_id 
    AND is_active = TRUE 
    AND is_erased = FALSE;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get assets by type
CREATE OR REPLACE FUNCTION get_assets_by_type(p_asset_type TEXT) 
RETURNS TABLE (
  id UUID,
  url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  original_name TEXT,
  alt_text TEXT,
  description TEXT,
  asset_type TEXT,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  thumbnail_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.url,
    a.file_name,
    a.file_size,
    a.mime_type,
    a.original_name,
    a.alt_text,
    a.description,
    a.asset_type,
    a.duration,
    a.width,
    a.height,
    a.thumbnail_url,
    a.created_at,
    a.updated_at
  FROM assets a
  WHERE a.asset_type = p_asset_type
    AND a.is_active = TRUE 
    AND a.is_erased = FALSE
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for assets table
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all active assets
CREATE POLICY "Users can view active assets" ON assets
  FOR SELECT USING (is_active = TRUE AND is_erased = FALSE);

-- Policy: Users can insert assets
CREATE POLICY "Users can insert assets" ON assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own assets
CREATE POLICY "Users can update their own assets" ON assets
  FOR UPDATE USING (created_by = auth.uid() OR updated_by = auth.uid());

-- Policy: Users can delete their own assets
CREATE POLICY "Users can delete their own assets" ON assets
  FOR DELETE USING (created_by = auth.uid() OR updated_by = auth.uid());

-- Add comments for documentation
COMMENT ON TABLE assets IS 'Centralized table for storing asset metadata and URLs (images and videos)';
COMMENT ON COLUMN assets.url IS 'The public URL of the asset stored in R2';
COMMENT ON COLUMN assets.file_name IS 'The filename as stored in R2';
COMMENT ON COLUMN assets.file_size IS 'Size of the file in bytes';
COMMENT ON COLUMN assets.mime_type IS 'MIME type of the asset (e.g., image/jpeg, video/mp4)';
COMMENT ON COLUMN assets.original_name IS 'Original filename when uploaded';
COMMENT ON COLUMN assets.alt_text IS 'Alternative text for accessibility';
COMMENT ON COLUMN assets.description IS 'Description of the asset content';
COMMENT ON COLUMN assets.asset_type IS 'Type of asset: image or video';
COMMENT ON COLUMN assets.duration IS 'Duration in seconds (for videos)';
COMMENT ON COLUMN assets.width IS 'Width in pixels (for images/videos)';
COMMENT ON COLUMN assets.height IS 'Height in pixels (for images/videos)';
COMMENT ON COLUMN assets.thumbnail_url IS 'Thumbnail URL (for videos)';
