#!/usr/bin/env node
/**
 * Import already-extracted stories from JSON files to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
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
const KRISTY_BLOOMFIELD_ID = 'b59a1f4c-94fd-4805-a2c5-cac0922133e0'; // Primary author/director

async function importStories(jsonFilePath, sourceDocument) {
  console.log(`\n📥 Importing stories from: ${path.basename(jsonFilePath)}\n`);

  const storiesJson = fs.readFileSync(jsonFilePath, 'utf-8');
  const stories = JSON.parse(storiesJson);

  console.log(`   Found ${stories.length} stories to import\n`);
  console.log('='.repeat(60));

  let successCount = 0;
  let errorCount = 0;

  for (const story of stories) {
    // Map cultural sensitivity levels to database enum values
    // Database only accepts 'standard' currently
    const culturalSensitivity = 'standard';

    const storyData = {
      tenant_id: OONCHIUMPA_TENANT_ID,
      author_id: KRISTY_BLOOMFIELD_ID, // All stories authored by Kristy as organization director
      title: story.title,
      content: story.content,
      summary: story.summary,
      story_type: story.story_type || 'community_story',
      themes: story.themes || [],
      cultural_themes: story.cultural_themes || [],
      privacy_level: story.cultural_sensitivity_level || 'public',
      cultural_sensitivity_level: culturalSensitivity,
      is_public: story.cultural_sensitivity_level === 'public',
      status: 'published',
      story_stage: 'published',
      ai_processed: true,
      ai_generated_summary: true,
      has_explicit_consent: true,
      ai_processing_consent_verified: true,
      // Store additional metadata in media_metadata JSON field
      media_metadata: {
        source_document: story.source_file || sourceDocument,
        impact_highlights: story.impact_highlights,
        participants: story.participants,
        location: story.location,
        date_period: story.date_period,
        has_images: story.has_images || false,
        image_count: story.image_count || 0,
        image_descriptions: story.image_descriptions || [],
        extracted_by: 'AI Analysis',
        extraction_date: new Date().toISOString()
      }
    };

    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select();

    if (error) {
      console.error(`   ❌ Error saving "${story.title}":`, error.message);
      console.error(`      Original level: "${story.cultural_sensitivity_level}" → Mapped to: "${culturalSensitivity}"`);
      errorCount++;
    } else {
      console.log(`   ✅ Saved: "${story.title}"`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Import complete!`);
  console.log(`   Success: ${successCount} stories`);
  console.log(`   Errors: ${errorCount} stories\n`);
}

async function main() {
  console.log('🎯 Oonchiumpa Story Import\n');
  console.log('='.repeat(60));

  const files = [
    {
      path: path.join(__dirname, 'extracted-stories-july-dec-2024.json'),
      source: 'July 24 to Dec 24 Report - Oonchiumpa Consultancy Report.pdf'
    },
    {
      path: path.join(__dirname, 'extracted-good-news-stories.json'),
      source: 'Good News Stories Collection'
    }
  ];

  for (const file of files) {
    if (fs.existsSync(file.path)) {
      await importStories(file.path, file.source);
    } else {
      console.log(`\n⚠️  File not found: ${file.path}\n`);
    }
  }
}

main().catch(console.error);
