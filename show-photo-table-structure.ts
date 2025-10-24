import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function showTableStructure() {
  console.log('📋 Photo Tables Structure\n');

  // Insert a test photo to see what fields are required
  const testPhoto = {
    title: 'Test Law Student Photo',
    description: 'Students learning on country',
    url: 'https://example.com/test.jpg',
    tags: ['law-students-2024', 'anu-program'],
    project_id: null
  };

  console.log('Testing photos table...');
  const { data: photoData, error: photoError } = await supabase
    .from('photos')
    .insert(testPhoto)
    .select()
    .single();

  if (photoError) {
    console.log('Photos table error:', photoError.message);
    console.log('Details:', photoError);
  } else {
    console.log('✅ Photos table structure:');
    console.log(JSON.stringify(photoData, null, 2));

    // Delete the test photo
    await supabase.from('photos').delete().eq('id', photoData.id);
  }

  console.log('\n---\n');

  // Test photo_projects
  const testProject = {
    title: 'Law Students 2024 Trip',
    description: 'ANU law students learning on country with Traditional Owners',
    cover_photo_url: 'https://example.com/cover.jpg',
    photo_count: 0,
    photos: []
  };

  console.log('Testing photo_projects table...');
  const { data: projectData, error: projectError } = await supabase
    .from('photo_projects')
    .insert(testProject)
    .select()
    .single();

  if (projectError) {
    console.log('Photo projects table error:', projectError.message);
    console.log('Details:', projectError);
  } else {
    console.log('✅ Photo projects table structure:');
    console.log(JSON.stringify(projectData, null, 2));

    // Delete the test project
    await supabase.from('photo_projects').delete().eq('id', projectData.id);
  }

  console.log('\n---\n');

  // Test photo_gallery
  const testGallery = {
    title: 'Law Students Gallery',
    image_url: 'https://example.com/gallery.jpg',
    caption: 'Students on country',
    tags: ['law-students-2024']
  };

  console.log('Testing photo_gallery table...');
  const { data: galleryData, error: galleryError } = await supabase
    .from('photo_gallery')
    .insert(testGallery)
    .select()
    .single();

  if (galleryError) {
    console.log('Photo gallery table error:', galleryError.message);
    console.log('Details:', galleryError);
  } else {
    console.log('✅ Photo gallery table structure:');
    console.log(JSON.stringify(galleryData, null, 2));

    // Delete the test gallery
    await supabase.from('photo_gallery').delete().eq('id', galleryData.id);
  }
}

showTableStructure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
