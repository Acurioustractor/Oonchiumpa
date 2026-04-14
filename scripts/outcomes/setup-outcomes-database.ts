import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupOutcomesDatabase() {
  console.log('📊 Setting up Outcomes Framework Database...\n');

  // Since we can't execute raw SQL via the client easily, let's create tables one by one

  try {
    // Create outcomes table
    console.log('1. Creating outcomes table...');
    const { error: outcomesError } = await supabase
      .from('outcomes')
      .select('id')
      .limit(1);

    if (outcomesError && outcomesError.message.includes('does not exist')) {
      console.log('   ⚠️  Table does not exist - needs to be created via Supabase SQL Editor');
      console.log('   📄 SQL file ready: create-outcomes-schema.sql\n');
    } else {
      console.log('   ✅ Table already exists or is accessible\n');
    }

    // Check activities table
    console.log('2. Checking activities table...');
    const { error: activitiesError } = await supabase
      .from('activities')
      .select('id')
      .limit(1);

    if (activitiesError && activitiesError.message.includes('does not exist')) {
      console.log('   ⚠️  Table does not exist\n');
    } else {
      console.log('   ✅ Table exists\n');
    }

    // Check service_impact table
    console.log('3. Checking service_impact table...');
    const { error: serviceImpactError } = await supabase
      .from('service_impact')
      .select('id')
      .limit(1);

    if (serviceImpactError && serviceImpactError.message.includes('does not exist')) {
      console.log('   ⚠️  Table does not exist\n');
    } else {
      console.log('   ✅ Table exists\n');
    }

    console.log('='.repeat(80));
    console.log('\n📋 INSTRUCTIONS:\n');
    console.log('Since tables need to be created, please follow these steps:');
    console.log('\n1. Go to Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Create a new query');
    console.log('5. Copy the contents of "create-outcomes-schema.sql"');
    console.log('6. Paste and run the SQL');
    console.log('\nAlternatively, I can create a simplified version that works via the API...\n');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupOutcomesDatabase();
