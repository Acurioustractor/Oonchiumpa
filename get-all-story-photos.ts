import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function getAllStoryPhotos() {
  console.log('📸 Getting ALL photos from stories...\n');

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, media_urls')
    .not('media_urls', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${stories?.length || 0} stories with photos\n`);

  const allPhotos: any[] = [];
  let photoIndex = 1;

  stories?.forEach((story) => {
    if (story.media_urls && Array.isArray(story.media_urls)) {
      story.media_urls.forEach((url: string) => {
        allPhotos.push({
          number: photoIndex++,
          url,
          story: story.title,
          storyId: story.id
        });
      });
    }
  });

  console.log(`\nTotal photos across all stories: ${allPhotos.length}\n`);

  // Group by story
  const byStory: { [key: string]: any[] } = {};
  allPhotos.forEach(photo => {
    if (!byStory[photo.story]) {
      byStory[photo.story] = [];
    }
    byStory[photo.story].push(photo);
  });

  // Print organized by story
  Object.entries(byStory).forEach(([story, photos]) => {
    console.log(`\n📖 ${story} (${photos.length} photos)`);
    photos.slice(0, 5).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.url}`);
    });
    if (photos.length > 5) {
      console.log(`   ... and ${photos.length - 5} more`);
    }
  });

  // Write JSON with all photos
  fs.writeFileSync(
    'all-story-photos.json',
    JSON.stringify({ byStory, allPhotos }, null, 2)
  );

  console.log('\n✅ Written to all-story-photos.json');
  console.log(`\n📊 Summary: ${allPhotos.length} total photos from ${Object.keys(byStory).length} stories`);
}

getAllStoryPhotos().catch(console.error);
