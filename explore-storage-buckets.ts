import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function exploreStorageBuckets() {
  console.log('🗂️  Exploring Supabase Storage for law student photos...\n');

  const buckets = ['media', 'gallery-photos', 'story-images', 'story-media'];
  const LAW_STUDENTS_PROJECT_ID = '1bfcbf56-4a36-42a1-b819-e0dab7749597';
  const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';

  for (const bucketName of buckets) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Bucket: ${bucketName}`);
    console.log('='.repeat(60));

    try {
      // List root folder
      const { data: rootFiles, error: rootError } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 100 });

      if (rootError) {
        console.log(`   ❌ Error: ${rootError.message}`);
        continue;
      }

      if (rootFiles && rootFiles.length > 0) {
        console.log(`\n📁 Root level (${rootFiles.length} items):`);
        rootFiles.forEach(file => {
          const icon = file.id ? '📄' : '📁';
          console.log(`   ${icon} ${file.name}`);
        });

        // Check for organization/project folders
        const orgFolder = rootFiles.find(f =>
          f.name.includes(OONCHIUMPA_ORG_ID) ||
          f.name.toLowerCase().includes('oonchiumpa')
        );

        const lawStudentFolder = rootFiles.find(f =>
          f.name.includes(LAW_STUDENTS_PROJECT_ID) ||
          f.name.toLowerCase().includes('law') ||
          f.name.toLowerCase().includes('student')
        );

        // Explore organization folder if exists
        if (orgFolder) {
          console.log(`\n   ✅ Found organization folder: ${orgFolder.name}`);
          const { data: orgContents } = await supabase.storage
            .from(bucketName)
            .list(orgFolder.name, { limit: 100 });

          if (orgContents && orgContents.length > 0) {
            console.log(`   Contents (${orgContents.length} items):`);
            orgContents.slice(0, 10).forEach(file => {
              const icon = file.id ? '📄' : '📁';
              console.log(`      ${icon} ${file.name}`);
            });
            if (orgContents.length > 10) {
              console.log(`      ... and ${orgContents.length - 10} more`);
            }
          }
        }

        // Explore law students folder if exists
        if (lawStudentFolder) {
          console.log(`\n   ✅ Found law students folder: ${lawStudentFolder.name}`);
          const { data: lawContents } = await supabase.storage
            .from(bucketName)
            .list(lawStudentFolder.name, { limit: 100 });

          if (lawContents && lawContents.length > 0) {
            console.log(`   Contents (${lawContents.length} items):`);
            lawContents.slice(0, 10).forEach(file => {
              const icon = file.id ? '📄' : '📁';
              console.log(`      ${icon} ${file.name}`);
            });
            if (lawContents.length > 10) {
              console.log(`      ... and ${lawContents.length - 10} more`);
            }
          }
        }

        // Try to find nested project folders
        for (const folder of rootFiles.filter(f => !f.id)) {
          const { data: subFiles } = await supabase.storage
            .from(bucketName)
            .list(folder.name, { limit: 100 });

          if (subFiles) {
            const lawMatch = subFiles.find(f =>
              f.name.includes(LAW_STUDENTS_PROJECT_ID) ||
              f.name.toLowerCase().includes('law') ||
              f.name.toLowerCase().includes('student')
            );

            if (lawMatch) {
              console.log(`\n   ✅ Found in ${folder.name}/${lawMatch.name}`);
              const path = `${folder.name}/${lawMatch.name}`;
              const { data: photos } = await supabase.storage
                .from(bucketName)
                .list(path, { limit: 250 });

              if (photos && photos.length > 0) {
                console.log(`   📸 Photos found: ${photos.length}`);
                console.log(`   First 5 photos:`);
                photos.slice(0, 5).forEach((photo, i) => {
                  console.log(`      ${i + 1}. ${photo.name}`);
                });
                if (photos.length > 5) {
                  console.log(`      ... and ${photos.length - 5} more photos`);
                }
              }
            }
          }
        }
      } else {
        console.log('   (empty)');
      }
    } catch (error: any) {
      console.log(`   ❌ Error exploring bucket: ${error.message}`);
    }
  }
}

exploreStorageBuckets();
