// Extract quotes from Kristy Bloomfield and Tanya Turner for website
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const LEADERSHIP_IDS = {
  kristy_bloomfield: 'b59a1f4c-94fd-4805-a2c5-cac0922133e0',
  tanya_turner: 'dc85700d-f139-46fa-9074-6afee55ea801',
};

async function extractQuotes() {
  console.log("🗣️  EXTRACTING LEADERSHIP QUOTES\n");
  console.log("=".repeat(80));

  for (const [name, id] of Object.entries(LEADERSHIP_IDS)) {
    console.log(`\n📋 ${name.replace('_', ' ').toUpperCase()}`);
    console.log("-".repeat(80));

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profile) {
      console.log(`\nName: ${profile.full_name}`);
      console.log(`\nBio:\n${profile.bio}\n`);
    }

    // Get their transcripts with quotes
    const { data: transcripts } = await supabase
      .from('transcripts')
      .select('id, title, key_quotes, themes, ai_summary')
      .eq('storyteller_id', id)
      .eq('ai_processing_status', 'completed')
      .not('key_quotes', 'is', null);

    if (transcripts && transcripts.length > 0) {
      console.log(`\n💬 QUOTES FROM TRANSCRIPTS (${transcripts.length} transcripts):\n`);

      transcripts.forEach((transcript, idx) => {
        console.log(`\n${idx + 1}. Transcript: ${transcript.title || 'Untitled'}`);
        if (transcript.themes && transcript.themes.length > 0) {
          console.log(`   Themes: ${transcript.themes.join(', ')}`);
        }
        if (transcript.ai_summary) {
          console.log(`   Summary: ${transcript.ai_summary.substring(0, 150)}...`);
        }

        if (transcript.key_quotes && transcript.key_quotes.length > 0) {
          console.log(`\n   Quotes:`);
          transcript.key_quotes.forEach((quote, qIdx) => {
            console.log(`\n   ${qIdx + 1}. "${quote}"`);
          });
        }
        console.log('');
      });

      // Collect all quotes
      const allQuotes = transcripts.flatMap(t => t.key_quotes || []);
      console.log(`\n📊 TOTAL QUOTES AVAILABLE: ${allQuotes.length}`);
    }

    // Get their stories
    const { data: stories } = await supabase
      .from('stories')
      .select('id, title, summary, themes')
      .eq('author_id', id)
      .eq('is_public', true);

    if (stories && stories.length > 0) {
      console.log(`\n\n📖 PUBLISHED STORIES (${stories.length}):\n`);

      stories.forEach((story, idx) => {
        console.log(`\n${idx + 1}. ${story.title}`);
        if (story.themes && story.themes.length > 0) {
          console.log(`   Themes: ${story.themes.join(', ')}`);
        }
        if (story.summary) {
          console.log(`   Summary: ${story.summary.substring(0, 200)}...`);
        }
      });
    }

    console.log("\n" + "=".repeat(80));
  }

  console.log("\n\n✨ QUOTE EXTRACTION COMPLETE\n");
}

extractQuotes();
