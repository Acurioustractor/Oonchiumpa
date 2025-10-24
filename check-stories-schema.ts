import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkStoriesSchema() {
  console.log('🔍 Checking stories table schema...\n');

  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Sample story structure:');
  console.log(JSON.stringify(story, null, 2));

  console.log('\n📋 Available columns:');
  Object.keys(story).forEach(key => {
    console.log(`   - ${key}: ${typeof story[key]}`);
  });
}

checkStoriesSchema();
