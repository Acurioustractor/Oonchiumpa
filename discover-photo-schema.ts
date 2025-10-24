import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverPhotoSchema() {
  console.log('🔍 Discovering actual photo table names and structures...\n');

  // Based on hints, try these tables
  const realTables = [
    'photo_tags',
    'photo_galleries',
    'photo_projects'
  ];

  for (const tableName of realTables) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TABLE: ${tableName}`);
    console.log('='.repeat(60));

    try {
      // Get count
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      console.log(`Rows: ${count || 0}`);

      // Get one row to see structure
      const { data: sample } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (sample && sample.length > 0) {
        console.log('\nSample record:');
        console.log(JSON.stringify(sample[0], null, 2));
      } else {
        // No data, try inserting a test row to see required fields
        console.log('\nNo data found. Attempting test insert to discover schema...');

        const testData: any = {
          title: 'Test',
          name: 'Test'
        };

        const { data: inserted, error } = await supabase
          .from(tableName)
          .insert(testData)
          .select()
          .single();

        if (error) {
          console.log('Insert error (shows required fields):');
          console.log(error.message);
        } else if (inserted) {
          console.log('\nSuccessfully inserted test record. Schema:');
          console.log(`Columns: ${Object.keys(inserted).join(', ')}`);
          console.log('\nFull test record:');
          console.log(JSON.stringify(inserted, null, 2));

          // Clean up
          await supabase.from(tableName).delete().eq('id', inserted.id);
          console.log('(Test record deleted)');
        }
      }
    } catch (e: any) {
      console.log(`Error: ${e.message}`);
    }
  }
}

discoverPhotoSchema()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
