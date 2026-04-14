-- ============================================================================
-- OONCHIUMPA IMPACT FRAMEWORK - DATABASE SCHEMA
-- ============================================================================
-- Purpose: Track outcomes, activities, and impact across all services
-- Version: 1.0
-- Date: October 26, 2025
-- ============================================================================

-- ============================================================================
-- 1. OUTCOMES TABLE
-- ============================================================================
-- Stores all measured outcomes linked to services, documents, and stories

CREATE TABLE IF NOT EXISTS public.outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organization & Project
    organization_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    project_id UUID REFERENCES public.projects(id),

    -- Outcome Details
    title TEXT NOT NULL,
    description TEXT,
    outcome_type TEXT NOT NULL CHECK (outcome_type IN (
        'individual',  -- Individual participant outcome
        'program',     -- Program-level outcome
        'community',   -- Community-wide impact
        'systemic'     -- System change outcome
    )),
    outcome_level TEXT NOT NULL CHECK (outcome_level IN (
        'output',      -- Direct deliverable
        'short_term',  -- 0-6 months
        'medium_term', -- 6-18 months
        'long_term',   -- 18+ months
        'impact'       -- Lasting change
    )),

    -- Service Area
    service_area TEXT NOT NULL CHECK (service_area IN (
        'youth_mentorship',
        'true_justice',
        'atnarpa_homestead',
        'cultural_brokerage',
        'good_news_stories',
        'general'
    )),

    -- Measurement
    indicator_name TEXT NOT NULL,  -- e.g., "School Re-engagement Rate"
    measurement_method TEXT,       -- How it's measured
    baseline_value NUMERIC,        -- Starting value
    target_value NUMERIC,          -- Goal
    current_value NUMERIC,         -- Current measurement
    unit TEXT,                     -- e.g., "percentage", "count", "hours"

    -- Qualitative Data
    qualitative_evidence TEXT[],   -- Array of quotes, observations
    success_stories TEXT[],        -- Linked story IDs or quotes
    challenges TEXT[],             -- Barriers encountered
    learnings TEXT[],              -- Key insights

    -- Linkages
    source_document_ids UUID[],    -- Documents evidencing this outcome
    related_story_ids UUID[],      -- Stories illustrating this outcome
    activity_ids UUID[],           -- Activities that produced this outcome
    participant_count INT,         -- Number of participants (anonymized)

    -- Cultural Indicators
    cultural_protocols_followed BOOLEAN DEFAULT true,
    elder_involvement BOOLEAN DEFAULT false,
    traditional_knowledge_transmitted BOOLEAN DEFAULT false,
    on_country_component BOOLEAN DEFAULT false,
    language_use TEXT[],           -- Languages used

    -- Metadata
    measurement_date DATE,
    reported_by UUID,              -- Staff member who recorded
    verified_by UUID,              -- Elder or supervisor who verified
    verification_date DATE,
    data_quality TEXT CHECK (data_quality IN ('excellent', 'good', 'fair', 'needs_improvement')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT positive_values CHECK (
        (baseline_value IS NULL OR baseline_value >= 0) AND
        (target_value IS NULL OR target_value >= 0) AND
        (current_value IS NULL OR current_value >= 0)
    )
);

-- Indexes for performance
CREATE INDEX idx_outcomes_organization ON public.outcomes(organization_id);
CREATE INDEX idx_outcomes_tenant ON public.outcomes(tenant_id);
CREATE INDEX idx_outcomes_service_area ON public.outcomes(service_area);
CREATE INDEX idx_outcomes_type ON public.outcomes(outcome_type);
CREATE INDEX idx_outcomes_level ON public.outcomes(outcome_level);
CREATE INDEX idx_outcomes_measurement_date ON public.outcomes(measurement_date);

-- RLS Policies
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view outcomes from their organization"
    ON public.outcomes FOR SELECT
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY "Staff can insert outcomes for their organization"
    ON public.outcomes FOR INSERT
    WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY "Staff can update outcomes for their organization"
    ON public.outcomes FOR UPDATE
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

-- ============================================================================
-- 2. ACTIVITIES TABLE
-- ============================================================================
-- Tracks all program activities that produce outcomes

CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organization & Project
    organization_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    project_id UUID REFERENCES public.projects(id),

    -- Activity Details
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'mentoring_session',
        'on_country_camp',
        'deep_listening_circle',
        'service_navigation',
        'community_event',
        'cultural_healing',
        'skill_building',
        'leadership_development',
        'referral',
        'consultation',
        'other'
    )),

    -- Service Area
    service_area TEXT NOT NULL CHECK (service_area IN (
        'youth_mentorship',
        'true_justice',
        'atnarpa_homestead',
        'cultural_brokerage',
        'good_news_stories',
        'general'
    )),

    -- When & Where
    activity_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INT,
    location TEXT,
    on_country BOOLEAN DEFAULT false,

    -- Participants (Anonymized Aggregate Data)
    participant_count INT,
    participant_age_range TEXT,     -- e.g., "12-18", "mixed"
    participant_gender_breakdown JSONB, -- e.g., {"male": 12, "female": 9}
    language_groups TEXT[],
    communities_represented TEXT[],

    -- Facilitation
    facilitators TEXT[],             -- Staff names or roles
    elder_involvement BOOLEAN DEFAULT false,
    elders_involved TEXT[],
    cultural_authority_present BOOLEAN DEFAULT false,

    -- Cultural Elements
    cultural_protocols_followed BOOLEAN DEFAULT true,
    traditional_knowledge_shared BOOLEAN DEFAULT false,
    knowledge_topics TEXT[],        -- e.g., ["bush tucker", "language", "songlines"]
    language_use TEXT[],
    cultural_materials_used TEXT[],

    -- Resources
    budget_allocated NUMERIC,
    actual_cost NUMERIC,
    partners_involved TEXT[],
    transport_provided BOOLEAN DEFAULT false,
    meals_provided BOOLEAN DEFAULT false,

    -- Outputs & Observations
    outputs TEXT[],                 -- What was produced
    outcomes_observed TEXT[],       -- Immediate changes noticed
    participant_feedback TEXT[],
    facilitator_reflections TEXT,
    photos_taken INT DEFAULT 0,
    videos_recorded INT DEFAULT 0,

    -- Linkages
    related_outcome_ids UUID[],     -- Outcomes this activity contributed to
    source_document_id UUID,        -- Document describing this activity
    media_ids UUID[],               -- Photos/videos from this activity

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    follow_up_date DATE,

    -- Metadata
    recorded_by UUID,
    verified_by UUID,
    verification_date DATE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_organization ON public.activities(organization_id);
CREATE INDEX idx_activities_tenant ON public.activities(tenant_id);
CREATE INDEX idx_activities_service_area ON public.activities(service_area);
CREATE INDEX idx_activities_type ON public.activities(activity_type);
CREATE INDEX idx_activities_date ON public.activities(activity_date);

-- RLS Policies
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities from their organization"
    ON public.activities FOR SELECT
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY "Staff can insert activities for their organization"
    ON public.activities FOR INSERT
    WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY "Staff can update activities for their organization"
    ON public.activities FOR UPDATE
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

-- ============================================================================
-- 3. SERVICE_IMPACT TABLE
-- ============================================================================
-- Aggregates impact data by service area for reporting

CREATE TABLE IF NOT EXISTS public.service_impact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organization & Project
    organization_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    project_id UUID REFERENCES public.projects(id),

    -- Service
    service_area TEXT NOT NULL CHECK (service_area IN (
        'youth_mentorship',
        'true_justice',
        'atnarpa_homestead',
        'cultural_brokerage',
        'good_news_stories'
    )),

    -- Reporting Period
    reporting_period TEXT NOT NULL, -- e.g., "2025-Q1", "2025", "Jan-Jun 2025"
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Participation Metrics
    total_participants INT,
    new_participants INT,
    returning_participants INT,
    completion_rate NUMERIC,       -- Percentage
    retention_rate NUMERIC,        -- Percentage

    -- Activity Metrics
    activities_delivered INT,
    total_activity_hours NUMERIC,
    on_country_hours NUMERIC,
    elder_involvement_hours NUMERIC,

    -- Outcome Metrics
    outcomes_achieved INT,
    outcomes_in_progress INT,
    target_achievement_rate NUMERIC, -- Percentage of targets met

    -- Individual Outcomes (Aggregated)
    cultural_connection_improved INT,  -- Count of participants
    skills_developed INT,
    leadership_roles_assumed INT,
    school_reengagement INT,
    reduced_justice_involvement INT,

    -- Community Outcomes
    community_events_held INT,
    community_participation INT,
    partnerships_activated INT,
    service_referrals_made INT,
    referral_success_rate NUMERIC,

    -- Cultural Indicators
    traditional_knowledge_sessions INT,
    language_use_sessions INT,
    cultural_protocols_maintained_rate NUMERIC, -- Percentage
    elder_satisfaction_rate NUMERIC,

    -- Qualitative Summary
    success_stories_count INT,
    key_achievements TEXT[],
    challenges_faced TEXT[],
    learnings_identified TEXT[],
    testimonials TEXT[],

    -- Media & Documentation
    photos_collected INT,
    videos_produced INT,
    documents_created INT,
    stories_published INT,

    -- Financial
    budget_allocated NUMERIC,
    budget_spent NUMERIC,
    cost_per_participant NUMERIC,

    -- Linkages
    outcome_ids UUID[],
    activity_ids UUID[],
    document_ids UUID[],
    story_ids UUID[],

    -- Metadata
    compiled_by UUID,
    reviewed_by UUID,
    approved_by UUID,
    approval_date DATE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_period CHECK (period_end >= period_start),
    CONSTRAINT valid_rates CHECK (
        (completion_rate IS NULL OR (completion_rate >= 0 AND completion_rate <= 100)) AND
        (retention_rate IS NULL OR (retention_rate >= 0 AND retention_rate <= 100)) AND
        (target_achievement_rate IS NULL OR (target_achievement_rate >= 0 AND target_achievement_rate <= 100))
    )
);

-- Indexes
CREATE INDEX idx_service_impact_organization ON public.service_impact(organization_id);
CREATE INDEX idx_service_impact_service ON public.service_impact(service_area);
CREATE INDEX idx_service_impact_period ON public.service_impact(period_start, period_end);

-- RLS Policies
ALTER TABLE public.service_impact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view service impact from their organization"
    ON public.service_impact FOR SELECT
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

CREATE POLICY "Admins can manage service impact for their organization"
    ON public.service_impact FOR ALL
    USING (organization_id = current_setting('app.current_organization_id', true)::UUID);

-- ============================================================================
-- 4. DOCUMENT_OUTCOMES JUNCTION TABLE
-- ============================================================================
-- Links documents to the outcomes they evidence

CREATE TABLE IF NOT EXISTS public.document_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.transcripts(id) ON DELETE CASCADE,
    outcome_id UUID NOT NULL REFERENCES public.outcomes(id) ON DELETE CASCADE,

    -- Evidence Details
    evidence_type TEXT CHECK (evidence_type IN (
        'quantitative',  -- Numbers, metrics
        'qualitative',   -- Quotes, observations
        'mixed'          -- Both
    )),
    relevance_score NUMERIC CHECK (relevance_score >= 0 AND relevance_score <= 1),
    extraction_method TEXT CHECK (extraction_method IN (
        'manual',        -- Staff added
        'ai_extracted',  -- AI analysis
        'verified'       -- AI then manually verified
    )),

    -- Extracted Evidence
    evidence_text TEXT,
    evidence_page INT,      -- For PDFs
    confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),

    -- Metadata
    extracted_at TIMESTAMPTZ DEFAULT NOW(),
    extracted_by UUID,
    verified_at TIMESTAMPTZ,
    verified_by UUID,

    -- Unique constraint
    UNIQUE(document_id, outcome_id)
);

CREATE INDEX idx_document_outcomes_document ON public.document_outcomes(document_id);
CREATE INDEX idx_document_outcomes_outcome ON public.document_outcomes(outcome_id);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate outcome progress
CREATE OR REPLACE FUNCTION calculate_outcome_progress(outcome_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    baseline NUMERIC;
    target NUMERIC;
    current NUMERIC;
    progress NUMERIC;
BEGIN
    SELECT baseline_value, target_value, current_value
    INTO baseline, target, current
    FROM public.outcomes
    WHERE id = outcome_id;

    IF baseline IS NULL OR target IS NULL OR current IS NULL THEN
        RETURN NULL;
    END IF;

    IF target = baseline THEN
        RETURN 100;
    END IF;

    progress := ((current - baseline) / (target - baseline)) * 100;
    RETURN LEAST(100, GREATEST(0, progress));
END;
$$ LANGUAGE plpgsql;

-- Function to get service area summary
CREATE OR REPLACE FUNCTION get_service_summary(
    p_service_area TEXT,
    p_organization_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'service_area', p_service_area,
        'total_activities', COUNT(DISTINCT a.id),
        'total_participants', SUM(a.participant_count),
        'total_outcomes', COUNT(DISTINCT o.id),
        'outcomes_achieved', COUNT(DISTINCT o.id) FILTER (WHERE o.current_value >= o.target_value),
        'average_progress', AVG(calculate_outcome_progress(o.id))
    )
    INTO result
    FROM public.activities a
    LEFT JOIN public.outcomes o ON o.service_area = a.service_area
    WHERE a.service_area = p_service_area
        AND a.organization_id = p_organization_id
        AND (p_start_date IS NULL OR a.activity_date >= p_start_date)
        AND (p_end_date IS NULL OR a.activity_date <= p_end_date);

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON public.outcomes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_impact_updated_at BEFORE UPDATE ON public.service_impact
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMENT ON TABLE public.outcomes IS 'Tracks measured outcomes across all Oonchiumpa services';
COMMENT ON TABLE public.activities IS 'Records all program activities that produce outcomes';
COMMENT ON TABLE public.service_impact IS 'Aggregates impact data by service area for reporting';
COMMENT ON TABLE public.document_outcomes IS 'Links documents to outcomes they evidence';
