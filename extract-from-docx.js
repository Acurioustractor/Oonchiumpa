#!/usr/bin/env node
/**
 * Extract stories from DOCX files using Claude's document API
 */

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

const REPORTS_DIR = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports';

const DOCX_FILES = [
  'Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023.docx',
  'Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024.docx',
  'Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm.docx',
  'Oochiumpa Good News Stories - Basketball Game.docx',
  'Oochiumpa Good News Stories - Atnarpa Station Trip.docx',
  'Atnarpa Homestead and Campgroup.docx',
];

const EXTRACTION_PROMPT = `Extract ALL stories from this Oonchiumpa Good News Story document. For each story, create a structured JSON object with:

- title: Engaging, descriptive title based on the activity/event
- story_type: one of: youth_success, on_country_experience, cultural_activity, community_story, program_outcome, partnership_story
- summary: 2-3 sentence overview of the story
- content: Full story narrative (preserve all details, quotes, observations)
- themes: Array of themes (youth_empowerment, cultural_connection, family_healing, education, employment, mentorship, resilience, independence, confidence_building, community_engagement, etc.)
- cultural_themes: Aboriginal cultural elements (on_country, cultural_authority, kinship, traditional_knowledge, cultural_tourism, language, etc.)
- impact_highlights: Key outcomes/transformations (bullet points)
- participants: Who was involved (use names if provided, otherwise "young people", "girls", "boys", etc.)
- location: Where it happened (Alice Springs, Central Australia, specific places like Standley Chasm, Atnarpa, etc.)
- date_period: Extract from filename or content (e.g., "December 2023", "February 2024")
- cultural_sensitivity_level: "public" or "community" (mark "community" if sensitive details, photos of people, or private moments)
- has_images: true/false - whether the document contains photos
- image_descriptions: Array of descriptions for each image in the document (to help identify them later)

Return ONLY a JSON array of story objects, nothing else.`;

async function extractFromDocx(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Processing: ${fileName}...`);

  try {
    // Read DOCX file as base64
    const docxBuffer = fs.readFileSync(filePath);
    const base64Docx = docxBuffer.toString('base64');

    console.log('   🤖 Sending to Claude for analysis...');

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
                media_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                data: base64Docx,
              },
            },
            {
              type: 'text',
              text: EXTRACTION_PROMPT
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

    const stories = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Extracted ${stories.length} story/stories from ${fileName}\n`);

    return {
      fileName,
      stories,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`   ❌ Error processing ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎯 Oonchiumpa DOCX Story Extraction\n');
  console.log('='.repeat(80));

  const allResults = [];

  for (const fileName of DOCX_FILES) {
    const filePath = path.join(REPORTS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠️  File not found: ${fileName}`);
      continue;
    }

    const result = await extractFromDocx(filePath);
    if (result && result.stories.length > 0) {
      allResults.push(result);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 EXTRACTION COMPLETE\n`);

  let totalStories = 0;
  allResults.forEach(result => {
    totalStories += result.stories.length;
    console.log(`   ${result.fileName}: ${result.stories.length} story/stories`);
  });

  console.log(`\n   Total: ${totalStories} stories extracted from ${allResults.length} documents\n`);

  // Save each result separately
  allResults.forEach(result => {
    const safeName = result.fileName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const outputPath = path.join(__dirname, `extracted-${safeName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result.stories, null, 2));
    console.log(`   📁 Saved: ${path.basename(outputPath)}`);
  });

  // Save combined results
  const allStories = allResults.flatMap(r => r.stories.map(s => ({
    ...s,
    source_file: r.fileName
  })));

  const combinedPath = path.join(__dirname, 'extracted-stories-docx-all.json');
  fs.writeFileSync(combinedPath, JSON.stringify(allStories, null, 2));
  console.log(`   📁 Combined: ${path.basename(combinedPath)}\n`);

  console.log('='.repeat(80));
  console.log('\n💾 Ready to import to Supabase');
  console.log('   Review the JSON files, then use import-extracted-stories.js\n');
}

main().catch(console.error);
