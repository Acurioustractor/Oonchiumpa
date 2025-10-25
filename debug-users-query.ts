#!/usr/bin/env tsx

/**
 * Debug Users Query Issues
 * Investigate the 406 and 400 errors
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvnuayzslukamizrlhwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugQuery() {
  console.log('🔍 Debugging users table query issues...\n');

  // Sign in first
  console.log('1️⃣ Signing in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@oonchiumpa.org',
    password: 'OonchiumpaTest2024!'
  });

  if (authError) {
    console.error('❌ Auth error:', authError);
    return;
  }

  console.log('✅ Signed in as:', authData.user.email);
  console.log('   User ID:', authData.user.id);
  console.log('   Role from metadata:', authData.user.user_metadata?.role || authData.user.raw_user_meta_data?.role);
  console.log('');

  // Try different query variations to see which works
  console.log('2️⃣ Testing different query patterns...\n');

  // Query 1: The problematic query from the error
  console.log('Query 1: With project_id filter');
  const { data: d1, error: e1 } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .eq('is_active', true)
    .eq('project_id', '5b853f55-c01e-4f1d-9e16-b99290ee1a2c');

  if (e1) {
    console.error('❌ Error:', e1.message);
    console.error('   Code:', e1.code);
    console.error('   Details:', e1.details);
    console.error('   Hint:', e1.hint);
  } else {
    console.log('✅ Success:', d1);
  }
  console.log('');

  // Query 2: Without project_id
  console.log('Query 2: Without project_id filter');
  const { data: d2, error: e2 } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .eq('is_active', true);

  if (e2) {
    console.error('❌ Error:', e2.message);
    console.error('   Code:', e2.code);
  } else {
    console.log('✅ Success:', d2);
  }
  console.log('');

  // Query 3: Just by ID
  console.log('Query 3: Just by ID');
  const { data: d3, error: e3 } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id);

  if (e3) {
    console.error('❌ Error:', e3.message);
    console.error('   Code:', e3.code);
  } else {
    console.log('✅ Success:', d3);
  }
  console.log('');

  // Query 4: Single query
  console.log('Query 4: Using .single()');
  const { data: d4, error: e4 } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (e4) {
    console.error('❌ Error:', e4.message);
    console.error('   Code:', e4.code);
  } else {
    console.log('✅ Success!');
    console.log('   User data:', {
      id: d4.id,
      email: d4.email,
      full_name: d4.full_name,
      role: d4.role,
      permissions: d4.permissions
    });
  }
  console.log('');

  // Query 5: Check what's in the table
  console.log('Query 5: List all users (as admin)');
  const { data: d5, error: e5 } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_active, project_id');

  if (e5) {
    console.error('❌ Error:', e5.message);
    console.error('   Code:', e5.code);
  } else {
    console.log('✅ Success! Found', d5.length, 'user(s)');
    d5.forEach(u => {
      console.log('   -', u.email, '| Role:', u.role, '| Active:', u.is_active, '| Project:', u.project_id);
    });
  }
  console.log('');

  await supabase.auth.signOut();
}

debugQuery();
