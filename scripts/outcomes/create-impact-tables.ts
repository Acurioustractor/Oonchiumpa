#!/usr/bin/env -S npx tsx

/**
 * Creates Impact Framework database tables in Supabase
 * Run: npx tsx create-impact-tables.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  console.log('🚀 Creating Impact Framework tables in Supabase...\n');

  // Read the SQL file
  const sqlPath = '/Users/benknight/Code/Oochiumpa/create-outcomes-schema.sql';
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📄 Read SQL schema file:', sqlPath);
  console.log(`   File size: ${sql.length} characters\n`);

  // Split SQL into individual statements
  // We need to execute them separately because Supabase RPC doesn't support multiple statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Extract statement type for logging
    const statementType = statement.trim().split(/\s+/)[0].toUpperCase();
    const statementPreview = statement.substring(0, 80).replace(/\s+/g, ' ');

    console.log(`[${i + 1}/${statements.length}] Executing ${statementType}...`);
    console.log(`   ${statementPreview}...`);

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        // Try direct query if RPC doesn't work
        const result = await supabase.from('_').select('*').limit(0);

        // If that didn't work either, we'll need to use the REST API directly
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          },
          body: JSON.stringify({ sql_query: statement })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        console.log(`   ✅ Success\n`);
        successCount++;
      } else {
        console.log(`   ✅ Success\n`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`   ❌ Error: ${err.message}\n`);
      errorCount++;

      // Continue with other statements even if one fails
      // (tables might already exist, etc.)
    }
  }

  console.log('\n📈 Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   Total: ${statements.length}\n`);

  if (errorCount > 0) {
    console.log('⚠️  Some statements failed. This is normal if tables already exist.');
    console.log('💡 You can run the SQL directly in Supabase SQL Editor instead:\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql');
    console.log('   2. Paste the contents of: create-outcomes-schema.sql');
    console.log('   3. Click "Run"\n');
  } else {
    console.log('✅ All tables created successfully!');
  }
}

createTables()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
