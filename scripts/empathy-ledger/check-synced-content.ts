#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k'
);

async function checkSyncedContent() {
  console.log('📖 Checking synced blog post...\n');

  // Get blog post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('source_notion_page_id', '2a7ebcf9-81cf-80be-ae09-cc6fbcca3f01')
    .single();

  if (post) {
    console.log('✅ Blog Post Found:');
    console.log(`   ID: ${post.id}`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Author: ${post.author}`);
    console.log(`   Tags: ${post.tags?.join(', ')}`);
    console.log(`   Content Length: ${post.content?.length} characters`);
    console.log(`   Status: ${post.status}`);
    console.log('\n📝 Content Preview:');
    console.log('   ' + post.content?.substring(0, 300).replace(/\n/g, '\n   '));
  }

  // Get videos
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('source_blog_post_id', post?.id);

  if (videos && videos.length > 0) {
    console.log('\n\n🎬 Videos Found:', videos.length);
    videos.forEach(video => {
      console.log(`\n   Video ID: ${video.video_id}`);
      console.log(`   Title: ${video.title}`);
      console.log(`   Type: ${video.video_type}`);
      console.log(`   URL: ${video.video_url}`);
      console.log(`   Status: ${video.status}`);
    });
  }

  console.log('\n\n🌐 View URLs:');
  console.log(`   Blog: http://localhost:3001/blog/${post?.id}`);
  console.log(`   Video Gallery: http://localhost:3001/videos`);
}

checkSyncedContent();
