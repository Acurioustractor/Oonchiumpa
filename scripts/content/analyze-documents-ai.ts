import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anthropicKey = process.env.ANTHROPIC_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

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

const ANALYSIS_PROMPT = `You are analyzing a document from Oonchiumpa, an Aboriginal community organization in Central Australia that runs programs for youth, cultural healing, and community services.

Analyze this document and extract the following information in a structured format:

1. **Service Areas**: Which Oonchiumpa services does this document relate to?
   - youth_mentorship (Youth mentorship & cultural healing)
   - true_justice (Deep Listening on Country partnership with ANU)
   - atnarpa_homestead (On-country experiences at Atnarpa Station)
   - cultural_brokerage (Service navigation & partnerships)
   - good_news_stories (Community celebrations and events)

2. **Participants**:
   - How many people participated?
   - Age range (e.g., "12-18", "mixed")
   - Any demographic information (gender, language groups, communities)

3. **Activities**: List specific activities mentioned:
   - Activity type (e.g., mentoring session, on-country camp, basketball game, service referral)
   - Description
   - Date (if mentioned)
   - Location
   - Number of participants (if different from overall)

4. **Outcomes**: Extract measurable outcomes and impacts:
   - Indicator name (e.g., "School Re-engagement Rate", "Cultural Connection", "Partnership Success")
   - Type: quantitative (numbers) or qualitative (descriptions)
   - Value (if quantitative, e.g., "95%", "21 participants")
   - Description
   - Level: output (immediate), short_term (0-6mo), medium_term (6-18mo), long_term (18+mo), or impact (lasting change)

5. **Cultural Elements**:
   - Elder involvement (yes/no)
   - On-country activities (yes/no)
   - Traditional knowledge transmission (yes/no)
   - Languages used

6. **Key Quotes**: Important quotes that illustrate impact or outcomes

7. **Success Stories**: Brief narratives of positive outcomes

8. **Challenges**: Any difficulties or barriers mentioned

9. **Recommendations**: Suggested next steps or improvements

Return ONLY a valid JSON object matching this TypeScript interface:
{
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

Be thorough but concise. Focus on factual information. If something isn't mentioned in the document, omit that field or use empty arrays.`;

async function analyzeDocument(documentId: string, title: string, content: string): Promise<DocumentAnalysis | null> {
  try {
    console.log(`\n📄 Analyzing: ${title}`);
    console.log(`   Length: ${content.length} characters`);

    // Truncate if too long (Claude has 200k context, but let's be conservative)
    const truncatedContent = content.length > 100000
      ? content.substring(0, 100000) + '\n\n[Document truncated for analysis]'
      : content;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `${ANALYSIS_PROMPT}\n\nDocument Title: ${title}\n\nDocument Content:\n${truncatedContent}`
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('   ❌ No JSON found in response');
      return null;
    }

    const analysis = JSON.parse(jsonMatch[0]);

    console.log(`   ✅ Extracted:`);
    console.log(`      - Service Areas: ${analysis.serviceAreas?.length || 0}`);
    console.log(`      - Activities: ${analysis.activities?.length || 0}`);
    console.log(`      - Outcomes: ${analysis.outcomes?.length || 0}`);
    console.log(`      - Key Quotes: ${analysis.keyQuotes?.length || 0}`);

    return {
      documentId,
      documentTitle: title,
      ...analysis
    };

  } catch (error) {
    console.error(`   ❌ Error analyzing document:`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function analyzeAllDocuments() {
  console.log('🔍 AI Document Analysis - Extracting Outcomes\n');
  console.log('Organization:', OONCHIUMPA_ORG_ID);
  console.log('Tenant:', OONCHIUMPA_TENANT_ID);
  console.log('\n' + '='.repeat(80) + '\n');

  if (!anthropicKey) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    console.log('\nTo run this analysis, set your Anthropic API key:');
    console.log('export ANTHROPIC_API_KEY=your_key_here\n');
    return;
  }

  // Get all documents
  const { data: documents, error } = await supabase
    .from('transcripts')
    .select('id, title, transcript_content, media_metadata')
    .eq('tenant_id', OONCHIUMPA_TENANT_ID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return;
  }

  console.log(`📚 Found ${documents?.length || 0} documents to analyze\n`);

  const results: DocumentAnalysis[] = [];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const doc of documents || []) {
    const content = doc.transcript_content || '';

    if (!content || content.length < 100) {
      console.log(`\n📄 ${doc.title || doc.id}`);
      console.log(`   ⚠️  Skipped (no content or too short)`);
      skipCount++;
      continue;
    }

    const analysis = await analyzeDocument(doc.id, doc.title || 'Untitled', content);

    if (analysis) {
      results.push(analysis);
      successCount++;
    } else {
      errorCount++;
    }

    // Rate limiting - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 ANALYSIS SUMMARY\n');
  console.log(`Total documents: ${documents?.length || 0}`);
  console.log(`✅ Analyzed: ${successCount}`);
  console.log(`⚠️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  // Save results to file
  const fs = await import('fs');
  const outputPath = 'document-analysis-results.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);

  // Generate summary statistics
  const totalOutcomes = results.reduce((sum, r) => sum + (r.outcomes?.length || 0), 0);
  const totalActivities = results.reduce((sum, r) => sum + (r.activities?.length || 0), 0);
  const serviceAreaCounts: Record<string, number> = {};

  results.forEach(r => {
    r.serviceAreas?.forEach(sa => {
      serviceAreaCounts[sa] = (serviceAreaCounts[sa] || 0) + 1;
    });
  });

  console.log(`\n📈 OUTCOMES EXTRACTED\n`);
  console.log(`Total Outcomes: ${totalOutcomes}`);
  console.log(`Total Activities: ${totalActivities}`);
  console.log(`\nBy Service Area:`);
  Object.entries(serviceAreaCounts).forEach(([area, count]) => {
    console.log(`  - ${area}: ${count} documents`);
  });

  console.log(`\n✅ Analysis complete!`);
  console.log(`\nNext steps:`);
  console.log(`1. Review results in ${outputPath}`);
  console.log(`2. Verify extracted data accuracy`);
  console.log(`3. Import to outcomes database`);
  console.log(`4. Build document analysis pages\n`);
}

analyzeAllDocuments().catch(console.error);
