-- Drop tables if they exist (clean start)
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS impact_stats CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS partners CASCADE;

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  icon_svg text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE team_members (
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
CREATE TABLE impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  label text NOT NULL,
  description text,
  icon text,
  display_order int DEFAULT 0,
  section text DEFAULT 'about',
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  quote text NOT NULL,
  context text,
  avatar_url text,
  specialties jsonb DEFAULT '[]'::jsonb,
  source text,
  impact_statement text,
  category text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner organizations table
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  logo_url text,
  website text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read on team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read on impact_stats" ON impact_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read on testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read on partners" ON partners FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Allow authenticated manage services" ON services FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated manage team_members" ON team_members FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated manage impact_stats" ON impact_stats FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated manage testimonials" ON testimonials FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated manage partners" ON partners FOR ALL USING (auth.uid() IS NOT NULL);
