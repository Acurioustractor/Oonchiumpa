-- Add related_stories column to blog_posts table
-- This will store an array of story IDs that are related to this blog post

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS related_stories UUID[] DEFAULT '{}';

COMMENT ON COLUMN blog_posts.related_stories IS 'Array of story IDs that are related to this blog post';
