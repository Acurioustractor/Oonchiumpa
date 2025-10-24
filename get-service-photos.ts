import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Known gallery IDs
const GALLERIES = {
  LAW_STUDENTS: '92a1acc3-1ce1-44ce-9773-8f7e78268f4c',
  DEADLY_HEARTS: '1a4344c7-94a9-4b34-918c-62c4b25b6824',
  TRADITIONAL_HEALING: '1a4344c7-94a9-4b34-918c-62c4b25b6823'
};

async function getServicePhotos() {
  console.log('🔍 Fetching photos for services...\n');

  // Law Students Program
  console.log('📚 Law Students Program Photos:');
  const { data: lawStudentPhotos } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('gallery_id', GALLERIES.LAW_STUDENTS)
    .limit(10);

  console.log(`   Found ${lawStudentPhotos?.length || 0} photos`);
  if (lawStudentPhotos && lawStudentPhotos.length > 0) {
    lawStudentPhotos.forEach((photo, i) => {
      console.log(`   ${i + 1}. ${photo.caption || 'Untitled'}`);
      console.log(`      URL: ${photo.photo_url}`);
    });
  }
  console.log('');

  // Youth Mentorship (might be in Deadly Hearts gallery)
  console.log('💚 Youth Mentorship Photos (Deadly Hearts Trek):');
  const { data: youthPhotos } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('gallery_id', GALLERIES.DEADLY_HEARTS)
    .limit(10);

  console.log(`   Found ${youthPhotos?.length || 0} photos`);
  if (youthPhotos && youthPhotos.length > 0) {
    youthPhotos.forEach((photo, i) => {
      console.log(`   ${i + 1}. ${photo.caption || 'Untitled'}`);
      console.log(`      URL: ${photo.photo_url}`);
    });
  }
  console.log('');

  // Check for Atnarpa Homestead photos via tags or search
  console.log('🏡 Searching for Atnarpa Homestead photos...');

  // Try searching stories for Atnarpa with media
  const { data: atnarpaStories } = await supabase
    .from('stories')
    .select('id, title, media_urls')
    .ilike('title', '%atnarpa%')
    .not('media_urls', 'is', null);

  console.log(`   Found ${atnarpaStories?.length || 0} stories with Atnarpa photos`);
  if (atnarpaStories && atnarpaStories.length > 0) {
    atnarpaStories.forEach((story) => {
      console.log(`   Story: ${story.title}`);
      console.log(`   Photos: ${story.media_urls?.length || 0}`);
      if (story.media_urls && story.media_urls.length > 0) {
        story.media_urls.slice(0, 3).forEach((url: string, i: number) => {
          console.log(`      ${i + 1}. ${url}`);
        });
      }
    });
  }
  console.log('');

  // Search for Loves Creek photos
  console.log('🌾 Searching for Loves Creek photos...');
  const { data: lovesCreekStories } = await supabase
    .from('stories')
    .select('id, title, media_urls')
    .or('title.ilike.%loves creek%,content.ilike.%loves creek%')
    .not('media_urls', 'is', null);

  console.log(`   Found ${lovesCreekStories?.length || 0} stories with Loves Creek photos`);
  if (lovesCreekStories && lovesCreekStories.length > 0) {
    lovesCreekStories.forEach((story) => {
      console.log(`   Story: ${story.title}`);
      console.log(`   Photos: ${story.media_urls?.length || 0}`);
    });
  }
  console.log('');

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Law Students photos: ${lawStudentPhotos?.length || 0}`);
  console.log(`   Youth/Deadly Hearts photos: ${youthPhotos?.length || 0}`);
  console.log(`   Atnarpa stories with media: ${atnarpaStories?.length || 0}`);
  console.log(`   Loves Creek stories with media: ${lovesCreekStories?.length || 0}`);
}

getServicePhotos().catch(console.error);
