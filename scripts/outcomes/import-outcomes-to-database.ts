import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';
const OONCHIUMPA_PROJECT_ID = 'd10daf41-02ae-45e4-9e9b-1c96e56ee820'; // The Homestead

interface DocumentAnalysis {
  documentId: string;
  documentTitle: string;
  serviceAreas: string[];
  participants: {
    count?: number;
    ageRange?: string;
    demographics?: string;
  };
  activities: Array<{
    type: string;
    description: string;
    date?: string;
    location?: string;
    participants?: number;
  }>;
  outcomes: Array<{
    indicator: string;
    type: 'quantitative' | 'qualitative';
    value?: string | number;
    description: string;
    level: 'output' | 'short_term' | 'medium_term' | 'long_term' | 'impact';
  }>;
  culturalElements: {
    elderInvolvement?: boolean;
    onCountry?: boolean;
    traditionalKnowledge?: boolean;
    languages?: string[];
  };
  keyQuotes: string[];
  successStories: string[];
  challenges: string[];
  recommendations: string[];
}

async function importOutcomesToDatabase() {
  console.log('📊 Importing AI-Extracted Outcomes to Database\n');
  console.log('Organization:', OONCHIUMPA_ORG_ID);
  console.log('Tenant:', OONCHIUMPA_TENANT_ID);
  console.log('Project:', OONCHIUMPA_PROJECT_ID);
  console.log('\n' + '='.repeat(80) + '\n');

  // Load analysis results
  const results: DocumentAnalysis[] = JSON.parse(
    fs.readFileSync('document-analysis-results.json', 'utf-8')
  );

  console.log(`📚 Found ${results.length} analyzed documents\n`);

  let outcomeCount = 0;
  let activityCount = 0;
  let linkageCount = 0;

  for (const doc of results) {
    console.log(`\n📄 Processing: ${doc.documentTitle}`);

    // Import Activities
    for (const activity of doc.activities || []) {
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .insert({
          organization_id: OONCHIUMPA_ORG_ID,
          tenant_id: OONCHIUMPA_TENANT_ID,
          project_id: OONCHIUMPA_PROJECT_ID,
          title: activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: activity.description,
          activity_type: activity.type,
          service_area: doc.serviceAreas[0] || 'general',
          activity_date: activity.date ? new Date(activity.date) : new Date(),
          location: activity.location || null,
          participant_count: activity.participants || doc.participants?.count || null,
          participant_age_range: doc.participants?.ageRange || null,
          language_groups: doc.culturalElements?.languages || [],
          elder_involvement: doc.culturalElements?.elderInvolvement || false,
          traditional_knowledge_shared: doc.culturalElements?.traditionalKnowledge || false,
          outputs: [activity.description],
          participant_feedback: doc.keyQuotes || []
        })
        .select()
        .single();

      if (activityError) {
        console.log(`   ❌ Activity error: ${activityError.message}`);
      } else {
        activityCount++;
        console.log(`   ✅ Activity: ${activity.type}`);
      }
    }

    // Import Outcomes
    for (const outcome of doc.outcomes || []) {
      // Determine outcome type based on description
      let outcomeType: 'individual' | 'program' | 'community' | 'systemic' = 'program';

      if (outcome.description.toLowerCase().includes('student') ||
          outcome.description.toLowerCase().includes('youth') ||
          outcome.description.toLowerCase().includes('participant')) {
        outcomeType = 'individual';
      } else if (outcome.description.toLowerCase().includes('community') ||
                 outcome.description.toLowerCase().includes('cultural')) {
        outcomeType = 'community';
      } else if (outcome.description.toLowerCase().includes('policy') ||
                 outcome.description.toLowerCase().includes('system')) {
        outcomeType = 'systemic';
      }

      const { data: outcomeData, error: outcomeError } = await supabase
        .from('outcomes')
        .insert({
          organization_id: OONCHIUMPA_ORG_ID,
          tenant_id: OONCHIUMPA_TENANT_ID,
          project_id: OONCHIUMPA_PROJECT_ID,
          title: outcome.indicator,
          description: outcome.description,
          outcome_type: outcomeType,
          outcome_level: outcome.level,
          service_area: doc.serviceAreas[0] || 'general',
          indicator_name: outcome.indicator,
          measurement_method: outcome.type === 'quantitative' ? 'quantitative_measurement' : 'qualitative_assessment',
          current_value: outcome.type === 'quantitative' && outcome.value
            ? parseFloat(String(outcome.value).replace(/[^0-9.]/g, ''))
            : null,
          unit: outcome.type === 'quantitative' ? 'percentage' : null,
          qualitative_evidence: [outcome.description],
          success_stories: doc.successStories || [],
          challenges: doc.challenges || [],
          source_document_ids: [doc.documentId],
          participant_count: doc.participants?.count || null,
          cultural_protocols_followed: true,
          elder_involvement: doc.culturalElements?.elderInvolvement || false,
          traditional_knowledge_transmitted: doc.culturalElements?.traditionalKnowledge || false,
          on_country_component: doc.culturalElements?.onCountry || false,
          language_use: doc.culturalElements?.languages || []
        })
        .select()
        .single();

      if (outcomeError) {
        console.log(`   ❌ Outcome error: ${outcomeError.message}`);
      } else {
        outcomeCount++;
        console.log(`   ✅ Outcome: ${outcome.indicator}`);

        // Create document-outcome linkage
        const { error: linkError } = await supabase
          .from('document_outcomes')
          .insert({
            document_id: doc.documentId,
            outcome_id: outcomeData.id,
            evidence_type: outcome.type === 'quantitative' ? 'quantitative' : 'qualitative',
            extraction_method: 'ai_extracted',
            evidence_text: outcome.description,
            confidence_score: 0.85 // AI extraction confidence
          });

        if (!linkError) {
          linkageCount++;
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 IMPORT SUMMARY\n');
  console.log(`Documents Processed: ${results.length}`);
  console.log(`✅ Activities Imported: ${activityCount}`);
  console.log(`✅ Outcomes Imported: ${outcomeCount}`);
  console.log(`✅ Document-Outcome Links: ${linkageCount}`);
  console.log('\n✅ Import complete!\n');
}

importOutcomesToDatabase().catch(console.error);
