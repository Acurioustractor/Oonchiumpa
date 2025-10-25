-- Fix RLS Infinite Recursion Issue for Users Table
-- The problem: Admin policies were checking the users table within the users table policies

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Create function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT raw_user_meta_data->>'role' = 'admin'
        FROM auth.users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- RLS Policy: Admins can view all users (using function to avoid recursion)
CREATE POLICY "Admins can view all users"
    ON public.users
    FOR SELECT
    USING (public.is_admin());

-- RLS Policy: Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Prevent users from changing their own role and permissions
        AND role = (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid())
    );

-- RLS Policy: Admins can update all users
CREATE POLICY "Admins can update all users"
    ON public.users
    FOR UPDATE
    USING (public.is_admin());

-- RLS Policy: Admins can insert new users
CREATE POLICY "Admins can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (public.is_admin());

-- RLS Policy: Admins can delete users
CREATE POLICY "Admins can delete users"
    ON public.users
    FOR DELETE
    USING (public.is_admin());

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies fixed - infinite recursion resolved!';
    RAISE NOTICE '✅ Using auth.users metadata to check admin status';
    RAISE NOTICE '✅ All policies recreated successfully';
END $$;
