import { createClient } from '@supabase/supabase-js';
import { readFileSync, statSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Oonchiumpa Organization Constants
const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';
const OONCHIUMPA_PROJECT_ID = 'd10daf41-02ae-45e4-9e9b-1c96e56ee820'; // The Homestead project

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  errors: string[];
}

function getCulturalSensitivity(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.includes('sacred') || lower.includes('ceremony')) return 'sacred';
  if (lower.includes('cultural') || lower.includes('interview')) return 'sensitive';
  return 'standard';
}

function requiresElderReview(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return lower.includes('sacred') || lower.includes('ceremony') || lower.includes('elder');
}

function getTags(filePath: string): string[] {
  const tags: string[] = [];
  const lower = filePath.toLowerCase();

  if (lower.includes('interview')) tags.push('Interview');
  if (lower.includes('report')) tags.push('Report');
  if (lower.includes('good news')) tags.push('Good News Story');
  if (lower.includes('technical')) tags.push('Technical Documentation');
  if (lower.includes('cultural')) tags.push('Cultural Documentation');
  if (lower.includes('basketball')) tags.push('Basketball');
  if (lower.includes('atnarpa')) tags.push('Atnarpa Station');
  if (lower.includes('standly chasm') || lower.includes('chasm')) tags.push('Standly Chasm');
  if (lower.includes('fellas') || lower.includes('boys')) tags.push('Youth Programs');
  if (lower.includes('girl')) tags.push('Youth Programs');
  if (lower.includes('mcdonald')) tags.push('McDonalds Partnership');

  // Add category based on folder
  if (lower.includes('/interviews/')) tags.push('Interview');
  if (lower.includes('/reports/')) tags.push('Report');
  if (lower.includes('/technical/')) tags.push('Technical');

  return [...new Set(tags)]; // Remove duplicates
}

function getFileType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.txt': 'text/plain',
    '.md': 'text/plain' // Store markdown as plain text
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function getBucket(fileType: string): string {
  if (fileType.startsWith('image/')) return 'media';
  return 'documents';
}

async function uploadDocument(filePath: string, stats: UploadStats): Promise<void> {
  try {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);
    const fileNameWithoutExt = fileName.replace(fileExt, '');
    const relativePath = filePath.replace('/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/', '');
    const category = relativePath.split('/')[0]; // Interviews, Reports, etc.

    console.log(`\n📄 Processing: ${fileName}`);
    console.log(`   Category: ${category}`);

    // Read file
    const fileBuffer = readFileSync(filePath);
    const fileStats = statSync(filePath);
    const fileSize = fileStats.size;
    const fileType = getFileType(filePath);

    console.log(`   Size: ${(fileSize / 1024).toFixed(2)} KB`);
    console.log(`   Type: ${fileType}`);

    // Skip if file is too large (>50MB)
    if (fileSize > 50 * 1024 * 1024) {
      console.log(`   ⚠️  Skipped (file too large: ${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
      stats.skipped++;
      return;
    }

    // Check if already uploaded
    const { data: existing } = await supabase
      .from('transcripts')
      .select('id, title')
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .ilike('title', `%${fileNameWithoutExt}%`)
      .maybeSingle();

    if (existing) {
      console.log(`   ℹ️  Already exists: ${existing.title}`);
      stats.skipped++;
      return;
    }

    // Upload to storage
    const bucket = getBucket(fileType);
    const storagePath = `oonchiumpa/docs/${category}/${Date.now()}-${fileName}`;

    console.log(`   ⬆️  Uploading to ${bucket}/${storagePath}...`);

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: fileType,
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(storagePath);

    console.log(`   ✅ Uploaded to storage`);

    // Create transcript record
    const tags = getTags(filePath);
    const culturalSensitivity = getCulturalSensitivity(filePath);
    const needsElderReview = requiresElderReview(filePath);

    const transcriptData = {
      tenant_id: OONCHIUMPA_TENANT_ID,
      organization_id: OONCHIUMPA_ORG_ID,
      project_id: OONCHIUMPA_PROJECT_ID,
      title: fileNameWithoutExt,
      transcript_content: '', // Will be populated if we process the file
      recording_date: new Date().toISOString(),
      ai_processing_consent: false,
      processing_status: 'pending',
      transcript_quality: 'good',
      cultural_sensitivity: culturalSensitivity,
      requires_elder_review: needsElderReview,
      media_metadata: {
        original_filename: fileName,
        file_type: fileType,
        file_size: fileSize,
        storage_path: storagePath,
        bucket: bucket,
        uploaded_at: new Date().toISOString(),
        description: `Imported from ${category} folder`,
        tags: tags,
        category: category,
        source_path: relativePath
      },
      status: 'pending'
    };

    console.log(`   💾 Creating database record...`);
    console.log(`      Tags: ${tags.join(', ')}`);
    console.log(`      Cultural Sensitivity: ${culturalSensitivity}`);
    console.log(`      Elder Review: ${needsElderReview ? 'Yes' : 'No'}`);

    const { data: transcript, error: dbError } = await supabase
      .from('transcripts')
      .insert(transcriptData)
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file
      await supabase.storage.from(bucket).remove([storagePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    console.log(`   ✅ Database record created (ID: ${transcript.id})`);
    stats.uploaded++;

  } catch (error) {
    console.error(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    stats.failed++;
    stats.errors.push(`${path.basename(filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function bulkUploadDocuments() {
  console.log('🚀 Bulk Document Upload to Oonchiumpa Staff Portal\n');
  console.log('Organization ID:', OONCHIUMPA_ORG_ID);
  console.log('Tenant ID:', OONCHIUMPA_TENANT_ID);
  console.log('Project ID:', OONCHIUMPA_PROJECT_ID);
  console.log('\n' + '='.repeat(80) + '\n');

  const stats: UploadStats = {
    total: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  // Find all document files
  const docsPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs';
  const patterns = [
    '**/*.pdf',
    '**/*.docx',
    '**/*.doc',
    '**/*.txt',
    '**/*.md'
  ];

  let allFiles: string[] = [];
  for (const pattern of patterns) {
    const files = await glob(pattern, { cwd: docsPath, absolute: true });
    allFiles = [...allFiles, ...files];
  }

  // Remove duplicates and temp files
  allFiles = [...new Set(allFiles)].filter(f => !f.includes('/temp.md'));

  stats.total = allFiles.length;

  console.log(`📁 Found ${stats.total} documents to upload\n`);

  // Upload each file
  for (const filePath of allFiles) {
    await uploadDocument(filePath, stats);
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 UPLOAD SUMMARY\n');
  console.log(`Total files:    ${stats.total}`);
  console.log(`✅ Uploaded:    ${stats.uploaded}`);
  console.log(`ℹ️  Skipped:     ${stats.skipped}`);
  console.log(`❌ Failed:      ${stats.failed}`);

  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:\n');
    stats.errors.forEach(err => console.log(`   - ${err}`));
  }

  console.log('\n✅ Bulk upload complete!');
  console.log(`\nView documents at: https://www.fromthecentre.com/staff-portal/documents`);
}

bulkUploadDocuments().catch(console.error);
