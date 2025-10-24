import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const projectId = process.env.VITE_SUPABASE_PROJECT_ID;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectIds() {
  console.log('🔍 Checking project_id values...\n');
  console.log('Expected project_id from env:', projectId || 'NOT SET');

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, project_id');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('\nPosts in database:');
  data?.forEach(post => {
    console.log(`  - ${post.title}`);
    console.log(`    project_id: ${post.project_id || 'NULL'}`);
  });

  // Test the filter that the frontend uses
  console.log('\n\n🧪 Testing with project_id filter...');
  const { data: filtered } = await supabase
    .from('blog_posts')
    .select('id, title')
    .eq('project_id', projectId);

  console.log(`Posts returned with filter: ${filtered?.length || 0}`);
}

checkProjectIds();
