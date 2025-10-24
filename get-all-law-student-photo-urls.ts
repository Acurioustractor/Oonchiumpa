import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAllLawStudentPhotoUrls() {
  console.log('📸 Retrieving all 126 law student photo URLs...\n');

  const path = 'c22fcf84-5a09-4893-a8ef-758c781e88a8/media';

  const { data: files, error } = await supabase.storage
    .from('media')
    .list(path, { limit: 300, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (files && files.length > 0) {
    const images = files.filter(f => f.id && f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i));

    console.log(`✅ Found ${images.length} images\n`);
    console.log(`All photo URLs:\n`);

    const urls = images.map((img, i) => {
      const url = `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${path}/${img.name}`;
      console.log(`${i + 1}. ${url}`);
      return url;
    });

    console.log(`\n\n📋 Copy-paste ready array of all ${urls.length} URLs:\n`);
    console.log(JSON.stringify(urls, null, 2));

    // Suggest evenly spaced selection of 8 photos
    console.log(`\n\n✨ Suggested 8 photos (evenly spaced):\n`);
    const step = Math.floor(images.length / 8);
    const selectedIndices = Array.from({ length: 8 }, (_, i) => i * step);

    selectedIndices.forEach((idx, i) => {
      const img = images[idx];
      const url = `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${path}/${img.name}`;
      console.log(`Photo ${i + 1}:`);
      console.log(`"${url}",\n`);
    });
  }
}

getAllLawStudentPhotoUrls();
