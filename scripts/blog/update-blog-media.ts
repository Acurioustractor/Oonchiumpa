#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BLOG_POST_ID = '79fb595d-5e9f-4f8e-ad6e-64a130eff8fb';

async function updateBlogMedia() {
  console.log('📸 Adding Media to Atnarpa Blog Post\n');

  // Example: Add hero image
  const heroImageUrl = 'PASTE_YOUR_IMAGE_URL_HERE';

  // Example: Add video embed
  const videoEmbed = `
## The Week Everything Changed

<iframe width="100%" height="400" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" title="Atnarpa Homestead Restoration" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Watch the restoration week in action*
`;

  // Example: Add images throughout the content
  const imageMarkdown = `
![Atnarpa Homestead 1933](YOUR_IMAGE_URL_1)
*The homestead as it looked when built in 1933*

![Family gathering](YOUR_IMAGE_URL_2)
*Our family gathering at the homestead*

![Roof restoration](YOUR_IMAGE_URL_3)
*The team working on the new roof*
`;

  console.log('To add media to your blog post, you have two options:\n');
  console.log('━'.repeat(60));

  console.log('\n📋 OPTION 1: Quick SQL Update (Recommended)');
  console.log('\nGo to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor');
  console.log('Find the blog_posts table, locate your post, and:\n');

  console.log('1️⃣ Add Hero Image:');
  console.log(`   UPDATE blog_posts`);
  console.log(`   SET hero_image = 'YOUR_IMAGE_URL'`);
  console.log(`   WHERE id = '${BLOG_POST_ID}';`);

  console.log('\n2️⃣ Add Video Embed (paste YouTube iframe anywhere in content):\n');
  console.log('   <iframe width="100%" height="400"');
  console.log('   src="https://www.youtube.com/embed/VIDEO_ID"');
  console.log('   allowfullscreen></iframe>');

  console.log('\n3️⃣ Add Images (paste markdown anywhere in content):\n');
  console.log('   ![Description](https://your-image-url.com/image.jpg)');

  console.log('\n━'.repeat(60));

  console.log('\n📋 OPTION 2: Add Images to Gallery Array');
  console.log('\nFor a carousel/gallery of images:\n');
  console.log(`UPDATE blog_posts`);
  console.log(`SET gallery = ARRAY[`);
  console.log(`  'https://image1.jpg',`);
  console.log(`  'https://image2.jpg',`);
  console.log(`  'https://image3.jpg'`);
  console.log(`]`);
  console.log(`WHERE id = '${BLOG_POST_ID}';`);

  console.log('\n━'.repeat(60));

  console.log('\n💡 QUICK IMAGE HOSTING OPTIONS:\n');
  console.log('1. Imgur.com - Upload, copy direct link');
  console.log('2. Google Drive - Upload, share publicly, copy link');
  console.log('3. YouTube - For videos (use embed code)');
  console.log('4. Supabase Storage - Upload to your own storage');
  console.log('   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage');

  console.log('\n━'.repeat(60));

  console.log('\n🎬 EXAMPLE: Adding A Curious Tractor Video\n');
  console.log('If you have a YouTube video of the homestead work:');
  console.log('1. Get YouTube video ID (the part after watch?v=)');
  console.log('2. Replace VIDEO_ID in the iframe code above');
  console.log('3. Paste it anywhere in your blog content');

  console.log('\n━'.repeat(60));

  console.log('\n✅ Your blog post is at:');
  console.log(`   http://localhost:3001/blog/${BLOG_POST_ID}`);
  console.log('\nAfter adding media, refresh the page to see changes!\n');
}

updateBlogMedia().catch(console.error);
