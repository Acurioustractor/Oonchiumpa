import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function checkGoodNewsMedia() {
  console.log('📸 Checking Good News Stories Media\n');

  const { data, error } = await supabase
    .from('transcripts')
    .select('id, title, media_metadata')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .ilike('title', '%Good News%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${data.length} Good News Stories\n`);
  console.log('='.repeat(80) + '\n');

  for (const doc of data) {
    console.log(`📄 ${doc.title}`);
    console.log(`   ID: ${doc.id}\n`);

    if (doc.media_metadata) {
      console.log('   Media Metadata:');
      console.log(JSON.stringify(doc.media_metadata, null, 2).split('\n').map(l => '   ' + l).join('\n'));
    } else {
      console.log('   ❌ No media metadata');
    }

    // Check if there are photos in gallery_photos table for this document
    const { data: photos, error: photosError } = await supabase
      .from('gallery_photos')
      .select('id, photo_url, caption, tags')
      .contains('tags', [doc.title.substring(0, 30)])
      .limit(5);

    if (!photosError && photos && photos.length > 0) {
      console.log(`\n   📷 Found ${photos.length} photos in gallery:`);
      photos.forEach(photo => {
        console.log(`      - ${photo.photo_url}`);
        if (photo.caption) console.log(`        Caption: ${photo.caption}`);
      });
    }

    console.log('\n' + '-'.repeat(80) + '\n');
  }
}

checkGoodNewsMedia().catch(console.error);
