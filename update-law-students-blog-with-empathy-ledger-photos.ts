import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 8 evenly spaced photos from the 236 found using Empathy Ledger architecture
const SELECTED_PHOTOS = [
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640493985_IMG_2992.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640516701_IMG_3094.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640541575_IMG_3171.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640563714_IMG_3267.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640589034_IMG_3358.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640609854_IMG_3468.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640632211_IMG_3564.jpg",
  "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1759640661471_IMG_3663.jpg",
];

async function updateBlogWithPhotos() {
  console.log('📝 Updating Law Students blog post with Empathy Ledger photos...\n');

  // Get the law students blog post by ID
  const LAW_STUDENTS_POST_ID = '645a7f48-79b5-4712-92aa-e0217e6cfaf2';

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

  // Replace photo placeholders with actual URLs from Empathy Ledger
  SELECTED_PHOTOS.forEach((url, index) => {
    const placeholder = `#LAW_STUDENT_PHOTO_${index + 1}`;
    const markdown = `![Law students at Atnarpa](${url})`;
    updatedContent = updatedContent.replace(placeholder, markdown);
    console.log(`✅ Replaced ${placeholder}`);
  });

  // Update the blog post
  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', post.id);

  if (updateError) {
    console.error('❌ Error updating blog post:', updateError);
  } else {
    console.log('\n✅ Successfully updated law students blog post with 8 photos from Empathy Ledger!');
    console.log('\n📸 Photos added (from gallery_media_associations):');
    SELECTED_PHOTOS.forEach((url, i) => {
      const filename = url.split('/').pop();
      console.log(`   ${i + 1}. ${filename}`);
    });
    console.log('\n💡 These photos are sourced from the "Law Students Event 2025" gallery');
    console.log('   stored in Empathy Ledger\'s gallery_media_associations table.');
  }
}

updateBlogWithPhotos()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
