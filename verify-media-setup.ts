import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
  console.log('🔍 Verifying Media Library Setup...\n');

  // 1. Check media_files table
  console.log('📋 Checking media_files table...');
  const { data: tableData, error: tableError } = await supabase
    .from('media_files')
    .select('*')
    .limit(1);

  if (tableError) {
    console.error('❌ Table error:', tableError.message);
  } else {
    console.log('✅ media_files table is accessible');
    console.log(`   Records: ${tableData.length}`);
  }

  // 2. Check if we can list files in the media bucket
  console.log('\n📦 Checking media storage bucket...');
  const { data: fileList, error: storageError } = await supabase
    .storage
    .from('media')
    .list('oonchiumpa', { limit: 1 });

  if (storageError) {
    console.error('❌ Storage error:', storageError.message);
    console.log('\n💡 This might be OK if the bucket is empty or you need service role key');
  } else {
    console.log('✅ media storage bucket is accessible');
    console.log(`   Files in oonchiumpa folder: ${fileList.length}`);
  }

  // 3. Try to get stats
  console.log('\n📊 Attempting to load stats...');
  try {
    // This will test the mediaService.getMediaStats() functionality
    const { data: statsData, error: statsError } = await supabase
      .from('media_files')
      .select('type, category, file_size, elder_approved');

    if (statsError) {
      console.error('❌ Stats error:', statsError.message);
    } else {
      console.log('✅ Can query media_files for stats');
      console.log(`   Total records: ${statsData.length}`);

      // Calculate basic stats
      const byType = statsData.reduce((acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byCategory = statsData.reduce((acc, file) => {
        acc[file.category] = (acc[file.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const pendingApproval = statsData.filter(f => !f.elder_approved).length;
      const totalSize = statsData.reduce((sum, file) => sum + (file.file_size || 0), 0);

      console.log('\n📈 Current Stats:');
      console.log(`   Total files: ${statsData.length}`);
      console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   By type:`, byType);
      console.log(`   By category:`, byCategory);
      console.log(`   Pending approval: ${pendingApproval}`);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  console.log('\n✨ Setup Verification Complete!\n');
  console.log('🎯 Next Steps:');
  console.log('   1. Start dev server: cd oonchiumpa-app && npm run dev');
  console.log('   2. Go to Admin Dashboard');
  console.log('   3. Navigate to CMS → Media Library');
  console.log('   4. Try uploading a test image');
}

verifySetup();
