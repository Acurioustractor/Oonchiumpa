# Empathy Ledger → Impact Framework Integration Guide

**Goal:** Connect the Empathy Ledger process with the Impact Framework implementation

---

## 🎯 THE BIG PICTURE

```
EMPATHY LEDGER PROCESS          IMPACT FRAMEWORK SYSTEM
(Story Capture)                 (Evidence & Reporting)

┌─────────────────────┐         ┌─────────────────────┐
│  1. Deep Listening  │         │   Outcomes Table    │
│  2. Story Capture   │────────>│   (26 outcomes)     │
│  3. Cultural Review │         │                     │
└─────────────────────┘         └─────────────────────┘
         │                                │
         │                                │
         v                                v
┌─────────────────────┐         ┌─────────────────────┐
│ Empathy Entries     │         │  Impact Reports     │
│ (Raw narratives)    │────────>│  (Funder-ready)     │
└─────────────────────┘         └─────────────────────┘
         │                                │
         │                                │
         v                                v
┌─────────────────────┐         ┌─────────────────────┐
│ Photos/Videos       │────────>│  Media Manager      │
│ (Captured media)    │         │  (Organized)        │
└─────────────────────┘         └─────────────────────┘
```

---

## 📊 WHERE DATA IS SAVED RIGHT NOW

### Supabase Database Tables

| Table Name | What It Stores | Current Records | Access URL |
|------------|----------------|-----------------|------------|
| **`empathy_entries`** | Raw stories from Empathy Ledger | ? | Empathy Ledger interface |
| **`transcripts`** | Documents, interviews, recordings | 32+ | `/staff-portal/documents` |
| **`outcomes`** | Impact Framework outcomes | 26 | `/staff-portal/impact` |
| **`gallery_photos`** | Photos and videos | Multiple | `/staff-portal/media-manager` |
| **`stories`** | Published community stories | Multiple | `/stories` |
| **`activities`** | Program activities | 0 (ready) | TBD |
| **`document_outcomes`** | Links docs to outcomes | 26 | Analysis pages |

### Supabase Storage Buckets

| Bucket Name | What It Stores | Access |
|-------------|----------------|--------|
| **`media`** | General photos/videos | Media Manager |
| **`photos`** | Gallery photos | Media Manager |
| **`story-media`** | Story images/videos | Stories pages |
| **`documents`** | Uploaded PDFs, recordings | Documents page |

---

## 🔄 INTEGRATION WORKFLOW

### Current Process (What Happens Now)

```
1. DOCUMENT UPLOAD
   Staff Portal → Upload document
   ↓
   Saved to `transcripts` table
   ↓
   AI analyzes document (manually triggered)
   ↓
   Outcomes extracted to JSON file
   ↓
   Import script loads to `outcomes` table
   ↓
   Visible in Impact Dashboard
```

### Proposed Empathy Ledger Integration

```
1. EMPATHY LEDGER CAPTURE
   Deep listening session
   ↓
   Story recorded in Empathy Ledger
   ↓
   Saved to `empathy_entries` table
   ↓
   Cultural review & approval

2. AUTO-SYNC TO IMPACT FRAMEWORK
   Background process runs (every hour/daily)
   ↓
   Reads approved empathy_entries
   ↓
   Extracts impact indicators:
   - What changed? → Outcome
   - For whom? → Participant count
   - When? → Outcome level
   - How measured? → Indicator
   - Cultural elements? → Tags
   ↓
   Creates record in `outcomes` table
   ↓
   Links to source empathy_entry

3. STAFF ENRICHMENT
   Staff reviews auto-created outcomes
   ↓
   Adds quantitative metrics if available
   ↓
   Links to photos/videos
   ↓
   Tags with service area
   ↓
   Ready for reporting

4. PUBLICATION
   Story ready for public?
   ↓
   Copy to `stories` table
   ↓
   Appears on public website
   ↓
   Outcome remains in Impact Framework
```

---

## 🛠️ TECHNICAL IMPLEMENTATION STEPS

### Step 1: Create Sync Script

**File:** `/empathy-to-impact-sync.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function syncEmpathyToImpact() {
  // 1. Get approved empathy entries not yet synced
  const { data: entries } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('approved', true)
    .is('synced_to_impact', null);

  for (const entry of entries) {
    // 2. Extract impact data
    const outcome = {
      organization_id: OONCHIUMPA_ORG_ID,
      tenant_id: OONCHIUMPA_TENANT_ID,
      title: extractOutcomeTitle(entry),
      description: entry.impact_description,
      outcome_level: determineOutcomeLevel(entry),
      service_area: entry.program_area,
      indicator_name: entry.indicator,
      qualitative_evidence: [entry.key_quote],
      success_stories: [entry.narrative],
      participant_count: entry.participant_count,
      elder_involvement: entry.elder_present,
      on_country_component: entry.on_country,
      traditional_knowledge_transmitted: entry.cultural_knowledge_shared,
      measurement_date: entry.session_date
    };

    // 3. Insert into outcomes table
    const { data: newOutcome } = await supabase
      .from('outcomes')
      .insert(outcome)
      .select()
      .single();

    // 4. Mark empathy entry as synced
    await supabase
      .from('empathy_entries')
      .update({
        synced_to_impact: true,
        linked_outcome_id: newOutcome.id
      })
      .eq('id', entry.id);

    console.log(`✅ Synced: ${entry.title} → Outcome ${newOutcome.id}`);
  }
}

function determineOutcomeLevel(entry) {
  // Logic to classify based on timeline
  if (entry.timeframe === 'immediate') return 'output';
  if (entry.timeframe === 'weeks') return 'short_term';
  if (entry.timeframe === 'months') return 'medium_term';
  if (entry.timeframe === 'years') return 'long_term';
  return 'impact';
}

function extractOutcomeTitle(entry) {
  // Extract concise outcome from narrative
  // Could use AI or pattern matching
  return entry.impact_indicator || entry.title;
}
```

**Run it:**
```bash
npx tsx empathy-to-impact-sync.ts
```

---

### Step 2: Add Empathy Ledger to Staff Portal

**New Page:** `/staff-portal/empathy-ledger`

**Features:**
- List all empathy entries
- Show sync status (synced to impact? yes/no)
- View linked outcomes
- Approve for publication
- Trigger sync manually

**Component Structure:**
```
EmpathyLedgerPage.tsx
├── List of entries
├── Filter by service area
├── Sync status indicators
├── "Sync to Impact" button
└── "Publish Story" button
```

---

### Step 3: Update Database Schema

**Add columns to existing tables:**

```sql
-- Add to empathy_entries table
ALTER TABLE empathy_entries ADD COLUMN synced_to_impact BOOLEAN DEFAULT FALSE;
ALTER TABLE empathy_entries ADD COLUMN linked_outcome_id UUID REFERENCES outcomes(id);
ALTER TABLE empathy_entries ADD COLUMN program_area TEXT;
ALTER TABLE empathy_entries ADD COLUMN indicator TEXT;
ALTER TABLE empathy_entries ADD COLUMN impact_description TEXT;

-- Add to outcomes table (already has most fields)
ALTER TABLE outcomes ADD COLUMN source_empathy_entry_id UUID REFERENCES empathy_entries(id);
```

---

### Step 4: Automated Sync (Optional)

**Set up cron job or Supabase Edge Function:**

```typescript
// Runs every hour
// File: supabase/functions/sync-empathy-to-impact/index.ts

Deno.serve(async (req) => {
  const result = await syncEmpathyToImpact();
  return new Response(
    JSON.stringify({ success: true, synced: result.count }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

## 📋 DATA MAPPING GUIDE

### Empathy Ledger Fields → Impact Framework Fields

| Empathy Ledger | Impact Framework | Notes |
|----------------|------------------|-------|
| `narrative` | `outcomes.description` | Main story text |
| `key_quote` | `outcomes.qualitative_evidence[0]` | Best quote |
| `participant_name` | `outcomes.participant_count` | Anonymized count |
| `session_date` | `outcomes.measurement_date` | When captured |
| `program_area` | `outcomes.service_area` | youth_mentorship, etc. |
| `elder_present` | `outcomes.elder_involvement` | Boolean |
| `on_country` | `outcomes.on_country_component` | Boolean |
| `cultural_knowledge` | `outcomes.traditional_knowledge_transmitted` | Boolean |
| `impact_indicator` | `outcomes.indicator_name` | What changed |
| `timeframe` | `outcomes.outcome_level` | Immediate → Impact |
| `photos[]` | `gallery_photos.linked_outcome_id` | Link media |

---

## 🎯 COMPLETE WORKFLOW EXAMPLE

### Example: Malachi's Story

**1. Empathy Ledger Capture:**
```json
{
  "id": "emp-001",
  "title": "Malachi Returns to Country",
  "narrative": "Malachi was involved in crime. Through our healing trip to Atnarpa, he reconnected with his culture. Now he teaches visitors about his country.",
  "participant_name": "Malachi [anonymized]",
  "program_area": "atnarpa_homestead",
  "session_date": "2024-07-04",
  "elder_present": true,
  "on_country": true,
  "cultural_knowledge_shared": true,
  "impact_indicator": "Youth cultural reconnection",
  "timeframe": "months",
  "key_quote": "It's not too late to learn these things of your family background",
  "approved": true,
  "photos": ["photo-001.jpg", "photo-002.jpg"]
}
```

**2. Auto-Sync to Impact Framework:**
```typescript
// Script reads empathy entry
// Creates outcome record:
{
  "title": "Youth Cultural Reconnection",
  "description": "Malachi reconnected with his culture...",
  "outcome_level": "medium_term", // months → medium_term
  "service_area": "atnarpa_homestead",
  "indicator_name": "Youth cultural reconnection",
  "qualitative_evidence": [
    "It's not too late to learn these things..."
  ],
  "success_stories": [
    "Malachi was involved in crime. Through our healing trip..."
  ],
  "participant_count": 1,
  "elder_involvement": true,
  "on_country_component": true,
  "traditional_knowledge_transmitted": true,
  "measurement_date": "2024-07-04",
  "source_empathy_entry_id": "emp-001"
}
```

**3. Link Photos:**
```typescript
// Update photos to link to outcome
UPDATE gallery_photos
SET linked_outcome_id = 'outcome-xyz',
    service_area = 'atnarpa_homestead',
    tags = ARRAY['cultural-healing', 'youth', 'on-country']
WHERE filename IN ('photo-001.jpg', 'photo-002.jpg');
```

**4. Appears in Impact Report:**
- Shows on Atnarpa Homestead dashboard
- Included in funder reports
- Photos display as visual evidence
- Story preserved with cultural context

**5. Publish Story (Optional):**
```typescript
// If approved for public website
INSERT INTO stories (
  organization_id,
  title,
  content,
  story_category,
  is_public,
  featured_image_url
) VALUES (
  OONCHIUMPA_ORG_ID,
  'Malachi Returns to Country',
  formatted_narrative,
  'cultural-healing',
  true,
  'photo-001.jpg'
);
```

---

## 🔑 KEY BENEFITS

### For Staff:
- ✅ Capture stories naturally in Empathy Ledger
- ✅ Auto-populate Impact Framework (no double entry)
- ✅ One source of truth for all data
- ✅ Cultural context preserved

### For Leadership:
- ✅ Real-time impact visibility
- ✅ Funder reports auto-generated
- ✅ Evidence-based storytelling
- ✅ Track 26+ outcomes across 5 services

### For Community:
- ✅ Stories told with cultural respect
- ✅ Elder involvement documented
- ✅ Impact visible and measurable
- ✅ Authentic representation

---

## 📍 WHERE TO START

### Immediate Actions:

1. **Review existing empathy_entries table**
   ```bash
   # Check what columns exist
   SELECT * FROM empathy_entries LIMIT 1;
   ```

2. **Add missing columns (if needed)**
   ```sql
   -- Run in Supabase SQL Editor
   ALTER TABLE empathy_entries ADD COLUMN IF NOT EXISTS synced_to_impact BOOLEAN DEFAULT FALSE;
   ALTER TABLE empathy_entries ADD COLUMN IF NOT EXISTS linked_outcome_id UUID;
   -- etc.
   ```

3. **Create sync script**
   ```bash
   # Copy template from above
   touch empathy-to-impact-sync.ts
   # Test with one entry
   npx tsx empathy-to-impact-sync.ts
   ```

4. **Add Empathy Ledger page to Staff Portal**
   ```bash
   # Create new page
   touch oonchiumpa-app/src/pages/EmpathyLedgerPage.tsx
   # Add route to Routes.tsx
   ```

5. **Test end-to-end**
   - Add test empathy entry
   - Run sync script
   - View outcome in Impact Dashboard
   - Generate report with new outcome

---

## 🎊 THE VISION

```
UNIFIED SYSTEM

Empathy Ledger           Impact Framework
     ↓                         ↓
  Capture                   Measure
     ↓                         ↓
  Review                    Report
     ↓                         ↓
  Sync ←─────────────────────→ Display
     ↓                         ↓
  Publish                   Evidence
     ↓                         ↓
   Stories  ←────────────→  Outcomes
     ↓                         ↓
 Community                  Funders

ALL FROM ONE DATA SOURCE
```

---

**Next Steps:**
1. Review current `empathy_entries` table structure
2. Decide which fields to map
3. Create sync script
4. Test with sample data
5. Build UI for staff
6. Automate sync process

**Want me to build any of these components?** I can create:
- The sync script
- The Empathy Ledger page for Staff Portal
- Database migration for new columns
- Automated sync setup
