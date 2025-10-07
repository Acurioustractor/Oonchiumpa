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
  const { count, error } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', OONCHIUMPA_TENANT_ID);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\n✨ Total Oonchiumpa stories in database: ${count}\n`);
}

main().catch(console.error);
