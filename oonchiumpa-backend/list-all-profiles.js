// List ALL profiles/storytellers to see what's available
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllProfiles() {
  console.log("🔍 SEARCHING ALL PROFILES/STORYTELLERS\n");
  console.log("=".repeat(80));

  // Get ALL storytellers across all tenants
  const { data: allStorytellers, error } = await supabase
    .from('profiles')
    .select('id, full_name, display_name, tenant_id, email, bio, profile_image_url, is_storyteller, is_elder, cultural_background, geographic_connections')
    .eq('is_storyteller', true)
    .order('full_name')
    .limit(50);

  if (error) {
    console.error("❌ Error:", error.message);
    return;
  }

  console.log(`\n📊 Found ${allStorytellers.length} storytellers across all tenants\n`);

  // Group by tenant
  const byTenant = {};
  allStorytellers.forEach(st => {
    const tid = st.tenant_id || 'no-tenant';
    if (!byTenant[tid]) byTenant[tid] = [];
    byTenant[tid].push(st);
  });

  console.log(`📋 Tenants found: ${Object.keys(byTenant).length}\n`);

  // Get tenant names
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name, slug');

  const tenantMap = {};
  tenants?.forEach(t => {
    tenantMap[t.id] = { name: t.name, slug: t.slug };
  });

  // Display by tenant
  for (const [tenantId, storytellers] of Object.entries(byTenant)) {
    const tenantInfo = tenantMap[tenantId] || { name: 'Unknown', slug: 'unknown' };

    console.log("=".repeat(80));
    console.log(`\n🏢 TENANT: ${tenantInfo.name} (${tenantInfo.slug})`);
    console.log(`   ID: ${tenantId}`);
    console.log(`   Storytellers: ${storytellers.length}\n`);

    for (const st of storytellers.slice(0, 20)) {  // Limit to first 20 per tenant
      console.log(`   👤 ${st.full_name || st.display_name || 'Unnamed'}`);

      if (st.display_name && st.display_name !== st.full_name) {
        console.log(`      Display: ${st.display_name}`);
      }
      if (st.email) {
        console.log(`      Email: ${st.email}`);
      }
      if (st.cultural_background) {
        console.log(`      Culture: ${st.cultural_background}`);
      }
      if (st.geographic_connections?.length > 0) {
        console.log(`      Location: ${st.geographic_connections.slice(0, 2).join(', ')}`);
      }
      if (st.is_elder) {
        console.log(`      🌟 Elder`);
      }
      if (st.profile_image_url) {
        console.log(`      📸 Has profile image`);
      }

      // Get content counts
      const { count: storyCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', st.id);

      const { count: transcriptCount } = await supabase
        .from('transcripts')
        .select('*', { count: 'exact', head: true })
        .eq('storyteller_id', st.id);

      if (storyCount > 0 || transcriptCount > 0) {
        console.log(`      📚 Content: ${storyCount || 0} stories, ${transcriptCount || 0} transcripts`);
      }

      if (st.bio) {
        const bioPreview = st.bio.substring(0, 80) + (st.bio.length > 80 ? '...' : '');
        console.log(`      💬 "${bioPreview}"`);
      }

      console.log('');
    }

    if (storytellers.length > 20) {
      console.log(`   ... and ${storytellers.length - 20} more storytellers\n`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n✨ OVERALL SUMMARY\n");
  console.log(`Total Storytellers: ${allStorytellers.length}`);
  console.log(`With Profile Images: ${allStorytellers.filter(s => s.profile_image_url).length}`);
  console.log(`With Bios: ${allStorytellers.filter(s => s.bio).length}`);
  console.log(`Elders: ${allStorytellers.filter(s => s.is_elder).length}`);

  // Check if Oonchiumpa tenant exists and which one it is
  const oonchiumpa = tenants?.find(t => t.slug === 'oonchiumpa' || t.name.toLowerCase().includes('oonchiumpa'));
  if (oonchiumpa) {
    console.log(`\n🎯 Oonchiumpa Tenant ID: ${oonchiumpa.id}`);
    console.log(`   Storytellers in Oonchiumpa: ${byTenant[oonchiumpa.id]?.length || 0}`);
  }
}

listAllProfiles();
