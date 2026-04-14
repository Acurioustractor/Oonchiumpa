#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yvnuayzslukamizrlhwb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs'
);

async function checkTags() {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, tags, status, elder_approved')
    .eq('status', 'published')
    .eq('elder_approved', true);

  console.log('📝 Published Blog Posts:\n');
  data?.forEach(p => {
    console.log(`  ${p.title}`);
    console.log(`    Tags: ${p.tags?.join(', ') || 'NO TAGS'}`);
    console.log(`    ID: ${p.id}\n`);
  });

  console.log(`Total: ${data?.length || 0} posts`);
}

checkTags();
