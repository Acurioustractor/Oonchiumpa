# Test Login Credentials

## 🔐 Existing Admin Users

You have **20 users** in Supabase. Here are the main admin accounts:

### Primary Admin Account
```
Email: admin@oonchiumpa.org
Role: Admin
Name: Kristy Bloomfield
Status: ✅ Confirmed
Created: October 1, 2025
```

### Secondary Admin Account
```
Email: benjamin@act.place
Role: Admin
Name: Benjamin Knight
Status: ✅ Confirmed
Last Login: September 15, 2025
```

### Super Admin Account
```
Email: admin@empathyledger.com
Role: Super Admin
Status: ✅ Confirmed
Last Login: September 7, 2025
```

## 🧪 Creating a Test User

If you need a fresh test account, I can create one. Here's how:

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users

2. **Click "Add User"**

3. **Fill in details:**
   ```
   Email: test@oonchiumpa.org
   Password: [Choose a password - write it down!]
   Auto Confirm: ✅ Yes (check this box)
   ```

4. **Set User Metadata (Important!):**
   Click "User Metadata" and add:
   ```json
   {
     "role": "admin",
     "full_name": "Test Admin"
   }
   ```

5. **Click "Create User"**

6. **Test Login:**
   - Go to: https://www.fromthecentre.com/login
   - Email: test@oonchiumpa.org
   - Password: [the one you chose]

### Option 2: Create via Script

I can create a script that adds a test user programmatically if you prefer.

## 🔑 Password Reset

If you don't know the password for any existing account:

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users

2. **Find the user** in the list

3. **Click the user** to open details

4. **Click "Send password recovery email"**
   - Or set a new password directly

## 🎯 Recommended Test Account Setup

For testing the Media Library and CMS, I recommend:

### Create: test@oonchiumpa.org

**Why this is good:**
- Easy to remember
- Clearly a test account
- Won't conflict with real staff

**Setup steps:**
1. Create in Supabase Dashboard (see Option 1 above)
2. Email: `test@oonchiumpa.org`
3. Password: Choose something simple like `Test123!` (write it down!)
4. Auto-confirm: Yes
5. User metadata: `{"role": "admin", "full_name": "Test Admin"}`

**Test it:**
```
URL: https://www.fromthecentre.com/login
Email: test@oonchiumpa.org
Password: Test123! (or whatever you chose)
```

## 📝 Full Test Workflow

Once you have credentials:

### 1. Login Test
- [ ] Go to https://www.fromthecentre.com
- [ ] See "Staff Login" button (top right)
- [ ] Click it
- [ ] Enter email and password
- [ ] Click "Sign In"

### 2. Access Admin
- [ ] After login, see profile icon with your initials
- [ ] Click profile icon
- [ ] See dropdown menu with name and email
- [ ] Click "⚙️ Admin Dashboard"

### 3. Test CMS Tabs
- [ ] Click "Content CMS" tab
- [ ] See 6 sub-tabs: Services, Team, Stats, Testimonials, Partners, Media Library
- [ ] Click each tab to verify it loads

### 4. Test Partners Manager
- [ ] Click CMS → Partners
- [ ] See 17 partners listed
- [ ] See stats: 6 Aboriginal, 5 Education, 6 Support
- [ ] Try editing a partner (click pencil icon)
- [ ] Make a change and save
- [ ] Check it appears on: https://www.fromthecentre.com/about

### 5. Test Media Library (After DB Setup)
- [ ] Click CMS → Media Library
- [ ] See Stats view with counts (initially 0)
- [ ] Click "Upload" button
- [ ] Try drag-and-drop a test image
- [ ] Fill in title, description, tags
- [ ] Choose cultural sensitivity level
- [ ] Click Upload
- [ ] Watch progress bar
- [ ] See photo in Gallery view

## 🚨 Troubleshooting

### "Invalid login credentials"
**Problem:** Email or password is wrong
**Solution:**
- Double-check email spelling
- Make sure password is correct (case-sensitive)
- Try password reset if you forgot it

### "User not found"
**Problem:** Email doesn't exist in Supabase
**Solution:**
- Check the email list above
- Create a new user in Supabase Dashboard
- Verify email is confirmed (check box when creating)

### Can login but "Access Denied" on /admin
**Problem:** User doesn't have admin role
**Solution:**
- Go to Supabase Dashboard → Auth → Users
- Click the user
- Edit User Metadata
- Add: `{"role": "admin"}`
- Save
- Log out and log back in

### Login works but profile menu doesn't show
**Problem:** Missing full_name in metadata
**Solution:**
- Go to Supabase Dashboard → Auth → Users
- Click the user
- Edit User Metadata
- Add: `{"role": "admin", "full_name": "Your Name"}`
- Save
- Refresh page

### Login redirects to wrong page
**Problem:** Role-based redirect logic
**Solution:**
- Admins go to /staff-portal after login
- Click profile icon → Admin Dashboard to access CMS
- Or go directly to /admin

## 🎓 Quick Reference

| What You Want | Use This Account |
|---------------|------------------|
| Test CMS | admin@oonchiumpa.org or benjamin@act.place |
| Upload photos | Any admin account |
| Test Partners | admin@oonchiumpa.org |
| Fresh testing | Create: test@oonchiumpa.org |

## 🔒 Security Notes

### For Production
- Change all default passwords
- Use strong passwords
- Don't share admin credentials
- Create individual accounts for each staff member
- Set appropriate roles (not everyone needs admin)

### For Development/Testing
- Test accounts are fine with simple passwords
- Mark test accounts clearly (e.g., test@...)
- Delete test accounts before going fully live
- Don't use test accounts for real data

## 💡 Need a Password?

If you need me to create a test account with a specific password, I can do that via script. Just let me know:
- Desired email
- Desired password
- Full name
- Role (admin, staff, etc.)

---

**Bottom Line:**

**Try these admin accounts first:**
1. `admin@oonchiumpa.org` (if you know the password)
2. `benjamin@act.place` (if you know the password)

**Or create a fresh test account:**
- Email: `test@oonchiumpa.org`
- Password: Your choice (e.g., `Test123!`)
- Setup in Supabase Dashboard (takes 2 minutes)

**Then test at:**
https://www.fromthecentre.com/login
