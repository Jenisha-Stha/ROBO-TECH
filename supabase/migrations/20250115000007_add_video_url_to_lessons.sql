-- Migration: Add video_url field to lessons table
-- This migration ensures the video_url field exists in the lessons table

-- Add video_url column to lessons table if it doesn't exist
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN lessons.video_url IS 'Direct URL to video content for the lesson';
