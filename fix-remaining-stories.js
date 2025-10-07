#!/usr/bin/env node
/**
 * Manually import the 2 stories that failed with check constraint
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
const KRISTY_BLOOMFIELD_ID = 'b59a1f4c-94fd-4805-a2c5-cac0922133e0';

const stories = [
  {
    title: "CB: Understanding Cultural Responsibility and Leadership",
    story_type: "youth_success",
    summary: "CB developed understanding of his cultural responsibilities as a man and his role as a leader in his community, showing remorse for past actions and embracing his leadership potential.",
    content: "CB understands since becoming a man he has more responsibility and is now becoming more of a role model and leader in the Town Camp. He didn't understand the importance of his cultural role before. He is now able to reflect on his actions in the past and feeling remorse. He knows he can be a leader.",
    themes: ["cultural_responsibility", "leadership", "reflection", "mentorship", "community_role"],
    cultural_themes: ["cultural_authority", "traditional_knowledge", "community_leadership", "manhood"],
    privacy_level: "community",
    cultural_sensitivity_level: "standard",
    impact_highlights: [
      "Understands cultural responsibilities of manhood",
      "Becoming role model in Town Camp",
      "Developed ability to reflect on past actions",
      "Shows genuine remorse",
      "Embracing leadership potential"
    ],
    participants: ["CB", "Oonchiumpa Team Leader"],
    location: "Alice Springs Town Camp",
    date_period: "July-December 2024"
  },
  {
    title: "Atnarpa Station Cultural Learning - Boys Trip",
    story_type: "on_country_experience",
    summary: "Young men experienced traditional knowledge sharing and addressed cultural identity challenges while learning about bush medicines, storytelling, and family lineage on country.",
    content: "We spoke of how you could take what they've had experienced while visiting Atnarpa Station Field Trip back to your homelands and start learning from family. How each client saw young proud members demonstrating and sharing their knowledge of making bush medicines that has been passed down from their elders, storytelling and the sharing the history of that area. Since having discussions while on country when we went on a field trip to Atnarpa station, where we spoke of learning of self-identity. Malachi had been teased by the other clients of having no culture no language because of his light skin, he looked disempowered over their remarks, I questioned them 'just because you know language does it make you more Aboriginal than him'. One of the questions I had asked of these 2 individuals is 'what do you know of your lineage family line', 'since you're an initiated young man do you know your skin names or your own story lines'. I told Malachi it's not too late to learn these things of your family background and connection to country, I told him he's in the best position of going back to learn these things because of his family. Malachi has family that have started to reconnect back to country by opening their own school to teach the next generation of a language that was on the brink of extinction. Malachi had returned onto country with extended family members and demonstrated sharing with non-indigenous students that recently visited his homelands which I think is an improvement of his behaviour, he wanted to learn he wanted to be a part of knowledge sharing to him so he can be more empowered.",
    themes: ["identity_development", "cultural_connection", "mentorship", "family_healing", "empowerment", "cultural_education"],
    cultural_themes: ["on_country", "traditional_knowledge", "bush_medicines", "storytelling", "kinship", "language_preservation", "cultural_identity"],
    privacy_level: "community",
    cultural_sensitivity_level: "standard",
    impact_highlights: [
      "Addressed cultural identity challenges",
      "Connected with family language preservation efforts",
      "Demonstrated knowledge sharing with non-Indigenous students",
      "Empowered to learn family background",
      "Witnessed traditional knowledge sharing",
      "Developed cultural confidence"
    ],
    participants: ["Malachi", "Oonchiumpa staff", "young men", "traditional owners"],
    location: "Atnarpa Station, Central Australia",
    date_period: "July-December 2024"
  }
];

async function main() {
  console.log('\n🔧 Fixing remaining 2 stories\n');

  for (const story of stories) {
    const storyData = {
      tenant_id: OONCHIUMPA_TENANT_ID,
      author_id: KRISTY_BLOOMFIELD_ID,
      title: story.title,
      content: story.content,
      summary: story.summary,
      story_type: story.story_type,
      themes: story.themes,
      cultural_themes: story.cultural_themes,
      privacy_level: story.privacy_level,
      cultural_sensitivity_level: story.cultural_sensitivity_level,
      is_public: false, // community level = not public
      status: 'published',
      story_stage: 'published',
      ai_processed: true,
      ai_generated_summary: true,
      has_explicit_consent: true,
      ai_processing_consent_verified: true,
      media_metadata: {
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
      console.error(`❌ Error saving "${story.title}":`, error.message);
      console.error('   Full error:', error);
    } else {
      console.log(`✅ Saved: "${story.title}"`);
    }
  }

  console.log('\n✨ Done!\n');
}

main().catch(console.error);
