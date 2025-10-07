#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'oonchiumpa-app', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function main() {
  const { data, error } = await supabase
    .from('stories')
    .select('title, story_type, created_at')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\n📚 Recent Oonchiumpa Stories (${data.length}):\n`);
  console.log('='.repeat(80));

  data.forEach((story, idx) => {
    const date = new Date(story.created_at).toLocaleDateString();
    console.log(`${idx + 1}. ${story.title}`);
    console.log(`   Type: ${story.story_type} | Created: ${date}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n✨ Total stories found: ${data.length}\n`);
}

main().catch(console.error);
