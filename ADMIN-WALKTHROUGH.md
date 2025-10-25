# Admin Walkthrough - Oonchiumpa Staff Portal

Complete guide for test admin users to navigate and use all backend features on **fromthecentre.com**

## Getting Started

### Login Credentials (Test Account)
- **URL**: https://www.fromthecentre.com/login
- **Email**: test@oonchiumpa.org
- **Password**: OonchiumpaTest2024!
- **Role**: Admin (full access to all features)

### First Login
1. Navigate to https://www.fromthecentre.com
2. Click **Staff Login** button in top-right navigation
3. Enter test credentials
4. Check "Remember me" to stay logged in
5. Click **Sign In**

---

## Main Admin Areas

Once logged in, you have access to 3 main admin areas:

1. **Staff Portal** - Main dashboard and content creation hub
2. **Content Dashboard** - Comprehensive content management tools
3. **Media Manager** - Photo and media organization

---

## 1. Staff Portal Dashboard

**Access**: Click "Staff Portal" in navigation after login

### Overview Tab

The dashboard shows key metrics at the top:
- **Documents Pending**: Files awaiting processing
- **Stories in Review**: Stories awaiting cultural review
- **Published This Week**: Recently published content
- **Active Users**: Current team members

Below the stats, you'll see:
- **Recent Documents**: List of recently uploaded files
- **Content Queue**: Items pending review/approval

### Content Creation Tab

This tab provides AI-powered content generation tools:

**Available Content Types**:
- **Team Profile** - Generate staff member profiles from interviews
  - Click the card to generate a profile
  - Uses interview transcripts to create authentic bios
  - Example: Kristy Bloomfield's profile from interview files

- **Blog Post** - Transform daily work insights into blog content
  - Generate posts about frontline experiences
  - Example: "Daily Realities of Youth Work in Central Australia"

- **Historical Education** - Create truth-telling historical content
  - Process historical documents like Loves Creek history
  - Example: "Understanding the Intervention Impact"

- **Transformation Story** - Showcase community success stories
  - Highlight culturally-led approaches
  - Example: "Cultural Identity and Youth Development"

**How to Generate Content**:
1. Click any content type card
2. System processes documents and generates content
3. Review generated content in "Generated Content Library" section below
4. Content includes title, excerpt, tags, and full text

**Additional Tools**:
- **Create Content Showcase** - Demonstrate multi-format generation
- **Build Content Library** - Generate multiple pieces at once
- **Manage Images** - Upload photos to accompany content

### Document Processing Tab

Upload and process various document types:

**Document Types**:
1. **Law Teaching Courses** ⚖️
   - Extract legal insights and teaching moments
   - Expected output: Legal Education Content, Community Law Insights
   - Examples: Traditional law sessions, legal education workshops

2. **Family Conversations** 👨‍👩‍👧‍👦
   - Capture family voices and intergenerational wisdom
   - Expected output: Family Stories, Cultural Wisdom
   - Examples: Family healing circles, Elder conversations

3. **Support Worker Sessions** 🤝
   - Document best practices and methodologies
   - Expected output: Best Practices, Case Studies
   - Examples: Client support sessions, team meetings

4. **Historical Materials** 📜
   - Process historical documents
   - Expected output: Historical Context, Timeline Events
   - Examples: Loves Creek history, community timeline

5. **Research Interviews** 🎤
   - Transform research into accessible knowledge
   - Expected output: Research Insights, Community Perspectives
   - Examples: Community research, academic interviews

**How to Process Documents**:
1. Select document type by clicking its card
2. Click **Select Files** button
3. Choose files (PDF, DOCX, TXT, MP3, WAV, M4A)
4. Files upload and process automatically
5. View results in "Processed Documents" section showing:
   - Stories extracted
   - Insights found
   - Quotes captured
   - Themes identified

### Cultural Review Tab

Shows cultural review center with:
- Stats for content pending cultural review
- LiveContentPreview component
- Cultural protocol information

---

## 2. Content Dashboard

**Access**: Navigate to `/content-dashboard` or click from Staff Portal

This is the comprehensive content management hub with 5 sections:

### Overview Section

**Content Type Cards**:
- **Story Creation** 📖
  - Create and edit community stories with cultural oversight
  - Click "Open Story Editor" to start

- **Media Management** 📸
  - Upload and organize photos, videos, audio
  - Click "Open Media Manager" to access

- **Content Seeding** 🌱
  - Populate platform with sample content
  - Click "Open Content Seeder" to start

**Quick Actions**:
- ✏️ Create New Story
- 📝 Write Blog Post
- 📤 Upload Media
- 👀 Review Content

**Content Statistics** (displayed in cards):
- **12** Stories Published
- **8** Blog Posts
- **45** Media Files
- **3** Pending Review

### Story Editor Section

Complete story creation and editing interface:

**Story Fields**:
- **Story Title*** (required)
- **Storyteller*** (required) - Select from dropdown
- **Story Category** - Choose from:
  - 👤 Personal Experience
  - 🪃 Cultural Knowledge
  - 👨‍👩‍👧‍👦 Family History
  - 🎭 Community Events
  - 🔥 Traditional Practices
  - 🌱 Youth Experiences
  - 🌈 Healing Journey
  - 🏆 Achievements

- **Story Content*** (required) - Full story text
  - Shows character count and estimated read time

- **Tags** - Add searchable keywords
  - Quick tags: Family, Culture, Community, Healing, Youth, Education, Traditional Knowledge, Personal Growth
  - Press Enter to add custom tags

- **Privacy Level** - Who can see this story:
  - 🌐 **Public** - Visible to everyone
  - 👥 **Community** - Visible to Oonchiumpa community
  - 🏢 **Organization** - Visible to organization members only
  - 🔒 **Private** - Only storyteller and admins

- **Story Media** 📸
  - Attach photos, videos, or documents
  - Click "Add Media" to upload files

**How to Create a Story**:
1. Enter story title
2. Select storyteller from dropdown
3. Choose story category
4. Write story content in large text area
5. Add relevant tags
6. Select privacy level
7. Optionally attach media files
8. Click **Save Story** button

### Media Management Section

**Media Upload Section**:
- Drag & drop interface for uploading files
- Supports multiple file formats
- Set category and tags during upload
- Maximum 10 files at once

**Media Gallery**:
- Grid view of all uploaded media
- Shows thumbnails, titles, types
- Fullscreen view available
- Metadata display (date, size, tags)
- Filter by category

### Content Seeder Section

Bootstrap platform with sample content:
- Generate authentic sample stories
- Create sample blog posts
- Populate with realistic data
- Represents Oonchiumpa's work and values

**How to Use**:
1. Click "Open Content Seeder"
2. Choose content types to generate
3. Review and approve generated samples
4. Content appears across the platform

### User Management Section

**Admin-only access** - Manage team members:
- View all users and roles
- Create new user accounts
- Assign permissions
- Deactivate users
- View user activity

**User Roles**:
- **Admin** - Full access to all features
- **Editor** - Create and edit content
- **Contributor** - Submit content for review
- **Elder** - Cultural review and approval

---

## 3. Blog Management

**Access**: Navigate to `/blog` or click "Blog" in main navigation

### Viewing Published Blog Posts

The blog page shows:
- **Stats Dashboard** at top:
  - Total Stories
  - Weekly Views
  - Engagement Rate
  - Cultural Insights count

- **Category Filter** buttons:
  - 📚 All Stories
  - 🏘️ Community Stories
  - 🪃 Cultural Insights
  - 🌱 Youth Work
  - 📜 Historical Truth
  - ✨ Transformation

- **Blog Post Cards** showing:
  - Hero image (if available)
  - Category badge
  - Read time
  - Cultural review status (✓ Elder Approved)
  - Title and excerpt
  - Tags
  - Photo gallery indicator
  - Author name
  - Published date

**How to Use**:
1. Filter by category to find specific content types
2. Click any post card to read full article
3. Review stats to monitor engagement

### Publishing New Blog Posts

**From Blog Page**:
- Click **Publish New Story** button (top right)
- This generates a new blog post with:
  - Sample title and content
  - Professional formatting
  - Tags and metadata
  - Cultural review status

**Note**: Currently uses demo generation. Future integration will connect to Story Editor for custom blog creation.

---

## 4. Media Manager

**Access**: Navigate to `/media-manager` or click from Staff Portal

### Media Manager Tabs

**1. All Media**
- View all uploaded photos and files
- Grid or list view
- Search and filter
- Sort by date, name, type

**2. Team Photos**
- Photos of Oonchiumpa team members
- Tagged for staff profiles
- Bio and headshot management

**3. Story Media**
- Photos attached to community stories
- Organized by story
- Tagged by topic/theme

**4. Service Photos**
- Photos of Oonchiumpa programs:
  - Youth Mentorship
  - True Justice
  - Atnarpa Homestead
  - Cultural Brokerage
- Tagged by service area

**5. Upload New**
- Multi-file upload interface
- Set category during upload
- Add tags and descriptions
- Automatic organization

**How to Upload Photos**:
1. Go to "Upload New" tab
2. Click "Select Files" or drag & drop
3. Choose category (Team, Story, Service)
4. Add title and description
5. Add tags for searchability
6. Click "Upload"
7. Photos appear in respective category tabs

**How to Manage Photos**:
1. Navigate to appropriate tab
2. Find photo in grid view
3. Click photo to view details
4. Edit metadata (title, tags, description)
5. Delete if needed (admin only)
6. Tag photos to connect with stories/services

---

## 5. Editing Site Content

### Editing Service Pages

Currently service content is in React components. To edit:

**Services Available**:
1. Youth Mentorship & Cultural Healing
2. True Justice: Deep Listening on Country
3. Atnarpa Homestead On-Country Experiences
4. Cultural Brokerage & Service Navigation

**How to Update** (requires code access):
1. Open `oonchiumpa-app/src/pages/ServicesPage.tsx`
2. Find the service data array
3. Edit text, stats, or descriptions
4. Redeploy to Vercel

**Future Enhancement**: Service content will move to database for easier editing via admin panel.

### Editing About Page Content

**Current Team Members Displayed**:
- Kristy Bloomfield - CEO
- Tanya Turner - Senior Program Manager

**How to Update** (requires code access):
1. Open `oonchiumpa-app/src/pages/AboutPage.tsx`
2. Update team member data
3. Add/remove team cards
4. Redeploy to Vercel

### Editing Impact Page

**Impact Stats Currently Shown**:
- 150+ youth participants
- 32+ partner organizations
- 7 language groups
- 8 communities served

**Interactive Map**:
- Shows Central Australia region
- Marks 8 community locations
- 150km service radius around Alice Springs

**How to Update** (requires code access):
1. Open `oonchiumpa-app/src/pages/ImpactPage.tsx`
2. Update statistics
3. Modify community locations in map data
4. Redeploy to Vercel

---

## Common Admin Workflows

### Publishing a New Story

1. **Login** to staff portal
2. **Navigate** to Content Dashboard
3. **Click** "Story Editor" section
4. **Fill in** all required fields:
   - Title
   - Storyteller
   - Content
5. **Add** tags and category
6. **Select** privacy level
7. **Upload** photos if available
8. **Click** "Save Story"
9. Story goes to cultural review queue
10. After approval, appears on Stories page

### Processing Interview Documents

1. **Login** to staff portal
2. **Go to** "Document Processing" tab
3. **Select** document type (e.g., "Research Interviews")
4. **Click** "Select Files"
5. **Choose** interview transcript files
6. **Wait** for processing (shows progress bar)
7. **Review** extracted content:
   - Stories found
   - Key insights
   - Themes identified
8. **Use** extracted content to create blog posts or stories

### Managing Team Photos

1. **Login** to staff portal
2. **Navigate** to Media Manager
3. **Click** "Team Photos" tab
4. **Upload** new headshots via "Upload New" tab
5. **Tag** photos with team member names
6. **Add** descriptions and bios
7. Photos automatically available for:
   - About page
   - Team profiles
   - Blog author cards

### Reviewing Content Before Publication

1. **Login** as admin
2. **Go to** Staff Portal → Cultural Review tab
3. **View** pending content queue
4. **Check** cultural sensitivity
5. **Verify** community consent obtained
6. **Approve** or request changes
7. Approved content moves to published state

---

## Cultural Protocols

All admin activities must follow cultural protocols:

### Before Publishing Content

✅ **Community Leadership**
- All content guided by Traditional Owners
- Elder consultation for cultural material

✅ **Elder Approval**
- Cultural review required before publication
- Sacred content needs specific approval

✅ **Privacy Respected**
- Community consent obtained for all shared content
- Family conversations have additional privacy

✅ **Cultural Sensitivity**
- Historical materials fact-checked
- Traditional knowledge handled respectfully

### When Processing Documents

⚠️ **Required Reviews**:
- Personal stories require consent
- Traditional knowledge needs Elder consultation
- Family content has privacy considerations
- Historical materials checked against community knowledge

---

## Troubleshooting

### Can't Login?
- Check credentials match exactly
- Clear browser cache
- Try incognito/private window
- Contact admin if account locked

### Story Won't Save?
- Ensure all required fields filled (marked with *)
- Check storyteller is selected
- Verify content has text
- Check browser console for errors

### Photo Upload Failing?
- Check file size (max 10MB per file)
- Verify file format (JPG, PNG, GIF, PDF)
- Try fewer files at once
- Check internet connection

### Content Not Appearing on Site?
- Verify privacy level is set to "Public"
- Check cultural review status (must be approved)
- Wait a few minutes for cache to clear
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Can't Access Admin Features?
- Verify you're logged in (check for username in nav)
- Check user role has permissions
- Some features are admin-only
- Contact system admin for role changes

---

## Support and Training

### Getting Help
- **Documentation**: This guide
- **User Management Guide**: `/USER-MANAGEMENT-GUIDE.md`
- **Technical Issues**: Contact system administrator
- **Cultural Questions**: Consult with Elders

### Training Resources
- **Media Library Documentation**: `/MEDIA-LIBRARY-README.md`
- **Partners Manager Guide**: See previous session notes
- **Content Creation Best Practices**: Coming soon

### Feature Requests
- Submit via GitHub if technical
- Discuss with leadership team
- Cultural features require community consultation

---

## Quick Reference Card

```
LOGIN: https://www.fromthecentre.com/login
Email: test@oonchiumpa.org
Password: OonchiumpaTest2024!

MAIN SECTIONS:
• Staff Portal (/staff-portal)
  - Content Creation
  - Document Processing
  - Cultural Review

• Content Dashboard (/content-dashboard)
  - Story Editor
  - Media Manager
  - Content Seeder

• Blog (/blog)
  - View posts
  - Publish stories

• Media Manager (/media-manager)
  - Upload photos
  - Organize media
  - Tag content

QUICK ACTIONS:
✏️ Create story: Content Dashboard → Story Editor
📝 Write blog: Blog → Publish New Story
📤 Upload photo: Media Manager → Upload New
👀 Review content: Staff Portal → Cultural Review
```

---

**Last Updated**: October 26, 2025
**Platform Version**: Production (fromthecentre.com)
**Test Account**: test@oonchiumpa.org (Admin access)
