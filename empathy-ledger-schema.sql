-- ============================================
-- 🎭 EMPATHY LEDGER CENTRALIZED PLATFORM
-- ============================================
-- Multi-tenant storytelling platform for Aboriginal communities
-- Following Supabase Guide principles for world-class architecture

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================
-- 📊 MULTI-TENANT ARCHITECTURE
-- ============================================

-- Organizations (tenants) - each website/org is a tenant
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- 'oonchiumpa', 'other-org'
    name TEXT NOT NULL,
    domain TEXT, -- 'oonchiumpa.org'
    
    -- Configuration
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}', -- logo, colors, etc.
    cultural_protocols JSONB DEFAULT '{}',
    
    -- Status
    active BOOLEAN DEFAULT true,
    subscription_tier TEXT DEFAULT 'standard',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT org_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT org_name_not_empty CHECK (length(trim(name)) > 0)
);

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- API keys for organization access
CREATE TABLE organization_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL, -- hashed in production
    permissions JSONB DEFAULT '{"read": true, "write": false}',
    
    -- Security
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    
    -- Rate limiting
    rate_limit_per_hour INTEGER DEFAULT 1000,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- 👥 STORYTELLER MANAGEMENT (Centralized)
-- ============================================

-- Storytellers - linked to auth.users following guide
CREATE TABLE storytellers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Empathy Ledger Core Identity
    empathy_ledger_id TEXT UNIQUE NOT NULL,
    public_name TEXT NOT NULL,
    
    -- Multi-tenant: storyteller can be in multiple orgs
    -- This is handled via storyteller_organizations table
    
    -- Profile
    email TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    languages_spoken TEXT[],
    
    -- Cultural Information
    cultural_background TEXT,
    traditional_country TEXT,
    community TEXT,
    tribal_affiliations TEXT[],
    
    -- Consent & Legal
    consent_given BOOLEAN NOT NULL DEFAULT false,
    consent_date TIMESTAMPTZ,
    consent_document_url TEXT,
    data_retention_preferences JSONB DEFAULT '{}',
    
    -- Privacy & Control Settings
    default_story_visibility story_visibility_level DEFAULT 'private',
    allow_cross_org_stories BOOLEAN DEFAULT false,
    
    -- Profile Management
    profile_completed BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ,
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(public_name, '') || ' ' ||
            coalesce(bio, '') || ' ' ||
            coalesce(community, '') || ' ' ||
            coalesce(cultural_background, '')
        )
    ) STORED
);

-- Enable RLS and create index
ALTER TABLE storytellers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_storytellers_search ON storytellers USING GIN(search_vector);
CREATE INDEX idx_storytellers_empathy_id ON storytellers(empathy_ledger_id);
CREATE INDEX idx_storytellers_community ON storytellers(community);

-- Storyteller-Organization relationships (many-to-many)
CREATE TABLE storyteller_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storyteller_id UUID NOT NULL REFERENCES storytellers(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Role within this organization
    role TEXT DEFAULT 'storyteller', -- storyteller, elder, coordinator, admin
    status TEXT DEFAULT 'active', -- active, inactive, pending
    
    -- Organization-specific settings
    org_permissions JSONB DEFAULT '{}',
    org_visibility_settings JSONB DEFAULT '{}',
    
    -- Joining details
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES storytellers(id),
    approved_by UUID REFERENCES storytellers(id),
    approved_at TIMESTAMPTZ,
    
    -- Ensure unique storyteller per org
    UNIQUE(storyteller_id, organization_id)
);

-- ============================================
-- 📖 STORIES - Core Empathy Ledger Entity
-- ============================================

-- Story visibility and control enums
CREATE TYPE story_visibility_level AS ENUM (
    'private',        -- Only storyteller
    'trusted',        -- Storyteller + trusted individuals
    'community',      -- Community members
    'organization',   -- Organization staff
    'network',        -- Empathy Ledger network (cross-org)
    'public',         -- Everyone
    'archived'        -- Hidden but preserved
);

CREATE TYPE story_control_level AS ENUM (
    'full_control',   -- Storyteller complete control
    'collaborative',  -- Storyteller + approved collaborators
    'guided',         -- Organization guidance with storyteller input
    'protected',      -- Organization managed (sensitive content)
    'locked'          -- Immutable (historical/legal)
);

CREATE TYPE cultural_sensitivity AS ENUM ('low', 'medium', 'high', 'sacred');

-- Stories table - the heart of Empathy Ledger
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Multi-tenant
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    
    -- Ownership & Identity
    storyteller_id UUID NOT NULL REFERENCES storytellers(id) ON DELETE CASCADE,
    empathy_ledger_story_id TEXT UNIQUE NOT NULL, -- Global unique story ID
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    summary TEXT, -- AI-generated summary
    
    -- Storyteller Control (Core Empathy Ledger Feature)
    is_active BOOLEAN NOT NULL DEFAULT true, -- The sacred toggle
    storyteller_approved BOOLEAN DEFAULT true,
    can_be_shared BOOLEAN DEFAULT true,
    sharing_conditions TEXT, -- Special conditions for sharing
    
    -- Metadata
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Cultural Context
    cultural_context TEXT,
    traditional_knowledge_level cultural_sensitivity DEFAULT 'medium',
    geographic_context TEXT,
    seasonal_context TEXT,
    ceremonial_context TEXT,
    gender_restrictions TEXT,
    age_restrictions TEXT,
    
    -- Temporal
    story_date DATE, -- When the story events occurred
    date_recorded TIMESTAMPTZ, -- When story was first recorded
    
    -- Media References (stored in org's own storage)
    featured_media_url TEXT,
    media_attachments JSONB DEFAULT '[]', -- Array of media references
    audio_url TEXT,
    video_url TEXT,
    
    -- AI & Search
    embedding vector(1536), -- For semantic search
    ai_generated_tags TEXT[],
    ai_content_warnings TEXT[],
    
    -- Engagement & Analytics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    
    -- Status & Workflow
    workflow_status TEXT DEFAULT 'draft', -- draft, review, approved, published
    publication_date TIMESTAMPTZ,
    archive_date TIMESTAMPTZ,
    
    -- Quality & Verification
    fact_checked BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES storytellers(id),
    verification_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(coalesce(tags, '{}'), ' ')), 'C')
    ) STORED,
    
    -- Constraints
    CONSTRAINT story_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT story_content_not_empty CHECK (length(trim(content)) > 0),
    CONSTRAINT story_empathy_id_format CHECK (empathy_ledger_story_id ~ '^EL[0-9]{4}[A-Z0-9]+$')
);

-- Enable RLS and create indexes
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_stories_storyteller ON stories(storyteller_id);
CREATE INDEX idx_stories_organization ON stories(organization_id);
CREATE INDEX idx_stories_active ON stories(is_active) WHERE is_active = true;
CREATE INDEX idx_stories_empathy_id ON stories(empathy_ledger_story_id);
CREATE INDEX idx_stories_search ON stories USING GIN(search_vector);
CREATE INDEX idx_stories_embedding ON stories USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_published ON stories(publication_date) WHERE publication_date IS NOT NULL;

-- ============================================
-- 🎛️ STORY PERMISSIONS - Granular Control
-- ============================================

CREATE TABLE story_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    
    -- Core Permission Levels
    visibility_level story_visibility_level NOT NULL DEFAULT 'private',
    control_level story_control_level NOT NULL DEFAULT 'full_control',
    
    -- Granular Permissions
    can_view BOOLEAN DEFAULT true,
    can_comment BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    can_download BOOLEAN DEFAULT false,
    can_print BOOLEAN DEFAULT false,
    can_translate BOOLEAN DEFAULT false,
    can_adapt BOOLEAN DEFAULT false, -- Create derived works
    
    -- Cultural Permissions
    requires_cultural_approval BOOLEAN DEFAULT false,
    cultural_approval_level cultural_sensitivity DEFAULT 'medium',
    elder_approval_required BOOLEAN DEFAULT false,
    community_consultation_required BOOLEAN DEFAULT false,
    
    -- Time-based Controls
    permission_start_date TIMESTAMPTZ DEFAULT NOW(),
    permission_end_date TIMESTAMPTZ,
    review_date TIMESTAMPTZ,
    
    -- Conditional Access
    access_conditions JSONB DEFAULT '{}', -- Geographic, demographic conditions
    usage_conditions JSONB DEFAULT '{}', -- How content can be used
    
    -- Audit Trail
    granted_by UUID REFERENCES storytellers(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_by UUID REFERENCES storytellers(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one permission record per story
    UNIQUE(story_id)
);

ALTER TABLE story_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 🔍 STORY ACCESS LOGS - Transparency
-- ============================================

CREATE TABLE story_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Access Details
    accessed_by UUID REFERENCES storytellers(id), -- null for anonymous
    access_type TEXT NOT NULL, -- view, share, download, etc.
    access_method TEXT, -- api, web, mobile
    user_agent TEXT,
    ip_address INET,
    
    -- Context
    referrer_url TEXT,
    session_id TEXT,
    
    -- Permissions at time of access
    permission_level story_visibility_level,
    cultural_sensitivity cultural_sensitivity,
    
    -- Metadata
    access_metadata JSONB DEFAULT '{}',
    access_duration INTERVAL, -- How long they viewed it
    
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for performance
CREATE TABLE story_access_logs_template (LIKE story_access_logs INCLUDING ALL);

-- ============================================
-- 🏛️ CULTURAL PROTOCOLS & GOVERNANCE
-- ============================================

-- Cultural advisors/elders for each organization
CREATE TABLE cultural_advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storyteller_id UUID NOT NULL REFERENCES storytellers(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Advisor Details
    advisor_type TEXT NOT NULL, -- elder, cultural_keeper, community_leader
    cultural_authority_areas TEXT[], -- What areas they advise on
    languages TEXT[],
    traditional_knowledge_areas TEXT[],
    
    -- Status
    verified BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    
    -- Appointment Details
    appointed_by UUID REFERENCES storytellers(id),
    appointed_date TIMESTAMPTZ DEFAULT NOW(),
    term_end_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultural review requests
CREATE TABLE cultural_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Review Request
    requested_by UUID NOT NULL REFERENCES storytellers(id),
    assigned_to UUID REFERENCES cultural_advisors(id),
    review_type TEXT NOT NULL, -- content, cultural_sensitivity, protocols
    
    -- Review Details
    sensitivity_level cultural_sensitivity,
    review_notes TEXT,
    recommendations TEXT[],
    approval_status TEXT DEFAULT 'pending', -- pending, approved, requires_changes, rejected
    
    -- Timeline
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Metadata
    review_criteria JSONB DEFAULT '{}',
    cultural_protocols_followed JSONB DEFAULT '{}'
);

-- ============================================
-- 🔄 FUNCTIONS & TRIGGERS (Automation)
-- ============================================

-- Function to generate Empathy Ledger Story ID
CREATE OR REPLACE FUNCTION generate_empathy_story_id()
RETURNS TEXT AS $$
DECLARE
    year_code TEXT;
    random_suffix TEXT;
    story_id TEXT;
BEGIN
    -- Get year code (last 2 digits)
    year_code := to_char(NOW(), 'YY');
    
    -- Generate random suffix (6 characters: letters + numbers)
    random_suffix := upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 6));
    
    -- Construct ID: EL + year + random
    story_id := 'EL' || year_code || random_suffix;
    
    -- Ensure uniqueness (recursive if collision)
    IF EXISTS (SELECT 1 FROM stories WHERE empathy_ledger_story_id = story_id) THEN
        RETURN generate_empathy_story_id();
    END IF;
    
    RETURN story_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate story ID
CREATE OR REPLACE FUNCTION set_story_empathy_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.empathy_ledger_story_id IS NULL THEN
        NEW.empathy_ledger_story_id := generate_empathy_story_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_empathy_id_trigger
    BEFORE INSERT ON stories
    FOR EACH ROW
    EXECUTE FUNCTION set_story_empathy_id();

-- Trigger to create default permissions
CREATE OR REPLACE FUNCTION create_default_story_permissions()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO story_permissions (
        story_id,
        visibility_level,
        control_level,
        granted_by
    ) VALUES (
        NEW.id,
        COALESCE(
            (SELECT default_story_visibility FROM storytellers WHERE id = NEW.storyteller_id),
            'private'::story_visibility_level
        ),
        'full_control'::story_control_level,
        NEW.storyteller_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_default_permissions_trigger
    AFTER INSERT ON stories
    FOR EACH ROW
    EXECUTE FUNCTION create_default_story_permissions();

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER storytellers_updated_at BEFORE UPDATE ON storytellers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER story_permissions_updated_at BEFORE UPDATE ON story_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 🔐 ROW LEVEL SECURITY POLICIES
-- ============================================

-- Organizations: Only members can see their org
CREATE POLICY "org_members_access" ON organizations
    FOR SELECT 
    USING (
        id IN (
            SELECT so.organization_id 
            FROM storyteller_organizations so 
            WHERE so.storyteller_id = auth.uid()
            AND so.status = 'active'
        )
    );

-- Storytellers: Can see themselves + org members can see each other
CREATE POLICY "storytellers_self_and_org" ON storytellers
    FOR SELECT 
    USING (
        id = auth.uid() OR
        id IN (
            SELECT DISTINCT so1.storyteller_id
            FROM storyteller_organizations so1
            WHERE so1.organization_id IN (
                SELECT so2.organization_id
                FROM storyteller_organizations so2
                WHERE so2.storyteller_id = auth.uid()
                AND so2.status = 'active'
            )
        )
    );

-- Storytellers can only update themselves
CREATE POLICY "storytellers_self_update" ON storytellers
    FOR UPDATE 
    USING (id = auth.uid());

-- Stories: Complex visibility based on permissions
CREATE POLICY "stories_visibility_control" ON stories
    FOR SELECT 
    USING (
        CASE 
            -- Storyteller can always see their own stories
            WHEN storyteller_id = auth.uid() THEN true
            
            -- Inactive stories are only visible to storyteller
            WHEN NOT is_active THEN false
            
            -- Check permission level
            WHEN EXISTS (
                SELECT 1 FROM story_permissions sp
                WHERE sp.story_id = stories.id
                AND (
                    -- Public stories
                    (sp.visibility_level = 'public') OR
                    
                    -- Network stories (cross-org Empathy Ledger)
                    (sp.visibility_level = 'network' AND auth.uid() IS NOT NULL) OR
                    
                    -- Organization stories (same org)
                    (sp.visibility_level = 'organization' AND 
                     organization_id IN (
                         SELECT so.organization_id 
                         FROM storyteller_organizations so 
                         WHERE so.storyteller_id = auth.uid()
                     )) OR
                     
                    -- Community stories (same community)
                    (sp.visibility_level = 'community' AND 
                     EXISTS (
                         SELECT 1 FROM storytellers s1, storytellers s2
                         WHERE s1.id = stories.storyteller_id
                         AND s2.id = auth.uid()
                         AND s1.community = s2.community
                     ))
                )
            ) THEN true
            
            ELSE false
        END
    );

-- Storytellers can update their own stories
CREATE POLICY "stories_storyteller_update" ON stories
    FOR UPDATE 
    USING (storyteller_id = auth.uid());

-- Story permissions: Storytellers control their story permissions
CREATE POLICY "story_permissions_control" ON story_permissions
    FOR ALL 
    USING (
        story_id IN (
            SELECT id FROM stories WHERE storyteller_id = auth.uid()
        )
    );

-- ============================================
-- 📊 VIEWS FOR COMMON QUERIES
-- ============================================

-- Storyteller dashboard view
CREATE VIEW storyteller_dashboard AS
SELECT 
    s.id,
    s.empathy_ledger_id,
    s.public_name,
    s.avatar_url,
    s.community,
    s.cultural_background,
    COUNT(st.id) as total_stories,
    COUNT(st.id) FILTER (WHERE st.is_active = true) as active_stories,
    COUNT(st.id) FILTER (WHERE st.workflow_status = 'published') as published_stories,
    SUM(st.view_count) as total_views,
    AVG(st.engagement_score) as avg_engagement,
    s.last_active_at
FROM storytellers s
LEFT JOIN stories st ON s.id = st.storyteller_id
GROUP BY s.id, s.empathy_ledger_id, s.public_name, s.avatar_url, 
         s.community, s.cultural_background, s.last_active_at;

-- Organization stories view
CREATE VIEW organization_stories AS
SELECT 
    s.*,
    st.public_name as storyteller_name,
    st.community as storyteller_community,
    sp.visibility_level,
    sp.control_level,
    sp.cultural_approval_level,
    o.name as organization_name,
    o.slug as organization_slug
FROM stories s
JOIN storytellers st ON s.storyteller_id = st.id
JOIN story_permissions sp ON s.id = sp.story_id
JOIN organizations o ON s.organization_id = o.id
WHERE s.is_active = true;

-- ============================================
-- 📈 SAMPLE DATA (For Testing)
-- ============================================

-- Insert sample organization (Oonchiumpa)
INSERT INTO organizations (slug, name, domain, settings) VALUES 
('oonchiumpa', 'Oonchiumpa Community Platform', 'oonchiumpa.org', '{
    "theme": "aboriginal-cultural",
    "features": ["storytelling", "outcomes", "partnerships"],
    "branding": {
        "primary_color": "#8B4513",
        "secondary_color": "#F5E6D3"
    }
}');

-- Enable realtime for key tables
ALTER TABLE stories REPLICA IDENTITY FULL;
ALTER TABLE story_permissions REPLICA IDENTITY FULL;

-- Grant appropriate permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE stories IS 'Core Empathy Ledger stories with storyteller control';
COMMENT ON COLUMN stories.is_active IS 'Sacred toggle - storyteller can turn story on/off anytime';
COMMENT ON COLUMN stories.empathy_ledger_story_id IS 'Global unique ID across all Empathy Ledger instances';
COMMENT ON TABLE story_permissions IS 'Granular permission control for each story';
COMMENT ON VIEW storyteller_dashboard IS 'Dashboard summary for storytellers';

-- ============================================
-- 🎯 EMPATHY LEDGER API ENDPOINTS
-- ============================================
-- These will be exposed via PostgREST or custom functions
-- Storytellers can:
-- 1. Toggle story visibility: UPDATE stories SET is_active = ? WHERE id = ? AND storyteller_id = auth.uid()
-- 2. Update permissions: UPDATE story_permissions SET visibility_level = ? WHERE story_id IN (SELECT id FROM stories WHERE storyteller_id = auth.uid())
-- 3. View dashboard: SELECT * FROM storyteller_dashboard WHERE id = auth.uid()
-- 4. Access logs: SELECT * FROM story_access_logs WHERE story_id IN (SELECT id FROM stories WHERE storyteller_id = auth.uid())