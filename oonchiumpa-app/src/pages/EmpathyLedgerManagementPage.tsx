import { useState, useEffect } from 'react';
import { StaffPortalHeader } from '../components/StaffPortalHeader';
import { supabase } from '../config/supabase';

interface EmpathyEntry {
  id: string;
  organization_id: string;
  title: string;
  narrative: string;
  storyteller_name?: string;
  storyteller_consent?: boolean;
  impact_indicator?: string;
  outcome_level?: string;
  timeframe?: string;
  service_area?: string;
  target_group?: string;
  change_pathway?: string;
  media_urls?: string[];
  document_urls?: string[];
  ready_to_publish: boolean;
  synced_to_oonchiumpa: boolean;
  sync_date?: string;
  linked_story_id?: string;
  linked_outcome_id?: string;
  linked_transcript_id?: string;
  publish_status: string;
  privacy_level: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface ApprovalQueueItem {
  id: string;
  empathy_entry_id: string;
  content_type: string;
  title: string;
  summary: string;
  status: string;
  privacy_level: string;
  submitted_at: string;
  cultural_review_required: boolean;
  cultural_approved: boolean;
  elder_review_required: boolean;
  elder_approved: boolean;
  review_notes?: string;
}

export default function EmpathyLedgerManagementPage() {
  const [entries, setEntries] = useState<EmpathyEntry[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'entries' | 'queue' | 'synced'>('entries');
  const [selectedEntry, setSelectedEntry] = useState<EmpathyEntry | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'entries' || activeTab === 'synced') {
        // Load empathy entries
        const { data, error } = await supabase
          .from('empathy_entries')
          .select('*')
          .eq('synced_to_oonchiumpa', activeTab === 'synced')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      }

      if (activeTab === 'queue') {
        // Load approval queue
        const { data, error } = await supabase
          .from('content_approval_queue')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        setApprovalQueue(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markReadyToPublish = async (entryId: string) => {
    try {
      // Call the database function
      const { error } = await supabase.rpc('mark_ready_to_publish', {
        entry_id: entryId
      });

      if (error) throw error;

      alert('✅ Marked ready to publish and added to approval queue!');
      loadData();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const approveContent = async (queueId: string, notes: string = '') => {
    try {
      const { error } = await supabase.rpc('approve_for_publishing', {
        queue_id: queueId,
        reviewer_id: null, // Would get from auth context
        notes: notes
      });

      if (error) throw error;

      alert('✅ Content approved! Run sync to publish to website.');
      loadData();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const rejectContent = async (queueId: string, reason: string) => {
    try {
      const { error } = await supabase.rpc('reject_content', {
        queue_id: queueId,
        reviewer_id: null,
        reason: reason
      });

      if (error) throw error;

      alert('❌ Content rejected.');
      loadData();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const runSync = async () => {
    setSyncing(true);
    try {
      // In production, this would call the sync script endpoint
      // For now, show instructions
      const confirmed = confirm(
        'This will sync all approved content to the Oonchiumpa website.\n\n' +
        'Run this command in terminal:\n' +
        'npx tsx empathy-to-oonchiumpa-sync.ts\n\n' +
        'Continue?'
      );

      if (confirmed) {
        alert('Please run the sync script in your terminal:\nnpx tsx empathy-to-oonchiumpa-sync.ts');
      }
    } finally {
      setSyncing(false);
    }
  };

  const serviceNames: Record<string, string> = {
    youth_mentorship: 'Youth Mentorship',
    true_justice: 'True Justice',
    atnarpa_homestead: 'Atnarpa Homestead',
    cultural_brokerage: 'Cultural Brokerage',
    good_news_stories: 'Good News Stories'
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    ready: 'bg-blue-100 text-blue-700',
    synced: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    published: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <StaffPortalHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-xl">Loading Empathy Ledger data...</div>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              💚 Empathy Ledger Management
            </h1>
            <p className="text-gray-600">
              Manage content from Empathy Ledger and publish to Oonchiumpa website
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('entries')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'entries'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 All Entries
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'queue'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⏳ Approval Queue
            </button>
            <button
              onClick={() => setActiveTab('synced')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'synced'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✅ Synced to Website
            </button>
          </div>

          {/* Sync Button */}
          <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Sync to Website</h3>
                <p className="text-sm text-blue-700">
                  Sync all approved content from Empathy Ledger to the Oonchiumpa website
                </p>
              </div>
              <button
                onClick={runSync}
                disabled={syncing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition"
              >
                {syncing ? 'Syncing...' : '🔄 Run Sync Now'}
              </button>
            </div>
          </div>

          {/* All Entries Tab */}
          {activeTab === 'entries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Empathy Entries ({entries.length})
                </h2>
              </div>

              {entries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No entries yet
                  </h3>
                  <p className="text-gray-600">
                    Entries captured in Empathy Ledger will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {entry.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[entry.publish_status] || 'bg-gray-100'}`}>
                              {entry.publish_status}
                            </span>
                            {entry.service_area && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {entry.service_area}
                              </span>
                            )}
                            {entry.privacy_level && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {entry.privacy_level}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {entry.narrative?.substring(0, 200)}...
                          </p>
                          {entry.impact_indicator && (
                            <div className="text-sm text-gray-600">
                              <strong>Impact:</strong> {entry.impact_indicator}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        {!entry.ready_to_publish && entry.publish_status === 'draft' && (
                          <button
                            onClick={() => markReadyToPublish(entry.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                          >
                            ✓ Mark Ready to Publish
                          </button>
                        )}

                        {entry.synced_to_oonchiumpa && (
                          <div className="flex gap-2 text-sm text-green-600">
                            <span>✅ Synced</span>
                            {entry.linked_story_id && <span>• Story</span>}
                            {entry.linked_outcome_id && <span>• Outcome</span>}
                            {entry.linked_transcript_id && <span>• Transcript</span>}
                          </div>
                        )}

                        {entry.rejection_reason && (
                          <span className="text-sm text-red-600">
                            ❌ Rejected: {entry.rejection_reason}
                          </span>
                        )}

                        <span className="text-sm text-gray-500 ml-auto">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Approval Queue Tab */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Approval Queue ({approvalQueue.length})
              </h2>

              {approvalQueue.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">⏳</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No items in queue
                  </h3>
                  <p className="text-gray-600">
                    Content marked as "ready to publish" will appear here for approval
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalQueue.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md p-6 border-2 border-yellow-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                              {item.status}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {item.content_type}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {item.privacy_level}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      {/* Review Checklist */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Review Checklist:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={item.cultural_approved} readOnly />
                            <span>Cultural protocols reviewed</span>
                            {item.cultural_review_required && !item.cultural_approved && (
                              <span className="text-yellow-600">(Required)</span>
                            )}
                          </div>
                          {item.elder_review_required && (
                            <div className="flex items-center gap-2">
                              <input type="checkbox" checked={item.elder_approved} readOnly />
                              <span>Elder approval obtained</span>
                              {!item.elder_approved && (
                                <span className="text-yellow-600">(Required)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {item.status === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              const notes = prompt('Approval notes (optional):');
                              if (notes !== null) approveContent(item.id, notes);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition"
                          >
                            ✓ Approve for Publishing
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) rejectContent(item.id, reason);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}

                      {item.review_notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                          <strong>Notes:</strong> {item.review_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Synced Tab */}
          {activeTab === 'synced' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Synced to Website ({entries.length})
              </h2>

              {entries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No synced content yet
                  </h3>
                  <p className="text-gray-600">
                    Content synced to the website will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg shadow-md p-6 border-2 border-green-300"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {entry.title}
                      </h3>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {entry.linked_story_id && (
                          <div className="p-3 bg-purple-50 rounded">
                            <div className="text-sm text-purple-600 font-semibold">Story</div>
                            <div className="text-xs text-purple-700 font-mono truncate">
                              {entry.linked_story_id}
                            </div>
                            <a
                              href={`/stories/${entry.linked_story_id}`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View →
                            </a>
                          </div>
                        )}

                        {entry.linked_outcome_id && (
                          <div className="p-3 bg-orange-50 rounded">
                            <div className="text-sm text-orange-600 font-semibold">Outcome</div>
                            <div className="text-xs text-orange-700 font-mono truncate">
                              {entry.linked_outcome_id}
                            </div>
                            <a
                              href={`/staff-portal/impact`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View →
                            </a>
                          </div>
                        )}

                        {entry.linked_transcript_id && (
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="text-sm text-blue-600 font-semibold">Document</div>
                            <div className="text-xs text-blue-700 font-mono truncate">
                              {entry.linked_transcript_id}
                            </div>
                            <a
                              href={`/staff-portal/documents`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View →
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Synced:</strong> {new Date(entry.sync_date!).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
