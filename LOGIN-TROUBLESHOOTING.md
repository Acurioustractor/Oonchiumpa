# Login Troubleshooting Guide

## ✅ Good News: Your Test Account Works!

The test account **test@oonchiumpa.org** exists and you successfully logged in at **4:20 PM today**!

If you're seeing "Authentication failed" now, here's how to fix it:

---

## 🔐 Correct Test Credentials

**Copy these exactly (including capitalization):**

```
Email:    test@oonchiumpa.org
Password: OonchiumpaTest2024!
```

### Password Details
- First letter: Capital `O` (not zero)
- Last character: `!` (exclamation mark)
- Full password: `OonchiumpaTest2024!`

---

## 🐛 Common Issues

### 1. Extra Spaces
**Problem:** Copying/pasting adds spaces
**Solution:**
- Type the password manually instead of pasting
- Or paste into a text editor first to check for spaces

### 2. Wrong Case
**Problem:** Password is case-sensitive
**Solution:**
- Capital O: `Oonchiumpa` (not `oonchiumpa`)
- Capital T: `Test` (not `test`)
- Full: `OonchiumpaTest2024!`

### 3. Wrong Email
**Problem:** Missing or wrong domain
**Solution:**
- Use: `test@oonchiumpa.org`
- NOT: `test@oonchiumpa.com`
- NOT: `test@oonchiumpa`

### 4. Browser AutoFill
**Problem:** Browser filling wrong password
**Solution:**
- Clear the email/password fields
- Type manually
- Or disable autocomplete temporarily

---

## 🔄 Password Reset (If Needed)

If you want to set your own password:

### Option 1: Via Supabase Dashboard

1. **Go to Supabase:**
   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users

2. **Find the user:**
   - Search for: `test@oonchiumpa.org`
   - Or scroll through the list

3. **Click the user** to open details

4. **Set new password:**
   - Look for "Password" section
   - Enter new password
   - Click "Update User"

5. **Test login** with new password

### Option 2: Send Recovery Email

1. Go to login page: https://www.fromthecentre.com/login
2. Click "Forgot Password?" (if available)
3. Enter: test@oonchiumpa.org
4. Check email for reset link

---

## ✅ Step-by-Step Login Test

Let's test systematically:

### Step 1: Open Fresh Browser Tab
- Open an incognito/private window
- Or clear browser cache
- This prevents autocomplete issues

### Step 2: Go to Login
```
https://www.fromthecentre.com/login
```

### Step 3: Enter Email (Copy This Exactly)
```
test@oonchiumpa.org
```

### Step 4: Enter Password (Type This Manually)
```
OonchiumpaTest2024!
```

**Character by character:**
- `O` (capital letter O)
- `o` (lowercase)
- `n` (lowercase)
- `c` (lowercase)
- `h` (lowercase)
- `i` (lowercase)
- `u` (lowercase)
- `m` (lowercase)
- `p` (lowercase)
- `a` (lowercase)
- `T` (capital letter T)
- `e` (lowercase)
- `s` (lowercase)
- `t` (lowercase)
- `2` (number two)
- `0` (number zero)
- `2` (number two)
- `4` (number four)
- `!` (exclamation mark)

### Step 5: Click "Sign In"
- Don't press Enter
- Click the button with your mouse

---

## 🎯 Alternative: Use Existing Admin Account

If you know the password for either of these, use them instead:

### Primary Admin
```
Email: admin@oonchiumpa.org
Name: Kristy Bloomfield
```

### Secondary Admin
```
Email: benjamin@act.place
Name: Benjamin Knight
```

These accounts were created earlier and may have passwords you know.

---

## 🔍 Verify Test Account Details

I can see your test account in the database:

```
Email: test@oonchiumpa.org
User ID: d50c11ac-3003-4e07-951e-f7218be4b42a
Created: October 24, 2025
Status: ✅ Confirmed
Last Login: October 24, 2025 at 4:20 PM (successful!)
Role: admin
Name: Test Admin
```

**This means the account works!** You logged in successfully earlier today.

---

## 🆘 Still Having Issues?

### Quick Fixes to Try

1. **Clear browser cookies:**
   - Settings → Privacy → Clear browsing data
   - Select "Cookies and other site data"
   - Clear

2. **Try different browser:**
   - If using Chrome, try Firefox
   - Or use incognito/private mode

3. **Check Caps Lock:**
   - Make sure Caps Lock is OFF
   - Password is case-sensitive

4. **Type slowly:**
   - Type password character by character
   - Double-check each letter

5. **Copy from here:**
   ```
   OonchiumpaTest2024!
   ```
   - Select the password above
   - Copy it (Cmd+C or Ctrl+C)
   - Paste directly into password field

---

## 🔐 Create Your Own Test Account

If you want a simpler password:

### Option 1: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users
2. Click "Add User"
3. Enter:
   ```
   Email: mytest@oonchiumpa.org
   Password: [your choice - something simple]
   Auto Confirm: ✅ Yes
   ```
4. Click "User Metadata" and add:
   ```json
   {
     "role": "admin",
     "full_name": "My Test"
   }
   ```
5. Click "Create User"

Now you have credentials you chose yourself!

---

## 📞 Getting Help

### Check Supabase Authentication Logs

1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users
2. Click "Logs" tab
3. See recent login attempts
4. Look for error messages

### Check Browser Console

1. Open login page
2. Press F12 (or Cmd+Option+I on Mac)
3. Click "Console" tab
4. Try logging in
5. Look for error messages

Common errors:
- `Invalid login credentials` = Wrong email or password
- `Email not confirmed` = Need to confirm email
- `Network error` = Check internet connection

---

## ✅ Success Checklist

Once you successfully login, you should see:

- [ ] Redirected to Staff Portal or Homepage
- [ ] Profile icon appears (top-right)
- [ ] Profile icon shows "TA" (Test Admin initials)
- [ ] Clicking profile shows dropdown menu
- [ ] Dropdown shows "Test Admin" name
- [ ] Dropdown shows "test@oonchiumpa.org" email
- [ ] Dropdown has "⚙️ Admin Dashboard" option
- [ ] Clicking Admin Dashboard opens CMS

---

## 💡 Bottom Line

**The test account definitely works** - you logged in at 4:20 PM today!

**Most likely issue:** Typo in password when trying again

**Solution:** Copy this password exactly:
```
OonchiumpaTest2024!
```

**Or:** Reset password to something simpler in Supabase Dashboard.

**Need to try a different account?** Use:
- `admin@oonchiumpa.org` (if you know password)
- `benjamin@act.place` (if you know password)

You're very close - it's probably just a small typo! 🎯
