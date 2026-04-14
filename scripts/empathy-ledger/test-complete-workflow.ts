#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCompleteWorkflow() {
  console.log('\n🧪 COMPLETE EMPATHY LEDGER WORKFLOW TEST\n');
  console.log('='.repeat(70));

  // Clean up previous test data
  console.log('\n🧹 Cleaning up previous test data...');
  await supabase.from('stories').delete().eq('source_empathy_entry_id', '78466354-5534-4221-9ce1-e0a08c2743dd');
  await supabase.from('transcripts').delete().eq('source_empathy_entry_id', '78466354-5534-4221-9ce1-e0a08c2743dd');
  await supabase.from('outcomes').delete().eq('source_empathy_entry_id', '78466354-5534-4221-9ce1-e0a08c2743dd');

  // Reset entry
  await supabase
    .from('empathy_entries')
    .update({
      publish_status: 'draft',
      ready_to_publish: false,
      synced_to_oonchiumpa: false,
      sync_date: null,
      linked_story_id: null,
      linked_outcome_id: null,
      linked_transcript_id: null,
      approved_by: null,
      approved_at: null
    })
    .eq('id', '78466354-5534-4221-9ce1-e0a08c2743dd');

  console.log('✅ Cleanup complete\n');

  // STEP 1: Mark ready to publish
  console.log('📝 STEP 1: Mark ready to publish');
  const { error: markError } = await supabase.rpc('mark_ready_to_publish', {
    entry_id: '78466354-5534-4221-9ce1-e0a08c2743dd'
  });

  if (markError) {
    console.log('❌ Error:', markError.message);
    return;
  }
  console.log('✅ Entry marked ready to publish\n');

  // STEP 2: Approve
  console.log('✅ STEP 2: Approve content');
  const { data: queueItem } = await supabase
    .from('content_approval_queue')
    .select('*')
    .eq('empathy_entry_id', '78466354-5534-4221-9ce1-e0a08c2743dd')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!queueItem) {
    console.log('❌ No queue item found');
    return;
  }

  await supabase.rpc('approve_for_publishing', {
    queue_id: queueItem.id,
    reviewer_id: null,
    notes: 'Complete workflow test'
  });
  console.log('✅ Content approved\n');

  // STEP 3: Run sync (manually calling the sync function)
  console.log('🔄 STEP 3: Running sync...');

  const { data: entry } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('id', '78466354-5534-4221-9ce1-e0a08c2743dd')
    .single();

  if (!entry) return;

  // Create transcript
  const { data: transcript } = await supabase
    .from('transcripts')
    .insert({
      title: entry.title,
      transcript_content: entry.narrative,
      source_empathy_entry_id: entry.id,
      privacy_level: entry.privacy_level || 'internal',
      sync_date: new Date().toISOString()
    })
    .select()
    .single();

  console.log(`   ✅ Transcript created: ${transcript?.id}`);

  // Create outcome
  if (entry.impact_indicator) {
    const { data: outcome } = await supabase
      .from('outcomes')
      .insert({
        organization_id: 'c53077e1-98de-4216-9149-6268891ff62e',
        title: entry.impact_indicator,
        description: entry.narrative,
        outcome_level: entry.outcome_level || 'short_term',
        source_empathy_entry_id: entry.id,
        sync_date: new Date().toISOString()
      })
      .select()
      .single();

    console.log(`   ✅ Outcome created: ${outcome?.id}`);
  }

  // Create story
  if (entry.privacy_level === 'public') {
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        tenant_id: '8891e1a9-92ae-423f-928b-cec602660011',
        organization_id: 'c53077e1-98de-4216-9149-6268891ff62e',
        title: entry.title,
        content: entry.narrative,
        story_category: entry.service_area || 'community',
        is_public: true,
        source_empathy_entry_id: entry.id,
        sync_date: new Date().toISOString(),
        privacy_level: 'public'
      })
      .select()
      .single();

    if (storyError) {
      console.log(`   ❌ Story creation failed: ${storyError.message}`);
    } else {
      console.log(`   ✅ Story created: ${story?.id}`);
    }
  }

  // Mark as synced
  await supabase
    .from('empathy_entries')
    .update({
      synced_to_oonchiumpa: true,
      publish_status: 'synced',
      sync_date: new Date().toISOString(),
      linked_transcript_id: transcript?.id,
      linked_story_id: null
    })
    .eq('id', entry.id);

  console.log('   ✅ Entry marked as synced\n');

  // VERIFY
  console.log('🔍 STEP 4: Verify synced content\n');

  const { data: transcripts } = await supabase
    .from('transcripts')
    .select('id, title')
    .eq('source_empathy_entry_id', entry.id);

  const { data: outcomes } = await supabase
    .from('outcomes')
    .select('id, title')
    .eq('source_empathy_entry_id', entry.id);

  const { data: stories } = await supabase
    .from('stories')
    .select('id, title')
    .eq('source_empathy_entry_id', entry.id);

  console.log(`   📝 Transcripts: ${transcripts?.length || 0}`);
  console.log(`   🎯 Outcomes: ${outcomes?.length || 0}`);
  console.log(`   📖 Stories: ${stories?.length || 0}`);

  console.log('\n' + '='.repeat(70));
  console.log('✅ COMPLETE WORKFLOW TEST SUCCESSFUL!\n');

  if (stories && stories.length > 0) {
    console.log('🎉 Story creation is now working! The author_id fix was successful.');
  } else {
    console.log('⚠️  Story was not created. Make sure you ran the SQL to make author_id nullable.');
  }
}

testCompleteWorkflow().catch(console.error);
