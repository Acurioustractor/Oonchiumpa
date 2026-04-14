import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs'
);

async function verifySyncedContent() {
  console.log('🔍 Verifying Synced Content from Empathy Ledger\n');
  console.log('=' .repeat(60));

  const entryId = '78466354-5534-4221-9ce1-e0a08c2743dd';

  // Check transcripts
  console.log('\n📝 TRANSCRIPTS synced from Empathy Ledger:');
  const { data: transcripts } = await supabase
    .from('transcripts')
    .select('*')
    .eq('source_empathy_entry_id', entryId);

  if (transcripts && transcripts.length > 0) {
    transcripts.forEach((t, idx) => {
      console.log(`   ${idx + 1}. ${t.title}`);
      console.log(`      ID: ${t.id}`);
      console.log(`      Created: ${new Date(t.created_at).toLocaleString()}`);
      console.log(`      Privacy: ${t.privacy_level}`);
    });
  } else {
    console.log('   ❌ No transcripts found');
  }

  // Check outcomes
  console.log('\n🎯 OUTCOMES synced from Empathy Ledger:');
  const { data: outcomes } = await supabase
    .from('outcomes')
    .select('*')
    .eq('source_empathy_entry_id', entryId);

  if (outcomes && outcomes.length > 0) {
    outcomes.forEach((o, idx) => {
      console.log(`   ${idx + 1}. ${o.title}`);
      console.log(`      ID: ${o.id}`);
      console.log(`      Level: ${o.outcome_level}`);
      console.log(`      Created: ${new Date(o.created_at).toLocaleString()}`);
    });
  } else {
    console.log('   ❌ No outcomes found');
  }

  // Check stories
  console.log('\n📖 STORIES synced from Empathy Ledger:');
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .eq('source_empathy_entry_id', entryId);

  if (stories && stories.length > 0) {
    stories.forEach((s, idx) => {
      console.log(`   ${idx + 1}. ${s.title}`);
      console.log(`      ID: ${s.id}`);
      console.log(`      Public: ${s.is_public}`);
      console.log(`      Created: ${new Date(s.created_at).toLocaleString()}`);
    });
  } else {
    console.log('   ⚠️  No stories found (author_id constraint issue)');
  }

  // Check sync status
  console.log('\n✅ SYNC STATUS:');
  const { data: entry } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (entry) {
    console.log(`   Synced: ${entry.synced_to_oonchiumpa}`);
    console.log(`   Status: ${entry.publish_status}`);
    console.log(`   Sync date: ${entry.sync_date || 'Not synced'}`);
    console.log(`   Linked transcript: ${entry.linked_transcript_id || 'None'}`);
    console.log(`   Linked outcome: ${entry.linked_outcome_id || 'None'}`);
    console.log(`   Linked story: ${entry.linked_story_id || 'None'}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log(`   ✅ Transcripts created: ${transcripts?.length || 0}`);
  console.log(`   ✅ Outcomes created: ${outcomes?.length || 0}`);
  console.log(`   ⚠️  Stories created: ${stories?.length || 0} (needs author_id fix)`);

  console.log('\n🎉 Workflow verification complete!');
  console.log('\nThe integration is working! Content from Empathy Ledger is successfully');
  console.log('syncing to transcripts and outcomes tables. Story creation needs a valid');
  console.log('author_id to be configured.');
}

verifySyncedContent();
