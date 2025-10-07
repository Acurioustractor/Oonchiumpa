# 📸 Photo Gallery Upload Guide

## Quick Start - Upload Your Photos

### Step 1: Prepare Your Photos
Put all your photos in a folder, for example:
```
/Users/benknight/Desktop/oonchiumpa-photos/
```

### Step 2: Create the Supabase Bucket
1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Name: `gallery-photos`
4. **Public**: ✅ Yes
5. Add **SELECT** and **INSERT** policies (same as you did for story-images)

### Step 3: Upload Photos
Run this command (replace with your folder path):
```bash
node upload-gallery-photos.js /Users/benknight/Desktop/oonchiumpa-photos community-events
```

**Categories you can use:**
- `general` (default)
- `community-events`
- `on-country`
- `cultural-activities`
- `youth-programs`
- `team`

---

## Add Story Photos to Gallery

To add the 57 story photos to the gallery:

```bash
node add-story-photos-to-gallery.js
```

This will list all the story photos (they're already in Supabase, just need to be shown in the Photos tab).

---

## How It Works

### Current Setup:
```
Stories Page
├── Stories Tab (23 stories)
│   └── 6 stories have photo galleries
├── Photos Tab (empty - needs setup)
└── Videos Tab (empty - needs setup)
```

### After Upload:
```
Stories Page
├── Stories Tab (23 stories)
│   └── 6 stories have photo galleries
├── Photos Tab (shows all gallery photos)
│   ├── Community events photos
│   ├── On-country photos
│   ├── Story photos (57 from stories)
│   └── Your new uploaded photos
└── Videos Tab (for future)
```

---

## Photo Storage Structure

### Supabase Storage Buckets:
1. **`story-images`** - Photos embedded in stories (57 photos)
   - Used by: Story detail pages
   - Format: `stories/{story-id}/{number}.png`

2. **`gallery-photos`** - General photo gallery (your new photos)
   - Used by: Photos tab on Stories page
   - Format: `{category}/{timestamp}-{filename}.jpg`

---

## Example Commands

### Upload photos from Desktop:
```bash
node upload-gallery-photos.js ~/Desktop/my-photos general
```

### Upload photos with category:
```bash
node upload-gallery-photos.js /path/to/photos on-country
```

### List all story photos:
```bash
node add-story-photos-to-gallery.js
```

---

## Next Steps (Optional)

Once photos are uploaded, you can:

1. **Update the Photos tab** to show them from `gallery-photos` bucket
2. **Add filtering** by category
3. **Add captions** to photos
4. **Create albums** or collections

---

## Quick Test

After uploading, check your photos:
1. Go to **Supabase Dashboard** → **Storage** → **gallery-photos**
2. You should see your photos organized by category
3. Click any photo to see its public URL

---

**Need help?** Just put your photos in a folder and run the upload script!
