-- Create CMS tables for content management
-- Phase 1: Minimal CMS Implementation

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  features jsonb DEFAULT '[]'::jsonb, -- array of feature strings
  icon_svg text, -- SVG path data for icon
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  tribe text,
  description text,
  quote text,
  avatar_url text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Impact stats table
CREATE TABLE IF NOT EXISTS impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL, -- "95%", "30+", etc.
  label text NOT NULL,
  description text,
  icon text, -- icon name or category
  display_order int DEFAULT 0,
  section text DEFAULT 'about', -- where it appears on site
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  quote text NOT NULL,
  context text,
  avatar_url text,
  specialties jsonb DEFAULT '[]'::jsonb,
  source text,
  impact_statement text,
  category text, -- 'youth', 'family', 'law_student', 'leadership', etc.
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner organizations table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL, -- 'aboriginal', 'education', 'support'
  logo_url text,
  website text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_impact_stats_updated_at BEFORE UPDATE ON impact_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can read visible content)
CREATE POLICY "Allow public read access on services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on team_members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on impact_stats"
  ON impact_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on testimonials"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on partners"
  ON partners FOR SELECT
  USING (true);

-- Admin write access (authenticated users can manage all content)
CREATE POLICY "Allow authenticated users to manage services"
  ON services FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage team_members"
  ON team_members FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage impact_stats"
  ON impact_stats FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage partners"
  ON partners FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_is_visible ON services(is_visible);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_impact_stats_display_order ON impact_stats(display_order);
CREATE INDEX IF NOT EXISTS idx_impact_stats_section ON impact_stats(section);
CREATE INDEX IF NOT EXISTS idx_testimonials_category ON testimonials(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
