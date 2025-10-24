import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllPhotos() {
  console.log('📸 Listing all photos in the gallery...\n');

  // Check photos table
  const { data: photos, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Photos table error:', error.message);

    // Try photo_gallery
    const { data: gallery } = await supabase
      .from('photo_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (gallery) {
      console.log(`Found ${gallery.length} photos in photo_gallery table\n`);
      gallery.forEach((photo, i) => {
        console.log(`${i + 1}. ${photo.title || 'Untitled'}`);
        console.log(`   ID: ${photo.id}`);
        console.log(`   URL: ${photo.url || photo.image_url || photo.photo_url}`);
        console.log(`   Tags: ${photo.tags || 'none'}`);
        console.log(`   Description: ${photo.description?.substring(0, 100) || 'none'}`);
        console.log('');
      });
      return;
    }
  } else {
    console.log(`Found ${photos.length} photos\n`);
    photos.forEach((photo, i) => {
      console.log(`${i + 1}. ${photo.title || photo.caption || 'Untitled'}`);
      console.log(`   ID: ${photo.id}`);
      console.log(`   URL: ${photo.url || photo.image_url || photo.photo_url}`);
      console.log(`   Tags: ${JSON.stringify(photo.tags) || 'none'}`);
      console.log(`   Project: ${photo.project_id || 'none'}`);
      console.log(`   Description: ${photo.description?.substring(0, 100) || 'none'}`);
      console.log('');
    });
  }
}

listAllPhotos();
