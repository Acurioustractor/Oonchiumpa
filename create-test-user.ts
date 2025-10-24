import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  console.log('🔐 Creating test admin user...\n');

  const testEmail = 'test@oonchiumpa.org';
  const testPassword = 'OonchiumpaTest2024!'; // Strong password for testing

  // Check if user already exists
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const existingUser = users?.find(u => u.email === testEmail);

  if (existingUser) {
    console.log('⚠️  User already exists!');
    console.log(`Email: ${testEmail}`);
    console.log(`\nTo reset password, use Supabase Dashboard:`);
    console.log('https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users');
    return;
  }

  // Create the user
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      full_name: 'Test Admin'
    }
  });

  if (error) {
    console.error('❌ Error creating user:', error.message);
    return;
  }

  console.log('✅ Test user created successfully!\n');
  console.log('📋 Test Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Email:    ${testEmail}`);
  console.log(`Password: ${testPassword}`);
  console.log(`Role:     admin`);
  console.log(`Name:     Test Admin`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎯 Test it now:');
  console.log('1. Go to: https://www.fromthecentre.com/login');
  console.log(`2. Email: ${testEmail}`);
  console.log(`3. Password: ${testPassword}`);
  console.log('4. Click "Sign In"');
  console.log('5. After login, click profile icon → Admin Dashboard\n');

  console.log('💡 Save these credentials somewhere safe!');
  console.log('   You can change the password later in Supabase Dashboard.\n');
}

createTestUser();
