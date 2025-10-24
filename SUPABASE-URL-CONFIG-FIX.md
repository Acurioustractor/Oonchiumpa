# Fix Supabase Authentication Timeout - URL Configuration

## Problem
Login is timing out after 10 seconds with error:
```
🔐 Sign in error: Error: Authentication timeout - please try again
```

The Supabase auth request is being sent but not getting a response.

## Most Likely Cause: Site URL Not Whitelisted

Supabase needs to know which URLs are allowed to authenticate. Your production site `https://www.fromthecentre.com` might not be configured in Supabase.

## How to Fix in Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
   - Log in if needed

2. **Navigate to Authentication Settings**:
   - Click **Authentication** in left sidebar
   - Click **URL Configuration** tab

3. **Add Your Site URL**:
   - **Site URL**: Set to `https://www.fromthecentre.com`
   - Click **Save**

4. **Add Redirect URLs**:
   - In **Redirect URLs** section, add:
     ```
     https://www.fromthecentre.com/*
     https://www.fromthecentre.com/login
     https://www.fromthecentre.com/admin/*
     ```
   - Click **Save**

5. **Additional URLs to Add** (for development):
   ```
   http://localhost:5173/*
   http://localhost:5173/login
   https://oonchiumpa-lws6hfu5j-benjamin-knights-projects.vercel.app/*
   https://oonchiumpa-*.vercel.app/*
   ```

## After Making Changes

1. **Wait 30 seconds** for Supabase to propagate the changes
2. **Hard refresh** the login page (Cmd+Shift+R)
3. **Try logging in again**

## Alternative: Check for CORS Issues

If the URL configuration doesn't fix it, check browser Network tab:

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Click **Sign In**
4. Look for request to `yvnuayzslukamizrlhwb.supabase.co`
5. Check:
   - Does it stay "pending" for 10 seconds?
   - Is there a CORS error in red?
   - What's the actual status code?

## Other Possible Causes

### 1. Supabase Project Paused
- Check https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
- Look for "Project Paused" warning
- Click "Resume Project" if needed

### 2. API Key Invalid
- In Supabase Dashboard → Settings → API
- Copy the **anon/public** key
- Compare with `.env.production`:
  ```
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- If different, update `.env.production` and redeploy

### 3. Network Firewall
- Try from different network (phone hotspot)
- Some corporate/school networks block Supabase

## Test Commands

Test Supabase connectivity from your machine:
```bash
# Test health endpoint
curl -I https://yvnuayzslukamizrlhwb.supabase.co/auth/v1/health

# Should return HTTP 401 or 200 (means it's reachable)
```

Test from browser console on the login page:
```javascript
// Run in browser console
fetch('https://yvnuayzslukamizrlhwb.supabase.co/auth/v1/health', {
  headers: {
    'apikey': 'YOUR_ANON_KEY_HERE'
  }
}).then(r => console.log('Status:', r.status))
```

---

**Next Step**: Please go to Supabase dashboard and add the site URLs, then try again!
