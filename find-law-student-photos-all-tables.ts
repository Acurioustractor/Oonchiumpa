import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LAW_STUDENTS_GALLERY_ID = '92a1acc3-1ce1-44ce-9773-8f7e78268f4c';
const LAW_STUDENTS_PROJECT_ID = '1bfcbf56-4a36-42a1-b819-e0dab7749597';

async function searchAllTables() {
  console.log('🔍 Searching ALL possible tables for law student photos...\n');

  // Try different table names and query patterns
  const attempts = [
    { table: 'gallery_photos', filter: { gallery_id: LAW_STUDENTS_GALLERY_ID } },
    { table: 'photos', filter: { gallery_id: LAW_STUDENTS_GALLERY_ID } },
    { table: 'media', filter: { gallery_id: LAW_STUDENTS_GALLERY_ID } },
    { table: 'gallery_media', filter: { category: 'law-students' } },
    { table: 'project_media', filter: { project_id: LAW_STUDENTS_PROJECT_ID } },
    { table: 'project_photos', filter: { project_id: LAW_STUDENTS_PROJECT_ID } },
  ];

  for (const attempt of attempts) {
    console.log(`\nTrying: ${attempt.table} with filter ${JSON.stringify(attempt.filter)}`);

    try {
      const { data, error, count } = await supabase
        .from(attempt.table)
        .select('*', { count: 'exact' })
        .match(attempt.filter)
        .limit(5);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Success! Found ${count || 0} records`);
        if (data && data.length > 0) {
          console.log(`   Sample record:`);
          console.log(JSON.stringify(data[0], null, 2));
        }
      }
    } catch (e: any) {
      console.log(`   ❌ Exception: ${e.message}`);
    }
  }

  // Try to list ALL photos and search manually
  console.log(`\n\nSearching gallery_photos for ANY photos...`);
  const { data: allPhotos, count: totalPhotos } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact' })
    .limit(10);

  console.log(`Total photos in gallery_photos table: ${totalPhotos}`);
  if (allPhotos && allPhotos.length > 0) {
    console.log(`\nSample photos:`);
    allPhotos.forEach((photo, i) => {
      console.log(`${i + 1}. Gallery ID: ${photo.gallery_id}`);
      console.log(`   Caption: ${photo.caption || 'none'}`);
    });
  }

  // Check the actual schema of photo_galleries to see if there's a reference we're missing
  console.log(`\n\nChecking photo_galleries table structure...`);
  const { data: galleries } = await supabase
    .from('photo_galleries')
    .select('*')
    .limit(1);

  if (galleries && galleries.length > 0) {
    console.log(`Available fields in photo_galleries:`);
    console.log(Object.keys(galleries[0]));
  }
}

searchAllTables();
