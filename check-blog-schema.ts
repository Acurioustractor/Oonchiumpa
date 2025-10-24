import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkBlogSchema() {
  console.log('🔍 Checking blog_posts schema...\n');

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Sample blog post structure:');
  console.log(JSON.stringify(post, null, 2));

  console.log('\n📋 Available columns:');
  Object.keys(post).forEach(key => {
    console.log(`   - ${key}: ${typeof post[key]}`);
  });
}

checkBlogSchema();
