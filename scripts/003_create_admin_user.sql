-- This script updates an existing user to be an admin
-- Replace 'admin@example.com' with the actual admin email

-- To make an existing user an admin, run:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@example.com';

-- Note: You'll need to first sign up the admin user through the app,
-- then run this query to grant them admin privileges.

-- Example for promoting a user:
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"')
-- WHERE email = 'your-admin-email@example.com';
