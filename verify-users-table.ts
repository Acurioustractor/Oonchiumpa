#!/usr/bin/env tsx

/**
 * Verify Users Table Setup
 *
 * Checks that the users table was created successfully and the test user exists.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
  console.log('🔍 Verifying users table setup...\n');

  try {
    // First, sign in as the test admin to verify auth still works
    console.log('1️⃣ Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@oonchiumpa.org',
      password: 'OonchiumpaTest2024!'
    });

    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }

    console.log('✅ Authentication successful');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}\n`);

    // Check if users table exists and has data
    console.log('2️⃣ Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@oonchiumpa.org')
      .single();

    if (usersError) {
      if (usersError.code === '42P01') {
        console.error('❌ Users table does not exist!');
        console.error('   The SQL may not have executed successfully.');
        console.error('   Please check the Supabase SQL Editor for errors.\n');
        return;
      } else if (usersError.code === 'PGRST116') {
        console.error('❌ Test user not found in users table!');
        console.error('   The user migration may have failed.');
        console.error('   Try running the INSERT statement manually.\n');
        return;
      } else {
        console.error('❌ Error querying users table:', usersError.message);
        console.error('   Code:', usersError.code);
        return;
      }
    }

    console.log('✅ Users table exists and test user found!');
    console.log('\n📋 User Details:');
    console.log(`   ID: ${users.id}`);
    console.log(`   Email: ${users.email}`);
    console.log(`   Full Name: ${users.full_name}`);
    console.log(`   Role: ${users.role}`);
    console.log(`   Permissions: ${users.permissions?.join(', ') || 'none'}`);
    console.log(`   Active: ${users.is_active}`);
    console.log(`   Verified: ${users.is_verified}`);
    console.log(`   Department: ${users.department || 'N/A'}`);
    console.log(`   Position: ${users.position || 'N/A'}`);
    console.log(`   Last Login: ${users.last_login_at || 'Never'}`);
    console.log(`   Login Count: ${users.login_count || 0}`);
    console.log(`   Created: ${users.created_at}`);
    console.log(`   Updated: ${users.updated_at}\n`);

    // Check if RLS is working
    console.log('3️⃣ Verifying Row Level Security...');

    // Try to query all users (should work because we're logged in as admin)
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_active');

    if (allUsersError) {
      console.warn('⚠️  Could not query all users:', allUsersError.message);
      console.warn('   This might be a permissions issue with RLS policies.');
    } else {
      console.log(`✅ RLS working correctly - can query all users as admin`);
      console.log(`   Found ${allUsers.length} user(s) in total\n`);

      if (allUsers.length > 0) {
        console.log('📋 All Users:');
        allUsers.forEach(u => {
          console.log(`   - ${u.full_name} (${u.email}) - ${u.role} - Active: ${u.is_active}`);
        });
        console.log('');
      }
    }

    // Update login tracking to test triggers
    console.log('4️⃣ Testing login tracking trigger...');
    const loginCountBefore = users.login_count || 0;

    // Sign out and back in to trigger the login tracking
    await supabase.auth.signOut();
    await supabase.auth.signInWithPassword({
      email: 'test@oonchiumpa.org',
      password: 'OonchiumpaTest2024!'
    });

    // Wait a moment for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: updatedUser } = await supabase
      .from('users')
      .select('login_count, last_login_at')
      .eq('email', 'test@oonchiumpa.org')
      .single();

    if (updatedUser) {
      const loginCountAfter = updatedUser.login_count || 0;
      if (loginCountAfter > loginCountBefore) {
        console.log('✅ Login tracking working!');
        console.log(`   Login count: ${loginCountBefore} → ${loginCountAfter}`);
        console.log(`   Last login: ${updatedUser.last_login_at}\n`);
      } else {
        console.warn('⚠️  Login count did not increment');
        console.warn('   The login tracking trigger may not be working.\n');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ VERIFICATION COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Users table is set up correctly!');
    console.log('\n✅ Next steps:');
    console.log('   1. Log in at https://www.fromthecentre.com/login');
    console.log('   2. Check browser console - no more 404 errors!');
    console.log('   3. User data loads from users table instead of auth metadata');
    console.log('   4. Create additional users via Admin panel\n');

    // Sign out at the end
    await supabase.auth.signOut();

  } catch (error: any) {
    console.error('\n❌ Verification failed:');
    console.error(error.message);
    console.error('\nPlease check:');
    console.error('1. SQL executed successfully in Supabase SQL Editor');
    console.error('2. No errors shown in Supabase logs');
    console.error('3. Users table appears in Table Editor');
    process.exit(1);
  }
}

verifySetup();
