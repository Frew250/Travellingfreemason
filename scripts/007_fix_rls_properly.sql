-- Drop the problematic insert policy that queries auth.users
DROP POLICY IF EXISTS "members_insert_own" ON public.member_profiles;

-- Create a simple policy that allows authenticated users to insert their own profile
-- auth.uid() is available immediately after signUp
CREATE POLICY "members_insert_own" ON public.member_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
