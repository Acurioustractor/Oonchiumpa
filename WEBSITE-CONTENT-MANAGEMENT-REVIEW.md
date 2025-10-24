# Website Content Management Review & Recommendations
**Oonchiumpa / From the Centre**
**Date:** October 2025
**Site:** www.fromthecentre.com

---

## Executive Summary

This document reviews the current website structure, identifies content types by change frequency, evaluates 5 potential admin system options, and provides prioritized recommendations for sustainable content management.

**Quick Recommendation:** Start with **Option 5 (Minimal Admin CMS)** as the highest-impact, lowest-effort foundation, then gradually layer on **Option 1** features as needed.

---

## 1. Current Website Structure

### 1.1 Static Content (Rarely Changes)
These are **hardcoded in React components** and require developer changes:

#### About Page ([AboutPage.tsx](oonchiumpa-app/src/pages/AboutPage.tsx))
- **Team Members** (lines 11-30): Kristy Bloomfield, Tanya Turner
- **Impact Stats** (lines 32-69): 95% diversion success, 97.6% cost-effective, etc.
- **Core Values** (lines 71-96): Cultural Authority, Aboriginal-Led Solutions, etc.
- **Recognition Items** (lines 98-115): NIAA funding, Operation Luna success
- **Partner Organizations** (lines 506-540): 30+ partner list

**Change Frequency:** 1-2 times per year (team changes, stat updates)

#### Services Page ([ServicesPage.tsx](oonchiumpa-app/src/pages/ServicesPage.tsx))
- **4 Service Cards** (lines 10-86):
  1. Youth Mentorship & Cultural Healing
  2. True Justice: Deep Listening on Country (Law Students)
  3. Atnarpa Homestead On-Country Experiences
  4. Cultural Brokerage & Service Navigation
- **Service Images** (lines 15, 33, 52, 71): Currently from Supabase storage
- **Service Features**: Lists of what's included in each service

**Change Frequency:** 2-4 times per year (service updates, photo changes)

#### Impact Page - Static Sections
- **Leadership Voices** ([leadershipVoices.ts](oonchiumpa-app/src/data/leadershipVoices.ts)): Kristy & Tanya quotes
- **Community Voices** ([communityVoices.ts](oonchiumpa-app/src/data/communityVoices.ts)): 6 testimonials from law students, youth, families

**Change Frequency:** 2-3 times per year (new testimonials)

#### Navigation & Footer
- **Navigation Menu** ([Navigation.tsx](oonchiumpa-app/src/components/Navigation.tsx)): Main menu structure
- **Footer Links** ([Layout.tsx](oonchiumpa-app/src/components/Layout.tsx), lines 92-120): Simplified to 3 sections

**Change Frequency:** Rarely (major structural changes only)

---

### 1.2 Dynamic Content (Changes Frequently)
These are **stored in Supabase database** and already have admin interfaces:

#### Stories
- **Location**: `stories` table in Supabase
- **Count**: 301 stories in database
- **Current Admin**: [StoriesPage.tsx](oonchiumpa-app/src/pages/StoriesPage.tsx) with filtering
- **Change Frequency**: **Weekly/Monthly** - active content creation

#### Blog Posts
- **Location**: `blog_posts` table in Supabase
- **Count**: 4 blog posts currently
- **Current Admin**: [BlogPage.tsx](oonchiumpa-app/src/pages/BlogPage.tsx)
- **Change Frequency**: **Monthly** - regular updates expected

#### Photo Galleries
- **Location**: `photo_galleries` and `gallery_photos` tables
- **Count**: 6 galleries, 2 photos currently in `gallery_photos`
- **Current Admin**: [MediaManagerPage.tsx](oonchiumpa-app/src/pages/MediaManagerPage.tsx) exists
- **Change Frequency**: **Monthly** - photo uploads for stories/events

#### Service Photos
- **Location**: Supabase storage at `media/services/`
- **Count**: 4 hero images for service cards
- **Current Admin**: Manual upload via scripts
- **Change Frequency**: **Quarterly** - occasional updates

---

### 1.3 Existing Admin Pages

The site already has several admin interfaces built:

1. **[AdminPage.tsx](oonchiumpa-app/src/pages/AdminPage.tsx)** - Main admin dashboard
2. **[ContentDashboardPage.tsx](oonchiumpa-app/src/pages/ContentDashboardPage.tsx)** - Content overview
3. **[MediaManagerPage.tsx](oonchiumpa-app/src/pages/MediaManagerPage.tsx)** - Photo management
4. **[StorytellerDashboard.tsx](oonchiumpa-app/src/pages/StorytellerDashboard.tsx)** - Story creation interface
5. **[DashboardPage.tsx](oonchiumpa-app/src/pages/DashboardPage.tsx)** - Analytics dashboard
6. **[GalleryUploadPage.tsx](oonchiumpa-app/src/pages/GalleryUploadPage.tsx)** - Photo gallery uploads

**Status**: These pages exist but may need:
- Route protection (authentication)
- Polish and UX improvements
- Connection to all content types

---

## 2. Content Change Frequency Analysis

### High Frequency (Weekly/Monthly)
✅ **Already have admin interfaces:**
- Stories (301 items) - Storyteller Dashboard exists
- Blog Posts (4 items) - Blog admin exists
- Photos/Galleries - Media Manager exists

### Medium Frequency (Quarterly/2-4x per year)
⚠️ **Need simple admin interfaces:**
- Service card photos (4 images)
- Service descriptions and features
- Impact statistics

### Low Frequency (1-2x per year)
⚠️ **Could use admin, but manual edits acceptable:**
- Team member information
- Partner organization lists
- Community testimonials
- Core values and recognition

### Very Low Frequency (Structural changes)
✅ **Manual code edits appropriate:**
- Navigation menu structure
- Page layouts
- Footer organization

---

## 3. Evaluation of 5 Admin Options

### Option 1: Complete Admin Experience
**Description**: Full-featured admin for stories, services, programs, team, testimonials, photos

**Complexity**: ⭐⭐⭐⭐⭐ (Very High)
- Build admin UI for every content type
- Create database tables for currently hardcoded content
- Implement authentication and permissions
- Build wysiwyg editors and form builders

**Impact**: ⭐⭐⭐⭐⭐ (Very High)
- Any staff member can update any content
- No developer needed for routine changes
- Full control over entire site

**Time to Implement**: 6-8 weeks full-time development

**Recommendation**: 🟡 **Phase 3** - Implement gradually after foundational systems work

---

### Option 2: Enhance User Profile Experience
**Description**: Rich profiles with photo upload, bios, story connections

**Complexity**: ⭐⭐⭐ (Medium)
- Photo upload interface exists (Media Manager)
- Need profile editing UI
- Connect profiles to stories

**Impact**: ⭐⭐⭐ (Medium)
- Better storyteller engagement
- Richer community presence
- Not directly helping main content updates

**Time to Implement**: 2-3 weeks

**Recommendation**: 🟡 **Phase 4** - Nice to have, but not urgent for content management

---

### Option 3: Build People Directory
**Description**: Filterable directory of community members, storytellers, partners

**Complexity**: ⭐⭐⭐ (Medium)
- Need directory UI with filters
- Search functionality
- Profile system integration

**Impact**: ⭐⭐ (Low-Medium)
- Good for discovery
- Not addressing immediate pain points
- More about features than maintenance

**Time to Implement**: 2-3 weeks

**Recommendation**: 🔴 **Phase 5** - Lowest priority for current content management needs

---

### Option 4: Improve Signup/Onboarding Flow
**Description**: Multi-step signup, email verification, rich onboarding

**Complexity**: ⭐⭐⭐⭐ (High)
- Email service integration
- Multi-step form flows
- Verification system
- Welcome email sequences

**Impact**: ⭐⭐ (Low)
- Better user experience
- Not addressing content management
- Different problem domain

**Time to Implement**: 3-4 weeks

**Recommendation**: 🔴 **Future Consideration** - Not relevant to immediate content management goals

---

### Option 5: Content Management System (Minimal Admin CMS)
**Description**: Simple admin interface for static content that changes quarterly - services, stats, testimonials, team, photos

**Complexity**: ⭐⭐ (Low-Medium)
- Polish existing admin pages
- Add authentication/routing protection
- Create simple forms for medium-frequency content:
  - Service card editor (photos, descriptions, features)
  - Impact stats editor
  - Team member editor
  - Testimonial manager
- Leverage existing Media Manager for photos

**Impact**: ⭐⭐⭐⭐⭐ (Very High)
- **Addresses 80% of pain points with 20% of effort**
- Staff can update services, stats, photos without developer
- Works with existing admin infrastructure
- Immediate practical value

**Time to Implement**: 1-2 weeks

**Recommendation**: 🟢 **Phase 1 - START HERE** - Highest impact, lowest effort

---

## 4. Prioritized Recommendations

### 🟢 Phase 1: Polish Existing Admin + Minimal CMS (1-2 weeks)

**Start Here - Highest Value, Lowest Effort**

1. **Secure Existing Admin Pages**
   - Add authentication to all `/admin/*` routes
   - Create simple login page if needed
   - Use existing Supabase auth

2. **Service Card Editor**
   ```
   Admin panel to edit:
   - Service title, description
   - Service features list
   - Hero image (upload via Media Manager)
   - Service order/visibility
   ```

3. **Impact Stats Editor**
   ```
   Simple form to update About page stats:
   - Percentage values (95%, 97.6%, etc.)
   - Labels and descriptions
   - Icon selection
   ```

4. **Photo Manager Integration**
   ```
   Connect existing Media Manager to:
   - Service card images
   - Team photos
   - Gallery organization
   ```

5. **Team Member Editor**
   ```
   Form to manage team info:
   - Name, role, tribe
   - Description and quote
   - Photo upload
   - Display order
   ```

**Deliverable**: Staff can independently update services, photos, and key stats

---

### 🟡 Phase 2: Testimonial & Content Manager (1-2 weeks)

**After Phase 1 is working well**

1. **Community Voices Manager**
   - Add/edit/remove testimonials
   - Upload avatar photos
   - Set display order
   - Tag by category (youth, family, law student)

2. **Partner Organization Manager**
   - Manage partner list on About page
   - Organize by category
   - Add logos if needed

3. **Content Preview System**
   - Preview changes before publishing
   - Staging vs. production toggle

**Deliverable**: Complete control over testimonials and partnership displays

---

### 🟡 Phase 3: Advanced Admin Features (2-3 weeks)

**When basic admin is solid and team wants more**

1. **Blog Post Scheduler**
   - Schedule future blog posts
   - Draft/publish workflow
   - Featured post selection

2. **Story Tagging & Organization**
   - Enhanced tagging system
   - Story series/collections
   - Related stories suggestions

3. **Analytics Dashboard Polish**
   - Story view statistics
   - Popular content tracking
   - Engagement metrics

**Deliverable**: Power features for regular content creators

---

### 🟡 Phase 4: User Experience Enhancements (2-3 weeks)

**When core CMS is complete**

1. **Rich User Profiles** (Option 2)
   - Enhanced storyteller profiles
   - Bio editing, photo uploads
   - Story connections

2. **Email Notifications**
   - New story alerts
   - Comment notifications
   - Admin activity summaries

**Deliverable**: Better engagement and communication

---

### 🔵 Phase 5: Discovery & Community Features (3-4 weeks)

**Long-term enhancements**

1. **People Directory** (Option 3)
   - Searchable community directory
   - Filter by role, language, region
   - Profile discovery

2. **Advanced Search**
   - Full-text story search
   - Filter combinations
   - Saved searches

**Deliverable**: Community discovery and connection

---

## 5. Technical Architecture Recommendations

### Database Structure for New CMS Content

Create new tables for currently hardcoded content:

```sql
-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  features jsonb, -- array of feature strings
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Team members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  tribe text,
  description text,
  quote text,
  avatar_url text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Impact stats table
CREATE TABLE impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL, -- "95%", "30+"
  label text NOT NULL,
  description text,
  icon text, -- icon name or category
  display_order int DEFAULT 0,
  section text DEFAULT 'about', -- where it appears
  is_visible boolean DEFAULT true,
  updated_at timestamp DEFAULT now()
);

-- Community testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  quote text NOT NULL,
  context text,
  avatar_url text,
  specialties jsonb,
  source text,
  impact_statement text,
  category text, -- 'youth', 'family', 'law_student', etc.
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Partner organizations table
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL, -- 'aboriginal', 'education', 'support'
  logo_url text,
  website text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);
```

### Admin Component Structure

```
oonchiumpa-app/src/pages/admin/
  ├── AdminLayout.tsx          # Shared admin layout with nav
  ├── DashboardPage.tsx        # Overview (already exists)
  ├── ServicesManager.tsx      # NEW - Edit services
  ├── TeamManager.tsx          # NEW - Edit team members
  ├── StatsManager.tsx         # NEW - Edit impact stats
  ├── TestimonialsManager.tsx  # NEW - Edit testimonials
  ├── PartnersManager.tsx      # NEW - Edit partners
  ├── MediaManager.tsx         # EXISTS - needs integration
  └── ContentPreview.tsx       # NEW - Preview before publish
```

---

## 6. Maintenance Workflow

### With Phase 1 CMS in Place

#### Updating Service Information (Quarterly)
1. Staff logs into admin at `www.fromthecentre.com/admin`
2. Navigates to "Services Manager"
3. Clicks "Edit" on service card
4. Updates description, features, or photo
5. Clicks "Save" - changes reflect immediately on site
**Time**: 5-10 minutes (no developer needed)

#### Updating Impact Statistics (1-2x per year)
1. Admin → "Impact Stats"
2. Edit percentage values and descriptions
3. Save - About page updates automatically
**Time**: 5 minutes

#### Adding New Team Member
1. Admin → "Team Manager"
2. Click "Add Team Member"
3. Fill in name, role, tribe, bio, quote
4. Upload photo via Media Manager
5. Set display order and visibility
6. Save - appears on About page
**Time**: 10 minutes

#### Changing Service Card Photos
1. Admin → "Media Manager"
2. Upload new photo to "Services" folder
3. Admin → "Services Manager"
4. Select service, click "Change Image"
5. Choose from uploaded photos
6. Save
**Time**: 5 minutes

#### Adding New Story (Already Works)
1. Storyteller Dashboard (already exists)
2. Create new story with rich editor
3. Add photos via Media Manager
4. Publish - appears on Stories page
**Time**: 20-30 minutes

---

## 7. Cost-Benefit Analysis

### Option Comparison

| Option | Complexity | Impact | Time | Phase | Priority |
|--------|-----------|--------|------|-------|----------|
| **Option 5: Minimal CMS** | ⭐⭐ | ⭐⭐⭐⭐⭐ | 1-2 weeks | Phase 1 | 🟢 HIGH |
| Option 1: Full Admin | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 6-8 weeks | Phase 3 | 🟡 MEDIUM |
| Option 2: User Profiles | ⭐⭐⭐ | ⭐⭐⭐ | 2-3 weeks | Phase 4 | 🟡 LOW |
| Option 3: People Directory | ⭐⭐⭐ | ⭐⭐ | 2-3 weeks | Phase 5 | 🔴 LOWEST |
| Option 4: Signup Flow | ⭐⭐⭐⭐ | ⭐⭐ | 3-4 weeks | Future | 🔴 LOWEST |

### Why Start with Option 5 (Minimal CMS)?

**80/20 Rule in Action:**
- **80% of maintenance pain** comes from updating services, photos, stats, team info
- **20% of development effort** (1-2 weeks) solves these problems
- Leverages **existing admin infrastructure** (Media Manager, auth, database)
- Provides **immediate practical value** for staff
- **Low risk** - small, focused changes
- **Foundation** for future enhancements (Phase 2-3)

**Compare to Option 1 (Full Admin):**
- Full admin is 6-8 weeks (4x longer)
- Only marginally more useful initially
- Higher complexity = more bugs, more testing
- Can be built gradually after Phase 1 proves valuable

---

## 8. Implementation Plan

### Week 1: Foundation & Service Manager
- [ ] Add authentication to `/admin` routes
- [ ] Create `services` table in Supabase
- [ ] Build Service Manager UI with forms
- [ ] Migrate current service data to database
- [ ] Test service editing workflow

### Week 2: Stats, Team, Photos
- [ ] Create `impact_stats` and `team_members` tables
- [ ] Build Stats Manager UI
- [ ] Build Team Manager UI
- [ ] Connect Media Manager to service photos
- [ ] Test complete workflow end-to-end

### Week 3 (Optional): Polish & Documentation
- [ ] Create user documentation/guide
- [ ] Add content preview feature
- [ ] Polish admin UI/UX
- [ ] Train staff on admin system
- [ ] Monitor usage and gather feedback

---

## 9. Success Metrics

### After Phase 1 (Minimal CMS)
- ✅ Staff can update service cards without developer help
- ✅ Photo changes take 5 minutes instead of 30+ minutes
- ✅ Impact stats can be updated quarterly without code deploy
- ✅ Team information stays current without developer intervention
- ✅ Zero downtime for routine content updates

### After Phase 2 (Testimonials & Partners)
- ✅ New testimonials added within 10 minutes
- ✅ Partner list always reflects current relationships
- ✅ Content preview prevents publishing mistakes

### After Phase 3 (Advanced Features)
- ✅ Regular blog posting without technical barriers
- ✅ Story organization and discovery improved
- ✅ Analytics inform content strategy

---

## 10. Key Takeaways

### What We Have Now
✅ Great foundation: Stories, blogs, photos have admin interfaces
✅ Well-structured database with Supabase
✅ Beautiful public-facing site at www.fromthecentre.com
⚠️ Services, stats, team info require code changes
⚠️ Admin pages exist but need polish and integration

### What We Need Most
🎯 **Simple CMS for medium-frequency content** (services, stats, photos, team)
🎯 **Polish existing admin infrastructure** (auth, routing, UX)
🎯 **Staff training** on using admin tools

### Best Path Forward
1. **Start Small**: Phase 1 Minimal CMS (1-2 weeks) → immediate value
2. **Iterate**: Gather feedback, add Phase 2 features (1-2 weeks)
3. **Expand Gradually**: Add advanced features as needed (Phase 3-5)
4. **Avoid Over-Building**: Don't build what isn't needed yet

### Bottom Line
**Option 5 (Minimal CMS) as Phase 1** gives maximum return on investment:
- Shortest time to value (1-2 weeks)
- Solves 80% of maintenance pain
- Builds on existing infrastructure
- Creates foundation for future enhancements
- Low risk, high impact

---

## Next Steps

**To proceed with Phase 1 implementation:**

1. ✅ Review this document and confirm approach
2. ⏳ Create Supabase database tables for new content types
3. ⏳ Build Service Manager admin UI
4. ⏳ Build Stats Manager admin UI
5. ⏳ Build Team Manager admin UI
6. ⏳ Connect Media Manager to all photo types
7. ⏳ Add authentication to admin routes
8. ⏳ Test and refine workflows
9. ⏳ Document and train staff
10. ⏳ Launch Phase 1, gather feedback

**Questions to Consider:**
- Who will be the primary admin users? (Kristy, Tanya, other staff?)
- What authentication method is preferred? (Supabase email/password, magic links, etc.)
- Are there any specific content types missing from this analysis?
- What's the timeline/urgency for Phase 1 implementation?

---

**Document prepared for Oonchiumpa content management planning**
**Contact**: admin@oonchiumpaconsultancy.com.au
