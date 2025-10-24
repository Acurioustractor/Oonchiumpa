import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogPosts() {
  console.log('🔍 Testing blog post retrieval with anonymous key...\n');

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('id, title, status, elder_approved, published_at', { count: 'exact' });

  console.log('Total rows in DB:', count);
  console.log('Posts returned:', data?.length || 0);

  if (error) {
    console.error('❌ Error:', error);
  }

  if (data && data.length > 0) {
    console.log('\n✅ Posts found:');
    data.forEach(post => {
      console.log(`  - ${post.title}`);
      console.log(`    Status: ${post.status}, Elder Approved: ${post.elder_approved}`);
    });
  } else {
    console.log('\n⚠️  No posts returned (likely RLS policy issue)');
  }
}

testBlogPosts();
