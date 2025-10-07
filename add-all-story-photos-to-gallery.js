import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function addStoryPhotosToGallery() {
  console.log('📸 Adding All Story Photos to Gallery\n');
  console.log('='.repeat(80));

  // Get all stories with photos
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, media_urls, story_image_url')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .not('media_urls', 'is', null);

  if (error) {
    console.error('Error fetching stories:', error);
    process.exit(1);
  }

  console.log(`\nFound ${stories.length} stories with photos\n`);

  let totalPhotos = 0;
  let addedPhotos = 0;

  for (const story of stories) {
    const photos = story.media_urls || [];
    
    if (photos.length === 0) continue;

    console.log(`\n📖 "${story.title}"`);
    console.log(`   Adding ${photos.length} photos...`);

    for (let i = 0; i < photos.length; i++) {
      const photoUrl = photos[i];
      totalPhotos++;

      // Check if photo already exists in gallery
      const { data: existing } = await supabase
        .from('gallery_media')
        .select('id')
        .eq('url', photoUrl)
        .single();

      if (existing) {
        console.log(`   ⏭️  Photo ${i + 1} already in gallery`);
        continue;
      }

      // Add to gallery
      const { error: insertError } = await supabase
        .from('gallery_media')
        .insert({
          tenant_id: OONCHIUMPA_TENANT_ID,
          title: `${story.title} - Photo ${i + 1}`,
          url: photoUrl,
          media_type: 'photo',
          category: 'story-photos',
          display_order: addedPhotos
        });

      if (insertError) {
        console.error(`   ❌ Error adding photo ${i + 1}:`, insertError.message);
      } else {
        addedPhotos++;
        console.log(`   ✅ Added photo ${i + 1}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Summary:`);
  console.log(`   Total story photos: ${totalPhotos}`);
  console.log(`   Added to gallery: ${addedPhotos}`);
  console.log(`   Already in gallery: ${totalPhotos - addedPhotos}`);
}

addStoryPhotosToGallery().catch(console.error);
