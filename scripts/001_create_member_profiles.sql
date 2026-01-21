-- Create member_profiles table for storing Mason member information
CREATE TABLE IF NOT EXISTS public.member_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  lodge_name TEXT NOT NULL,
  lodge_number TEXT NOT NULL,
  ritual_work_text TEXT NOT NULL,
  grand_lodge TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  dues_card_image_url TEXT,
  certificate_image_url TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Members can view their own profile
CREATE POLICY "members_select_own" ON public.member_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Members can update their own profile (but not status, verified_by, verified_at, admin_note)
CREATE POLICY "members_update_own" ON public.member_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Members can insert their own profile
CREATE POLICY "members_insert_own" ON public.member_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all profiles
CREATE POLICY "admins_select_all" ON public.member_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Admins can update all profiles (for verification)
CREATE POLICY "admins_update_all" ON public.member_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Public can view verified member profiles (for credentials page)
CREATE POLICY "public_select_verified" ON public.member_profiles
  FOR SELECT USING (status = 'VERIFIED');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_member_profiles_user_id ON public.member_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_profiles_status ON public.member_profiles(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_member_profiles_updated ON public.member_profiles;

CREATE TRIGGER on_member_profiles_updated
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
