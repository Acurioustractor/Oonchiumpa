-- ============================================================================
-- ADD DESCRIPT VIDEO SUPPORT
-- ============================================================================
-- Purpose: Support Descript video embeds in addition to YouTube/Vimeo
-- ============================================================================

-- Update video_type check to include 'descript'
ALTER TABLE public.videos
DROP CONSTRAINT IF EXISTS videos_video_type_check;

ALTER TABLE public.videos
ADD CONSTRAINT videos_video_type_check
CHECK (video_type IN ('youtube', 'vimeo', 'descript', 'direct'));

-- Helper function to extract Descript video ID from URL
CREATE OR REPLACE FUNCTION extract_descript_id(url TEXT)
RETURNS TEXT AS $$
DECLARE
    video_id TEXT;
BEGIN
    -- Extract from share.descript.com/view/VIDEO_ID
    video_id := substring(url from 'share\.descript\.com/view/([a-zA-Z0-9_-]+)');

    -- Extract from share.descript.com/embed/VIDEO_ID
    IF video_id IS NULL THEN
        video_id := substring(url from 'share\.descript\.com/embed/([a-zA-Z0-9_-]+)');
    END IF;

    RETURN video_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to generate Descript embed code
CREATE OR REPLACE FUNCTION generate_descript_embed(video_id TEXT, width TEXT DEFAULT '100%', height TEXT DEFAULT '400')
RETURNS TEXT AS $$
BEGIN
    RETURN format(
        '<iframe src="https://share.descript.com/embed/%s" ' ||
        'width="%s" height="%s" frameborder="0" allowfullscreen></iframe>',
        video_id, width, height
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update auto-generate trigger to support Descript
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

    -- Extract Descript ID if it's a Descript URL
    ELSIF NEW.video_url LIKE '%share.descript.com%' THEN
        NEW.video_type := 'descript';
        NEW.video_id := extract_descript_id(NEW.video_url);

        -- Generate embed code if not provided
        IF NEW.embed_code IS NULL AND NEW.video_id IS NOT NULL THEN
            NEW.embed_code := generate_descript_embed(NEW.video_id);
        END IF;

        -- Descript doesn't have automatic thumbnails, but you can add manually
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_video_metadata ON public.videos;
CREATE TRIGGER trigger_auto_generate_video_metadata
    BEFORE INSERT OR UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION auto_generate_video_metadata();

-- Comments
COMMENT ON FUNCTION extract_descript_id(TEXT) IS 'Extracts video ID from Descript share URLs';
COMMENT ON FUNCTION generate_descript_embed(TEXT, TEXT, TEXT) IS 'Generates iframe embed code for Descript videos';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Descript video support added!';
    RAISE NOTICE '';
    RAISE NOTICE 'Supported platforms:';
    RAISE NOTICE '  - YouTube';
    RAISE NOTICE '  - Vimeo';
    RAISE NOTICE '  - Descript ← NEW!';
    RAISE NOTICE '';
    RAISE NOTICE 'Usage:';
    RAISE NOTICE '  Just paste Descript share URL: https://share.descript.com/view/xxxxx';
    RAISE NOTICE '  Video ID, embed code auto-generated!';
END $$;
