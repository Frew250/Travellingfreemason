-- Add letter_of_introduction_url column to member_profiles table
ALTER TABLE member_profiles 
ADD COLUMN IF NOT EXISTS letter_of_introduction_url TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'member_profiles' 
AND column_name = 'letter_of_introduction_url';
