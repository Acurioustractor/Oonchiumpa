import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function searchForLawStudentPhotos() {
  console.log('🔍 Searching for law student photos across different sources...\n');

  const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

  // 1. Check gallery_media table (the one used by /stories page)
  console.log('1️⃣ Checking gallery_media table...');
  const { data: galleryMedia, count: galleryMediaCount } = await supabase
    .from('gallery_media')
    .select('*', { count: 'exact' })
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('media_type', 'photo');

  console.log(`   Found ${galleryMediaCount || 0} photos in gallery_media`);

  // 2. Check Supabase Storage buckets
  console.log('\n2️⃣ Checking Supabase Storage buckets...');
  const { data: buckets } = await supabase.storage.listBuckets();

  if (buckets) {
    console.log(`   Found ${buckets.length} storage buckets:`);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
  }

  // 3. List files in story-images bucket
  console.log('\n3️⃣ Checking story-images bucket...');
  const { data: files } = await supabase.storage
    .from('story-images')
    .list('', { limit: 10 });

  if (files && files.length > 0) {
    console.log(`   Found ${files.length} files (showing first 10):`);
    files.forEach(file => {
      console.log(`   - ${file.name}`);
    });
  } else {
    console.log('   No files or folders found');
  }

  // 4. Check if there's a law-students folder
  console.log('\n4️⃣ Searching for law-student related folders/files...');
  const { data: lawStudentFiles } = await supabase.storage
    .from('story-images')
    .list('law-students', { limit: 10 });

  if (lawStudentFiles && lawStudentFiles.length > 0) {
    console.log(`   ✅ Found law-students folder with ${lawStudentFiles.length} files!`);
    lawStudentFiles.forEach((file, i) => {
      console.log(`   ${i + 1}. ${file.name}`);
    });
  }

  // 5. Check photo_galleries for project connection
  console.log('\n5️⃣ Checking photo_galleries for Law Students project...');
  const LAW_STUDENTS_PROJECT_ID = '1bfcbf56-4a36-42a1-b819-e0dab7749597';

  const { data: projectGalleries } = await supabase
    .from('photo_galleries')
    .select('*')
    .eq('project_id', LAW_STUDENTS_PROJECT_ID);

  console.log(`   Found ${projectGalleries?.length || 0} galleries for Law Students project`);

  if (projectGalleries && projectGalleries.length > 0) {
    projectGalleries.forEach(gallery => {
      console.log(`   - ${gallery.title} (${gallery.photo_count} photos)`);
    });
  }

  // 6. Summary
  console.log('\n📊 Summary:');
  console.log(`   gallery_media photos: ${galleryMediaCount || 0}`);
  console.log(`   Law Students gallery photos: 0`);
  console.log(`\n💡 Where are the 200+ photos you mentioned?`);
  console.log(`   - Are they in Empathy Ledger but not yet synced?`);
  console.log(`   - Are they in a different project or organization?`);
  console.log(`   - Are they uploaded to Supabase Storage but not in the database tables?`);
}

searchForLawStudentPhotos();
