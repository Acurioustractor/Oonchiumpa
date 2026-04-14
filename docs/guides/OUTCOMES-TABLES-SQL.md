# Outcomes Database Tables - SQL Script

**IMPORTANT:** These tables need to be created in the Supabase SQL Editor at:
https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new

Copy and paste each section below into the SQL Editor and run them one at a time.

---

## 1. OUTCOMES Table

```sql
CREATE TABLE IF NOT EXISTS public.outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id),

  -- Outcome Details
  title TEXT NOT NULL,
  description TEXT,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN (
    'individual', 'program', 'community', 'systemic'
  )),
  outcome_level TEXT NOT NULL CHECK (outcome_level IN (
    'output', 'short_term', 'medium_term', 'long_term', 'impact'
  )),

  service_area TEXT NOT NULL CHECK (service_area IN (
    'youth_mentorship', 'true_justice', 'atnarpa_homestead',
    'cultural_brokerage', 'good_news_stories', 'general'
  )),

  -- Measurement
  indicator_name TEXT NOT NULL,
  measurement_method TEXT,
  baseline_value NUMERIC,
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT,

  -- Qualitative Data
  qualitative_evidence TEXT[],
  success_stories TEXT[],
  challenges TEXT[],
  learnings TEXT[],

  -- Linkages
  source_document_ids UUID[],
  related_story_ids UUID[],
  activity_ids UUID[],
  participant_count INT,

  -- Cultural Indicators
  cultural_protocols_followed BOOLEAN DEFAULT true,
  elder_involvement BOOLEAN DEFAULT false,
  traditional_knowledge_transmitted BOOLEAN DEFAULT false,
  on_country_component BOOLEAN DEFAULT false,
  language_use TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON public.outcomes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.outcomes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.outcomes
  FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## 2. ACTIVITIES Table

```sql
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id),

  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL,

  service_area TEXT NOT NULL,
  activity_date DATE NOT NULL,
  duration_minutes INT,
  location TEXT,
  on_country BOOLEAN DEFAULT false,

  -- Participants (Anonymized)
  participant_count INT,
  participant_age_range TEXT,
  language_groups TEXT[],

  -- Cultural Elements
  elder_involvement BOOLEAN DEFAULT false,
  traditional_knowledge_shared BOOLEAN DEFAULT false,
  knowledge_topics TEXT[],

  -- Outputs
  outputs TEXT[],
  outcomes_observed TEXT[],
  participant_feedback TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON public.activities
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 3. SERVICE_IMPACT Table

```sql
CREATE TABLE IF NOT EXISTS public.service_impact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  service_area TEXT NOT NULL,

  reporting_period TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Metrics
  total_participants INT,
  retention_rate NUMERIC,
  outcomes_achieved INT,
  target_achievement_rate NUMERIC,

  -- Cultural Indicators
  elder_satisfaction_rate NUMERIC,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.service_impact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON public.service_impact
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.service_impact
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 4. DOCUMENT_OUTCOMES Table

```sql
CREATE TABLE IF NOT EXISTS public.document_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.transcripts(id),
  outcome_id UUID NOT NULL REFERENCES public.outcomes(id),

  evidence_type TEXT CHECK (evidence_type IN ('quantitative', 'qualitative', 'mixed')),
  extraction_method TEXT CHECK (extraction_method IN ('manual', 'ai_extracted', 'verified')),
  evidence_text TEXT,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(document_id, outcome_id)
);

-- Add RLS policies
ALTER TABLE public.document_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" ON public.document_outcomes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.document_outcomes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## Next Steps

After running all 4 SQL scripts above in the Supabase SQL Editor:

1. Run the import script:
   ```bash
   npx tsx import-outcomes-to-database.ts
   ```

2. This will populate the database with:
   - 16 Outcomes from AI analysis
   - 14 Activities from documents
   - Document-to-outcome linkages

3. Then you can build the visualization pages to display this data
