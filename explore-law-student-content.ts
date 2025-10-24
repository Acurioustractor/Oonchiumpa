import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function exploreLawStudentContent() {
  console.log('🔍 Exploring law student content in Supabase...\n');

  // Check for stories related to law students
  console.log('📚 Checking stories...');
  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('*')
    .or('title.ilike.%law%,content.ilike.%law student%,tags.cs.{law}');

  if (!storiesError && stories) {
    console.log(`Found ${stories.length} law-related stories:\n`);
    stories.forEach(story => {
      console.log(`- ${story.title}`);
      console.log(`  Tags: ${story.tags?.join(', ')}`);
      console.log(`  Content preview: ${story.content?.substring(0, 150)}...`);
      if (story.media_urls && story.media_urls.length > 0) {
        console.log(`  Media: ${story.media_urls.length} items`);
      }
      console.log('');
    });
  } else {
    console.log('Error or no stories found:', storiesError?.message);
  }

  // Check for any interview/transcript tables
  console.log('\n🎤 Checking for interview/transcript data...');
  const { data: interviews, error: interviewsError } = await supabase
    .from('interviews')
    .select('*')
    .limit(5);

  if (!interviewsError && interviews) {
    console.log(`Found ${interviews.length} interviews`);
    interviews.forEach(interview => {
      console.log(`- ${interview.title || interview.id}`);
      if (interview.transcript) {
        console.log(`  Has transcript: ${interview.transcript.substring(0, 100)}...`);
      }
    });
  } else {
    console.log('No interviews table or error:', interviewsError?.message);
  }

  // Check photo_projects for law student trip photos
  console.log('\n📸 Checking photo projects...');
  const { data: photos, error: photosError } = await supabase
    .from('photo_projects')
    .select('*');

  if (!photosError && photos) {
    console.log(`Found ${photos.length} photo projects`);
    photos.forEach(project => {
      console.log(`- ${project.title}: ${project.photo_count || 0} photos`);
      if (project.description) {
        console.log(`  ${project.description.substring(0, 100)}...`);
      }
    });
  } else {
    console.log('No photo projects or error:', photosError?.message);
  }

  // Search for any tables with "law" or "student" content
  console.log('\n🔎 Checking all tables for law student content...');

  // Try common table names
  const tablesToCheck = ['reflections', 'testimonials', 'quotes', 'participants', 'transcripts'];

  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        console.log(`✅ Found table: ${tableName}`);
        console.log(`   Sample data:`, Object.keys(data[0]).join(', '));
      }
    } catch (e) {
      // Table doesn't exist, skip
    }
  }
}

exploreLawStudentContent()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
