import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function checkInventory() {
  console.log('📊 Content Inventory Check\n');

  const { data: stories } = await supabase
    .from('stories')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false });
  console.log(`Stories: ${stories?.length || 0} total`);

  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false });
  console.log(`Blogs: ${blogs?.length || 0} total`);

  const { data: galleries } = await supabase
    .from('photo_galleries')
    .select('id, title, created_at');
  console.log(`Photo Galleries: ${galleries?.length || 0} total`);

  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('id, caption, gallery_id');
  console.log(`Gallery Photos: ${photos?.length || 0} total`);
}

checkInventory().catch(console.error);
