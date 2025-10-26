#!/usr/bin/env tsx

/**
 * Check what data exists in Supabase for the dashboard
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('🔍 Checking dashboard data sources...\n');

  // Sign in as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@oonchiumpa.org',
    password: 'OonchiumpaTest2024!'
  });

  if (authError) {
    console.error('❌ Auth failed:', authError.message);
    return;
  }

  console.log('✅ Signed in as:', authData.user.email, '\n');

  // Check for tables that might contain dashboard data
  const tablesToCheck = [
    'blog_posts',
    'stories',
    'documents',
    'media_files',
    'gallery_photos',
    'users'
  ];

  for (const table of tablesToCheck) {
    console.log(`📊 Checking ${table} table...`);

    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      if (error.code === '42P01') {
        console.log(`   ⚠️  Table does not exist\n`);
      } else {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    } else {
      console.log(`   ✅ Found ${count} rows`);
      if (data && data.length > 0) {
        console.log(`   📝 Sample record:`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
      }
      console.log('');
    }
  }

  // Check blog posts specifically
  console.log('📰 Checking blog_posts details...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('id, title, status, created_at')
    .limit(10);

  if (blogError) {
    console.log(`   ❌ Error: ${blogError.message}\n`);
  } else if (blogPosts) {
    console.log(`   Found ${blogPosts.length} blog posts:`);
    blogPosts.forEach(post => {
      console.log(`   - ${post.title} (${post.status || 'no status'})`);
    });
    console.log('');
  }

  // Check stories
  console.log('📖 Checking stories details...');
  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('id, title, story_category, is_public')
    .limit(10);

  if (storiesError) {
    console.log(`   ❌ Error: ${storiesError.message}\n`);
  } else if (stories) {
    console.log(`   Found ${stories.length} stories:`);
    stories.forEach(story => {
      console.log(`   - ${story.title} (${story.story_category || 'no category'}) - Public: ${story.is_public}`);
    });
    console.log('');
  }

  await supabase.auth.signOut();
}

checkData();
