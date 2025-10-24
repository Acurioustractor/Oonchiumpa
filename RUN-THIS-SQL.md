# Quick Setup: Create media_files Table

## Step 1: Open Supabase SQL Editor

Click this link:
**https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new**

## Step 2: Copy the SQL

Open the file `create-media-tables.sql` in this directory and copy ALL the contents.

## Step 3: Paste and Run

1. Paste the SQL into the Supabase SQL Editor
2. Click the "Run" button (or press Cmd/Ctrl + Enter)
3. Wait for "Success" message

## Step 4: Verify

Run this command in your terminal:

```bash
VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs \
npx tsx check-media-files-table.ts
```

You should see:
```
✅ media_files table exists!
✅ "media" storage bucket is accessible
```

## Step 5: Test Upload

1. Run dev server: `cd oonchiumpa-app && npm run dev`
2. Go to Admin Dashboard
3. Click "CMS" tab
4. Click "Media Library" sub-tab
5. You should see stats (even if 0 files)
6. Click "Upload" button
7. Try uploading a test image

Done! 🎉

---

## What This Creates

The SQL creates:
- `media_files` table with 18 columns
- Row Level Security policies
- 7 database indexes
- Auto-update trigger for `updated_at`

## Troubleshooting

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase project
- Check you have admin/owner permissions

**Error: "relation already exists"**
- The table is already created, you're good to go!
- Run the verification command above

**Table created but upload fails**
- Check storage bucket "media" exists in Supabase Dashboard → Storage
- Verify bucket is public
- Check file size is under 50MB

Need help? See `MEDIA-LIBRARY-SETUP.md` for detailed troubleshooting.
