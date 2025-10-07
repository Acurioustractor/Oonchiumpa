#!/usr/bin/env node
/**
 * Quick demo: Extract a sample story from Oonch_report.md
 * Shows the structure without needing API key
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/Oonch_report.md';

console.log('📚 Oonchiumpa Story Extraction - DEMO\n');
console.log('='.repeat(60));

// Read the report
const reportContent = fs.readFileSync(reportPath, 'utf-8');

// Extract some sample case studies manually to show structure
const sampleStories = [
  {
    title: "MS: From Disconnection to Cultural Tourism Leadership",
    story_type: "youth_success",
    summary: "A young person with a history of offending, disconnected from family and culture, engaged with Oonchiumpa through an on-country trip and is now developing a cultural tourism venture on their own country.",
    content: `MS had a history of offending and was disconnected from family supports, culture and identity when commencing with Oonchiumpa. MS had disengaged with all other service providers and was regularly on a search list as his whereabouts could not be ascertained.

MS started working with Oonchiumpa and engaged really well. He was rewarded with an on country trip where he experienced how other Aboriginal people are establishing economic development with cultural tourism on their country.

MS stated he wanted to do that with his mob and through Oonchiumpa's support is now working on a similar tourism venture on his country. This demonstrates the power of on-country experiences and cultural connection in transforming young people's aspirations and futures.`,
    themes: ["youth_empowerment", "cultural_connection", "economic_development", "on_country", "career_development"],
    cultural_themes: ["on_country", "cultural_tourism", "cultural_connection", "mob_identity"],
    impact_highlights: [
      "Engaged after disengaging with all other services",
      "Participated in on-country cultural tourism experience",
      "Developed aspiration for cultural tourism business",
      "Now working on tourism venture on own country",
      "No longer on police search list"
    ],
    participants: ["Young person (MS)", "Oonchiumpa staff"],
    location: "Central Australia / MS's country",
    cultural_sensitivity_level: "public",
    source_document: "Oonch_report.md"
  },
  {
    title: "CB: Understanding Cultural Responsibility Through Manhood",
    story_type: "cultural_activity",
    summary: "CB underwent cultural ceremonies for becoming a man and now understands his cultural responsibilities, sees himself as a role model and leader in his town camp, and can reflect on past actions with remorse.",
    content: `CB understands since becoming a man he has more responsibility and is now becoming more of a role model and leader in the Town Camp. He didn't understand the importance of his cultural role before.

He is now able to reflect on his actions in the past and feel remorse. He knows he can be a leader.

This transformation demonstrates how cultural ceremonies and Oonchiumpa's cultural authority-based approach helps young people understand their place in community and their responsibilities to others.`,
    themes: ["cultural_identity", "youth_leadership", "community_responsibility", "cultural_ceremonies", "personal_growth"],
    cultural_themes: ["manhood_ceremonies", "cultural_authority", "community_leadership", "town_camp_life"],
    impact_highlights: [
      "Understands cultural responsibilities after becoming a man",
      "Sees himself as role model and leader",
      "Able to reflect and feel remorse for past actions",
      "Increased self-awareness and community responsibility"
    ],
    participants: ["Young person (CB)", "Oonchiumpa Team Leader"],
    location: "Town Camp, Alice Springs",
    cultural_sensitivity_level: "public",
    source_document: "Oonch_report.md"
  },
  {
    title: "J: Building Confidence to Seek Support Independently",
    story_type: "youth_success",
    summary: "J transformed from only coming to Oonchiumpa office with others or when picked up by staff, to now arranging her own transport and coming in independently to get support and 'hang out'.",
    content: `J would never come into the office without being with other young people or having been picked up by Oonchiumpa staff.

J now will arrange her own transport to come into the office on her own to get supports and "hang out".

This demonstrates how Oonchiumpa creates culturally safe spaces where young people feel comfortable, building the confidence to seek support independently - a critical life skill.`,
    themes: ["confidence_building", "independence", "safe_spaces", "youth_empowerment"],
    cultural_themes: ["cultural_safety", "relationship_building"],
    impact_highlights: [
      "Increased independence and self-advocacy",
      "Arranges own transport to office",
      "Comfortable seeking support independently",
      "Trusts Oonchiumpa as safe space"
    ],
    participants: ["Young person (J)", "Oonchiumpa staff"],
    location: "Oonchiumpa office, Alice Springs",
    cultural_sensitivity_level: "public",
    source_document: "Oonch_report.md"
  }
];

console.log('\n📖 Sample Stories Extracted:\n');

sampleStories.forEach((story, index) => {
  console.log(`${index + 1}. ${story.title}`);
  console.log(`   Type: ${story.story_type}`);
  console.log(`   Themes: ${story.themes.slice(0, 3).join(', ')}`);
  console.log(`   Impact: ${story.impact_highlights.length} highlights`);
  console.log('');
});

console.log('='.repeat(60));
console.log('\n📁 Sample Story Structure:\n');
console.log(JSON.stringify(sampleStories[0], null, 2));

// Save sample
const outputPath = path.join(__dirname, 'sample-extracted-stories.json');
fs.writeFileSync(outputPath, JSON.stringify(sampleStories, null, 2));

console.log(`\n✅ Sample saved to: ${outputPath}`);
console.log('\n💡 This shows the structure that AI extraction will create!');
console.log('   When you run the full extraction with AI, it will:');
console.log('   - Read ALL your documents');
console.log('   - Extract EVERY story/case study automatically');
console.log('   - Create this same structured data');
console.log('   - Ready to import to Supabase\n');
