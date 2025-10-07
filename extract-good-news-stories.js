#!/usr/bin/env node
/**
 * Extract Good News Stories from converted markdown files
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

const GOOD_NEWS_STORIES = [
  'Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023.md',
  'Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024.md',
  'Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm.md',
  'Oochiumpa Good News Stories - Basketball Game.md',
  'Oochiumpa Good News Stories - Atnarpa Station Trip.md',
  'Atnarpa Homestead and Campgroup.md',
];

async function extractStoryFromMarkdown(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Processing: ${fileName}...`);

  const content = fs.readFileSync(filePath, 'utf-8');

  const prompt = `Extract a structured story from this Oonchiumpa Good News Story document. Create a JSON object with:

- title: Engaging, descriptive title based on the activity/event
- story_type: Choose from: youth_success, on_country_experience, cultural_activity, community_story, program_outcome, partnership_story
- summary: 2-3 sentence overview of the story
- content: Full story narrative. Combine all the text content into a cohesive narrative. Do not include image references in the content.
- themes: Array of relevant themes (youth_empowerment, cultural_connection, family_healing, education, community_engagement, confidence_building, etc.)
- cultural_themes: Aboriginal cultural elements present (on_country, cultural_authority, kinship, traditional_knowledge, cultural_tourism, etc.)
- impact_highlights: Key outcomes/transformations (bullet points array)
- participants: Who was involved (extract names if provided, otherwise use "young people", "girls", "boys", "fellas", etc.)
- location: Where it happened (extract from content - Alice Springs, Standley Chasm, Atnarpa, etc.)
- date_period: Extract from filename or content (e.g., "December 2023", "February 2024")
- cultural_sensitivity_level: "public" or "community" (use "community" since these stories have photos of identified people)
- has_images: Count the image references in the markdown (e.g., ![](media/image1.png))
- image_count: Number of images in the document

Here's the markdown content:

${content}

Return ONLY a JSON object, nothing else.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('   ⚠️  Could not extract JSON from response');
      return null;
    }

    const story = JSON.parse(jsonMatch[0]);
    story.source_file = fileName;
    console.log(`   ✅ Extracted: "${story.title}"`);

    return story;

  } catch (error) {
    console.error(`   ❌ Error processing ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎯 Oonchiumpa Good News Stories Extraction\n');
  console.log('='.repeat(80));

  const stories = [];

  for (const fileName of GOOD_NEWS_STORIES) {
    const filePath = path.join(REPORTS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠️  File not found: ${fileName}`);
      continue;
    }

    const story = await extractStoryFromMarkdown(filePath);
    if (story) {
      stories.push(story);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 EXTRACTION COMPLETE: ${stories.length} stories\n`);

  // Save results
  const outputPath = path.join(__dirname, 'extracted-good-news-stories.json');
  fs.writeFileSync(outputPath, JSON.stringify(stories, null, 2));
  console.log(`📁 Saved to: ${path.basename(outputPath)}\n`);

  // Show summary
  console.log('📖 Stories extracted:\n');
  stories.forEach((story, idx) => {
    console.log(`${idx + 1}. ${story.title}`);
    console.log(`   Type: ${story.story_type} | Images: ${story.image_count || 0} | Location: ${story.location}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💾 Ready to import to Supabase\n');
}

main().catch(console.error);
