-- Database Redesign Migration
-- This migration drops all existing tables and recreates them according to the new design requirements

-- Drop all existing functions first
DROP FUNCTION IF EXISTS get_user_permissions(UUID);
DROP FUNCTION IF EXISTS has_permission(UUID, TEXT);

-- Drop all existing tables in reverse dependency order
DROP TABLE IF EXISTS user_responses CASCADE;
DROP TABLE IF EXISTS user_lessons_response CASCADE;
DROP TABLE IF EXISTS user_course_response CASCADE;
DROP TABLE IF EXISTS questions_has_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_tags CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS tag_types CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_types CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS user_role CASCADE;

-- Recreate enums
CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'guest');

-- Create user_types table
CREATE TABLE user_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create tag_types table
CREATE TABLE tag_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  tagtype_id UUID REFERENCES tag_types(id),
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  user_type_id UUID REFERENCES user_types(id),
  school_name TEXT,
  tag_id UUID REFERENCES tags(id),
  alias_name TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  course_type TEXT,
  detail TEXT NOT NULL,
  image_url TEXT,
  svg_icon TEXT,
  video_url TEXT,
  duration INTEGER,
  duration_in TEXT,
  order_by INTEGER DEFAULT 0,
  top_image_url TEXT,
  bottom_image_url TEXT,
  background_image_url TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  svg_icon TEXT,
  order_by INTEGER DEFAULT 0,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  question_type TEXT,
  correct_answer UUID, -- Will reference questions_has_options.id
  points INTEGER,
  explanation TEXT,
  order_by INTEGER DEFAULT 0,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create questions_has_options table
CREATE TABLE questions_has_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_image_url TEXT,
  order_by INTEGER DEFAULT 0,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add foreign key constraint for correct_answer after questions_has_options is created
ALTER TABLE questions ADD CONSTRAINT fk_questions_correct_answer 
  FOREIGN KEY (correct_answer) REFERENCES questions_has_options(id);

-- Create user_responses table
CREATE TABLE user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES questions_has_options(id) ON DELETE CASCADE,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create user_lessons_response table
CREATE TABLE user_lessons_response (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  total_questions INTEGER DEFAULT 0,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create user_course_response table
CREATE TABLE user_course_response (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create course_tags table
CREATE TABLE course_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id),
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_id UUID REFERENCES permissions(id),
  user_type_id UUID REFERENCES user_types(id),
  is_erased BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_tag_id ON profiles(tag_id);
CREATE INDEX idx_profiles_user_type_id ON profiles(user_type_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_questions_course_id ON questions(course_id);
CREATE INDEX idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX idx_questions_has_options_question_id ON questions_has_options(question_id);
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_user_responses_question_id ON user_responses(question_id);
CREATE INDEX idx_user_lessons_response_user_id ON user_lessons_response(user_id);
CREATE INDEX idx_user_lessons_response_lesson_id ON user_lessons_response(lesson_id);
CREATE INDEX idx_user_course_response_user_id ON user_course_response(user_id);
CREATE INDEX idx_user_course_response_course_id ON user_course_response(course_id);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tag_types_slug ON tag_types(slug);
CREATE INDEX idx_user_types_slug ON user_types(slug);

-- Add unique constraints where needed
ALTER TABLE user_lessons_response ADD CONSTRAINT unique_user_lesson UNIQUE(user_id, lesson_id);
ALTER TABLE user_course_response ADD CONSTRAINT unique_user_course UNIQUE(user_id, course_id);
ALTER TABLE user_responses ADD CONSTRAINT unique_user_question UNIQUE(user_id, question_id);
