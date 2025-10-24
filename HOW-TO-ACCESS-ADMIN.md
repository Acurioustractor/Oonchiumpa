# How to Access the Admin Dashboard

## Quick Answer

**Admin Dashboard URL:**
```
https://your-site.com/admin
```

Or if running locally:
```
http://localhost:5173/admin
```

## Step-by-Step Access

### Option 1: Direct URL
1. Open your browser
2. Go to: `https://your-site.com/admin` (or `/admin` from any page)
3. If not logged in, you'll be redirected to login page
4. Enter your credentials
5. You'll be taken to Admin Dashboard

### Option 2: Login First, Then Navigate
1. Go to: `https://your-site.com/login`
2. Enter your email and password
3. After login, you'll be redirected to Staff Portal
4. Click your profile icon (top right)
5. Click **"⚙️ Admin Dashboard"** in the dropdown menu

### Option 3: From Main Site (If Logged In)
1. If you're already logged in
2. Click your profile icon (top right of any page)
3. Click **"⚙️ Admin Dashboard"**
4. Opens the full Admin Dashboard

## Login Credentials

**For Development/Testing:**
- Email: (set up in Supabase)
- Password: (set up in Supabase)

**For Production:**
- Use your organization email
- Password set during account creation
- Contact admin if you forgot password

## What You'll See After Login

After successful login, the Admin Dashboard has these tabs:

1. **Overview** - Quick stats and recent activity
2. **Content CMS** - Manage all content:
   - Services
   - Team Members
   - Impact Stats
   - Testimonials
   - Partners
   - **Media Library** ← Upload photos here!
3. **Content Library** - Browse all stories and content
4. **Content Seeder** - Generate sample content
5. **AI System** - AI status and controls
6. **Cultural Review** - Review cultural sensitivity

## Accessing Media Library Specifically

**Fastest route to upload photos:**

1. Go to: `https://your-site.com/admin`
2. Login if needed
3. Click **"Content CMS"** tab (⚙️)
4. Click **"Media Library"** sub-tab (📸)
5. Click **"Upload"** button
6. Start uploading!

**Alternative direct URLs:**
- Admin: `/admin`
- Media Manager: `/media` (standalone media page)
- Staff Portal: `/staff-portal`

## Troubleshooting

### "Access Denied" or Redirected to Login
**Problem:** You're not logged in or session expired
**Solution:** Go to `/login` and log in again

### "You don't have permission to access this page"
**Problem:** Your account doesn't have admin role
**Solution:**
- Check with site administrator
- Your role may be "staff" instead of "admin"
- Staff can access `/staff-portal` but not `/admin`

### Can't Remember Login URL
**Bookmark these:**
- Login: `https://your-site.com/login`
- Admin: `https://your-site.com/admin`
- Staff Portal: `https://your-site.com/staff-portal`

### No Profile Icon Showing
**Problem:** Navigation bar doesn't show user menu
**Solution:**
- You may not be logged in
- Check if you see your name in top right
- Try logging out and back in
- Clear browser cookies/cache

### Lost Password
**For Supabase Authentication:**
1. Go to login page
2. Click "Forgot Password" (if implemented)
3. Or contact site administrator to reset

**Alternative:**
- Admin can reset password in Supabase Dashboard
- Go to: Authentication → Users → Find user → Reset password

## Setting Up Your First Admin Account

If no admin exists yet:

1. **Via Supabase Dashboard:**
   - Go to your Supabase project
   - Navigate to: Authentication → Users
   - Click "Invite User" or "Add User"
   - Enter email and temporary password
   - Set role to "admin" in user metadata

2. **Via Admin Setup Page:**
   - Go to: `https://your-site.com/admin-setup`
   - Follow setup wizard
   - Create first admin account

## User Roles Explained

### Admin
- **Access:** Everything
- **Can:** Manage CMS, upload media, edit all content, manage users
- **URL:** `/admin`

### Staff
- **Access:** Limited dashboard
- **Can:** View content, some content creation
- **URL:** `/staff-portal`

### Content Creator
- **Access:** Content tools only
- **Can:** Create and edit stories/content
- **URL:** `/content-generator`

### Public
- **Access:** Public pages only
- **Can:** View published content
- **URL:** `/` (homepage, about, services, etc.)

## Quick Reference

| What You Want | URL | Requires |
|---------------|-----|----------|
| Admin Dashboard | `/admin` | Admin role |
| Media Library | `/admin` → CMS → Media Library | Admin role |
| Staff Portal | `/staff-portal` | Staff/Admin |
| Content Generator | `/content-generator` | Content permission |
| Media Manager | `/media` | Media permission |
| Login Page | `/login` | - |

## Security Notes

### Keep Login Secure
- Don't share admin credentials
- Use strong passwords
- Log out when done (especially on shared computers)
- Change password regularly

### Session Timeout
- Sessions expire after inactivity
- You'll be redirected to login
- Just log in again to continue

### Role-Based Access
- URLs are protected by role
- Trying to access `/admin` without admin role = denied
- System checks permissions on every page load

## Browser Compatibility

Works best in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️  Older browsers may have issues

## Mobile Access

Admin dashboard works on mobile but:
- Better experience on tablet/desktop
- Upload photos easier on desktop
- Some features may be cramped on phone
- Recommend using desktop for admin tasks

## Next Steps After Login

Once you're in the admin dashboard:

1. **Explore the CMS tab** - See all content managers
2. **Try Media Library** - Upload a test photo
3. **Check Services** - Edit service descriptions
4. **Review Team** - Update team member profiles
5. **View Stats** - See impact statistics

## Common First Tasks

### Upload First Photo
1. Admin → CMS → Media Library → Upload
2. Follow [MEDIA-LIBRARY-USER-GUIDE.md](MEDIA-LIBRARY-USER-GUIDE.md)

### Edit Service Description
1. Admin → CMS → Services
2. Click edit on any service
3. Update description and save

### Add Team Member
1. Admin → CMS → Team Members
2. Click "Add New"
3. Fill in details and save

---

**Still can't access?**

Contact your site administrator or check:
- Is your account created in Supabase?
- Do you have the right role assigned?
- Is the site deployed and accessible?
- Are you using the correct URL?
