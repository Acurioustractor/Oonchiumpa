import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import analysisResults from '../document-analysis-results.json';
import { StaffPortalHeader } from '../components/StaffPortalHeader';

interface DocumentAnalysis {
  documentId: string;
  documentTitle: string;
  serviceAreas: string[];
  outcomes: Array<{
    indicator: string;
    type: 'quantitative' | 'qualitative';
    level: string;
  }>;
  activities: any[];
  culturalElements: {
    elderInvolvement?: boolean;
    onCountry?: boolean;
  };
}

const SERVICE_INFO: Record<string, {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  youth_mentorship: {
    id: 'youth_mentorship',
    name: 'Youth Mentorship',
    description: 'Cultural healing & support for at-risk youth',
    icon: '🌟',
    color: 'text-eucalyptus-600',
    bgColor: 'bg-eucalyptus-50',
    borderColor: 'border-eucalyptus-500'
  },
  true_justice: {
    id: 'true_justice',
    name: 'True Justice',
    description: 'Deep Listening on Country (ANU partnership)',
    icon: '⚖️',
    color: 'text-earth-700',
    bgColor: 'bg-earth-50',
    borderColor: 'border-earth-500'
  },
  atnarpa_homestead: {
    id: 'atnarpa_homestead',
    name: 'Atnarpa Homestead',
    description: 'On-country experiences & cultural connection',
    icon: '🏕️',
    color: 'text-eucalyptus-600',
    bgColor: 'bg-eucalyptus-50',
    borderColor: 'border-eucalyptus-500'
  },
  cultural_brokerage: {
    id: 'cultural_brokerage',
    name: 'Cultural Brokerage',
    description: 'Service navigation & community partnerships',
    icon: '🤝',
    color: 'text-ochre-600',
    bgColor: 'bg-ochre-50',
    borderColor: 'border-ochre-500'
  },
  good_news_stories: {
    id: 'good_news_stories',
    name: 'Good News Stories',
    description: 'Community celebrations & positive outcomes',
    icon: '📰',
    color: 'text-ochre-600',
    bgColor: 'bg-ochre-50',
    borderColor: 'border-ochre-500'
  }
};

export default function ImpactOverviewPage() {
  const summaryStats = useMemo(() => {
    const results = analysisResults as DocumentAnalysis[];

    const serviceStats = Object.keys(SERVICE_INFO).map(serviceKey => {
      const docs = results.filter(doc => doc.serviceAreas?.includes(serviceKey));
      const outcomes = docs.flatMap(d => d.outcomes);
      const activities = docs.flatMap(d => d.activities);

      const quantitative = outcomes.filter(o => o.type === 'quantitative').length;
      const qualitative = outcomes.filter(o => o.type === 'qualitative').length;
      const elderInvolvement = docs.filter(d => d.culturalElements?.elderInvolvement).length;
      const impactOutcomes = outcomes.filter(o => o.level === 'impact' || o.level === 'long_term').length;

      // Calculate score
      let score = 0;
      if (docs.length > 0) score++;
      if (outcomes.length >= 3) score++;
      if (quantitative > 0) score++;
      if (elderInvolvement / Math.max(docs.length, 1) > 0.5) score++;
      if (impactOutcomes > 0) score++;

      return {
        ...SERVICE_INFO[serviceKey],
        documents: docs.length,
        outcomes: outcomes.length,
        activities: activities.length,
        quantitative,
        qualitative,
        score
      };
    });

    return {
      totalDocuments: results.length,
      totalOutcomes: results.flatMap(d => d.outcomes).length,
      totalActivities: results.flatMap(d => d.activities).length,
      serviceStats
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-50 to-white">
      <StaffPortalHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-earth-950 mb-4">
              Impact Framework Overview
            </h1>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto mb-6">
              AI-powered analysis of {summaryStats.totalDocuments} documents extracting{' '}
              {summaryStats.totalOutcomes} measurable outcomes across all Oonchiumpa services
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/staff-portal/impact/add-outcome"
                className="inline-block px-6 py-3 bg-eucalyptus-600 text-white font-medium rounded-lg hover:bg-eucalyptus-700 transition shadow-lg"
              >
                ➕ Add New Outcome
              </Link>
              <Link
                to="/staff-portal/impact/report"
                className="inline-block px-6 py-3 bg-eucalyptus-600 text-white font-medium rounded-lg hover:bg-eucalyptus-700 transition shadow-lg"
              >
                📊 Generate Report
              </Link>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-ochre-500 to-ochre-600 text-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold">{summaryStats.totalDocuments}</div>
              <div className="text-sm mt-2 opacity-90">Documents Analyzed</div>
            </div>
            <div className="bg-gradient-to-br from-eucalyptus-500 to-eucalyptus-600 text-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold">{summaryStats.totalOutcomes}</div>
              <div className="text-sm mt-2 opacity-90">Outcomes Extracted</div>
            </div>
            <div className="bg-gradient-to-br from-eucalyptus-500 to-eucalyptus-600 text-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold">{summaryStats.totalActivities}</div>
              <div className="text-sm mt-2 opacity-90">Activities Documented</div>
            </div>
            <div className="bg-gradient-to-br from-earth-500 to-earth-700 text-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold">5</div>
              <div className="text-sm mt-2 opacity-90">Service Areas</div>
            </div>
          </div>

          {/* Service Dashboards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-earth-950 mb-8 text-center">
              Service Impact Dashboards
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaryStats.serviceStats.map((service) => (
                <Link
                  key={service.id}
                  to={`/staff-portal/impact/${service.id}`}
                  className={`block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-2 ${service.borderColor} overflow-hidden group`}
                >
                  <div className={`${service.bgColor} p-6`}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl">{service.icon}</span>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${service.color}`}>{service.name}</h3>
                        <p className="text-sm text-earth-600 mt-1">{service.description}</p>
                      </div>
                    </div>

                    {/* Impact Score */}
                    <div className="flex justify-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-2xl">
                          {i < service.score ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-earth-950">{service.documents}</div>
                        <div className="text-xs text-earth-600">Documents</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-eucalyptus-600">{service.outcomes}</div>
                        <div className="text-xs text-earth-600">Outcomes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-eucalyptus-600">{service.activities}</div>
                        <div className="text-xs text-earth-600">Activities</div>
                      </div>
                    </div>

                    {/* Evidence Quality */}
                    <div className="mt-4 pt-4 border-t border-earth-200">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-earth-600">Evidence:</span>
                        <span className="font-medium">
                          <span className="text-eucalyptus-600">{service.quantitative} quantitative</span>
                          {' / '}
                          <span className="text-eucalyptus-600">{service.qualitative} qualitative</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <span className="text-eucalyptus-600 font-medium group-hover:text-eucalyptus-700">
                        View Full Dashboard →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-earth-950 mb-6 text-center">
              Explore Impact Data
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/staff-portal/documents"
                className="p-6 border-2 border-earth-200 rounded-lg hover:border-ochre-500 hover:shadow-md transition text-center"
              >
                <div className="text-4xl mb-3">📄</div>
                <h3 className="font-bold text-earth-950 mb-2">All Documents</h3>
                <p className="text-sm text-earth-600">View all analyzed documents with AI-extracted outcomes</p>
              </Link>

              <Link
                to="/staff-portal/outcomes"
                className="p-6 border-2 border-earth-200 rounded-lg hover:border-ochre-500 hover:shadow-md transition text-center"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-earth-950 mb-2">Outcomes Database</h3>
                <p className="text-sm text-earth-600">Search and filter all {summaryStats.totalOutcomes} extracted outcomes</p>
              </Link>

              <Link
                to="/staff-portal/gap-analysis"
                className="p-6 border-2 border-earth-200 rounded-lg hover:border-ochre-500 hover:shadow-md transition text-center"
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-earth-950 mb-2">Gap Analysis</h3>
                <p className="text-sm text-earth-600">Identify missing data and improvement opportunities</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
