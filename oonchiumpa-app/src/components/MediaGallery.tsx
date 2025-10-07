import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import { mediaService, type MediaFile } from "../services/mediaService";

interface MediaGalleryProps {
  category?: MediaFile["category"];
  storytellerId?: string;
  storyId?: string;
  showUpload?: boolean;
  maxItems?: number;
  layout?: "grid" | "masonry" | "carousel";
  allowFullscreen?: boolean;
  showMetadata?: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  category,
  storytellerId,
  storyId,
  showUpload = false,
  maxItems,
  layout = "grid",
  allowFullscreen = true,
  showMetadata = true,
}) => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio">(
    "all",
  );

  useEffect(() => {
    loadMedia();
  }, [category, storytellerId, storyId, filter]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        elder_approved: true, // Only show approved content by default
        cultural_sensitivity: ["public", "community"], // Show community-appropriate content
      };

      if (category) filters.category = category;
      if (storytellerId) filters.storyteller_id = storytellerId;
      if (storyId) filters.story_id = storyId;
      if (filter !== "all") filters.type = filter;
      if (maxItems) filters.limit = maxItems;

      const mediaFiles = await mediaService.getMedia(filters);
      setMedia(mediaFiles);
    } catch (err) {
      setError("Failed to load media files");
      console.error("Media loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (mediaFile: MediaFile, index: number) => {
    if (!allowFullscreen) return;
    setSelectedMedia(mediaFile);
    setCurrentIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedMedia(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const filteredMedia = getFilteredMedia();
    let newIndex = currentIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredMedia.length;
    } else {
      newIndex =
        currentIndex === 0 ? filteredMedia.length - 1 : currentIndex - 1;
    }

    setCurrentIndex(newIndex);
    setSelectedMedia(filteredMedia[newIndex]);
  };

  const getFilteredMedia = () => {
    return media.filter((item) => filter === "all" || item.type === filter);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMediaIcon = (type: MediaFile["type"]): string => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      default:
        return "📄";
    }
  };

  const getCulturalSensitivityBadge = (
    level: MediaFile["cultural_sensitivity"],
  ) => {
    const colors = {
      public: "bg-green-100 text-green-800",
      community: "bg-blue-100 text-blue-800",
      private: "bg-yellow-100 text-yellow-800",
      sacred: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[level]}`}>
        {level === "sacred"
          ? "🛡️"
          : level === "private"
            ? "🔒"
            : level === "community"
              ? "👥"
              : "🌐"}{" "}
        {level}
      </span>
    );
  };

  const renderMediaItem = (item: MediaFile, index: number) => {
    const isVideo = item.type === "video";
    const isAudio = item.type === "audio";
    const isImage = item.type === "image";

    return (
      <Card
        key={item.id}
        className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
          layout === "masonry" ? "break-inside-avoid mb-4" : ""
        }`}
        onClick={() => openLightbox(item, index)}
      >
        {/* Media Preview */}
        <div className="relative aspect-video bg-earth-100 overflow-hidden">
          {isImage && (
            <img
              src={item.thumbnail_url || item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          )}

          {isVideo && (
            <div className="relative w-full h-full">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-earth-800 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
          )}

          {isAudio && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ochre-100 to-eucalyptus-100">
              <div className="text-center">
                <div className="text-4xl mb-2">🎵</div>
                <div className="text-earth-700 font-medium">{item.title}</div>
                {item.duration && (
                  <div className="text-earth-600 text-sm">
                    {formatDuration(item.duration)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Type indicator */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
              {getMediaIcon(item.type)} {item.type}
            </span>
          </div>

          {/* Elder approved badge */}
          {item.elder_approved && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✓ Approved
              </span>
            </div>
          )}
        </div>

        {/* Media Info */}
        {showMetadata && (
          <div className="p-4">
            <h3 className="font-semibold text-earth-900 mb-1 line-clamp-2">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-earth-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {getCulturalSensitivityBadge(item.cultural_sensitivity)}
              {item.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-earth-100 text-earth-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-earth-500">
                  +{item.tags.length - 2} more
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-earth-500">
              <span>{formatFileSize(item.file_size)}</span>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  const filteredMedia = getFilteredMedia();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading />
        <span className="ml-2">Loading media...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-600 mb-2">❌</div>
        <div className="text-earth-900 font-medium mb-2">
          Failed to load media
        </div>
        <div className="text-earth-600 text-sm mb-4">{error}</div>
        <Button variant="secondary" onClick={loadMedia}>
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-earth-900">
            📸 Media Gallery
          </h2>
          <span className="text-earth-600">
            {filteredMedia.length}{" "}
            {filteredMedia.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg overflow-hidden border border-earth-300">
            {[
              { key: "all", label: "All", icon: "📁" },
              { key: "image", label: "Images", icon: "🖼️" },
              { key: "video", label: "Videos", icon: "🎥" },
              { key: "audio", label: "Audio", icon: "🎵" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-2 text-sm ${
                  filter === key
                    ? "bg-ochre-500 text-white"
                    : "bg-white text-earth-700 hover:bg-earth-50"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredMedia.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-earth-900 mb-2">
            No media files yet
          </h3>
          <p className="text-earth-600 mb-4">
            {filter === "all"
              ? "No media files have been uploaded yet."
              : `No ${filter} files found.`}
          </p>
          {showUpload && <Button variant="primary">Upload Media</Button>}
        </Card>
      )}

      {/* Media Grid */}
      {filteredMedia.length > 0 && (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : layout === "masonry"
                ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
                : "flex overflow-x-auto space-x-4 pb-4"
          }
        >
          {filteredMedia.map((item, index) => renderMediaItem(item, index))}
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              ×
            </button>

            {/* Navigation */}
            {filteredMedia.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  →
                </button>
              </>
            )}

            {/* Media content */}
            <div className="bg-white rounded-lg overflow-hidden">
              {selectedMedia.type === "image" && (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}

              {selectedMedia.type === "video" && (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh]"
                />
              )}

              {selectedMedia.type === "audio" && (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedMedia.title}
                  </h3>
                  <audio
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              )}

              {/* Media details */}
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold text-earth-900 mb-2">
                  {selectedMedia.title}
                </h3>

                {selectedMedia.description && (
                  <p className="text-earth-700 mb-4">
                    {selectedMedia.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {getCulturalSensitivityBadge(
                    selectedMedia.cultural_sensitivity,
                  )}
                  {selectedMedia.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-earth-100 text-earth-700 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-earth-600">
                  <div>
                    <div className="font-medium">Type</div>
                    <div>
                      {getMediaIcon(selectedMedia.type)} {selectedMedia.type}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Size</div>
                    <div>{formatFileSize(selectedMedia.file_size)}</div>
                  </div>
                  {selectedMedia.duration && (
                    <div>
                      <div className="font-medium">Duration</div>
                      <div>{formatDuration(selectedMedia.duration)}</div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">Created</div>
                    <div>
                      {new Date(selectedMedia.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
