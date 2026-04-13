import { useState, useEffect } from 'react';
import { StaffPortalHeader } from '../components/StaffPortalHeader';
import { supabase } from '../config/supabase';

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';

interface OutcomeData {
  id: string;
  title: string;
  description: string;
  outcome_type: string;
  outcome_level: string;
  service_area: string;
  indicator_name: string;
  baseline_value: number;
  target_value: number;
  current_value: number;
  unit: string;
  participant_count: number;
  elder_involvement: boolean;
  on_country_component: boolean;
  traditional_knowledge_transmitted: boolean;
  qualitative_evidence: string[];
  success_stories: string[];
  measurement_date: string;
}

export default function ImpactReportPage() {
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState('all-time');

  useEffect(() => {
    loadOutcomes();
  }, []);

  const loadOutcomes = async () => {
    try {
      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('organization_id', OONCHIUMPA_ORG_ID)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setOutcomes(data || []);
    } catch (error) {
      console.error('Error loading outcomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (baseline: number, target: number, current: number) => {
    if (!baseline || !target || !current) return 0;
    if (target === baseline) return 100;
    const progress = ((current - baseline) / (target - baseline)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Group outcomes by service area
  const outcomesByService = outcomes.reduce((acc, outcome) => {
    if (!acc[outcome.service_area]) {
      acc[outcome.service_area] = [];
    }
    acc[outcome.service_area].push(outcome);
    return acc;
  }, {} as Record<string, OutcomeData[]>);

  // Calculate overall statistics
  const stats = {
    totalOutcomes: outcomes.length,
    totalParticipants: outcomes.reduce((sum, o) => sum + (o.participant_count || 0), 0),
    withElders: outcomes.filter(o => o.elder_involvement).length,
    onCountry: outcomes.filter(o => o.on_country_component).length,
    traditionalKnowledge: outcomes.filter(o => o.traditional_knowledge_transmitted).length,
    outputLevel: outcomes.filter(o => o.outcome_level === 'output').length,
    shortTerm: outcomes.filter(o => o.outcome_level === 'short_term').length,
    mediumTerm: outcomes.filter(o => o.outcome_level === 'medium_term').length,
    longTerm: outcomes.filter(o => o.outcome_level === 'long_term').length,
    impact: outcomes.filter(o => o.outcome_level === 'impact').length
  };

  const serviceNames: Record<string, string> = {
    youth_mentorship: 'Youth Mentorship & Cultural Healing',
    true_justice: 'True Justice: Deep Listening on Country',
    atnarpa_homestead: 'Atnarpa Homestead On-Country Experiences',
    cultural_brokerage: 'Cultural Brokerage & Service Navigation',
    good_news_stories: 'Good News Stories'
  };

  const exportToPrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-earth-50 to-white">
        <StaffPortalHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-xl">Loading impact data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-50 to-white">
      <StaffPortalHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Report Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-earth-950 mb-2">
                  Oonchiumpa Impact Report
                </h1>
                <p className="text-earth-600">
                  Comprehensive outcomes analysis across all services
                </p>
              </div>
              <button
                onClick={exportToPrint}
                className="px-6 py-3 bg-eucalyptus-600 text-white rounded-lg hover:bg-eucalyptus-700 font-medium transition shadow-lg print:hidden"
              >
                📄 Export to PDF
              </button>
            </div>

            <div className="border-t border-earth-200 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-earth-600">Report Date</div>
                  <div className="font-semibold">{new Date().toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-earth-600">Period</div>
                  <div className="font-semibold">All Time</div>
                </div>
                <div>
                  <div className="text-sm text-earth-600">Total Outcomes</div>
                  <div className="font-semibold">{stats.totalOutcomes}</div>
                </div>
                <div>
                  <div className="text-sm text-earth-600">Participants</div>
                  <div className="font-semibold">{stats.totalParticipants}+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-earth-950 mb-6">Executive Summary</h2>

            <div className="prose max-w-none">
              <p className="text-earth-700 mb-4">
                Oonchiumpa has documented <strong>{stats.totalOutcomes} measurable outcomes</strong> across five core service areas,
                demonstrating significant impact in youth mentorship, cultural healing, justice reform, and community strengthening.
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-6">
                <div className="bg-eucalyptus-50 p-6 rounded-lg border-2 border-eucalyptus-200">
                  <div className="text-3xl font-bold text-eucalyptus-600 mb-2">{stats.withElders}</div>
                  <div className="text-sm text-earth-700">Outcomes with Elder involvement</div>
                  <div className="text-xs text-earth-500 mt-2">
                    {Math.round((stats.withElders / stats.totalOutcomes) * 100)}% of all outcomes
                  </div>
                </div>

                <div className="bg-eucalyptus-50 p-6 rounded-lg border-2 border-eucalyptus-200">
                  <div className="text-3xl font-bold text-eucalyptus-600 mb-2">{stats.onCountry}</div>
                  <div className="text-sm text-earth-700">On-Country activities</div>
                  <div className="text-xs text-earth-500 mt-2">
                    {Math.round((stats.onCountry / stats.totalOutcomes) * 100)}% of all outcomes
                  </div>
                </div>

                <div className="bg-ochre-50 p-6 rounded-lg border-2 border-ochre-200">
                  <div className="text-3xl font-bold text-ochre-600 mb-2">{stats.traditionalKnowledge}</div>
                  <div className="text-sm text-earth-700">Traditional knowledge shared</div>
                  <div className="text-xs text-earth-500 mt-2">
                    {Math.round((stats.traditionalKnowledge / stats.totalOutcomes) * 100)}% of all outcomes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theory of Change Progress */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-earth-950 mb-6">Theory of Change Framework</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-earth-700">Outputs</div>
                <div className="flex-1 bg-earth-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-eucalyptus-500 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                    style={{ width: `${(stats.outputLevel / stats.totalOutcomes) * 100}%` }}
                  >
                    {stats.outputLevel}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-earth-700">Short-term</div>
                <div className="flex-1 bg-earth-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-eucalyptus-500 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                    style={{ width: `${(stats.shortTerm / stats.totalOutcomes) * 100}%` }}
                  >
                    {stats.shortTerm}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-earth-700">Medium-term</div>
                <div className="flex-1 bg-earth-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-ochre-500 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                    style={{ width: `${(stats.mediumTerm / stats.totalOutcomes) * 100}%` }}
                  >
                    {stats.mediumTerm}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-earth-700">Long-term</div>
                <div className="flex-1 bg-earth-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-ochre-500 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                    style={{ width: `${(stats.longTerm / stats.totalOutcomes) * 100}%` }}
                  >
                    {stats.longTerm}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-earth-700">Impact</div>
                <div className="flex-1 bg-earth-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-earth-500 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                    style={{ width: `${(stats.impact / stats.totalOutcomes) * 100}%` }}
                  >
                    {stats.impact}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-earth-600 mt-6">
              Our outcomes demonstrate progress across all levels of the Theory of Change framework,
              from immediate outputs to lasting community impact.
            </p>
          </div>

          {/* Service-by-Service Outcomes */}
          {Object.entries(outcomesByService).map(([serviceArea, serviceOutcomes]) => (
            <div key={serviceArea} className="bg-white rounded-lg shadow-lg p-8 mb-8 break-inside-avoid">
              <h2 className="text-2xl font-bold text-earth-950 mb-4">
                {serviceNames[serviceArea] || serviceArea}
              </h2>
              <p className="text-earth-600 mb-6">
                {serviceOutcomes.length} outcomes documented
              </p>

              <div className="space-y-6">
                {serviceOutcomes.map((outcome) => (
                  <div key={outcome.id} className="border-l-4 border-eucalyptus-500 pl-4 py-2">
                    <h3 className="font-semibold text-earth-950 mb-2">{outcome.indicator_name}</h3>
                    {outcome.description && (
                      <p className="text-sm text-earth-700 mb-2">{outcome.description}</p>
                    )}

                    {outcome.baseline_value && outcome.target_value && outcome.current_value && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-earth-600 mb-1">
                          <span>Baseline: {outcome.baseline_value}{outcome.unit}</span>
                          <span>Current: {outcome.current_value}{outcome.unit}</span>
                          <span>Target: {outcome.target_value}{outcome.unit}</span>
                        </div>
                        <div className="w-full bg-earth-200 rounded-full h-2">
                          <div
                            className="bg-eucalyptus-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${calculateProgress(outcome.baseline_value, outcome.target_value, outcome.current_value)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-earth-100 rounded">{outcome.outcome_level.replace('_', ' ')}</span>
                      {outcome.participant_count && (
                        <span className="px-2 py-1 bg-eucalyptus-100 text-eucalyptus-700 rounded">
                          {outcome.participant_count} participants
                        </span>
                      )}
                      {outcome.elder_involvement && (
                        <span className="px-2 py-1 bg-earth-100 text-earth-700 rounded">Elder involvement</span>
                      )}
                      {outcome.on_country_component && (
                        <span className="px-2 py-1 bg-eucalyptus-100 text-eucalyptus-700 rounded">On Country</span>
                      )}
                    </div>

                    {outcome.success_stories && outcome.success_stories.length > 0 && (
                      <div className="mt-3 bg-ochre-50 p-3 rounded text-sm italic text-earth-700">
                        "{outcome.success_stories[0]}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="bg-earth-100 rounded-lg p-6 text-center text-sm text-earth-600">
            <p>Generated automatically from Oonchiumpa Impact Framework Database</p>
            <p className="mt-2">Report Date: {new Date().toLocaleDateString()} | Total Outcomes: {stats.totalOutcomes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
