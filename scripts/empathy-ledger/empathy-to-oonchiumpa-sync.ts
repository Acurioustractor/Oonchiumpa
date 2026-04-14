#!/usr/bin/env -S npx tsx

/**
 * EMPATHY LEDGER → OONCHIUMPA AUTO-SYNC
 *
 * Purpose: Automatically sync approved content from Empathy Ledger to Oonchiumpa
 * Run: npx tsx empathy-to-oonchiumpa-sync.ts
 * Or: Set up as cron job for automatic syncing
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface EmpathyEntry {
  id: string;
  title: string;
  narrative: string;
  participant_name?: string;
  session_date?: string;
  program_area?: string;
  impact_indicator?: string;
  timeframe?: string;
  key_quote?: string;
  elder_present?: boolean;
  on_country?: boolean;
  cultural_knowledge_shared?: boolean;
  photos?: string[];
  ready_to_publish: boolean;
  publish_status: string;
  privacy_level: string;
}

async function syncEmpathyToOonchiumpa() {
  console.log('🔄 Starting Empathy Ledger → Oonchiumpa Sync\n');
  console.log('=' .repeat(80));

  try {
    // 1. Get approved entries ready to sync
    const { data: entries, error: fetchError } = await supabase
      .from('empathy_entries')
      .select('*')
      .eq('publish_status', 'approved')
      .eq('synced_to_oonchiumpa', false);

    if (fetchError) {
      console.error('❌ Error fetching empathy entries:', fetchError);
      return;
    }

    if (!entries || entries.length === 0) {
      console.log('ℹ️  No entries ready to sync.\n');
      console.log('Entries need to be:');
      console.log('  - publish_status = "approved"');
      console.log('  - synced_to_oonchiumpa = false\n');
      return;
    }

    console.log(`\n📋 Found ${entries.length} entries ready to sync:\n`);

    let successCount = 0;
    let failCount = 0;

    for (const entry of entries) {
      console.log(`\n📄 Processing: ${entry.title}`);
      console.log(`   ID: ${entry.id}`);
      console.log(`   Privacy: ${entry.privacy_level || 'private'}`);

      try {
        const syncResult = await syncEntry(entry);

        if (syncResult.success) {
          successCount++;
          console.log(`   ✅ Success!`);

          // Mark as synced
          await supabase
            .from('empathy_entries')
            .update({
              synced_to_oonchiumpa: true,
              sync_date: new Date().toISOString(),
              publish_status: 'synced',
              linked_story_id: syncResult.storyId,
              linked_outcome_id: syncResult.outcomeId,
              linked_transcript_id: syncResult.transcriptId
            })
            .eq('id', entry.id);

          // Log sync
          await logSync(entry.id, 'all', 'success', syncResult);

        } else {
          failCount++;
          console.log(`   ❌ Failed: ${syncResult.error}`);

          // Log failure
          await logSync(entry.id, 'all', 'failed', { error: syncResult.error });
        }

      } catch (error: any) {
        failCount++;
        console.error(`   ❌ Error: ${error.message}`);
        await logSync(entry.id, 'all', 'failed', { error: error.message });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SYNC SUMMARY:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📝 Total: ${entries.length}\n`);

  } catch (error: any) {
    console.error('\n❌ Fatal sync error:', error.message);
  }
}

async function syncEntry(entry: EmpathyEntry) {
  const results: any = {
    success: false,
    storyId: null,
    outcomeId: null,
    transcriptId: null,
    error: null
  };

  try {
    // 1. Create Transcript (always - this is the source document)
    console.log('   📝 Creating transcript...');
    const { data: transcript, error: transcriptError } = await supabase
      .from('transcripts')
      .insert({
        title: entry.title,
        transcript_content: entry.narrative,
        storyteller_id: null, // Could map from empathy entry if you track this
        tenant_id: OONCHIUMPA_TENANT_ID,
        status: 'completed',
        source_empathy_entry_id: entry.id,
        sync_date: new Date().toISOString(),
        privacy_level: entry.privacy_level || 'internal'
      })
      .select()
      .single();

    if (transcriptError) {
      results.error = `Transcript creation failed: ${transcriptError.message}`;
      return results;
    }

    results.transcriptId = transcript.id;
    console.log(`      ✓ Transcript created: ${transcript.id}`);

    // 2. Create Outcome (if impact indicator exists)
    if (entry.impact_indicator) {
      console.log('   🎯 Creating outcome...');
      const { data: outcome, error: outcomeError } = await supabase
        .from('outcomes')
        .insert({
          organization_id: OONCHIUMPA_ORG_ID,
          tenant_id: OONCHIUMPA_TENANT_ID,
          title: entry.impact_indicator,
          description: entry.narrative,
          outcome_type: 'individual',
          outcome_level: determineOutcomeLevel(entry.timeframe),
          service_area: entry.program_area || 'youth_mentorship',
          indicator_name: entry.impact_indicator,
          qualitative_evidence: entry.key_quote ? [entry.key_quote] : [],
          success_stories: [entry.narrative],
          participant_count: entry.participant_name ? 1 : null,
          elder_involvement: entry.elder_present || false,
          on_country_component: entry.on_country || false,
          traditional_knowledge_transmitted: entry.cultural_knowledge_shared || false,
          measurement_date: entry.session_date || new Date().toISOString().split('T')[0],
          source_document_ids: [transcript.id],
          source_empathy_entry_id: entry.id,
          sync_date: new Date().toISOString()
        })
        .select()
        .single();

      if (outcomeError) {
        console.log(`      ⚠️  Outcome creation failed: ${outcomeError.message}`);
      } else {
        results.outcomeId = outcome.id;
        console.log(`      ✓ Outcome created: ${outcome.id}`);

        // Link transcript to outcome
        await supabase
          .from('document_outcomes')
          .insert({
            document_id: transcript.id,
            outcome_id: outcome.id,
            evidence_type: 'qualitative',
            extraction_method: 'manual',
            evidence_text: entry.key_quote || entry.narrative.substring(0, 200)
          });
      }
    }

    // 3. Create Story (if privacy_level is public)
    if (entry.privacy_level === 'public') {
      console.log('   📖 Creating public story...');
      const { data: story, error: storyError} = await supabase
        .from('stories')
        .insert({
          tenant_id: OONCHIUMPA_TENANT_ID,
          organization_id: OONCHIUMPA_ORG_ID,
          // author_id is nullable for Empathy Ledger synced stories
          title: entry.title,
          content: entry.narrative,
          story_category: entry.service_area || 'community',
          is_public: true,
          source_empathy_entry_id: entry.id,
          sync_date: new Date().toISOString(),
          privacy_level: 'public',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (storyError) {
        console.log(`      ⚠️  Story creation failed: ${storyError.message}`);
      } else {
        results.storyId = story.id;
        console.log(`      ✓ Story created: ${story.id}`);
      }
    } else {
      console.log(`   ℹ️  Skipping story (privacy: ${entry.privacy_level})`);
    }

    // 4. Sync Photos from media_urls (if any)
    if (entry.media_urls && entry.media_urls.length > 0) {
      console.log(`   📸 Syncing ${entry.media_urls.length} photos...`);

      for (const photoUrl of entry.media_urls) {
        const { data: photo, error: photoError } = await supabase
          .from('gallery_photos')
          .insert({
            photo_url: photoUrl,
            caption: entry.title,
            photographer: entry.storyteller_name,
            source_empathy_entry_id: entry.id,
            sync_date: new Date().toISOString(),
            privacy_level: entry.privacy_level || 'internal'
          })
          .select()
          .single();

        if (photoError) {
          console.log(`      ⚠️  Photo sync failed: ${photoError.message}`);
        } else {
          results.mediaIds = results.mediaIds || [];
          results.mediaIds.push(photo.id);
          console.log(`      ✓ Photo synced: ${photo.id}`);
        }
      }
    }

    results.success = true;
    return results;

  } catch (error: any) {
    results.error = error.message;
    return results;
  }
}

function determineOutcomeLevel(timeframe?: string): string {
  if (!timeframe) return 'short_term';

  const t = timeframe.toLowerCase();
  if (t.includes('immediate') || t.includes('instant')) return 'output';
  if (t.includes('week') || t.includes('days')) return 'short_term';
  if (t.includes('month')) return 'medium_term';
  if (t.includes('year')) return 'long_term';
  if (t.includes('lasting') || t.includes('permanent')) return 'impact';

  return 'short_term';
}

async function logSync(entryId: string, syncType: string, status: string, details: any) {
  try {
    await supabase
      .from('empathy_sync_log')
      .insert({
        empathy_entry_id: entryId,
        sync_type: syncType,
        sync_status: status,
        created_story_id: details.storyId,
        created_outcome_id: details.outcomeId,
        created_transcript_id: details.transcriptId,
        error_message: details.error,
        synced_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log sync:', error);
  }
}

// Run the sync
syncEmpathyToOonchiumpa()
  .then(() => {
    console.log('\n✨ Sync complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
