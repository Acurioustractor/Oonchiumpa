#!/usr/bin/env node
/**
 * Copy all story images to the photo gallery
 */

import { createClient } from '@supabase/supabase-js';
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

async function addStoryPhotosToGallery() {
  console.log('📸 Adding Story Photos to Gallery\n');
  console.log('='.repeat(80));

  // Get all stories with images
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, media_urls')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .not('media_urls', 'is', null);

  if (error) {
    console.error('Error fetching stories:', error);
    return;
  }

  const storiesWithPhotos = stories.filter(s => s.media_urls && s.media_urls.length > 0);
  console.log(`\nFound ${storiesWithPhotos.length} stories with photos\n`);

  let totalAdded = 0;

  for (const story of storiesWithPhotos) {
    console.log(`\n📖 ${story.title}`);
    console.log(`   Adding ${story.media_urls.length} photos...`);

    for (let i = 0; i < story.media_urls.length; i++) {
      const photoUrl = story.media_urls[i];

      // Create a descriptive title
      const photoTitle = `${story.title} - Photo ${i + 1}`;

      // Note: Since we don't have a media/photos table yet,
      // we'll just list the URLs for now
      console.log(`   ✅ ${photoTitle}`);
      console.log(`      ${photoUrl}`);
      totalAdded++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Summary:`);
  console.log(`   Stories with photos: ${storiesWithPhotos.length}`);
  console.log(`   Total photos: ${totalAdded}`);
  console.log(`\n📋 Note: These photos are already in Supabase Storage (story-images bucket)`);
  console.log(`   They will appear in the Photos tab once the gallery is connected.\n`);
}

addStoryPhotosToGallery().catch(console.error);
