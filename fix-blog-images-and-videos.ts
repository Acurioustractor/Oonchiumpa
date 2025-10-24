import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LAW_STUDENTS_POST_ID = '645a7f48-79b5-4712-92aa-e0217e6cfaf2';

async function fixBlogImagesAndVideos() {
  console.log('🔧 Fixing blog post images and videos...\n');

  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', LAW_STUDENTS_POST_ID)
    .single();

  if (fetchError || !post) {
    console.error('❌ Error:', fetchError);
    return;
  }

  console.log(`✅ Found post: "${post.title}"\n`);

  let updatedContent = post.content;

  // Fix 1: Fix doubled image markdown
  // Pattern: ![text](![text](url)) -> ![text](url)
  console.log('📸 Fixing doubled image markdown...\n');

  const doubledImagePattern = /!\[(.*?)\]\(!\[.*?\]\((.*?)\)\)/g;
  const matches = updatedContent.match(doubledImagePattern);

  if (matches) {
    console.log(`Found ${matches.length} doubled image tags`);
    updatedContent = updatedContent.replace(doubledImagePattern, '![$1]($2)');
    console.log('✅ Fixed doubled image markdown\n');
  } else {
    console.log('No doubled images found\n');
  }

  // Fix 2: Replace video links with embedded iframes
  console.log('🎥 Replacing video links with embedded iframes...\n');

  const videoReplacements = [
    {
      name: 'Chelsea Kenneally',
      linkPattern: /\[Watch Chelsea Kenneally share her experience\]\(https:\/\/share\.descript\.com\/view\/lm8ZcGqTMxr\)/g,
      embed: '<div class="video-container my-8"><iframe src="https://share.descript.com/embed/lm8ZcGqTMxr" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>'
    },
    {
      name: 'Suzie Ma',
      linkPattern: /\[Watch Suzie Ma discuss what she learned\]\(https:\/\/share\.descript\.com\/view\/22LcqP2AWFD\)/g,
      embed: '<div class="video-container my-8"><iframe src="https://share.descript.com/embed/22LcqP2AWFD" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>'
    },
    {
      name: 'Adelaide Hayes',
      linkPattern: /\[Watch Adelaide Hayes reflect on her experience\]\(https:\/\/share\.descript\.com\/view\/mIqjyMYt2IL\)/g,
      embed: '<div class="video-container my-8"><iframe src="https://share.descript.com/embed/mIqjyMYt2IL" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>'
    }
  ];

  videoReplacements.forEach(({ name, linkPattern, embed }) => {
    if (updatedContent.match(linkPattern)) {
      updatedContent = updatedContent.replace(linkPattern, embed);
      console.log(`✅ Replaced ${name}'s video link with embedded iframe`);
    } else {
      console.log(`⚠️  Could not find ${name}'s video link`);
    }
  });

  // Update the blog post
  console.log('\n💾 Updating blog post...\n');

  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', LAW_STUDENTS_POST_ID);

  if (updateError) {
    console.error('❌ Error updating blog post:', updateError);
  } else {
    console.log('✅ Successfully fixed images and embedded videos!');
    console.log('\n📋 Summary:');
    console.log('   - Fixed doubled image markdown');
    console.log('   - Embedded 3 Descript videos as iframes');
    console.log('   - Videos will now play inline without showing URLs');
  }
}

fixBlogImagesAndVideos()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
