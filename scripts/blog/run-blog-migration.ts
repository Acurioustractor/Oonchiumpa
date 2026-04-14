#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k'
);

async function runMigration() {
  console.log('📝 Running blog_posts migration...\n');

  const sql = fs.readFileSync('add-notion-source-to-blog-posts.sql', 'utf-8');

  const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

  if (error) {
    console.log('❌ Migration failed:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase:');
    console.log('   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql\n');
    console.log(sql);
  } else {
    console.log('✅ Migration successful!');
    console.log('   Added source_notion_page_id column to blog_posts table');
    console.log('   Added unique index to prevent duplicate imports\n');
  }
}

runMigration();
