import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LAW_STUDENTS_POST_ID = '645a7f48-79b5-4712-92aa-e0217e6cfaf2';

async function checkBlogContent() {
  console.log('📋 Checking law students blog post content...\n');

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', LAW_STUDENTS_POST_ID)
    .single();

  if (error || !post) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Title: ${post.title}\n`);

  // Check for photos
  const photoMatches = post.content.match(/!\[.*?\]\((.*?)\)/g);
  console.log(`📸 Found ${photoMatches?.length || 0} image markdown tags\n`);

  if (photoMatches) {
    photoMatches.slice(0, 5).forEach((match, i) => {
      console.log(`${i + 1}. ${match.substring(0, 100)}...`);
    });
  }

  // Check for video links
  const videoMatches = post.content.match(/https:\/\/share\.descript\.com\/view\/\w+/g);
  console.log(`\n🎥 Found ${videoMatches?.length || 0} Descript video links\n`);

  if (videoMatches) {
    videoMatches.forEach((match, i) => {
      console.log(`${i + 1}. ${match}`);
    });
  }

  // Show a snippet around the first photo
  if (photoMatches && photoMatches.length > 0) {
    const firstPhotoIndex = post.content.indexOf(photoMatches[0]);
    const snippet = post.content.substring(Math.max(0, firstPhotoIndex - 100), firstPhotoIndex + 200);
    console.log(`\nContext around first photo:\n${snippet}\n`);
  }

  // Show a snippet around the first video
  if (videoMatches && videoMatches.length > 0) {
    const firstVideoIndex = post.content.indexOf(videoMatches[0]);
    const snippet = post.content.substring(Math.max(0, firstVideoIndex - 100), firstVideoIndex + 300);
    console.log(`\nContext around first video:\n${snippet}\n`);
  }
}

checkBlogContent();
