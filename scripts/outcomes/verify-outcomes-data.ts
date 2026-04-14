#!/usr/bin/env -S npx tsx

/**
 * Verifies outcomes data imported to Supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyData() {
  console.log('🔍 Verifying Outcomes Data in Supabase\n');
  console.log('='.repeat(80) + '\n');

  // Count outcomes by service area
  const { data: outcomes, error: outcomesError } = await supabase
    .from('outcomes')
    .select('*');

  if (outcomesError) {
    console.error('❌ Error fetching outcomes:', outcomesError);
    return;
  }

  console.log(`✅ Total Outcomes: ${outcomes?.length || 0}\n`);

  // Group by service area
  const byService: Record<string, any[]> = {};
  outcomes?.forEach(outcome => {
    if (!byService[outcome.service_area]) {
      byService[outcome.service_area] = [];
    }
    byService[outcome.service_area].push(outcome);
  });

  console.log('📊 Outcomes by Service Area:\n');
  Object.entries(byService).forEach(([service, items]) => {
    console.log(`   ${service}: ${items.length} outcomes`);
    items.forEach(item => {
      console.log(`      • ${item.indicator_name} (${item.outcome_level})`);
    });
    console.log('');
  });

  // Group by outcome level
  const byLevel: Record<string, number> = {};
  outcomes?.forEach(outcome => {
    byLevel[outcome.outcome_level] = (byLevel[outcome.outcome_level] || 0) + 1;
  });

  console.log('📈 Outcomes by Level:\n');
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`   ${level}: ${count}`);
  });
  console.log('');

  // Cultural indicators
  const withElders = outcomes?.filter(o => o.elder_involvement).length || 0;
  const onCountry = outcomes?.filter(o => o.on_country_component).length || 0;
  const withTradKnowledge = outcomes?.filter(o => o.traditional_knowledge_transmitted).length || 0;

  console.log('🏞️  Cultural Indicators:\n');
  console.log(`   Elder Involvement: ${withElders} outcomes`);
  console.log(`   On Country: ${onCountry} outcomes`);
  console.log(`   Traditional Knowledge: ${withTradKnowledge} outcomes`);
  console.log('');

  // Check document_outcomes linkages
  const { data: linkages, error: linkagesError } = await supabase
    .from('document_outcomes')
    .select('*');

  console.log(`🔗 Document-Outcome Links: ${linkages?.length || 0}\n`);

  // Check activities
  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('*');

  console.log(`🎯 Activities: ${activities?.length || 0}\n`);

  console.log('='.repeat(80));
  console.log('\n✅ Verification Complete!\n');

  console.log('Next Steps:');
  console.log('1. View data in Supabase: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/editor');
  console.log('2. Test visualization pages at: http://localhost:3001/staff-portal/impact');
  console.log('3. Review impact dashboard for each service\n');
}

verifyData()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
