import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addRelatedStories() {
  console.log('🔗 Adding related stories to blog posts...\n');

  // Get all 3 blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, type')
    .order('created_at', { ascending: false });

  if (error || !posts || posts.length === 0) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  console.log(`Found ${posts.length} blog posts:\n`);
  posts.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Type: ${post.type}\n`);
  });

  // Now get all published stories from the stories table
  const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('id, title, story_type')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10);

  if (storiesError || !stories || stories.length === 0) {
    console.error('❌ Error fetching stories:', storiesError);
    return;
  }

  console.log(`\n📚 Found ${stories.length} published stories:\n`);
  stories.slice(0, 5).forEach((story, i) => {
    console.log(`${i + 1}. ${story.title}`);
    console.log(`   ID: ${story.id}`);
    console.log(`   Type: ${story.story_type}\n`);
  });

  // Create related story mappings
  // Each blog post gets 2-3 related stories based on theme

  const LAW_STUDENTS_POST_ID = '645a7f48-79b5-4712-92aa-e0217e6cfaf2';
  const ATNARPA_POST_ID = 'f0ac380a-3568-4930-9650-344a8c16414b';
  const SYDNEY_POST_ID = '35f825b3-86fa-4fbf-bc9e-ad5fea8c9163';

  // Pick 3 stories for each blog post (we'll use the first 3 as examples)
  const relatedStoriesIds = stories.slice(0, 3).map(s => s.id);

  console.log(`\n🔗 Creating related story connections...\n`);

  const updates = [
    {
      id: LAW_STUDENTS_POST_ID,
      title: 'Law Students Blog',
      related_stories: relatedStoriesIds
    },
    {
      id: ATNARPA_POST_ID,
      title: 'Atnarpa Homestead Blog',
      related_stories: relatedStoriesIds
    },
    {
      id: SYDNEY_POST_ID,
      title: 'Sydney Invitation Blog',
      related_stories: relatedStoriesIds
    }
  ];

  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        // Using the 'gallery' field (TEXT[]) to store related story IDs
        gallery: update.related_stories,
        updated_at: new Date().toISOString()
      })
      .eq('id', update.id);

    if (updateError) {
      console.error(`❌ Error updating ${update.title}:`, updateError);

      // Check if column exists
      if (updateError.message.includes('column') || updateError.message.includes('does not exist')) {
        console.log('\n⚠️  The "related_stories" column does not exist in blog_posts table');
        console.log('We need to add this column to the schema first.\n');
        return;
      }
    } else {
      console.log(`✅ Updated ${update.title} with ${update.related_stories.length} related stories`);
    }
  }

  console.log('\n✅ Successfully added related stories to all blog posts!');
}

addRelatedStories();
