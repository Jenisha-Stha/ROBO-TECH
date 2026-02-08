-- Migration: Add Images Table and Update Existing Tables to Use Image IDs
-- This migration creates a centralized images table and updates all existing tables
-- to reference image IDs instead of storing direct URLs

-- Create images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  original_name TEXT,
  alt_text TEXT,
  description TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_images_url ON images(url);
CREATE INDEX idx_images_created_by ON images(created_by);
CREATE INDEX idx_images_created_at ON images(created_at);

-- Add image_id columns to existing tables and remove old image_url columns

-- Update profiles table
ALTER TABLE profiles ADD COLUMN avatar_image_id UUID REFERENCES images(id);
-- Note: We'll keep avatar_url for now during transition, can be removed later

-- Update courses table
ALTER TABLE courses ADD COLUMN image_id UUID REFERENCES images(id);
ALTER TABLE courses ADD COLUMN top_image_id UUID REFERENCES images(id);
ALTER TABLE courses ADD COLUMN bottom_image_id UUID REFERENCES images(id);
ALTER TABLE courses ADD COLUMN background_image_id UUID REFERENCES images(id);
-- Note: We'll keep the old image_url columns for now during transition

-- Update lessons table (add image support)
ALTER TABLE lessons ADD COLUMN image_id UUID REFERENCES images(id);

-- Update questions table
ALTER TABLE questions ADD COLUMN question_image_id UUID REFERENCES images(id);
-- Note: We'll keep question_image_url for now during transition

-- Update questions_has_options table
ALTER TABLE questions_has_options ADD COLUMN option_image_id UUID REFERENCES images(id);
-- Note: We'll keep option_image_url for now during transition

-- Add indexes for the new image_id columns
CREATE INDEX idx_profiles_avatar_image_id ON profiles(avatar_image_id);
CREATE INDEX idx_courses_image_id ON courses(image_id);
CREATE INDEX idx_courses_top_image_id ON courses(top_image_id);
CREATE INDEX idx_courses_bottom_image_id ON courses(bottom_image_id);
CREATE INDEX idx_courses_background_image_id ON courses(background_image_id);
CREATE INDEX idx_lessons_image_id ON lessons(image_id);
CREATE INDEX idx_questions_question_image_id ON questions(question_image_id);
CREATE INDEX idx_questions_has_options_option_image_id ON questions_has_options(option_image_id);

-- Create a function to automatically create image records
CREATE OR REPLACE FUNCTION create_image_record(
  p_url TEXT,
  p_file_name TEXT,
  p_file_size BIGINT,
  p_mime_type TEXT,
  p_original_name TEXT DEFAULT NULL,
  p_alt_text TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  image_id UUID;
BEGIN
  INSERT INTO images (
    url,
    file_name,
    file_size,
    mime_type,
    original_name,
    alt_text,
    description,
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
    p_created_by,
    p_created_by
  ) RETURNING id INTO image_id;
  
  RETURN image_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get image URL by ID
CREATE OR REPLACE FUNCTION get_image_url(image_id UUID) RETURNS TEXT AS $$
DECLARE
  image_url TEXT;
BEGIN
  SELECT url INTO image_url FROM images WHERE id = image_id AND is_active = TRUE AND is_erased = FALSE;
  RETURN image_url;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get image details by ID
CREATE OR REPLACE FUNCTION get_image_details(image_id UUID) 
RETURNS TABLE (
  id UUID,
  url TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  original_name TEXT,
  alt_text TEXT,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.url,
    i.file_name,
    i.file_size,
    i.mime_type,
    i.original_name,
    i.alt_text,
    i.description,
    i.created_at,
    i.updated_at
  FROM images i
  WHERE i.id = image_id 
    AND i.is_active = TRUE 
    AND i.is_erased = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to soft delete an image
CREATE OR REPLACE FUNCTION delete_image(image_id UUID, deleted_by UUID DEFAULT NULL) 
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE images 
  SET 
    is_erased = TRUE,
    updated_by = deleted_by,
    updated_at = now()
  WHERE id = image_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update image details
CREATE OR REPLACE FUNCTION update_image(
  image_id UUID,
  p_alt_text TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  updated_by UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE images 
  SET 
    alt_text = COALESCE(p_alt_text, alt_text),
    description = COALESCE(p_description, description),
    updated_by = COALESCE(updated_by, updated_by),
    updated_at = now()
  WHERE id = image_id 
    AND is_active = TRUE 
    AND is_erased = FALSE;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all active images
CREATE POLICY "Users can view active images" ON images
  FOR SELECT USING (is_active = TRUE AND is_erased = FALSE);

-- Policy: Users can insert images
CREATE POLICY "Users can insert images" ON images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own images
CREATE POLICY "Users can update their own images" ON images
  FOR UPDATE USING (created_by = auth.uid() OR updated_by = auth.uid());

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete their own images" ON images
  FOR DELETE USING (created_by = auth.uid() OR updated_by = auth.uid());

-- Add comments for documentation
COMMENT ON TABLE images IS 'Centralized table for storing image metadata and URLs';
COMMENT ON COLUMN images.url IS 'The public URL of the image stored in R2';
COMMENT ON COLUMN images.file_name IS 'The filename as stored in R2';
COMMENT ON COLUMN images.file_size IS 'Size of the file in bytes';
COMMENT ON COLUMN images.mime_type IS 'MIME type of the image (e.g., image/jpeg)';
COMMENT ON COLUMN images.original_name IS 'Original filename when uploaded';
COMMENT ON COLUMN images.alt_text IS 'Alternative text for accessibility';
COMMENT ON COLUMN images.description IS 'Description of the image content';
