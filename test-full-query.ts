import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const projectId = process.env.VITE_SUPABASE_PROJECT_ID;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFullQuery() {
  console.log('🔍 Testing the exact query used by the frontend...\n');

  // This is exactly what getBlogPosts() does
  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .eq("elder_approved", true);

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  query = query.order("published_at", { ascending: false });

  const { data, error, count } = await query;

  console.log('Count:', count);
  console.log('Error:', error);
  console.log('Data length:', data?.length || 0);

  if (error) {
    console.error('\n❌ Query failed:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  }

  if (data && data.length > 0) {
    console.log('\n✅ Posts retrieved successfully!');
    data.forEach(post => {
      console.log(`  - ${post.title}`);
    });
  }
}

testFullQuery();
