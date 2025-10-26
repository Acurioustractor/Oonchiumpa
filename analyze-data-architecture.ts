#!/usr/bin/env tsx

/**
 * Analyze Current Supabase Database Architecture
 * Understand how documents, stories, media, and metadata are organized
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function analyzeArchitecture() {
  console.log('🔍 Analyzing Oonchiumpa Data Architecture\n');
  console.log('=' .repeat(80));
  console.log('\n');

  // Sign in
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@oonchiumpa.org',
    password: 'OonchiumpaTest2024!'
  });

  if (authError) {
    console.error('❌ Auth failed');
    return;
  }

  const projectId = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c';

  // 1. STORIES ANALYSIS
  console.log('📖 STORIES TABLE ANALYSIS');
  console.log('-'.repeat(80));

  const { data: allStories, count: totalStories } = await supabase
    .from('stories')
    .select('*', { count: 'exact' });

  const { data: oonchiumpaStories, count: oonchiumpaCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId);

  console.log(`Total Stories: ${totalStories}`);
  console.log(`Oonchiumpa Stories (project_id match): ${oonchiumpaCount}`);
  console.log(`Other Organizations: ${totalStories! - oonchiumpaCount!}`);

  if (allStories && allStories.length > 0) {
    const sample = allStories[0];
    console.log('\nStory Schema (sample):');
    console.log(JSON.stringify(sample, null, 2));

    console.log('\nStory Fields:');
    Object.keys(sample).forEach(key => {
      console.log(`  - ${key}: ${typeof sample[key]}`);
    });

    // Check for storyteller references
    const storytellerIds = new Set(allStories.map(s => s.storyteller_id || s.author_id).filter(Boolean));
    console.log(`\nUnique Storyteller IDs: ${storytellerIds.size}`);
  }

  // 2. STORYTELLERS ANALYSIS
  console.log('\n\n📝 STORYTELLERS TABLE ANALYSIS');
  console.log('-'.repeat(80));

  const { data: storytellers, count: storytellerCount } = await supabase
    .from('storytellers')
    .select('*', { count: 'exact' });

  console.log(`Total Storytellers: ${storytellerCount}`);

  if (storytellers && storytellers.length > 0) {
    const sample = storytellers[0];
    console.log('\nStoryteller Schema (sample):');
    console.log(JSON.stringify(sample, null, 2));
  }

  // 3. BLOG POSTS ANALYSIS
  console.log('\n\n📰 BLOG POSTS TABLE ANALYSIS');
  console.log('-'.repeat(80));

  const { data: blogs, count: blogCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' });

  console.log(`Total Blog Posts: ${blogCount}`);

  if (blogs) {
    console.log('\nBlog Posts:');
    blogs.forEach(blog => {
      console.log(`  - ${blog.title} (${blog.status}) - ${blog.created_at?.substring(0, 10)}`);
    });

    if (blogs.length > 0) {
      console.log('\nBlog Post Schema (sample):');
      const sample = blogs[0];
      Object.keys(sample).forEach(key => {
        console.log(`  - ${key}: ${typeof sample[key]} = ${JSON.stringify(sample[key])?.substring(0, 100)}`);
      });
    }
  }

  // 4. MEDIA/GALLERY ANALYSIS
  console.log('\n\n📸 MEDIA & GALLERY ANALYSIS');
  console.log('-'.repeat(80));

  const { data: galleries, count: galleryCount } = await supabase
    .from('photo_galleries')
    .select('*', { count: 'exact' });

  console.log(`Photo Galleries: ${galleryCount}`);

  const { data: galleryPhotos, count: photoCount } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact' });

  console.log(`Gallery Photos: ${photoCount}`);

  const { data: mediaFiles, count: mediaCount } = await supabase
    .from('media_files')
    .select('*', { count: 'exact' });

  console.log(`Media Files: ${mediaCount}`);

  if (galleries && galleries.length > 0) {
    console.log('\nPhoto Galleries:');
    galleries.forEach(g => {
      console.log(`  - ${g.name} (${g.category})`);
    });
  }

  if (galleryPhotos && galleryPhotos.length > 0) {
    console.log('\nGallery Photos Schema (sample):');
    const sample = galleryPhotos[0];
    Object.keys(sample).forEach(key => {
      console.log(`  - ${key}: ${typeof sample[key]}`);
    });
  }

  // 5. STORAGE BUCKETS ANALYSIS
  console.log('\n\n💾 STORAGE BUCKETS ANALYSIS');
  console.log('-'.repeat(80));

  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (buckets) {
    console.log(`Storage Buckets: ${buckets.length}`);
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    // Check media bucket contents
    for (const bucket of buckets) {
      const { data: files } = await supabase.storage.from(bucket.name).list('', { limit: 5 });
      if (files && files.length > 0) {
        console.log(`\n  ${bucket.name} contents (sample):`);
        files.forEach(file => {
          console.log(`    - ${file.name}`);
        });
      }
    }
  }

  // 6. DOCUMENT STORAGE ANALYSIS
  console.log('\n\n📄 DOCUMENT STORAGE ANALYSIS');
  console.log('-'.repeat(80));
  console.log('Where are interview transcripts, historical docs, etc. stored?');

  // Check for document-related tables
  const documentTables = ['documents', 'transcripts', 'interviews', 'source_documents'];
  for (const table of documentTables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`  - ${table} table: ${count} records`);
    }
  }

  // 7. RELATIONSHIPS & DATA FLOW
  console.log('\n\n🔗 DATA RELATIONSHIPS & FLOW');
  console.log('-'.repeat(80));

  // Check blog_posts for related_stories field
  const blogWithRelated = blogs?.find(b => b.related_stories && b.related_stories.length > 0);
  if (blogWithRelated) {
    console.log('Blog Posts → Stories relationship:');
    console.log(`  Blog: "${blogWithRelated.title}"`);
    console.log(`  Related Stories: ${blogWithRelated.related_stories}`);
  }

  // Check for media relationships
  console.log('\nStories → Media relationship:');
  const storyWithMedia = allStories?.find(s => s.media || s.attachments);
  if (storyWithMedia) {
    console.log(`  Story: "${storyWithMedia.title}"`);
    console.log(`  Media: ${JSON.stringify(storyWithMedia.media || storyWithMedia.attachments)}`);
  }

  console.log('\n\n');
  console.log('=' .repeat(80));
  console.log('ANALYSIS COMPLETE');
  console.log('=' .repeat(80));

  await supabase.auth.signOut();
}

analyzeArchitecture();
