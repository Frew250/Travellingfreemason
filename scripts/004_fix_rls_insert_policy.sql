-- Drop the existing insert policy
DROP POLICY IF EXISTS "members_insert_own" ON public.member_profiles;

-- Create a new insert policy that allows authenticated users to insert their own profile
-- The user_id must match the authenticated user's ID
CREATE POLICY "members_insert_own" ON public.member_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also ensure the service role can insert (for server-side operations if needed)
-- Note: Service role bypasses RLS by default, so this is just for clarity
