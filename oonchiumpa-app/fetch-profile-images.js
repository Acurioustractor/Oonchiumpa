/**
 * Fetch profile images from Supabase for core team members
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CORE_TEAM_IDS = {
  kristy_bloomfield: 'b59a1f4c-94fd-4805-a2c5-cac0922133e0',
  tanya_turner: 'dc85700d-f139-46fa-9074-6afee55ea801',
  aunty_bev_terry: 'f8e99ed8-723a-48bc-a346-40f4f7a4032e',
  adelaide_hayes: 'faa011c7-0343-409a-8e56-c35c9d83b58d',
  aidan_harris: 'e948d0a2-2d77-429d-a538-7d03ace499ad',
  chelsea_kenneally: '28d3d9ea-3e0c-4642-b6d8-a6ebc22cac23',
  suzie_ma: 'a16991fb-11eb-4ac9-89df-c7994a2b9617',
};

async function main() {
  console.log('🖼️  Fetching Profile Images from Supabase\n');
  console.log('='.repeat(60));

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, display_name, profile_image_url')
    .in('id', Object.values(CORE_TEAM_IDS));

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('\n📸 Profile Images:\n');

  data.forEach(person => {
    console.log(`👤 ${person.full_name || person.display_name}`);
    console.log(`   ID: ${person.id}`);
    console.log(`   Image: ${person.profile_image_url || '❌ No image'}`);
    console.log('');
  });

  console.log('='.repeat(60));
  console.log('\n📋 TypeScript Object:\n');

  const imageMap = {};
  data.forEach(person => {
    const key = person.full_name?.toLowerCase().replace(/\s+/g, '_') || person.id;
    imageMap[key] = person.profile_image_url;
  });

  console.log('const profileImages = {');
  Object.entries(imageMap).forEach(([key, url]) => {
    console.log(`  "${key}": "${url || ''}",`);
  });
  console.log('};\n');
}

main().catch(console.error);
