#!/usr/bin/env node
/**
 * Extract stories directly from PDF reports using Claude's vision/PDF reading
 * This script reads PDFs and extracts structured story data
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'oonchiumpa-app', '.env') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

const PDF_PATH = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/July 24 to Dec 24 Report - Oonchiumpa Consultancy Report.pdf';

async function extractStoriesFromPDF() {
  console.log('\n📄 Extracting stories from July-Dec 2024 Report...\n');

  // Read PDF file as base64
  const pdfBuffer = fs.readFileSync(PDF_PATH);
  const base64PDF = pdfBuffer.toString('base64');

  console.log('   🤖 Sending to Claude for AI analysis...\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64PDF,
            },
          },
          {
            type: 'text',
            text: `Extract ALL stories from this Oonchiumpa report. For each story, create a structured JSON object with:

- title: Engaging, descriptive title
- story_type: one of: youth_success, on_country_experience, cultural_activity, community_story, program_outcome, partnership_story
- summary: 2-3 sentence overview
- content: Full story narrative (preserve all details)
- themes: Array of themes (youth_empowerment, cultural_connection, family_healing, education, employment, mentorship, resilience, independence, confidence_building, etc.)
- cultural_themes: Aboriginal cultural elements (on_country, cultural_authority, kinship, traditional_knowledge, cultural_tourism, etc.)
- impact_highlights: Key outcomes/transformations (bullet points)
- participants: Who was involved (use initials if provided, otherwise "young person", "family member", etc.)
- location: Where it happened (Alice Springs, Central Australia, specific communities, etc.)
- date_period: "July-December 2024" or specific dates if mentioned
- cultural_sensitivity_level: "public" or "community" (mark "community" if sensitive details)

Include:
- Individual case studies (MS, J, A, CB, etc.)
- Good News Stories (Atnarpa trip, Pottery lesson, Beauty session, Holiday programs, Finke Desert Race, etc.)
- Program outcomes and impacts

Return ONLY a JSON array of story objects, nothing else.`
          }
        ]
      }
    ]
  });

  const responseText = message.content[0].text;

  // Extract JSON from response
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.log('   ⚠️  Could not extract JSON from response');
    console.log(`   Response preview: ${responseText.substring(0, 500)}`);
    return null;
  }

  try {
    const stories = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Extracted ${stories.length} stories!\n`);
    return stories;
  } catch (error) {
    console.error(`   ❌ Error parsing JSON:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎯 Oonchiumpa PDF Story Extraction\n');
  console.log('='.repeat(60));

  const stories = await extractStoriesFromPDF();

  if (!stories || stories.length === 0) {
    console.log('\n⚠️  No stories extracted.\n');
    return;
  }

  console.log('='.repeat(60));
  console.log(`\n📊 EXTRACTION COMPLETE: ${stories.length} stories\n`);

  // Save to file
  const outputPath = path.join(__dirname, 'extracted-stories-july-dec-2024.json');
  fs.writeFileSync(outputPath, JSON.stringify(stories, null, 2));
  console.log(`📁 Saved to: ${outputPath}\n`);

  // Show summary
  console.log('📖 Stories extracted:\n');
  stories.forEach((story, idx) => {
    console.log(`${idx + 1}. ${story.title}`);
    console.log(`   Type: ${story.story_type} | Themes: ${story.themes?.slice(0, 3).join(', ')}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n💾 Ready to import to Supabase?');
  console.log('   Review the JSON file, then run with --import flag\n');

  if (process.argv.includes('--import')) {
    console.log('🚀 Importing to Supabase...\n');

    for (const story of stories) {
      const storyData = {
        tenant_id: OONCHIUMPA_TENANT_ID,
        title: story.title,
        content: story.content,
        summary: story.summary,
        story_type: story.story_type || 'community_story',
        themes: story.themes || [],
        cultural_themes: story.cultural_themes || [],
        privacy_level: story.cultural_sensitivity_level || 'public',
        cultural_sensitivity_level: story.cultural_sensitivity_level || 'public',
        is_public: story.cultural_sensitivity_level === 'public',
        metadata: {
          source_document: 'July 24 to Dec 24 Report - Oonchiumpa Consultancy Report.pdf',
          impact_highlights: story.impact_highlights,
          participants: story.participants,
          location: story.location,
          date_period: story.date_period,
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
      } else {
        console.log(`   ✅ Saved: "${story.title}"`);
      }
    }

    console.log('\n✨ Import complete!\n');
  } else {
    console.log('💡 To import, run: node extract-from-pdf-report.js --import\n');
  }
}

main().catch(console.error);
