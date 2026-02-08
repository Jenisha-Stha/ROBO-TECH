-- Add RLS policies for profiles table
-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow users to insert their own profile (for new users)
CREATE POLICY "Allow users to insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
