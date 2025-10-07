import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ContentGenerator from '../components/ContentGenerator';
import ImageUpload from '../components/ImageUpload';
import LiveContentPreview from '../components/LiveContentPreview';
import DocumentProcessor from '../components/DocumentProcessor';
import { Loading } from '../components/Loading';

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
    if (!token) {
      setStats({ documentsPending: 0, storiesInReview: 0, publishedThisMonth: 0 });
      setContentQueue([]);
      setRecentDocuments([]);
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load dashboard stats
      const statsResponse = await fetch('http://localhost:3001/api/content/dashboard-stats', { headers });
      
      // Load content queue  
      const queueResponse = await fetch('http://localhost:3001/api/content/queue', { headers });
      
      // Load recent documents
      const docsResponse = await fetch('http://localhost:3001/api/upload/images', { headers });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }
      
      if (queueResponse.ok) {
        const queueData = await queueResponse.json();
        setContentQueue(queueData.queue || []);
      }
      
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setRecentDocuments(docsData.images || []);
      }
      
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

            {/* Recent Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-earth-900 mb-4">📄 Recent Documents</h3>
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
                  <div className="space-y-3">
                    {recentDocuments.slice(0, 4).map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">📄</div>
                          <div>
                            <div className="font-medium text-earth-900">{doc.filename || doc.id}</div>
                            <div className="text-sm text-earth-500">{new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          uploaded
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Content Queue */}
              <Card className="p-6">
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
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <ContentGenerator />
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <DocumentProcessor />
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