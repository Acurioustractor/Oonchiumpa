# User Management Guide

## Overview
Your authentication system is now fully functional! Users can log in at **https://www.fromthecentre.com/login**.

## User Roles

- **admin**: Full access - can manage all content, users, and settings
- **editor**: Can create and edit content, manage media
- **contributor**: Can create content but needs approval
- **elder**: Cultural authority, can approve sensitive content

## How to Create New Users

### Method 1: Via Supabase Dashboard (Recommended for Single Users)

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
2. Navigate to **Authentication** → **Users** (in left sidebar)
3. Click **"Add User"** button (top right)
4. Fill in the form:
   - **Email**: user@oonchiumpa.org
   - **Password**: Create a secure password
   - **Auto Confirm User**: ✅ Check this box
   - **User Metadata**: Click "Add field" and add:
     ```json
     {
       "role": "admin",
       "full_name": "John Smith"
     }
     ```
5. Click **"Create User"**
6. Share the email and password with the new user

**Available roles**: `admin`, `editor`, `contributor`, `elder`

### Method 2: Using the Bulk Creation Script (For Multiple Users)

1. **Edit the user list** in `create-users.ts`:
   ```typescript
   const usersToCreate = [
     {
       email: 'jane@oonchiumpa.org',
       password: 'TemporaryPassword123!',
       full_name: 'Jane Doe',
       role: 'editor'
     },
     {
       email: 'john@oonchiumpa.org',
       password: 'TemporaryPassword123!',
       full_name: 'John Smith',
       role: 'contributor'
     },
     // Add more users here
   ];
   ```

2. **Run the script**:
   ```bash
   VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
   npx tsx create-users.ts
   ```

3. **Share credentials** with new users and ask them to change their passwords

## Current Users

### Test Account
- **Email**: test@oonchiumpa.org
- **Password**: OonchiumpaTest2024!
- **Role**: admin
- **Purpose**: Testing and development

## Security Best Practices

1. **Strong Passwords**: Require at least 8 characters with mix of letters, numbers, and symbols
2. **Change Default Passwords**: Users should change their password on first login
3. **Limit Admin Access**: Only give admin role to trusted staff members
4. **Regular Audits**: Review user list periodically and deactivate unused accounts
5. **Email Verification**: Already enabled - users receive confirmation emails

## Password Reset

Users can reset their passwords:
1. Go to the login page
2. Click "Forgot Password?" (if you add this link)
3. OR manually via Supabase Dashboard → Authentication → Users → Click user → "Send Password Reset Email"

## Deactivating Users

To deactivate a user without deleting their account:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user
4. Click the **"..."** menu
5. Select **"Disable User"**

## Monitoring

View auth activity:
1. Supabase Dashboard → **Authentication** → **Users**
2. See last sign-in times
3. Check active sessions

## Next Steps

### Optional: Create a User Management Page

You can build an admin page to manage users directly in your app:
- View all users
- Create new users
- Reset passwords
- Change roles
- Deactivate accounts

This would use the Supabase Admin API (requires service role key, server-side only).

### Optional: Add Password Reset Flow

Add a "Forgot Password" link on the login page that:
1. Asks for email
2. Sends reset email via Supabase
3. User clicks link in email
4. Redirects to password reset page

## Troubleshooting

### User Can't Log In
1. Check if email is confirmed in Supabase Dashboard
2. Verify password is correct
3. Check user is not disabled
4. Look at browser console for errors

### "Authentication Failed" Error
- Password is incorrect
- User doesn't exist
- User is disabled

### Session Issues
- Sessions persist for 1 hour (3600 seconds)
- Auto-refresh is enabled
- Clear browser cookies if having issues

## Support

For technical issues with authentication:
1. Check browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Review this guide

---

**Current Status**: ✅ Authentication fully functional with Supabase
**Login URL**: https://www.fromthecentre.com/login
**Admin Dashboard**: https://www.fromthecentre.com/staff-portal
