-- Verify the first pending member profile for testing
-- This uses a subquery since PostgreSQL UPDATE doesn't support LIMIT directly

UPDATE public.member_profiles
SET 
  status = 'VERIFIED',
  verified_at = NOW(),
  dues_paid_through = '2026-12-31'
WHERE user_id = (
  SELECT user_id FROM public.member_profiles 
  WHERE status = 'PENDING' 
  ORDER BY created_at ASC 
  LIMIT 1
)
RETURNING user_id, full_name, status;
