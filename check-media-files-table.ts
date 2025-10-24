import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMediaFilesTable() {
  console.log('🔍 Checking media_files table...\n');

  // Try to query the media_files table
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing media_files table:', error.message);
    console.log('\n💡 The media_files table might not exist yet.');
    console.log('   You may need to create it using create-media-tables.sql');
  } else {
    console.log('✅ media_files table exists!');
    console.log(`📊 Sample data:`, data);
  }

  // Check storage bucket
  const { data: buckets, error: bucketError } = await supabase
    .storage
    .listBuckets();

  if (bucketError) {
    console.error('\n❌ Error checking storage buckets:', bucketError.message);
  } else {
    console.log('\n📦 Storage buckets:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    const mediaExists = buckets.some(b => b.name === 'media');
    if (!mediaExists) {
      console.log('\n💡 The "media" storage bucket does not exist.');
      console.log('   You need to create it in Supabase Dashboard -> Storage');
    }
  }
}

checkMediaFilesTable();
