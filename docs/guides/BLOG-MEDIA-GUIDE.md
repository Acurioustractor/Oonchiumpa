# Blog Post Media & Sustainable Blogging Guide

## ✅ Your Atnarpa Blog Post is Live!

**View it here:** http://localhost:3001/blog/79fb595d-5e9f-4f8e-ad6e-64a130eff8fb

---

## 📸 Option 1: Simple Image/Video Links (Easiest - Do This Now!)

### For Images - Just Use URLs

The easiest way is to use image URLs from anywhere on the web. Add them directly in your markdown content:

```markdown
![Atnarpa Homestead](https://your-image-url.com/homestead.jpg)
```

**Where to host images:**
1. **YouTube Community Posts** - Upload photos, copy image URL
2. **Imgur** - Free, simple, fast (`imgur.com`)
3. **Unsplash** - If you have professional photos there
4. **Google Drive** - Make public, use direct link
5. **Your own website** - If you have existing images online

### For Videos - Embed YouTube/Vimeo

```markdown
## The Week Everything Changed

<iframe width="100%" height="400" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>

When the opportunity came to fix the roof...
```

**This is the fastest way!** Just drop in the YouTube embed code.

---

## 📤 Option 2: Upload to Supabase Storage (More Control)

If you want to own your media files:

### 1. Upload Files to Supabase

Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage/buckets/media

- Create folder: `blog/atnarpa-homestead/`
- Upload your images/videos
- Copy the public URL

### 2. Add to Blog Post

Edit the blog_posts table and insert image URLs in the content:

```markdown
![Family at homestead](https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/blog/atnarpa-homestead/family.jpg)
```

### 3. Set Hero Image

Update the blog post with a hero image:

```sql
UPDATE blog_posts
SET hero_image = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/blog/atnarpa-homestead/hero.jpg'
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

### 4. Add to Gallery

For multiple images, update the gallery array:

```sql
UPDATE blog_posts
SET gallery = ARRAY[
  'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/blog/atnarpa-homestead/img1.jpg',
  'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/blog/atnarpa-homestead/img2.jpg',
  'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/blog/atnarpa-homestead/img3.jpg'
]
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

---

## 🚀 Option 3: Most Sustainable - Rich Text Editor (Future)

### I Recommend Building a Blog Editor Page

**What you'd get:**
- Visual editor like Medium/Notion
- Drag and drop images/videos
- Live preview
- Auto-save drafts
- Image uploads handled automatically

**Tech Stack Options:**

### A) TipTap Editor (Recommended)
- **Pros**: Modern, extensible, great for markdown
- **Example**: https://tiptap.dev/
- **Best for**: Full control, custom features

```typescript
// Example: Simple TipTap blog editor
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

function BlogEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: blogPost.content,
    onUpdate: ({ editor }) => {
      // Auto-save to Supabase
      saveBlogPost(editor.getHTML())
    }
  })

  return (
    <div>
      <EditorContent editor={editor} />
      <button onClick={() => uploadImage()}>Add Image</button>
    </div>
  )
}
```

### B) Quill Editor
- **Pros**: Simple, lightweight, proven
- **Best for**: Quick implementation

### C) Notion-style Editor
- **Pros**: Beautiful, block-based
- **Example**: https://github.com/outline/rich-markdown-editor
- **Best for**: Best user experience

---

## 🌐 Option 4: External CMS (Easiest Long-term)

Instead of building your own editor, use an existing CMS:

### A) **Notion** (HIGHLY RECOMMENDED)
**Pros:**
- Free
- Everyone knows how to use it
- Drag and drop everything
- Embed videos easily
- Can sync to your site via Notion API

**How it works:**
1. Write blog posts in Notion
2. Mark as "Published"
3. Your site pulls from Notion API and displays them
4. No coding required for content creators

**Setup:**
```typescript
// Sync Notion → Supabase automatically
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function syncNotionBlogs() {
  const response = await notion.databases.query({
    database_id: 'YOUR_NOTION_DB_ID',
    filter: { property: 'Status', status: { equals: 'Published' } }
  })

  for (const page of response.results) {
    // Convert Notion page to blog_post in Supabase
    await supabase.from('blog_posts').upsert({
      title: page.properties.Title.title[0].text.content,
      content: await getNotionPageContent(page.id),
      // ... more fields
    })
  }
}
```

### B) **Contentful** / **Sanity.io**
- Professional CMS
- Great media handling
- Rich text editors
- API-first

### C) **WordPress** (Headless)
- Use WordPress admin for writing
- Your Oonchiumpa site fetches via API
- Best if team already knows WordPress

---

## 💡 My Recommendation for Oonchiumpa

### Phase 1 (NOW): Simple URLs
- Use YouTube for videos
- Use Imgur/Google Drive for images
- Edit blog_posts table directly in Supabase

### Phase 2 (Next Month): Build Simple Editor
- Create `/staff-portal/blog-editor` page
- TipTap rich text editor
- Upload to Supabase Storage
- Save drafts

### Phase 3 (Long-term): Notion Integration
- Write in Notion (everyone loves it)
- Auto-sync to your database
- No custom editor maintenance
- Content team can work independently

---

## 🎯 Quick Win: Update Your Atnarpa Post Now

**1. Find YouTube video of Atnarpa homestead work**

**2. Add to blog post:**

```sql
UPDATE blog_posts
SET content = REPLACE(
  content,
  '## The Week Everything Changed',
  E'## The Week Everything Changed\n\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allowfullscreen></iframe>\n'
)
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

**3. Add hero image:**

```sql
UPDATE blog_posts
SET hero_image = 'YOUR_IMAGE_URL'
WHERE id = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';
```

---

## 📝 Create New Blog Posts (Simple Script)

I'll create a simple script so you can add blog posts easily:

```bash
npx tsx create-blog-post.ts --title "Your Title" --content-file "content.md"
```

Would you like me to build:
1. ✅ Simple blog post creation script (10 min)
2. ✅ Blog editor page in Staff Portal (2 hours)
3. ✅ Notion integration (4 hours)

Let me know which direction you want to go!
