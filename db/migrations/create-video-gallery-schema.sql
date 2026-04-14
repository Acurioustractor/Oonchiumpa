-- ============================================================================
-- VIDEO GALLERY SYSTEM
-- ============================================================================
-- Purpose: Store all videos from blog posts and create a unified video gallery
-- ============================================================================

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Video Info
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL, -- YouTube/Vimeo URL
    video_type TEXT CHECK (video_type IN ('youtube', 'vimeo', 'direct')),
    video_id TEXT, -- YouTube/Vimeo ID extracted from URL
    embed_code TEXT, -- Full iframe embed code
    thumbnail_url TEXT,

    -- Categorization
    tags TEXT[],
    category TEXT,
    service_area TEXT,

    -- Source Tracking
    source_blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
    source_empathy_entry_id UUID REFERENCES empathy_entries(id) ON DELETE SET NULL,
    source_notion_page_id TEXT, -- Notion page ID if synced from Notion

    -- Metadata
    duration INTEGER, -- in seconds
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,

    -- Privacy
    is_public BOOLEAN DEFAULT TRUE,
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('private', 'internal', 'public')),

    -- Cultural Review
    cultural_review_required BOOLEAN DEFAULT TRUE,
    cultural_approved BOOLEAN DEFAULT FALSE,
    elder_approved BOOLEAN DEFAULT FALSE,

    -- Publishing
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_video_type ON public.videos(video_type);
CREATE INDEX idx_videos_tags ON public.videos USING GIN(tags);
CREATE INDEX idx_videos_service_area ON public.videos(service_area);
CREATE INDEX idx_videos_source_blog ON public.videos(source_blog_post_id);
CREATE INDEX idx_videos_published_at ON public.videos(published_at DESC);

-- RLS Policies
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public videos visible to all"
    ON public.videos FOR SELECT
    USING (is_public = TRUE AND status = 'published');

CREATE POLICY "Staff can view all videos"
    ON public.videos FOR SELECT
    USING (true);

CREATE POLICY "Staff can insert videos"
    ON public.videos FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can update videos"
    ON public.videos FOR UPDATE
    USING (true);

-- Helper function to extract YouTube video ID from URL
CREATE OR REPLACE FUNCTION extract_youtube_id(url TEXT)
RETURNS TEXT AS $$
DECLARE
    video_id TEXT;
BEGIN
    -- Extract from youtube.com/watch?v=VIDEO_ID
    video_id := substring(url from 'watch\?v=([a-zA-Z0-9_-]+)');

    -- Extract from youtu.be/VIDEO_ID
    IF video_id IS NULL THEN
        video_id := substring(url from 'youtu\.be/([a-zA-Z0-9_-]+)');
    END IF;

    -- Extract from youtube.com/embed/VIDEO_ID
    IF video_id IS NULL THEN
        video_id := substring(url from 'embed/([a-zA-Z0-9_-]+)');
    END IF;

    RETURN video_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to generate YouTube embed code
CREATE OR REPLACE FUNCTION generate_youtube_embed(video_id TEXT, width TEXT DEFAULT '100%', height TEXT DEFAULT '400')
RETURNS TEXT AS $$
BEGIN
    RETURN format(
        '<iframe width="%s" height="%s" src="https://www.youtube.com/embed/%s" ' ||
        'title="YouTube video player" frameborder="0" ' ||
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' ||
        'allowfullscreen></iframe>',
        width, height, video_id
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-generate embed code and video_id
CREATE OR REPLACE FUNCTION auto_generate_video_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Extract YouTube ID if it's a YouTube URL
    IF NEW.video_url LIKE '%youtube.com%' OR NEW.video_url LIKE '%youtu.be%' THEN
        NEW.video_type := 'youtube';
        NEW.video_id := extract_youtube_id(NEW.video_url);

        -- Generate embed code if not provided
        IF NEW.embed_code IS NULL AND NEW.video_id IS NOT NULL THEN
            NEW.embed_code := generate_youtube_embed(NEW.video_id);
        END IF;

        -- Generate thumbnail if not provided
        IF NEW.thumbnail_url IS NULL AND NEW.video_id IS NOT NULL THEN
            NEW.thumbnail_url := format('https://img.youtube.com/vi/%s/maxresdefault.jpg', NEW.video_id);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_video_metadata
    BEFORE INSERT OR UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION auto_generate_video_metadata();

-- Auto-update timestamp
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.videos IS 'Unified video gallery - all videos from blog posts, Empathy Ledger, and direct uploads';
COMMENT ON COLUMN videos.video_id IS 'Extracted video ID from YouTube/Vimeo URL';
COMMENT ON COLUMN videos.embed_code IS 'Auto-generated iframe embed code';
COMMENT ON COLUMN videos.source_blog_post_id IS 'Links to blog post if video came from a blog';
COMMENT ON COLUMN videos.source_empathy_entry_id IS 'Links to empathy entry if video came from Empathy Ledger';
COMMENT ON COLUMN videos.source_notion_page_id IS 'Notion page ID if synced from Notion';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Video gallery system created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - videos: Unified video gallery';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  - Auto-extracts YouTube video IDs';
    RAISE NOTICE '  - Auto-generates embed codes';
    RAISE NOTICE '  - Auto-generates thumbnails';
    RAISE NOTICE '  - Links videos to source (blog/empathy/notion)';
    RAISE NOTICE '  - Privacy controls and cultural review';
END $$;
