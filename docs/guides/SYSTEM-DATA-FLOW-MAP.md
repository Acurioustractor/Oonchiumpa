# Oonchiumpa System - Complete Data Flow & Storage Map

**Date:** October 26, 2025
**Purpose:** Show where everything is saved and how data flows through the system

---

## 🗄️ DATABASE STRUCTURE (Supabase PostgreSQL)

**Database URL:** https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor

### Core Tables & What They Store

#### 1. **`transcripts`** - Documents & Interviews
**Stores:** Uploaded documents, interview recordings, transcripts

**Key Fields:**
```sql
- id (UUID) - Unique identifier
- title (TEXT) - Document title
- transcript_content (TEXT) - Full text content
- video_url (TEXT) - Video file URL in storage
- audio_url (TEXT) - Audio file URL in storage
- storyteller_id (UUID) - Who uploaded/created it
- tenant_id (UUID) - Organization (Oonchiumpa)
- status (TEXT) - pending, processing, completed
- created_at (TIMESTAMP)
```

**Where Used:**
- Documents Page: `/staff-portal/documents`
- Document Analysis: `/staff-portal/documents/:id/analysis`
- Staff Portal Dashboard: Shows recent uploads

**How to Access:**
```typescript
const { data } = await supabase
  .from('transcripts')
  .select('*')
  .eq('tenant_id', OONCHIUMPA_TENANT_ID);
```

---

#### 2. **`outcomes`** - Impact Framework Outcomes ✨ NEW!
**Stores:** Measurable outcomes from all programs (26 currently loaded)

**Key Fields:**
```sql
- id (UUID)
- organization_id (UUID) - Oonchiumpa org
- tenant_id (UUID) - Oonchiumpa tenant
- title (TEXT) - Outcome name
- description (TEXT)
- outcome_type (TEXT) - individual/program/community/systemic
- outcome_level (TEXT) - output/short_term/medium_term/long_term/impact
- service_area (TEXT) - youth_mentorship/true_justice/atnarpa_homestead/cultural_brokerage/good_news_stories
- indicator_name (TEXT) - What's being measured
- baseline_value (NUMERIC) - Starting point
- target_value (NUMERIC) - Goal
- current_value (NUMERIC) - Current progress
- unit (TEXT) - %, count, hours, etc.
- participant_count (INT)
- elder_involvement (BOOLEAN)
- on_country_component (BOOLEAN)
- traditional_knowledge_transmitted (BOOLEAN)
- qualitative_evidence (TEXT[]) - Array of quotes
- success_stories (TEXT[]) - Array of stories
- challenges (TEXT[])
- source_document_ids (UUID[]) - Links to transcripts
- measurement_date (DATE)
```

**Where Used:**
- Impact Overview: `/staff-portal/impact`
- Service Dashboards: `/staff-portal/impact/:serviceArea`
- Impact Reports: `/staff-portal/impact/report`
- Add Outcome Form: `/staff-portal/impact/add-outcome`

**How to Access:**
```typescript
const { data } = await supabase
  .from('outcomes')
  .select('*')
  .eq('organization_id', OONCHIUMPA_ORG_ID)
  .eq('service_area', 'youth_mentorship');
```

**Current Data:**
- 26 outcomes total
- 14 Youth Mentorship outcomes
- 8 True Justice outcomes
- 8 Good News Stories outcomes
- 2 Atnarpa Homestead outcomes
- 2 Cultural Brokerage outcomes

---

#### 3. **`activities`** - Program Activities
**Stores:** All activities that produce outcomes (ready, 0 records currently)

**Key Fields:**
```sql
- id (UUID)
- organization_id (UUID)
- title (TEXT) - Activity name
- activity_type (TEXT) - mentoring_session/on_country_camp/deep_listening_circle/etc.
- service_area (TEXT)
- activity_date (DATE) - When it happened
- location (TEXT)
- participant_count (INT)
- elder_involvement (BOOLEAN)
- on_country (BOOLEAN)
- traditional_knowledge_shared (BOOLEAN)
- participant_feedback (TEXT[])
- related_outcome_ids (UUID[]) - Links to outcomes
```

**Where Used:**
- Service Dashboards (when populated)
- Activity tracking forms (to be built)

---

#### 4. **`document_outcomes`** - Links Documents to Outcomes
**Stores:** Connections between documents and outcomes (26 links currently)

**Key Fields:**
```sql
- id (UUID)
- document_id (UUID) - Links to transcripts
- outcome_id (UUID) - Links to outcomes
- evidence_type (TEXT) - quantitative/qualitative/mixed
- extraction_method (TEXT) - manual/ai_extracted/verified
- evidence_text (TEXT) - Quote or data from document
- confidence_score (NUMERIC)
```

**Where Used:**
- Document Analysis pages
- Impact reports showing evidence

---

#### 5. **`stories`** - Community Stories
**Stores:** Published stories for public website

**Key Fields:**
```sql
- id (UUID)
- organization_id (UUID)
- title (TEXT)
- story_category (TEXT)
- content (TEXT)
- is_public (BOOLEAN)
- featured_image_url (TEXT)
- video_url (TEXT)
- created_at (TIMESTAMP)
```

**Where Used:**
- Stories Page: `/stories`
- Story Detail: `/stories/:id`

---

#### 6. **`gallery_photos`** - Photos & Media
**Stores:** All uploaded photos and videos

**Key Fields:**
```sql
- id (UUID)
- title (TEXT)
- filename (TEXT)
- photo_url (TEXT) - URL in Supabase storage
- thumbnail_url (TEXT)
- gallery_id (UUID) - Which gallery it belongs to
- service_area (TEXT) - NEW! For filtering
- linked_outcome_id (UUID) - NEW! Links to outcomes
- tags (TEXT[]) - NEW! For organization
- created_at (TIMESTAMP)
```

**Where Used:**
- Enhanced Media Manager: `/staff-portal/media-manager`
- Service detail pages
- Gallery displays

**How to Access:**
```typescript
const { data } = await supabase
  .from('gallery_photos')
  .select('*')
  .eq('service_area', 'atnarpa_homestead');
```

---

#### 7. **`blog_posts`** - Blog Articles
**Stores:** Published blog posts

**Key Fields:**
```sql
- id (UUID)
- project_id (UUID)
- title (TEXT)
- content (TEXT)
- excerpt (TEXT)
- status (TEXT) - draft/published
- featured_image_url (TEXT)
- published_at (TIMESTAMP)
```

**Where Used:**
- Blog Page: `/blog`
- Blog Post Detail: `/blog/:id`

---

#### 8. **`profiles`** - Users & Staff
**Stores:** User accounts, staff members

**Key Fields:**
```sql
- id (UUID)
- tenant_id (UUID)
- email (TEXT)
- name (TEXT)
- role (TEXT)
- tenant_roles (TEXT[])
```

**Where Used:**
- Login system
- Staff Portal access control
- Empathy Ledger permissions

---

## 📁 FILE STORAGE (Supabase Storage Buckets)

**Storage URL:** https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage/buckets

### Storage Buckets

#### 1. **`media`** Bucket
**Stores:** General media files
- Photos uploaded via Media Manager
- Videos
- Audio files

**Access Pattern:**
```typescript
const { data } = await supabase.storage
  .from('media')
  .list();
```

#### 2. **`photos`** Bucket
**Stores:** Photo galleries
- Service photos (Atnarpa trips, etc.)
- Team photos
- Event photos

#### 3. **`story-media`** Bucket
**Stores:** Media linked to stories
- Story hero images
- Story videos
- Story photo galleries

#### 4. **`documents`** Bucket (if exists)
**Stores:** Uploaded documents
- PDFs
- Word documents
- Interview recordings

---

## 🔄 DATA FLOW: From Upload to Display

### Flow 1: Document Upload → Analysis → Outcomes

```
1. UPLOAD
   User uploads document at /staff-portal/documents
   ↓
   Document Upload Component → Supabase Storage (documents bucket)
   ↓
   Record created in `transcripts` table

2. PROCESSING
   AI Analysis (analyze-documents-ai.ts)
   ↓
   Extracts outcomes, activities, quotes
   ↓
   Results saved to document-analysis-results.json

3. IMPORT
   Import script (import-outcomes-to-database.ts)
   ↓
   Creates records in `outcomes` table
   ↓
   Creates links in `document_outcomes` table

4. DISPLAY
   Impact Overview Page reads from `outcomes` table
   ↓
   Shows on dashboards: /staff-portal/impact
```

### Flow 2: Photo Upload → Tagging → Service Gallery

```
1. UPLOAD
   User uploads photos at /staff-portal/media-manager
   ↓
   MediaUpload Component → Supabase Storage (media bucket)
   ↓
   Record created in `gallery_photos` table

2. TAGGING
   User selects photos and applies bulk tags
   ↓
   Updates `gallery_photos` with:
     - service_area
     - linked_outcome_id
     - tags[]

3. DISPLAY
   Service Galleries Tab reads `gallery_photos`
   ↓
   Filters by service_area
   ↓
   Shows in organized galleries
```

### Flow 3: Staff Adds New Outcome

```
1. FORM
   User fills out form at /staff-portal/impact/add-outcome
   ↓
   AddOutcomeForm Component

2. SAVE
   Form submits to Supabase
   ↓
   INSERT into `outcomes` table
   ↓
   Automatically links to organization_id and tenant_id

3. DISPLAY
   Impact Overview immediately shows new outcome
   ↓
   Available in reports
   ↓
   Available for linking photos
```

---

## 🔗 HOW EVERYTHING CONNECTS

### Connection Map

```
transcripts (documents)
    ↓
    ├─→ document_outcomes (links)
    │       ↓
    │       └─→ outcomes (impact data)
    │               ↓
    │               ├─→ Impact Overview Page
    │               ├─→ Impact Reports
    │               └─→ Service Dashboards
    │
    └─→ gallery_photos (media)
            ↓
            ├─→ linked_outcome_id → outcomes
            ├─→ service_area → Service Galleries
            └─→ tags → Filtering
```

### Key Relationships

1. **Documents → Outcomes**
   - `document_outcomes.document_id` → `transcripts.id`
   - `document_outcomes.outcome_id` → `outcomes.id`

2. **Photos → Outcomes**
   - `gallery_photos.linked_outcome_id` → `outcomes.id`

3. **Outcomes → Services**
   - `outcomes.service_area` = service identifier
   - Groups outcomes by program

4. **Activities → Outcomes**
   - `activities.related_outcome_ids[]` → `outcomes.id`

---

## 🎯 EMPATHY LEDGER ALIGNMENT

### Where Empathy Ledger Data Goes

**Current Empathy Ledger Tables:**
```
empathy_entries
knowledge_threads
story_elements
cultural_protocols
```

### Recommended Integration Points

#### 1. **Empathy Ledger → Transcripts**
When a story is captured in Empathy Ledger:
```sql
INSERT INTO transcripts (
  title,
  transcript_content,
  storyteller_id,
  tenant_id,
  status
) VALUES (
  empathy_entry.title,
  empathy_entry.narrative,
  empathy_entry.participant_id,
  OONCHIUMPA_TENANT_ID,
  'completed'
);
```

#### 2. **Empathy Ledger → Outcomes**
When evidence of impact is captured:
```sql
INSERT INTO outcomes (
  title,
  description,
  outcome_level,
  service_area,
  indicator_name,
  qualitative_evidence,
  success_stories,
  elder_involvement,
  traditional_knowledge_transmitted
) VALUES (
  empathy_entry.impact_indicator,
  empathy_entry.impact_description,
  'short_term', -- or calculate from timeline
  empathy_entry.program_area,
  empathy_entry.indicator_name,
  ARRAY[empathy_entry.key_quote],
  ARRAY[empathy_entry.success_story],
  empathy_entry.elder_present,
  empathy_entry.cultural_knowledge_shared
);
```

#### 3. **Empathy Ledger → Stories**
When ready to publish:
```sql
INSERT INTO stories (
  organization_id,
  title,
  content,
  story_category,
  is_public,
  featured_image_url
) VALUES (
  OONCHIUMPA_ORG_ID,
  empathy_entry.title,
  empathy_entry.formatted_narrative,
  empathy_entry.category,
  empathy_entry.approved_for_publication,
  empathy_entry.photo_url
);
```

---

## 📊 CURRENT DATA SUMMARY

### What's Already in the System

**Transcripts:**
- 32+ documents uploaded
- Mix of interviews, reports, stories
- 16 analyzed by AI

**Outcomes:**
- 26 outcomes loaded
- Across 5 service areas
- Linked to 16 documents

**Photos:**
- Gallery photos in `gallery_photos` table
- Service-specific photos available
- 13 Atnarpa photos tagged

**Stories:**
- Community stories in `stories` table
- Some published, some in review

---

## 🛠️ IMPLEMENTATION WORKFLOW

### Recommended Process: Empathy Ledger → Impact Framework

**Step 1: Capture in Empathy Ledger**
- Record interviews, observations, cultural knowledge
- Tag with service area, participants, cultural protocols
- Mark Elder involvement, on-country activities

**Step 2: Extract Impact Data**
- Identify outcomes from narratives
- Classify by outcome level (output → impact)
- Extract quantitative metrics where available
- Pull out key quotes and success stories

**Step 3: Import to Impact Framework**
Create script: `empathy-to-impact-sync.ts`
```typescript
// Reads from empathy_entries
// Transforms to outcomes format
// Inserts into outcomes table
// Links to source documents
```

**Step 4: Link Media**
- Upload photos captured during sessions
- Tag with service area
- Link to specific outcomes
- Add to appropriate galleries

**Step 5: Generate Reports**
- Impact Framework automatically includes new outcomes
- Photos appear as visual evidence
- Stories support narrative
- Ready for funder reports

---

## 🔍 WHERE TO FIND EVERYTHING

### For Developers

**Database:**
- Supabase Dashboard: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor
- SQL Editor: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql
- Storage: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage/buckets

**Code:**
- Tables schema: `/create-outcomes-schema.sql`
- Import scripts: `/import-outcomes-to-database.ts`
- Components: `/oonchiumpa-app/src/components/`
- Pages: `/oonchiumpa-app/src/pages/`

### For Staff

**Add Data:**
- Upload documents: http://localhost:3001/staff-portal/documents
- Add outcomes: http://localhost:3001/staff-portal/impact/add-outcome
- Upload photos: http://localhost:3001/staff-portal/media-manager

**View Data:**
- Impact overview: http://localhost:3001/staff-portal/impact
- Service dashboards: http://localhost:3001/staff-portal/impact/:service
- Generate reports: http://localhost:3001/staff-portal/impact/report
- Media galleries: http://localhost:3001/staff-portal/media-manager

---

## 🎯 NEXT STEPS: Empathy Ledger Integration

### Recommended Implementation

1. **Create Bridge Script**
   ```
   empathy-ledger-sync.ts
   - Reads empathy_entries table
   - Extracts impact indicators
   - Maps to outcomes structure
   - Inserts with proper relationships
   ```

2. **Add Empathy Ledger UI to Staff Portal**
   ```
   New page: /staff-portal/empathy-ledger
   - Capture stories
   - Tag cultural elements
   - Mark for publication
   - Extract impact data
   - Auto-sync to Impact Framework
   ```

3. **Unified Dashboard**
   ```
   /staff-portal
   - Shows Empathy Ledger entries
   - Shows Impact Framework outcomes
   - Shows linkages between them
   - One source of truth
   ```

---

## 📋 SUMMARY TABLE: Where Everything Lives

| Data Type | Table | Storage Bucket | UI Location | API Access |
|-----------|-------|----------------|-------------|------------|
| Documents | `transcripts` | `documents` | `/staff-portal/documents` | `supabase.from('transcripts')` |
| Outcomes | `outcomes` | - | `/staff-portal/impact` | `supabase.from('outcomes')` |
| Photos | `gallery_photos` | `media`, `photos` | `/staff-portal/media-manager` | `supabase.from('gallery_photos')` |
| Stories | `stories` | `story-media` | `/stories` | `supabase.from('stories')` |
| Activities | `activities` | - | TBD | `supabase.from('activities')` |
| Links | `document_outcomes` | - | Analysis pages | `supabase.from('document_outcomes')` |
| Users | `profiles` | - | Login system | `supabase.from('profiles')` |
| Blog | `blog_posts` | - | `/blog` | `supabase.from('blog_posts')` |

---

**This map shows the complete data architecture of the Oonchiumpa system!** Use this to plan your Empathy Ledger integration and understand how data flows from capture → storage → display → reporting.
