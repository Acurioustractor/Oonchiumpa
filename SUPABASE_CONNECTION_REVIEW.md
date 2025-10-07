# 🔍 Supabase Connection & Storyteller Integration Review

**Date**: 2025-10-07
**Status**: Ready for Migration & Integration

---

## 📊 Current State Analysis

### ✅ What's Working
1. **Stories Table**: Successfully created and accessible
2. **Basic Supabase Connection**: Frontend and backend can connect to Supabase
3. **Configuration Files**: All config files properly set up
   - [Frontend config](oonchiumpa-app/src/config/supabase.ts)
   - [Backend config](oonchiumpa-backend/src/config/supabase.ts)
   - [API layer](oonchiumpa-app/src/services/supabaseAPI.ts)

### ❌ Missing Tables (Need Migration)
The following critical tables from the Empathy Ledger schema are **NOT yet created**:

1. **`storytellers`** - Critical! Core identity management
2. **`story_permissions`** - Essential for Empathy Ledger control
3. **`organizations`** - Multi-tenant foundation
4. **`storyteller_organizations`** - Links storytellers to Oonchiumpa
5. **`story_access_logs`** - Transparency & audit trail
6. **`cultural_advisors`** - Cultural protocol support
7. **`cultural_reviews`** - Review workflow

---

## 🎭 Empathy Ledger Architecture Review

### Schema Design ✨
The [empathy-ledger-schema.sql](empathy-ledger-schema.sql) provides:

#### Multi-Tenant Setup
```sql
organizations (tenants)
  ↓
storyteller_organizations (many-to-many)
  ↓
storytellers (linked to auth.users)
  ↓
stories (with permissions & cultural protocols)
```

#### Key Features
- **Storyteller Control**: `is_active` toggle - storytellers can turn stories on/off anytime
- **Granular Permissions**: Visibility levels (private → community → organization → public)
- **Cultural Sensitivity**: Built-in cultural review workflows
- **Empathy Ledger IDs**: Unique global identifiers for stories & storytellers
- **RLS Policies**: Row-level security ensuring proper access control
- **Full-text Search**: Optimized search vectors on stories & storytellers

---

## 🔗 Storyteller → Story Connection Flow

### How It Works

1. **Storytellers Join Organization**
   ```sql
   -- Storyteller links to Oonchiumpa org
   INSERT INTO storyteller_organizations (storyteller_id, organization_id)
   VALUES ('storyteller-uuid', 'oonchiumpa-org-uuid');
   ```

2. **Create Stories**
   ```sql
   -- Story automatically gets empathy_ledger_story_id via trigger
   INSERT INTO stories (title, content, storyteller_id, organization_id)
   VALUES ('My Story', '...', 'storyteller-uuid', 'oonchiumpa-org-uuid');
   ```

3. **Permissions Auto-Created**
   - Trigger creates default `story_permissions` record
   - Uses storyteller's `default_story_visibility` preference
   - Gives storyteller `full_control` by default

4. **Frontend Queries**
   ```typescript
   // Frontend gets only stories from Oonchiumpa storytellers
   const storytellerIds = await getOonchiumpaStorytellerIds();
   const stories = await supabase
     .from("stories")
     .select("*, storytellers(*)")
     .in("storyteller_id", storytellerIds);
   ```

---

## 🚀 Next Steps to Connect Everything

### Step 1: Apply Empathy Ledger Schema to Supabase ⚡

**Action**: Run the migration SQL in Supabase SQL Editor

```bash
# Option A: Via Supabase Dashboard
1. Go to: https://[your-project].supabase.co/project/[id]/sql
2. Copy contents of empathy-ledger-schema.sql
3. Execute the SQL

# Option B: Via CLI (if supabase CLI installed)
supabase db push
```

**What this creates**:
- ✅ All missing tables (storytellers, organizations, etc.)
- ✅ Enums (story_visibility_level, story_control_level, etc.)
- ✅ RLS policies for secure access
- ✅ Triggers for auto-generating Empathy Ledger IDs
- ✅ Views for dashboard queries
- ✅ Sample Oonchiumpa organization

---

### Step 2: Seed Storytellers

After migration, you'll need to add storytellers to the system:

```sql
-- Example: Add a storyteller linked to Oonchiumpa
INSERT INTO storytellers (
  id,  -- Should match auth.users.id
  empathy_ledger_id,
  public_name,
  email,
  community,
  cultural_background,
  consent_given
) VALUES (
  'uuid-from-auth-users',
  'EL001-STORYTELLER-JOHN',
  'John Storyteller',
  'john@example.com',
  'Oonchiumpa Community',
  'Aboriginal Australian',
  true
);

-- Link storyteller to Oonchiumpa organization
INSERT INTO storyteller_organizations (
  storyteller_id,
  organization_id,
  role,
  status
) VALUES (
  'uuid-from-above',
  (SELECT id FROM organizations WHERE slug = 'oonchiumpa'),
  'storyteller',
  'active'
);
```

---

### Step 3: Connect Stories to Storytellers

The existing stories need to be linked properly:

```sql
-- Option 1: If you have existing stories without storytellers
-- Create a "legacy" storyteller for migration
INSERT INTO storytellers (
  id,
  empathy_ledger_id,
  public_name,
  consent_given
) VALUES (
  gen_random_uuid(),
  'EL001-LEGACY-STORIES',
  'Legacy Community Stories',
  true
);

-- Link legacy storyteller to Oonchiumpa
INSERT INTO storyteller_organizations (storyteller_id, organization_id)
SELECT
  s.id,
  o.id
FROM storytellers s, organizations o
WHERE s.empathy_ledger_id = 'EL001-LEGACY-STORIES'
  AND o.slug = 'oonchiumpa';

-- Update existing stories to have storyteller_id and organization_id
UPDATE stories
SET
  storyteller_id = (SELECT id FROM storytellers WHERE empathy_ledger_id = 'EL001-LEGACY-STORIES'),
  organization_id = (SELECT id FROM organizations WHERE slug = 'oonchiumpa')
WHERE storyteller_id IS NULL;
```

---

### Step 4: Blog & Transcript Integration 📝

#### Create Helper Service for Content Generation

**File**: `oonchiumpa-app/src/services/contentGenerator.ts`

```typescript
import { supabase } from '../config/supabase';
import { supabaseStoriesAPI } from './supabaseAPI';

export const contentGenerator = {
  /**
   * Generate blog post from storyteller transcript
   */
  async createBlogFromTranscript(params: {
    storytellerId: string;
    transcriptText: string;
    title: string;
    category?: string;
  }) {
    const { storytellerId, transcriptText, title, category } = params;

    // Create story with transcript as content
    const story = await supabase
      .from('stories')
      .insert({
        title,
        content: transcriptText,
        storyteller_id: storytellerId,
        organization_id: await getOonchiumpaOrgId(),
        category: category || 'blog',
        workflow_status: 'draft',
        is_active: true,
        storyteller_approved: false, // Requires approval
      })
      .select('*, storytellers(*)')
      .single();

    return story.data;
  },

  /**
   * Get all storytellers linked to Oonchiumpa
   */
  async getOonchiumpaStorytellers() {
    const orgId = await getOonchiumpaOrgId();

    const { data } = await supabase
      .from('storyteller_organizations')
      .select(`
        storytellers(
          id,
          empathy_ledger_id,
          public_name,
          community,
          cultural_background,
          bio
        )
      `)
      .eq('organization_id', orgId)
      .eq('status', 'active');

    return data?.map(so => so.storytellers) || [];
  },

  /**
   * Get all transcripts/stories for a storyteller
   */
  async getStorytellerContent(storytellerId: string) {
    return await supabaseStoriesAPI.getAll()
      .then(stories => stories.filter(s => s.storyteller?.id === storytellerId));
  },

  /**
   * Generate blog summary from multiple transcripts
   */
  async createMultiStoryBlog(params: {
    storyIds: string[];
    blogTitle: string;
    blogCategory?: string;
  }) {
    const { storyIds, blogTitle, blogCategory } = params;

    // Fetch all stories
    const stories = await Promise.all(
      storyIds.map(id => supabaseStoriesAPI.getById(id))
    );

    // Combine content
    const combinedContent = stories
      .map(s => `## ${s.title}\n\n${s.content}`)
      .join('\n\n---\n\n');

    // Create blog post
    return await this.createBlogFromTranscript({
      storytellerId: stories[0].storyteller?.id || '',
      transcriptText: combinedContent,
      title: blogTitle,
      category: blogCategory || 'community-update',
    });
  },
};

// Helper to get Oonchiumpa org ID
async function getOonchiumpaOrgId(): Promise<string> {
  const { data } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'oonchiumpa')
    .single();

  return data?.id || '';
}
```

---

## 📋 Integration Checklist

- [ ] **Migration**: Run empathy-ledger-schema.sql in Supabase
- [ ] **Verify**: Check all tables exist (`storytellers`, `organizations`, etc.)
- [ ] **Seed Data**: Add Oonchiumpa organization (should be created by schema)
- [ ] **Add Storytellers**: Create storyteller records and link to organization
- [ ] **Link Existing Stories**: Update stories with storyteller_id and organization_id
- [ ] **Test Queries**: Verify `supabaseStoriesAPI.getAll()` returns stories
- [ ] **Frontend Integration**: Test storyteller dashboard shows linked stories
- [ ] **Content Generator**: Implement blog generation from transcripts
- [ ] **Permissions**: Test Empathy Ledger visibility controls

---

## 🎯 Expected Outcome

After completing the migration and integration:

1. **Storyteller Dashboard** will show:
   - List of all storytellers linked to Oonchiumpa
   - Each storyteller's stories/transcripts
   - Ability to toggle story visibility (Empathy Ledger control)
   - Story permissions and cultural sensitivity levels

2. **Blog Generation** will support:
   - Creating blog posts from individual transcripts
   - Combining multiple stories into community updates
   - Storyteller approval workflow
   - Automatic linking to storyteller profiles

3. **Story Management** will include:
   - Stories properly linked to storytellers
   - Cultural review workflow for sensitive content
   - Permission-based access (private → public spectrum)
   - Full audit trail of who views/shares stories

---

## 🚨 Important Notes

### Data Privacy & Cultural Protocols
- All stories default to **private** until storyteller approves
- High cultural sensitivity content requires elder review
- Storytellers can turn stories on/off anytime (sacred toggle)
- All access is logged for transparency

### RLS (Row Level Security)
- Policies ensure storytellers only see their own stories (unless shared)
- Organization members see organization-level content
- Public stories require both storyteller AND organization approval

### Empathy Ledger IDs
- Format: `EL[year][random]` (e.g., `EL25A3F9B2`)
- Auto-generated by trigger
- Globally unique across all Empathy Ledger instances
- Never reused, even if story deleted

---

## 💡 Quick Start Commands

```bash
# 1. Apply schema migration (in Supabase SQL Editor)
# Paste empathy-ledger-schema.sql and execute

# 2. Test connection
cd oonchiumpa-backend
node test-supabase.js

# 3. Verify storytellers table exists
# Should now show ✅ for storytellers

# 4. Create your first storyteller via Supabase dashboard:
# SQL Editor > Run:
INSERT INTO storytellers (
  id,
  empathy_ledger_id,
  public_name,
  consent_given
) VALUES (
  gen_random_uuid(),
  'EL25-TEST-001',
  'Test Storyteller',
  true
);

# 5. Link to Oonchiumpa org
INSERT INTO storyteller_organizations (storyteller_id, organization_id)
SELECT
  (SELECT id FROM storytellers WHERE empathy_ledger_id = 'EL25-TEST-001'),
  (SELECT id FROM organizations WHERE slug = 'oonchiumpa');

# 6. Create a story
INSERT INTO stories (
  title,
  content,
  storyteller_id,
  organization_id
) VALUES (
  'My First Story',
  'This is a test story from the Empathy Ledger.',
  (SELECT id FROM storytellers WHERE empathy_ledger_id = 'EL25-TEST-001'),
  (SELECT id FROM organizations WHERE slug = 'oonchiumpa')
);
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| [empathy-ledger-schema.sql](empathy-ledger-schema.sql) | Complete database schema with Empathy Ledger |
| [oonchiumpa-app/src/config/supabase.ts](oonchiumpa-app/src/config/supabase.ts) | Frontend Supabase client & types |
| [oonchiumpa-app/src/services/supabaseAPI.ts](oonchiumpa-app/src/services/supabaseAPI.ts) | Frontend API for stories/storytellers |
| [oonchiumpa-backend/src/config/supabase.ts](oonchiumpa-backend/src/config/supabase.ts) | Backend Supabase admin client |
| [oonchiumpa-backend/src/routes/empathy-stories.ts](oonchiumpa-backend/src/routes/empathy-stories.ts) | REST API endpoints for Empathy Ledger |

---

## 🤔 Questions to Address

1. **Do you have existing storyteller data** that needs to be migrated?
2. **Should we create a storyteller onboarding flow** for new community members?
3. **What cultural review process** should be implemented?
4. **How should transcripts be imported** - manual upload, API, or automated?

Ready to proceed with the migration! Let me know if you'd like me to:
- ✅ Apply the schema migration
- ✅ Create test storytellers
- ✅ Build the content generator service
- ✅ Set up the storyteller dashboard integration
