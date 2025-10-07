// Find Kristy Bloomfield and Tanya Turner in the database
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findCoreTeam() {
  console.log("🔍 SEARCHING FOR CORE OONCHIUMPA TEAM\n");
  console.log("=".repeat(80));

  // Search for Kristy Bloomfield
  console.log("\n🔍 Searching for Kristy Bloomfield...\n");
  const { data: kristy } = await supabase
    .from('profiles')
    .select('*')
    .or('full_name.ilike.%Kristy%,full_name.ilike.%Bloomfield%,display_name.ilike.%Kristy%,email.ilike.%kristy%')
    .limit(5);

  if (kristy && kristy.length > 0) {
    console.log("✅ Found potential matches:");
    kristy.forEach(p => {
      console.log(`   - ${p.full_name || p.display_name} (${p.email || 'no email'})`);
      console.log(`     ID: ${p.id}`);
      console.log(`     Tenant: ${p.tenant_id}`);
      if (p.bio) console.log(`     Bio: ${p.bio.substring(0, 100)}...`);
      console.log('');
    });
  } else {
    console.log("❌ No matches found for Kristy Bloomfield");
  }

  // Search for Tanya Turner
  console.log("\n🔍 Searching for Tanya Turner...\n");
  const { data: tanya } = await supabase
    .from('profiles')
    .select('*')
    .or('full_name.ilike.%Tanya%,full_name.ilike.%Turner%,display_name.ilike.%Tanya%,email.ilike.%tanya%')
    .limit(5);

  if (tanya && tanya.length > 0) {
    console.log("✅ Found potential matches:");
    tanya.forEach(p => {
      console.log(`   - ${p.full_name || p.display_name} (${p.email || 'no email'})`);
      console.log(`     ID: ${p.id}`);
      console.log(`     Tenant: ${p.tenant_id}`);
      if (p.bio) console.log(`     Bio: ${p.bio.substring(0, 100)}...`);
      console.log('');
    });
  } else {
    console.log("❌ No matches found for Tanya Turner");
  }

  // Search for Aunty Bev & Uncle Terry
  console.log("\n🔍 Searching for Aunty Bev & Uncle Terry...\n");
  const { data: aunties } = await supabase
    .from('profiles')
    .select('*')
    .or('full_name.ilike.%Bev%,full_name.ilike.%Terry%')
    .limit(10);

  if (aunties && aunties.length > 0) {
    console.log("✅ Found potential matches:");
    aunties.forEach(p => {
      console.log(`   - ${p.full_name || p.display_name} (${p.email || 'no email'})`);
      console.log(`     ID: ${p.id}`);
      console.log(`     Tenant: ${p.tenant_id}`);
      if (p.bio) console.log(`     Bio: ${p.bio.substring(0, 100)}...`);
      console.log('');
    });
  } else {
    console.log("❌ No matches found for Aunty Bev & Uncle Terry");
  }

  // Search for law students (Adelaide, Aidan)
  console.log("\n🔍 Searching for law students (Adelaide, Aidan)...\n");
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .or('full_name.ilike.%Adelaide%,full_name.ilike.%Aidan%,bio.ilike.%law student%')
    .limit(10);

  if (students && students.length > 0) {
    console.log("✅ Found potential matches:");
    students.forEach(p => {
      console.log(`   - ${p.full_name || p.display_name} (${p.email || 'no email'})`);
      console.log(`     ID: ${p.id}`);
      console.log(`     Tenant: ${p.tenant_id}`);
      if (p.bio) console.log(`     Bio: ${p.bio.substring(0, 100)}...`);
      console.log('');
    });
  } else {
    console.log("❌ No matches found for law students");
  }

  // Check all Oonchiumpa tenants for ALL profiles
  console.log("\n📋 ALL PROFILES IN OONCHIUMPA TENANTS:\n");
  console.log("=".repeat(80));

  const oonchiumpaTenants = [
    'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6',
    '8891e1a9-92ae-423f-928b-cec602660011'
  ];

  for (const tenantId of oonchiumpaTenants) {
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, email, bio, is_storyteller, profile_image_url')
      .eq('tenant_id', tenantId)
      .order('full_name');

    if (allProfiles && allProfiles.length > 0) {
      console.log(`\nTenant: ${tenantId}`);
      console.log(`Found ${allProfiles.length} profiles:\n`);

      allProfiles.forEach((p, i) => {
        console.log(`${i + 1}. ${p.full_name || p.display_name || 'Unnamed'}`);
        if (p.email) console.log(`   Email: ${p.email}`);
        if (p.is_storyteller) console.log(`   ✅ Storyteller`);
        if (p.profile_image_url) console.log(`   📸 Has photo`);
        if (p.bio) {
          const bioPreview = p.bio.substring(0, 80) + (p.bio.length > 80 ? '...' : '');
          console.log(`   Bio: ${bioPreview}`);
        }
        console.log(`   ID: ${p.id}`);
        console.log('');
      });
    }
  }

  // Check stories and transcripts
  console.log("\n📚 CHECKING CONTENT AVAILABILITY:\n");
  console.log("=".repeat(80));

  const { data: allOonchiumpaProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, display_name')
    .in('tenant_id', oonchiumpaTenants);

  if (allOonchiumpaProfiles) {
    for (const profile of allOonchiumpaProfiles) {
      // Check stories
      const { count: storyCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', profile.id);

      // Check transcripts
      const { count: transcriptCount } = await supabase
        .from('transcripts')
        .select('*', { count: 'exact', head: true })
        .eq('storyteller_id', profile.id);

      if (storyCount > 0 || transcriptCount > 0) {
        console.log(`\n${profile.full_name || profile.display_name}`);
        console.log(`   Stories: ${storyCount || 0}`);
        console.log(`   Transcripts: ${transcriptCount || 0}`);

        // Get sample transcript titles
        if (transcriptCount > 0) {
          const { data: transcripts } = await supabase
            .from('transcripts')
            .select('id, title, key_quotes, themes')
            .eq('storyteller_id', profile.id)
            .limit(3);

          if (transcripts && transcripts.length > 0) {
            console.log(`   Transcript titles:`);
            transcripts.forEach(t => {
              console.log(`     - ${t.title || 'Untitled'}`);
              if (t.themes && t.themes.length > 0) {
                console.log(`       Themes: ${t.themes.join(', ')}`);
              }
              if (t.key_quotes && t.key_quotes.length > 0) {
                console.log(`       Quotes: ${t.key_quotes.length} available`);
              }
            });
          }
        }
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n✨ SEARCH COMPLETE\n");
}

findCoreTeam();
