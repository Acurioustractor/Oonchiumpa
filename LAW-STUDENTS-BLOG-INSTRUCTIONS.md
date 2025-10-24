# Law Students Blog Post - Photos & Videos Instructions

## ✅ What's Been Done

The law students blog post has been updated with:
- **Authentic quotes** from Chelsea Kenneally, Adelaide Hayes, Suzie Ma, Aidan Harris, and Kristy Bloomfield
- **3 video link placeholders** ready for you to add Descript links
- **8 photo placeholders** strategically placed throughout the narrative
- **Comprehensive narrative** about the ANU law program experience

## 📸 How to Add Photos from Your Gallery

### Option 1: If Photos Are in Your Website Gallery Already

1. Go to your gallery/photos page on the site
2. Find photos from the law student trip
3. Note the photo URLs (they might look like `/gallery/photos/123` or similar)
4. Update the blog post in Supabase by replacing placeholders:

```
#LAW_STUDENT_PHOTO_1 → /path/to/students-on-country.jpg
#LAW_STUDENT_PHOTO_2 → /path/to/students-with-elders.jpg
#LAW_STUDENT_PHOTO_3 → /path/to/group-photo.jpg
```

### Option 2: If Photos Need to Be Tagged First

If your photos aren't organized yet, here's how to tag them:

**In Supabase:**
1. Go to https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb
2. Navigate to the `photos` or `photo_gallery` table
3. Find photos from the law student trip
4. Add tags like:
   - `law-students-2024`
   - `anu-program`
   - `on-country-learning`
   - `traditional-owners`

**Then Query Tagged Photos:**
```sql
SELECT * FROM photos
WHERE tags @> ARRAY['law-students-2024']
ORDER BY created_at;
```

### Option 3: Upload New Photos

If you need to upload photos:
1. Go to your site's media manager/upload page
2. Upload law student trip photos
3. Tag them appropriately
4. Note the URLs
5. Update the blog post

## 🎥 How to Add Video Links

You mentioned you have Descript videos. Here's how to add them:

### Step 1: Get Your Descript Share Links

For each video, get the sharable link from Descript (should look like: `https://share.descript.com/view/xxxxx`)

### Step 2: Update the Blog Post

You have two options:

**Option A: Simple Text Links (Easiest)**

Replace the placeholders in the database:
```
YOUR_CHELSEA_VIDEO_LINK_HERE → https://share.descript.com/view/chelsea-video-id
YOUR_SUZIE_VIDEO_LINK_HERE → https://share.descript.com/view/suzie-video-id
YOUR_ADELAIDE_VIDEO_LINK_HERE → https://share.descript.com/view/adelaide-video-id
```

**Option B: Embedded Descript Videos (More Interactive)**

If you want embedded videos, replace the markdown with HTML:

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0;">
  <iframe
    src="https://share.descript.com/view/chelsea-video-id?embed=true"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="autoplay; fullscreen"
    allowfullscreen>
  </iframe>
</div>
```

## 🛠️ Quick Update Script

I can create a script that lets you paste in all the URLs at once. Just give me:

1. **Chelsea's video URL**
2. **Suzie's video URL**
3. **Adelaide's video URL**
4. **8 photo URLs** (or tell me where to find them in your gallery)

## 📝 Suggested Photos to Add

Based on typical law student trips, here's what would work well:

1. **#LAW_STUDENT_PHOTO_1** - Students sitting on country, learning (wide shot)
2. **#LAW_STUDENT_PHOTO_2** - Students with Traditional Owners/Kristy
3. **#LAW_STUDENT_PHOTO_3** - Group photo of the cohort
4. **#LAW_STUDENT_PHOTO_4** - Students in discussion/taking notes
5. **#LAW_STUDENT_PHOTO_5** - Kristy teaching/speaking with students
6. **#LAW_STUDENT_PHOTO_6** - Students reflecting together
7. **#LAW_STUDENT_PHOTO_7** - Sunset/landscape shot from the trip
8. **#LAW_STUDENT_PHOTO_8** - Atnarpa homestead or learning location

## 🚀 Next Steps

**Tell me:**
1. Where are your law student trip photos? (Gallery URL, folder path, need upload?)
2. Do you have the Descript video share links ready?
3. Do you want me to create a quick script to update everything at once?

I can help you:
- Find and tag existing photos in your database
- Create a batch update script once you have the URLs
- Set up a photo gallery specifically for the law program
