/**
 * Script to tag law student photos in the gallery_media table
 *
 * This allows you to categorize existing photos as law student-related
 * so they can be easily filtered and used in the law students blog post.
 *
 * Usage:
 * 1. Look at the list of photos in list-all-gallery-photos.ts output
 * 2. Identify which photos are from the law students trip
 * 3. Add their IDs to the LAW_STUDENT_PHOTO_IDS array below
 * 4. Run: VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx tag-law-student-photos.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ADD THE IDS OF LAW STUDENT PHOTOS HERE
// To find the IDs, run: npx tsx list-all-gallery-photos.ts
const LAW_STUDENT_PHOTO_IDS = [
  // Example:
  // 'e631f22d-fd12-406e-a5a8-4c6a5f762aee',  // IMG_2994
  // 'adf68cf5-8dfa-4ac0-a946-c545717fdd57',  // IMG_3014
  // Add more photo IDs here...
];

async function tagLawStudentPhotos() {
  console.log('🏷️  Tagging law student photos...\n');

  if (LAW_STUDENT_PHOTO_IDS.length === 0) {
    console.log('⚠️  No photo IDs specified!');
    console.log('Please add photo IDs to the LAW_STUDENT_PHOTO_IDS array in this script.');
    console.log('\nTo find photo IDs, run:');
    console.log('VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npx tsx list-all-gallery-photos.ts\n');
    return;
  }

  console.log(`Tagging ${LAW_STUDENT_PHOTO_IDS.length} photos as "law-students"...\n`);

  for (const photoId of LAW_STUDENT_PHOTO_IDS) {
    try {
      // First, get the current photo details
      const { data: photo, error: fetchError } = await supabase
        .from('gallery_media')
        .select('*')
        .eq('id', photoId)
        .single();

      if (fetchError || !photo) {
        console.log(`❌ Photo ${photoId} not found`);
        continue;
      }

      // Update the category to "law-students"
      const { error: updateError } = await supabase
        .from('gallery_media')
        .update({
          category: 'law-students',
          // Optionally update the title if it doesn't have one
          title: photo.title?.startsWith('IMG_')
            ? `Law Students at Atnarpa - ${photo.title}`
            : photo.title
        })
        .eq('id', photoId);

      if (updateError) {
        console.log(`❌ Error updating ${photo.title}: ${updateError.message}`);
      } else {
        console.log(`✅ Tagged: ${photo.title || photoId}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error with photo ${photoId}:`, error);
    }
  }

  console.log('\n📊 Checking results...');

  const { data: lawStudentPhotos, error } = await supabase
    .from('gallery_media')
    .select('*')
    .eq('category', 'law-students')
    .order('created_at', { ascending: false });

  if (!error && lawStudentPhotos) {
    console.log(`\n✅ Total law student photos: ${lawStudentPhotos.length}`);
    lawStudentPhotos.forEach((photo, i) => {
      console.log(`   ${i + 1}. ${photo.title}`);
    });
  }
}

// Run the script
tagLawStudentPhotos()
  .then(() => {
    console.log('\n✨ Tagging complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
