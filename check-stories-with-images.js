#!/usr/bin/env node
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

async function main() {
  // Get all stories
  const { data: allStories } = await supabase
    .from('stories')
    .select('id, title, media_metadata')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID);

  // Get stories with images
  const { data: storiesWithImages } = await supabase
    .from('stories')
    .select('id, title, story_image_url, media_urls')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .not('media_urls', 'is', null);

  console.log(`\n📊 Story Statistics:\n`);
  console.log(`Total stories: ${allStories.length}`);
  console.log(`Stories with uploaded images: ${storiesWithImages.length}`);
  console.log(`Stories without images: ${allStories.length - storiesWithImages.length}\n`);

  console.log('='.repeat(80));
  console.log('\n📸 Stories WITH images:\n');
  storiesWithImages.forEach((story, idx) => {
    console.log(`${idx + 1}. ${story.title}`);
    console.log(`   Images: ${story.media_urls?.length || 0}`);
  });

  // Check which stories have image_count in metadata but no uploaded images
  const storiesWithMetadata = allStories.filter(s =>
    s.media_metadata?.image_count > 0 &&
    !storiesWithImages.find(si => si.id === s.id)
  );

  if (storiesWithMetadata.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('\n⚠️  Stories that SHOULD have images (have image_count in metadata):\n');
    storiesWithMetadata.forEach((story, idx) => {
      console.log(`${idx + 1}. ${story.title}`);
      console.log(`   Expected images: ${story.media_metadata.image_count}`);
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(console.error);
