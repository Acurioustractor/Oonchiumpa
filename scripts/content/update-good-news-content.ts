import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

const GOOD_NEWS_FILES = [
  {
    title: 'Oochiumpa Good News Stories - Atnarpa Station Trip',
    mdPath: '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oochiumpa Good News Stories - Atnarpa Station Trip.md'
  },
  {
    title: 'Oochiumpa Good News Stories - Basketball Game',
    mdPath: '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oochiumpa Good News Stories - Basketball Game.md'
  },
  {
    title: 'Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm',
    mdPath: '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm.md'
  },
  {
    title: 'Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024',
    mdPath: '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024.md'
  },
  {
    title: 'Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023',
    mdPath: '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023.md'
  }
];

async function updateGoodNewsContent() {
  console.log('📝 Updating Good News Stories with Content from Markdown Files\n');
  console.log('='.repeat(80) + '\n');

  let updateCount = 0;

  for (const file of GOOD_NEWS_FILES) {
    console.log(`📄 ${file.title}`);

    try {
      // Read markdown file
      const content = fs.readFileSync(file.mdPath, 'utf-8');

      // Clean up the markdown (remove image references)
      const cleanedContent = content
        .replace(/!\[\].*?\{.*?\}/g, '') // Remove image markdown
        .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
        .trim();

      console.log(`   📖 Read ${cleanedContent.length} characters from markdown`);
      console.log(`   Preview: ${cleanedContent.substring(0, 100)}...`);

      // Find the document in database
      const { data: docs, error: findError } = await supabase
        .from('transcripts')
        .select('id')
        .eq('tenant_id', OONCHIUMPA_TENANT_ID)
        .eq('title', file.title);

      if (findError || !docs || docs.length === 0) {
        console.log(`   ❌ Document not found in database`);
        continue;
      }

      const docId = docs[0].id;

      // Update the document
      const { error: updateError } = await supabase
        .from('transcripts')
        .update({
          transcript_content: cleanedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (updateError) {
        console.log(`   ❌ Update error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Content updated successfully`);
        updateCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error:`, error instanceof Error ? error.message : error);
    }

    console.log('');
  }

  console.log('='.repeat(80));
  console.log(`\n📊 SUMMARY\n`);
  console.log(`Total Files: ${GOOD_NEWS_FILES.length}`);
  console.log(`✅ Successfully Updated: ${updateCount}`);
  console.log(`❌ Failed: ${GOOD_NEWS_FILES.length - updateCount}`);

  console.log('\n✅ Good News Stories Updated!\n');
  console.log('Next step: Run AI analysis to extract outcomes:');
  console.log('  npx tsx analyze-documents-ai.ts\n');
}

updateGoodNewsContent().catch(console.error);
