-- Add slug field to questions table
-- This field will be unique within each lesson

ALTER TABLE questions 
ADD COLUMN slug TEXT;

-- Create index for slug within lesson for better performance
CREATE INDEX idx_questions_lesson_slug ON questions(lesson_id, slug);

-- Add comment to document the new field
COMMENT ON COLUMN questions.slug IS 'Unique slug for the question within a lesson';
