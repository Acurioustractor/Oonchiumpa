import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Current partners from AboutPage.tsx
const partners = [
  // Aboriginal Organizations
  { name: 'Tangentyere Employment', category: 'aboriginal', display_order: 1 },
  { name: 'Congress (Health Services)', category: 'aboriginal', display_order: 2 },
  { name: 'Lhere Artepe Aboriginal Corporation', category: 'aboriginal', display_order: 3 },
  { name: 'NAAJA (Legal Services)', category: 'aboriginal', display_order: 4 },
  { name: 'Akeyulerre Healing Centre', category: 'aboriginal', display_order: 5 },
  { name: 'NPY Lands', category: 'aboriginal', display_order: 6 },

  // Education & Training
  { name: "St Joseph's School", category: 'education', display_order: 1 },
  { name: 'Yipirinya School', category: 'education', display_order: 2 },
  { name: 'Yirara College', category: 'education', display_order: 3 },
  { name: 'YORET (Training)', category: 'education', display_order: 4 },
  { name: 'Sadadeen School', category: 'education', display_order: 5 },

  // Support Services
  { name: 'Saltbush (Bail Support)', category: 'support', display_order: 1 },
  { name: 'Territory Families', category: 'support', display_order: 2 },
  { name: 'NT Youth Justice', category: 'support', display_order: 3 },
  { name: 'Gap Youth Centre', category: 'support', display_order: 4 },
  { name: 'Centrelink', category: 'support', display_order: 5 },
  { name: 'Housing Services', category: 'support', display_order: 6 },
];

async function migratePartners() {
  console.log('🔄 Migrating partner organizations to database...\n');

  for (const partner of partners) {
    console.log(`Inserting: ${partner.name}`);

    const { error } = await supabase
      .from('partners')
      .insert({
        name: partner.name,
        category: partner.category,
        display_order: partner.display_order,
        is_visible: true,
        logo_url: null,
        website: null
      });

    if (error) {
      console.error(`❌ Error inserting ${partner.name}:`, error.message);
    } else {
      console.log(`✅ ${partner.name} inserted successfully`);
    }
  }

  console.log('\n✨ Partners migration complete!');

  // Verify
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('category')
    .order('display_order');

  if (error) {
    console.error('❌ Error verifying:', error);
  } else {
    console.log(`\n📊 Total partners in database: ${data?.length}`);
    console.log('\nBy category:');
    const byCat = data?.reduce((acc: any, p: any) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log(byCat);
  }
}

migratePartners();
