# 🗄️ Existing Supabase Database Structure Analysis

**Date**: 2025-10-07
**Status**: Production Data Discovered ✅

---

## 📊 Summary

Your Supabase database **already has a rich, multi-tenant structure** with extensive data:

- ✅ **240 profiles** (storytellers)
- ✅ **246 stories**
- ✅ **222 transcripts**
- ✅ **18 organizations**
- ✅ **32 tenants**
- ✅ **10 projects**
- ✅ **131 storyteller↔organization links**

**Key Finding**: You don't need the empathy-ledger-schema.sql migration! Your database already has a sophisticated multi-tenant system.

---

## 🎭 Current Database Architecture

### Core Tables & Relationships

```
tenants (32 records) - Top-level isolation
  ↓ (tenant_id)
  ├─→ profiles (240) - Storytellers/users
  ├─→ organizations (18) - Community orgs
  ├─→ projects (10) - Specific initiatives
  ├─→ stories (246) - Published stories
  └─→ transcripts (222) - Raw interview content

storyteller_organizations (131) - Many-to-many linking
  ├─→ storyteller_id → profiles
  └─→ organization_id → organizations
```

---

## 📋 Table Details

### 1️⃣ **PROFILES** (240 records)
**Purpose**: Storyteller/user identity and profiles
**Key Fields**:
- `id` (UUID) - Primary identifier
- `tenant_id` - Multi-tenant isolation
- `full_name`, `display_name` - Identity
- `email`, `bio` - Contact & description
- `tenant_roles` - Array: `["storyteller", "admin", "elder"]`
- `is_storyteller`, `is_elder` - Boolean flags
- `cultural_background` - Cultural identity
- `profile_image_url` - Avatar
- `story_visibility_level` - Default: "public", "community", "private"
- `ai_processing_consent` - Permission for AI analysis
- `consent_given` - General consent flag

**Relationship Fields**:
- `tenant_id` → tenants
- `primary_organization_id` → organizations
- `legacy_storyteller_id` - Migration reference

**Sample Data**:
- Javier Aparicio Grau (Diagrama, Spain)
- Mary Running Bear (storyteller)
- 240 total profiles with rich biographical data

---

### 2️⃣ **TENANTS** (32 records)
**Purpose**: Top-level multi-tenant isolation (Oonchiumpa is one tenant)
**Key Fields**:
- `id`, `slug`, `name` - Identity
- `domain` - e.g., "oonchiumpa.com"
- `description` - Purpose description
- `settings` - JSON config
- `cultural_protocols` - Cultural rules & consent requirements
- `subscription_tier` - "professional", "community", etc.
- `status` - "active" / "inactive"

**Oonchiumpa Tenant**:
```json
{
  "id": "bf17d0a9-2b12-4e4a-982e-09a8b1952ec6",
  "slug": "oonchiumpa",
  "domain": "oonchiumpa.com",
  "subscription_tier": "professional",
  "status": "active"
}
```

**Other Tenants**: PCYC, A Curious Tractor, MingaMinga Rangers, MMEIC, etc.

---

### 3️⃣ **ORGANIZATIONS** (18 records)
**Purpose**: Community organizations, partners, funders
**Key Fields**:
- `id`, `slug`, `name` - Identity
- `tenant_id` - Belongs to which tenant
- `type` - "community", "partner", "funder"
- `location` - Geographic location
- `website_url`, `contact_email` - Contact info
- `cultural_protocols` - Organization-specific protocols
- `subscription_tier` - Organization level

**Sample Organizations**:
- Palm Island Community Company
- Snow Foundation
- Confit Pathways
- Independent Storytellers
- A Curious Tractor

---

### 4️⃣ **PROJECTS** (10 records)
**Purpose**: Specific initiatives within organizations
**Key Fields**:
- `id`, `name`, `description` - Project details
- `tenant_id` - Isolation
- `organization_id` - Which org runs this
- `location` - Where project operates
- `status` - "active", "completed", "planned"
- `start_date`, `end_date` - Timeline

**Sample Projects**:
- Deadly Hearts Trek (Snow Foundation, Canada)
- MingaMinga Rangers Program
- MMEIC Cultural Initiative
- Palm Island Community Connection

---

### 5️⃣ **STORIES** (246 records) ⭐
**Purpose**: Published stories/narratives (the main content!)
**Key Fields**:
- `id`, `title`, `content` - Core story data
- `tenant_id` - Multi-tenant isolation
- `author_id` → profiles - Who wrote/told this
- `organization_id` → organizations - Associated org
- `project_id` → projects - Associated project (optional)
- `storyteller_id` - Alternative author field
- `transcript_id` - Link to source transcript

**Story Metadata**:
- `story_type` - "personal_narrative", "community_story", etc.
- `themes` - Array: ["Community connection", "Hope and resilience"]
- `cultural_themes` - Cultural significance tags
- `privacy_level` - "public", "community", "private"
- `is_public` - Boolean visibility flag
- `is_featured` - Highlight flag

**Cultural & Consent**:
- `cultural_sensitivity_level` - "standard", "high", "sacred"
- `cultural_warnings` - Array of warnings
- `requires_elder_approval` - Boolean
- `elder_approved_by`, `elder_approved_at` - Approval tracking
- `has_explicit_consent` - Storyteller consent
- `ai_processing_consent_verified` - AI consent

**Status & Workflow**:
- `status` - "published", "draft", "review"
- `story_stage` - "draft", "editing", "published"
- `community_status` - Community review status
- `reviewed_by`, `reviewed_at` - Review tracking

**Content & Media**:
- `summary` - AI-generated or manual summary
- `transcription` - Original transcript
- `video_embed_code` - YouTube/Vimeo embed
- `story_image_url`, `media_urls` - Images/media
- `media_metadata` - JSON metadata

**AI Processing**:
- `ai_processed` - Boolean
- `ai_generated_summary` - Boolean
- `ai_confidence_scores` - JSON scores
- `ai_enhanced_content` - AI-improved version
- `embedding` - Vector embeddings for semantic search
- `search_vector` - Full-text search index

**Sample Stories**:
- "Community Responsibility and Respect"
- "The Importance of Education and Hope"
- "Traditional Healing Practices in My Community"
- "The Sacred Grove"
- 246 total stories!

---

### 6️⃣ **TRANSCRIPTS** (222 records) 🎙️
**Purpose**: Raw interview/conversation transcripts (source material)
**Key Fields**:
- `id`, `title` - Identifier
- `tenant_id` - Multi-tenant isolation
- `storyteller_id` → profiles - Who spoke
- `organization_id` → organizations - Associated org
- `project_id` → projects - Associated project
- `story_id` → stories - Linked published story (if converted)

**Content**:
- `transcript_content` - Full text transcript
- `formatted_text` - Cleaned/formatted version
- `word_count`, `character_count` - Stats
- `recording_date` - When recorded
- `duration_seconds`, `duration` - Length

**Media**:
- `audio_url`, `video_url` - Original recordings
- `source_video_url` - YouTube/platform URL
- `source_video_platform` - "descript", "youtube", etc.
- `source_video_thumbnail` - Thumbnail image
- `media_metadata` - JSON metadata

**AI Processing**:
- `ai_processing_consent` - Permission to process
- `ai_processing_status` - "completed", "pending", "consent_required"
- `processing_status` - Overall status
- `ai_analysis_allowed` - Permission flag
- `ai_processing_date` - When processed
- `ai_model_version` - e.g., "claude-3.5-sonnet"
- `ai_confidence_score` - Quality score
- `ai_summary` - Auto-generated summary
- `themes` - Extracted themes
- `key_quotes` - Important quotes array
- `content_embedding` - Vector embeddings

**Cultural & Privacy**:
- `cultural_sensitivity` - "sensitive", "standard", "sacred"
- `requires_elder_review` - Boolean
- `elder_reviewed_by`, `elder_reviewed_at` - Review tracking
- `privacy_level` - "private", "community", "public"
- `anonymization_level` - "full", "partial", "none"

**Quality**:
- `transcript_quality` - "good", "fair", "poor"
- `confidence` - Transcription confidence score
- `error_message` - Processing errors
- `status` - "pending", "completed", "failed"

**Sample Transcripts**:
- Patricia Ann Miller interview (1593 words, sensitive)
- Joe Kwon - caring for those who care
- Aunty Vicky Wade - Community Story
- Building the Empathy Ledger Platform
- 222 total transcripts!

---

### 7️⃣ **STORYTELLER_ORGANIZATIONS** (131 records)
**Purpose**: Links storytellers (profiles) to organizations (many-to-many)
**Key Fields**:
- `storyteller_id` → profiles
- `organization_id` → organizations
- `tenant_id` - Isolation
- `role` - "Team Member", "Elder", "Coordinator", "Storyteller"
- `relationship_type` - "employee", "volunteer", "partner"
- `is_active` - Boolean status
- `start_date`, `end_date` - Employment/relationship dates

**Purpose**: Enables a storyteller to be part of multiple organizations

---

## 🔗 Relationship Mapping

### How Data Connects

```
Tenant: Oonchiumpa (bf17d0a9-2b12-4e4a-982e-09a8b1952ec6)
  │
  ├─→ Profiles (storytellers linked to this tenant)
  │     ├─→ Javier Aparicio Grau
  │     ├─→ Mary Running Bear
  │     └─→ 238 more storytellers
  │
  ├─→ Organizations (orgs in this tenant)
  │     ├─→ Palm Island Community Company
  │     ├─→ Snow Foundation
  │     └─→ 16 more orgs
  │
  ├─→ Projects (initiatives)
  │     ├─→ Deadly Hearts Trek
  │     ├─→ MingaMinga Rangers
  │     └─→ 8 more projects
  │
  ├─→ Stories (246 published narratives)
  │     │
  │     └─→ Links to:
  │           • author_id → profile (storyteller)
  │           • organization_id → organization
  │           • project_id → project
  │           • transcript_id → transcript (source)
  │
  └─→ Transcripts (222 raw interviews)
        │
        └─→ Links to:
              • storyteller_id → profile
              • organization_id → organization
              • project_id → project
              • story_id → story (if published)
```

---

## 🎯 Querying Your Data

### Get All Oonchiumpa Storytellers

```sql
-- Get all profiles/storytellers for Oonchiumpa tenant
SELECT
  p.id,
  p.full_name,
  p.display_name,
  p.email,
  p.bio,
  p.cultural_background,
  p.tenant_roles,
  p.is_storyteller,
  p.profile_image_url
FROM profiles p
WHERE p.tenant_id = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'
  AND p.is_storyteller = true
ORDER BY p.full_name;
```

### Get Stories Linked to Storytellers

```sql
-- Get all stories with their storytellers for Oonchiumpa
SELECT
  s.id,
  s.title,
  s.content,
  s.story_type,
  s.themes,
  s.privacy_level,
  s.is_public,
  s.created_at,
  p.full_name as storyteller_name,
  p.display_name,
  o.name as organization_name
FROM stories s
LEFT JOIN profiles p ON s.author_id = p.id
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.tenant_id = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'
  AND s.is_public = true
ORDER BY s.created_at DESC;
```

### Get Transcripts for a Storyteller

```sql
-- Get all transcripts for a specific storyteller
SELECT
  t.id,
  t.title,
  t.transcript_content,
  t.recording_date,
  t.word_count,
  t.themes,
  t.ai_summary,
  t.cultural_sensitivity,
  t.privacy_level,
  t.story_id,  -- Linked published story (if converted)
  p.full_name as storyteller_name
FROM transcripts t
LEFT JOIN profiles p ON t.storyteller_id = p.id
WHERE t.tenant_id = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'
  AND t.storyteller_id = 'storyteller-uuid-here'
ORDER BY t.recording_date DESC;
```

### Get Transcripts Ready to Convert to Stories

```sql
-- Find transcripts that haven't been converted to stories yet
SELECT
  t.id,
  t.title,
  t.transcript_content,
  t.ai_summary,
  t.themes,
  t.word_count,
  t.cultural_sensitivity,
  p.full_name as storyteller_name,
  p.email
FROM transcripts t
LEFT JOIN profiles p ON t.storyteller_id = p.id
WHERE t.tenant_id = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'
  AND t.story_id IS NULL  -- Not yet converted
  AND t.ai_processing_consent = true  -- Has consent
  AND t.processing_status = 'completed'  -- AI processed
ORDER BY t.recording_date DESC;
```

### Link Storytellers to Organizations

```sql
-- Get all storytellers and their organizational connections
SELECT
  p.full_name as storyteller,
  o.name as organization,
  so.role,
  so.relationship_type,
  so.is_active
FROM storyteller_organizations so
JOIN profiles p ON so.storyteller_id = p.id
JOIN organizations o ON so.organization_id = o.id
WHERE so.tenant_id = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'
  AND so.is_active = true
ORDER BY o.name, p.full_name;
```

---

## 🚀 Integration Strategy for Blog/Transcript Workflow

### Current State ✅
You already have everything you need!

1. **Transcripts Table** - 222 raw interview transcripts
2. **Stories Table** - 246 published stories
3. **Profiles Table** - 240 storytellers
4. **Link Field** - `transcripts.story_id` links to published story

### Workflow Pattern

```
1. Record Interview
   ↓
2. Create Transcript Record
   • storyteller_id → profile
   • transcript_content = raw text
   • ai_processing_consent = get permission
   ↓
3. AI Processing (if consent given)
   • Extract themes, quotes
   • Generate summary
   • Check cultural sensitivity
   ↓
4. Convert to Story (when ready)
   • Create story record
   • author_id = storyteller_id
   • content = formatted transcript
   • Link: story.id → transcript.story_id
   ↓
5. Publish Story
   • Update story.is_public = true
   • Set story.status = 'published'
   • Appears on website/blog
```

---

## 💡 Recommended Actions

### ✅ What You Should Do

1. **Use Existing Tables** - Don't migrate! Your current structure is excellent
2. **Map Your Frontend** - Update `supabaseAPI.ts` to use:
   - `profiles` instead of `storytellers`
   - `author_id` instead of `storyteller_id` in stories
   - `tenant_id` for Oonchiumpa filtering

3. **Create Helper Functions**:

```typescript
// Get Oonchiumpa tenant ID
const OONCHIUMPA_TENANT_ID = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6';

// Get storytellers (profiles)
async function getOonchiumpaStorytellers() {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('is_storyteller', true)
    .order('full_name');
}

// Get stories with storyteller info
async function getStoriesWithStorytellers() {
  return await supabase
    .from('stories')
    .select(`
      *,
      author:profiles!author_id(
        full_name,
        display_name,
        profile_image_url,
        cultural_background
      ),
      organization:organizations(name, slug)
    `)
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('is_public', true)
    .order('created_at', { ascending: false });
}

// Get transcripts for a storyteller
async function getStorytellerTranscripts(storytellerId: string) {
  return await supabase
    .from('transcripts')
    .select('*')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('storyteller_id', storytellerId)
    .order('recording_date', { ascending: false });
}

// Convert transcript to story
async function convertTranscriptToStory(transcriptId: string) {
  // 1. Get transcript
  const { data: transcript } = await supabase
    .from('transcripts')
    .select('*')
    .eq('id', transcriptId)
    .single();

  // 2. Create story
  const { data: story } = await supabase
    .from('stories')
    .insert({
      tenant_id: transcript.tenant_id,
      author_id: transcript.storyteller_id,
      organization_id: transcript.organization_id,
      project_id: transcript.project_id,
      title: transcript.title || 'Untitled Story',
      content: transcript.transcript_content,
      summary: transcript.ai_summary,
      themes: transcript.themes,
      story_type: 'personal_narrative',
      privacy_level: transcript.privacy_level,
      cultural_sensitivity_level: transcript.cultural_sensitivity,
      is_public: false, // Draft by default
      status: 'draft',
      transcript_id: transcriptId,
      ai_processing_consent_verified: transcript.ai_processing_consent
    })
    .select()
    .single();

  // 3. Link back to transcript
  await supabase
    .from('transcripts')
    .update({ story_id: story.id })
    .eq('id', transcriptId);

  return story;
}
```

---

## 🎨 Dashboard Recommendations

### Storyteller Dashboard Should Show:

1. **Profile Info** (from `profiles` table)
   - Name, bio, photo
   - Cultural background
   - Organizations they belong to

2. **Their Transcripts** (from `transcripts` table)
   - List of all interviews
   - AI-processed summaries
   - Themes extracted
   - Which ones are converted to stories
   - Which ones need consent for AI processing

3. **Their Published Stories** (from `stories` table)
   - All stories they've authored
   - Visibility settings
   - Cultural sensitivity levels
   - Link to source transcript

4. **Conversion Workflow**
   - Button to "Convert Transcript to Story"
   - Preview before publishing
   - Cultural review if needed
   - Publish when ready

---

## ⚠️ Important Notes

### Don't Apply empathy-ledger-schema.sql!
Your existing structure is more mature and has:
- Multi-tenant architecture (better than single-org)
- 240 storytellers already linked
- 246 stories + 222 transcripts with real data
- Sophisticated AI processing & consent tracking
- Rich cultural protocol support

### Field Mapping vs Empathy Ledger Schema

| Empathy Ledger | Your Existing Schema |
|----------------|---------------------|
| `storytellers` | `profiles` (with `is_storyteller=true`) |
| `organizations` | `organizations` ✅ same |
| `stories.storyteller_id` | `stories.author_id` |
| `story_permissions` | Built into `stories` table |
| Single tenant | Multi-tenant with `tenant_id` |

---

## 🎯 Next Steps

1. ✅ **Update Frontend Code** - Map to existing tables
2. ✅ **Create TypeScript Interfaces** - Match actual schema
3. ✅ **Build Transcript→Story Converter** - Use existing workflow
4. ✅ **Test Queries** - Verify data retrieval works
5. ✅ **Build Storyteller Dashboard** - Show transcripts & stories

Ready to build the integration layer! 🚀
