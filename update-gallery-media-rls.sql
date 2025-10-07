-- Drop existing RLS policies for gallery_media
DROP POLICY IF EXISTS "Allow public read access to gallery_media" ON gallery_media;
DROP POLICY IF EXISTS "Allow authenticated insert to gallery_media" ON gallery_media;
DROP POLICY IF EXISTS "Allow authenticated delete to gallery_media" ON gallery_media;
DROP POLICY IF EXISTS "Allow authenticated update to gallery_media" ON gallery_media;

-- Re-enable RLS
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;

-- Allow public to read all gallery media
CREATE POLICY "Allow public read access to gallery_media"
ON gallery_media FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to gallery_media"
ON gallery_media FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to gallery_media"
ON gallery_media FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to gallery_media"
ON gallery_media FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Also allow anon key to delete (for scripts)
CREATE POLICY "Allow anon delete to gallery_media"
ON gallery_media FOR DELETE
TO anon
USING (true);
