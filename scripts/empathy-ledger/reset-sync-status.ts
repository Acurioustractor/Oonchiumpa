import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k'
);

async function resetSyncStatus() {
  console.log('🔄 Resetting sync status for testing...\n');

  // Reset the entry back to approved, not synced
  const { error } = await supabase
    .from('empathy_entries')
    .update({
      synced_to_oonchiumpa: false,
      sync_date: null,
      publish_status: 'approved',
      linked_story_id: null,
      linked_outcome_id: null,
      linked_transcript_id: null
    })
    .eq('title', 'Young person returns to school after cultural healing');

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log('✅ Reset complete! Entry is ready for sync again.');
  console.log('\nYou can now run:');
  console.log('   npx tsx empathy-to-oonchiumpa-sync.ts');
}

resetSyncStatus();
