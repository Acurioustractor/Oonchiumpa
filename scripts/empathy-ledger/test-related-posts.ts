#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs'
);

async function testRelatedPosts() {
  // Test with the post that has "Community, Self-Determination" tags
  const testPostId = '4e17b0a3-171e-4ec8-8e30-40321c1c1e1b';
  const testTags = ['Community', 'Self-Determination'];

  console.log('🔍 Testing related posts for:');
  console.log(`   Post ID: ${testPostId}`);
  console.log(`   Tags: ${testTags.join(', ')}\n`);

  const { data: relatedBlogPosts, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, type, hero_image, tags, read_time, published_at')
    .neq('id', testPostId)
    .eq('status', 'published')
    .eq('elder_approved', true)
    .overlaps('tags', testTags)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.log('❌ Error:', error);
  } else {
    console.log(`✅ Found ${relatedBlogPosts?.length || 0} related posts:\n`);
    relatedBlogPosts?.forEach(post => {
      console.log(`  ${post.title}`);
      console.log(`    Tags: ${post.tags?.join(', ')}`);
      console.log(`    ID: ${post.id}\n`);
    });
  }

  // Also test fallback - recent posts
  if (!relatedBlogPosts || relatedBlogPosts.length === 0) {
    console.log('\n📅 Testing fallback - recent posts:\n');
    const { data: recentPosts } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, type, hero_image, tags, read_time, published_at')
      .neq('id', testPostId)
      .eq('status', 'published')
      .eq('elder_approved', true)
      .order('published_at', { ascending: false })
      .limit(3);

    console.log(`✅ Found ${recentPosts?.length || 0} recent posts:\n`);
    recentPosts?.forEach(post => {
      console.log(`  ${post.title}`);
      console.log(`    ID: ${post.id}\n`);
    });
  }
}

testRelatedPosts();
