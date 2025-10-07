#!/usr/bin/env node
/**
 * Remove duplicate stories from the database
 * Keeps the newest version of each story
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'oonchiumpa-app', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

async function removeDuplicates() {
  console.log('🧹 Removing Duplicate Stories\n');
  console.log('='.repeat(80));

  // Get all stories
  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, created_at')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stories:', error);
    return;
  }

  console.log(`\nTotal stories: ${stories.length}\n`);

  // Group by title to find duplicates
  const storyGroups = {};
  stories.forEach(story => {
    if (!storyGroups[story.title]) {
      storyGroups[story.title] = [];
    }
    storyGroups[story.title].push(story);
  });

  // Find duplicates (titles with more than one story)
  const duplicates = Object.entries(storyGroups).filter(([title, group]) => group.length > 1);

  console.log(`Stories with duplicates: ${duplicates.length}\n`);
  console.log('='.repeat(80) + '\n');

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!\n');
    return;
  }

  let totalDeleted = 0;

  for (const [title, group] of duplicates) {
    console.log(`📖 "${title}"`);
    console.log(`   Found ${group.length} copies`);

    // Sort by created_at descending (newest first)
    group.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Keep the first (newest), delete the rest
    const toKeep = group[0];
    const toDelete = group.slice(1);

    console.log(`   Keeping: ${new Date(toKeep.created_at).toLocaleDateString()} (newest)`);
    console.log(`   Deleting ${toDelete.length} older copies:`);

    for (const story of toDelete) {
      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id);

      if (deleteError) {
        console.error(`   ❌ Error deleting copy: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted copy from ${new Date(story.created_at).toLocaleDateString()}`);
        totalDeleted++;
      }
    }

    console.log('');
  }

  console.log('='.repeat(80));
  console.log(`\n✨ Cleanup Complete!`);
  console.log(`   Duplicates removed: ${totalDeleted}`);
  console.log(`   Stories remaining: ${stories.length - totalDeleted}\n`);
}

removeDuplicates().catch(console.error);
