import React, { useState, useEffect } from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import MediaUpload from "./MediaUpload";
import MediaGallery from "./MediaGallery";
import { mediaService, type MediaFile } from "../services/mediaService";

export const MediaLibraryManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'upload' | 'gallery' | 'stats'>('stats');
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    pendingApproval: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    checkSetupAndLoadStats();
  }, []);

  const checkSetupAndLoadStats = async () => {
    setLoading(true);
    try {
      const mediaStats = await mediaService.getMediaStats();
      setStats(mediaStats);
      setSetupComplete(true);
    } catch (error) {
      console.error('Error loading media stats:', error);
      setSetupComplete(false);
    }
    setLoading(false);
  };

  const handleUploadComplete = (media: MediaFile) => {
    console.log('Media uploaded:', media);
    setActiveView('gallery');
    checkSetupAndLoadStats(); // Refresh stats
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload failed:', error);
    alert('Upload failed: ' + error.message);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loading />
      </div>
    );
  }

  // Setup not complete - show instructions
  if (!setupComplete) {
    return (
      <Card className="border-2 border-ochre-200">
        <CardBody className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-earth-950 mb-2">
              Media Library Setup Required
            </h2>
            <p className="text-earth-600">
              The media_files database table needs to be created before you can upload media.
            </p>
          </div>

          <div className="bg-eucalyptus-50 border border-eucalyptus-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-earth-950 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Setup Instructions
            </h3>
            <ol className="space-y-3 text-earth-700">
              <li className="flex items-start gap-2">
                <span className="text-ochre-600 font-bold">1.</span>
                <div>
                  <strong>Open Supabase SQL Editor:</strong>
                  <br />
                  <a
                    href="https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ochre-600 hover:text-ochre-700 underline"
                  >
                    Click here to open SQL Editor →
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ochre-600 font-bold">2.</span>
                <div>
                  <strong>Copy SQL from file:</strong>
                  <br />
                  <code className="text-sm bg-earth-100 px-2 py-1 rounded">
                    create-media-tables.sql
                  </code>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ochre-600 font-bold">3.</span>
                <div>
                  <strong>Paste and run the SQL</strong> in the editor
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ochre-600 font-bold">4.</span>
                <div>
                  <strong>Refresh this page</strong> to verify the setup
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-sand-50 border border-sand-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-earth-950 mb-2">What gets created:</h4>
            <ul className="text-sm text-earth-700 space-y-1">
              <li>✅ media_files table with full schema</li>
              <li>✅ Row Level Security policies</li>
              <li>✅ Database indexes for performance</li>
              <li>✅ Auto-update triggers</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => checkSetupAndLoadStats()}
            >
              🔄 Check Setup Status
            </Button>
            <Button
              variant="primary"
              onClick={() => window.open('https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new', '_blank')}
            >
              📋 Open SQL Editor
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-earth-600">
            📖 See <code className="bg-earth-100 px-2 py-1 rounded">MEDIA-LIBRARY-SETUP.md</code> for detailed instructions
          </div>
        </CardBody>
      </Card>
    );
  }

  // Setup complete - show media library interface
  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-earth-950">
          📸 Media Library
        </h2>
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'stats' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('stats')}
            size="sm"
          >
            📊 Stats
          </Button>
          <Button
            variant={activeView === 'upload' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('upload')}
            size="sm"
          >
            📤 Upload
          </Button>
          <Button
            variant={activeView === 'gallery' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('gallery')}
            size="sm"
          >
            🖼️ Gallery
          </Button>
        </div>
      </div>

      {/* Stats View */}
      {activeView === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-eucalyptus-200">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">📁</div>
              <div className="text-2xl font-bold text-earth-950">{stats.totalFiles}</div>
              <div className="text-sm text-earth-600">Total Files</div>
            </CardBody>
          </Card>

          <Card className="border-2 border-ochre-200">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">💾</div>
              <div className="text-2xl font-bold text-earth-950">
                {formatFileSize(stats.totalSize)}
              </div>
              <div className="text-sm text-earth-600">Total Storage</div>
            </CardBody>
          </Card>

          <Card className="border-2 border-sand-200">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">🖼️</div>
              <div className="text-2xl font-bold text-earth-950">
                {stats.byType.image || 0}
              </div>
              <div className="text-sm text-earth-600">Images</div>
            </CardBody>
          </Card>

          <Card className="border-2 border-eucalyptus-200">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-earth-950">
                {stats.pendingApproval}
              </div>
              <div className="text-sm text-earth-600">Pending Approval</div>
            </CardBody>
          </Card>

          {/* By Category */}
          <Card className="md:col-span-2">
            <CardBody className="p-6">
              <h3 className="font-semibold text-earth-950 mb-4">📂 By Category</h3>
              <div className="space-y-2">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-earth-700 capitalize">{category.replace('-', ' ')}</span>
                    <span className="font-semibold text-earth-950">{count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* By Type */}
          <Card className="md:col-span-2">
            <CardBody className="p-6">
              <h3 className="font-semibold text-earth-950 mb-4">📊 By Type</h3>
              <div className="space-y-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-earth-700 capitalize">
                      {type === 'image' && '🖼️ Images'}
                      {type === 'video' && '🎥 Videos'}
                      {type === 'audio' && '🎵 Audio'}
                      {type === 'document' && '📄 Documents'}
                    </span>
                    <span className="font-semibold text-earth-950">{count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Upload View */}
      {activeView === 'upload' && (
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold text-earth-950 mb-6">
              📤 Upload Media Files
            </h3>
            <MediaUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxFiles={20}
              acceptedTypes={['image/*', 'video/*', 'audio/*']}
            />
          </CardBody>
        </Card>
      )}

      {/* Gallery View */}
      {activeView === 'gallery' && (
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold text-earth-950 mb-6">
              🖼️ Media Gallery
            </h3>
            <MediaGallery
              layout="grid"
              maxItems={100}
              allowFullscreen={true}
              showMetadata={true}
            />
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-ochre-50 to-eucalyptus-50 border-ochre-200">
        <CardBody className="p-6">
          <h3 className="font-semibold text-earth-950 mb-4 text-center">
            🎯 Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setActiveView('upload')}>
              📤 Upload New Media
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setActiveView('gallery')}>
              🖼️ Browse Gallery
            </Button>
            <Button variant="secondary" size="sm" onClick={() => checkSetupAndLoadStats()}>
              🔄 Refresh Stats
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open('/media', '_blank')}
            >
              👁️ View Media Page
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Guidelines */}
      <Card className="bg-gradient-to-r from-earth-800 to-earth-900">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            🛡️ Cultural Sensitivity Guidelines
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-eucalyptus-900/30 border border-eucalyptus-700/50 rounded-lg">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-medium text-eucalyptus-200">Public</div>
              <div className="text-eucalyptus-300/80">Open for all to see</div>
            </div>
            <div className="text-center p-3 bg-eucalyptus-900/30 border border-eucalyptus-700/50 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-eucalyptus-200">Community</div>
              <div className="text-blue-300/80">Oonchiumpa community only</div>
            </div>
            <div className="text-center p-3 bg-ochre-900/30 border border-ochre-700/50 rounded-lg">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-medium text-ochre-200">Private</div>
              <div className="text-ochre-300/80">Internal team use only</div>
            </div>
            <div className="text-center p-3 bg-sunset-900/30 border border-sunset-700/50 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-medium text-sunset-200">Sacred</div>
              <div className="text-sunset-300/80">Elder approval required</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MediaLibraryManager;
