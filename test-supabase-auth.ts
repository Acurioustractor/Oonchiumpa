import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  }
});

async function testAuth() {
  console.log('Testing Supabase authentication...\n');

  try {
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    console.log('   Health check status:', healthResponse.status);

    console.log('\n2. Testing sign in with password...');
    const startTime = Date.now();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@oonchiumpa.org',
      password: 'OonchiumpaTest2024!',
    });

    const duration = Date.now() - startTime;
    console.log(`   Request completed in ${duration}ms`);

    if (error) {
      console.log('   ❌ Error:', error.message);
      console.log('   Error details:', JSON.stringify(error, null, 2));
    } else if (data.user) {
      console.log('   ✅ Success! User:', data.user.email);
      console.log('   User ID:', data.user.id);
      console.log('   Session exists:', !!data.session);
    } else {
      console.log('   ⚠️  No user or error returned');
    }

  } catch (err: any) {
    console.log('   ❌ Exception:', err.message);
    console.log('   Stack:', err.stack);
  }
}

testAuth();
