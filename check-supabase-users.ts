import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  console.log('\nPlease run with:');
  console.log('VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx check-supabase-users.ts');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUsers() {
  console.log('🔍 Checking Supabase users...\n');

  // List all users
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error fetching users:', error.message);
    return;
  }

  if (!users || users.length === 0) {
    console.log('⚠️  No users found in Supabase Auth');
    console.log('\n📝 You need to create a test admin user.');
    console.log('\nOptions:');
    console.log('1. Create via Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users');
    console.log('   Click "Add User" → Enter email/password → Save');
    console.log('');
    console.log('2. Create via this script (I can add one for you)');
    return;
  }

  console.log(`✅ Found ${users.length} user(s):\n`);

  users.forEach((user, index) => {
    console.log(`User ${index + 1}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Created: ${new Date(user.created_at).toLocaleDateString()}`);
    console.log(`  Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`  Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);

    // Check user metadata for role
    const metadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};

    if (metadata.role || appMetadata.role) {
      console.log(`  Role: ${metadata.role || appMetadata.role}`);
    }

    if (metadata.full_name) {
      console.log(`  Name: ${metadata.full_name}`);
    }

    console.log('');
  });

  console.log('\n💡 To test Staff Login:');
  console.log(`1. Go to: https://www.fromthecentre.com/login`);
  console.log(`2. Use one of the emails above`);
  console.log(`3. Enter the password you set when creating the user`);
  console.log('');
  console.log('If you forgot the password:');
  console.log('- Go to Supabase Dashboard → Auth → Users');
  console.log('- Click the user → Click "Send password recovery email"');
}

checkUsers();
