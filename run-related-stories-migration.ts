import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runMigration() {
  console.log('🔧 Running migration to add related_stories column...\n');

  const sql = readFileSync('add-related-stories-column.sql', 'utf-8');

  // Execute the SQL using Supabase's RPC or direct query
  // Note: Supabase doesn't have a direct SQL execution method via the client
  // We need to use the Supabase SQL editor or pg connection

  console.log('SQL to execute:\n');
  console.log(sql);
  console.log('\n⚠️  Please run this SQL in the Supabase SQL Editor:');
  console.log('1. Go to https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new');
  console.log('2. Paste the SQL above');
  console.log('3. Click "Run"');
  console.log('\nOR use psql:');
  console.log('psql "postgresql://postgres.yvnuayzslukamizrlhwb:YOUR_PASSWORD@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres" -f add-related-stories-column.sql');
}

runMigration();
