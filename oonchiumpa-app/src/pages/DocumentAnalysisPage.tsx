import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { StaffPortalHeader } from '../components/StaffPortalHeader';

// Import AI analysis results
import analysisResults from '../document-analysis-results.json';

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

const SERVICE_LABELS: Record<string, string> = {
  youth_mentorship: 'Youth Mentorship & Cultural Healing',
  true_justice: 'True Justice: Deep Listening on Country',
  atnarpa_homestead: 'Atnarpa Homestead On-Country Experiences',
  cultural_brokerage: 'Cultural Brokerage & Service Navigation',
  good_news_stories: 'Good News Stories'
};

const OUTCOME_LEVEL_LABELS: Record<string, string> = {
  output: 'Output (Immediate)',
  short_term: 'Short-term (0-6 months)',
  medium_term: 'Medium-term (6-18 months)',
  long_term: 'Long-term (18+ months)',
  impact: 'Impact (Lasting Change)'
};

export default function DocumentAnalysisPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<any>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentData();
  }, [documentId]);

  async function loadDocumentData() {
    if (!documentId) return;

    try {
      // Load document from Supabase
      const { data: docData } = await supabase
        .from('transcripts')
        .select('*')
        .eq('id', documentId)
        .single();

      setDocument(docData);

      // Find analysis in imported JSON
      const docAnalysis = (analysisResults as DocumentAnalysis[]).find(
        (a) => a.documentId === documentId
      );
      setAnalysis(docAnalysis || null);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading document analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Not Found</h1>
            <p className="text-gray-600 mb-8">This document has not been analyzed yet.</p>
            <Link to="/staff-portal/documents" className="text-orange-600 hover:text-orange-700 font-medium">
              ← Back to Documents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <StaffPortalHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/staff-portal/documents" className="text-orange-600 hover:text-orange-700 font-medium mb-4 inline-block">
              ← Back to Documents
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{analysis.documentTitle}</h1>
            <p className="text-gray-600">AI-Powered Document Analysis</p>
          </div>

          {/* Service Areas */}
          {analysis.serviceAreas && analysis.serviceAreas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📂 Service Areas</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.serviceAreas.map((area, idx) => (
                  <Link
                    key={idx}
                    to={`/staff-portal/impact/${area}`}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition"
                  >
                    {SERVICE_LABELS[area] || area}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes */}
          {analysis.outcomes && analysis.outcomes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Outcomes Extracted ({analysis.outcomes.length})</h2>
              <div className="space-y-6">
                {analysis.outcomes.map((outcome, idx) => (
                  <div key={idx} className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{outcome.indicator}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        outcome.type === 'quantitative'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {outcome.type === 'quantitative' ? '📊 Quantitative' : '💬 Qualitative'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{outcome.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                        {OUTCOME_LEVEL_LABELS[outcome.level]}
                      </span>
                      {outcome.value && (
                        <span className="font-bold text-orange-600 text-lg">
                          {outcome.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {analysis.activities && analysis.activities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎬 Activities Documented ({analysis.activities.length})</h2>
              <div className="space-y-4">
                {analysis.activities.map((activity, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-gray-700 mb-3">{activity.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      {activity.location && (
                        <span className="flex items-center gap-1">
                          📍 {activity.location}
                        </span>
                      )}
                      {activity.date && (
                        <span className="flex items-center gap-1">
                          📅 {activity.date}
                        </span>
                      )}
                      {activity.participants && (
                        <span className="flex items-center gap-1">
                          👥 {activity.participants} participants
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Elements */}
          {analysis.culturalElements && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🪃 Cultural Elements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${analysis.culturalElements.elderInvolvement ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    {analysis.culturalElements.elderInvolvement ? '✅' : '⬜'}
                    <span className="font-medium">Elder Involvement</span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${analysis.culturalElements.onCountry ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    {analysis.culturalElements.onCountry ? '✅' : '⬜'}
                    <span className="font-medium">On-Country Activities</span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${analysis.culturalElements.traditionalKnowledge ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    {analysis.culturalElements.traditionalKnowledge ? '✅' : '⬜'}
                    <span className="font-medium">Traditional Knowledge Transmitted</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="font-medium mb-2">Languages</div>
                  <div className="text-sm text-gray-600">
                    {analysis.culturalElements.languages && analysis.culturalElements.languages.length > 0
                      ? analysis.culturalElements.languages.join(', ')
                      : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Quotes */}
          {analysis.keyQuotes && analysis.keyQuotes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Key Quotes</h2>
              <div className="space-y-4">
                {analysis.keyQuotes.map((quote, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <p className="text-gray-800 italic">"{quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Stories */}
          {analysis.successStories && analysis.successStories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Success Stories</h2>
              <div className="space-y-4">
                {analysis.successStories.map((story, idx) => (
                  <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-800">{story}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          {analysis.participants && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Participants</h2>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {analysis.participants.count && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{analysis.participants.count}</div>
                    <div className="text-sm text-gray-600 mt-1">Participants</div>
                  </div>
                )}
                {analysis.participants.ageRange && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{analysis.participants.ageRange}</div>
                    <div className="text-sm text-gray-600 mt-1">Age Range</div>
                  </div>
                )}
                {analysis.participants.demographics && (
                  <div className="p-4 bg-purple-50 rounded-lg col-span-full md:col-span-1">
                    <div className="text-sm font-medium text-purple-900">{analysis.participants.demographics}</div>
                    <div className="text-xs text-gray-600 mt-1">Demographics</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Challenges & Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            {analysis.challenges && analysis.challenges.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Challenges</h2>
                <ul className="space-y-2">
                  {analysis.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Recommendations</h2>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">→</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
