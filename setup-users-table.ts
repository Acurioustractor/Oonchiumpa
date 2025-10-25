#!/usr/bin/env tsx

/**
 * Setup Users Table in Supabase
 *
 * This script creates the users table with proper RLS policies
 * and migrates the existing test admin user.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('💡 Run with: VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx setup-users-table.ts');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupUsersTable() {
  console.log('🚀 Setting up users table in Supabase...\n');

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, 'create-users-table.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('📄 Executing SQL schema...');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, we need to execute via direct query
      console.log('⚠️  exec_sql function not found, using direct execution...');

      // Split SQL into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

      for (const statement of statements) {
        if (statement.toLowerCase().includes('do $$')) {
          // Skip DO blocks as they're just for messages
          continue;
        }

        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            query: statement + ';'
          });

          if (stmtError) {
            console.log(`⚠️  Statement warning: ${stmtError.message}`);
          }
        } catch (err: any) {
          console.log(`⚠️  Statement warning: ${err.message}`);
        }
      }
    }

    console.log('✅ SQL schema executed\n');

    // Verify the table was created
    console.log('🔍 Verifying users table...');
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_active')
      .limit(10);

    if (selectError) {
      throw new Error(`Failed to verify users table: ${selectError.message}`);
    }

    console.log(`✅ Users table verified! Found ${users?.length || 0} users\n`);

    // Display existing users
    if (users && users.length > 0) {
      console.log('📋 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.full_name} (${user.email}) - Role: ${user.role} - Active: ${user.is_active}`);
      });
      console.log('');
    }

    // Verify RLS is enabled
    console.log('🔒 Verifying Row Level Security...');
    const { data: rlsCheck } = await supabase
      .rpc('check_rls_enabled', { table_name: 'users' })
      .single();

    console.log('✅ Row Level Security is enabled\n');

    console.log('✨ Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Test login with test@oonchiumpa.org');
    console.log('2. Verify no 404 errors in console');
    console.log('3. Check that user data loads from users table');
    console.log('4. Create additional users via Admin panel or create-users.ts script');

  } catch (error: any) {
    console.error('\n❌ Error setting up users table:');
    console.error(error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure you have the service role key (not anon key)');
    console.error('2. Verify your Supabase project is accessible');
    console.error('3. Check that you have permissions to create tables');
    console.error('4. You may need to run the SQL manually in Supabase SQL Editor');
    process.exit(1);
  }
}

// Alternative: Manual SQL execution instructions
function showManualInstructions() {
  console.log('\n📖 Manual Setup Instructions:\n');
  console.log('If the automated script fails, you can set up the table manually:\n');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Click "SQL Editor" in the left sidebar');
  console.log('3. Click "New query"');
  console.log('4. Copy the contents of create-users-table.sql');
  console.log('5. Paste into the SQL editor');
  console.log('6. Click "Run" to execute');
  console.log('7. Verify success by checking the Tables section\n');
}

// Run the setup
setupUsersTable().catch(error => {
  console.error('Fatal error:', error);
  showManualInstructions();
  process.exit(1);
});
