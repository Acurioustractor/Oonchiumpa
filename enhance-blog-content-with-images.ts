/**
 * Script to enhance blog post content with inline images
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function enhanceBlogContent() {
  console.log('✨ Enhancing blog posts with inline images...\n');

  // Get all blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, content')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (const post of posts || []) {
    let updatedContent = post.content;
    let updated = false;

    // Add images based on the post content
    if (post.title.includes('Atnarpa')) {
      // Loves Creek post - add image after "The History Lives in the Land" section
      updatedContent = updatedContent.replace(
        '## The History Lives in the Land',
        `## The History Lives in the Land\n\n![Atnarpa Homestead at Loves Creek Station](/images/stories/IMG_9698.jpg)`
      );

      // Add another image in the "Healing Through Connection" section
      updatedContent = updatedContent.replace(
        '## Healing Through Connection',
        `## Healing Through Connection\n\n![Young people connecting to country](/images/hero/hero-main.jpg)`
      );

      updated = true;
    }

    if (post.title.includes('Learning Law')) {
      // Law students post - add image after first section
      updatedContent = updatedContent.replace(
        '## A Different Kind of Legal Education',
        `## A Different Kind of Legal Education\n\n![Law students learning on country](/images/stories/IMG_9713.jpg)`
      );

      // Add image in the "Beyond the Categories" section
      updatedContent = updatedContent.replace(
        '## Beyond the Categories',
        `## Beyond the Categories\n\n![Community gathering](/images/hero/hero-main.jpg)`
      );

      updated = true;
    }

    if (post.title.includes('Sydney')) {
      // Sydney post - add leadership image
      updatedContent = updatedContent.replace(
        '## Why This Matters',
        `## Why This Matters\n\n![Kristy Bloomfield, Oonchiumpa Director](/images/team/kristy.jpg)`
      );

      // Add another image later in the post
      updatedContent = updatedContent.replace(
        '## How Different Models Create Different Outcomes',
        `## How Different Models Create Different Outcomes\n\n![Tanya Turner, Oonchiumpa Leadership](/images/team/tanya.jpg)`
      );

      updated = true;
    }

    if (updated) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`❌ Error updating "${post.title}":`, updateError);
      } else {
        console.log(`✅ Enhanced: "${post.title}"`);
      }
    }
  }

  console.log('\n✨ Content enhancement complete!');
}

enhanceBlogContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
