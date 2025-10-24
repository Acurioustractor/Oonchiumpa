import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LAW_STUDENTS_GALLERY_ID = '92a1acc3-1ce1-44ce-9773-8f7e78268f4c';

async function debugGalleryPhotos() {
  console.log('🔍 Debugging gallery_photos table...\n');

  // Check total photos in gallery_photos table
  const { data: allPhotos, error: allError } = await supabase
    .from('gallery_photos')
    .select('*')
    .limit(5);

  console.log('Sample from gallery_photos table:');
  if (allError) {
    console.error('❌ Error:', allError);
  } else {
    console.log(`Found ${allPhotos?.length || 0} sample photos`);
    if (allPhotos && allPhotos.length > 0) {
      console.log('\nFirst photo structure:');
      console.log(JSON.stringify(allPhotos[0], null, 2));
    }
  }

  // Check the actual gallery record
  console.log('\n\n🔍 Checking Law Students gallery record...\n');
  const { data: gallery, error: galleryError } = await supabase
    .from('photo_galleries')
    .select('*')
    .eq('id', LAW_STUDENTS_GALLERY_ID)
    .single();

  if (galleryError) {
    console.error('❌ Error:', galleryError);
  } else {
    console.log('Gallery details:');
    console.log(JSON.stringify(gallery, null, 2));
  }

  // Try querying photos differently
  console.log('\n\n🔍 Trying different query approaches...\n');

  // Approach 1: By gallery_id
  const { count: countById } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact', head: true })
    .eq('gallery_id', LAW_STUDENTS_GALLERY_ID);

  console.log(`Photos with gallery_id = ${LAW_STUDENTS_GALLERY_ID}: ${countById || 0}`);

  // Approach 2: Check if there's a different ID field
  const { data: sample } = await supabase
    .from('gallery_photos')
    .select('*')
    .limit(1);

  if (sample && sample.length > 0) {
    console.log('\nAvailable fields in gallery_photos:');
    console.log(Object.keys(sample[0]));
  }
}

debugGalleryPhotos();
