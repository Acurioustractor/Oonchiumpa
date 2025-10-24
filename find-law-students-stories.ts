import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function findLawStudentsStories() {
  console.log('🔍 Searching for law students related content...\n');

  // Search for stories with law, justice, or ANU in title
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, media_urls, video_embed_code, service_id, themes, story_type')
    .or('title.ilike.%law%,title.ilike.%justice%,title.ilike.%ANU%,title.ilike.%legal%,title.ilike.%student%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${stories?.length || 0} stories:\n`);

  for (const story of stories || []) {
    console.log(`\n📖 ${story.title}`);
    console.log(`   ID: ${story.id}`);
    console.log(`   Type: ${story.story_type}`);
    console.log(`   Themes: ${story.themes?.join(', ')}`);
    console.log(`   Service ID: ${story.service_id}`);
    console.log(`   Has video: ${!!story.video_embed_code}`);
    console.log(`   Media URLs: ${story.media_urls?.length || 0}`);

    if (story.video_embed_code) {
      console.log(`   Video embed: ${story.video_embed_code.substring(0, 100)}...`);
    }

    if (story.media_urls && story.media_urls.length > 0) {
      story.media_urls.forEach((url: string, i: number) => {
        console.log(`   ${i + 1}. ${url}`);
      });
    }
  }

  // Also check for photos with law student or True Justice tags
  console.log('\n\n🖼️  Checking for law student photos in photo galleries...\n');

  const { data: galleries } = await supabase
    .from('photo_galleries')
    .select('id, title, description, service_id')
    .or('title.ilike.%law%,title.ilike.%justice%,title.ilike.%legal%,title.ilike.%student%');

  if (galleries && galleries.length > 0) {
    console.log(`Found ${galleries.length} related photo galleries:`);

    for (const gallery of galleries) {
      console.log(`\n📁 ${gallery.title}`);
      console.log(`   ID: ${gallery.id}`);
      console.log(`   Description: ${gallery.description}`);
      console.log(`   Service ID: ${gallery.service_id}`);

      // Get photos from this gallery
      const { data: photos } = await supabase
        .from('photos')
        .select('id, url, caption, alt_text')
        .eq('gallery_id', gallery.id);

      if (photos && photos.length > 0) {
        console.log(`   Photos: ${photos.length}`);
        photos.slice(0, 5).forEach((photo, i) => {
          console.log(`   ${i + 1}. ${photo.url}`);
          if (photo.caption) console.log(`      Caption: ${photo.caption}`);
        });
        if (photos.length > 5) {
          console.log(`   ... and ${photos.length - 5} more`);
        }
      }
    }
  }
}

findLawStudentsStories();
