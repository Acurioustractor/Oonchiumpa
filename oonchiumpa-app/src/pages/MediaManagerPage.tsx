import React, { useState } from "react";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { Section } from "../components/Section";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";
import { type MediaFile } from "../services/mediaService";

export const MediaManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "team-photos" | "story-media" | "upload"
  >("all");
  const [showUpload, setShowUpload] = useState(false);

  const tabs = [
    { id: "all", label: "All Media", icon: "📁" },
    { id: "team-photos", label: "Team Photos", icon: "👥" },
    { id: "story-media", label: "Story Media", icon: "📖" },
    { id: "upload", label: "Upload New", icon: "📤" },
  ];

  const handleUploadComplete = (media: MediaFile) => {
    console.log("Media uploaded:", media);
    // Refresh the gallery views
    setShowUpload(false);
    setActiveTab("all");
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload failed:", error);
    alert("Upload failed: " + error.message);
  };

  return (
    <>
      {/* Header */}
      <Section className="bg-gradient-to-br from-ochre-50 via-eucalyptus-50 to-earth-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6">
            📸 Media Management
          </h1>
          <p className="text-lg md:text-xl text-earth-700 mb-8">
            Centralized management for all community photos, videos, and media
            content
          </p>
        </div>
      </Section>

      {/* Navigation Tabs */}
      <Section className="py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "secondary"}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "upload") {
                  setShowUpload(true);
                } else {
                  setShowUpload(false);
                }
              }}
              className="flex items-center space-x-2"
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {/* Upload Section */}
          {(activeTab === "upload" || showUpload) && (
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-earth-900">
                    📤 Upload New Media
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => setShowUpload(false)}
                  >
                    Close
                  </Button>
                </div>
                <MediaUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  maxFiles={20}
                  acceptedTypes={["image/*", "video/*", "audio/*"]}
                />
              </CardBody>
            </Card>
          )}

          {/* All Media */}
          {activeTab === "all" && !showUpload && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-earth-900">
                  📁 All Media Files
                </h2>
                <Button variant="primary" onClick={() => setShowUpload(true)}>
                  📤 Upload Media
                </Button>
              </div>
              <MediaGallery
                layout="grid"
                maxItems={100}
                allowFullscreen={true}
                showMetadata={true}
              />
            </div>
          )}

          {/* Team Photos */}
          {activeTab === "team-photos" && !showUpload && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-earth-900">
                  👥 Team Photos
                </h2>
                <Button variant="primary" onClick={() => setShowUpload(true)}>
                  📤 Upload Team Photo
                </Button>
              </div>
              <MediaGallery
                category="team-photos"
                layout="grid"
                maxItems={100}
                allowFullscreen={true}
                showMetadata={true}
              />
            </div>
          )}

          {/* Story Media */}
          {activeTab === "story-media" && !showUpload && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-earth-900">
                  📖 Story Media
                </h2>
                <Button variant="primary" onClick={() => setShowUpload(true)}>
                  📤 Upload Story Media
                </Button>
              </div>
              <MediaGallery
                category="story-media"
                layout="grid"
                maxItems={100}
                allowFullscreen={true}
                showMetadata={true}
              />
            </div>
          )}

          {/* Media Management Guidelines */}
          <Card className="bg-gradient-to-r from-earth-800 to-earth-900">
            <CardBody className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                🛡️ Media Management Guidelines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-white font-semibold">Content Review</div>
                  <div className="text-earth-300 text-sm">
                    All media requires Elder approval before going public
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏷️</div>
                  <div className="text-white font-semibold">Proper Tagging</div>
                  <div className="text-earth-300 text-sm">
                    Use descriptive tags and set appropriate privacy levels
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-white font-semibold">
                    Permission First
                  </div>
                  <div className="text-earth-300 text-sm">
                    Always obtain consent before uploading photos of people
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-earth-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  📊 Quick Management Actions
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="secondary" size="sm">
                    📋 Review Pending
                  </Button>
                  <Button variant="secondary" size="sm">
                    🗂️ Organize by Tags
                  </Button>
                  <Button variant="secondary" size="sm">
                    📈 View Statistics
                  </Button>
                  <Button variant="secondary" size="sm">
                    🧹 Cleanup Duplicates
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Cultural Sensitivity Levels */}
          <Card className="bg-gradient-to-r from-ochre-50 to-eucalyptus-50 border-ochre-200">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4 text-center">
                🛡️ Cultural Sensitivity Levels
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-medium text-green-800">Public</div>
                  <div className="text-green-700">Open for all to see</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-medium text-blue-800">Community</div>
                  <div className="text-blue-700">Oonchiumpa community only</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="font-medium text-yellow-800">Private</div>
                  <div className="text-yellow-700">Internal team use only</div>
                </div>
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-medium text-red-800">Sacred</div>
                  <div className="text-red-700">Elder approval required</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default MediaManagerPage;
