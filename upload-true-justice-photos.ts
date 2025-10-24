import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRUE_JUSTICE_GALLERY_ID = '92a1acc3-1ce1-44ce-9773-8f7e78268f4c';

/**
 * Upload photos to the True Justice gallery
 *
 * Usage:
 * 1. Place photos in a folder (e.g., ./true-justice-photos/)
 * 2. Run: VITE_SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx upload-true-justice-photos.ts ./true-justice-photos/
 */

async function uploadTrueJusticePhotos(photosDir: string) {
  console.log('📚 Uploading photos to True Justice gallery...\n');

  // Check if directory exists
  if (!fs.existsSync(photosDir)) {
    console.error(`❌ Directory not found: ${photosDir}`);
    console.log('\nUsage: npx tsx upload-true-justice-photos.ts <photos-directory>');
    console.log('Example: npx tsx upload-true-justice-photos.ts ./true-justice-photos/');
    return;
  }

  // Get all image files from directory
  const files = fs.readdirSync(photosDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.log('❌ No image files found in directory');
    return;
  }

  console.log(`✅ Found ${files.length} photos to upload\n`);

  let uploadedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(photosDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `true-justice-${Date.now()}-${file}`;

    console.log(`📤 Uploading: ${file}...`);

    try {
      // Upload to storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('media')
        .upload(`gallery-photos/${TRUE_JUSTICE_GALLERY_ID}/${fileName}`, fileBuffer, {
          contentType: `image/${path.extname(file).slice(1)}`,
          upsert: false
        });

      if (storageError) throw storageError;

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('media')
        .getPublicUrl(`gallery-photos/${TRUE_JUSTICE_GALLERY_ID}/${fileName}`);

      // Add to gallery_photos table
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .insert({
          gallery_id: TRUE_JUSTICE_GALLERY_ID,
          photo_url: urlData.publicUrl,
          caption: `True Justice Program - ${file}`,
          photographer: 'Oonchiumpa',
          order_index: uploadedCount
        });

      if (dbError) throw dbError;

      console.log(`   ✅ Uploaded successfully`);
      uploadedCount++;

    } catch (error) {
      console.error(`   ❌ Error uploading ${file}:`, error);
      errorCount++;
    }

    console.log('');
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Successfully uploaded: ${uploadedCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📚 Gallery: True Justice (ID: ${TRUE_JUSTICE_GALLERY_ID})`);
  console.log('\n✨ Photos will now appear in the True Justice service detail page!');
}

// Get directory from command line args
const photosDir = process.argv[2];

if (!photosDir) {
  console.log('❌ Please provide a directory path');
  console.log('\nUsage: npx tsx upload-true-justice-photos.ts <photos-directory>');
  console.log('Example: npx tsx upload-true-justice-photos.ts ./true-justice-photos/');
  process.exit(1);
}

uploadTrueJusticePhotos(photosDir).catch(console.error);
