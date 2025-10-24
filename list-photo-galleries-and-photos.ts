import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listGalleriesAndPhotos() {
  console.log('📸 Photo Galleries in Your Site\n');
  console.log('='.repeat(80) + '\n');

  // Get all galleries
  const { data: galleries } = await supabase
    .from('photo_galleries')
    .select('*')
    .order('created_at', { ascending: false });

  console.log(`Found ${galleries?.length || 0} galleries:\n`);

  for (const gallery of galleries || []) {
    console.log(`\n📁 ${gallery.title}`);
    console.log(`   ID: ${gallery.id}`);
    console.log(`   Description: ${gallery.description || 'none'}`);
    console.log(`   Photos: ${gallery.photo_count || 0}`);
    console.log(`   Type: ${gallery.gallery_type}`);
    console.log(`   Created: ${new Date(gallery.created_at).toLocaleDateString()}`);

    // Now find photos in this gallery
    // Photos might be in a separate photos table linked to gallery_id
    try {
      const { data: photos } = await supabase
        .from('gallery_photos')  // Common naming pattern
        .select('*')
        .eq('gallery_id', gallery.id)
        .limit(5);

      if (photos && photos.length > 0) {
        console.log(`\n   📷 Sample Photos (${photos.length}):`);
        photos.forEach((photo: any, i: number) => {
          console.log(`      ${i + 1}. ${photo.title || photo.filename || 'Untitled'}`);
          console.log(`         URL: ${photo.url || photo.storage_path}`);
          if (photo.tags) console.log(`         Tags: ${photo.tags.join(', ')}`);
        });
      }
    } catch (e) {
      // gallery_photos table might not exist
    }
  }

  // Also check if there's a standalone photos table
  console.log('\n\n' + '='.repeat(80));
  console.log('Checking for standalone photos table...');
  console.log('='.repeat(80) + '\n');

  const photoTables = ['gallery_photos', 'photos_uploads', 'media_uploads', 'photo_items'];

  for (const tableName of photoTables) {
    try {
      const { data, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(3);

      if (data && data.length > 0) {
        console.log(`\n✅ Found: ${tableName} (${count} total)`);
        console.log('Sample photos:');
        data.forEach((photo, i) => {
          console.log(`\n${i + 1}. ${photo.title || photo.filename || photo.name || 'Untitled'}`);
          console.log(`   Columns: ${Object.keys(photo).slice(0, 10).join(', ')}`);
          if (photo.url || photo.storage_path || photo.file_url) {
            console.log(`   URL: ${photo.url || photo.storage_path || photo.file_url}`);
          }
        });
      }
    } catch (e) {
      // Table doesn't exist
    }
  }
}

listGalleriesAndPhotos()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
