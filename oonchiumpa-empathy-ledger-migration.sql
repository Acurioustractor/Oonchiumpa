-- ============================================
-- 🎭 OONCHIUMPA EMPATHY LEDGER INTEGRATION
-- ============================================
-- Adding Empathy Ledger capabilities to existing Supabase
-- This is Option 2: Prototype/test on current platform
-- Migration-ready design for future dedicated platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 📊 MULTI-TENANT FOUNDATION (Minimal)
-- ============================================

-- Organizations table (start with Oonchiumpa as tenant #1)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    domain TEXT,
    
    -- Settings for this prototype
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    cultural_protocols JSONB DEFAULT '{}',
    
    -- Status
    active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT org_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Insert Oonchiumpa as the first organization
INSERT INTO organizations (slug, name, domain, settings, branding, cultural_protocols) 
VALUES (
    'oonchiumpa',
    'Oonchiumpa Community Platform',
    'oonchiumpa.org',
    '{
        "theme": "aboriginal-cultural",
        "features": ["storytelling", "outcomes", "partnerships", "empathy-ledger"],
        "prototype_mode": true
    }',
    '{
        "primary_color": "#8B4513",
        "secondary_color": "#F5E6D3",
        "accent_color": "#D2691E",
        "logo_url": "/assets/oonchiumpa-logo.svg"
    }',
    '{
        "default_sensitivity": "medium",
        "requires_elder_approval": ["high", "sacred"],
        "community_consultation": true,
        "seasonal_restrictions": true,
        "auto_cultural_review": true
    }'
) ON CONFLICT (slug) DO UPDATE SET
    settings = EXCLUDED.settings,
    branding = EXCLUDED.branding,
    cultural_protocols = EXCLUDED.cultural_protocols,
    updated_at = NOW();

-- ============================================
-- 👥 EMPATHY LEDGER STORYTELLERS
-- ============================================

-- Extend existing storytellers or create new table
CREATE TABLE IF NOT EXISTS empathy_storytellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to existing auth if available, or standalone
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Core Empathy Ledger Identity
    empathy_ledger_id TEXT UNIQUE NOT NULL,
    public_name TEXT NOT NULL,
    
    -- Link to organization (start with Oonchiumpa)
    primary_organization_id UUID REFERENCES organizations(id) DEFAULT (
        SELECT id FROM organizations WHERE slug = 'oonchiumpa' LIMIT 1
    ),
    
    -- Profile Information
    email TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    
    -- Cultural Information
    cultural_background TEXT,
    traditional_country TEXT,
    community TEXT,
    languages_spoken TEXT[],
    tribal_affiliations TEXT[],
    
    -- Empathy Ledger Settings
    default_story_visibility TEXT DEFAULT 'private',
    allow_cross_org_stories BOOLEAN DEFAULT false,
    
    -- Consent & Legal
    consent_given BOOLEAN NOT NULL DEFAULT false,
    consent_date TIMESTAMPTZ,
    data_retention_preferences JSONB DEFAULT '{}',
    
    -- Status
    profile_completed BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ,
    
    -- Search optimization
    search_text TEXT GENERATED ALWAYS AS (
        coalesce(public_name, '') || ' ' ||
        coalesce(bio, '') || ' ' ||
        coalesce(community, '') || ' ' ||
        coalesce(cultural_background, '')
    ) STORED
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_empathy_storytellers_ledger_id ON empathy_storytellers(empathy_ledger_id);
CREATE INDEX IF NOT EXISTS idx_empathy_storytellers_org ON empathy_storytellers(primary_organization_id);
CREATE INDEX IF NOT EXISTS idx_empathy_storytellers_community ON empathy_storytellers(community);
CREATE INDEX IF NOT EXISTS idx_empathy_storytellers_search ON empathy_storytellers USING GIN(to_tsvector('english', search_text));

-- ============================================
-- 📖 EMPATHY LEDGER STORIES
-- ============================================

-- Story visibility and control enums
DO $$ BEGIN
    CREATE TYPE story_visibility_level AS ENUM (
        'private',        -- Only storyteller
        'trusted',        -- Storyteller + trusted individuals  
        'community',      -- Community members
        'organization',   -- Organization staff
        'network',        -- Empathy Ledger network
        'public',         -- Everyone
        'archived'        -- Hidden but preserved
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE story_control_level AS ENUM (
        'full_control',   -- Storyteller complete control
        'collaborative',  -- Storyteller + approved collaborators
        'guided',         -- Organization guidance with storyteller input
        'protected',      -- Organization managed (sensitive content)
        'locked'          -- Immutable (historical/legal)
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cultural_sensitivity AS ENUM ('low', 'medium', 'high', 'sacred');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Empathy Ledger Stories Table
CREATE TABLE IF NOT EXISTS empathy_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Organization context
    organization_id UUID REFERENCES organizations(id) DEFAULT (
        SELECT id FROM organizations WHERE slug = 'oonchiumpa' LIMIT 1
    ),
    
    -- Core Story Identity
    empathy_ledger_story_id TEXT UNIQUE NOT NULL,
    storyteller_id UUID NOT NULL REFERENCES empathy_storytellers(id) ON DELETE CASCADE,
    
    -- Story Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    summary TEXT, -- AI-generated
    
    -- 🎭 EMPATHY LEDGER CORE: Storyteller Control
    is_active BOOLEAN NOT NULL DEFAULT true, -- The sacred toggle!
    storyteller_approved BOOLEAN DEFAULT true,
    can_be_shared BOOLEAN DEFAULT true,
    sharing_conditions TEXT,
    
    -- Story Metadata
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Cultural Context
    cultural_context TEXT,
    traditional_knowledge_level cultural_sensitivity DEFAULT 'medium',
    geographic_context TEXT,
    seasonal_context TEXT,
    ceremonial_context TEXT,
    
    -- Media (can link to existing Oonchiumpa media or external)
    featured_media_url TEXT,
    media_attachments JSONB DEFAULT '[]',
    audio_url TEXT,
    video_url TEXT,
    
    -- AI & Search Capabilities
    embedding vector(1536), -- For semantic search
    ai_generated_tags TEXT[],
    ai_content_warnings TEXT[],
    
    -- Analytics & Engagement
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    
    -- Workflow Status
    workflow_status TEXT DEFAULT 'draft',
    publication_date TIMESTAMPTZ,
    archive_date TIMESTAMPTZ,
    
    -- Quality Control
    fact_checked BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES empathy_storytellers(id),
    
    -- Integration with existing Oonchiumpa data
    linked_story_id UUID, -- Link to existing stories table if needed
    linked_outcome_ids UUID[], -- Link to outcomes
    linked_partner_ids UUID[], -- Link to partners
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Full-text search
    search_text TEXT GENERATED ALWAYS AS (
        title || ' ' || content || ' ' || 
        coalesce(excerpt, '') || ' ' ||
        array_to_string(coalesce(tags, '{}'), ' ')
    ) STORED,
    
    -- Constraints
    CONSTRAINT empathy_story_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT empathy_story_content_not_empty CHECK (length(trim(content)) > 0)
);

-- Create comprehensive indexes
CREATE INDEX IF NOT EXISTS idx_empathy_stories_storyteller ON empathy_stories(storyteller_id);
CREATE INDEX IF NOT EXISTS idx_empathy_stories_organization ON empathy_stories(organization_id);
CREATE INDEX IF NOT EXISTS idx_empathy_stories_active ON empathy_stories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_empathy_stories_ledger_id ON empathy_stories(empathy_ledger_story_id);
CREATE INDEX IF NOT EXISTS idx_empathy_stories_search ON empathy_stories USING GIN(to_tsvector('english', search_text));
CREATE INDEX IF NOT EXISTS idx_empathy_stories_category ON empathy_stories(category);
CREATE INDEX IF NOT EXISTS idx_empathy_stories_published ON empathy_stories(publication_date) WHERE publication_date IS NOT NULL;

-- Vector index for AI search (if pgvector is available)
DO $$ BEGIN
    CREATE INDEX idx_empathy_stories_embedding ON empathy_stories USING ivfflat(embedding vector_cosine_ops);
EXCEPTION
    WHEN undefined_object THEN 
        -- pgvector not available, skip
        RAISE NOTICE 'pgvector not available, skipping embedding index';
END $$;

-- ============================================
-- 🎛️ STORY PERMISSIONS (Granular Control)
-- ============================================

CREATE TABLE IF NOT EXISTS empathy_story_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES empathy_stories(id) ON DELETE CASCADE,
    
    -- Core Permission Levels
    visibility_level story_visibility_level NOT NULL DEFAULT 'private',
    control_level story_control_level NOT NULL DEFAULT 'full_control',
    
    -- Granular Permissions
    can_view BOOLEAN DEFAULT true,
    can_comment BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    can_download BOOLEAN DEFAULT false,
    can_translate BOOLEAN DEFAULT false,
    can_adapt BOOLEAN DEFAULT false,
    
    -- Cultural Controls
    requires_cultural_approval BOOLEAN DEFAULT false,
    cultural_approval_level cultural_sensitivity DEFAULT 'medium',
    elder_approval_required BOOLEAN DEFAULT false,
    community_consultation_required BOOLEAN DEFAULT false,
    
    -- Time Controls
    permission_start_date TIMESTAMPTZ DEFAULT NOW(),
    permission_end_date TIMESTAMPTZ,
    review_date TIMESTAMPTZ,
    
    -- Audit
    granted_by UUID REFERENCES empathy_storytellers(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One permission record per story
    UNIQUE(story_id)
);

-- ============================================
-- 🔍 ACCESS LOGGING (Transparency)
-- ============================================

CREATE TABLE IF NOT EXISTS empathy_story_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES empathy_stories(id) ON DELETE CASCADE,
    
    -- Access Details
    accessed_by UUID REFERENCES empathy_storytellers(id),
    access_type TEXT NOT NULL, -- view, share, download
    access_method TEXT, -- web, api, mobile
    ip_address INET,
    user_agent TEXT,
    
    -- Context
    referrer_url TEXT,
    session_id TEXT,
    
    -- Permissions at access time
    permission_level story_visibility_level,
    cultural_sensitivity cultural_sensitivity,
    
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create monthly partitions for performance
CREATE INDEX IF NOT EXISTS idx_empathy_access_logs_story ON empathy_story_access_logs(story_id);
CREATE INDEX IF NOT EXISTS idx_empathy_access_logs_date ON empathy_story_access_logs(accessed_at);

-- ============================================
-- 🤖 FUNCTIONS & AUTOMATION
-- ============================================

-- Generate Empathy Ledger Story ID
CREATE OR REPLACE FUNCTION generate_empathy_story_id()
RETURNS TEXT AS $$
DECLARE
    year_code TEXT;
    random_suffix TEXT;
    story_id TEXT;
BEGIN
    year_code := to_char(NOW(), 'YY');
    random_suffix := upper(substring(encode(gen_random_bytes(3), 'hex'), 1, 6));
    story_id := 'EL' || year_code || random_suffix;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM empathy_stories WHERE empathy_ledger_story_id = story_id) LOOP
        random_suffix := upper(substring(encode(gen_random_bytes(3), 'hex'), 1, 6));
        story_id := 'EL' || year_code || random_suffix;
    END LOOP;
    
    RETURN story_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate story ID on insert
CREATE OR REPLACE FUNCTION set_empathy_story_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.empathy_ledger_story_id IS NULL OR NEW.empathy_ledger_story_id = '' THEN
        NEW.empathy_ledger_story_id := generate_empathy_story_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER empathy_stories_id_trigger
    BEFORE INSERT ON empathy_stories
    FOR EACH ROW
    EXECUTE FUNCTION set_empathy_story_id();

-- Auto-create default permissions
CREATE OR REPLACE FUNCTION create_default_empathy_permissions()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO empathy_story_permissions (
        story_id,
        visibility_level,
        control_level,
        granted_by
    ) VALUES (
        NEW.id,
        COALESCE(
            (SELECT default_story_visibility::story_visibility_level 
             FROM empathy_storytellers 
             WHERE id = NEW.storyteller_id),
            'private'::story_visibility_level
        ),
        'full_control'::story_control_level,
        NEW.storyteller_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER empathy_stories_permissions_trigger
    AFTER INSERT ON empathy_stories
    FOR EACH ROW
    EXECUTE FUNCTION create_default_empathy_permissions();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_empathy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to empathy tables
CREATE TRIGGER empathy_storytellers_updated_at 
    BEFORE UPDATE ON empathy_storytellers 
    FOR EACH ROW EXECUTE FUNCTION update_empathy_updated_at();

CREATE TRIGGER empathy_stories_updated_at 
    BEFORE UPDATE ON empathy_stories 
    FOR EACH ROW EXECUTE FUNCTION update_empathy_updated_at();

CREATE TRIGGER empathy_story_permissions_updated_at 
    BEFORE UPDATE ON empathy_story_permissions 
    FOR EACH ROW EXECUTE FUNCTION update_empathy_updated_at();

-- ============================================
-- 🔐 ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on empathy tables
ALTER TABLE empathy_storytellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_story_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE empathy_story_access_logs ENABLE ROW LEVEL SECURITY;

-- Storytellers: Can see themselves + same organization members
CREATE POLICY "empathy_storytellers_access" ON empathy_storytellers
    FOR SELECT 
    USING (
        id = auth.uid() OR
        primary_organization_id IN (
            SELECT primary_organization_id 
            FROM empathy_storytellers 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Storytellers can update themselves
CREATE POLICY "empathy_storytellers_self_update" ON empathy_storytellers
    FOR UPDATE 
    USING (auth_user_id = auth.uid());

-- Stories: Complex visibility based on permissions and storyteller control
CREATE POLICY "empathy_stories_visibility_control" ON empathy_stories
    FOR SELECT 
    USING (
        CASE 
            -- Storyteller can always see their own stories
            WHEN storyteller_id IN (
                SELECT id FROM empathy_storytellers WHERE auth_user_id = auth.uid()
            ) THEN true
            
            -- Inactive stories only visible to storyteller
            WHEN NOT is_active THEN false
            
            -- Check permission levels
            WHEN EXISTS (
                SELECT 1 FROM empathy_story_permissions esp
                WHERE esp.story_id = empathy_stories.id
                AND (
                    (esp.visibility_level = 'public') OR
                    (esp.visibility_level = 'organization' AND 
                     organization_id IN (
                         SELECT primary_organization_id 
                         FROM empathy_storytellers 
                         WHERE auth_user_id = auth.uid()
                     )) OR
                    (esp.visibility_level = 'community' AND 
                     EXISTS (
                         SELECT 1 FROM empathy_storytellers es1, empathy_storytellers es2
                         WHERE es1.id = empathy_stories.storyteller_id
                         AND es2.auth_user_id = auth.uid()
                         AND es1.community = es2.community
                     ))
                )
            ) THEN true
            
            ELSE false
        END
    );

-- Storytellers control their own stories
CREATE POLICY "empathy_stories_storyteller_control" ON empathy_stories
    FOR UPDATE 
    USING (
        storyteller_id IN (
            SELECT id FROM empathy_storytellers WHERE auth_user_id = auth.uid()
        )
    );

-- Story permissions controlled by storyteller
CREATE POLICY "empathy_story_permissions_control" ON empathy_story_permissions
    FOR ALL 
    USING (
        story_id IN (
            SELECT id FROM empathy_stories es
            JOIN empathy_storytellers est ON es.storyteller_id = est.id
            WHERE est.auth_user_id = auth.uid()
        )
    );

-- ============================================
-- 📊 VIEWS FOR DASHBOARD
-- ============================================

-- Storyteller Dashboard View
CREATE OR REPLACE VIEW empathy_storyteller_dashboard AS
SELECT 
    es.id,
    es.empathy_ledger_id,
    es.public_name,
    es.avatar_url,
    es.community,
    es.cultural_background,
    COUNT(est.id) as total_stories,
    COUNT(est.id) FILTER (WHERE est.is_active = true) as active_stories,
    COUNT(est.id) FILTER (WHERE est.workflow_status = 'published') as published_stories,
    SUM(est.view_count) as total_views,
    AVG(est.engagement_score) as avg_engagement,
    es.last_active_at
FROM empathy_storytellers es
LEFT JOIN empathy_stories est ON es.id = est.storyteller_id
GROUP BY es.id, es.empathy_ledger_id, es.public_name, es.avatar_url, 
         es.community, es.cultural_background, es.last_active_at;

-- Organization Stories View (for Oonchiumpa dashboard)
CREATE OR REPLACE VIEW oonchiumpa_empathy_stories AS
SELECT 
    es.*,
    est.public_name as storyteller_name,
    est.community as storyteller_community,
    esp.visibility_level,
    esp.control_level,
    esp.cultural_approval_level,
    o.name as organization_name
FROM empathy_stories es
JOIN empathy_storytellers est ON es.storyteller_id = est.id
JOIN empathy_story_permissions esp ON es.id = esp.story_id
JOIN organizations o ON es.organization_id = o.id
WHERE es.is_active = true
AND o.slug = 'oonchiumpa';

-- ============================================
-- 🎯 API HELPER FUNCTIONS
-- ============================================

-- Toggle story visibility (core Empathy Ledger function)
CREATE OR REPLACE FUNCTION toggle_empathy_story_visibility(
    story_id UUID,
    new_active_state BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE empathy_stories 
    SET is_active = new_active_state,
        updated_at = NOW()
    WHERE id = story_id 
    AND storyteller_id IN (
        SELECT id FROM empathy_storytellers WHERE auth_user_id = auth.uid()
    );
    
    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Get storyteller's stories
CREATE OR REPLACE FUNCTION get_storyteller_empathy_stories(
    empathy_ledger_id_param TEXT DEFAULT NULL
)
RETURNS TABLE (
    story_id UUID,
    empathy_ledger_story_id TEXT,
    title TEXT,
    excerpt TEXT,
    is_active BOOLEAN,
    visibility_level story_visibility_level,
    view_count INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        es.id,
        es.empathy_ledger_story_id,
        es.title,
        es.excerpt,
        es.is_active,
        esp.visibility_level,
        es.view_count,
        es.created_at
    FROM empathy_stories es
    JOIN empathy_storytellers est ON es.storyteller_id = est.id
    JOIN empathy_story_permissions esp ON es.id = esp.story_id
    WHERE (empathy_ledger_id_param IS NULL OR est.empathy_ledger_id = empathy_ledger_id_param)
    AND (est.auth_user_id = auth.uid() OR empathy_ledger_id_param IS NOT NULL)
    ORDER BY es.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 🔄 REAL-TIME SETUP
-- ============================================

-- Enable real-time for empathy tables
ALTER TABLE empathy_stories REPLICA IDENTITY FULL;
ALTER TABLE empathy_story_permissions REPLICA IDENTITY FULL;

-- ============================================
-- 🎭 SAMPLE DATA FOR TESTING
-- ============================================

-- Create sample storyteller (linked to auth if user exists)
INSERT INTO empathy_storytellers (
    empathy_ledger_id,
    public_name,
    email,
    community,
    cultural_background,
    bio,
    consent_given,
    consent_date,
    default_story_visibility
) VALUES (
    'EL24PROTO01',
    'Sarah Mitchell (Sample)',
    'sarah.sample@oonchiumpa.org',
    'Kimberley Region',
    'Nyikina Traditional Owner',
    'Community storyteller and cultural keeper, sharing stories of resilience and connection to country.',
    true,
    NOW(),
    'community'
) ON CONFLICT (empathy_ledger_id) DO NOTHING;

-- Create sample story for testing
INSERT INTO empathy_stories (
    storyteller_id,
    title,
    content,
    excerpt,
    category,
    tags,
    cultural_context,
    traditional_knowledge_level,
    is_active,
    workflow_status
) SELECT 
    es.id,
    'Finding My Way Back to Country',
    'This is the story of how I reconnected with my traditional lands after years in the city. Through the guidance of elders and participation in community programs, I learned about my cultural heritage and found healing...',
    'A personal journey of cultural reconnection and healing through traditional knowledge and community support.',
    'healing_journeys',
    ARRAY['cultural_connection', 'healing', 'community', 'traditional_knowledge'],
    'This story speaks to the experience of urban Indigenous people returning to country and culture.',
    'medium'::cultural_sensitivity,
    true,
    'published'
FROM empathy_storytellers es 
WHERE es.empathy_ledger_id = 'EL24PROTO01'
ON CONFLICT DO NOTHING;

-- ============================================
-- 💡 NEXT STEPS COMMENTS
-- ============================================

-- This migration creates:
-- 1. Multi-tenant foundation (organizations table)
-- 2. Empathy Ledger storytellers (linked to auth.users)
-- 3. Empathy Stories with storyteller control (is_active toggle)
-- 4. Granular permissions system
-- 5. Access logging for transparency
-- 6. RLS policies for security
-- 7. Dashboard views
-- 8. API helper functions
-- 9. Real-time capabilities
-- 10. Sample data for testing

-- To use:
-- 1. Run this migration on your existing Supabase
-- 2. Test storyteller registration and story creation
-- 3. Implement frontend components for story controls
-- 4. Add real-time subscriptions
-- 5. Connect to existing Oonchiumpa outcomes/partners
-- 6. Prepare migration path to dedicated platform

COMMENT ON TABLE empathy_stories IS 'Empathy Ledger stories with storyteller control - prototype on existing Supabase';
COMMENT ON COLUMN empathy_stories.is_active IS 'Sacred toggle - storyteller can turn story on/off anytime';
COMMENT ON VIEW empathy_storyteller_dashboard IS 'Dashboard view for storytellers to manage their stories';

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON empathy_storytellers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON empathy_stories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON empathy_story_permissions TO authenticated;
GRANT SELECT, INSERT ON empathy_story_access_logs TO authenticated;

-- Enable RLS enforcement
ALTER TABLE empathy_storytellers FORCE ROW LEVEL SECURITY;
ALTER TABLE empathy_stories FORCE ROW LEVEL SECURITY;
ALTER TABLE empathy_story_permissions FORCE ROW LEVEL SECURITY;