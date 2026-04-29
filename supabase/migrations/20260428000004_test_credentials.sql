-- Create Test Users securely without hitting constraint errors
DO $$ 
BEGIN
    -- 1. Create Subscriber
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'subscriber@golfgive.com') THEN
        INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, email_confirmed_at)
        VALUES (gen_random_uuid(), 'subscriber@golfgive.com', '{"full_name": "Test Subscriber"}', now(), now());
    END IF;

    -- 2. Create Admin
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@golfgive.com') THEN
        INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, email_confirmed_at)
        VALUES (gen_random_uuid(), 'admin@golfgive.com', '{"full_name": "GolfGive Admin"}', now(), now());
    END IF;
END $$;

-- 3. The 'public.users' rows were automatically created by your existing database trigger.
-- We just need to promote the Admin user by updating their role.
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@golfgive.com';

-- Note: Because we inserted directly into the database without a password, 
-- you cannot "log in" with these accounts via the UI easily.
-- For UI testing, the easiest method is to Sign Up normally in the browser 
-- with your own email, then run this SQL to make yourself an admin:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
