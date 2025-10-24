import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getBlogMedia() {
  console.log('🔍 Getting media from storylistening blog post...\n');

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', 'ef011e8d-8135-4452-9a26-7190c3dc303e')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📝 Blog Post:', post.title);
  console.log('\n📸 Hero Image:', post.hero_image);
  console.log('\n📷 Gallery:', post.gallery);

  if (post.content) {
    // Extract YouTube/video URLs from content
    const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/g;
    const youtubeMatches = post.content.match(youtubeRegex);

    console.log('\n🎥 Videos found in content:');
    if (youtubeMatches) {
      youtubeMatches.forEach((url, i) => {
        console.log(`   ${i + 1}. ${url}`);
        // Convert to embed URL
        const videoId = url.match(/(?:watch\?v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
        if (videoId) {
          console.log(`      Embed URL: https://www.youtube.com/embed/${videoId}`);
        }
      });
    } else {
      console.log('   No YouTube videos found');
    }

    // Extract image URLs from content
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const imageMatches = [...post.content.matchAll(imageRegex)];

    console.log('\n🖼️  Images found in content:');
    if (imageMatches.length > 0) {
      imageMatches.forEach((match, i) => {
        console.log(`   ${i + 1}. ${match[2]}`);
        console.log(`      Alt: ${match[1]}`);
      });
    } else {
      console.log('   No images found in markdown');
    }
  }

  // Check gallery array
  if (post.gallery && post.gallery.length > 0) {
    console.log('\n🎨 Gallery IDs:', post.gallery);

    // Try to fetch these as story IDs
    for (const id of post.gallery) {
      const { data: story } = await supabase
        .from('stories')
        .select('title, media_urls')
        .eq('id', id)
        .single();

      if (story) {
        console.log(`\n   Story: ${story.title}`);
        if (story.media_urls && story.media_urls.length > 0) {
          console.log(`   Media URLs: ${story.media_urls.length}`);
          story.media_urls.forEach((url: string, i: number) => {
            console.log(`   ${i + 1}. ${url}`);
          });
        }
      }
    }
  }
}

getBlogMedia();
