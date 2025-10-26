#!/usr/bin/env tsx

/**
 * Get Oonchiumpa's organization_id from the database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getOonchiumpaOrg() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@oonchiumpa.org',
    password: 'OonchiumpaTest2024!'
  });

  if (authError) {
    console.error('Auth failed');
    return;
  }

  console.log('🔍 Finding Oonchiumpa Organization...\n');

  // Method 1: Search by name
  const { data: orgsByName } = await supabase
    .from('organizations')
    .select('*')
    .ilike('name', '%oonchiumpa%');

  console.log('Organizations matching "Oonchiumpa":');
  if (orgsByName && orgsByName.length > 0) {
    orgsByName.forEach(org => {
      console.log(`  ✅ ${org.name}`);
      console.log(`     ID: ${org.id}`);
      console.log(`     Slug: ${org.slug}`);
      console.log(`     Tenant ID: ${org.tenant_id}`);
      console.log(`     Type: ${org.type}`);
      console.log('');
    });
  } else {
    console.log('  ❌ No organizations found\n');
  }

  // Method 2: Get all organizations
  const { data: allOrgs } = await supabase
    .from('organizations')
    .select('id, name, slug, tenant_id, type')
    .order('name');

  console.log(`\nAll Organizations (${allOrgs?.length || 0} total):`);
  if (allOrgs) {
    allOrgs.forEach(org => {
      console.log(`  - ${org.name} (${org.slug})`);
      console.log(`    ID: ${org.id}`);
      console.log(`    Tenant: ${org.tenant_id}`);
      console.log('');
    });
  }

  // Get Oonchiumpa's data
  const oonchiumpaOrg = orgsByName?.[0];
  if (oonchiumpaOrg) {
    console.log('\n' + '='.repeat(80));
    console.log('OONCHIUMPA ORGANIZATION DATA');
    console.log('='.repeat(80));
    console.log(JSON.stringify(oonchiumpaOrg, null, 2));
    console.log('='.repeat(80));

    // Get statistics
    const { count: storiesCount } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', oonchiumpaOrg.id);

    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', oonchiumpaOrg.id);

    // Get storytellers by tenant_id
    const { data: storytellers } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('tenant_id', oonchiumpaOrg.tenant_id)
      .contains('tenant_roles', ['storyteller']);

    const storytellerIds = storytellers?.map(s => s.id) || [];

    const { count: transcriptsCount } = await supabase
      .from('transcripts')
      .select('*', { count: 'exact', head: true })
      .in('storyteller_id', storytellerIds);

    console.log('\nOONCHIUMPA STATISTICS:');
    console.log(`  Stories: ${storiesCount}`);
    console.log(`  Projects: ${projectsCount}`);
    console.log(`  Storytellers: ${storytellers?.length || 0}`);
    console.log(`  Transcripts: ${transcriptsCount}`);
    console.log('');

    console.log('CONSTANTS TO USE IN CODE:');
    console.log(`const OONCHIUMPA_ORG_ID = '${oonchiumpaOrg.id}';`);
    console.log(`const OONCHIUMPA_TENANT_ID = '${oonchiumpaOrg.tenant_id}';`);
  }

  await supabase.auth.signOut();
}

getOonchiumpaOrg();
