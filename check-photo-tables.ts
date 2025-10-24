import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhotoTables() {
  console.log('🔍 Checking for photo-related tables in Supabase...\n');

  // Try different possible table names
  const tablesToCheck = [
    'photos',
    'photo_gallery',
    'photo_projects',
    'gallery',
    'media',
    'media_gallery',
    'images',
    'photo_uploads'
  ];

  for (const tableName of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ Table: ${tableName}`);
        console.log(`   Rows: ${count || 0}`);

        // Get one sample row to see structure
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (sample && sample.length > 0) {
          console.log(`   Columns: ${Object.keys(sample[0]).join(', ')}`);
        }
        console.log('');
      }
    } catch (e) {
      // Table doesn't exist
    }
  }

  console.log('\n📊 Checking for actual photo data...\n');

  // Check photo_projects specifically since we saw it referenced
  const { data: projects, error: projectsError } = await supabase
    .from('photo_projects')
    .select('*')
    .limit(5);

  if (!projectsError && projects) {
    console.log(`Found ${projects.length} photo projects:`);
    projects.forEach(p => {
      console.log(`\n- ${p.title || p.name || 'Untitled'}`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Description: ${p.description?.substring(0, 100)}`);
      console.log(`  Photo count: ${p.photo_count || 0}`);
      console.log(`  Cover photo: ${p.cover_photo_url || 'none'}`);
      if (p.photos) {
        console.log(`  Photos array: ${JSON.stringify(p.photos).substring(0, 100)}...`);
      }
      console.log(`  All fields: ${Object.keys(p).join(', ')}`);
    });
  } else {
    console.log('No photo_projects found or error:', projectsError?.message);
  }
}

checkPhotoTables()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
