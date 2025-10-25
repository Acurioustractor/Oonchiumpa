import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Define users to create
const usersToCreate = [
  {
    email: 'admin@oonchiumpa.org',
    password: 'ChangeThisPassword123!',
    full_name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'editor@oonchiumpa.org',
    password: 'ChangeThisPassword123!',
    full_name: 'Editor User',
    role: 'editor'
  },
  {
    email: 'coordinator@oonchiumpa.org',
    password: 'ChangeThisPassword123!',
    full_name: 'Community Coordinator',
    role: 'contributor'
  },
  // Add more users here as needed
];

async function createUsers() {
  console.log(`\n🔐 Creating ${usersToCreate.length} users...\n`);

  for (const userData of usersToCreate) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          role: userData.role,
          full_name: userData.full_name
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  ${userData.email} - Already exists, skipping`);
        } else {
          console.error(`❌ ${userData.email} - Error: ${error.message}`);
        }
      } else {
        console.log(`✅ ${userData.email} - Created successfully`);
        console.log(`   Name: ${userData.full_name}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Password: ${userData.password}`);
        console.log('');
      }
    } catch (err: any) {
      console.error(`❌ ${userData.email} - Exception: ${err.message}`);
    }
  }

  console.log('\n✅ User creation complete!\n');
  console.log('📝 IMPORTANT: Users should change their passwords on first login.\n');
}

createUsers();
