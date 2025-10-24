# Login Timeout Fix - DEPLOYED ✅

## Problem
The login page was stalling/hanging indefinitely after clicking "Sign In". The console showed authentication starting but never completing or returning an error.

## Root Cause
The Supabase `signInWithPassword()` API call was hanging indefinitely without timing out, likely due to:
1. Missing explicit auth flow configuration (PKCE)
2. No timeout protection on the auth request
3. Default Supabase client settings not optimized for browser environment

## Solution Implemented

### 1. Added Proper Supabase Client Configuration
**File**: `oonchiumpa-app/src/config/supabase.ts`

Added explicit configuration options:
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,        // Automatically refresh expired tokens
    persistSession: true,           // Keep session in localStorage
    detectSessionInUrl: true,       // Handle OAuth redirects
    flowType: 'pkce',              // Use PKCE flow for better security
  },
  global: {
    headers: {
      'x-application-name': 'oonchiumpa-app',  // Better debugging
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});
```

### 2. Added 10-Second Timeout to Sign In
**File**: `oonchiumpa-app/src/services/authService.ts`

Wrapped the auth call with a timeout using `Promise.race()`:
```typescript
// Add timeout to prevent infinite hanging
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Authentication timeout - please try again')), 10000)
);

const authPromise = supabase.auth.signInWithPassword({
  email,
  password,
});

const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;
```

Now if Supabase doesn't respond within 10 seconds, users will see a clear error message instead of a frozen page.

## Testing Instructions

1. **Go to**: https://www.fromthecentre.com/login
2. **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)
3. **Open Developer Tools** (F12)
4. **Open Console tab**
5. **Enter credentials**:
   - Email: `test@oonchiumpa.org`
   - Password: `OonchiumpaTest2024!`
6. **Click "Sign In"**

## Expected Behavior

You should now see ONE of these outcomes:

### Success Path:
```
🔐 Starting sign in... { email: 'test@oonchiumpa.org' }
🔐 Supabase auth response: { hasUser: true, error: undefined }
🔐 Getting user profile...
🔐 User profile retrieved: { hasProfile: true }
```
Then redirected to admin dashboard.

### Timeout Path (if still hanging):
After 10 seconds, you'll see:
```
🔐 Sign in error: Authentication timeout - please try again
```
With an error message displayed on the login form.

### Wrong Password Path:
```
🔐 Starting sign in... { email: 'test@oonchiumpa.org' }
🔐 Supabase auth response: { hasUser: false, error: 'Invalid login credentials' }
🔐 Sign in error: Invalid login credentials
```

## Deployment Status

✅ **Committed**: Commit `8c1b523` - "fix: Add timeout and proper Supabase auth configuration"
✅ **Pushed**: To GitHub master branch
✅ **Deployed**: https://www.fromthecentre.com is live with the fix

## Next Steps If Still Not Working

If login still hangs even with the timeout:

1. **Check Network Tab** in browser DevTools:
   - Look for requests to `yvnuayzslukamizrlhwb.supabase.co`
   - Check if they're stuck in "pending" state
   - Note any CORS errors in red

2. **Verify Supabase Project Settings**:
   - Go to https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
   - Check "Authentication" → "URL Configuration"
   - Ensure `https://www.fromthecentre.com` is in allowed redirect URLs

3. **Try Incognito/Private Browser**:
   - Rules out cached service workers or old sessions

4. **Check Supabase API Status**:
   - Visit https://status.supabase.com
   - Verify no outages

## Files Changed

1. `oonchiumpa-app/src/config/supabase.ts` - Added client configuration
2. `oonchiumpa-app/src/services/authService.ts` - Added timeout protection

---

Generated: 2025-10-24
Status: DEPLOYED AND READY TO TEST
