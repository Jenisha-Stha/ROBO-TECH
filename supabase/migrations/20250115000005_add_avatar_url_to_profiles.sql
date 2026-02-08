-- Migration: Add avatar_url field to profiles table
-- This migration adds a string avatar_url field to the profiles table
-- This field can be used alongside or instead of the avatar_asset_id field

-- Add avatar_url column to profiles table
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.avatar_url IS 'Direct URL to user avatar image - can be used alongside avatar_asset_id';
