import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function publishStorylisteningBlog() {
  console.log('📝 Publishing Storylistening blog post...\n');

  const blogPost = {
    title: 'Brave Spaces for Storytelling: Kristy Bloomfield on Deep Listening and True Justice',
    excerpt: 'How Oonchiumpa\'s partnership with the Empathy Ledger and ANU is transforming justice through the power of listening',
    content: fs.readFileSync('blog-post-storylistening.md', 'utf-8'),
    author: 'Kristy Bloomfield',
    type: 'cultural-insight',
    tags: ['Storylistening', 'True Justice', 'Law Students', 'Deep Listening', 'Empathy Ledger', 'ANU', 'Legal Education', 'Cultural Authority'],
    status: 'published',
    published_at: new Date().toISOString(),
    read_time: 7,
    elder_approved: true,
    curated_by: 'Oonchiumpa Editorial Team',
    cultural_review: 'Elder Approved',
    approved_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blogPost)
    .select()
    .single();

  if (error) {
    console.error('❌ Error publishing blog post:', error);
    return;
  }

  console.log('✅ Blog post published successfully!');
  console.log(`   Title: ${data.title}`);
  console.log(`   Slug: ${data.slug}`);
  console.log(`   ID: ${data.id}`);
  console.log(`\n🌐 View at: /blog/${data.slug}`);
}

publishStorylisteningBlog().catch(console.error);
