-- Create gallery_media table for photos and videos
CREATE TABLE IF NOT EXISTS gallery_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  category TEXT DEFAULT 'gallery',
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_media_tenant ON gallery_media(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON gallery_media(media_type);
CREATE INDEX IF NOT EXISTS idx_gallery_media_category ON gallery_media(category);

-- Enable RLS
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read, authenticated insert)
CREATE POLICY "Allow public read access to gallery_media"
  ON gallery_media FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert to gallery_media"
  ON gallery_media FOR INSERT
  WITH CHECK (true);
