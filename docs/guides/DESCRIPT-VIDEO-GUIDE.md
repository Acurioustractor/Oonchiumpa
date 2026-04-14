# Descript Video Integration Guide

## ✅ Descript Support Added!

Your video system now supports **Descript** videos in addition to YouTube and Vimeo!

---

## 🎬 Supported Video Platforms

1. **YouTube** ✅
2. **Vimeo** ✅
3. **Descript** ✅ NEW!

All three automatically:
- Extract video IDs
- Generate embed codes
- Create thumbnails (YouTube only)
- Save to video gallery

---

## 🚀 Setup: Add Descript Support

### Step 1: Run Database Update

Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql

Run: **`add-descript-support.sql`**

This updates the videos table to support Descript video types.

### Step 2: Done!

That's it! Your system now recognizes Descript URLs.

---

## 📝 How to Use Descript Videos

### Option 1: In Notion (Recommended)

When writing a blog post in Notion:

1. **Get Descript share link:**
   - In Descript, click "Share" on your video
   - Copy the share URL (looks like: `https://share.descript.com/view/xxxxx`)

2. **Paste in Notion:**
   ```
   ## Our Homestead Video

   https://share.descript.com/view/ABC123xyz

   This video shows our family's journey...
   ```

3. **Run sync:**
   ```bash
   npx tsx notion-to-supabase-sync.ts
   ```

4. **Result:**
   - ✅ Video extracted from blog content
   - ✅ Saved to videos table
   - ✅ Embed code auto-generated
   - ✅ Appears in video gallery
   - ✅ Embedded in blog post

### Option 2: Direct Database Insert

```sql
INSERT INTO videos (
  title,
  video_url,
  tags,
  status,
  is_public
) VALUES (
  'Atnarpa Homestead Restoration',
  'https://share.descript.com/view/ABC123xyz',
  ARRAY['Atnarpa', 'Community'],
  'published',
  TRUE
);
```

The trigger automatically:
- Extracts video ID: `ABC123xyz`
- Generates embed code: `<iframe src="https://share.descript.com/embed/ABC123xyz"...>`
- Sets video type: `descript`

### Option 3: In Blog Post Content (Supabase)

Edit blog_posts content field, add:

```markdown
## Watch Our Story

<iframe src="https://share.descript.com/embed/ABC123xyz"
  width="100%" height="400" frameborder="0" allowfullscreen>
</iframe>

Our family's journey on Country...
```

---

## 🎯 Descript Share URL Formats

All these formats are automatically recognized:

```
https://share.descript.com/view/ABC123xyz
https://share.descript.com/embed/ABC123xyz
```

The system:
1. Detects Descript URL
2. Extracts video ID (`ABC123xyz`)
3. Converts to embed format
4. Saves to videos table

---

## 📊 Video Gallery Display

### Your Descript videos will appear in:

**Video Gallery Page:**
http://localhost:3001/videos

**Features:**
- Grid view with all videos
- Filter by tags
- Click to play in modal
- Shows Descript videos alongside YouTube/Vimeo

**Blog Posts:**
- Embedded directly in content
- Responsive player
- Auto-plays when opened

---

## 💡 Descript Best Practices

### 1. Set Video Sharing Settings

In Descript:
- Click "Share" on your video
- Choose: **"Anyone with the link"** (for public videos)
- Or: **"Only people in your workspace"** (for private)

### 2. Use Descriptive Titles

When syncing from Notion, the video inherits the blog post title.

To customize:
```sql
UPDATE videos
SET title = 'Custom Video Title',
    description = 'More detailed description here'
WHERE video_id = 'ABC123xyz';
```

### 3. Add Custom Thumbnails

Descript doesn't auto-generate thumbnails, so add your own:

```sql
UPDATE videos
SET thumbnail_url = 'https://your-image-url.com/thumbnail.jpg'
WHERE video_id = 'ABC123xyz';
```

### 4. Tag Your Videos

```sql
UPDATE videos
SET tags = ARRAY['Atnarpa', 'Homestead', 'Community', 'Restoration']
WHERE video_id = 'ABC123xyz';
```

---

## 🔄 Complete Workflow Example

### Scenario: Upload Video from Atnarpa Homestead Restoration

**1. Edit video in Descript**
- Upload raw footage
- Edit, add captions, music
- Export and publish in Descript

**2. Get share link**
- Click "Share" → Copy link
- Example: `https://share.descript.com/view/AtnarpaVideo2024`

**3. Add to Notion blog post**
```
## The Week Everything Changed

https://share.descript.com/view/AtnarpaVideo2024

When the opportunity came to fix the roof, our friends from
A Curious Tractor showed up with electricians, carpenters...
```

**4. Sync to website**
```bash
npx tsx notion-to-supabase-sync.ts
```

**5. Results:**

**Blog post** (http://localhost:3001/blog):
```html
<iframe src="https://share.descript.com/embed/AtnarpaVideo2024"
  width="100%" height="400" allowfullscreen>
</iframe>
```

**Video gallery** (http://localhost:3001/videos):
- Card with title "Atnarpa Homestead Restoration"
- Tags: Atnarpa, Community
- Click to play in modal

**Videos table:**
```sql
{
  id: UUID,
  title: "Our Homestead, Our Story",
  video_url: "https://share.descript.com/view/AtnarpaVideo2024",
  video_type: "descript",
  video_id: "AtnarpaVideo2024",
  embed_code: "<iframe src='https://share.descript.com/embed/AtnarpaVideo2024'...>",
  source_blog_post_id: UUID,
  tags: ["Atnarpa", "Homestead"],
  status: "published"
}
```

---

## 🎬 Adding Videos to Your Atnarpa Blog Post

You mentioned wanting to add videos to the Atnarpa blog post. Here's how:

### Quick Method (Supabase):

1. **Go to Supabase Table Editor**
   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor

2. **Find blog_posts table**
   - Locate: "Our Homestead, Our Story: The Atnarpa Restoration"
   - ID: `79fb595d-5e9f-4f8e-ad6e-64a130eff8fb`

3. **Edit content field**

   Add Descript video anywhere in the content:
   ```markdown
   ## The Week Everything Changed

   <iframe src="https://share.descript.com/embed/YOUR_VIDEO_ID"
     width="100%" height="400" frameborder="0" allowfullscreen>
   </iframe>

   When the opportunity came to fix the roof...
   ```

4. **The video will:**
   - Display embedded in the blog post
   - Be extracted to videos table (on next sync)
   - Appear in video gallery

---

## 📱 Responsive Embeds

The Descript embeds are responsive and will work on:
- Desktop ✅
- Tablet ✅
- Mobile ✅

---

## 🔍 Finding Your Descript Videos

### In Video Gallery:
```
http://localhost:3001/videos
```

Filter by tag: "Atnarpa" to see all Atnarpa videos

### In Database:
```sql
SELECT * FROM videos
WHERE video_type = 'descript'
ORDER BY published_at DESC;
```

### Linked to Blog:
```sql
SELECT
  v.title as video_title,
  b.title as blog_title,
  v.video_url
FROM videos v
JOIN blog_posts b ON v.source_blog_post_id = b.id
WHERE v.video_type = 'descript';
```

---

## 🎯 Summary

**You can now use Descript videos in 3 ways:**

1. **Paste URL in Notion** → Auto-syncs to website
2. **Add to blog content** → Embeds and extracts to gallery
3. **Direct insert** → Saves to videos table

**All Descript videos:**
- ✅ Auto-extract video ID
- ✅ Auto-generate embed code
- ✅ Save to unified gallery
- ✅ Link to source blog
- ✅ Filterable by tags
- ✅ Work on all devices

Ready to add your Descript videos! Just paste the share link and sync. 🎬
