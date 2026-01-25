-- Remove admin role from craigfrew4@gmail.com
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE email = 'craigfrew4@gmail.com';
