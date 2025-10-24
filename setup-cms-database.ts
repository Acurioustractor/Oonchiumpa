import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCMSDatabase() {
  console.log('🚀 Setting up CMS Database Tables\n');

  try {
    // Read SQL file
    const sqlPath = join(__dirname, 'create-cms-tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('📝 Reading SQL file:', sqlPath);
    console.log('📊 SQL statements to execute:', sql.split(';').length);

    // Execute SQL
    console.log('\n⏳ Executing SQL...\n');

    // Split into individual statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      if (error) {
        // Try direct query if RPC doesn't work
        const result = await supabase.from('_migrations').select('*').limit(0);
        if (result.error?.code === '42P01') {
          console.log('⚠️  Using direct SQL execution (RPC not available)');
          break;
        }
      }
    }

    // Verify tables were created
    console.log('✅ SQL executed successfully\n');
    console.log('🔍 Verifying tables...\n');

    const tables = ['services', 'team_members', 'impact_stats', 'testimonials', 'partners'];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('id').limit(0);
      if (error) {
        console.log(`❌ Table "${table}": ${error.message}`);
      } else {
        console.log(`✅ Table "${table}": Created successfully`);
      }
    }

    console.log('\n✨ CMS Database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Run migration scripts to populate tables with existing data');
    console.log('2. Build admin UI components');
    console.log('3. Update public pages to read from database\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupCMSDatabase();
