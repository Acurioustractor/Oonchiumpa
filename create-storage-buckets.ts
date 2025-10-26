import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createStorageBuckets() {
  console.log('🪣 Creating Supabase storage buckets...\n');

  const bucketsToCreate = [
    {
      id: 'documents',
      name: 'documents',
      public: false,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'audio/mpeg',
        'audio/wav',
        'audio/mp4',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
      ]
    },
    {
      id: 'media',
      name: 'media',
      public: true,
      fileSizeLimit: 104857600, // 100MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/quicktime',
        'audio/mpeg',
        'audio/wav'
      ]
    },
    {
      id: 'transcripts-audio',
      name: 'transcripts-audio',
      public: false,
      fileSizeLimit: 524288000, // 500MB
      allowedMimeTypes: [
        'audio/mpeg',
        'audio/wav',
        'audio/mp4',
        'audio/m4a',
        'audio/webm',
        'audio/ogg'
      ]
    },
    {
      id: 'transcripts-video',
      name: 'transcripts-video',
      public: false,
      fileSizeLimit: 1073741824, // 1GB
      allowedMimeTypes: [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm'
      ]
    }
  ];

  for (const bucket of bucketsToCreate) {
    console.log(`Creating bucket: ${bucket.name}`);

    // Check if bucket exists
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) {
      console.error(`❌ Error listing buckets:`, listError);
      continue;
    }

    const bucketExists = existingBuckets?.some(b => b.name === bucket.name);

    if (bucketExists) {
      console.log(`  ℹ️  Bucket '${bucket.name}' already exists, skipping...`);
      continue;
    }

    // Create bucket
    const { data, error } = await supabase
      .storage
      .createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      });

    if (error) {
      console.error(`  ❌ Error creating bucket '${bucket.name}':`, error);
    } else {
      console.log(`  ✅ Created bucket '${bucket.name}'`);
      console.log(`     - Public: ${bucket.public}`);
      console.log(`     - Size limit: ${(bucket.fileSizeLimit / 1024 / 1024).toFixed(0)}MB`);
      console.log(`     - Allowed types: ${bucket.allowedMimeTypes.length} types`);
    }
  }

  console.log('\n✅ Storage buckets setup complete!');

  // List all buckets to verify
  const { data: finalBuckets } = await supabase.storage.listBuckets();
  console.log(`\n📋 Total buckets: ${finalBuckets?.length || 0}`);
  finalBuckets?.forEach(b => {
    console.log(`  - ${b.name} (${b.public ? 'public' : 'private'})`);
  });
}

createStorageBuckets().catch(console.error);
