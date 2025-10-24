import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function exploreMediaFolders() {
  console.log('🔍 Exploring media bucket folders in detail...\n');

  const LAW_STUDENTS_PROJECT_ID = '1bfcbf56-4a36-42a1-b819-e0dab7749597';
  const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';

  const folders = [
    'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6',
    'c22fcf84-5a09-4893-a8ef-758c781e88a8',
    'd0a162d2-282e-4653-9d12-aa934c9dfa4e'
  ];

  for (const folderId of folders) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📁 Exploring: ${folderId}`);

    // Check if this is the law students project
    if (folderId === LAW_STUDENTS_PROJECT_ID) {
      console.log('   ✅ THIS IS THE LAW STUDENTS PROJECT!');
    }

    console.log('='.repeat(70));

    try {
      const { data: contents, error } = await supabase.storage
        .from('media')
        .list(folderId, { limit: 300, sortBy: { column: 'name', order: 'asc' } });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }

      if (contents && contents.length > 0) {
        console.log(`\n   📊 Total items: ${contents.length}`);

        const folders = contents.filter(f => !f.id);
        const files = contents.filter(f => f.id);

        console.log(`   📁 Folders: ${folders.length}`);
        console.log(`   📄 Files: ${files.length}`);

        // Show folders
        if (folders.length > 0) {
          console.log(`\n   Subfolders:`);
          folders.slice(0, 10).forEach(folder => {
            console.log(`      📁 ${folder.name}`);
          });
          if (folders.length > 10) {
            console.log(`      ... and ${folders.length - 10} more folders`);
          }
        }

        // Show image files
        const imageFiles = files.filter(f =>
          f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i)
        );

        if (imageFiles.length > 0) {
          console.log(`\n   📸 Image files: ${imageFiles.length}`);
          console.log(`   First 10 images:`);
          imageFiles.slice(0, 10).forEach((file, i) => {
            console.log(`      ${i + 1}. ${file.name}`);
          });
          if (imageFiles.length > 10) {
            console.log(`      ... and ${imageFiles.length - 10} more images`);
          }
        }

        // Explore subfolders looking for law students
        for (const subfolder of folders) {
          const subPath = `${folderId}/${subfolder.name}`;
          const { data: subContents } = await supabase.storage
            .from('media')
            .list(subPath, { limit: 300 });

          if (subContents && subContents.length > 0) {
            const subImages = subContents.filter(f =>
              f.id && f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i)
            );

            if (subImages.length > 0) {
              console.log(`\n   📂 ${subfolder.name}/ has ${subImages.length} images`);

              // If this looks like law students content
              if (subfolder.name.toLowerCase().includes('law') ||
                  subfolder.name.toLowerCase().includes('student') ||
                  subfolder.name === LAW_STUDENTS_PROJECT_ID) {
                console.log(`      ✨ POTENTIAL LAW STUDENTS FOLDER!`);
                console.log(`      First 5 photos:`);
                subImages.slice(0, 5).forEach((img, i) => {
                  console.log(`         ${i + 1}. ${img.name}`);
                });
              }
            }
          }
        }
      } else {
        console.log('   (empty)');
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Also check if there's a direct path with project ID
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎯 Directly checking Law Students Project ID path...`);
  console.log('='.repeat(70));

  try {
    const { data: lawPhotos, error } = await supabase.storage
      .from('media')
      .list(LAW_STUDENTS_PROJECT_ID, { limit: 300 });

    if (!error && lawPhotos && lawPhotos.length > 0) {
      console.log(`\n✅ FOUND! Law Students project has ${lawPhotos.length} items`);

      const images = lawPhotos.filter(f =>
        f.id && f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i)
      );

      console.log(`📸 Images: ${images.length}`);
      console.log(`\nFirst 10 photos:`);
      images.slice(0, 10).forEach((img, i) => {
        const url = `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${LAW_STUDENTS_PROJECT_ID}/${img.name}`;
        console.log(`${i + 1}. ${img.name}`);
        console.log(`   ${url}`);
      });

      if (images.length > 10) {
        console.log(`... and ${images.length - 10} more photos`);
      }
    } else if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log(`⚠️  No files found at path: ${LAW_STUDENTS_PROJECT_ID}`);
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }
}

exploreMediaFolders();
