-- ============================================================================
-- FIX: Make author_id nullable in stories table
-- ============================================================================
-- Purpose: Allow stories synced from Empathy Ledger to not require an author
-- ============================================================================

-- Make author_id nullable
ALTER TABLE public.stories
ALTER COLUMN author_id DROP NOT NULL;

-- Add a comment to explain this
COMMENT ON COLUMN stories.author_id IS 'User who created the story. Nullable for stories synced from Empathy Ledger.';

-- Verify the change
DO $$
BEGIN
    RAISE NOTICE '✅ author_id is now nullable in stories table';
    RAISE NOTICE 'Stories synced from Empathy Ledger can now be created without an author_id';
END $$;
