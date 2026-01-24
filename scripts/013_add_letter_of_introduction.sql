-- Add letter_of_introduction_url column to member_profiles table
ALTER TABLE member_profiles 
ADD COLUMN IF NOT EXISTS letter_of_introduction_url TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN member_profiles.letter_of_introduction_url IS 'URL to the uploaded Letter of Introduction document';
