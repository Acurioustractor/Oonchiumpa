-- Create users table for Oonchiumpa staff management
-- This table extends Supabase Auth with additional user metadata

-- Drop table if exists (for clean slate)
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
    -- Primary key matching Supabase Auth user ID
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic Information
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,

    -- Role and Permissions
    role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('admin', 'editor', 'contributor', 'elder')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Organization Details
    department TEXT,
    position TEXT,
    bio TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,

    -- Activity Tracking
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,

    -- Metadata
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::JSONB,
    project_id UUID,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Create index on role for filtering
CREATE INDEX idx_users_role ON public.users(role);

-- Create index on is_active for filtering active users
CREATE INDEX idx_users_is_active ON public.users(is_active);

-- Create index on project_id for multi-tenant support
CREATE INDEX idx_users_project_id ON public.users(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- RLS Policy: Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.users WHERE id = auth.uid())
        AND permissions = (SELECT permissions FROM public.users WHERE id = auth.uid())
    );

-- RLS Policy: Admins can view all users
CREATE POLICY "Admins can view all users"
    ON public.users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND is_active = true
        )
    );

-- RLS Policy: Admins can insert new users
CREATE POLICY "Admins can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND is_active = true
        )
    );

-- RLS Policy: Admins can update all users
CREATE POLICY "Admins can update all users"
    ON public.users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND is_active = true
        )
    );

-- RLS Policy: Admins can delete users (soft delete recommended)
CREATE POLICY "Admins can delete users"
    ON public.users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND is_active = true
        )
    );

-- Create function to automatically create user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role, permissions, is_active, project_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'contributor'),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'permissions')),
            ARRAY[]::TEXT[]
        ),
        COALESCE((NEW.raw_user_meta_data->>'is_active')::BOOLEAN, true),
        COALESCE((NEW.raw_user_meta_data->>'project_id')::UUID, NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create user record on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET
        last_login_at = NOW(),
        login_count = login_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth sessions to track logins
DROP TRIGGER IF EXISTS on_auth_session_created ON auth.sessions;
CREATE TRIGGER on_auth_session_created
    AFTER INSERT ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_last_login();

-- Grant permissions
GRANT SELECT ON public.users TO authenticated;
GRANT INSERT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;
GRANT DELETE ON public.users TO authenticated;

-- Insert existing test admin user
-- This syncs the existing auth user with the new users table
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    permissions,
    is_active,
    is_verified,
    project_id,
    position,
    department
)
SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Test Admin'),
    COALESCE(raw_user_meta_data->>'role', 'admin'),
    ARRAY['create_content', 'manage_media', 'manage_users', 'cultural_review']::TEXT[],
    true,
    true,
    '5b853f55-c01e-4f1d-9e16-b99290ee1a2c'::UUID,
    'System Administrator',
    'Administration'
FROM auth.users
WHERE email = 'test@oonchiumpa.org'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active,
    is_verified = EXCLUDED.is_verified,
    project_id = EXCLUDED.project_id,
    position = EXCLUDED.position,
    department = EXCLUDED.department;

-- Create view for safe user display (no sensitive info)
CREATE OR REPLACE VIEW public.users_public AS
SELECT
    id,
    email,
    full_name,
    role,
    department,
    position,
    bio,
    avatar_url,
    is_active,
    created_at
FROM public.users
WHERE is_active = true;

-- Grant select on public view
GRANT SELECT ON public.users_public TO authenticated;
GRANT SELECT ON public.users_public TO anon;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'Extended user profiles for Oonchiumpa staff members';
COMMENT ON COLUMN public.users.id IS 'Primary key matching Supabase Auth user ID';
COMMENT ON COLUMN public.users.role IS 'User role: admin, editor, contributor, or elder';
COMMENT ON COLUMN public.users.permissions IS 'Array of permission strings for granular access control';
COMMENT ON COLUMN public.users.is_active IS 'Whether user account is active and can log in';
COMMENT ON COLUMN public.users.is_verified IS 'Whether user email has been verified';
COMMENT ON COLUMN public.users.project_id IS 'Project ID for multi-tenant support';

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Users table created successfully!';
    RAISE NOTICE '✅ Row Level Security policies enabled';
    RAISE NOTICE '✅ Automatic user creation trigger configured';
    RAISE NOTICE '✅ Login tracking enabled';
    RAISE NOTICE '✅ Test admin user migrated';
END $$;
