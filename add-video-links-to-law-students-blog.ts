import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LAW_STUDENTS_POST_ID = '645a7f48-79b5-4712-92aa-e0217e6cfaf2';

const VIDEO_LINKS = {
  chelsea: 'https://share.descript.com/view/lm8ZcGqTMxr',
  suzie: 'https://share.descript.com/view/22LcqP2AWFD',
  adelaide: 'https://share.descript.com/view/mIqjyMYt2IL'
};

async function addVideoLinks() {
  console.log('🎥 Adding Descript video links to Law Students blog post...\n');

  // Get the blog post
  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', LAW_STUDENTS_POST_ID)
    .single();

  if (fetchError || !post) {
    console.error('❌ Could not find law students blog post');
    console.error('Error:', fetchError);
    return;
  }

  console.log(`✅ Found post: "${post.title}"\n`);

  let updatedContent = post.content;

  // Replace video placeholders with actual Descript links
  const replacements = [
    { placeholder: 'YOUR_CHELSEA_VIDEO_LINK_HERE', url: VIDEO_LINKS.chelsea, name: 'Chelsea' },
    { placeholder: 'YOUR_SUZIE_VIDEO_LINK_HERE', url: VIDEO_LINKS.suzie, name: 'Suzie' },
    { placeholder: 'YOUR_ADELAIDE_VIDEO_LINK_HERE', url: VIDEO_LINKS.adelaide, name: 'Adelaide' }
  ];

  replacements.forEach(({ placeholder, url, name }) => {
    if (updatedContent.includes(placeholder)) {
      updatedContent = updatedContent.replace(placeholder, url);
      console.log(`✅ Replaced ${name}'s video link`);
    } else {
      console.log(`⚠️  Placeholder not found: ${placeholder}`);
    }
  });

  // Update the blog post
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
    console.log('\n✅ Successfully added 3 Descript video links to the blog post!');
    console.log('\n🎬 Videos added:');
    console.log(`   1. Chelsea: ${VIDEO_LINKS.chelsea}`);
    console.log(`   2. Suzie: ${VIDEO_LINKS.suzie}`);
    console.log(`   3. Adelaide: ${VIDEO_LINKS.adelaide}`);
  }
}

addVideoLinks()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
