import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import analysisResults from '../document-analysis-results.json';
import { StaffPortalHeader } from '../components/StaffPortalHeader';

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
}

const SERVICE_INFO: Record<string, {
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}> = {
  youth_mentorship: {
    name: 'Youth Mentorship & Cultural Healing',
    description: 'Supporting at-risk youth through cultural connection, mentoring, and holistic support services',
    icon: '🌟',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  true_justice: {
    name: 'True Justice: Deep Listening on Country',
    description: 'ANU partnership program providing transformative cultural learning experiences for law students',
    icon: '⚖️',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  atnarpa_homestead: {
    name: 'Atnarpa Homestead On-Country Experiences',
    description: 'Cultural healing and connection to country through on-station experiences and skills development',
    icon: '🏕️',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  cultural_brokerage: {
    name: 'Cultural Brokerage & Service Navigation',
    description: 'Linking community members to identity, culture, and essential western services through trusted relationships',
    icon: '🤝',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  good_news_stories: {
    name: 'Good News Stories',
    description: 'Community celebrations, events, and positive outcomes demonstrating the impact of our programs',
    icon: '📰',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }
};

export default function ServiceImpactDashboard() {
  const { serviceArea } = useParams<{ serviceArea: string }>();

  const serviceInfo = serviceArea ? SERVICE_INFO[serviceArea] : null;

  // Filter documents and outcomes for this service
  const serviceData = useMemo(() => {
    if (!serviceArea) return null;

    const documents = (analysisResults as DocumentAnalysis[]).filter(doc =>
      doc.serviceAreas?.includes(serviceArea)
    );

    const allOutcomes = documents.flatMap(doc =>
      doc.outcomes.map(outcome => ({ ...outcome, documentId: doc.documentId, documentTitle: doc.documentTitle }))
    );

    const allActivities = documents.flatMap(doc =>
      doc.activities.map(activity => ({ ...activity, documentId: doc.documentId, documentTitle: doc.documentTitle }))
    );

    const totalParticipants = documents.reduce((sum, doc) =>
      sum + (doc.participants?.count || 0), 0
    );

    const elderInvolvement = documents.filter(doc =>
      doc.culturalElements?.elderInvolvement
    ).length;

    const onCountryActivities = documents.filter(doc =>
      doc.culturalElements?.onCountry
    ).length;

    const quantitativeOutcomes = allOutcomes.filter(o => o.type === 'quantitative').length;
    const qualitativeOutcomes = allOutcomes.filter(o => o.type === 'qualitative').length;

    // Calculate impact score (0-5 stars)
    let impactScore = 0;
    if (documents.length > 0) impactScore++;
    if (allOutcomes.length >= 3) impactScore++;
    if (quantitativeOutcomes > 0) impactScore++;
    if (elderInvolvement / documents.length > 0.5) impactScore++;
    if (allOutcomes.some(o => o.level === 'impact' || o.level === 'long_term')) impactScore++;

    return {
      documents,
      allOutcomes,
      allActivities,
      totalParticipants,
      elderInvolvement,
      onCountryActivities,
      quantitativeOutcomes,
      qualitativeOutcomes,
      impactScore
    };
  }, [serviceArea]);

  if (!serviceArea || !serviceInfo || !serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <Link to="/staff-portal" className="text-orange-600 hover:text-orange-700">
            ← Back to Staff Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <StaffPortalHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/staff-portal/impact" className="text-orange-600 hover:text-orange-700 font-medium mb-4 inline-block">
              ← Back to Impact Overview
            </Link>
            <div className={`${serviceInfo.bgColor} rounded-lg p-8 mb-8`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{serviceInfo.icon}</span>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{serviceInfo.name}</h1>
                  <p className="text-gray-700 mt-2">{serviceInfo.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-orange-600">{serviceData.documents.length}</div>
              <div className="text-sm text-gray-600 mt-2">Documents Analyzed</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600">{serviceData.allOutcomes.length}</div>
              <div className="text-sm text-gray-600 mt-2">Outcomes Extracted</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600">{serviceData.allActivities.length}</div>
              <div className="text-sm text-gray-600 mt-2">Activities Documented</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < serviceData.impactScore ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600">Impact Evidence Score</div>
            </div>
          </div>

          {/* Outcome Types Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">📊 Outcome Evidence Quality</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Quantitative (Numbers)</span>
                  <span className="text-green-600 font-bold">{serviceData.quantitativeOutcomes}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(serviceData.quantitativeOutcomes / serviceData.allOutcomes.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Qualitative (Stories)</span>
                  <span className="text-blue-600 font-bold">{serviceData.qualitativeOutcomes}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(serviceData.qualitativeOutcomes / serviceData.allOutcomes.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Cultural Indicators */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">🪃 Cultural Integrity Indicators</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {serviceData.elderInvolvement}/{serviceData.documents.length}
                </div>
                <div className="text-sm text-gray-600 mt-2">Documents with Elder Involvement</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {serviceData.onCountryActivities}/{serviceData.documents.length}
                </div>
                <div className="text-sm text-gray-600 mt-2">On-Country Activities</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {serviceData.totalParticipants > 0 ? serviceData.totalParticipants : 'Multiple'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Participants Tracked</div>
              </div>
            </div>
          </div>

          {/* All Outcomes */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">🎯 All Outcomes ({serviceData.allOutcomes.length})</h2>
            <div className="space-y-4">
              {serviceData.allOutcomes.map((outcome, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{outcome.indicator}</h3>
                    <Link
                      to={`/staff-portal/documents/${outcome.documentId}/analysis`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View Document →
                    </Link>
                  </div>
                  <p className="text-gray-700 mb-2">{outcome.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      outcome.type === 'quantitative' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {outcome.type}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {outcome.level.replace('_', ' ')}
                    </span>
                    {outcome.value && (
                      <span className="font-bold text-orange-600">{outcome.value}</span>
                    )}
                    <span className="text-gray-500 ml-auto text-xs">{outcome.documentTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">📄 Source Documents ({serviceData.documents.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceData.documents.map((doc) => (
                <Link
                  key={doc.documentId}
                  to={`/staff-portal/documents/${doc.documentId}/analysis`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{doc.documentTitle}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">{doc.outcomes.length} outcomes</span>
                    <span className="text-green-600">{doc.activities.length} activities</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
