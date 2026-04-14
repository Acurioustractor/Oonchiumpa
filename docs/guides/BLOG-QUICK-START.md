# Blog Quick Start Guide

## ✅ Your Atnarpa Blog Post is LIVE!

**View it here:** http://localhost:3001/blog/79fb595d-5e9f-4f8e-ad6e-64a130eff8fb

---

## 📸 Adding Images & Videos (3 Easy Ways)

### 1️⃣ FASTEST: Use Direct URLs

**For images:**
1. Upload your image to [Imgur.com](https://imgur.com) or Google Drive
2. Copy the direct image URL
3. Go to Supabase Table Editor: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor
4. Find `blog_posts` table → your Atnarpa post
5. Click to edit the `content` field
6. Add anywhere in the content:
   ```markdown
   ![Atnarpa Homestead](https://your-image-url.com/image.jpg)
   ```

**For YouTube videos:**
1. Get your YouTube video ID (part after `watch?v=`)
2. Add this anywhere in content:
   ```html
   <iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
   ```

### 2️⃣ Add Hero Image
```sql
UPDATE blog_posts
SET hero_image = 'https://your-image-url.com/hero.jpg'
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

### 3️⃣ Add Multiple Images (Gallery)
```sql
UPDATE blog_posts
SET gallery = ARRAY[
  'https://image1.jpg',
  'https://image2.jpg',
  'https://image3.jpg'
]
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

---

## 🆕 Creating Future Blog Posts

### Option A: Edit the Script Directly

1. Open `create-blog-post.ts`
2. Edit the `NEW_BLOG_POST` section:
   ```typescript
   const NEW_BLOG_POST = {
     title: 'My New Blog Title',
     excerpt: 'Summary here...',
     content: `
       ## My First Section

       Content here...

       ![Image](https://url.com/image.jpg)
     `
   }
   ```
3. Run: `npx tsx create-blog-post.ts`

### Option B: Use a Markdown File

1. Create a file: `my-blog-post.md`
2. Write your content with images/videos
3. Run:
   ```bash
   npx tsx create-blog-post.ts "My Blog Title" ./my-blog-post.md
   ```

---

## 🌐 Most Sustainable Long-Term Solution

### I HIGHLY Recommend: Notion Integration

**Why Notion?**
- ✅ Everyone knows how to use it
- ✅ Drag and drop images/videos
- ✅ Beautiful editor
- ✅ Can auto-sync to your site
- ✅ Free!

**How it would work:**
1. Write blog posts in Notion (just like a document)
2. Mark status as "Published"
3. Your site automatically pulls it and displays it
4. No database editing required

**Setup time:** ~4 hours to build the integration

**Would you like me to build this?** It would give you:
- Write blogs like Google Docs
- Drag-drop images
- Embed videos easily
- Team collaboration
- No technical knowledge needed

---

## 🎯 What You Have Right Now

### ✅ Working:
1. Blog post system connected to Supabase
2. Simple scripts to create posts
3. Support for markdown, images, videos
4. Cultural review workflow
5. Published/draft status

### 📝 To Add Images/Videos Today:
Run this for instructions:
```bash
npx tsx update-blog-media.ts
```

### 🚀 Future Options:

**Option 1: Keep It Simple (Current)**
- Edit `create-blog-post.ts` file
- Paste content with image URLs
- Run script
- **Effort:** 5 minutes per post

**Option 2: Build Staff Portal Blog Editor**
- Visual editor like Medium
- Upload images directly
- Live preview
- **Effort:** 2-3 hours to build

**Option 3: Notion Integration** ⭐ **RECOMMENDED**
- Write in Notion
- Auto-syncs to site
- Best user experience
- **Effort:** 4 hours to build

---

## 🎬 Example: Adding A Curious Tractor Video

If you have a YouTube video about the homestead restoration:

1. Find the video ID:
   - URL: `https://www.youtube.com/watch?v=ABC123xyz`
   - Video ID: `ABC123xyz`

2. Edit your blog post content in Supabase
3. Add this where you want the video:
   ```html
   <iframe width="100%" height="400"
     src="https://www.youtube.com/embed/ABC123xyz"
     title="Atnarpa Homestead Restoration"
     allowfullscreen>
   </iframe>
   ```

4. Refresh the blog page - video will be embedded!

---

## 📞 Next Steps

**Tell me what you want and I'll build it:**

1. **"Just help me add some images/videos to this post"**
   → I'll guide you through editing in Supabase

2. **"Build a simple blog editor in the Staff Portal"**
   → I'll create a TipTap editor page (~2 hours)

3. **"Set up Notion integration"** ⭐
   → I'll build auto-sync from Notion (~4 hours)
   → Then you can write blogs like Google Docs!

Let me know which direction you want!
