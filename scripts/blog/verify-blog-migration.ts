#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k'
);

async function verify() {
  console.log('🔍 Checking blog_posts table...\n');

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in blog_posts table:');
    const columns = Object.keys(data[0]);
    columns.forEach(col => {
      console.log(`  ${columns.indexOf(col) + 1}. ${col}`);
    });

    if (columns.includes('source_notion_page_id')) {
      console.log('\n✅ source_notion_page_id column exists!');
    } else {
      console.log('\n❌ source_notion_page_id column NOT found!');
    }
  } else {
    console.log('No data in blog_posts table');
  }
}

verify();
