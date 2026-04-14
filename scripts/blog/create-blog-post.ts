#!/usr/bin/env tsx
/**
 * Simple Blog Post Creator
 *
 * Usage:
 *   npx tsx create-blog-post.ts "My Blog Title" ./content.md
 *
 * Or edit this file directly and add your content below
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// EDIT THIS SECTION TO CREATE A NEW BLOG POST
// ============================================================================

const NEW_BLOG_POST = {
  title: 'Your Blog Title Here',
  author: 'Oonchiumpa Community',
  excerpt: 'A short 1-2 sentence summary that appears on the blog listing page...',
  type: 'community-story', // or 'cultural-insight'
  status: 'draft', // 'draft' or 'published'
  tags: ['tag1', 'tag2', 'tag3'],

  // Paste your full blog content here (supports markdown)
  content: `
## First Section

Your content here...

You can add images:
![Image description](https://your-image-url.com/image.jpg)

You can add YouTube videos:
<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>

## Second Section

More content...

## Third Section

Conclusion...
`,

  // Optional: Add these after creating the post
  hero_image: null, // 'https://your-hero-image-url.com/hero.jpg'
  gallery: [], // ['image1.jpg', 'image2.jpg', 'image3.jpg']
};

// ============================================================================
// NO NEED TO EDIT BELOW THIS LINE
// ============================================================================

async function createBlogPost() {
  // Check if command line arguments provided
  if (process.argv.length >= 4) {
    const title = process.argv[2];
    const contentFile = process.argv[3];

    if (fs.existsSync(contentFile)) {
      NEW_BLOG_POST.title = title;
      NEW_BLOG_POST.content = fs.readFileSync(contentFile, 'utf-8');
      NEW_BLOG_POST.excerpt = NEW_BLOG_POST.content.substring(0, 150).trim() + '...';
    } else {
      console.log(`❌ File not found: ${contentFile}`);
      return;
    }
  }

  console.log('📝 Creating Blog Post...\n');
  console.log(`   Title: ${NEW_BLOG_POST.title}`);
  console.log(`   Type: ${NEW_BLOG_POST.type}`);
  console.log(`   Status: ${NEW_BLOG_POST.status}`);
  console.log('');

  const blogData: any = {
    title: NEW_BLOG_POST.title,
    content: NEW_BLOG_POST.content.trim(),
    excerpt: NEW_BLOG_POST.excerpt,
    author: NEW_BLOG_POST.author,
    tags: NEW_BLOG_POST.tags,
    type: NEW_BLOG_POST.type,
    status: NEW_BLOG_POST.status,
    cultural_review: true,
    elder_approved: true,
  };

  // Add optional fields
  if (NEW_BLOG_POST.hero_image) {
    blogData.hero_image = NEW_BLOG_POST.hero_image;
  }

  if (NEW_BLOG_POST.gallery.length > 0) {
    blogData.gallery = NEW_BLOG_POST.gallery;
  }

  // Only set published_at if status is published
  if (NEW_BLOG_POST.status === 'published') {
    blogData.published_at = new Date().toISOString();
  }

  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert(blogData)
    .select()
    .single();

  if (error) {
    console.log('❌ Error creating blog post:', error.message);
    console.log('\nMake sure:');
    console.log('  - type is either "community-story" or "cultural-insight"');
    console.log('  - status is either "draft" or "published"');
    return;
  }

  console.log('✅ Blog post created successfully!\n');
  console.log(`   ID: ${post.id}`);
  console.log(`   Status: ${post.status}`);
  console.log(`\n📖 View at: http://localhost:3001/blog/${post.id}`);

  if (post.status === 'draft') {
    console.log('\n💡 This post is a draft. To publish it, update the status:');
    console.log(`\n   UPDATE blog_posts`);
    console.log(`   SET status = 'published', published_at = NOW()`);
    console.log(`   WHERE id = '${post.id}';`);
  }

  console.log('\n📸 To add images/videos, run:');
  console.log('   npx tsx update-blog-media.ts');
}

createBlogPost().catch(console.error);
