# How to Tag Law Student Photos

## Summary

The photos on http://localhost:3001/stories come from the `gallery_media` table in Supabase. Currently there are **96 photos** with these categories:
- `story-photos` (57 photos) - linked to specific stories
- `gallery` (39 photos) - general gallery photos

To add law student photos to the blog post, you need to:
1. Identify which existing photos are from the law students trip
2. Tag them with the category `"law-students"`
3. Then they can be easily filtered and added to the blog post

## Step-by-Step Instructions

### Step 1: View All Photos

The easiest way to identify law student photos is to look at them on the website:

1. Go to http://localhost:3001/stories
2. Look through the photo gallery
3. Identify which photos are from the law students trip

### Step 2: Get Photo IDs

Run this command to see a list of all photos with their IDs:

```bash
VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs \
npx tsx list-all-gallery-photos.ts
```

Look for photos with titles like `IMG_XXXX` (numbers 58-96 in the list). These are likely candidates for law student photos.

### Step 3: Edit the Tagging Script

Open `tag-law-student-photos.ts` and add the photo IDs to the array:

```typescript
const LAW_STUDENT_PHOTO_IDS = [
  'e631f22d-fd12-406e-a5a8-4c6a5f762aee',  // IMG_2994
  'adf68cf5-8dfa-4ac0-a946-c545717fdd57',  // IMG_3014
  // Add more IDs here based on which photos are from law students trip
];
```

### Step 4: Run the Tagging Script

```bash
VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k \
npx tsx tag-law-student-photos.ts
```

This will:
- Update the `category` field to `"law-students"` for each photo
- Update titles from "IMG_XXXX" to "Law Students at Atnarpa - IMG_XXXX"

### Step 5: Verify the Tags

After tagging, you can verify by running:

```bash
VITE_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs \
npx tsx list-all-gallery-photos.ts
```

Look for the new "law-students" category in the output.

## Next Steps: Adding Photos to the Blog Post

Once photos are tagged as `"law-students"`, we can:

1. Create a script to fetch all law student photos from the database
2. Update the blog post content to replace the `#LAW_STUDENT_PHOTO_X` placeholders with actual photo URLs
3. The blog post will then display the real photos instead of placeholders

Let me know when you've identified which photos are from the law students trip, and I'll help with the next steps!

## Alternative: Upload New Photos

If the law student photos aren't in the gallery yet, you can:

1. Go to http://localhost:3001/stories
2. Click the "Upload Photos" button
3. Select the law student photos from your computer
4. They will be uploaded to Supabase Storage and added to the gallery_media table
5. Then follow the steps above to tag them as "law-students"
