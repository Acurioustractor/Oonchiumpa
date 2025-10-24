# Media Library - Complete Documentation Package

The Media Library is now **100% functional** and ready to use! This document summarizes all the resources available.

## 📚 Documentation Files

### For Users (Staff/Community)
1. **[MEDIA-LIBRARY-USER-GUIDE.md](MEDIA-LIBRARY-USER-GUIDE.md)**
   - Complete step-by-step guide for daily use
   - How to upload photos/videos
   - Cultural sensitivity guidelines
   - Troubleshooting common issues
   - Quick reference sections
   - **Best for:** Staff training, quick reference

2. **[MEDIA-LIBRARY-WALKTHROUGH.md](MEDIA-LIBRARY-WALKTHROUGH.md)**
   - Visual step-by-step scenarios
   - ASCII art UI mockups showing what you'll see
   - Common workflows (upload, find, edit, delete)
   - Tips for efficient use
   - **Best for:** New users, visual learners

### For Developers/Admins
3. **[MEDIA-LIBRARY-SETUP.md](MEDIA-LIBRARY-SETUP.md)**
   - Technical setup instructions
   - Database schema details
   - Storage configuration
   - Troubleshooting technical issues
   - **Best for:** Technical setup, maintenance

4. **[MEDIA-LIBRARY-UX-IMPROVEMENTS.md](MEDIA-LIBRARY-UX-IMPROVEMENTS.md)**
   - 20 suggested improvements for future development
   - Prioritized by effort vs impact
   - Implementation recommendations
   - Staff training suggestions
   - **Best for:** Planning future enhancements

### Quick Setup
5. **[RUN-THIS-SQL.md](RUN-THIS-SQL.md)**
   - One-page quick setup guide
   - Direct link to Supabase SQL Editor
   - Verification steps
   - **Best for:** Initial database setup

---

## ✅ Current Status

### What's Working
- ✅ Database table `media_files` created and accessible
- ✅ Storage bucket `media` configured (50MB limit, public)
- ✅ Upload interface with drag-and-drop
- ✅ Metadata forms (title, description, tags, cultural sensitivity)
- ✅ Upload progress tracking
- ✅ Stats dashboard (file counts, storage, by type/category)
- ✅ Gallery view with grid layout
- ✅ Fullscreen photo viewing
- ✅ Edit photo metadata
- ✅ Delete photos
- ✅ Cultural sensitivity controls (4 levels)
- ✅ Elder approval workflow (pending photos tracked)
- ✅ Service page integration (via tags)
- ✅ Row Level Security policies
- ✅ Automatic thumbnail generation
- ✅ Multi-file upload (up to 20 files)

### What's Next (Future Enhancements)
See [MEDIA-LIBRARY-UX-IMPROVEMENTS.md](MEDIA-LIBRARY-UX-IMPROVEMENTS.md) for full list.

**Top 5 Priorities:**
1. Upload Presets - Quick templates for common scenarios
2. Bulk Tagging - Apply tags to multiple photos at once
3. Search and Filter - Find photos by tag, date, category
4. Batch Operations - Edit multiple photos simultaneously
5. Elder Approval Workflow UI - Dedicated approval queue

---

## 🚀 How to Get Started

### For Users
1. Read [MEDIA-LIBRARY-USER-GUIDE.md](MEDIA-LIBRARY-USER-GUIDE.md)
2. Follow [MEDIA-LIBRARY-WALKTHROUGH.md](MEDIA-LIBRARY-WALKTHROUGH.md) Scenario 1
3. Try uploading a test photo
4. Bookmark the Quick Reference section

### For Training New Staff
1. **15-Minute Overview:**
   - Show the interface (CMS → Media Library)
   - Demonstrate one upload (Scenario 1 in walkthrough)
   - Explain cultural sensitivity levels
   - Show how to find photos in gallery

2. **30-Minute Hands-On:**
   - Each person uploads 2-3 photos
   - Practice tagging and organizing
   - Edit metadata on existing photo
   - Q&A session

3. **Print Quick Reference Card:**
   Extract the "Quick Reference" section from user guide
   Print one-pager for each desk

### For Developers
1. Review [MEDIA-LIBRARY-SETUP.md](MEDIA-LIBRARY-SETUP.md) for architecture
2. Check [MEDIA-LIBRARY-UX-IMPROVEMENTS.md](MEDIA-LIBRARY-UX-IMPROVEMENTS.md) for roadmap
3. Database schema in `create-media-tables.sql`
4. Code in `oonchiumpa-app/src/components/MediaLibraryManager.tsx`

---

## 📋 File Organization

### Documentation
```
MEDIA-LIBRARY-COMPLETE.md           ← You are here (overview)
MEDIA-LIBRARY-USER-GUIDE.md         ← Daily use guide
MEDIA-LIBRARY-WALKTHROUGH.md        ← Visual scenarios
MEDIA-LIBRARY-SETUP.md              ← Technical setup
MEDIA-LIBRARY-UX-IMPROVEMENTS.md    ← Future enhancements
RUN-THIS-SQL.md                     ← Quick database setup
```

### Code
```
oonchiumpa-app/src/
├── components/
│   ├── MediaLibraryManager.tsx    ← CMS integration
│   ├── MediaUpload.tsx             ← Upload interface
│   └── MediaGallery.tsx            ← Gallery display
├── services/
│   └── mediaService.ts             ← Upload/download logic
└── pages/
    └── MediaManagerPage.tsx        ← Standalone media page
```

### Database
```
create-media-tables.sql             ← Table schema + RLS
check-media-files-table.ts          ← Verification script
verify-media-setup.ts               ← Comprehensive check
```

---

## 🎯 Common Use Cases

### Upload Event Photos
1. Take photos at community event
2. Transfer to computer
3. Go to CMS → Media Library → Upload
4. Select all photos (up to 20)
5. Fill in: Title, Description, Tags (event name)
6. Choose "Community" sensitivity
7. Upload and review in Gallery

### Add Photos to Service Pages
1. Upload photos as normal
2. Add service tag:
   - `youth-mentorship` for Youth Mentorship page
   - `true-justice` for True Justice page
   - `atnarpa-homestead` for Atnarpa page
   - `cultural-brokerage` for Cultural Brokerage page
3. Photos auto-appear on those pages!

### Get Elder Approval for Cultural Photos
1. Upload photos with "Sacred" sensitivity level
2. Photos marked as "Pending Approval"
3. Stats dashboard shows count
4. Elder reviews and approves
5. Photos become visible on site

### Find Old Photos
1. Go to Gallery view
2. Scroll through grid (sorted by date)
3. Look for distinctive thumbnails
4. Click for full view and details
5. (Future: Use search/filter)

---

## 🛡️ Cultural Protocols

### Before Uploading
- ✅ Get permission from people in photos
- ✅ Consult Elders for ceremony/cultural content
- ✅ Choose appropriate sensitivity level
- ✅ Add context in description

### Sensitivity Level Guidelines
- **Public (🌐):** Safe for social media, marketing
- **Community (👥):** Most photos (default, safer choice)
- **Private (🔒):** Internal documents, drafts
- **Sacred (🛡️):** Requires Elder approval

### When in Doubt
- Choose more restrictive level (Community over Public)
- Ask Elders before marking anything Sacred
- Add detailed description for context
- Can always change sensitivity level later

---

## 📊 Success Metrics

Track these to measure adoption:

### Usage Metrics
- Photos uploaded per month
- Active users (who uploads)
- Upload success rate
- Average photos per upload session

### Quality Metrics
- Tag consistency (agreed tags used)
- Cultural sensitivity accuracy
- Description completeness
- Elder approval turnaround time

### User Satisfaction
- "How easy is media upload?" (1-5 scale)
- "Can you find photos you need?" (Yes/No)
- "Do you understand cultural levels?" (Yes/No)
- Suggestions for improvement (open feedback)

---

## 🔧 Troubleshooting

### "Table doesn't exist" error
→ Run `create-media-tables.sql` in Supabase SQL Editor

### "Storage bucket not found"
→ Should be created already, check Supabase Dashboard → Storage

### Upload fails silently
→ Check browser console for errors, verify file size < 50MB

### Photo doesn't appear in gallery
→ Refresh page, check cultural sensitivity filter, wait a moment for processing

### Can't delete photo
→ Must be logged in as admin, check if photo is linked to service/story

**For all other issues:** See detailed troubleshooting in MEDIA-LIBRARY-USER-GUIDE.md

---

## 🎓 Training Resources

### Video Tutorial Script (3 minutes)
```
[0:00] "Hi! Today I'll show you how to upload photos to the Oonchiumpa Media Library"
[0:15] "First, login to the admin dashboard and click the CMS tab"
[0:30] "Click Media Library - you'll see stats showing how many photos we have"
[0:45] "Click the Upload button and drag your photo here"
[1:00] "Give it a title - I'll call this Youth Camp March 2024"
[1:15] "Choose cultural sensitivity - most photos are Community level"
[1:30] "Add tags so we can find it later - youth-mentorship and Youth Programs"
[1:45] "Add a description to give context about when and where"
[2:00] "Click Upload and watch the progress bar"
[2:15] "When it's done, you'll see it in the gallery!"
[2:30] "Click any photo to view full size and see all the details"
[2:45] "That's it! Easy as that. Happy uploading!"
```

### Quick Reference Card (Printable)
```
═══════════════════════════════════════════════
        MEDIA UPLOAD QUICK REFERENCE
═══════════════════════════════════════════════

📤 HOW TO UPLOAD
1. CMS → Media Library → Upload
2. Drag photo or click Choose Files
3. Fill in details:
   • Title (descriptive name)
   • Description (context)
   • Cultural Level (when in doubt: Community)
   • Tags (keywords)
4. Click Upload

🛡️ CULTURAL LEVELS
🌐 Public      → Social media safe
👥 Community   → Most photos (default)
🔒 Private     → Internal only
🛡️ Sacred      → Elder approval needed

🏷️ SERVICE TAGS (auto-link to pages)
• youth-mentorship
• true-justice
• atnarpa-homestead
• cultural-brokerage

✅ BEFORE UPLOADING CHECKLIST
□ Permission from people in photo
□ Cultural sensitivity chosen
□ Descriptive title added
□ Context in description
□ Relevant tags added

❓ Questions? See MEDIA-LIBRARY-USER-GUIDE.md
   or ask [Team Contact Name]

═══════════════════════════════════════════════
```

---

## 📞 Support Contacts

**For Tech Issues:**
- Database/upload errors
- Permission problems
- Bug reports
→ Contact: Web Developer/Admin

**For Cultural Questions:**
- Which sensitivity level to use
- Sacred content approval
- Cultural protocol questions
→ Contact: Elders/Cultural Coordinator

**For General Use:**
- How to upload
- Finding photos
- Tagging help
→ Contact: Media Manager/Team Lead

---

## 🎉 You're Ready!

The Media Library is fully set up and documented. You have everything you need to:

- ✅ Upload photos and videos
- ✅ Organize with tags and categories
- ✅ Apply cultural sensitivity controls
- ✅ Find and manage media
- ✅ Train new staff
- ✅ Plan future improvements

**Start by uploading your first photo!**

Go to: Admin Dashboard → CMS → Media Library → Upload

Follow along with [MEDIA-LIBRARY-WALKTHROUGH.md](MEDIA-LIBRARY-WALKTHROUGH.md) Scenario 1 for step-by-step guidance.

---

**Last Updated:** 2025-10-24
**Status:** Production Ready ✅
**Version:** 1.0
