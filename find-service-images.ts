import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function findServiceImages() {
  console.log('🔍 Finding images for each service...\n');

  // Youth Mentorship - search stories
  console.log('💚 Youth Mentorship & Cultural Healing:');
  const { data: youthStories } = await supabase
    .from('stories')
    .select('id, title, imageUrl, media_urls')
    .or('title.ilike.%youth%,title.ilike.%mentorship%,content.ilike.%youth mentorship%')
    .not('imageUrl', 'is', null)
    .limit(3);

  if (youthStories && youthStories.length > 0) {
    console.log(`   Found ${youthStories.length} stories with images:`);
    youthStories.forEach(story => {
      console.log(`   - ${story.title}`);
      console.log(`     Image: ${story.imageUrl}`);
    });
  } else {
    console.log('   No images found - can use from Deadly Hearts or general youth photos');
  }
  console.log('');

  // True Justice / Law Students
  console.log('📚 True Justice / Law Students:');
  const { data: lawStories } = await supabase
    .from('stories')
    .select('id, title, imageUrl, media_urls')
    .or('title.ilike.%law%,title.ilike.%justice%,title.ilike.%ANU%,content.ilike.%law student%')
    .not('imageUrl', 'is', null)
    .limit(3);

  if (lawStories && lawStories.length > 0) {
    console.log(`   Found ${lawStories.length} stories with images:`);
    lawStories.forEach(story => {
      console.log(`   - ${story.title}`);
      console.log(`     Image: ${story.imageUrl}`);
    });
  } else {
    console.log('   No images found - can add from True Justice gallery');
  }
  console.log('');

  // Atnarpa Homestead
  console.log('🏡 Atnarpa Homestead:');
  const { data: atnarpaStories } = await supabase
    .from('stories')
    .select('id, title, imageUrl, media_urls')
    .or('title.ilike.%atnarpa%,title.ilike.%loves creek%')
    .not('imageUrl', 'is', null)
    .limit(3);

  if (atnarpaStories && atnarpaStories.length > 0) {
    console.log(`   Found ${atnarpaStories.length} stories with images:`);
    atnarpaStories.forEach(story => {
      console.log(`   - ${story.title}`);
      console.log(`     Image: ${story.imageUrl}`);
      if (story.media_urls && story.media_urls.length > 0) {
        console.log(`     + ${story.media_urls.length} additional photos in gallery`);
      }
    });
  }
  console.log('');

  // Cultural Brokerage - general community/partnership photos
  console.log('🤝 Cultural Brokerage:');
  const { data: communityStories } = await supabase
    .from('stories')
    .select('id, title, imageUrl, media_urls')
    .or('title.ilike.%community%,title.ilike.%partnership%,title.ilike.%service%')
    .not('imageUrl', 'is', null)
    .limit(3);

  if (communityStories && communityStories.length > 0) {
    console.log(`   Found ${communityStories.length} stories with images:`);
    communityStories.forEach(story => {
      console.log(`   - ${story.title}`);
      console.log(`     Image: ${story.imageUrl}`);
    });
  } else {
    console.log('   No images found - can use general community photos');
  }
  console.log('');

  console.log('\n💡 Recommendation:');
  console.log('   - Use story imageUrl for card hero images');
  console.log('   - Or manually add representative photos to public/images/services/');
  console.log('   - Ensure photos have Elder approval and proper permissions');
}

findServiceImages().catch(console.error);
