import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LAW_STUDENTS_GALLERY_ID = '92a1acc3-1ce1-44ce-9773-8f7e78268f4c';

async function listLawStudentPhotos() {
  console.log('📸 Fetching Law Students Event 2025 gallery photos...\n');

  const { data: photos, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('gallery_id', LAW_STUDENTS_GALLERY_ID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Found ${photos?.length || 0} photos in Law Students gallery\n`);

  if (photos && photos.length > 0) {
    // Show first 20 photos
    const displayCount = Math.min(20, photos.length);
    console.log(`Showing first ${displayCount} photos:\n`);

    photos.slice(0, displayCount).forEach((photo, i) => {
      console.log(`${i + 1}. ${photo.caption || 'No caption'}`);
      console.log(`   ID: ${photo.id}`);
      console.log(`   Photographer: ${photo.photographer || 'Unknown'}`);
      console.log(`   Taken: ${photo.photo_date || 'Unknown date'}`);
      console.log(`   URL: ${photo.photo_url}`);
      console.log('');
    });

    if (photos.length > displayCount) {
      console.log(`... and ${photos.length - displayCount} more photos\n`);
    }

    // Show some stats
    console.log('\n📊 Gallery Statistics:');
    console.log(`   Total photos: ${photos.length}`);

    const withCaptions = photos.filter(p => p.caption).length;
    console.log(`   Photos with captions: ${withCaptions}`);

    const photographers = [...new Set(photos.map(p => p.photographer).filter(Boolean))];
    console.log(`   Photographers: ${photographers.length > 0 ? photographers.join(', ') : 'None specified'}`);
  }
}

listLawStudentPhotos();
