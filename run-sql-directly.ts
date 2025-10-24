import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL() {
  console.log('🔄 Running SQL to create media_files table...\n');

  const sql = readFileSync('create-media-tables.sql', 'utf-8');

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

  for (const statement of statements) {
    if (statement.includes('DROP TABLE')) {
      console.log('⚠️  Skipping DROP TABLE (running individual statements)');
      continue;
    }

    console.log(`Executing: ${statement.substring(0, 60)}...`);

    try {
      // Try using the SQL query endpoint directly
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        console.error(`❌ Error:`, error.message);
      } else {
        console.log('✅ Success');
      }
    } catch (err) {
      console.error(`❌ Exception:`, err.message);
    }
  }
}

runSQL();
