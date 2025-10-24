import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getLawBlogContent() {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', '645a7f48-79b5-4712-92aa-e0217e6cfaf2')
    .single();

  if (!post) {
    console.log('Blog post not found');
    return;
  }

  console.log('📝 Title:', post.title);
  console.log('\n🖼️ Hero Image:', post.hero_image);
  console.log('\n📷 Gallery IDs:', post.gallery);

  // Extract videos from content
  if (post.content) {
    const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/g;
    const iframeRegex = /<iframe[^>]+src="([^"]+)"[^>]*>/g;

    const youtubeMatches = post.content.match(youtubeRegex);
    const iframeMatches = [...post.content.matchAll(iframeRegex)];

    console.log('\n🎥 Videos:');
    if (youtubeMatches) {
      youtubeMatches.forEach((url, i) => {
        const videoId = url.match(/(?:watch\?v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
        console.log(`\n  ${i + 1}. Original: ${url}`);
        if (videoId) {
          console.log(`     Embed: https://www.youtube.com/embed/${videoId}`);
        }
      });
    }

    if (iframeMatches.length > 0) {
      iframeMatches.forEach((match, i) => {
        console.log(`\n  Iframe ${i + 1}: ${match[1]}`);
      });
    }

    if (!youtubeMatches && iframeMatches.length === 0) {
      console.log('  No videos found');
    }

    // Extract images
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)|<img[^>]+src="([^"]+)"/g;
    const imageMatches = [...post.content.matchAll(imageRegex)];

    console.log('\n🖼️ Images in content:');
    if (imageMatches.length > 0) {
      imageMatches.forEach((match, i) => {
        const url = match[2] || match[3];
        const alt = match[1] || '';
        console.log(`\n  ${i + 1}. ${url}`);
        if (alt) console.log(`     Alt: ${alt}`);
      });
    } else {
      console.log('  No images found');
    }
  }
}

getLawBlogContent();
