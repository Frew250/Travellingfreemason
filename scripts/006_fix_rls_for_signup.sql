-- Drop the existing insert policy
DROP POLICY IF EXISTS "members_insert_own" ON public.member_profiles;

-- Create a more permissive insert policy
-- Allow inserts where:
-- 1. The authenticated user is inserting their own profile (auth.uid() = user_id)
-- 2. OR service role is being used (handled by Supabase automatically)
-- 3. OR user_id exists in auth.users (server-side validation)
CREATE POLICY "members_insert_own" ON public.member_profiles
  FOR INSERT 
  WITH CHECK (
    user_id IN (SELECT id FROM auth.users)
  );
