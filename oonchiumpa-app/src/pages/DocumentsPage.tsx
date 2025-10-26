import React, { useState, useEffect } from 'react';
import { DocumentUpload } from '../components/DocumentUpload';
import {
  documentService,
  type TranscriptRecord
} from '../services/documentService';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<TranscriptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [filter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = filter !== 'all' ? { status: filter } : undefined;
      const docs = await documentService.getDocuments(filters);

      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (document: TranscriptRecord) => {
    console.log('Document uploaded:', document);
    setDocuments((prev) => [document, ...prev]);
    setShowUpload(false);
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      alert(`Failed to delete document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const url = await documentService.getDownloadUrl(id);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error downloading document:', err);
      alert(`Failed to download: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSensitivityBadge = (sensitivity: string) => {
    const colors: Record<string, string> = {
      public: 'bg-green-100 text-green-800',
      community: 'bg-blue-100 text-blue-800',
      private: 'bg-orange-100 text-orange-800',
      sacred: 'bg-purple-100 text-purple-800'
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colors[sensitivity] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1)}
      </span>
    );
  };

  const getMediaIcon = (doc: TranscriptRecord) => {
    if (doc.video_url) return '🎥';
    if (doc.audio_url) return '🎵';
    const fileType = doc.media_metadata?.file_type;
    if (fileType?.startsWith('application/pdf')) return '📕';
    if (fileType?.includes('word')) return '📄';
    if (fileType?.startsWith('text/')) return '📝';
    if (fileType?.startsWith('image/')) return '🖼️';
    return '📎';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">
              Upload and manage interview recordings, transcripts, and documents
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>{showUpload ? '✕ Cancel' : '+ Upload'}</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                filter === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                  {documents.filter((d) => d.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="mb-8">
          <DocumentUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxFiles={10}
          />
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={loadDocuments}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first document to get started
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-3xl">{getMediaIcon(doc)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {doc.title || 'Untitled Document'}
                        </h3>
                        {getStatusBadge(doc.status || 'pending')}
                        {getSensitivityBadge(
                          doc.cultural_sensitivity || 'community'
                        )}
                        {doc.requires_elder_review && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Elder Review
                          </span>
                        )}
                      </div>

                      {doc.media_metadata?.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {doc.media_metadata.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>📅 {formatDate(doc.created_at)}</span>
                        {doc.media_metadata?.file_size && (
                          <span>
                            📦{' '}
                            {documentService.formatFileSize(
                              doc.media_metadata.file_size
                            )}
                          </span>
                        )}
                        {doc.word_count && (
                          <span>📝 {doc.word_count.toLocaleString()} words</span>
                        )}
                        {doc.duration_seconds && (
                          <span>
                            ⏱️{' '}
                            {Math.floor(doc.duration_seconds / 60)} min
                          </span>
                        )}
                      </div>

                      {doc.media_metadata?.tags &&
                        doc.media_metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.media_metadata.tags.map(
                              (tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {!loading && documents.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {documents.length} document
          {documents.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` (${filter})`}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
