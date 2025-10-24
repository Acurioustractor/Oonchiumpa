import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMediaFolderPhotos() {
  console.log('📸 Checking c22fcf84-5a09-4893-a8ef-758c781e88a8/media folder...\n');

  const path = 'c22fcf84-5a09-4893-a8ef-758c781e88a8/media';

  const { data: files, error } = await supabase.storage
    .from('media')
    .list(path, { limit: 300, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (files && files.length > 0) {
    const images = files.filter(f => f.id && f.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i));

    console.log(`✅ Found ${images.length} images\n`);
    console.log(`First 20 photos:\n`);

    images.slice(0, 20).forEach((img, i) => {
      const url = `https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/${path}/${img.name}`;
      console.log(`${i + 1}. ${img.name}`);
      console.log(`   Size: ${(img.metadata?.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   ${url}\n`);
    });

    if (images.length > 20) {
      console.log(`... and ${images.length - 20} more photos\n`);
    }

    // Check what this folder ID is
    console.log('\n🔍 Checking if this folder ID matches any organization or project...\n');

    const folderId = 'c22fcf84-5a09-4893-a8ef-758c781e88a8';

    // Check organizations
    const { data: orgs } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', folderId)
      .single();

    if (orgs) {
      console.log(`✅ This is an ORGANIZATION folder: ${orgs.name}`);
    }

    // Check projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('id', folderId)
      .single();

    if (projects) {
      console.log(`✅ This is a PROJECT folder: ${projects.project_name || projects.name}`);
    }

    // Check if it's connected to Oonchiumpa
    const { data: oonchiumpaOrg } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', 'c53077e1-98de-4216-9149-6268891ff62e')
      .single();

    if (oonchiumpaOrg) {
      console.log(`\nOonchiumpa organization: ${oonchiumpaOrg.name}`);
      console.log(`ID: ${oonchiumpaOrg.id}`);
    }

    // Check law students project
    const { data: lawProject } = await supabase
      .from('projects')
      .select('*')
      .eq('id', '1bfcbf56-4a36-42a1-b819-e0dab7749597')
      .single();

    if (lawProject) {
      console.log(`\nLaw Students project: ${lawProject.project_name || lawProject.name}`);
      console.log(`ID: ${lawProject.id}`);
      console.log(`Organization ID: ${lawProject.organization_id || 'unknown'}`);
    }
  }
}

checkMediaFolderPhotos();
