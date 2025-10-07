-- Oonchiumpa Platform with Empathy Ledger Integration
-- Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enums
CREATE TYPE story_visibility_level AS ENUM ('private', 'community', 'organization', 'public', 'archived');
CREATE TYPE story_control_level AS ENUM ('full_control', 'collaborative', 'organization', 'locked');
CREATE TYPE cultural_sensitivity_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'coordinator', 'community_member', 'storyteller', 'visitor');
CREATE TYPE partnership_level AS ENUM ('prospect', 'collaborator', 'strategic_partner', 'core_partner', 'legacy_partner');
CREATE TYPE grant_status AS ENUM ('researching', 'preparing', 'submitted', 'under_review', 'approved', 'rejected', 'active', 'completed', 'reporting');

-- ============================================
-- CORE USER AND STORYTELLER MANAGEMENT
-- ============================================

-- Storytellers table (Empathy Ledger integration)
CREATE TABLE storytellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    community VARCHAR(255),
    cultural_background TEXT,
    preferred_contact VARCHAR(100),
    
    -- Consent and permissions
    consent_given BOOLEAN NOT NULL DEFAULT false,
    consent_date TIMESTAMPTZ,
    consent_document_url TEXT,
    
    -- Empathy Ledger integration
    empathy_ledger_id VARCHAR(255) UNIQUE,
    empathy_ledger_active BOOLEAN DEFAULT true,
    
    -- Profile
    bio TEXT,
    profile_image_url TEXT,
    languages_spoken TEXT[],
    
    -- Status
    active BOOLEAN NOT NULL DEFAULT true,
    verified BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT storytellers_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Users table (for staff and organization members)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'community_member',
    community VARCHAR(255),
    avatar_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    
    -- Authentication (handled by Supabase Auth)
    auth_user_id UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- STORIES AND EMPATHY LEDGER CORE
-- ============================================

-- Stories table with Empathy Ledger integration
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    
    -- Storyteller relationship
    storyteller_id UUID NOT NULL REFERENCES storytellers(id) ON DELETE CASCADE,
    
    -- Empathy Ledger specific fields
    empathy_ledger_id VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true, -- Storyteller can turn on/off
    storyteller_approved BOOLEAN NOT NULL DEFAULT false,
    organization_approved BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    category VARCHAR(100),
    tags TEXT[],
    cultural_context TEXT,
    location VARCHAR(255),
    date_occurred DATE,
    
    -- Media attachments
    featured_image_url TEXT,
    media_items TEXT[], -- Array of media URLs/IDs
    audio_url TEXT,
    video_url TEXT,
    
    -- Analytics (managed by triggers)
    view_count INTEGER NOT NULL DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,
    last_viewed TIMESTAMPTZ,
    
    -- Status and workflow
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, published, archived
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT stories_empathy_ledger_id_check CHECK (empathy_ledger_id != '')
);

-- Story permissions table (Empathy Ledger control system)
CREATE TABLE story_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    storyteller_id UUID NOT NULL REFERENCES storytellers(id) ON DELETE CASCADE,
    
    -- Permission levels
    visibility_level story_visibility_level NOT NULL DEFAULT 'private',
    control_level story_control_level NOT NULL DEFAULT 'full_control',
    
    -- Specific permissions
    can_edit BOOLEAN NOT NULL DEFAULT true,
    can_delete BOOLEAN NOT NULL DEFAULT true,
    can_share BOOLEAN NOT NULL DEFAULT true,
    can_download_media BOOLEAN NOT NULL DEFAULT false,
    
    -- Cultural and time constraints
    cultural_sensitivity_level cultural_sensitivity_level NOT NULL DEFAULT 'medium',
    approval_required BOOLEAN NOT NULL DEFAULT true,
    expiry_date TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one permission record per story
    UNIQUE(story_id)
);

-- ============================================
-- PARTNERSHIPS AND FUNDING
-- ============================================

-- Partners table
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- government, ngo, corporate, educational, etc.
    category VARCHAR(100),
    description TEXT,
    website TEXT,
    logo_url TEXT,
    
    -- Contact information
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    
    -- Relationship details
    partnership_level partnership_level NOT NULL DEFAULT 'collaborator',
    relationship_start DATE,
    relationship_end DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Contributions
    monetary_value DECIMAL(12,2) DEFAULT 0,
    in_kind_value DECIMAL(12,2) DEFAULT 0,
    land_contributed TEXT,
    
    -- Location and community connections
    location VARCHAR(255),
    community_connections TEXT[],
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Funding grants table
CREATE TABLE funding_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    grantor_name VARCHAR(255) NOT NULL,
    grant_type VARCHAR(100),
    
    -- Financial details
    total_amount DECIMAL(12,2) NOT NULL,
    amount_received DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AUD',
    
    -- Timeline
    application_date DATE,
    approval_date DATE,
    start_date DATE,
    end_date DATE,
    reporting_due DATE,
    
    -- Status and priority
    status grant_status NOT NULL DEFAULT 'researching',
    priority VARCHAR(20) DEFAULT 'medium',
    
    -- Requirements and compliance
    requirements JSONB,
    restrictions TEXT,
    
    -- Allocation tracking
    land_allocation DECIMAL(12,2) DEFAULT 0,
    project_allocation DECIMAL(12,2) DEFAULT 0,
    service_allocation DECIMAL(12,2) DEFAULT 0,
    operational_allocation DECIMAL(12,2) DEFAULT 0,
    
    -- Relationships
    partner_id UUID REFERENCES partners(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECTS AND OUTCOMES
-- ============================================

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'planning',
    
    -- Resource allocation
    total_budget DECIMAL(12,2),
    land_component DECIMAL(12,2) DEFAULT 0,
    project_component DECIMAL(12,2) DEFAULT 0,
    service_component DECIMAL(12,2) DEFAULT 0,
    
    -- Impact tracking
    location VARCHAR(255),
    community_benefit TEXT,
    participant_count INTEGER,
    outcomes_achieved TEXT[],
    kpis JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Outcomes table (linked to stories for evidence)
CREATE TABLE outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    category VARCHAR(100),
    
    -- Location and beneficiaries
    location VARCHAR(255),
    beneficiaries INTEGER,
    outcome_date DATE,
    
    -- Relationships
    project_id UUID REFERENCES projects(id),
    related_story_id UUID REFERENCES stories(id),
    
    -- Media evidence
    evidence_media TEXT[],
    before_photo_url TEXT,
    after_photo_url TEXT,
    
    -- Metrics
    metrics JSONB,
    
    -- Visibility (inherits from related story if linked)
    visibility_level story_visibility_level DEFAULT 'organization',
    cultural_sensitivity cultural_sensitivity_level DEFAULT 'medium',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MEDIA AND CONTENT MANAGEMENT
-- ============================================

-- Media items table
CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- image, video, audio, document
    original_url TEXT NOT NULL,
    thumbnail_url TEXT,
    cdn_url TEXT,
    
    -- Metadata
    title VARCHAR(255),
    description TEXT,
    alt_text TEXT,
    tags TEXT[],
    
    -- File information
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for video/audio in seconds
    
    -- Cultural and permission data
    cultural_sensitivity cultural_sensitivity_level DEFAULT 'medium',
    requires_permission BOOLEAN DEFAULT true,
    permission_granted BOOLEAN DEFAULT false,
    
    -- Relationships
    uploaded_by_user_id UUID REFERENCES users(id),
    related_story_id UUID REFERENCES stories(id),
    related_outcome_id UUID REFERENCES outcomes(id),
    
    -- AI generated data
    ai_description TEXT,
    ai_tags TEXT[],
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INTERVIEW AND CONTENT PIPELINE
-- ============================================

-- Interviews table (content generation pipeline)
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    
    -- Participants
    interviewee_type VARCHAR(100), -- community_member, elder, youth_participant, etc.
    interviewee_name VARCHAR(255),
    interviewer_name VARCHAR(255),
    storyteller_id UUID REFERENCES storytellers(id),
    
    -- Content
    audio_url TEXT,
    video_url TEXT,
    transcript TEXT,
    key_quotes TEXT[],
    
    -- Processing status
    processing_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    ai_processed BOOLEAN DEFAULT false,
    cultural_review_completed BOOLEAN DEFAULT false,
    
    -- Content potential flags
    story_potential BOOLEAN DEFAULT false,
    outcome_potential BOOLEAN DEFAULT false,
    media_potential BOOLEAN DEFAULT false,
    
    -- Cultural considerations
    cultural_sensitivity cultural_sensitivity_level DEFAULT 'medium',
    cultural_protocols TEXT[],
    permissions JSONB, -- Usage permissions and restrictions
    
    -- Interview details
    conducted_at TIMESTAMPTZ,
    location VARCHAR(255),
    duration_minutes INTEGER,
    
    -- Relationships
    related_project_id UUID REFERENCES projects(id),
    generated_story_id UUID REFERENCES stories(id), -- If story was created from this interview
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Stories indexes
CREATE INDEX idx_stories_storyteller_id ON stories(storyteller_id);
CREATE INDEX idx_stories_empathy_ledger_id ON stories(empathy_ledger_id);
CREATE INDEX idx_stories_is_active ON stories(is_active);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_tags ON stories USING GIN(tags);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_stories_published_at ON stories(published_at) WHERE published_at IS NOT NULL;

-- Story permissions indexes
CREATE INDEX idx_story_permissions_story_id ON story_permissions(story_id);
CREATE INDEX idx_story_permissions_storyteller_id ON story_permissions(storyteller_id);
CREATE INDEX idx_story_permissions_visibility ON story_permissions(visibility_level);

-- Storytellers indexes
CREATE INDEX idx_storytellers_empathy_ledger_id ON storytellers(empathy_ledger_id) WHERE empathy_ledger_id IS NOT NULL;
CREATE INDEX idx_storytellers_community ON storytellers(community);
CREATE INDEX idx_storytellers_active ON storytellers(active);

-- Full text search indexes
CREATE INDEX idx_stories_search ON stories USING GIN(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_partners_search ON partners USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_storytellers_updated_at BEFORE UPDATE ON storytellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_story_permissions_updated_at BEFORE UPDATE ON story_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_grants_updated_at BEFORE UPDATE ON funding_grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON media_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment story view count
CREATE OR REPLACE FUNCTION increment_story_view_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_viewed != OLD.last_viewed THEN
        NEW.view_count = OLD.view_count + 1;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_story_views BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION increment_story_view_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE storytellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Stories RLS policies (Empathy Ledger core functionality)
CREATE POLICY "Stories are viewable based on permissions and visibility" ON stories
    FOR SELECT USING (
        -- Story must be active
        is_active = true AND
        (
            -- Public stories that are approved
            (
                EXISTS (
                    SELECT 1 FROM story_permissions sp 
                    WHERE sp.story_id = stories.id 
                    AND sp.visibility_level = 'public'
                )
                AND storyteller_approved = true 
                AND organization_approved = true
            )
            OR
            -- Organization level stories for staff
            (
                EXISTS (
                    SELECT 1 FROM story_permissions sp 
                    WHERE sp.story_id = stories.id 
                    AND sp.visibility_level IN ('organization', 'community')
                )
                AND auth.jwt() ->> 'role' IN ('admin', 'staff', 'coordinator')
            )
            OR
            -- Storyteller can always see their own stories
            (
                storyteller_id IN (
                    SELECT id FROM storytellers 
                    WHERE empathy_ledger_id = auth.jwt() ->> 'empathy_ledger_id'
                )
            )
        )
    );

CREATE POLICY "Storytellers can update their own stories" ON stories
    FOR UPDATE USING (
        storyteller_id IN (
            SELECT id FROM storytellers 
            WHERE empathy_ledger_id = auth.jwt() ->> 'empathy_ledger_id'
        )
        AND EXISTS (
            SELECT 1 FROM story_permissions sp 
            WHERE sp.story_id = stories.id 
            AND sp.can_edit = true
            AND sp.control_level != 'locked'
        )
    );

CREATE POLICY "Organization staff can update stories with appropriate permissions" ON stories
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'staff') 
        AND EXISTS (
            SELECT 1 FROM story_permissions sp 
            WHERE sp.story_id = stories.id 
            AND sp.control_level IN ('organization', 'collaborative')
        )
    );

-- Storytellers RLS policies
CREATE POLICY "Storytellers can view and edit their own profile" ON storytellers
    FOR ALL USING (empathy_ledger_id = auth.jwt() ->> 'empathy_ledger_id');

CREATE POLICY "Organization staff can view all storytellers" ON storytellers
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'staff', 'coordinator'));

-- Story permissions RLS policies
CREATE POLICY "Story permissions viewable by storyteller and staff" ON story_permissions
    FOR SELECT USING (
        storyteller_id IN (
            SELECT id FROM storytellers 
            WHERE empathy_ledger_id = auth.jwt() ->> 'empathy_ledger_id'
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'staff', 'coordinator')
    );

-- ============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================

-- Insert sample storytellers
INSERT INTO storytellers (name, email, community, cultural_background, consent_given, consent_date, empathy_ledger_id) VALUES
('Mary Tungarra', 'mary.tungarra@example.com', 'Arnhem Land', 'Yolŋu', true, '2023-01-15', 'empathy_001'),
('Jimmy Watson', 'jimmy.watson@example.com', 'Central Australia', 'Arrernte', true, '2023-02-20', 'empathy_002'),
('Sarah Mitchell', 'sarah.mitchell@example.com', 'Kimberley', 'Nyikina', true, '2023-03-10', 'empathy_003');

-- Insert sample users
INSERT INTO users (email, name, role, community) VALUES
('admin@oonchiumpa.org', 'Platform Administrator', 'admin', NULL),
('coordinator@oonchiumpa.org', 'Community Coordinator', 'coordinator', 'Multiple Communities'),
('staff@oonchiumpa.org', 'Program Staff', 'staff', 'Darwin Region');

-- Insert sample partners (using data from previous implementation)
INSERT INTO partners (name, type, category, description, website, partnership_level, monetary_value, in_kind_value, location, community_connections) VALUES
('Northern Territory Department of Health', 'government', 'Government', 'Key partner supporting youth health and wellbeing programs across remote Northern Territory communities.', 'https://health.nt.gov.au', 'core_partner', 125000, 50000, 'Darwin, NT', ARRAY['Arnhem Land', 'Central Australia', 'Katherine Region']),
('BHP Foundation', 'corporate', 'Corporate Foundation', 'Supporting Indigenous youth education and leadership development programs through significant funding and mentorship opportunities.', 'https://www.bhp.com/sustainability/communities/bhp-foundation', 'legacy_partner', 200000, 100000, 'Melbourne, VIC', ARRAY['Pilbara Communities', 'Hunter Valley', 'Olympic Dam Region']);

-- Create functions for Empathy Ledger integration
CREATE OR REPLACE FUNCTION toggle_story_visibility(story_uuid UUID, storyteller_empathy_id TEXT, new_active_state BOOLEAN)
RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN := false;
BEGIN
    UPDATE stories 
    SET is_active = new_active_state, updated_at = NOW()
    WHERE id = story_uuid 
    AND storyteller_id IN (
        SELECT id FROM storytellers WHERE empathy_ledger_id = storyteller_empathy_id
    );
    
    GET DIAGNOSTICS result = FOUND;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;