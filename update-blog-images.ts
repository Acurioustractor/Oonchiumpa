/**
 * Script to add hero images and gallery images to the blog posts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const imageUpdates = [
  {
    // Loves Creek post
    titleMatch: 'Atnarpa',
    hero_image: '/images/stories/IMG_9698.jpg',
    gallery: [
      '/images/stories/IMG_9698.jpg',
      '/images/hero/hero-main.jpg',
      '/images/stories/IMG_9713.jpg'
    ]
  },
  {
    // Law students post
    titleMatch: 'Learning Law',
    hero_image: '/images/stories/IMG_9713.jpg',
    gallery: [
      '/images/stories/IMG_9713.jpg',
      '/images/hero/hero-main.jpg'
    ]
  },
  {
    // Sydney invitation post
    titleMatch: 'Sydney',
    hero_image: '/images/team/kristy.jpg',
    gallery: [
      '/images/team/kristy.jpg',
      '/images/team/tanya.jpg'
    ]
  }
];

async function updateBlogImages() {
  console.log('🖼️  Updating blog post images...\n');

  for (const update of imageUpdates) {
    try {
      // Find the post by title
      const { data: posts, error: findError } = await supabase
        .from('blog_posts')
        .select('id, title')
        .ilike('title', `%${update.titleMatch}%`);

      if (findError) {
        console.error(`❌ Error finding post with "${update.titleMatch}":`, findError);
        continue;
      }

      if (!posts || posts.length === 0) {
        console.log(`⚠️  No post found matching "${update.titleMatch}"`);
        continue;
      }

      const post = posts[0];
      console.log(`📝 Updating: "${post.title}"`);

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          hero_image: update.hero_image,
          gallery: update.gallery,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`   ❌ Error updating: ${updateError.message}`);
      } else {
        console.log(`   ✅ Added hero image: ${update.hero_image}`);
        console.log(`   ✅ Added ${update.gallery.length} gallery images`);
      }
    } catch (error) {
      console.error(`   ❌ Unexpected error:`, error);
    }

    console.log('');
  }

  console.log('✨ Image updates complete!\n');
}

updateBlogImages()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
