import React, { useState, useCallback } from 'react';
import {
  documentService,
  type DocumentMetadata,
  type UploadProgress,
  type TranscriptRecord
} from '../services/documentService';

interface DocumentUploadProps {
  onUploadComplete?: (document: TranscriptRecord) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    title: '',
    description: '',
    cultural_sensitivity: 'community',
    requires_elder_review: false,
    tags: []
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files.slice(0, maxFiles)) {
      const validation = documentService.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    if (errors.length > 0) {
      alert(`Some files could not be uploaded:\n\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setShowMetadataForm(true);
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    const newUploads: UploadProgress[] = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploads(newUploads);
    setShowMetadataForm(false);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      try {
        const fileTitle = metadata.title || file.name.split('.')[0];
        const fileMetadata: DocumentMetadata = {
          title: selectedFiles.length > 1 ? `${fileTitle} ${i + 1}` : fileTitle,
          description: metadata.description,
          cultural_sensitivity: metadata.cultural_sensitivity,
          requires_elder_review: metadata.requires_elder_review,
          tags: metadata.tags
        };

        const result = await documentService.uploadDocument(
          file,
          fileMetadata,
          (progress) => {
            setUploads((prev) =>
              prev.map((upload, index) => (index === i ? progress : upload))
            );
          }
        );

        onUploadComplete?.(result);
      } catch (error) {
        setUploads((prev) =>
          prev.map((upload, index) =>
            index === i
              ? {
                  ...upload,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : upload
          )
        );
        onUploadError?.(error as Error);
      }
    }

    // Clear state after upload
    setTimeout(() => {
      setUploads([]);
      setSelectedFiles([]);
      setMetadata({
        title: '',
        description: '',
        cultural_sensitivity: 'community',
        requires_elder_review: false,
        tags: []
      });
    }, 3000);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !metadata.tags?.includes(tag.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Documents or Recordings
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple
            accept="audio/*,video/*,.pdf,.docx,.doc,.txt,image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose Files
            </button>
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Supports audio, video, PDF, Word docs, text files, and images • Max{' '}
            {maxFiles} files • 50MB per file
          </p>
        </div>
      </div>

      {/* Metadata Form */}
      {showMetadataForm && selectedFiles.length > 0 && (
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Document Details
          </h3>

          <div className="space-y-4 mb-6">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">
                  {documentService.getFileIcon(file)}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{file.name}</div>
                  <div className="text-sm text-gray-600">
                    {documentService.formatFileSize(file.size)} •{' '}
                    {documentService.getFileTypeLabel(file)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) =>
                  setMetadata((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder={
                  selectedFiles.length === 1
                    ? selectedFiles[0].name.split('.')[0]
                    : 'Document title'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cultural Sensitivity
              </label>
              <select
                value={metadata.cultural_sensitivity}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    cultural_sensitivity: e.target.value as any
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public - Open sharing</option>
                <option value="community">Community - Oonchiumpa community</option>
                <option value="private">Private - Internal use only</option>
                <option value="sacred">Sacred - Elder approval required</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) =>
                setMetadata((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder="Describe the content, context, or cultural significance..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={metadata.requires_elder_review}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    requires_elder_review: e.target.checked
                  }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Requires elder review before processing
              </span>
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {metadata.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                'Interview',
                'Story Recording',
                'Community Event',
                'Cultural Knowledge',
                'Language Documentation'
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowMetadataForm(false);
                setSelectedFiles([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={uploadFiles}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Progress
          </h3>
          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{documentService.getFileIcon(upload.file)}</span>
                    <span className="font-medium">{upload.file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {upload.status === 'uploading' && (
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    )}
                    {upload.status === 'complete' && (
                      <span className="text-green-600">✅</span>
                    )}
                    {upload.status === 'error' && (
                      <span className="text-red-600">❌</span>
                    )}
                    <span className="text-sm text-gray-600">
                      {upload.progress}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      upload.status === 'error'
                        ? 'bg-red-500'
                        : upload.status === 'complete'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>

                {upload.error && (
                  <p className="text-red-600 text-sm mt-1">{upload.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
