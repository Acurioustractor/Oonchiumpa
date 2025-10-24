-- Media Library Tables for Oonchiumpa CMS
-- This creates the infrastructure for image/video/audio uploads

-- Drop table if exists (clean start)
DROP TABLE IF EXISTS media_files CASCADE;

-- Media files table
CREATE TABLE media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
  category text NOT NULL CHECK (category IN ('story-media', 'team-photos', 'cultural-artifacts', 'community-events', 'educational', 'service-photos')),
  url text NOT NULL,
  thumbnail_url text,
  file_size bigint NOT NULL,
  duration int, -- for videos/audio in seconds
  dimensions jsonb, -- {width: number, height: number}
  tags text[] DEFAULT '{}',
  created_by text NOT NULL,
  storyteller_id uuid,
  story_id uuid,
  cultural_sensitivity text NOT NULL DEFAULT 'community' CHECK (cultural_sensitivity IN ('public', 'community', 'private', 'sacred')),
  elder_approved boolean DEFAULT false,
  project_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Public read policy (only for public and community sensitivity)
CREATE POLICY "Allow public read on public media"
  ON media_files FOR SELECT
  USING (cultural_sensitivity IN ('public', 'community'));

-- Authenticated users can manage all media
CREATE POLICY "Allow authenticated manage media_files"
  ON media_files FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX idx_media_files_category ON media_files(category);
CREATE INDEX idx_media_files_type ON media_files(type);
CREATE INDEX idx_media_files_tags ON media_files USING GIN(tags);
CREATE INDEX idx_media_files_storyteller ON media_files(storyteller_id);
CREATE INDEX idx_media_files_story ON media_files(story_id);
CREATE INDEX idx_media_files_sensitivity ON media_files(cultural_sensitivity);
CREATE INDEX idx_media_files_project ON media_files(project_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
COMMENT ON TABLE media_files IS 'Media library for photos, videos, audio files with cultural sensitivity controls';
