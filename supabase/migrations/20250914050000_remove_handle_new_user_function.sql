-- Remove the handle_new_user function and trigger completely
-- This migration disables and deletes the automatic profile creation

-- First, drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Optional: If you want to clean up any orphaned profiles that might have been created
-- by this function, you can uncomment the following line:
-- DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);
