# Law Student Photos - Setup Guide

## 📸 Good News!

You already have a gallery set up for law students:
- **Gallery Name**: "Law Students Event 2025"
- **Gallery ID**: `92a1acc3-1ce1-44ce-9773-8f7e78268f4c`
- **Current Photo Count**: 0 (needs photos added)

## 📊 Photo Gallery Structure

Your Supabase setup has:
- **Table**: `photo_galleries` (stores gallery information)
- **Table**: `gallery_photos` (stores individual photos linked to galleries)

### Schema:
```
gallery_photos:
  - id
  - gallery_id (links to photo_galleries)
  - photo_url (the actual image URL)
  - caption
  - photographer
  - order_index
  - uploaded_by
  - created_at
```

## 🎯 How to Add Law Student Photos

### Option 1: Add Photos via Your Site's Gallery Upload Page

1. Navigate to your site's gallery/media manager page (likely `/gallery/upload` or `/media`)
2. Select the "Law Students Event 2025" gallery
3. Upload your law student trip photos
4. Add captions and tags as you upload

### Option 2: Add Photos Directly to Supabase

I can create a script that adds photos if you have:
- Photo URLs (if already hosted somewhere)
- OR local file paths (to upload to Supabase storage)

### Option 3: Bulk Import Script

If you tell me where the photos are, I can create a script to:
1. Upload them to Supabase Storage
2. Add them to the gallery_photos table
3. Link them to the Law Students gallery
4. Tag them appropriately

## 📝 To Update the Blog Post with Photos

Once photos are in the gallery, run this command to get their URLs:

\`\`\`bash
npx tsx get-law-student-photo-urls.ts
\`\`\`

Then update the blog post placeholders with the actual URLs.

## 🚀 Quick Setup Script

Tell me:
1. **Where are your law student photos?**
   - In a folder on your computer? (provide path)
   - Already on a website? (provide URLs)
   - In Dropbox/Google Drive? (provide link)

2. **How many photos do you want to add to the blog?**
   - I suggest 8-12 photos strategically placed

3. **Do you want me to create an upload script?**
   - I can create a script that uploads photos to Supabase Storage and adds them to the gallery

## 🎥 Video Links Format

For the 3 video links in the blog, replace these in the database:

\`\`\`
YOUR_CHELSEA_VIDEO_LINK_HERE → https://share.descript.com/view/YOUR-CHELSEA-ID
YOUR_SUZIE_VIDEO_LINK_HERE → https://share.descript.com/view/YOUR-SUZIE-ID
YOUR_ADELAIDE_VIDEO_LINK_HERE → https://share.descript.com/view/YOUR-ADELAIDE-ID
\`\`\`

The Descript links will show as clickable links that open the videos in a new tab.
