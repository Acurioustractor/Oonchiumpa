import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhotos() {
  console.log('🔍 Checking for photo galleries...\n');

  // Check photo_projects table
  const { data: projects, error: projectError } = await supabase
    .from('photo_projects')
    .select('*');

  if (projectError) {
    console.log('Photo projects table:', projectError.message);
  } else {
    console.log('Photo Projects found:', projects?.length || 0);
    projects?.forEach(p => {
      console.log(`  - ${p.title}: ${p.photo_count || 0} photos`);
      if (p.cover_photo_url) console.log(`    Cover: ${p.cover_photo_url}`);
    });
  }

  // Check for any media/photos tables
  const { data: tables, error: tablesError } = await supabase
    .rpc('get_tables');

  console.log('\nChecking stories for media_urls...');
  const { data: stories } = await supabase
    .from('stories')
    .select('title, media_urls')
    .not('media_urls', 'is', null)
    .limit(5);

  if (stories && stories.length > 0) {
    console.log('Stories with media:');
    stories.forEach(s => {
      console.log(`  - ${s.title}`);
      console.log(`    Media: ${JSON.stringify(s.media_urls).substring(0, 100)}...`);
    });
  }
}

checkPhotos();
