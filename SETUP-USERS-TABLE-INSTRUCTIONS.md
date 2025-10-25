# Users Table Setup Instructions

This guide will help you create the `users` table in Supabase to eliminate the 404 errors and enable proper user management.

## Option 1: Quick Setup via Supabase Dashboard (Recommended)

### Step 1: Access SQL Editor

1. Go to https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
2. Log in with your Supabase account
3. Click **SQL Editor** in the left sidebar
4. Click **New query** button

### Step 2: Execute the SQL

1. Open the file `create-users-table.sql` in this directory
2. Copy **all** the SQL content (Cmd+A, Cmd+C)
3. Paste into the Supabase SQL Editor
4. Click **RUN** button (or press Cmd+Enter)
5. Wait for confirmation message

### Step 3: Verify Success

You should see success messages like:
```
✅ Users table created successfully!
✅ Row Level Security policies enabled
✅ Automatic user creation trigger configured
✅ Login tracking enabled
✅ Test admin user migrated
```

### Step 4: Verify Table Exists

1. Click **Table Editor** in left sidebar
2. Look for `users` table in the list
3. Click on it to view the test admin user record

### Step 5: Test Authentication

1. Go to https://www.fromthecentre.com/login
2. Log in with test@oonchiumpa.org / OonchiumpaTest2024!
3. Open browser console (F12)
4. **No more 404 errors!** You should see user data loading from the users table

---

## Option 2: Command Line Setup (Advanced)

If you have the database connection string:

```bash
# Set environment variables
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.yvnuayzslukamizrlhwb.supabase.co:5432/postgres"

# Execute SQL file
psql $SUPABASE_DB_URL -f create-users-table.sql
```

---

## Option 3: TypeScript Script (If automated tools available)

```bash
# Set service role key
export VITE_SUPABASE_URL="https://yvnuayzslukamizrlhwb.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run setup script
npx tsx setup-users-table.ts
```

---

## What This Creates

### Users Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (matches Supabase Auth ID) |
| email | TEXT | User email (unique) |
| full_name | TEXT | Display name |
| role | TEXT | admin, editor, contributor, elder |
| permissions | TEXT[] | Array of permission strings |
| department | TEXT | User's department |
| position | TEXT | Job title |
| bio | TEXT | User biography |
| is_active | BOOLEAN | Account active status |
| is_verified | BOOLEAN | Email verified status |
| last_login_at | TIMESTAMPTZ | Last login timestamp |
| login_count | INTEGER | Number of logins |
| avatar_url | TEXT | Profile photo URL |
| preferences | JSONB | User settings/preferences |
| project_id | UUID | Multi-tenant project ID |
| created_at | TIMESTAMPTZ | Account creation date |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Security Features

✅ **Row Level Security (RLS) enabled**
- Users can view/edit their own profile
- Admins can view/edit all users
- Non-admins cannot access other users' data

✅ **Automatic Triggers**
- New auth users automatically create users table record
- Login tracking updates last_login_at and login_count
- Auto-update updated_at timestamp on changes

✅ **Permission System**
- Granular permissions array
- Role-based access control
- Default contributor permissions for new users

### Permissions Available

The system supports these permissions:
- `create_content` - Create stories and blog posts
- `manage_media` - Upload and organize media files
- `manage_users` - Create and manage user accounts
- `cultural_review` - Approve content for cultural sensitivity
- `edit_services` - Edit service pages and content
- `manage_partners` - Add/edit partner organizations

### Default Roles

**Admin** (test@oonchiumpa.org)
- All permissions
- Full system access
- User management

**Editor**
- create_content
- manage_media
- cultural_review

**Contributor**
- create_content
- manage_media (own content only)

**Elder**
- cultural_review
- View all content

---

## Verification Steps

After running the SQL, verify everything works:

### 1. Check Table Exists
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'users';
```

### 2. Check Test User Migrated
```sql
SELECT id, email, full_name, role, is_active
FROM public.users
WHERE email = 'test@oonchiumpa.org';
```

Should return:
- email: test@oonchiumpa.org
- full_name: Test Admin
- role: admin
- is_active: true

### 3. Check RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'users';
```

Should show 6 policies:
- Users can view own profile
- Users can update own profile
- Admins can view all users
- Admins can insert users
- Admins can update all users
- Admins can delete users

### 4. Check Triggers
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table IN ('users', 'users')
AND trigger_schema = 'public';
```

Should show:
- update_users_updated_at (on users table)
- on_auth_user_created (on auth.users table)
- on_auth_session_created (on auth.sessions table)

---

## Troubleshooting

### Error: "permission denied for table users"

**Solution**: Make sure you're using the service role key, not the anon key.

### Error: "relation 'users' already exists"

**Solution**: Table already exists! You can verify by checking Table Editor. If you want to recreate it, add `DROP TABLE IF EXISTS public.users CASCADE;` at the top of the SQL.

### Error: "trigger 'on_auth_user_created' already exists"

**Solution**: Triggers already exist. The SQL includes `DROP TRIGGER IF EXISTS` statements, so this shouldn't happen. If it does, the table is already set up.

### No test user after migration

**Solution**: Run this query manually:
```sql
INSERT INTO public.users (
    id, email, full_name, role, permissions, is_active, is_verified, project_id
)
SELECT
    id, email, 'Test Admin', 'admin',
    ARRAY['create_content', 'manage_media', 'manage_users', 'cultural_review']::TEXT[],
    true, true, '5b853f55-c01e-4f1d-9e16-b99290ee1a2c'::UUID
FROM auth.users
WHERE email = 'test@oonchiumpa.org'
ON CONFLICT (id) DO NOTHING;
```

### Still seeing 404 errors after setup

**Possible causes**:
1. SQL didn't execute successfully - Check Table Editor for users table
2. Test user not migrated - Run verification query above
3. RLS blocking access - Check that user is logged in
4. Browser cache - Hard refresh (Cmd+Shift+R)

---

## Next Steps After Setup

1. ✅ No more 404 errors in browser console
2. ✅ User profile data loads from users table
3. ✅ Login tracking works (last_login_at updates)
4. ✅ Admin can create new users via Admin panel

### Create Additional Users

Use the `create-users.ts` script:

```bash
VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-key \
npx tsx create-users.ts
```

Or create manually in Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add user"
3. Fill in email and password
4. Set user metadata with role and permissions
5. User record auto-creates in users table

---

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs → Postgres Logs
2. Verify service role key is correct
3. Check RLS policies are not blocking access
4. Contact Supabase support for database-level issues

---

**Created**: October 26, 2025
**Project**: Oonchiumpa Staff Portal
**Database**: yvnuayzslukamizrlhwb.supabase.co
