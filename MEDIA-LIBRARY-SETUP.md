# Media Library Setup Instructions

The Media Library upload interface is **already built** in the codebase! The components exist and are ready to use:

- ✅ `MediaUpload.tsx` - Full drag-and-drop upload UI with metadata forms
- ✅ `MediaGallery.tsx` - Photo/video gallery display
- ✅ `MediaManagerPage.tsx` - Complete admin interface with tabs
- ✅ `mediaService.ts` - Upload/download/delete functionality
- ✅ Storage bucket "media" - Already created in Supabase

## What's Missing

Only **one thing** needs to be set up: the `media_files` database table.

## Setup Steps

### Step 1: Create the media_files Table

Go to the Supabase SQL Editor and run the SQL:

**URL:** https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new

**SQL to run:** Copy the entire contents of `create-media-tables.sql`

This will create:
- `media_files` table with all columns
- Row Level Security policies
- Indexes for performance
- Triggers for updated_at

### Step 2: Verify Setup

After running the SQL, verify the table was created:

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

### Step 3: Test Upload

Once the table exists, go to the admin dashboard:

1. Login to admin dashboard
2. Navigate to Media Management section
3. Click "Upload New" tab
4. Try uploading a test image
5. Add metadata (title, description, tags, cultural sensitivity)
6. Click "Upload"

The file should:
- Upload to Supabase Storage (`media` bucket)
- Create a record in `media_files` table
- Show upload progress
- Appear in the "All Media" gallery

## Media Library Features

### Upload Interface
- **Drag & drop** or click to select files
- **Multiple file upload** (up to 20 files at once)
- **File type validation** (images, videos, audio)
- **Size limit:** 50MB per file
- **Metadata form:**
  - Title
  - Description
  - Cultural sensitivity level (public/community/private/sacred)
  - Tags (with suggested tags)
- **Upload progress bars** with status indicators

### Gallery Display
- **Categories:**
  - All Media
  - Team Photos
  - Story Media
  - Service Photos
- **Grid layout** with thumbnails
- **Fullscreen viewing**
  - Metadata display
- **Filtering** by category, tags, cultural sensitivity

### Cultural Sensitivity Levels
- 🌐 **Public** - Open for all to see
- 👥 **Community** - Oonchiumpa community only
- 🔒 **Private** - Internal team use only
- 🛡️ **Sacred** - Elder approval required

### Service Photo Integration
Photos can be tagged with service names to automatically appear on service detail pages:
- `youth-mentorship`
- `true-justice`
- `atnarpa-homestead`
- `cultural-brokerage`

## Database Schema

The `media_files` table stores:

```typescript
{
  id: uuid                    // Auto-generated
  title: string               // File title
  description: string         // Optional description
  type: 'image' | 'video' | 'audio' | 'document'
  category: 'story-media' | 'team-photos' | 'service-photos' | ...
  url: string                 // Supabase storage public URL
  thumbnail_url: string       // Auto-generated thumbnail
  file_size: number           // Bytes
  duration: number            // For videos/audio (seconds)
  dimensions: {width, height} // For images/videos
  tags: string[]              // Searchable tags
  created_by: string          // User who uploaded
  storyteller_id: uuid        // Optional link to storyteller
  story_id: uuid              // Optional link to story
  cultural_sensitivity: enum  // Access level
  elder_approved: boolean     // Approval status
  project_id: uuid            // Multi-tenancy support
  created_at: timestamp
  updated_at: timestamp
}
```

## Storage Structure

Files are organized in the `media` bucket by category:

```
media/
├── oonchiumpa/
│   ├── story-media/
│   │   └── 1234567890-abc123.jpg
│   ├── team-photos/
│   │   └── 1234567891-def456.jpg
│   ├── service-photos/
│   │   └── 1234567892-ghi789.jpg
│   └── ...
```

## Next Steps After Setup

1. **Upload team photos** - Replace placeholder avatars
2. **Upload service images** - Add photos to service detail pages
3. **Tag existing photos** - Add tags for easy filtering
4. **Set cultural sensitivity** - Review and set appropriate levels
5. **Get Elder approval** - Mark approved media

## Current Status

- ✅ MediaUpload component built
- ✅ MediaGallery component built
- ✅ MediaManagerPage integrated
- ✅ mediaService with full CRUD operations
- ✅ Storage bucket "media" created (50MB limit, public access)
- ⏳ **media_files table** - Needs to be created manually
- ⏳ Testing upload functionality
- ⏳ Uploading sample media

## Troubleshooting

### "Table 'media_files' not found"
Run the SQL in `create-media-tables.sql` in Supabase SQL Editor.

### Upload fails with storage error
Check that the "media" bucket exists and is public in Supabase Dashboard → Storage.

### Row Level Security blocks access
Make sure you're logged in as an authenticated user. RLS policies allow:
- Anyone can read public/community media
- Authenticated users can upload and manage media

### Files upload but don't appear in gallery
Check MediaGallery filters - you may need to select the right category or adjust cultural sensitivity filters.
