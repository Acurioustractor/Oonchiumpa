import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Current team data from AboutPage.tsx
const teamMembers = [
  {
    name: "Kristy Bloomfield",
    role: "Director & Traditional Owner",
    tribe: "Central & Eastern Arrernte Woman",
    description: "Leading with cultural authority as a Traditional Owner of Mparntwe (Alice Springs), Kristy brings deep connection to Country and community. Her vision has transformed youth diversion in Central Australia.",
    quote: "We're not just changing young lives - we're reclaiming our community, our culture, and our future.",
    avatar_url: "/images/team/kristy.jpg",
    display_order: 1,
    is_visible: true
  },
  {
    name: "Tanya Turner",
    role: "Legal Advocate & Community Educator",
    tribe: "Eastern Arrernte Woman",
    description: "UWA law graduate, former Supreme Court Associate, and passionate advocate. Tanya combines professional legal excellence with deep cultural knowledge to create pathways for justice and healing.",
    quote: "These kids aren't the problem - they're collateral in a bigger issue. We're here to change that system.",
    avatar_url: "/images/team/tanya.jpg",
    display_order: 2,
    is_visible: true
  }
];

async function migrateTeamMembers() {
  console.log('🔄 Migrating team members data to database...\n');

  for (const member of teamMembers) {
    console.log(`Inserting: ${member.name}`);

    const { error } = await supabase
      .from('team_members')
      .insert(member);

    if (error) {
      console.error(`❌ Error inserting ${member.name}:`, error.message);
    } else {
      console.log(`✅ ${member.name} inserted successfully`);
    }
  }

  console.log('\n✨ Team members migration complete!');

  // Verify
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ Error verifying:', error);
  } else {
    console.log(`\n📊 Total team members in database: ${data?.length}`);
  }
}

migrateTeamMembers();
