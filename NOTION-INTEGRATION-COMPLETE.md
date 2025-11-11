# 🎉 Notion Integration Complete!

## ✅ What Was Built

Your complete **Notion → Supabase** blogging system with automatic media management!

### 1. **📝 Write Blogs in Notion**
- Just like Google Docs
- Drag & drop images
- Paste YouTube videos
- No technical knowledge needed

### 2. **📸 Auto-Download Images**
- Images from Notion → Supabase Storage
- You own all your media!
- Organized in `media/blog/{page-id}/` folders
- Notion URLs replaced with Supabase URLs

### 3. **🎬 Auto-Extract Videos**
- YouTube/Vimeo links detected
- Saved to unified `videos` table
- Auto-generates:
  - Video thumbnails
  - Embed codes
  - Video IDs
- Linked to source blog post

### 4. **🖼️ Unified Galleries**
- Video gallery page at `/videos`
- All videos from all sources
- Filterable by tags
- Click to watch in modal

---

## 📁 Files Created

### Database Schema:
- **[create-video-gallery-schema.sql](create-video-gallery-schema.sql)**
  - Creates `videos` table
  - Auto-extracts YouTube IDs
  - Auto-generates embed codes
  - Links to source content

### Sync Script:
- **[notion-to-supabase-sync.ts](notion-to-supabase-sync.ts)**
  - Reads published posts from Notion
  - Downloads ALL images
  - Uploads to Supabase Storage
  - Extracts video links
  - Creates/updates blog posts
  - Saves videos to gallery

### UI Components:
- **[VideoGalleryPage.tsx](oonchiumpa-app/src/pages/VideoGalleryPage.tsx)**
  - Beautiful video grid
  - Tag filtering
  - Video modal player
  - Responsive design

### Documentation:
- **[NOTION-SETUP-GUIDE.md](NOTION-SETUP-GUIDE.md)** - Complete setup instructions
- **[BLOG-QUICK-START.md](BLOG-QUICK-START.md)** - Quick reference
- **[BLOG-MEDIA-GUIDE.md](BLOG-MEDIA-GUIDE.md)** - Media options

---

## 🚀 Quick Start

### Step 1: Run Database Schema
```bash
# Go to Supabase SQL Editor
# Run: create-video-gallery-schema.sql
```

### Step 2: Set Up Notion (10 minutes)
Follow: [NOTION-SETUP-GUIDE.md](NOTION-SETUP-GUIDE.md)

1. Create Notion integration
2. Create blog database
3. Add properties (Title, Status, Tags, Author)
4. Connect integration to database

### Step 3: Install Dependencies
```bash
npm install @notionhq/client node-fetch
```

### Step 4: Configure Environment
```bash
export NOTION_API_KEY=secret_xxx...
export NOTION_DATABASE_ID=xxx...
```

### Step 5: Write First Post in Notion
1. Create new page in database
2. Add images (upload or paste URL)
3. Paste YouTube videos
4. Set Status = "Published"

### Step 6: Run Sync
```bash
npx tsx notion-to-supabase-sync.ts
```

**What Happens:**
- ✅ Downloads all images
- ✅ Uploads to Supabase
- ✅ Extracts videos
- ✅ Creates blog post
- ✅ Blog appears on site!

---

## 🎯 Data Flow

```
┌─────────────────┐
│  Write in       │
│  Notion         │  ← Just like Google Docs
│  📝             │     Drag & drop images
│                 │     Paste YouTube links
└────────┬────────┘
         │
         │ Run sync script
         ↓
┌─────────────────┐
│  Download       │
│  Images         │  ← All images from Notion
│  📥             │     Saved to Supabase Storage
└────────┬────────┘     media/blog/{page-id}/
         │
         ↓
┌─────────────────┐
│  Extract        │
│  Videos         │  ← YouTube/Vimeo links
│  🎬             │     Saved to videos table
└────────┬────────┘     Auto-generated metadata
         │
         ↓
┌─────────────────┐
│  Create         │
│  Blog Post      │  ← blog_posts table
│  📄             │     With Supabase image URLs
└────────┬────────┘     Linked to videos
         │
         ↓
┌─────────────────┐
│  Live on        │
│  Website        │  ← http://localhost:3001/blog
│  🌐             │     http://localhost:3001/videos
└─────────────────┘
```

---

## 📂 Supabase Storage Structure

```
media/
  blog/
    {notion-page-id-1}/
      ├── image-1.jpg      ← Downloaded from Notion
      ├── image-2.jpg
      └── hero.jpg
    {notion-page-id-2}/
      ├── photo-1.jpg
      └── photo-2.jpg
```

## 📊 Supabase Tables

### `blog_posts`
```sql
{
  id: UUID,
  title: "Our Homestead, Our Story",
  content: "...",  -- Images use Supabase URLs!
  hero_image: "https://...supabase.co/storage/.../hero.jpg",
  tags: ["Atnarpa", "Community"],
  status: "published"
}
```

### `videos`
```sql
{
  id: UUID,
  title: "Atnarpa Homestead Restoration",
  video_url: "https://youtube.com/watch?v=ABC123",
  video_type: "youtube",
  video_id: "ABC123",  -- Auto-extracted
  embed_code: "<iframe...>",  -- Auto-generated
  thumbnail_url: "https://img.youtube.com/vi/ABC123/maxresdefault.jpg",
  source_blog_post_id: UUID,  -- Links to blog
  source_notion_page_id: "abc123",
  tags: ["Atnarpa", "Community"]
}
```

---

## 🎬 Video Gallery Features

**Visit:** http://localhost:3001/videos

### Features:
- ✅ Grid of all videos
- ✅ Auto-generated thumbnails
- ✅ Filter by tags
- ✅ Click to play in modal
- ✅ Shows video info & tags
- ✅ Linked to source blog post
- ✅ Cultural review status

### Video Sources:
- 📝 Blog posts (from Notion)
- 💚 Empathy Ledger entries
- 📤 Direct uploads (future)

---

## 🔄 Future Workflow

### To Publish New Blog:

1. **Open Notion database**
2. **Create new page**
3. **Write content:**
   - Type normally
   - Upload images (drag & drop)
   - Paste YouTube URLs
4. **Set Status → Published**
5. **Run sync:**
   ```bash
   npx tsx notion-to-supabase-sync.ts
   ```
6. **Done!**
   - Blog live at `/blog`
   - Images in Supabase
   - Videos in gallery at `/videos`

### Auto-Sync (Optional):
```bash
# Run every hour
0 * * * * cd /Users/benknight/Code/Oochiumpa && npx tsx notion-to-supabase-sync.ts
```

---

## 💡 Example Notion Blog Post

```
Title: Our Homestead, Our Story
Status: Published
Tags: Atnarpa, Community, Sovereignty
Author: Oonchiumpa Community

## Meeting the Right People

About eighteen months ago, Tanya Turner and I sat down...

[Upload image: homestead.jpg]

## The Week Everything Changed

https://www.youtube.com/watch?v=ABC123xyz

[Paste YouTube URL - sync will extract it!]

When the opportunity came to fix the roof...

[Upload image: roof-work.jpg]

## What We're Building

[More content...]
```

**After sync:**
- ✅ `homestead.jpg` → Supabase Storage
- ✅ `roof-work.jpg` → Supabase Storage
- ✅ YouTube video → videos table
- ✅ Blog post created with Supabase image URLs
- ✅ Video appears in gallery

---

## 🎯 Benefits

### For Content Creators:
- ✅ Write like Google Docs (no technical skills)
- ✅ Drag & drop images (so easy!)
- ✅ Paste video links (automatically handled)
- ✅ Preview before publishing
- ✅ Team collaboration in Notion

### For Website:
- ✅ Own all your media (Supabase Storage)
- ✅ Fast loading (optimized)
- ✅ Unified video gallery
- ✅ Cultural review workflow
- ✅ Organized by tags

### For Organization:
- ✅ No external dependencies
- ✅ All media backed up
- ✅ Easy to find/search videos
- ✅ Links to original sources
- ✅ Professional workflow

---

## 🔗 Links

**Your Blog Post:** http://localhost:3001/blog/79fb595d-5e9f-4f8e-ad6e-64a130eff8fb
**Video Gallery:** http://localhost:3001/videos
**Setup Guide:** [NOTION-SETUP-GUIDE.md](NOTION-SETUP-GUIDE.md)

---

## 📞 Next Steps

1. **Run the schema** (5 min)
   ```bash
   # Supabase SQL Editor → create-video-gallery-schema.sql
   ```

2. **Set up Notion** (10 min)
   - Follow [NOTION-SETUP-GUIDE.md](NOTION-SETUP-GUIDE.md)

3. **Install deps** (1 min)
   ```bash
   npm install @notionhq/client node-fetch
   ```

4. **Configure .env** (2 min)
   ```bash
   NOTION_API_KEY=secret_xxx
   NOTION_DATABASE_ID=xxx
   ```

5. **Test with your Atnarpa post!**
   - Copy content to Notion
   - Add some images
   - Paste A Curious Tractor YouTube video
   - Set Status = Published
   - Run sync!

🎉 **You now have a professional blogging system with automatic media management!**

Need help with any step? Let me know!
