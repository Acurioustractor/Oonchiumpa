#!/usr/bin/env node
/**
 * Remove the first image (Oonchiumpa logo) from story galleries
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

async function removeLogoImages() {
  console.log('🎨 Removing Oonchiumpa logo from story galleries\n');
  console.log('='.repeat(80));

  // Get all stories with images
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, story_image_url, media_urls')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .not('media_urls', 'is', null);

  if (error) {
    console.error('Error fetching stories:', error);
    return;
  }

  console.log(`\n📖 Found ${stories.length} stories with images\n`);

  for (const story of stories) {
    if (!story.media_urls || story.media_urls.length === 0) continue;

    // Remove first image (logo) from media_urls
    const updatedUrls = story.media_urls.slice(1);

    // Set new hero image to the first actual photo (second in original array)
    const newHeroImage = updatedUrls.length > 0 ? updatedUrls[0] : null;

    const { error: updateError } = await supabase
      .from('stories')
      .update({
        story_image_url: newHeroImage,
        media_urls: updatedUrls
      })
      .eq('id', story.id);

    if (updateError) {
      console.error(`❌ Error updating "${story.title}":`, updateError.message);
    } else {
      console.log(`✅ Updated: "${story.title}"`);
      console.log(`   Images: ${story.media_urls.length} → ${updatedUrls.length}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✨ Logo images removed from all galleries!\n');
}

removeLogoImages().catch(console.error);
