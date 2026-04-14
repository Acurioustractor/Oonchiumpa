import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('📊 Creating Outcomes Database Tables\n');

  // Create OUTCOMES table
  const outcomesSQL = `
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
  `;

  const { error: outcomesError } = await supabase.rpc('exec_sql', { sql: outcomesSQL });
  if (outcomesError) {
    console.log('❌ Outcomes table error:', outcomesError.message);
  } else {
    console.log('✅ Outcomes table created');
  }

  // Create ACTIVITIES table
  const activitiesSQL = `
    CREATE TABLE IF NOT EXISTS public.activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_id UUID NOT NULL,
      tenant_id UUID NOT NULL,
      project_id UUID REFERENCES public.projects(id),

      title TEXT NOT NULL,
      description TEXT,
      activity_type TEXT NOT NULL CHECK (activity_type IN (
        'mentoring_session', 'on_country_camp', 'deep_listening_circle',
        'service_navigation', 'community_event', 'cultural_healing',
        'skill_building', 'leadership_development', 'referral',
        'consultation', 'other', 'school_support', 'service_coordination',
        'legal_education_program', 'station_work', 'educational_program',
        'preparatory_seminar', 'cultural_site_visits', 'deep_listening_program',
        'learning_program', 'cultural_brokerage', 'case_management',
        'mentoring', 'sports_engagement', 'cultural_sharing'
      )),

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
  `;

  const { error: activitiesError } = await supabase.rpc('exec_sql', { sql: activitiesSQL });
  if (activitiesError) {
    console.log('❌ Activities table error:', activitiesError.message);
  } else {
    console.log('✅ Activities table created');
  }

  // Create SERVICE_IMPACT table
  const serviceImpactSQL = `
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
  `;

  const { error: serviceImpactError } = await supabase.rpc('exec_sql', { sql: serviceImpactSQL });
  if (serviceImpactError) {
    console.log('❌ Service Impact table error:', serviceImpactError.message);
  } else {
    console.log('✅ Service Impact table created');
  }

  // Create DOCUMENT_OUTCOMES table
  const documentOutcomesSQL = `
    CREATE TABLE IF NOT EXISTS public.document_outcomes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID NOT NULL REFERENCES public.transcripts(id),
      outcome_id UUID NOT NULL REFERENCES public.outcomes(id),

      evidence_type TEXT CHECK (evidence_type IN ('quantitative', 'qualitative', 'mixed')),
      extraction_method TEXT CHECK (extraction_method IN ('manual', 'ai_extracted', 'verified')),
      evidence_text TEXT,
      confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),

      UNIQUE(document_id, outcome_id)
    );
  `;

  const { error: documentOutcomesError } = await supabase.rpc('exec_sql', { sql: documentOutcomesSQL });
  if (documentOutcomesError) {
    console.log('❌ Document Outcomes table error:', documentOutcomesError.message);
  } else {
    console.log('✅ Document Outcomes table created');
  }

  console.log('\n✅ All tables created!\n');
}

createTables().catch(console.error);
