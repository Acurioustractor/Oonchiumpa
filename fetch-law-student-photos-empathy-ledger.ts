import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LAW_STUDENTS_GALLERY_ID = '92a1acc3-1ce1-44ce-9773-8f7e78268f4c';

async function fetchLawStudentPhotosEmpathyLedger() {
  console.log('🎭 Fetching Law Students photos using Empathy Ledger architecture...\n');

  // Step 1: Get the gallery details from photo_galleries
  const { data: gallery, error: galleryError } = await supabase
    .from('photo_galleries')
    .select('*')
    .eq('id', LAW_STUDENTS_GALLERY_ID)
    .single();

  if (galleryError || !gallery) {
    console.error('❌ Gallery not found:', galleryError);
    return;
  }

  console.log(`✅ Found gallery: "${gallery.title}"`);
  console.log(`   Description: ${gallery.description}`);
  console.log(`   Photo count: ${gallery.photo_count}`);
  console.log(`   Organization: ${gallery.organization_id}`);
  console.log(`   Project: ${gallery.project_id}\n`);

  // Step 2: Get media associations (links between gallery and media_assets)
  console.log('📸 Fetching gallery_media_associations...\n');

  const { data: mediaAssociations, error: associationsError } = await supabase
    .from('gallery_media_associations')
    .select('*')
    .eq('gallery_id', LAW_STUDENTS_GALLERY_ID)
    .order('sort_order', { ascending: true });

  if (associationsError) {
    console.error('❌ Error fetching associations:', associationsError);
    return;
  }

  console.log(`Found ${mediaAssociations?.length || 0} media associations\n`);

  if (!mediaAssociations || mediaAssociations.length === 0) {
    console.log('⚠️  No media associations found for this gallery!');
    console.log('\nThis means the gallery exists but photos haven\'t been linked via gallery_media_associations table.');
    console.log('The 237 photos you see might be in media_assets but not yet associated with this gallery.\n');

    // Try to find media_assets that might belong to this project
    console.log('🔍 Searching for media_assets that might belong to Law Students project...\n');

    const LAW_STUDENTS_PROJECT_ID = '1bfcbf56-4a36-42a1-b819-e0dab7749597';

    const { data: projectMedia, error: projectMediaError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('project_id', LAW_STUDENTS_PROJECT_ID)
      .limit(20);

    if (projectMedia && projectMedia.length > 0) {
      console.log(`✅ Found ${projectMedia.length} media_assets linked to Law Students project!\n`);
      console.log('First 10 photos:\n');

      projectMedia.slice(0, 10).forEach((media, i) => {
        const url = media.thumbnail_url ||
                   (media.storage_path
                     ? `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${media.storage_path}`
                     : null);

        console.log(`${i + 1}. ${media.title || media.filename}`);
        console.log(`   URL: ${url}`);
        console.log(`   File: ${media.filename}`);
        console.log('');
      });
    } else {
      console.log('❌ No media_assets found for Law Students project either');
    }

    return;
  }

  // Step 3: Get the actual media_assets
  const mediaIds = mediaAssociations.map(assoc => assoc.media_asset_id);

  const { data: mediaAssets, error: mediaError } = await supabase
    .from('media_assets')
    .select('*')
    .in('id', mediaIds);

  if (mediaError || !mediaAssets) {
    console.error('❌ Error fetching media assets:', mediaError);
    return;
  }

  console.log(`✅ Found ${mediaAssets.length} media assets\n`);

  // Step 4: Build photo URLs following Empathy Ledger pattern
  const photos = mediaAssociations.map((association, index) => {
    const mediaAsset = mediaAssets.find(asset => asset.id === association.media_asset_id);

    if (!mediaAsset) return null;

    const url = mediaAsset.thumbnail_url ||
               (mediaAsset.storage_path
                 ? `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${mediaAsset.storage_path}`
                 : null);

    return {
      id: mediaAsset.id,
      url,
      title: mediaAsset.title || mediaAsset.filename,
      description: mediaAsset.description || association.caption,
      filename: mediaAsset.filename,
      caption: association.caption,
      sortOrder: association.sort_order
    };
  }).filter(Boolean);

  console.log(`📋 Generated ${photos.length} photo objects\n`);

  // Show first 10 photos
  console.log('First 10 photos:\n');
  photos.slice(0, 10).forEach((photo, i) => {
    console.log(`${i + 1}. ${photo.title}`);
    console.log(`   ${photo.url}`);
    console.log('');
  });

  if (photos.length > 10) {
    console.log(`... and ${photos.length - 10} more photos\n`);
  }

  // Suggest 8 evenly spaced photos for the blog
  console.log('\n✨ Suggested 8 photos for blog post (evenly spaced):\n');
  const step = Math.floor(photos.length / 8);
  const selectedPhotos = Array.from({ length: 8 }, (_, i) => photos[i * step]).filter(Boolean);

  selectedPhotos.forEach((photo, i) => {
    console.log(`Photo ${i + 1}:`);
    console.log(`"${photo.url}",\n`);
  });
}

fetchLawStudentPhotosEmpathyLedger();
