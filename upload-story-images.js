#!/usr/bin/env node
/**
 * Upload extracted images to Supabase Storage and link to stories
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
const IMAGES_DIR = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/extracted-images';

// Map folder names to story titles in database
const STORY_MAPPINGS = {
  'Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023': 'Young People Experience Hospitality and Skills Learning at McDonald\'s',
  'Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024': 'Girls Day Out: Cultural Empowerment at Standley Chasm',
  'Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm': 'Young Fellas Experience Cultural Connection at Standley Chasm',
  'Oochiumpa Good News Stories - Basketball Game': 'Young Women Discover Basketball Community Through Stadium Experience',
  'Oochiumpa Good News Stories - Atnarpa Station Trip': 'Healing Journey to Country: Young Men Find Connection at Atnarpa Station',
  'Atnarpa Homestead and Campgroup': 'Returning Home to Atnarpa: The Bloomfield Family\'s Journey to Reclaim Loves Creek Station'
};

async function uploadImageToSupabase(filePath, storyId, imageIndex) {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(fileName);
  const storagePath = `stories/${storyId}/${imageIndex}${fileExt}`;

  // Read file
  const fileBuffer = fs.readFileSync(filePath);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('story-images')
    .upload(storagePath, fileBuffer, {
      contentType: `image/${fileExt.replace('.', '')}`,
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('story-images')
    .getPublicUrl(storagePath);

  return publicUrl;
}

async function getStoryByTitle(title) {
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, media_metadata')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('title', title)
    .single();

  if (error) {
    console.error(`Error finding story "${title}":`, error.message);
    return null;
  }

  return data;
}

async function updateStoryImages(storyId, imageUrls) {
  const { error } = await supabase
    .from('stories')
    .update({
      story_image_url: imageUrls[0], // First image as hero
      media_urls: imageUrls
    })
    .eq('id', storyId);

  if (error) {
    console.error(`Error updating story ${storyId}:`, error.message);
    return false;
  }

  return true;
}

async function main() {
  console.log('🎨 Oonchiumpa Image Upload to Supabase\n');
  console.log('='.repeat(80));

  // First, create the storage bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === 'story-images');

  if (!bucketExists) {
    console.log('\n📦 Creating story-images bucket...');
    const { error } = await supabase.storage.createBucket('story-images', {
      public: true,
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating bucket:', error.message);
      console.log('You may need to create it manually in Supabase dashboard');
    } else {
      console.log('✅ Bucket created successfully');
    }
  }

  let totalUploaded = 0;
  let totalStories = 0;

  // Process each story folder
  for (const [folderName, storyTitle] of Object.entries(STORY_MAPPINGS)) {
    const folderPath = path.join(IMAGES_DIR, folderName, 'media');

    if (!fs.existsSync(folderPath)) {
      console.log(`\n⚠️  Folder not found: ${folderName}`);
      continue;
    }

    console.log(`\n📸 Processing: ${storyTitle}`);
    console.log('-'.repeat(80));

    // Get story from database
    const story = await getStoryByTitle(storyTitle);
    if (!story) {
      console.log(`   ❌ Story not found in database`);
      continue;
    }

    // Get all image files
    const imageFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
      .sort();

    console.log(`   Found ${imageFiles.length} images`);

    const uploadedUrls = [];

    // Upload each image
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = path.join(folderPath, imageFiles[i]);
      const url = await uploadImageToSupabase(imagePath, story.id, i + 1);

      if (url) {
        uploadedUrls.push(url);
        console.log(`   ✅ Uploaded image ${i + 1}: ${path.basename(imagePath)}`);
        totalUploaded++;
      }
    }

    // Update story with image URLs
    if (uploadedUrls.length > 0) {
      const success = await updateStoryImages(story.id, uploadedUrls);
      if (success) {
        console.log(`   ✅ Linked ${uploadedUrls.length} images to story`);
        totalStories++;
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Upload Complete!`);
  console.log(`   Total images uploaded: ${totalUploaded}`);
  console.log(`   Stories updated: ${totalStories}`);
  console.log(`\n🎉 Images are now live on the website!\n`);
}

main().catch(console.error);
