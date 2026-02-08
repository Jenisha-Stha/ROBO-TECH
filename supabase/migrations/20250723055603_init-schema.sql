-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'guest');

-- user_types
CREATE TABLE user_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  user_type_id UUID REFERENCES user_types(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  image TEXT,
  svg_icon TEXT,
  video TEXT,
  duration INTEGER,
  duration_in TEXT,
  is_erased BOOLEAN DEFAULT FALSE,
  course_type TEXT,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  question_text TEXT NOT NULL,
  question_image TEXT,
  correct_answer TEXT,
  options JSONB,
  points INTEGER,
  explanation TEXT,
  question_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- tag_types
CREATE TABLE tag_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  tagtype_id UUID REFERENCES tag_types(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- course_tags
CREATE TABLE course_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id),
  created_at TIMESTAMP DEFAULT now()
);

-- permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- role_permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_id UUID REFERENCES permissions(id),
  user_type_id UUID REFERENCES user_types(id),
  created_at TIMESTAMP DEFAULT now()
);

-- RPC Functions
CREATE FUNCTION get_user_permissions(_user_id UUID)
RETURNS TABLE(permission_slug TEXT)
LANGUAGE sql STABLE
AS $$
  SELECT p.slug AS permission_slug
  FROM role_permissions rp
  JOIN permissions p ON p.id = rp.permission_id
  JOIN profiles prof ON prof.user_type_id = rp.user_type_id
  WHERE prof.id = _user_id;
$$;

CREATE FUNCTION has_permission(_user_id UUID, _permission_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM get_user_permissions(_user_id)
    WHERE permission_slug = _permission_slug
  );
$$;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow course owner"
ON courses FOR ALL
USING (created_by = auth.uid());

-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
