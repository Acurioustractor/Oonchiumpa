import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function uploadServicePhotos() {
  const photosDir = './Photos';
  const photos = [
    { file: 'Mentoring.jpg', service: 'Youth Mentorship' },
    { file: 'Law.jpg', service: 'Law Students' },
    { file: 'Homestead.jpg', service: 'Atnarpa Homestead' },
    { file: 'Brokerage.jpg', service: 'Cultural Brokerage' }
  ];

  console.log('📸 Uploading service photos to Supabase...\n');

  for (const photo of photos) {
    const filePath = path.join(photosDir, photo.file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `service-${photo.file.toLowerCase()}`;
    const storagePath = `services/${fileName}`;

    console.log(`Uploading ${photo.service}: ${photo.file}`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      continue;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    console.log(`  ✅ Uploaded: ${publicUrl}\n`);
  }

  console.log('\n📋 URLs for ServicesPage.tsx:\n');

  for (const photo of photos) {
    const fileName = `service-${photo.file.toLowerCase()}`;
    const storagePath = `services/${fileName}`;
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    console.log(`${photo.service}:`);
    console.log(`  image: '${publicUrl}',\n`);
  }
}

uploadServicePhotos().catch(console.error);
