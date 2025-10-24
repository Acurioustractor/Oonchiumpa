import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Current impact stats from AboutPage.tsx
const impactStats = [
  {
    number: "95%",
    label: "Diversion Success",
    description: "Of youth diverted from justice system",
    icon: "shield",
    display_order: 1,
    section: "about",
    is_visible: true
  },
  {
    number: "97.6%",
    label: "More Cost-Effective",
    description: "Than youth detention",
    icon: "dollar",
    display_order: 2,
    section: "about",
    is_visible: true
  },
  {
    number: "100%",
    label: "Aboriginal Employment",
    description: "Led by Arrernte Traditional Owners",
    icon: "users",
    display_order: 3,
    section: "about",
    is_visible: true
  },
  {
    number: "72%",
    label: "Returned to Education",
    description: "After disengagement from school",
    icon: "book",
    display_order: 4,
    section: "about",
    is_visible: true
  },
  {
    number: "30+",
    label: "Youth Supported",
    description: "From 7 language groups",
    icon: "heart",
    display_order: 5,
    section: "about",
    is_visible: true
  },
  {
    number: "90%",
    label: "Retention Rate",
    description: "Young people engaged consistently",
    icon: "check",
    display_order: 6,
    section: "about",
    is_visible: true
  }
];

async function migrateImpactStats() {
  console.log('🔄 Migrating impact stats data to database...\n');

  for (const stat of impactStats) {
    console.log(`Inserting: ${stat.label}`);

    const { error } = await supabase
      .from('impact_stats')
      .insert(stat);

    if (error) {
      console.error(`❌ Error inserting ${stat.label}:`, error.message);
    } else {
      console.log(`✅ ${stat.label} inserted successfully`);
    }
  }

  console.log('\n✨ Impact stats migration complete!');

  // Verify
  const { data, error } = await supabase
    .from('impact_stats')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ Error verifying:', error);
  } else {
    console.log(`\n📊 Total impact stats in database: ${data?.length}`);
  }
}

migrateImpactStats();
