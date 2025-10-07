#!/usr/bin/env node
/**
 * Extract stories from Oonchiumpa reports and Good News Stories documents
 * Uses AI to analyze documents and create structured story data for Supabase
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from oonchiumpa-app directory
dotenv.config({ path: path.join(__dirname, 'oonchiumpa-app', '.env') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Oonchiumpa tenant ID
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

// Document directory
const DOCS_DIR = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports';

const STORY_ANALYSIS_PROMPT = `You are analyzing Oonchiumpa community reports and "Good News Stories" to extract structured story data for a storytelling database.

Oonchiumpa is an Aboriginal-led youth service in Central Australia that uses cultural authority and community connection to support at-risk young people.

For each document, extract:

1. **Story Title** - Clear, engaging title
2. **Story Type** - One of: community_story, youth_success, cultural_activity, on_country_experience, program_outcome, partnership
3. **Summary** - 2-3 sentence overview
4. **Full Story Content** - The complete narrative (preserve all meaningful details)
5. **Themes** - Array of themes (e.g., cultural_connection, youth_empowerment, family_healing, education, employment, mentorship, resilience)
6. **Cultural Themes** - Specific Aboriginal cultural elements (e.g., on_country, cultural_authority, kinship, language, traditional_knowledge)
7. **Impact Highlights** - Key outcomes or transformations
8. **Participants** - Who was involved (anonymized if needed: "young person", "family member", etc.)
9. **Location** - Where story took place
10. **Date** - When it happened (if mentioned)
11. **Cultural Sensitivity Level** - "public", "community", or "sacred"

Return as JSON array of story objects. Be respectful of cultural protocols - if a story seems sacred or sensitive, mark appropriately.

IMPORTANT: Extract REAL stories from the document. Don't make up or embellish. If the document contains multiple stories or case studies, extract each one separately.`;

async function analyzeDocument(filePath, fileName) {
  console.log(`\n📄 Analyzing: ${fileName}`);

  // For .md files, read directly
  if (fileName.endsWith('.md')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return await analyzeWithClaude(content, fileName);
  }

  // For PDFs and DOCX, we need to read them
  console.log(`   ⚠️  File type requires conversion: ${fileName}`);
  console.log(`   💡 Suggestion: Convert ${fileName} to .md or .txt for processing`);
  return null;
}

async function analyzeWithClaude(documentContent, fileName) {
  console.log(`   🤖 Sending to Claude for analysis...`);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `${STORY_ANALYSIS_PROMPT}\n\n---\n\nDocument: ${fileName}\n\n${documentContent.substring(0, 100000)}`
      }
    ]
  });

  const responseText = message.content[0].text;

  // Extract JSON from response
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.log(`   ⚠️  Could not extract JSON from response`);
    console.log(`   Response preview: ${responseText.substring(0, 500)}`);
    return null;
  }

  try {
    const stories = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Extracted ${stories.length} story/stories`);
    return stories;
  } catch (error) {
    console.error(`   ❌ Error parsing JSON:`, error.message);
    return null;
  }
}

async function saveStoriesToSupabase(stories, sourceDocument) {
  console.log(`\n💾 Saving ${stories.length} stories to Supabase...`);

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
        source_document: sourceDocument,
        impact_highlights: story.impact_highlights,
        participants: story.participants,
        location: story.location,
        date: story.date,
        extracted_by: 'AI Analysis',
        extraction_date: new Date().toISOString()
      }
    };

    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select();

    if (error) {
      console.error(`   ❌ Error saving story "${story.title}":`, error.message);
    } else {
      console.log(`   ✅ Saved: "${story.title}"`);
    }
  }
}

async function main() {
  console.log('🎯 Oonchiumpa Story Extraction Tool\n');
  console.log('=' .repeat(60));

  // Get all .md files in Reports directory
  const files = fs.readdirSync(DOCS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`\n📚 Found ${files.length} total files`);
  console.log(`📝 ${mdFiles.length} markdown files ready to process\n`);

  if (mdFiles.length === 0) {
    console.log('⚠️  No .md files found. Please convert PDFs/DOCX to markdown first.');
    console.log('\n💡 Suggested workflow:');
    console.log('   1. Use a tool to convert PDFs/DOCX to markdown');
    console.log('   2. Save converted files in the Reports directory');
    console.log('   3. Re-run this script\n');
    return;
  }

  let allStories = [];

  for (const file of mdFiles) {
    const filePath = path.join(DOCS_DIR, file);
    const stories = await analyzeDocument(filePath, file);

    if (stories && stories.length > 0) {
      allStories = allStories.concat(
        stories.map(s => ({ ...s, sourceDocument: file }))
      );
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 ANALYSIS COMPLETE`);
  console.log(`   Total stories extracted: ${allStories.length}\n`);

  if (allStories.length === 0) {
    console.log('⚠️  No stories extracted. Check document content and try again.\n');
    return;
  }

  // Save summary to file
  const summaryPath = path.join(__dirname, 'extracted-stories.json');
  fs.writeFileSync(summaryPath, JSON.stringify(allStories, null, 2));
  console.log(`📁 Full story data saved to: ${summaryPath}\n`);

  // Ask if user wants to import to Supabase
  console.log('💾 Ready to import stories to Supabase?');
  console.log('   Review extracted-stories.json first, then run with --import flag\n');

  if (process.argv.includes('--import')) {
    console.log('🚀 Importing to Supabase...\n');
    for (const story of allStories) {
      await saveStoriesToSupabase([story], story.sourceDocument);
    }
    console.log('\n✨ Import complete!\n');
  } else {
    console.log('💡 To import, run: node extract-stories-from-docs.js --import\n');
  }
}

main().catch(console.error);
