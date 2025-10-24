import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function searchLawStudentMedia() {
  console.log('🔍 Searching for law student media in storage...\n');

  // List all files in story-images bucket
  const { data: files, error } = await supabase
    .storage
    .from('story-images')
    .list('', {
      limit: 1000,
      offset: 0,
    });

  if (error) {
    console.error('❌ Storage error:', error);
    return;
  }

  console.log(`Found ${files?.length || 0} items in story-images\n`);

  // Look for files/folders with "law", "justice", "student", "kristy" in name
  const lawRelated = files?.filter(f =>
    f.name.toLowerCase().includes('law') ||
    f.name.toLowerCase().includes('justice') ||
    f.name.toLowerCase().includes('student') ||
    f.name.toLowerCase().includes('kristy') ||
    f.name.toLowerCase().includes('anu')
  );

  if (lawRelated && lawRelated.length > 0) {
    console.log('📁 Law/Justice related items:');
    lawRelated.forEach(item => {
      console.log(`   - ${item.name} (${item.id})`);
      if (item.id) {
        console.log(`     URL: https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/${item.name}`);
      }
    });
  }

  // Also check the media bucket
  console.log('\n🔍 Checking media bucket...\n');

  const { data: mediaFiles } = await supabase
    .storage
    .from('media')
    .list('', {
      limit: 1000,
      offset: 0,
    });

  const mediaLawRelated = mediaFiles?.filter(f =>
    f.name.toLowerCase().includes('law') ||
    f.name.toLowerCase().includes('justice') ||
    f.name.toLowerCase().includes('student') ||
    f.name.toLowerCase().includes('kristy') ||
    f.name.toLowerCase().includes('anu')
  );

  if (mediaLawRelated && mediaLawRelated.length > 0) {
    console.log('📁 Law/Justice related items in media:');
    mediaLawRelated.forEach(item => {
      console.log(`   - ${item.name}`);
      console.log(`     URL: https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${item.name}`);
    });
  } else {
    console.log('No law-related media found in media bucket');
  }

  // Search for existing blog post with law students to see if it has photos
  console.log('\n📖 Checking "Learning Law from the Land" blog post...\n');

  const { data: lawBlog } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', '645a7f48-79b5-4712-92aa-e0217e6cfaf2')
    .single();

  if (lawBlog) {
    console.log(`Title: ${lawBlog.title}`);
    console.log(`Hero Image: ${lawBlog.hero_image}`);
    console.log(`Gallery: ${JSON.stringify(lawBlog.gallery)}`);

    if (lawBlog.gallery && lawBlog.gallery.length > 0) {
      console.log('\nFetching gallery story images...');
      for (const storyId of lawBlog.gallery) {
        // Check if these are story IDs
        const { data: story } = await supabase
          .from('stories')
          .select('id, title, story_image_url, media_urls, video_embed_code')
          .eq('id', storyId)
          .single();

        if (story) {
          console.log(`\n  Story: ${story.title}`);
          console.log(`  Image: ${story.story_image_url}`);
          console.log(`  Video: ${story.video_embed_code ? 'Yes' : 'No'}`);
          if (story.video_embed_code) {
            console.log(`  Video embed: ${story.video_embed_code.substring(0, 100)}...`);
          }
        }
      }
    }
  }
}

searchLawStudentMedia();
