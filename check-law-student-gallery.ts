import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkLawStudentGallery() {
  console.log('🔍 Checking for Law Students gallery...\n');

  const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

  // Check all galleries
  const { data: galleries, error } = await supabase
    .from('photo_galleries')
    .select('*')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${galleries?.length || 0} total galleries\n`);

  if (galleries && galleries.length > 0) {
    galleries.forEach((gallery, i) => {
      console.log(`${i + 1}. ${gallery.title}`);
      console.log(`   ID: ${gallery.id}`);
      console.log(`   Type: ${gallery.gallery_type}`);
      console.log(`   Organization ID: ${gallery.organization_id || 'none'}`);
      console.log(`   Project ID: ${gallery.project_id || 'none'}`);
      console.log(`   Photo Count: ${gallery.photo_count}`);
      console.log(`   Description: ${gallery.description || 'none'}`);
      console.log('');
    });
  }

  // Check specifically for law students gallery
  const lawStudentGallery = galleries?.find(g =>
    g.title.toLowerCase().includes('law student')
  );

  if (lawStudentGallery) {
    console.log('✅ Found Law Students gallery!');
    console.log(`   ID: ${lawStudentGallery.id}`);
    console.log(`   Photos: ${lawStudentGallery.photo_count}`);

    // Check for photos in this gallery
    const { data: photos } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('gallery_id', lawStudentGallery.id);

    console.log(`\n📸 Photos in this gallery: ${photos?.length || 0}`);

    if (photos && photos.length > 0) {
      photos.forEach((photo, i) => {
        console.log(`   ${i + 1}. ${photo.caption || 'No caption'}`);
        console.log(`      Photo URL: ${photo.photo_url?.substring(0, 60)}...`);
      });
    } else {
      console.log('\n⚠️  Gallery exists but has NO photos!');
      console.log('\nYou can upload photos to this gallery via Empathy Ledger.');
    }
  } else {
    console.log('⚠️  No Law Students gallery found');
    console.log('\nYou may need to create one in Empathy Ledger first.');
  }
}

checkLawStudentGallery();
