-- Add rank column to member_profiles table
ALTER TABLE public.member_profiles 
ADD COLUMN IF NOT EXISTS rank TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'member_profiles' AND column_name = 'rank';
