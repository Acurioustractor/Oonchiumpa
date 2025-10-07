// List all Oonchiumpa storytellers with their content
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const OONCHIUMPA_TENANT_ID = 'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6';

async function listStorytellers() {
  console.log("🎭 OONCHIUMPA STORYTELLERS\n");
  console.log("=".repeat(80));

  // Get all Oonchiumpa storytellers
  const { data: storytellers, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .eq('is_storyteller', true)
    .order('full_name');

  if (error) {
    console.error("❌ Error fetching storytellers:", error.message);
    return;
  }

  console.log(`\n📊 Found ${storytellers.length} storytellers\n`);
  console.log("=".repeat(80));

  // Get content counts for each storyteller
  for (const storyteller of storytellers) {
    console.log(`\n👤 ${storyteller.full_name || storyteller.display_name}`);
    console.log("-".repeat(80));

    // Basic info
    if (storyteller.display_name && storyteller.display_name !== storyteller.full_name) {
      console.log(`   Display Name: ${storyteller.display_name}`);
    }
    if (storyteller.email) {
      console.log(`   Email: ${storyteller.email}`);
    }
    if (storyteller.cultural_background) {
      console.log(`   Cultural Background: ${storyteller.cultural_background}`);
    }
    if (storyteller.geographic_connections && storyteller.geographic_connections.length > 0) {
      console.log(`   Locations: ${storyteller.geographic_connections.join(', ')}`);
    }
    if (storyteller.is_elder) {
      console.log(`   🌟 Elder`);
    }
    if (storyteller.profile_image_url) {
      console.log(`   📸 Profile Image: ${storyteller.profile_image_url.substring(0, 60)}...`);
    }

    // Get their stories
    const { data: stories, count: storyCount } = await supabase
      .from('stories')
      .select('id, title, is_public, themes', { count: 'exact' })
      .eq('author_id', storyteller.id)
      .eq('is_public', true);

    // Get their transcripts
    const { data: transcripts, count: transcriptCount } = await supabase
      .from('transcripts')
      .select('id, title, themes, key_quotes, ai_processing_status', { count: 'exact' })
      .eq('storyteller_id', storyteller.id);

    console.log(`\n   📖 Content:`);
    console.log(`      Stories: ${storyCount || 0} published`);
    console.log(`      Transcripts: ${transcriptCount || 0} total`);

    // Count transcripts with AI processing
    const processedTranscripts = transcripts?.filter(t =>
      t.ai_processing_status === 'completed'
    ).length || 0;

    if (processedTranscripts > 0) {
      console.log(`      AI-Processed Transcripts: ${processedTranscripts}`);
    }

    // Count total quotes available
    const totalQuotes = transcripts?.reduce((sum, t) =>
      sum + (t.key_quotes?.length || 0), 0
    ) || 0;

    if (totalQuotes > 0) {
      console.log(`      Available Quotes: ${totalQuotes}`);
    }

    // Show themes
    const allThemes = new Set();
    stories?.forEach(s => s.themes?.forEach(t => allThemes.add(t)));
    transcripts?.forEach(t => t.themes?.forEach(th => allThemes.add(th)));

    if (allThemes.size > 0) {
      console.log(`      Themes: ${Array.from(allThemes).slice(0, 5).join(', ')}`);
      if (allThemes.size > 5) {
        console.log(`              + ${allThemes.size - 5} more...`);
      }
    }

    // Show bio snippet
    if (storyteller.bio) {
      const bioPreview = storyteller.bio.length > 120
        ? storyteller.bio.substring(0, 120) + '...'
        : storyteller.bio;
      console.log(`\n   💬 Bio: ${bioPreview}`);
    }

    // Sample quotes if available
    if (totalQuotes > 0) {
      const quoteSample = transcripts
        ?.flatMap(t => t.key_quotes || [])
        .filter(q => q && q.length > 20)
        .slice(0, 2);

      if (quoteSample && quoteSample.length > 0) {
        console.log(`\n   🗣️  Sample Quotes:`);
        quoteSample.forEach((quote, i) => {
          const preview = quote.length > 100 ? quote.substring(0, 100) + '...' : quote;
          console.log(`      ${i + 1}. "${preview}"`);
        });
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n✨ SUMMARY\n");

  // Overall stats
  const totalStories = storytellers.reduce(async (sum, st) => {
    const { count } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', st.id)
      .eq('is_public', true);
    return (await sum) + (count || 0);
  }, Promise.resolve(0));

  const totalTranscripts = storytellers.reduce(async (sum, st) => {
    const { count } = await supabase
      .from('transcripts')
      .select('*', { count: 'exact', head: true })
      .eq('storyteller_id', st.id);
    return (await sum) + (count || 0);
  }, Promise.resolve(0));

  console.log(`Total Storytellers: ${storytellers.length}`);
  console.log(`With Profile Images: ${storytellers.filter(s => s.profile_image_url).length}`);
  console.log(`Elders: ${storytellers.filter(s => s.is_elder).length}`);
  console.log(`With Bios: ${storytellers.filter(s => s.bio).length}`);

  console.log(`\n📊 Content Distribution:`);

  const withStories = await Promise.all(
    storytellers.map(async st => {
      const { count } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', st.id)
        .eq('is_public', true);
      return count > 0;
    })
  );

  const withTranscripts = await Promise.all(
    storytellers.map(async st => {
      const { count } = await supabase
        .from('transcripts')
        .select('*', { count: 'exact', head: true })
        .eq('storyteller_id', st.id);
      return count > 0;
    })
  );

  console.log(`Storytellers with Published Stories: ${withStories.filter(Boolean).length}`);
  console.log(`Storytellers with Transcripts: ${withTranscripts.filter(Boolean).length}`);
}

listStorytellers();
