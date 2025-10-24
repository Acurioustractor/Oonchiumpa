import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for this operation');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMediaLibrary() {
  console.log('🚀 Setting up Media Library infrastructure...\n');

  // Step 1: Create media_files table
  console.log('📋 Step 1: Creating media_files table...');

  try {
    const sql = readFileSync('create-media-tables.sql', 'utf-8');

    // Execute SQL using RPC or direct query
    // Note: Supabase JS client doesn't have direct SQL execution
    // So we'll use the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      console.log('⚠️  Could not execute SQL via RPC. You need to run create-media-tables.sql manually in Supabase SQL Editor');
      console.log('   Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new');
    } else {
      console.log('✅ media_files table created successfully');
    }
  } catch (error) {
    console.log('⚠️  SQL execution via script not available');
    console.log('   Please run create-media-tables.sql manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new');
  }

  // Step 2: Create storage bucket
  console.log('\n📦 Step 2: Creating "media" storage bucket...');

  const { data: existingBuckets } = await supabase.storage.listBuckets();
  const mediaExists = existingBuckets?.some(b => b.name === 'media');

  if (mediaExists) {
    console.log('✅ "media" bucket already exists');
  } else {
    const { data, error } = await supabase.storage.createBucket('media', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'audio/mpeg',
        'audio/mp4',
        'application/pdf'
      ]
    });

    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      console.log('   Please create it manually in Supabase Dashboard:');
      console.log('   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage/buckets');
    } else {
      console.log('✅ "media" storage bucket created successfully');
    }
  }

  // Step 3: Verify setup
  console.log('\n🔍 Step 3: Verifying setup...');

  const { data: tableCheck, error: tableError } = await supabase
    .from('media_files')
    .select('id')
    .limit(1);

  if (tableError) {
    console.error('❌ media_files table not accessible:', tableError.message);
    console.log('\n📋 Manual Setup Required:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new');
    console.log('   2. Copy and paste the contents of create-media-tables.sql');
    console.log('   3. Click "Run"');
  } else {
    console.log('✅ media_files table is accessible');
  }

  const { data: buckets } = await supabase.storage.listBuckets();
  const mediaBucket = buckets?.find(b => b.name === 'media');

  if (mediaBucket) {
    console.log('✅ "media" storage bucket is accessible');
    console.log(`   - Public: ${mediaBucket.public}`);
    console.log(`   - Size limit: ${mediaBucket.file_size_limit ? (mediaBucket.file_size_limit / 1024 / 1024) + 'MB' : 'unlimited'}`);
  } else {
    console.error('❌ "media" storage bucket not found');
    console.log('\n📦 Manual Bucket Creation:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/storage/buckets');
    console.log('   2. Click "New bucket"');
    console.log('   3. Name: media');
    console.log('   4. Public: Yes');
    console.log('   5. File size limit: 50MB');
    console.log('   6. Allowed MIME types: image/*, video/*, audio/*');
  }

  console.log('\n✨ Media Library setup complete!');
  console.log('\n📝 Next Steps:');
  console.log('   - If any steps failed, follow the manual instructions above');
  console.log('   - Test upload functionality in the admin dashboard');
  console.log('   - Upload sample media files to verify storage');
}

setupMediaLibrary();
