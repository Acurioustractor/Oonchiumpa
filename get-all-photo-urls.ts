import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getAllPhotoURLs() {
  console.log('📸 Getting ALL photo URLs...\n');

  const { data: photos, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${photos?.length || 0} photos\n`);

  const photosByStory: { [key: string]: any[] } = {};

  photos?.forEach((photo) => {
    const storyTitle = photo.caption?.split(' - Photo ')[0] || 'Other';
    if (!photosByStory[storyTitle]) {
      photosByStory[storyTitle] = [];
    }
    photosByStory[storyTitle].push(photo);
  });

  // Output as JSON for the HTML page
  const output: any = {};
  Object.entries(photosByStory).forEach(([story, storyPhotos]) => {
    console.log(`\n📖 ${story} (${storyPhotos.length} photos)`);
    output[story] = storyPhotos.map((p, i) => ({
      id: p.id,
      url: p.photo_url,
      caption: p.caption,
      number: i + 1
    }));

    storyPhotos.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.photo_url}`);
    });
  });

  // Write to file for the HTML viewer
  const fs = await import('fs');
  fs.writeFileSync(
    'all-photos-data.json',
    JSON.stringify(output, null, 2)
  );
  console.log('\n✅ Written to all-photos-data.json');
}

getAllPhotoURLs().catch(console.error);
