import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
  console.log('🔍 Verifying Empathy Ledger schema...\n');

  try {
    // Check empathy_entries table
    console.log('1️⃣ Checking empathy_entries table...');
    const { data: entries, error: entriesError } = await supabase
      .from('empathy_entries')
      .select('count')
      .limit(1);

    if (entriesError) {
      console.log('   ❌ Error:', entriesError.message);
    } else {
      console.log('   ✅ empathy_entries table exists');
    }

    // Check content_approval_queue table
    console.log('\n2️⃣ Checking content_approval_queue table...');
    const { data: queue, error: queueError } = await supabase
      .from('content_approval_queue')
      .select('count')
      .limit(1);

    if (queueError) {
      console.log('   ❌ Error:', queueError.message);
    } else {
      console.log('   ✅ content_approval_queue table exists');
    }

    // Check empathy_sync_log table
    console.log('\n3️⃣ Checking empathy_sync_log table...');
    const { data: syncLog, error: syncLogError } = await supabase
      .from('empathy_sync_log')
      .select('count')
      .limit(1);

    if (syncLogError) {
      console.log('   ❌ Error:', syncLogError.message);
    } else {
      console.log('   ✅ empathy_sync_log table exists');
    }

    // Check for existing organizations to get Oonchiumpa org ID
    console.log('\n4️⃣ Finding Oonchiumpa organization ID...');
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name')
      .ilike('name', '%oonchiumpa%')
      .limit(1);

    if (orgsError) {
      console.log('   ❌ Error:', orgsError.message);
    } else if (orgs && orgs.length > 0) {
      console.log(`   ✅ Found organization: ${orgs[0].name}`);
      console.log(`   📋 Organization ID: ${orgs[0].id}`);
      return orgs[0].id;
    } else {
      console.log('   ⚠️  No Oonchiumpa organization found');
      console.log('   💡 You may need to create an organization first');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  return null;
}

async function createTestData(orgId: string) {
  console.log('\n\n🎨 Creating test empathy entries...\n');

  const testEntries = [
    {
      organization_id: orgId,
      title: 'Young person returns to school after cultural healing',
      narrative: 'After participating in our on-country cultural healing program, a 15-year-old who had been disengaged from school for 18 months returned to complete Year 10. The program helped him reconnect with his identity and find purpose. He now mentors younger kids and wants to become a teacher.',
      storyteller_name: 'Cultural Program Coordinator',
      storyteller_consent: true,
      impact_indicator: 'Youth returning to education',
      outcome_level: 'medium_term',
      timeframe: '6-12 months',
      service_area: 'Youth Mentorship & Cultural Healing',
      privacy_level: 'public',
      publish_status: 'draft'
    },
    {
      organization_id: orgId,
      title: 'Elder shares story during True Justice session',
      narrative: 'During a True Justice deep listening session, an Elder shared his story of growing up on country and the changes he has witnessed over his lifetime. This story became part of our cultural knowledge archive and was used in educational materials for law students.',
      storyteller_name: 'Uncle James',
      storyteller_consent: true,
      impact_indicator: 'Cultural knowledge preserved and shared',
      outcome_level: 'long_term',
      timeframe: '2+ years',
      service_area: 'True Justice: Deep Listening on Country',
      privacy_level: 'internal',
      publish_status: 'draft'
    },
    {
      organization_id: orgId,
      title: 'Family reconnects through on-country experience',
      narrative: 'A family from Alice Springs participated in an Atnarpa Homestead experience. The parents shared how being on country together helped their teenage children understand their cultural heritage in a way that city life never could. The family now visits country regularly.',
      storyteller_name: 'Community Member',
      storyteller_consent: true,
      impact_indicator: 'Families strengthening cultural connections',
      outcome_level: 'short_term',
      timeframe: '3-6 months',
      service_area: 'Atnarpa Homestead On-Country Experiences',
      privacy_level: 'public',
      publish_status: 'draft'
    }
  ];

  for (const entry of testEntries) {
    const { data, error } = await supabase
      .from('empathy_entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.log(`❌ Error creating entry: ${entry.title}`);
      console.log(`   ${error.message}`);
    } else {
      console.log(`✅ Created: ${entry.title}`);
      console.log(`   Status: ${entry.publish_status} | Privacy: ${entry.privacy_level}`);
    }
  }

  console.log('\n✨ Test data creation complete!');
}

// Run verification and test data creation
(async () => {
  const orgId = await verifySchema();

  if (orgId) {
    const createTests = process.argv.includes('--create-test-data');

    if (createTests) {
      await createTestData(orgId);
    } else {
      console.log('\n💡 To create test data, run:');
      console.log('   npx tsx verify-empathy-schema.ts --create-test-data');
    }
  }

  console.log('\n🎉 Schema verification complete!');
  console.log('\n📱 View the Empathy Ledger UI at:');
  console.log('   http://localhost:3001/staff-portal/empathy-ledger');
})();
