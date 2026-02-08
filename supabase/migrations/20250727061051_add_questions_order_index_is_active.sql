-- Add order_index and is_active fields to questions table
-- Migration: 20250727061051_add_questions_order_index_is_active

-- Add order_index field (INTEGER, NOT NULL, DEFAULT 0)
ALTER TABLE questions 
ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0;

-- Add is_active field (BOOLEAN, NOT NULL, DEFAULT true)
ALTER TABLE questions 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Create index on order_index for better performance when ordering questions
CREATE INDEX idx_questions_order_index ON questions(order_index);

-- Create index on is_active for filtering active/inactive questions
CREATE INDEX idx_questions_is_active ON questions(is_active);

-- Create composite index for lesson_id + order_index for efficient lesson-based ordering
CREATE INDEX idx_questions_lesson_order ON questions(lesson_id, order_index);

-- Create composite index for lesson_id + is_active for efficient filtering
CREATE INDEX idx_questions_lesson_active ON questions(lesson_id, is_active);

-- Add comment to document the new fields
COMMENT ON COLUMN questions.order_index IS 'Order of the question within a lesson (0-based)';
COMMENT ON COLUMN questions.is_active IS 'Whether the question is active and visible to students';
