# 🗄️ Supabase Storage Setup for Story Images

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (Oonchiumpa)
3. **Navigate to Storage** (left sidebar)
4. **Click "New bucket"**
5. **Configure the bucket**:
   - Name: `story-images`
   - Public bucket: ✅ **Yes** (enable)
   - File size limit: 5 MB (or higher if needed)
   - Allowed MIME types: Leave empty (allow all images)
6. **Click "Create bucket"**

## Step 2: Set Storage Policies (Important!)

After creating the bucket, you need to add policies for public access:

1. **Click on the `story-images` bucket**
2. **Go to "Policies" tab**
3. **Click "New Policy"**
4. **Add these policies**:

### Policy 1: Public Read Access
```sql
-- Name: Public Read
-- Operation: SELECT
-- Policy definition:
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'story-images' );
```

### Policy 2: Authenticated Upload (Optional - for later admin features)
```sql
-- Name: Authenticated Upload
-- Operation: INSERT
-- Policy definition:
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'story-images' AND auth.role() = 'authenticated' );
```

### Policy 3: Service Role Full Access (For our script)
```sql
-- Name: Service Role
-- Operation: ALL
-- Policy definition:
CREATE POLICY "Service role has full access"
ON storage.objects FOR ALL
USING ( bucket_id = 'story-images' );
```

## Step 3: Update Environment Variables

You'll need a **Service Role Key** for uploading. Get it from:

1. **Project Settings** → **API** → **Project API keys**
2. Copy the `service_role` secret (not anon key!)
3. Add to your `.env` file:

```bash
# In oonchiumpa-app/.env
VITE_SUPABASE_SERVICE_KEY=your-service-role-key-here
```

⚠️ **Never commit this key to git!** It has full access to your database.

## Step 4: Ready to Upload!

Once the bucket is created and policies are set, run:

```bash
node upload-story-images.js
```

This will upload all 63 images and link them to the stories.

---

## Alternative: Quick Manual Setup (Recommended)

If you want to get started quickly:

1. Create bucket `story-images` as public
2. Use the Supabase Dashboard to upload a test image
3. If that works, the script should work too!

The script uses the **anon key** which should work if the bucket is public.

---

## Verification

After upload, you should see:
- ✅ 63 images in Supabase Storage
- ✅ Stories updated with `story_image_url` and `media_urls`
- ✅ Images displaying on website at `/stories`

---

**Status**: Waiting for bucket creation
**Next**: Run upload script
