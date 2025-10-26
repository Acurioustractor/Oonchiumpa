# Empathy Ledger Architecture - Multi-Tenant Data System

**Date**: October 25, 2025
**Purpose**: Define scalable architecture for Oonchiumpa and future organizations
**Status**: Design Phase - Implementation Required

---

## 🚨 CRITICAL ISSUES IDENTIFIED

### Issue 1: Data Isolation Not Implemented
**Current State**:
- **301 stories** in database
- **0 stories** belong to Oonchiumpa (`project_id` = null)
- **301 stories** belong to OTHER organizations
- Dashboard showing "11 Stories in Review" but they're NOT Oonchiumpa stories!

**Impact**: Oonchiumpa staff are seeing data from other organizations

### Issue 2: Missing `project_id` on Stories
**Problem**: All 301 stories have `project_id = null` or belong to different `organization_id`

**Required Fix**:
```sql
-- Stories use organization_id, not project_id
-- Need to either:
-- 1. Use organization_id consistently, OR
-- 2. Add/populate project_id field
```

### Issue 3: Document Storage Unclear
**Found**:
- `transcripts` table: 222 records
- `documents` table: doesn't exist
- No clear relationship between transcripts → stories → blog posts

---

## 📊 CURRENT DATABASE STRUCTURE

### Tables Analysis

#### 1. **stories** Table
- **Total**: 301 stories
- **Oonchiumpa**: 0 (no matching project_id)
- **Other Orgs**: 301

**Key Fields**:
```typescript
{
  id: string
  tenant_id: string              // Multi-tenant ID
  organization_id: string        // Organization ID (used instead of project_id!)
  project_id: string | null      // NULL for all stories!
  author_id: string
  storyteller_id: string | null

  // Content
  title: string
  content: string
  transcription: string | null

  // Media
  video_embed_code: string
  story_image_url: string
  media_urls: string[]
  media_metadata: json

  // Categorization
  story_category: string
  story_type: string
  themes: string[]
  cultural_themes: string[]

  // Privacy & Security
  privacy_level: string
  is_public: boolean
  is_featured: boolean
  cultural_sensitivity_level: string
  requires_elder_approval: boolean
  elder_approved_by: string
  elder_approved_at: timestamp

  // Workflow
  status: string                  // draft, published, etc.
  story_stage: string
  community_status: string

  // AI Processing
  ai_processed: boolean
  ai_processing_consent_verified: boolean
  ai_confidence_scores: json
  embedding: vector

  created_at: timestamp
  updated_at: timestamp
}
```

**Issues**:
1. Uses `organization_id` not `project_id`
2. Has `tenant_id` AND `organization_id` (redundant?)
3. No Oonchiumpa stories (all belong to other orgs)

#### 2. **blog_posts** Table
- **Total**: 4 posts
- **Oonchiumpa**: 4 (all have correct project_id!)

**Key Fields**:
```typescript
{
  id: string
  project_id: string             // ✅ Correctly set to Oonchiumpa ID

  title: string
  excerpt: string
  content: string
  author: string

  type: string                   // community-story, cultural-insight, etc.
  tags: string[]

  hero_image: string
  gallery: string[]              // Array of photo IDs

  status: string                 // published, draft
  published_at: timestamp
  read_time: number

  storyteller_id: string | null
  elder_approved: boolean
  curated_by: string
  cultural_review: string

  created_at: timestamp
  updated_at: timestamp
}
```

**Working Well**: Blog posts correctly filter by `project_id`

#### 3. **transcripts** Table
- **Total**: 222 records
- **Purpose**: Interview/conversation transcripts

**Relationship**: `transcript_id` field exists on stories but null

#### 4. **gallery_photos** Table
- **Total**: 2 photos
- Links to `photo_galleries` table

#### 5. **media_files** Table
- **Total**: 0 files
- **Purpose**: General media storage (empty)

---

## 🎯 EMPATHY LEDGER ARCHITECTURE (Proposed)

### Core Principle: Multi-Tenant Data Isolation

Every organization gets their own isolated data space while sharing the same database.

### Data Hierarchy

```
Organization (Oonchiumpa)
├── Project ID: 5b853f55-c01e-4f1d-9e16-b99290ee1a2c
│
├── Documents (Source Material)
│   ├── Interview Transcripts
│   ├── Historical Documents
│   ├── Community Conversations
│   ├── Legal Education Sessions
│   └── Support Worker Notes
│
├── Analysis & Processing
│   ├── AI Transcript Analysis
│   ├── Theme Extraction
│   ├── Quote Identification
│   ├── Sentiment Analysis
│   └── Cultural Sensitivity Flagging
│
├── Stories (Generated Content)
│   ├── Personal Narratives
│   ├── Community Stories
│   ├── Cultural Knowledge
│   ├── Fellowship Journeys
│   └── Transformation Stories
│
├── Storytellers (People)
│   ├── Community Members
│   ├── Elders
│   ├── Youth Participants
│   ├── Staff Members
│   └── Partner Representatives
│
├── Media (Visual Content)
│   ├── Photos
│   ├── Videos
│   ├── Audio Recordings
│   └── Documents (PDFs, etc.)
│
└── Published Content (Public Output)
    ├── Blog Posts
    ├── Impact Stories
    ├── Service Showcases
    └── Community Updates
```

---

## 🗄️ PROPOSED TABLE STRUCTURE

### 1. **organizations** Table (NEW)
Central registry of all organizations using the platform.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Multi-tenant isolation
  supabase_project_id TEXT,  -- Maps to VITE_SUPABASE_PROJECT_ID

  -- Organization details
  type TEXT,                  -- indigenous, ngo, government, etc.
  description TEXT,
  website TEXT,
  location TEXT,

  -- Branding
  logo_url TEXT,
  color_scheme JSONB,

  -- Settings
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Oonchiumpa record
INSERT INTO organizations (id, name, slug, supabase_project_id, type)
VALUES (
  '5b853f55-c01e-4f1d-9e16-b99290ee1a2c',
  'Oonchiumpa',
  'oonchiumpa',
  '5b853f55-c01e-4f1d-9e16-b99290ee1a2c',
  'indigenous_organization'
);
```

### 2. **source_documents** Table (NEW)
All raw documents that feed into the system.

```sql
CREATE TABLE source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  -- Document identification
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,  -- interview, historical, legal_education, etc.
  source_type TEXT,              -- audio, video, pdf, text, etc.

  -- Storage
  file_path TEXT,                -- Supabase Storage path
  storage_bucket TEXT,           -- media, documents, transcripts
  file_url TEXT,                 -- Public URL if applicable
  file_size BIGINT,
  mime_type TEXT,

  -- Metadata
  uploaded_by UUID REFERENCES users(id),
  description TEXT,
  tags TEXT[],
  location TEXT,
  recorded_date DATE,

  -- Processing status
  processing_status TEXT DEFAULT 'pending',  -- pending, processing, completed, failed
  transcribed BOOLEAN DEFAULT false,
  analyzed BOOLEAN DEFAULT false,

  -- Privacy
  privacy_level TEXT DEFAULT 'private',
  requires_consent BOOLEAN DEFAULT true,
  consent_obtained BOOLEAN DEFAULT false,
  consent_details JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_source_documents_org ON source_documents(organization_id);
CREATE INDEX idx_source_documents_type ON source_documents(document_type);
CREATE INDEX idx_source_documents_status ON source_documents(processing_status);
```

### 3. **document_transcripts** Table (RENAME from transcripts)
Links documents to their transcribed text.

```sql
CREATE TABLE document_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  source_document_id UUID REFERENCES source_documents(id),

  -- Transcript content
  transcript_text TEXT NOT NULL,
  transcript_format TEXT DEFAULT 'markdown',  -- markdown, plain_text, json

  -- Transcription metadata
  transcription_method TEXT,     -- ai, human, hybrid
  transcription_service TEXT,    -- whisper, descript, manual
  confidence_score FLOAT,

  -- Timestamps within recording
  has_timestamps BOOLEAN DEFAULT false,
  timestamps_data JSONB,

  -- Speaker identification
  speakers_identified BOOLEAN DEFAULT false,
  speaker_data JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transcripts_org ON document_transcripts(organization_id);
CREATE INDEX idx_transcripts_source ON document_transcripts(source_document_id);
```

### 4. **document_analysis** Table (NEW)
AI/human analysis results from documents.

```sql
CREATE TABLE document_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  source_document_id UUID REFERENCES source_documents(id),
  transcript_id UUID REFERENCES document_transcripts(id),

  -- Analysis results
  themes TEXT[],
  key_quotes JSONB[],              -- [{quote, speaker, timestamp, context}]
  sentiment_scores JSONB,
  cultural_themes TEXT[],
  mentioned_people TEXT[],
  mentioned_places TEXT[],
  mentioned_events TEXT[],

  -- AI processing
  ai_model TEXT,
  ai_confidence_scores JSONB,
  embedding VECTOR(1536),          -- For semantic search

  -- Story potential
  story_suggestions JSONB[],       -- Suggested stories to create
  quote_highlights JSONB[],        -- Best quotes for blog posts

  -- Human review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_org ON document_analysis(organization_id);
CREATE INDEX idx_analysis_source ON document_analysis(source_document_id);
```

### 5. **storytellers** Table (UPDATED)
People who share stories - community members, participants, staff.

```sql
CREATE TABLE storytellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),

  -- Identity
  full_name TEXT NOT NULL,
  preferred_name TEXT,
  email TEXT,
  phone TEXT,

  -- Community connection
  community TEXT,
  language_group TEXT,
  traditional_country TEXT,

  -- Profile
  bio TEXT,
  role TEXT,                       -- community_member, elder, youth, staff, etc.
  photo_url TEXT,

  -- Permissions
  consent_to_share_stories BOOLEAN DEFAULT false,
  consent_to_use_name BOOLEAN DEFAULT false,
  consent_to_use_photo BOOLEAN DEFAULT false,
  consent_details JSONB,

  -- Privacy
  is_public BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'organization',

  -- Stats
  stories_count INT DEFAULT 0,
  public_stories_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_storytellers_org ON storytellers(organization_id);
CREATE INDEX idx_storytellers_community ON storytellers(community);
```

### 6. **stories** Table (UPDATED)
Fix to use consistent organization_id and add proper relationships.

```sql
-- Add missing fields and indexes
ALTER TABLE stories ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS source_document_id UUID REFERENCES source_documents(id);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS analysis_id UUID REFERENCES document_analysis(id);

-- Migrate project_id to organization_id for consistency
UPDATE stories
SET organization_id = project_id
WHERE organization_id IS NULL AND project_id IS NOT NULL;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_stories_org ON stories(organization_id);
CREATE INDEX IF NOT EXISTS idx_stories_source ON stories(source_document_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status, is_public);
CREATE INDEX IF NOT EXISTS idx_stories_storyteller ON stories(storyteller_id);
```

### 7. **story_media** Table (NEW)
Links stories to media files with metadata.

```sql
CREATE TABLE story_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,

  -- Media reference
  media_type TEXT NOT NULL,        -- photo, video, audio, document
  media_url TEXT NOT NULL,
  storage_path TEXT,
  thumbnail_url TEXT,

  -- Metadata
  caption TEXT,
  photographer TEXT,
  recorded_date DATE,
  location TEXT,

  -- Display
  order_index INT DEFAULT 0,
  is_hero_image BOOLEAN DEFAULT false,

  -- Attribution
  uploaded_by UUID REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_story_media_org ON story_media(organization_id);
CREATE INDEX idx_story_media_story ON story_media(story_id);
```

### 8. **blog_posts** Table (CURRENT - Working Well!)
Already correctly uses `project_id` for isolation.

✅ No changes needed - this table is the model for how others should work.

### 9. **blog_post_stories** Table (NEW)
Many-to-many relationship between blog posts and source stories.

```sql
CREATE TABLE blog_post_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,

  -- Relationship metadata
  relationship_type TEXT,          -- primary_source, referenced, related
  excerpt_used TEXT,               -- Specific part of story used in blog

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(blog_post_id, story_id)
);

CREATE INDEX idx_blog_stories_blog ON blog_post_stories(blog_post_id);
CREATE INDEX idx_blog_stories_story ON blog_post_stories(story_id);
```

---

## 🔄 DATA FLOW: Documents → Stories → Blog Posts

### Phase 1: Document Upload & Processing

```
1. Staff uploads interview recording/transcript
   ↓
2. Creates record in source_documents table
   ↓
3. If audio/video: Transcription service processes
   ↓
4. Creates record in document_transcripts table
   ↓
5. AI analyzes transcript
   ↓
6. Creates record in document_analysis table
   - Extracts themes, quotes, sentiment
   - Identifies story potential
   - Flags cultural sensitivity
```

### Phase 2: Story Creation

```
7. Staff reviews analysis results
   ↓
8. Selects quotes/themes to develop into story
   ↓
9. Creates draft in stories table
   - Links to source_document_id
   - Links to storyteller_id
   - Sets organization_id
   ↓
10. Adds media via story_media table
   ↓
11. Submits for cultural review
   ↓
12. Elder approves (sets elder_approved_by)
   ↓
13. Publishes (sets is_public = true)
```

### Phase 3: Blog Post Creation

```
14. Staff selects published stories for blog
   ↓
15. Creates blog_post record
   ↓
16. Links stories via blog_post_stories table
   ↓
17. Adds photos via gallery field
   ↓
18. Writes connecting narrative
   ↓
19. Cultural review & Elder approval
   ↓
20. Publishes (sets status = 'published')
```

---

## 🔒 DATA ISOLATION STRATEGY

### Every Query Must Filter by Organization

```typescript
// ❌ WRONG - Shows all organizations' data
const stories = await supabase
  .from('stories')
  .select('*')
  .eq('is_public', false);

// ✅ CORRECT - Shows only Oonchiumpa data
const ORGANIZATION_ID = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c';

const stories = await supabase
  .from('stories')
  .select('*')
  .eq('organization_id', ORGANIZATION_ID)
  .eq('is_public', false);
```

### Row Level Security (RLS) Policies

```sql
-- Stories: Users can only see their organization's data
CREATE POLICY "org_isolation_stories" ON stories
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM users
      WHERE id = auth.uid()
    )
  );

-- Source Documents: Same isolation
CREATE POLICY "org_isolation_documents" ON source_documents
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM users
      WHERE id = auth.uid()
    )
  );
```

---

## 📊 DASHBOARD STATS (Corrected)

### Current Dashboard Queries (WRONG)

```typescript
// Showing other organizations' data!
const { count } = await supabase
  .from('stories')
  .select('*', { count: 'exact', head: true })
  .eq('is_public', false);  // ❌ Missing organization filter
```

### Fixed Dashboard Queries

```typescript
const ORGANIZATION_ID = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c';

// Documents Pending: Source documents not yet analyzed
const { count: docsCount } = await supabase
  .from('source_documents')
  .select('*', { count: 'exact', head: true })
  .eq('organization_id', ORGANIZATION_ID)
  .eq('processing_status', 'pending');

// Stories in Review: Unpublished stories
const { count: storiesCount } = await supabase
  .from('stories')
  .select('*', { count: 'exact', head: true })
  .eq('organization_id', ORGANIZATION_ID)
  .eq('is_public', false);

// Published This Month: Blog posts
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const { count: publishedCount } = await supabase
  .from('blog_posts')
  .select('*', { count: 'exact', head: true })
  .eq('project_id', ORGANIZATION_ID)  // blog_posts uses project_id
  .eq('status', 'published')
  .gte('created_at', monthStart);
```

---

## 🎯 IMPLEMENTATION PRIORITIES

### Phase 1: Data Isolation (URGENT)
1. ✅ Create `organizations` table
2. ✅ Add `organization_id` to all tables
3. ✅ Migrate existing data with correct IDs
4. ✅ Update all queries to filter by organization
5. ✅ Add RLS policies for multi-tenant security
6. ✅ Test dashboard shows only Oonchiumpa data

### Phase 2: Document Management
1. Create `source_documents` table
2. Create `document_transcripts` table (migrate from `transcripts`)
3. Create `document_analysis` table
4. Build document upload interface
5. Implement AI analysis pipeline

### Phase 3: Story Workflow
1. Update `stories` table with proper relationships
2. Create `story_media` table
3. Build story creation wizard
4. Implement Elder review workflow
5. Add cultural sensitivity flagging

### Phase 4: Blog Integration
1. Create `blog_post_stories` linking table
2. Update blog creation to link source stories
3. Show "Based on stories from..." in blog posts
4. Track which stories feed which blogs

### Phase 5: Storyteller Profiles
1. Update `storytellers` table
2. Build storyteller management interface
3. Add consent management
4. Link storytellers to stories and media

---

## 🚀 MIGRATION PLAN

### Step 1: Understand Current Data

```sql
-- Check which organizations exist
SELECT DISTINCT organization_id, tenant_id
FROM stories
WHERE organization_id IS NOT NULL;

-- Find Oonchiumpa's correct ID
SELECT id FROM organizations WHERE slug = 'oonchiumpa';
```

### Step 2: Create New Tables

Run SQL scripts for:
- `organizations`
- `source_documents`
- `document_transcripts`
- `document_analysis`
- `story_media`
- `blog_post_stories`

### Step 3: Migrate Existing Data

```sql
-- Update stories to use Oonchiumpa organization_id
-- (Only if we create Oonchiumpa stories - currently none exist)

-- Update users to link to organization
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
UPDATE users
SET organization_id = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c'
WHERE project_id = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c';
```

### Step 4: Update Application Code

- Add `ORGANIZATION_ID` constant
- Update all queries to filter by organization
- Add RLS policies
- Test extensively

### Step 5: Verify Isolation

- Create test data for two organizations
- Verify users from Org A cannot see Org B data
- Test dashboard shows correct filtered data

---

## 📝 NEXT STEPS

1. **Create architecture review meeting**
   - Review this document with Kristy
   - Confirm document workflow
   - Verify storyteller consent process
   - Approve implementation plan

2. **Create implementation tickets**
   - Phase 1: Data isolation (URGENT)
   - Phase 2: Document management
   - Phase 3: Story workflow
   - Phase 4: Blog integration
   - Phase 5: Storyteller profiles

3. **Build migration scripts**
   - SQL for new tables
   - Data migration scripts
   - RLS policies
   - Testing scripts

4. **Update documentation**
   - Admin guide with new workflows
   - API documentation
   - Integration guide for new organizations

---

**Status**: Awaiting approval to proceed with Phase 1 implementation

**Created**: October 25, 2025
**Author**: Claude Code with Oonchiumpa team
**Next Review**: After approval to begin implementation
