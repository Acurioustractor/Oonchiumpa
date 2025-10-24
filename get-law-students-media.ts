import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getLawStudentsMedia() {
  console.log('🔍 Searching for law students photos and videos...\n');

  // Search for stories with law student tags
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, tags, media_urls, photo_gallery_id')
    .or('tags.cs.{"Law Students"},tags.cs.{"True Justice"},tags.cs.{"ANU"}');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${stories?.length || 0} stories with law student content:\n`);

  for (const story of stories || []) {
    console.log(`\n📖 Story: ${story.title}`);
    console.log(`   ID: ${story.id}`);
    console.log(`   Tags: ${story.tags?.join(', ')}`);
    console.log(`   Media URLs: ${story.media_urls?.length || 0} items`);

    if (story.media_urls && story.media_urls.length > 0) {
      story.media_urls.forEach((url: string, i: number) => {
        console.log(`   ${i + 1}. ${url}`);
      });
    }

    if (story.photo_gallery_id) {
      console.log(`   Photo Gallery ID: ${story.photo_gallery_id}`);

      // Get photos from gallery
      const { data: photos } = await supabase
        .from('photos')
        .select('id, url, caption')
        .eq('gallery_id', story.photo_gallery_id);

      if (photos && photos.length > 0) {
        console.log(`   Gallery has ${photos.length} photos`);
        photos.forEach((photo, i) => {
          console.log(`   Photo ${i + 1}: ${photo.url}`);
          if (photo.caption) console.log(`      Caption: ${photo.caption}`);
        });
      }
    }
  }

  // Also check for photos tagged with law students
  console.log('\n\n🖼️  Checking for photos tagged with law students...\n');

  const { data: taggedPhotos } = await supabase
    .from('photos')
    .select('id, url, caption, tags')
    .or('tags.cs.{"Law Students"},tags.cs.{"True Justice"},tags.cs.{"ANU"}');

  if (taggedPhotos && taggedPhotos.length > 0) {
    console.log(`Found ${taggedPhotos.length} tagged photos:`);
    taggedPhotos.forEach((photo, i) => {
      console.log(`\n${i + 1}. ${photo.url}`);
      console.log(`   Tags: ${photo.tags?.join(', ')}`);
      if (photo.caption) console.log(`   Caption: ${photo.caption}`);
    });
  }
}

getLawStudentsMedia();
