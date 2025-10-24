import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function listStoryImages() {
  const { data } = await supabase
    .from('stories')
    .select('title, imageUrl, media_urls')
    .not('imageUrl', 'is', null)
    .limit(15);

  console.log('📸 Stories with hero images:\n');
  data?.forEach(s => {
    console.log(`${s.title}`);
    console.log(`  Hero: ${s.imageUrl}`);
    if (s.media_urls && s.media_urls.length > 0) {
      console.log(`  Gallery: ${s.media_urls.length} photos`);
      console.log(`  First: ${s.media_urls[0]}`);
    }
    console.log('');
  });
}

listStoryImages().catch(console.error);
