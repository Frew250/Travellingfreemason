-- Add dues_paid_through column if it doesn't exist
ALTER TABLE public.member_profiles 
ADD COLUMN IF NOT EXISTS dues_paid_through DATE;

-- Update the first member profile to VERIFIED status
UPDATE public.member_profiles
SET 
  status = 'VERIFIED',
  dues_paid_through = '2026-12-31',
  verified_at = NOW()
WHERE id = (
  SELECT id FROM public.member_profiles ORDER BY created_at ASC LIMIT 1
);

-- Return the verified profile ID and user_id
SELECT id, user_id, full_name, status, dues_paid_through FROM public.member_profiles WHERE status = 'VERIFIED';
