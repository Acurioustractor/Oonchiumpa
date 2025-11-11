# Notion Status Control for Blog Posts

## ✅ Status Management Now Active!

You can now control which blog posts are visible on your website directly from Notion!

---

## 📊 How It Works

### Notion Statuses → Website Visibility

| Notion Status | Supabase Status | Visible on Blog? | Description |
|--------------|-----------------|------------------|-------------|
| **Published** | `published` | ✅ YES | Post appears on http://localhost:3001/blog |
| **Draft** | `draft` | ❌ NO | Post is synced but hidden from public view |
| **Archived** | `archived` | ❌ NO | Post is synced but hidden from public view |

---

## 🎯 Quick Start

### 1. Set Status in Notion

In your Notion blog database, each post has a **Status** property:

```
┌─────────────────────────────────────┐
│ Youth Leadership Program...         │
├─────────────────────────────────────┤
│ Status: Published ▼                 │  ← Click to change
│   • Published                       │
│   • Draft                           │
│   • Archived                        │
└─────────────────────────────────────┘
```

### 2. Run Sync

```bash
npx tsx notion-to-supabase-sync.ts
```

### 3. Check Results

The sync will show you what happened:

```
📊 Status Summary:
   ✅ Published: 1 (visible on blog)
   📝 Draft: 2 (hidden from blog)
   📦 Archived: 0 (hidden from blog)
```

---

## 🔄 Common Workflows

### Publishing a Draft

1. **In Notion:** Change Status from "Draft" → "Published"
2. **Run sync:** `npx tsx notion-to-supabase-sync.ts`
3. **Result:** Post appears on blog immediately

### Unpublishing a Post

1. **In Notion:** Change Status from "Published" → "Draft" or "Archived"
2. **Run sync:** `npx tsx notion-to-supabase-sync.ts`
3. **Result:** Post disappears from blog

### Archiving Old Content

1. **In Notion:** Change Status to "Archived"
2. **Run sync:** `npx tsx notion-to-supabase-sync.ts`
3. **Result:** Post is removed from blog but kept in database

---

## 📝 Examples

### Example 1: Publishing Multiple Drafts

**Notion:**
- Youth Leadership Program → Status: Draft
- Community Garden Project → Status: Draft
- Elder Wisdom Series → Status: Draft

**Change to:**
- Youth Leadership Program → Status: **Published** ✅
- Community Garden Project → Status: **Published** ✅
- Elder Wisdom Series → Status: Draft (keep as draft)

**Run sync:**
```bash
npx tsx notion-to-supabase-sync.ts
```

**Result:**
```
📊 Status Summary:
   ✅ Published: 3 (visible on blog)
   📝 Draft: 1 (hidden from blog)
   📦 Archived: 0 (hidden from blog)
```

Blog now shows 5 posts (3 new + 2 existing)

### Example 2: Removing Outdated Content

**Scenario:** You have an event announcement that's no longer relevant

**In Notion:**
- Sydney Visit Announcement → Status: Published

**Change to:**
- Sydney Visit Announcement → Status: **Archived** 📦

**Run sync:**
```bash
npx tsx notion-to-supabase-sync.ts
```

**Result:**
Post disappears from blog but remains in Supabase for records

---

## 🎨 What Gets Synced

**ALL posts are synced regardless of status:**
- ✅ Title, content, tags, author
- ✅ Images (downloaded to Supabase)
- ✅ Videos (embedded as iframes)
- ✅ Status (determines visibility)

**Only "Published" posts appear on the blog**

---

## 💡 Pro Tips

### Tip 1: Use Draft for Work in Progress

Create new posts as "Draft" while you're writing:
- ✅ Content is backed up to Supabase
- ✅ Images are already uploaded
- ✅ Videos are already embedded
- ❌ Not visible to public

When ready, change to "Published"!

### Tip 2: Preview Before Publishing

1. Create post in Notion with Status: **Draft**
2. Run sync
3. Check formatting in Supabase directly
4. When satisfied, change Status: **Published**

### Tip 3: Seasonal Content

For seasonal or event-based content:
- **Before event:** Status: Draft
- **During event:** Status: Published
- **After event:** Status: Archived

---

## 🔍 Checking What's Published

### View All Posts in Database

```bash
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const s = createClient('https://yvnuayzslukamizrlhwb.supabase.co', 'YOUR_SERVICE_KEY');
const {data} = await s.from('blog_posts').select('title, status').eq('source_notion_page_id', null, {not: true});
console.table(data);
"
```

### View Only Published Posts

Visit: http://localhost:3001/blog

---

## ⚙️ Technical Details

### Status Mapping

```typescript
const notionStatus = page.properties.Status?.status?.name || 'Draft';
const supabaseStatus = notionStatus === 'Published' ? 'published' :
                       notionStatus === 'Archived' ? 'archived' :
                       'draft';
```

### Database Query (Blog Page)

The blog page only shows published posts:

```typescript
.from('blog_posts')
.select('*')
.eq('status', 'published')     // ← Only published
.eq('elder_approved', true)
.order('published_at', { ascending: false })
```

---

## 📋 Summary

**✅ You can now:**
1. Write posts in Notion (any status)
2. Sync to Supabase
3. Control visibility with Status field
4. Publish/unpublish at any time
5. Archive old content

**🔄 Workflow:**
1. Write → Sync → Review → Publish
2. Or: Draft → Review → Publish → Archive

**🎯 Key Command:**
```bash
npx tsx notion-to-supabase-sync.ts
```

That's it! You have full control over your blog post visibility directly from Notion! 🚀
