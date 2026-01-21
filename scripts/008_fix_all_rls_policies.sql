-- Drop all existing policies on member_profiles
DROP POLICY IF EXISTS "members_select_own" ON public.member_profiles;
DROP POLICY IF EXISTS "members_update_own" ON public.member_profiles;
DROP POLICY IF EXISTS "members_insert_own" ON public.member_profiles;
DROP POLICY IF EXISTS "admins_select_all" ON public.member_profiles;
DROP POLICY IF EXISTS "admins_update_all" ON public.member_profiles;
DROP POLICY IF EXISTS "public_select_verified" ON public.member_profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON public.member_profiles;

-- Policy: Members can view their own profile
CREATE POLICY "members_select_own" ON public.member_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Members can update their own profile
CREATE POLICY "members_update_own" ON public.member_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Members can insert their own profile
CREATE POLICY "members_insert_own" ON public.member_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all profiles (using JWT claim instead of querying auth.users)
CREATE POLICY "admins_select_all" ON public.member_profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Admins can update all profiles (using JWT claim instead of querying auth.users)
CREATE POLICY "admins_update_all" ON public.member_profiles
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Public can view verified member profiles (for credentials page)
CREATE POLICY "public_select_verified" ON public.member_profiles
  FOR SELECT USING (status = 'VERIFIED');
