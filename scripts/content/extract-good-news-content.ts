import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function extractGoodNewsContent() {
  console.log('📄 Extracting Content from Good News Stories Word Documents\n');

  // Get all Good News Stories
  const { data: documents, error } = await supabase
    .from('transcripts')
    .select('id, title, media_metadata')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .ilike('title', '%Good News%');

  if (error || !documents) {
    console.error('❌ Error fetching documents:', error);
    return;
  }

  console.log(`Found ${documents.length} Good News Stories to process\n`);
  console.log('='.repeat(80) + '\n');

  for (const doc of documents) {
    console.log(`\n📄 Processing: ${doc.title}`);

    const storagePath = doc.media_metadata?.storage_path;
    if (!storagePath) {
      console.log('   ⚠️  No storage path found, skipping');
      continue;
    }

    try {
      // Download the DOCX file from Supabase storage
      console.log(`   📥 Downloading from: ${storagePath}`);

      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('documents')
        .download(storagePath.replace('oonchiumpa/', ''));

      if (downloadError || !fileData) {
        console.log(`   ❌ Download error: ${downloadError?.message}`);
        continue;
      }

      // Save temporarily
      const tempPath = `/tmp/${doc.id}.docx`;
      const buffer = Buffer.from(await fileData.arrayBuffer());
      fs.writeFileSync(tempPath, buffer);

      // Extract text from DOCX
      console.log('   🔍 Extracting text from Word document...');
      const result = await mammoth.extractRawText({ path: tempPath });
      const extractedText = result.value;

      console.log(`   ✅ Extracted ${extractedText.length} characters`);
      console.log(`   Preview: ${extractedText.substring(0, 150)}...`);

      // Update the transcript_content in database
      const { error: updateError } = await supabase
        .from('transcripts')
        .update({
          transcript_content: extractedText,
          updated_at: new Date().toISOString()
        })
        .eq('id', doc.id);

      if (updateError) {
        console.log(`   ❌ Update error: ${updateError.message}`);
      } else {
        console.log('   ✅ Content saved to database');
      }

      // Clean up temp file
      fs.unlinkSync(tempPath);

    } catch (error) {
      console.log(`   ❌ Error:`, error instanceof Error ? error.message : error);
    }

    console.log('');
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Extraction Complete!\n');
  console.log('Next step: Run AI analysis again to extract outcomes from these stories:');
  console.log('  npx tsx analyze-documents-ai.ts\n');
}

extractGoodNewsContent().catch(console.error);
