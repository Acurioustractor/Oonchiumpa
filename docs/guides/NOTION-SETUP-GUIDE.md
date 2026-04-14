# Notion → Supabase Integration Setup Guide

## 🎯 What This Does

**Write blogs in Notion → Auto-syncs to your website with:**
- ✅ Images downloaded to Supabase Storage (you own them!)
- ✅ Videos extracted to unified video gallery
- ✅ All media organized and searchable
- ✅ No manual database editing needed

---

## 📋 Step 1: Run the Database Schema

**Go to:** https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql

**Run this file:** `create-video-gallery-schema.sql`

This creates the `videos` table for your video gallery.

---

## 📝 Step 2: Set Up Notion Database

### A. Create Notion Integration

1. Go to: https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name: "Oonchiumpa Blog Sync"
4. Select your workspace
5. Click "Submit"
6. **Copy the "Internal Integration Token"** - you'll need this!

### B. Create Blog Database in Notion

1. In Notion, create a new database (full page)
2. Name it: "Oonchiumpa Blog Posts"

3. Add these properties:
   - **Title** (Title) - Already exists
   - **Status** (Status) - Add options: "Draft", "Published"
   - **Tags** (Multi-select) - Add tags like: Atnarpa, Community, Culture
   - **Author** (Text) - Default: "Oonchiumpa Community"

4. **Share database with your integration:**
   - Click "..." menu → Add connections
   - Select "Oonchiumpa Blog Sync"

5. **Get Database ID:**
   - Open database as full page
   - Copy ID from URL: `notion.so/YOUR_DATABASE_ID?v=...`
   - The DATABASE_ID is the 32-character string

---

## ⚙️ Step 3: Install Dependencies

```bash
cd /Users/benknight/Code/Oochiumpa
npm install @notionhq/client node-fetch
```

---

## 🔑 Step 4: Set Environment Variables

Create `.env` file in the root:

```bash
NOTION_API_KEY=secret_xxx... # Your integration token from Step 2A
NOTION_DATABASE_ID=xxx...     # Your database ID from Step 2B
```

Or set temporarily:

```bash
export NOTION_API_KEY=secret_xxx...
export NOTION_DATABASE_ID=xxx...
```

---

## ✍️ Step 5: Write Your First Notion Blog Post

1. Open your Notion database
2. Click "+ New" to create a post
3. Fill in:
   - **Title**: "Our Homestead, Our Story"
   - **Status**: Published
   - **Tags**: Atnarpa, Community
   - **Author**: Oonchiumpa Community

4. Write content in the page:

```
## Meeting the Right People

About eighteen months ago, Tanya Turner and I sat down with these two blokes...

[Add your images by typing /image and pasting URL or uploading file]

[Add videos by pasting YouTube URL]

## The Homestead at Loves Creek

Our family's station sits 140 kilometers east of Alice Springs...

[More content...]
```

5. Add images:
   - Type `/image`
   - Upload file OR paste URL
   - Notion will host it

6. Add videos:
   - Just paste YouTube URL: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Or embed with: `/embed` → YouTube URL

7. Set **Status** to "Published"

---

## 🚀 Step 6: Run the Sync

```bash
npx tsx notion-to-supabase-sync.ts
```

**What happens:**
1. ✅ Reads "Published" posts from Notion
2. ✅ Downloads ALL images from Notion
3. ✅ Uploads images to Supabase Storage (`media/blog/...`)
4. ✅ Replaces Notion image URLs with Supabase URLs
5. ✅ Extracts YouTube/Vimeo videos
6. ✅ Saves videos to `videos` table for gallery
7. ✅ Creates/updates blog post in Supabase
8. ✅ Blog appears on your website!

---

## 🎬 Step 7: View Your Content

**Blog post:**
http://localhost:3001/blog

**Video gallery (to be built):**
http://localhost:3001/videos

---

## 🔄 Future Workflow

### To Publish a New Blog:

1. **Write in Notion** (just like Google Docs)
   - Add images with `/image`
   - Paste YouTube URLs
   - Format with markdown-style headings

2. **Mark as Published** (change Status)

3. **Run sync:**
   ```bash
   npx tsx notion-to-supabase-sync.ts
   ```

4. **Done!** Blog appears on website with:
   - All images saved to your Supabase
   - Videos in unified gallery
   - Content formatted beautifully

---

## 📁 What Gets Saved Where

### Supabase Storage Structure:
```
media/
  blog/
    {notion-page-id}/
      image-1.jpg
      image-2.jpg
      image-3.jpg
```

### Supabase Tables:

**blog_posts:**
- Full blog content
- Images using Supabase URLs (not Notion URLs!)
- Excerpt, tags, author

**videos:**
- All YouTube/Vimeo links
- Linked to source blog post
- Thumbnail, embed code
- Can be displayed in unified gallery

**gallery_photos:**
- Individual photos extracted from blogs
- Tagged by service area
- Can sync to Empathy Ledger too

---

## 🎯 Advanced: Auto-Sync with Cron

Set up automatic syncing every hour:

```bash
# Add to crontab
0 * * * * cd /Users/benknight/Code/Oochiumpa && npx tsx notion-to-supabase-sync.ts
```

Or use GitHub Actions to sync when you push changes.

---

## 💡 Pro Tips

### For Images:
- **Upload directly to Notion** - sync will download and save to Supabase
- Use high-quality images - they'll be compressed appropriately
- Add alt text in Notion image captions

### For Videos:
- Use YouTube for hosting (free, unlimited)
- Just paste YouTube URL anywhere in content
- Sync will extract and add to video gallery
- Video thumbnails auto-generated

### For Organizing:
- Use **Tags** in Notion to categorize
- Tags sync to your blog system
- Can filter by tags later

---

## 🐛 Troubleshooting

**"Failed to download image"**
- Image might be private/expired
- Try re-uploading to Notion

**"Missing configuration"**
- Check .env file exists
- Verify NOTION_API_KEY and NOTION_DATABASE_ID

**"Access denied"**
- Make sure integration is connected to database
- Click "..." → Add connections → Select your integration

**Images not replacing URLs**
- Check Supabase storage bucket "media" exists
- Verify storage permissions

---

## 📞 Next Steps

1. **Run the schema** - Creates videos table
2. **Set up Notion** - 10 minutes
3. **Write first post** - Use your Atnarpa content
4. **Run sync** - Watch magic happen!
5. **Build video gallery page** - I'll create this next

Ready to set this up? Let me know if you need help with any step!
