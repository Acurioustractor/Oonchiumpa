import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addRelatedStoriesColumn() {
  console.log('🔧 Adding related_stories column to blog_posts table...\n');

  // We'll use a workaround: try to query the column, if it fails, it doesn't exist
  const { data: testData, error: testError } = await supabase
    .from('blog_posts')
    .select('related_stories')
    .limit(1);

  if (testError && testError.message.includes('related_stories')) {
    console.log('❌ Column does not exist yet.\n');
    console.log('📋 Please run this SQL in Supabase SQL Editor:\n');
    console.log('ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS related_stories UUID[] DEFAULT \'{}\';');
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new\n');

    // Alternative: Create a simple workaround by using the gallery field
    console.log('\n💡 Alternative: We can use the existing "gallery" field (TEXT[]) for now');
    console.log('   and store story IDs as strings temporarily.\n');

    return false;
  } else if (testError) {
    console.error('❌ Unexpected error:', testError);
    return false;
  } else {
    console.log('✅ Column already exists!');
    return true;
  }
}

addRelatedStoriesColumn()
  .then(exists => {
    if (exists) {
      console.log('\n✅ Ready to add related stories!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Column needs to be added manually.');
      process.exit(1);
    }
  });
