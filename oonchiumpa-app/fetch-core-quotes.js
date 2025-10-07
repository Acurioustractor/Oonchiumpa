/**
 * Fetch actual quotes from core team members in Supabase
 * Run this to get real quotes for the website
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Core team member IDs
const CORE_TEAM_IDS = {
  kristy_bloomfield: 'b59a1f4c-94fd-4805-a2c5-cac0922133e0',
  tanya_turner: 'dc85700d-f139-46fa-9074-6afee55ea801',
  aunty_bev_terry: 'f8e99ed8-723a-48bc-a346-40f4f7a4032e',
  adelaide_hayes: 'faa011c7-0343-409a-8e56-c35c9d83b58d',
  aidan_harris: 'e948d0a2-2d77-429d-a538-7d03ace499ad',
  chelsea_kenneally: '28d3d9ea-3e0c-4642-b6d8-a6ebc22cac23',
  suzie_ma: 'a16991fb-11eb-4ac9-89df-c7994a2b9617',
};

async function fetchQuotesForPerson(personId, personName) {
  console.log(`\n📝 Fetching quotes for ${personName}...`);

  const { data, error } = await supabase
    .from('transcripts')
    .select(`
      id,
      title,
      key_quotes,
      themes,
      ai_summary,
      cultural_sensitivity,
      storyteller:profiles!storyteller_id(full_name, display_name, bio)
    `)
    .eq('storyteller_id', personId)
    .eq('ai_processing_status', 'completed')
    .not('key_quotes', 'is', null);

  if (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }

  if (!data || data.length === 0) {
    console.log(`  ℹ️  No quotes found`);
    return null;
  }

  console.log(`  ✅ Found ${data.length} transcript(s) with quotes`);

  return {
    personName,
    personId,
    profile: data[0].storyteller,
    transcripts: data.map(t => ({
      title: t.title,
      quotes: t.key_quotes,
      themes: t.themes,
      summary: t.ai_summary,
      sensitivity: t.cultural_sensitivity
    }))
  };
}

async function main() {
  console.log('🎯 Fetching Core Team Quotes from Supabase\n');
  console.log('='.repeat(60));

  // Fetch quotes for key people
  const people = [
    { id: CORE_TEAM_IDS.aunty_bev_terry, name: 'Aunty Bev & Uncle Terry' },
    { id: CORE_TEAM_IDS.adelaide_hayes, name: 'Adelaide Hayes' },
    { id: CORE_TEAM_IDS.aidan_harris, name: 'Aidan Harris' },
    { id: CORE_TEAM_IDS.chelsea_kenneally, name: 'Chelsea Kenneally' },
    { id: CORE_TEAM_IDS.suzie_ma, name: 'Suzie Ma' },
  ];

  const results = [];

  for (const person of people) {
    const result = await fetchQuotesForPerson(person.id, person.name);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎨 FORMATTED QUOTES FOR WEBSITE:\n');

  results.forEach(person => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`\n👤 ${person.personName}`);
    console.log(`📋 Bio: ${person.profile?.bio?.substring(0, 150)}...`);

    person.transcripts.forEach((transcript, idx) => {
      console.log(`\n  📄 Transcript ${idx + 1}: ${transcript.title || 'Untitled'}`);
      console.log(`  🏷️  Themes: ${transcript.themes?.join(', ') || 'None'}`);
      console.log(`  🛡️  Sensitivity: ${transcript.sensitivity}`);
      console.log(`\n  💬 Quotes:`);

      transcript.quotes?.forEach((quote, qIdx) => {
        console.log(`\n    ${qIdx + 1}. "${quote}"`);
      });
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:\n');

  results.forEach(person => {
    const totalQuotes = person.transcripts.reduce((sum, t) => sum + (t.quotes?.length || 0), 0);
    console.log(`  ${person.personName}: ${totalQuotes} quotes from ${person.transcripts.length} transcript(s)`);
  });

  console.log('\n✨ Done!\n');

  // Output as JSON for easy copying
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 JSON OUTPUT (for easy integration):\n');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
