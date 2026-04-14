-- Add source_notion_page_id to blog_posts table
-- This allows tracking which Notion page each blog post came from
-- and prevents duplicate imports

ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS source_notion_page_id TEXT;

-- Add unique constraint to prevent duplicate imports
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_source_notion_page_id_unique
ON public.blog_posts (source_notion_page_id)
WHERE source_notion_page_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.blog_posts.source_notion_page_id IS 'Notion page ID that this blog post was synced from';
