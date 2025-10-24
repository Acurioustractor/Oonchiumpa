import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 8 evenly spaced photos from the 126 found in storage
const SELECTED_PHOTOS = [
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707168370_bndoyfag4mw.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707186303_99g03wl4hta.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707210053_glwx4kol7zr.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707234282_5fekrb4bdi8.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707262681_czslqi7nptj.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707291759_5psio3xqi2x.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707319500_xvgun1jqrbn.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/c22fcf84-5a09-4893-a8ef-758c781e88a8/media/1756707344293_kxfviacebc.jpg",
];

async function updateBlogWithPhotos() {
  console.log('📝 Updating Law Students blog post with photos...\n');

  // Get the law students blog post
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .ilike('title', '%law student%');

  if (fetchError || !posts || posts.length === 0) {
    console.error('❌ Could not find law students blog post');
    return;
  }

  const post = posts[0];
  console.log(`Found post: "${post.title}"\n`);

  let updatedContent = post.content;

  // Replace photo placeholders with actual URLs
  SELECTED_PHOTOS.forEach((url, index) => {
    const placeholder = `#LAW_STUDENT_PHOTO_${index + 1}`;
    const markdown = `![Law students at Atnarpa](${url})`;
    updatedContent = updatedContent.replace(placeholder, markdown);
    console.log(`✅ Replaced ${placeholder}`);
  });

  // Update the blog post
  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({ content: updatedContent })
    .eq('id', post.id);

  if (updateError) {
    console.error('❌ Error updating blog post:', updateError);
  } else {
    console.log('\n✅ Successfully updated law students blog post with 8 photos!');
    console.log('\n📸 Photos added:');
    SELECTED_PHOTOS.forEach((url, i) => {
      console.log(`   ${i + 1}. ${url.split('/').pop()}`);
    });
  }
}

updateBlogWithPhotos()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
