import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function listPhotos() {
  console.log('📸 Listing all gallery photos...\n');

  const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

  const { data: photos, error } = await supabase
    .from('gallery_media')
    .select('*')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('media_type', 'photo')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${photos?.length || 0} photos\n`);

  if (photos && photos.length > 0) {
    photos.forEach((photo, i) => {
      console.log(`${i + 1}. ${photo.title || 'Untitled'}`);
      console.log(`   ID: ${photo.id}`);
      console.log(`   Category: ${photo.category || 'none'}`);
      console.log(`   Description: ${photo.description || 'none'}`);
      console.log(`   Created: ${new Date(photo.created_at).toLocaleDateString()}`);
      console.log('');
    });

    console.log('\n📊 Categories:');
    const categories = [...new Set(photos.map(p => p.category))];
    categories.forEach(cat => {
      const count = photos.filter(p => p.category === cat).length;
      console.log(`   ${cat}: ${count} photos`);
    });
  }
}

listPhotos();
