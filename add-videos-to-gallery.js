import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

// Add your videos here - paste Descript share URLs or any embed URLs
const videos = [
  {
    url: 'https://vimeo.com/1025341290',
    title: 'Oonchiumpa Video',
    description: 'Oonchiumpa community video'
  },
  // Add more videos here...
];

async function addVideosToGallery() {
  console.log('🎥 Adding Videos to Gallery\n');
  console.log('='.repeat(80));

  let addedCount = 0;
  let skippedCount = 0;

  for (const video of videos) {
    // Convert Descript share URLs to embed URLs
    let embedUrl = video.url;
    if (video.url.includes('share.descript.com') && !video.url.includes('/embed/')) {
      embedUrl = video.url.replace('/view/', '/embed/');
    }

    console.log(`\n🎬 "${video.title}"`);
    console.log(`   URL: ${embedUrl}`);

    // Check if video already exists
    const { data: existing } = await supabase
      .from('gallery_media')
      .select('id')
      .eq('url', embedUrl)
      .single();

    if (existing) {
      console.log(`   ⏭️  Already in gallery`);
      skippedCount++;
      continue;
    }

    // Add to gallery
    const { error } = await supabase
      .from('gallery_media')
      .insert({
        tenant_id: OONCHIUMPA_TENANT_ID,
        title: video.title,
        description: video.description || null,
        url: embedUrl,
        media_type: 'video',
        category: 'gallery'
      });

    if (error) {
      console.error(`   ❌ Error:`, error.message);
    } else {
      addedCount++;
      console.log(`   ✅ Added successfully`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Summary:`);
  console.log(`   Videos added: ${addedCount}`);
  console.log(`   Videos skipped (already exist): ${skippedCount}`);
  console.log(`   Total processed: ${videos.length}`);
}

addVideosToGallery().catch(console.error);
