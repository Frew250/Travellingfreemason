-- Verify the first pending user for testing purposes
UPDATE public.member_profiles
SET 
  status = 'VERIFIED',
  verified_at = NOW(),
  admin_note = 'Verified for testing'
WHERE status = 'PENDING'
LIMIT 1;

-- Return the verified profile ID so you can access /credentials/[id]
SELECT id, full_name, status FROM public.member_profiles WHERE status = 'VERIFIED';
