import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ContentGenerator from '../components/ContentGenerator';
import ImageUpload from '../components/ImageUpload';
import LiveContentPreview from '../components/LiveContentPreview';
import { DocumentUpload } from '../components/DocumentUpload';
import { Loading } from '../components/Loading';
import { supabase } from '../config/supabase';
import { documentService } from '../services/documentService';
import analysisResults from '../document-analysis-results.json';

// Oonchiumpa Organization Constants
const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

const StaffPortalPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'documents' | 'review'>('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'content', name: 'Content Creation', icon: '📝' },
    { id: 'documents', name: 'Document Processing', icon: '📄' },
    { id: 'review', name: 'Cultural Review', icon: '🛡️' }
  ];

  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [contentQueue, setContentQueue] = useState<any[]>([]);
  const [stats, setStats] = useState({
    documentsPending: 0,
    storiesInReview: 0,
    publishedThisMonth: 0
  });

  // Load real data from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get current month start date
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Count published blog posts this month (using project_id for blog_posts)
      const { count: publishedCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', '5b853f55-c01e-4f1d-9e16-b99290ee1a2c') // Original project_id
        .eq('status', 'published')
        .gte('created_at', monthStart);

      // Count stories in review (not public yet) - FILTERED BY ORGANIZATION
      const { count: reviewCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', OONCHIUMPA_ORG_ID)
        .eq('is_public', false);

      // Count transcripts (documents pending) - FILTERED BY STORYTELLER TENANT
      // First get Oonchiumpa storytellers
      const { data: storytellers } = await supabase
        .from('profiles')
        .select('id')
        .eq('tenant_id', OONCHIUMPA_TENANT_ID)
        .contains('tenant_roles', ['storyteller']);

      const storytellerIds = storytellers?.map(s => s.id) || [];

      // Then count transcripts belonging to those storytellers
      const { count: transcriptsCount } = await supabase
        .from('transcripts')
        .select('*', { count: 'exact', head: true })
        .in('storyteller_id', storytellerIds.length > 0 ? storytellerIds : ['00000000-0000-0000-0000-000000000000']);

      // Get ALL transcripts as "documents" (removed limit to show all)
      const { data: recentTranscripts } = await supabase
        .from('transcripts')
        .select('id, title, created_at, status')
        .in('storyteller_id', storytellerIds.length > 0 ? storytellerIds : ['00000000-0000-0000-0000-000000000000'])
        .order('created_at', { ascending: false });

      // Get recent stories for content queue - FILTERED BY ORGANIZATION
      const { data: recentStories } = await supabase
        .from('stories')
        .select('id, title, story_category, is_public, created_at')
        .eq('organization_id', OONCHIUMPA_ORG_ID)
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        documentsPending: transcriptsCount || 0,
        storiesInReview: reviewCount || 0,
        publishedThisMonth: publishedCount || 0
      });

      setRecentDocuments(recentTranscripts || []);
      setContentQueue(recentStories || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({ documentsPending: 0, storiesInReview: 0, publishedThisMonth: 0 });
      setContentQueue([]);
      setRecentDocuments([]);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-50 to-eucalyptus-50">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-earth-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      {/* Header */}
      <div className="bg-earth-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Oonchiumpa Staff Portal</h1>
              <span className="text-ochre-300">|</span>
              <span className="text-ochre-200">Content Management System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                className="text-ochre-200 hover:text-white"
              >
                ← Back to Public Site
              </Button>
              <div className="text-right">
                <div className="font-semibold">{user?.name}</div>
                <div className="text-sm text-earth-300">{user?.role}</div>
              </div>
              <div className="w-10 h-10 bg-ochre-600 rounded-full flex items-center justify-center font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-ochre-200 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-ochre-500 text-ochre-600'
                    : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="p-8 bg-gradient-to-r from-ochre-50 to-eucalyptus-50">
              <h2 className="text-3xl font-bold text-earth-900 mb-4">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p className="text-earth-700 text-lg mb-6">
                Ready to craft authentic community stories and share our journey with the world.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-ochre-600">{stats.documentsPending}</div>
                  <div className="text-earth-600">Documents Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-eucalyptus-600">{stats.storiesInReview}</div>
                  <div className="text-earth-600">Stories in Review</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-earth-600">{stats.publishedThisMonth}</div>
                  <div className="text-earth-600">Published This Month</div>
                </div>
              </div>
            </Card>

            {/* Impact Framework - NEW! */}
            <Card className="p-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-orange-900 mb-2 flex items-center gap-2">
                    🎯 Impact Framework Analysis
                    <span className="px-2 py-1 text-xs bg-orange-600 text-white rounded-full">NEW!</span>
                  </h2>
                  <p className="text-orange-800 mb-4">
                    AI-powered analysis extracted 26 outcomes from 16 documents across all Oonchiumpa services
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">16</div>
                      <div className="text-xs text-gray-600">Documents Analyzed</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">26</div>
                      <div className="text-xs text-gray-600">Outcomes Extracted</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-orange-600">5</div>
                      <div className="text-xs text-gray-600">Service Areas</div>
                    </div>
                  </div>
                  <Link
                    to="/staff-portal/impact"
                    className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
                  >
                    View Impact Dashboard →
                  </Link>
                </div>
              </div>
            </Card>

            {/* All Documents with Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-earth-900">📄 All Documents</h3>
                <Link
                  to="/staff-portal/documents"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Manage Documents →
                </Link>
              </div>
              {recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📤</div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-2">No Documents Yet</h4>
                  <p className="text-earth-600 mb-4">Upload your first documents to get started</p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('documents')}
                  >
                    Upload Documents
                  </Button>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                  {recentDocuments.map((doc) => {
                    const analysis = analysisResults.find((a: any) => a.documentId === doc.id);
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg border border-earth-200 hover:border-ochre-300 transition">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-2xl">📄</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-earth-900 truncate">{doc.title || 'Untitled'}</div>
                            <div className="text-sm text-earth-500">
                              {new Date(doc.created_at).toLocaleDateString()}
                              {doc.status && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                  {doc.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {analysis ? (
                          <Link
                            to={`/staff-portal/documents/${doc.id}/analysis`}
                            className="ml-3 px-3 py-1.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md whitespace-nowrap transition"
                          >
                            🔍 Analysis
                          </Link>
                        ) : (
                          <span className="ml-3 px-3 py-1.5 text-xs text-gray-400 whitespace-nowrap">
                            Not analyzed
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

              {/* Content Queue */}
              <Card className="p-6 mt-8">
                <h3 className="text-xl font-bold text-earth-900 mb-4">📝 Content Queue</h3>
                {contentQueue.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">✍️</div>
                    <h4 className="text-lg font-semibold text-earth-700 mb-2">No Content in Queue</h4>
                    <p className="text-earth-600 mb-4">Process documents to generate content</p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setActiveTab('content')}
                    >
                      Create Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contentQueue.map((content, index) => (
                      <div key={index} className="p-3 bg-earth-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-earth-900 text-sm leading-tight">
                            {content.title}
                          </div>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {content.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-earth-600">{content.author}</span>
                          <span className="text-earth-500">{new Date(content.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <ContentGenerator />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-earth-900 mb-6">📄 Document Upload & Management</h2>
              <p className="text-earth-700 mb-8">
                Upload interview recordings, transcripts, and documents. All uploads are automatically linked to Oonchiumpa organization.
              </p>
              <DocumentUpload
                maxFiles={10}
                onUploadComplete={async (doc) => {
                  console.log('Document uploaded:', doc);
                  // Reload dashboard stats
                  await loadDashboardData();
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert(`Upload failed: ${error.message}`);
                }}
              />
            </Card>

            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-earth-900">Recent Documents</h3>
                  <p className="text-earth-600 mt-1">View and manage your uploaded documents</p>
                </div>
                <a
                  href="/staff-portal/documents"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Documents →
                </a>
              </div>

              {recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📤</div>
                  <h4 className="text-lg font-semibold text-earth-700 mb-2">No Documents Yet</h4>
                  <p className="text-earth-600">Upload your first document above to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-lg border border-earth-200">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {doc.video_url ? '🎥' : doc.audio_url ? '🎵' : '📄'}
                        </div>
                        <div>
                          <div className="font-medium text-earth-900">{doc.title || 'Untitled'}</div>
                          <div className="text-sm text-earth-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                            {doc.status && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                {doc.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-earth-900 mb-6">🛡️ Cultural Review Center</h2>
              <p className="text-earth-700 mb-8">
                Ensure all content respects cultural protocols and represents our community appropriately.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-yellow-500">
                  <h3 className="font-bold text-earth-900 mb-2">⏳ Pending Review</h3>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">4</div>
                  <p className="text-sm text-earth-600">Stories awaiting cultural review</p>
                </Card>
                
                <Card className="p-6 border-l-4 border-l-purple-500">
                  <h3 className="font-bold text-earth-900 mb-2">👥 Elder Consultation</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-2">2</div>
                  <p className="text-sm text-earth-600">Requiring Elder guidance</p>
                </Card>
                
                <Card className="p-6 border-l-4 border-l-green-500">
                  <h3 className="font-bold text-earth-900 mb-2">✅ Approved</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">38</div>
                  <p className="text-sm text-earth-600">Ready for publication</p>
                </Card>
              </div>
            </Card>

            <LiveContentPreview />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPortalPage;