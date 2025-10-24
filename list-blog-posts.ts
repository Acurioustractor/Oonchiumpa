import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function listBlogPosts() {
  console.log('📋 Listing all blog posts...\n');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, type, status')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${posts?.length || 0} blog posts:\n`);

  posts?.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Type: ${post.type}`);
    console.log(`   Status: ${post.status}`);
    console.log('');
  });
}

listBlogPosts();
