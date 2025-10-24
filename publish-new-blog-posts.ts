/**
 * Script to publish the three new blog posts to Supabase
 *
 * Run with: npx tsx publish-new-blog-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { newBlogPosts } from './oonchiumpa-app/src/data/newBlogPosts';

// Get Supabase credentials from environment
// Use service role key to bypass RLS for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const projectId = process.env.VITE_SUPABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

async function publishBlogPosts() {
  console.log('🚀 Publishing new blog posts to Supabase...\n');

  for (const post of newBlogPosts) {
    console.log(`📝 Publishing: "${post.title}"`);

    try {
      // Convert BlogPostDraft to database format
      const dbPost = {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        type: post.type,
        tags: post.tags,
        hero_image: post.heroImage,
        gallery: post.gallery || [],
        storyteller_id: post.storyteller_id || null,
        author: 'Oonchiumpa Editorial Team',
        status: 'published',
        elder_approved: true,
        curated_by: 'Oonchiumpa Editorial Team',
        cultural_review: 'Elder Approved',
        read_time: calculateReadTime(post.content),
        published_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        project_id: projectId || undefined,
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(dbPost)
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        console.error(`   Details:`, error);
      } else {
        console.log(`   ✅ Published successfully (ID: ${data.id})`);
        console.log(`   📊 Read time: ${data.read_time} minutes`);
        console.log(`   🏷️  Type: ${data.type}`);
        console.log(`   🔖 Tags: ${data.tags.slice(0, 3).join(', ')}...`);
      }
    } catch (error) {
      console.error(`   ❌ Unexpected error:`, error);
    }

    console.log(''); // Empty line between posts
  }

  console.log('✨ Blog post publishing complete!\n');

  // Fetch and display stats
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('status, type, elder_approved')
      .eq('status', 'published')
      .eq('elder_approved', true);

    if (!error && posts) {
      console.log('📊 Current Blog Stats:');
      console.log(`   Total published posts: ${posts.length}`);
      console.log(`   Community Stories: ${posts.filter(p => p.type === 'community-story').length}`);
      console.log(`   Cultural Insights: ${posts.filter(p => p.type === 'cultural-insight').length}`);
      console.log(`   Youth Work: ${posts.filter(p => p.type === 'youth-work').length}`);
    }
  } catch (error) {
    console.error('Could not fetch stats:', error);
  }
}

// Run the script
publishBlogPosts()
  .then(() => {
    console.log('\n✅ All done! Check your blog page to see the new posts.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
