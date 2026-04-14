import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function checkGoodNewsStories() {
  console.log('🔍 Checking Good News Stories in Database\n');

  const { data, error } = await supabase
    .from('transcripts')
    .select('id, title, transcript_content, media_metadata, created_at')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .ilike('title', '%Good News%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${data.length} Good News Stories:\n`);
  console.log('='.repeat(80) + '\n');

  data.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.title}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Created: ${new Date(doc.created_at).toLocaleDateString()}`);
    console.log(`   Content Length: ${doc.transcript_content?.length || 0} characters`);
    console.log(`   Has Media Metadata: ${doc.media_metadata ? 'Yes' : 'No'}`);

    if (doc.transcript_content && doc.transcript_content.length > 0) {
      const preview = doc.transcript_content.substring(0, 300).replace(/\n/g, ' ');
      console.log(`   Preview: ${preview}...`);
    } else {
      console.log(`   Content: ❌ EMPTY or NULL`);
    }
    console.log('');
  });

  // Summary
  const withContent = data.filter(d => d.transcript_content && d.transcript_content.length > 100);
  const noContent = data.filter(d => !d.transcript_content || d.transcript_content.length <= 100);

  console.log('='.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`Total Good News Stories: ${data.length}`);
  console.log(`✅ With Content (>100 chars): ${withContent.length}`);
  console.log(`❌ No Content or Too Short: ${noContent.length}`);

  if (noContent.length > 0) {
    console.log('\n⚠️  Stories Without Content:');
    noContent.forEach(d => console.log(`   - ${d.title}`));
  }
}

checkGoodNewsStories().catch(console.error);
