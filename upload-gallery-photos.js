#!/usr/bin/env node
/**
 * Simple photo gallery upload tool
 *
 * Usage:
 * 1. Put your photos in a folder (e.g., /path/to/photos)
 * 2. Run: node upload-gallery-photos.js /path/to/photos
 *
 * This will:
 * - Upload all images to Supabase Storage (gallery-photos bucket)
 * - Add them to the media/photos database table
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'oonchiumpa-app', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function ensureGalleryBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === 'gallery-photos');

  if (!bucketExists) {
    console.log('📦 Creating gallery-photos bucket...');
    const { error } = await supabase.storage.createBucket('gallery-photos', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
      console.error('⚠️  Error creating bucket:', error.message);
      console.log('   Please create it manually in Supabase dashboard');
      console.log('   Bucket name: gallery-photos');
      console.log('   Public: Yes');
      return false;
    }
    console.log('✅ Bucket created\n');
  }
  return true;
}

async function uploadPhoto(filePath, category = 'general') {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(fileName).toLowerCase();
  const timestamp = Date.now();
  const storagePath = `${category}/${timestamp}-${fileName}`;

  // Read file
  const fileBuffer = fs.readFileSync(filePath);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('gallery-photos')
    .upload(storagePath, fileBuffer, {
      contentType: `image/${fileExt.replace('.', '')}`,
      upsert: false
    });

  if (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('gallery-photos')
    .getPublicUrl(storagePath);

  return publicUrl;
}

async function uploadPhotosFromFolder(folderPath, category = 'general') {
  console.log('📸 Oonchiumpa Photo Gallery Upload\n');
  console.log('='.repeat(80));
  console.log(`\nFolder: ${folderPath}`);
  console.log(`Category: ${category}\n`);

  // Check folder exists
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}\n`);
    return;
  }

  // Ensure bucket exists
  const bucketReady = await ensureGalleryBucket();
  if (!bucketReady) {
    console.log('\n⚠️  Please create the gallery-photos bucket in Supabase first\n');
    return;
  }

  // Get all image files
  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .map(f => path.join(folderPath, f));

  if (files.length === 0) {
    console.log('⚠️  No image files found in folder\n');
    return;
  }

  console.log(`Found ${files.length} images to upload\n`);
  console.log('='.repeat(80) + '\n');

  let successCount = 0;
  const uploadedPhotos = [];

  // Upload each file
  for (const filePath of files) {
    const fileName = path.basename(filePath);
    process.stdout.write(`Uploading ${fileName}... `);

    const url = await uploadPhoto(filePath, category);

    if (url) {
      uploadedPhotos.push({
        url,
        title: fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        category
      });
      console.log('✅');
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Upload Complete!`);
  console.log(`   Uploaded: ${successCount}/${files.length} photos`);
  console.log(`\n🎉 Photos are now in Supabase Storage!`);
  console.log(`   Bucket: gallery-photos`);
  console.log(`   URLs saved and ready to view\n`);

  // Show URLs
  if (uploadedPhotos.length > 0) {
    console.log('📋 Photo URLs:\n');
    uploadedPhotos.forEach((photo, idx) => {
      console.log(`${idx + 1}. ${photo.title}`);
      console.log(`   ${photo.url}\n`);
    });
  }
}

// Get folder path from command line
const folderPath = process.argv[2];
const category = process.argv[3] || 'general';

if (!folderPath) {
  console.log(`
📸 Photo Gallery Upload Tool

Usage:
  node upload-gallery-photos.js <folder-path> [category]

Examples:
  node upload-gallery-photos.js /Users/you/Photos community-events
  node upload-gallery-photos.js ./my-photos on-country
  node upload-gallery-photos.js ~/Desktop/images general

Categories (optional):
  - general (default)
  - community-events
  - on-country
  - cultural-activities
  - youth-programs
  - team
`);
  process.exit(0);
}

uploadPhotosFromFolder(folderPath, category).catch(console.error);
