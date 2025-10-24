-- ============================================
-- 📝 BLOG POSTS TABLE
-- ============================================
-- Blog posts for community stories and insights

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID, -- Optional: for multi-tenant setup

    -- Content
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,

    -- Metadata
    author TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'community-story',
        'cultural-insight',
        'youth-work',
        'historical-truth',
        'transformation'
    )),
    tags TEXT[] DEFAULT '{}',

    -- Media
    hero_image TEXT,
    gallery TEXT[] DEFAULT '{}',

    -- Publishing
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    read_time INTEGER, -- in minutes

    -- Cultural Review
    storyteller_id UUID, -- Optional reference to storyteller (no foreign key constraint)
    elder_approved BOOLEAN DEFAULT false,
    curated_by TEXT,
    cultural_review TEXT,
    approved_by UUID,
    approved_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT excerpt_not_empty CHECK (length(trim(excerpt)) > 0),
    CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for public read access to published posts
CREATE POLICY "Published blog posts are viewable by everyone"
ON blog_posts
FOR SELECT
USING (status = 'published' AND elder_approved = true);

-- Policies for authenticated users to manage posts
CREATE POLICY "Authenticated users can insert blog posts"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_type ON blog_posts(type);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_project_id ON blog_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_elder_approved ON blog_posts(elder_approved);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts
USING GIN(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_posts_updated_at();

-- Comments for documentation
COMMENT ON TABLE blog_posts IS 'Blog posts for community stories, cultural insights, and youth work narratives';
COMMENT ON COLUMN blog_posts.type IS 'Category: community-story, cultural-insight, youth-work, historical-truth, or transformation';
COMMENT ON COLUMN blog_posts.elder_approved IS 'Indicates if the content has been reviewed and approved by cultural elders';
COMMENT ON COLUMN blog_posts.cultural_review IS 'Notes from cultural review process';
