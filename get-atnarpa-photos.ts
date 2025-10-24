import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getAtnarpaPhotos() {
  console.log('🏡 Fetching Atnarpa Homestead photos...\n');

  // Get stories with Atnarpa photos
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, media_urls')
    .or('title.ilike.%atnarpa%,title.ilike.%loves creek%,content.ilike.%atnarpa%')
    .not('media_urls', 'is', null);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Found ${stories?.length || 0} stories with Atnarpa photos\n`);

  let allPhotos: string[] = [];

  if (stories) {
    stories.forEach((story) => {
      console.log(`📖 ${story.title}`);
      console.log(`   Photos: ${story.media_urls?.length || 0}`);

      if (story.media_urls && story.media_urls.length > 0) {
        allPhotos = allPhotos.concat(story.media_urls);

        // Show first 5 photos from this story
        story.media_urls.slice(0, 5).forEach((url: string, i: number) => {
          console.log(`   ${i + 1}. ${url}`);
        });

        if (story.media_urls.length > 5) {
          console.log(`   ... and ${story.media_urls.length - 5} more`);
        }
      }
      console.log('');
    });
  }

  console.log('\n📊 Summary:');
  console.log(`   Total Atnarpa photos available: ${allPhotos.length}`);
  console.log('\n💡 Photo URLs for ServiceDetailPage.tsx:\n');

  // Format for easy copy-paste into code
  console.log('galleryPhotos: [');
  allPhotos.slice(0, 12).forEach((url) => {
    console.log(`  '${url}',`);
  });
  console.log(']');

  if (allPhotos.length > 12) {
    console.log(`\n(Showing first 12 of ${allPhotos.length} photos)`);
  }
}

getAtnarpaPhotos().catch(console.error);
