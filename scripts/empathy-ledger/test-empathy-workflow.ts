import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFullWorkflow() {
  console.log('🧪 Testing Full Empathy Ledger → Oonchiumpa Workflow\n');
  console.log('=' .repeat(60));

  // STEP 1: Get a draft entry
  console.log('\n📋 STEP 1: Get a draft entry...');
  const { data: draftEntry, error: draftError } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('publish_status', 'draft')
    .limit(1)
    .single();

  if (draftError || !draftEntry) {
    console.log('❌ No draft entries found:', draftError?.message);
    return;
  }

  console.log(`✅ Found draft entry: "${draftEntry.title}"`);
  console.log(`   ID: ${draftEntry.id}`);
  console.log(`   Status: ${draftEntry.publish_status}`);
  console.log(`   Ready to publish: ${draftEntry.ready_to_publish}`);

  // STEP 2: Mark as ready to publish
  console.log('\n📝 STEP 2: Marking as ready to publish...');
  const { error: markError } = await supabase.rpc('mark_ready_to_publish', {
    entry_id: draftEntry.id
  });

  if (markError) {
    console.log('❌ Error marking ready:', markError.message);
    return;
  }

  console.log('✅ Marked as ready to publish');

  // Verify entry updated
  const { data: readyEntry } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('id', draftEntry.id)
    .single();

  console.log(`   Status changed: ${draftEntry.publish_status} → ${readyEntry?.publish_status}`);
  console.log(`   Ready to publish: ${readyEntry?.ready_to_publish}`);

  // STEP 3: Check approval queue
  console.log('\n⏳ STEP 3: Checking approval queue...');
  const { data: queueItems, error: queueError } = await supabase
    .from('content_approval_queue')
    .select('*')
    .eq('empathy_entry_id', draftEntry.id);

  if (queueError) {
    console.log('❌ Error checking queue:', queueError.message);
    return;
  }

  if (!queueItems || queueItems.length === 0) {
    console.log('❌ Entry not found in approval queue!');
    return;
  }

  console.log(`✅ Entry added to approval queue`);
  console.log(`   Queue ID: ${queueItems[0].id}`);
  console.log(`   Status: ${queueItems[0].status}`);
  console.log(`   Content type: ${queueItems[0].content_type}`);

  // STEP 4: Approve content
  console.log('\n✅ STEP 4: Approving content...');
  const { error: approveError } = await supabase.rpc('approve_for_publishing', {
    queue_id: queueItems[0].id,
    reviewer_id: null,
    notes: 'Test approval - workflow verification'
  });

  if (approveError) {
    console.log('❌ Error approving:', approveError.message);
    return;
  }

  console.log('✅ Content approved');

  // Verify approval
  const { data: approvedEntry } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('id', draftEntry.id)
    .single();

  console.log(`   Status: ${approvedEntry?.publish_status}`);
  console.log(`   Approved at: ${approvedEntry?.approved_at || 'Not set'}`);

  // Check queue status
  const { data: approvedQueueItem } = await supabase
    .from('content_approval_queue')
    .select('*')
    .eq('id', queueItems[0].id)
    .single();

  console.log(`   Queue status: ${approvedQueueItem?.status}`);

  // STEP 5: Check if ready for sync
  console.log('\n🔄 STEP 5: Checking if ready for sync...');
  const { data: readyToSync, error: syncCheckError } = await supabase
    .from('empathy_entries')
    .select('*')
    .eq('publish_status', 'approved')
    .eq('synced_to_oonchiumpa', false);

  if (syncCheckError) {
    console.log('❌ Error checking sync status:', syncCheckError.message);
    return;
  }

  console.log(`✅ Found ${readyToSync?.length || 0} entries ready to sync`);

  if (readyToSync && readyToSync.length > 0) {
    console.log('\n📊 Entries ready to sync:');
    readyToSync.forEach((entry, idx) => {
      console.log(`   ${idx + 1}. ${entry.title} (${entry.privacy_level})`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ WORKFLOW TEST COMPLETE!');
  console.log('\nNext step: Run the sync script:');
  console.log('   npx tsx empathy-to-oonchiumpa-sync.ts');
  console.log('\nThis will:');
  console.log('   1. Create transcript records');
  console.log('   2. Create outcome records (if impact_indicator exists)');
  console.log('   3. Create story records (if privacy_level = public)');
  console.log('   4. Mark entries as synced');
}

testFullWorkflow().catch(console.error);
