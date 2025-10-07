import React, { useState, useCallback } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import {
  mediaService,
  type MediaFile,
  type MediaUploadProgress,
} from "../services/mediaService";

interface MediaUploadProps {
  category?: MediaFile["category"];
  storytellerId?: string;
  storyId?: string;
  onUploadComplete?: (media: MediaFile) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  category = "story-media",
  storytellerId,
  storyId,
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  acceptedTypes = ["image/*", "video/*", "audio/*"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<MediaUploadProgress[]>([]);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    cultural_sensitivity: "community" as MediaFile["cultural_sensitivity"],
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    },
    [],
  );

  const handleFiles = (files: File[]) => {
    const validFiles = files
      .filter((file) => {
        // Check file type
        const isValidType = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        });

        // Check file size (50MB limit)
        const isValidSize = file.size <= 50 * 1024 * 1024;

        return isValidType && isValidSize;
      })
      .slice(0, maxFiles);

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setShowMetadataForm(true);
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    const newUploads: MediaUploadProgress[] = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploads(newUploads);
    setShowMetadataForm(false);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      try {
        const fileTitle = metadata.title || file.name.split(".")[0];
        const result = await mediaService.uploadMedia(
          file,
          {
            title:
              selectedFiles.length > 1 ? `${fileTitle} ${i + 1}` : fileTitle,
            description: metadata.description,
            category,
            tags: metadata.tags,
            storyteller_id: storytellerId,
            story_id: storyId,
            cultural_sensitivity: metadata.cultural_sensitivity,
          },
          (progress) => {
            setUploads((prev) =>
              prev.map((upload, index) => (index === i ? progress : upload)),
            );
          },
        );

        onUploadComplete?.(result);
      } catch (error) {
        setUploads((prev) =>
          prev.map((upload, index) =>
            index === i
              ? { ...upload, status: "error", error: error.message }
              : upload,
          ),
        );
        onUploadError?.(error as Error);
      }
    }

    // Clear state after upload
    setTimeout(() => {
      setUploads([]);
      setSelectedFiles([]);
      setMetadata({
        title: "",
        description: "",
        tags: [],
        cultural_sensitivity: "community",
      });
    }, 3000);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !metadata.tags.includes(tag.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.startsWith("video/")) return "🎥";
    if (file.type.startsWith("audio/")) return "🎵";
    return "📄";
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? "border-ochre-500 bg-ochre-50" : "border-earth-300"
        }`}
      >
        <div
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-earth-900 mb-2">
            Upload Media Files
          </h3>
          <p className="text-earth-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="secondary" as="span" className="cursor-pointer">
              Choose Files
            </Button>
          </label>
          <p className="text-sm text-earth-500 mt-2">
            Supports {acceptedTypes.join(", ")} • Max {maxFiles} files • 50MB
            per file
          </p>
        </div>
      </Card>

      {/* Metadata Form */}
      {showMetadataForm && selectedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">
            📝 File Details
          </h3>

          <div className="space-y-4 mb-6">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-earth-50 rounded-lg"
              >
                <span className="text-2xl">{getFileIcon(file)}</span>
                <div className="flex-1">
                  <div className="font-medium text-earth-900">{file.name}</div>
                  <div className="text-sm text-earth-600">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
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
                    ? selectedFiles[0].name.split(".")[0]
                    : "Media collection title"
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Cultural Sensitivity
              </label>
              <select
                value={metadata.cultural_sensitivity}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    cultural_sensitivity: e.target
                      .value as MediaFile["cultural_sensitivity"],
                  }))
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
              >
                <option value="public">Public - Open sharing</option>
                <option value="community">
                  Community - Oonchiumpa community
                </option>
                <option value="private">Private - Internal use only</option>
                <option value="sacred">Sacred - Elder approval required</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Description
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) =>
                setMetadata((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the content, context, or cultural significance..."
              rows={3}
              className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-ochre-100 text-ochre-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-ochre-600 hover:text-ochre-800"
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
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Cultural Stories",
                "Community Events",
                "Youth Programs",
                "Traditional Knowledge",
                "Team Photos",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-2 py-1 text-xs bg-earth-100 text-earth-700 rounded-full hover:bg-earth-200"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setShowMetadataForm(false);
                setSelectedFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={uploadFiles}>
              Upload {selectedFiles.length} file
              {selectedFiles.length > 1 ? "s" : ""}
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">
            📤 Upload Progress
          </h3>
          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{getFileIcon(upload.file)}</span>
                    <span className="font-medium">{upload.file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {upload.status === "uploading" && <Loading size="sm" />}
                    {upload.status === "complete" && (
                      <span className="text-green-600">✅</span>
                    )}
                    {upload.status === "error" && (
                      <span className="text-red-600">❌</span>
                    )}
                    <span className="text-sm text-earth-600">
                      {upload.progress}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-earth-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      upload.status === "error"
                        ? "bg-red-500"
                        : upload.status === "complete"
                          ? "bg-green-500"
                          : "bg-ochre-500"
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
        </Card>
      )}
    </div>
  );
};

export default MediaUpload;
