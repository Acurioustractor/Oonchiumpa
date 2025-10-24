import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkSchema() {
  console.log('🔍 Checking gallery_media table schema...\n');

  const { data, error } = await supabase
    .from('gallery_media')
    .select('*')
    .limit(3);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('📋 Gallery Media Schema:');
    console.log(Object.keys(data[0]));
    console.log('\n📸 Sample records:');
    data.forEach((record, i) => {
      console.log(`\n${i + 1}. ${record.title || 'Untitled'}`);
      console.log(`   ID: ${record.id}`);
      console.log(`   Type: ${record.media_type}`);
      console.log(`   Category: ${record.category || 'none'}`);
      console.log(`   URL: ${record.url?.substring(0, 60)}...`);
    });
  } else {
    console.log('No records found');
  }
}

checkSchema();
