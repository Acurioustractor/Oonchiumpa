# Fix Environment Variables Issue

## Problem
The environment variables are set in Vercel but not being injected into the build.

## Solution: Set Env Vars via Vercel Dashboard

Since the CLI approach isn't working perfectly, let's set them via the dashboard:

### Step 1: Open Vercel Dashboard
Go to: https://vercel.com/benjamin-knights-projects/oonchiumpa-app/settings/environment-variables

### Step 2: Add These Variables

Click "Add" for each variable:

**Variable 1:**
```
Key:   VITE_SUPABASE_URL
Value: https://yvnuayzslukamizrlhwb.supabase.co
Environments: Production, Preview, Development (check all)
```

**Variable 2:**
```
Key:   VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs
Environments: Production, Preview, Development (check all)
```

**Variable 3:**
```
Key:   VITE_SUPABASE_PROJECT_ID
Value: 5b853f55-c01e-4f1d-9e16-b99290ee1a2c
Environments: Production, Preview, Development (check all)
```

### Step 3: Redeploy

After adding all three variables:
1. Go to Deployments tab
2. Find the latest deployment
3. Click "..." menu
4. Click "Redeploy"
5. Check "Use existing Build Cache" = NO (uncheck it!)
6. Click "Redeploy"

This forces a fresh build with the new environment variables.

---

## Alternative: Quick Fix via CLI

If you want me to do it, I can run this command:

```bash
# Remove old vars
vercel env rm VITE_SUPABASE_PROJECT_ID production -y
vercel env rm VITE_SUPABASE_URL production -y
vercel env rm VITE_SUPABASE_ANON_KEY production -y

# Add them back to all environments
vercel env add VITE_SUPABASE_PROJECT_ID
# Paste: 5b853f55-c01e-4f1d-9e16-b99290ee1a2c
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_URL
# Paste: https://yvnuayzslukamizrlhwb.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs
# Select: Production, Preview, Development
```

---

## Why This Happens

Vite environment variables work differently than regular Node.js apps:

1. **Build-time injection**: `VITE_*` variables are injected at BUILD time
2. **Not runtime**: They're not available at runtime, only during build
3. **Must be in all environments**: Need to be set for Production, Preview, AND Development
4. **Fresh build required**: Changing env vars requires a fresh build (no cache)

---

## Verification

After redeploying, check:

1. Go to: https://www.fromthecentre.com
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_SUPABASE_PROJECT_ID`
4. Should return: `"5b853f55-c01e-4f1d-9e16-b99290ee1a2c"`

If it returns `undefined`, the variables weren't injected correctly.

---

## Current Status

Environment variables ARE set in Vercel:
```
✅ VITE_SUPABASE_PROJECT_ID (Production only)
✅ VITE_SUPABASE_URL (Production only)
✅ VITE_SUPABASE_ANON_KEY (Production only)
```

But they need to be:
```
🎯 VITE_SUPABASE_PROJECT_ID (Production, Preview, Development)
🎯 VITE_SUPABASE_URL (Production, Preview, Development)
🎯 VITE_SUPABASE_ANON_KEY (Production, Preview, Development)
```

**This ensures they're available during build regardless of which environment triggers the build.**
