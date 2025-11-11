#!/usr/bin/env tsx
/**
 * NOTION → SUPABASE BLOG SYNC
 *
 * Features:
 * - Syncs blog posts from Notion to Supabase
 * - Downloads images from Notion → Supabase Storage
 * - Extracts videos → Supabase videos table
 * - Updates blog content with Supabase URLs
 *
 * Setup:
 * 1. npm install @notionhq/client node-fetch dotenv
 * 2. Create .env file with:
 *    NOTION_API_KEY=your_notion_integration_key
 *    NOTION_DATABASE_ID=your_database_id
 * 3. Run: npx tsx notion-to-supabase-sync.ts
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as crypto from 'crypto';

// ============================================================================
// CONFIGURATION
// ============================================================================

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

const SUPABASE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';
const SUPABASE_PROJECT_ID = '5b853f55-c01e-4f1d-9e16-b99290ee1a2c'; // Oonchiumpa project ID

const notion = new Client({ auth: NOTION_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// IMAGE DOWNLOAD & UPLOAD
// ============================================================================

async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  folder: string = 'blog'
): Promise<string> {
  const path = `${folder}/${filename}`;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

function generateFilename(url: string, notionPageId: string): string {
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
  return `${notionPageId}-${hash}.${ext}`;
}

// ============================================================================
// VIDEO EXTRACTION
// ============================================================================

function extractVideosFromContent(content: string): Array<{
  url: string;
  type: 'youtube' | 'vimeo' | 'descript';
  videoId: string;
}> {
  const videos: Array<any> = [];

  // YouTube patterns
  const youtubePatterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
    /youtu\.be\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g,
  ];

  for (const pattern of youtubePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      videos.push({
        url: match[0],
        type: 'youtube',
        videoId: match[1]
      });
    }
  }

  // Vimeo pattern
  const vimeoPattern = /vimeo\.com\/(\d+)/g;
  let vimeoMatch;
  while ((vimeoMatch = vimeoPattern.exec(content)) !== null) {
    videos.push({
      url: vimeoMatch[0],
      type: 'vimeo',
      videoId: vimeoMatch[1]
    });
  }

  // Descript patterns
  const descriptPatterns = [
    /share\.descript\.com\/view\/([a-zA-Z0-9_-]+)/g,
    /share\.descript\.com\/embed\/([a-zA-Z0-9_-]+)/g,
  ];

  for (const pattern of descriptPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      videos.push({
        url: match[0],
        type: 'descript',
        videoId: match[1]
      });
    }
  }

  return videos;
}

function embedVideosInContent(content: string): string {
  let processedContent = content;

  // Replace Descript URLs with iframes
  processedContent = processedContent.replace(
    /https?:\/\/share\.descript\.com\/view\/([a-zA-Z0-9_-]+)/g,
    '<div class="video-embed my-8"><iframe src="https://share.descript.com/embed/$1" width="100%" height="400" frameborder="0" allowfullscreen></iframe></div>'
  );

  // Replace YouTube URLs with iframes
  processedContent = processedContent.replace(
    /https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
    '<div class="video-embed my-8"><iframe width="100%" height="400" src="https://www.youtube.com/embed/$2" frameborder="0" allowfullscreen></iframe></div>'
  );

  processedContent = processedContent.replace(
    /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g,
    '<div class="video-embed my-8"><iframe width="100%" height="400" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>'
  );

  // Replace Vimeo URLs with iframes
  processedContent = processedContent.replace(
    /https?:\/\/vimeo\.com\/(\d+)/g,
    '<div class="video-embed my-8"><iframe src="https://player.vimeo.com/video/$1" width="100%" height="400" frameborder="0" allowfullscreen></iframe></div>'
  );

  return processedContent;
}

async function saveVideoToGallery(
  video: any,
  blogPostId: string,
  notionPageId: string,
  title: string
) {
  const { data, error } = await supabase
    .from('videos')
    .insert({
      title: title,
      video_url: `https://${video.url}`,
      video_type: video.type,
      video_id: video.videoId,
      source_blog_post_id: blogPostId,
      source_notion_page_id: notionPageId,
      status: 'published',
      is_public: true,
      published_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.log(`   ⚠️  Failed to save video: ${error.message}`);
    return null;
  }

  console.log(`   ✅ Video saved to gallery: ${video.videoId}`);
  return data;
}

// ============================================================================
// NOTION CONTENT PROCESSING
// ============================================================================

async function getNotionPageContent(pageId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100
  });

  let content = '';

  for (const block of blocks.results as any[]) {
    if (block.type === 'paragraph') {
      content += block.paragraph.rich_text.map((t: any) => t.plain_text).join('') + '\n\n';
    }
    else if (block.type === 'heading_1') {
      content += '# ' + block.heading_1.rich_text.map((t: any) => t.plain_text).join('') + '\n\n';
    }
    else if (block.type === 'heading_2') {
      content += '## ' + block.heading_2.rich_text.map((t: any) => t.plain_text).join('') + '\n\n';
    }
    else if (block.type === 'heading_3') {
      content += '### ' + block.heading_3.rich_text.map((t: any) => t.plain_text).join('') + '\n\n';
    }
    else if (block.type === 'bulleted_list_item') {
      content += '- ' + block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    }
    else if (block.type === 'numbered_list_item') {
      content += '1. ' + block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    }
    else if (block.type === 'quote') {
      content += '> ' + block.quote.rich_text.map((t: any) => t.plain_text).join('') + '\n\n';
    }
    else if (block.type === 'image') {
      const imageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url;

      content += `![Image](${imageUrl})\n\n`;
    }
    else if (block.type === 'video') {
      const videoUrl = block.video.type === 'external'
        ? block.video.external.url
        : block.video.file.url;

      content += `${videoUrl}\n\n`;
    }
  }

  return content.trim();
}

async function processImages(
  content: string,
  notionPageId: string
): Promise<string> {
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let processedContent = content;
  const matches = [...content.matchAll(imagePattern)];

  console.log(`   📸 Found ${matches.length} images to download`);

  for (const match of matches) {
    const [fullMatch, altText, imageUrl] = match;

    try {
      // Skip if already a Supabase URL
      if (imageUrl.includes('supabase.co')) {
        console.log(`   ⏭️  Skipping (already in Supabase): ${imageUrl.substring(0, 50)}...`);
        continue;
      }

      console.log(`   ⬇️  Downloading: ${imageUrl.substring(0, 50)}...`);

      // Download image
      const imageBuffer = await downloadImage(imageUrl);

      // Upload to Supabase
      const filename = generateFilename(imageUrl, notionPageId);
      const supabaseUrl = await uploadToSupabase(imageBuffer, filename, `blog/${notionPageId}`);

      console.log(`   ✅ Uploaded: ${filename}`);

      // Replace in content
      processedContent = processedContent.replace(imageUrl, supabaseUrl);

    } catch (error: any) {
      console.log(`   ❌ Failed to process image: ${error.message}`);
    }
  }

  return processedContent;
}

// ============================================================================
// NOTION → SUPABASE SYNC
// ============================================================================

async function syncNotionToSupabase() {
  console.log('\n🔄 NOTION → SUPABASE BLOG SYNC\n');
  console.log('='.repeat(70));

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log('\n❌ Missing configuration!');
    console.log('\nPlease set environment variables:');
    console.log('  export NOTION_API_KEY=your_notion_key');
    console.log('  export NOTION_DATABASE_ID=your_database_id');
    console.log('\nOr create .env file with these values.');
    return;
  }

  console.log(`\n✅ Configuration loaded:`);
  console.log(`   Notion API Key: ${NOTION_API_KEY.substring(0, 10)}...`);
  console.log(`   Notion DB ID: ${NOTION_DATABASE_ID}`);
  console.log(`   Notion client type: ${typeof notion}`);
  console.log(`   Has databases: ${typeof notion.databases}`);
  console.log(`   Has query: ${typeof notion.databases?.query}\n`);

  try {
    // Query Notion database for ALL posts (regardless of status)
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID
    });

    console.log(`\n📚 Found ${response.results.length} posts in Notion\n`);

    // Track synced posts by status
    const syncStats = {
      published: 0,
      draft: 0,
      archived: 0
    };

    for (const page of response.results as any[]) {
      const title = page.properties.Title?.title[0]?.plain_text || 'Untitled';
      const tags = page.properties.Tags?.multi_select?.map((t: any) => t.name) || [];
      const author = page.properties.Author?.rich_text[0]?.plain_text || 'Oonchiumpa Community';

      // Get status from Notion and map to Supabase status
      const notionStatus = page.properties.Status?.status?.name || 'Draft';
      const supabaseStatus = notionStatus === 'Published' ? 'published' :
                            notionStatus === 'Archived' ? 'archived' :
                            'draft';

      console.log(`\n📄 Processing: ${title}`);
      console.log(`   Notion ID: ${page.id}`);
      console.log(`   Status: ${notionStatus} → ${supabaseStatus}`);

      // Get full content
      let content = await getNotionPageContent(page.id);
      console.log(`   📝 Content length: ${content.length} characters`);

      // If no content, add a placeholder
      if (!content || content.trim().length === 0) {
        content = `# ${title}\n\nThis blog post was synced from Notion but has no content yet.\n\nPlease add content in Notion and sync again.`;
        console.log(`   ⚠️  No content found - using placeholder`);
      }

      // Process images (download → upload to Supabase → replace URLs)
      content = await processImages(content, page.id);

      // Embed videos in content (convert URLs to iframes)
      content = embedVideosInContent(content);

      // Extract excerpt (before HTML, for clean text)
      const excerpt = content.substring(0, 200).replace(/[#\n<>]/g, '').trim() + '...';

      // Create or update blog post
      const notionPageId = page.id;

      // Check if this Notion page was already synced
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('source_notion_page_id', notionPageId)
        .single();

      let blogPost;
      if (existingPost) {
        // Update existing post
        const { data, error: updateError } = await supabase
          .from('blog_posts')
          .update({
            title,
            content,
            excerpt,
            author,
            tags,
            type: 'community-story',
            status: supabaseStatus,
            published_at: supabaseStatus === 'published' ? new Date(page.created_time).toISOString() : null,
            cultural_review: true,
            elder_approved: true,
            project_id: SUPABASE_PROJECT_ID,
          })
          .eq('id', existingPost.id)
          .select()
          .single();

        if (updateError) {
          console.log(`   ❌ Failed to update blog post: ${updateError.message}`);
          continue;
        }
        blogPost = data;
        console.log(`   ✅ Blog post updated: ${blogPost.id}`);
      } else {
        // Insert new post
        const { data, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            title,
            content,
            excerpt,
            author,
            tags,
            type: 'community-story',
            status: supabaseStatus,
            published_at: supabaseStatus === 'published' ? new Date(page.created_time).toISOString() : null,
            cultural_review: true,
            elder_approved: true,
            source_notion_page_id: notionPageId,
            project_id: SUPABASE_PROJECT_ID,
          })
          .select()
          .single();

        if (insertError) {
          console.log(`   ❌ Failed to create blog post: ${insertError.message}`);
          continue;
        }
        blogPost = data;
        console.log(`   ✅ Blog post created: ${blogPost.id}`);
      }

      // Extract and save videos
      const videos = extractVideosFromContent(content);
      if (videos.length > 0) {
        console.log(`   🎬 Found ${videos.length} videos`);
        for (const video of videos) {
          await saveVideoToGallery(video, blogPost.id, page.id, `${title} - Video`);
        }
      }

      // Track this post
      syncStats[supabaseStatus]++;
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Sync complete!');
    console.log('\n📊 Status Summary:');
    console.log(`   ✅ Published: ${syncStats.published} (visible on blog)`);
    console.log(`   📝 Draft: ${syncStats.draft} (hidden from blog)`);
    console.log(`   📦 Archived: ${syncStats.archived} (hidden from blog)`);
    console.log('\n📖 View your blog at: http://localhost:3001/blog');
    console.log('🎬 View video gallery at: http://localhost:3001/videos');

  } catch (error: any) {
    console.log('\n❌ Sync failed:', error.message);
    console.log('\nMake sure:');
    console.log('  - Notion integration has access to the database');
    console.log('  - Database has "Title", "Status", "Tags", "Author" properties');
    console.log('  - Supabase storage bucket "media" exists');
  }
}

// ============================================================================
// RUN SYNC
// ============================================================================

syncNotionToSupabase().catch(console.error);
