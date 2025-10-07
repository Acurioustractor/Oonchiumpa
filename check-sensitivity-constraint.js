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

async function main() {
  // Get a few existing stories to see what values are actually used
  const { data, error } = await supabase
    .from('stories')
    .select('cultural_sensitivity_level, title')
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\nExisting cultural_sensitivity_level values in database:\n');
  const uniqueValues = new Set();
  data.forEach(story => {
    if (story.cultural_sensitivity_level) {
      uniqueValues.add(story.cultural_sensitivity_level);
    }
    console.log(`- "${story.title}" → ${story.cultural_sensitivity_level}`);
  });

  console.log('\n\nUnique values found:');
  uniqueValues.forEach(val => console.log(`  - ${val}`));
}

main().catch(console.error);
