-- ============================================================================
-- EMPATHY LEDGER → OONCHIUMPA INTEGRATION SCHEMA
-- ============================================================================
-- Purpose: Track sync status and approval workflow
-- ============================================================================

-- ============================================================================
-- 1. ADD SYNC TRACKING TO EMPATHY ENTRIES
-- ============================================================================

-- Add columns to empathy_entries table for tracking sync status
ALTER TABLE IF EXISTS empathy_entries
ADD COLUMN IF NOT EXISTS ready_to_publish BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS synced_to_oonchiumpa BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sync_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS linked_story_id UUID,
ADD COLUMN IF NOT EXISTS linked_outcome_id UUID,
ADD COLUMN IF NOT EXISTS linked_transcript_id UUID,
ADD COLUMN IF NOT EXISTS publish_status TEXT DEFAULT 'draft' CHECK (publish_status IN ('draft', 'ready', 'synced', 'approved', 'published', 'rejected')),
ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'private' CHECK (privacy_level IN ('private', 'internal', 'public')),
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_empathy_ready_to_publish ON empathy_entries(ready_to_publish);
CREATE INDEX IF NOT EXISTS idx_empathy_publish_status ON empathy_entries(publish_status);
CREATE INDEX IF NOT EXISTS idx_empathy_privacy_level ON empathy_entries(privacy_level);

-- ============================================================================
-- 2. CREATE APPROVAL QUEUE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.content_approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source Reference
    empathy_entry_id UUID REFERENCES empathy_entries(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('story', 'outcome', 'media', 'transcript')),

    -- Content Preview
    title TEXT NOT NULL,
    summary TEXT,
    content_preview TEXT,

    -- Approval Workflow
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
    privacy_level TEXT DEFAULT 'private' CHECK (privacy_level IN ('private', 'internal', 'public')),

    -- Metadata
    submitted_by UUID,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,

    -- Cultural Review
    cultural_review_required BOOLEAN DEFAULT TRUE,
    cultural_reviewer_id UUID,
    cultural_review_notes TEXT,
    cultural_approved BOOLEAN DEFAULT FALSE,

    -- Elder Review
    elder_review_required BOOLEAN DEFAULT FALSE,
    elder_reviewer_id UUID,
    elder_review_notes TEXT,
    elder_approved BOOLEAN DEFAULT FALSE,

    -- Publishing
    publish_to_website BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    published_url TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for approval queue
CREATE INDEX idx_approval_status ON public.content_approval_queue(status);
CREATE INDEX idx_approval_content_type ON public.content_approval_queue(content_type);
CREATE INDEX idx_approval_privacy ON public.content_approval_queue(privacy_level);
CREATE INDEX idx_approval_submitted_at ON public.content_approval_queue(submitted_at);

-- RLS Policies for approval queue
ALTER TABLE public.content_approval_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view approval queue"
    ON public.content_approval_queue FOR SELECT
    USING (true); -- Adjust based on your auth system

CREATE POLICY "Staff can insert to approval queue"
    ON public.content_approval_queue FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update approval queue"
    ON public.content_approval_queue FOR UPDATE
    USING (true);

-- ============================================================================
-- 3. ADD SYNC TRACKING TO EXISTING TABLES
-- ============================================================================

-- Add source tracking to stories table
ALTER TABLE IF EXISTS stories
ADD COLUMN IF NOT EXISTS source_empathy_entry_id UUID,
ADD COLUMN IF NOT EXISTS sync_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'public';

-- Add source tracking to outcomes table (already exists, just adding if missing)
ALTER TABLE IF EXISTS outcomes
ADD COLUMN IF NOT EXISTS source_empathy_entry_id UUID,
ADD COLUMN IF NOT EXISTS sync_date TIMESTAMPTZ;

-- Add source tracking to transcripts table
ALTER TABLE IF EXISTS transcripts
ADD COLUMN IF NOT EXISTS source_empathy_entry_id UUID,
ADD COLUMN IF NOT EXISTS sync_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'internal';

-- Add source tracking to gallery_photos
ALTER TABLE IF EXISTS gallery_photos
ADD COLUMN IF NOT EXISTS source_empathy_entry_id UUID,
ADD COLUMN IF NOT EXISTS sync_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'public';

-- ============================================================================
-- 4. CREATE SYNC LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.empathy_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source
    empathy_entry_id UUID REFERENCES empathy_entries(id),

    -- Sync Details
    sync_type TEXT NOT NULL CHECK (sync_type IN ('story', 'outcome', 'media', 'transcript', 'all')),
    sync_status TEXT NOT NULL CHECK (sync_status IN ('started', 'success', 'failed', 'partial')),

    -- Target IDs (what was created)
    created_story_id UUID,
    created_outcome_id UUID,
    created_transcript_id UUID,
    created_media_ids UUID[],

    -- Error Tracking
    error_message TEXT,
    error_details JSONB,

    -- Metadata
    synced_by UUID,
    synced_at TIMESTAMPTZ DEFAULT NOW(),

    -- Data Snapshot (in case we need to review)
    source_data JSONB
);

CREATE INDEX idx_sync_log_entry ON public.empathy_sync_log(empathy_entry_id);
CREATE INDEX idx_sync_log_status ON public.empathy_sync_log(sync_status);
CREATE INDEX idx_sync_log_date ON public.empathy_sync_log(synced_at);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to mark empathy entry as ready to publish
CREATE OR REPLACE FUNCTION mark_ready_to_publish(entry_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE empathy_entries
    SET ready_to_publish = TRUE,
        publish_status = 'ready',
        updated_at = NOW()
    WHERE id = entry_id;

    -- Create approval queue entry
    INSERT INTO content_approval_queue (
        empathy_entry_id,
        content_type,
        title,
        summary,
        status,
        submitted_at
    )
    SELECT
        id,
        'story',
        title,
        LEFT(narrative, 200),
        'pending',
        NOW()
    FROM empathy_entries
    WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql;

-- Function to approve content for publishing
CREATE OR REPLACE FUNCTION approve_for_publishing(
    queue_id UUID,
    reviewer_id UUID,
    notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE content_approval_queue
    SET status = 'approved',
        reviewed_by = reviewer_id,
        reviewed_at = NOW(),
        review_notes = notes
    WHERE id = queue_id;

    -- Update empathy entry
    UPDATE empathy_entries
    SET publish_status = 'approved',
        approved_by = reviewer_id,
        approved_at = NOW()
    WHERE id = (SELECT empathy_entry_id FROM content_approval_queue WHERE id = queue_id);
END;
$$ LANGUAGE plpgsql;

-- Function to reject content
CREATE OR REPLACE FUNCTION reject_content(
    queue_id UUID,
    reviewer_id UUID,
    reason TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE content_approval_queue
    SET status = 'rejected',
        reviewed_by = reviewer_id,
        reviewed_at = NOW(),
        review_notes = reason
    WHERE id = queue_id;

    -- Update empathy entry
    UPDATE empathy_entries
    SET publish_status = 'rejected',
        rejection_reason = reason
    WHERE id = (SELECT empathy_entry_id FROM content_approval_queue WHERE id = queue_id);
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

CREATE TRIGGER update_approval_queue_updated_at
    BEFORE UPDATE ON public.content_approval_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMENT ON TABLE public.content_approval_queue IS 'Tracks content pending approval from Empathy Ledger';
COMMENT ON TABLE public.empathy_sync_log IS 'Logs all sync operations between Empathy Ledger and Oonchiumpa';

-- Add helpful comments
COMMENT ON COLUMN empathy_entries.ready_to_publish IS 'Staff marks this when content is ready for review';
COMMENT ON COLUMN empathy_entries.publish_status IS 'Workflow: draft → ready → synced → approved → published';
COMMENT ON COLUMN empathy_entries.privacy_level IS 'Controls visibility: private (Empathy Ledger only), internal (staff), public (website)';
