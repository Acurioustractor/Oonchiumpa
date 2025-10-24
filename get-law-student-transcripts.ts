import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getLawStudentTranscripts() {
  console.log('🎓 Getting law student transcripts...\n');

  const { data: transcripts, error } = await supabase
    .from('transcripts')
    .select('*')
    .or('title.ilike.%law%,title.ilike.%student%,title.ilike.%ANU%,transcript_content.ilike.%law student%');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${transcripts?.length || 0} law-related transcripts\n`);

  transcripts?.forEach((transcript, index) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TRANSCRIPT ${index + 1}: ${transcript.title || 'Untitled'}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`ID: ${transcript.id}`);
    console.log(`Recording Date: ${transcript.recording_date || 'N/A'}`);
    console.log(`Duration: ${transcript.duration_seconds ? `${Math.floor(transcript.duration_seconds / 60)} min` : 'N/A'}`);
    console.log(`Word Count: ${transcript.word_count || 'N/A'}`);

    if (transcript.video_url || transcript.source_video_url) {
      console.log(`\n📹 VIDEO:`);
      console.log(`  URL: ${transcript.video_url || transcript.source_video_url}`);
      console.log(`  Platform: ${transcript.source_video_platform || 'N/A'}`);
      console.log(`  Thumbnail: ${transcript.source_video_thumbnail || 'N/A'}`);
    }

    if (transcript.key_quotes && transcript.key_quotes.length > 0) {
      console.log(`\n💬 KEY QUOTES (${transcript.key_quotes.length}):`);
      transcript.key_quotes.slice(0, 3).forEach((quote: string, i: number) => {
        console.log(`  ${i + 1}. "${quote.substring(0, 150)}..."`);
      });
    }

    if (transcript.themes && transcript.themes.length > 0) {
      console.log(`\n🏷️  THEMES: ${transcript.themes.join(', ')}`);
    }

    if (transcript.ai_summary) {
      console.log(`\n📝 SUMMARY:`);
      console.log(`  ${transcript.ai_summary.substring(0, 200)}...`);
    }

    if (transcript.transcript_content) {
      console.log(`\n📄 CONTENT PREVIEW:`);
      console.log(`  ${transcript.transcript_content.substring(0, 300)}...\n`);
    }
  });

  // Also check for any stories with law student content
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('Checking stories table for law student content...');
  console.log(`${'='.repeat(80)}\n`);

  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .or('title.ilike.%law%,content.ilike.%law student%,content.ilike.%ANU%');

  if (stories && stories.length > 0) {
    console.log(`Found ${stories.length} stories:\n`);
    stories.forEach(story => {
      console.log(`- ${story.title}`);
      console.log(`  Created: ${story.created_at}`);
      if (story.media_urls && story.media_urls.length > 0) {
        console.log(`  Media URLs: ${story.media_urls.length}`);
        story.media_urls.forEach((url: string) => console.log(`    - ${url}`));
      }
      console.log('');
    });
  }
}

getLawStudentTranscripts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
