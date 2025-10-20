import React, { useState } from "react";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { Section } from "../components/Section";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";
import { type MediaFile } from "../services/mediaService";

export const MediaManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "team-photos" | "story-media" | "service-photos" | "upload"
  >("all");
  const [showUpload, setShowUpload] = useState(false);

  const tabs = [
    { id: "all", label: "All Media", icon: "📁" },
    { id: "team-photos", label: "Team Photos", icon: "👥" },
    { id: "story-media", label: "Story Media", icon: "📖" },
    { id: "service-photos", label: "Service Photos", icon: "🎯" },
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

          {/* Service Photos */}
          {activeTab === "service-photos" && !showUpload && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-earth-900">
                  🎯 Service Photos
                </h2>
                <Button variant="primary" onClick={() => setShowUpload(true)}>
                  📤 Upload Service Photo
                </Button>
              </div>

              {/* Service Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-2 border-ochre-200 hover:border-ochre-400 transition-colors cursor-pointer">
                  <CardBody className="p-6 text-center">
                    <div className="text-3xl mb-2">💚</div>
                    <h3 className="font-semibold text-earth-900 mb-1">Youth Mentorship</h3>
                    <p className="text-sm text-earth-600">Cultural healing programs</p>
                    <div className="mt-3 text-xs text-ochre-600 font-medium">View Photos →</div>
                  </CardBody>
                </Card>

                <Card className="border-2 border-ochre-200 hover:border-ochre-400 transition-colors cursor-pointer">
                  <CardBody className="p-6 text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <h3 className="font-semibold text-earth-900 mb-1">True Justice</h3>
                    <p className="text-sm text-earth-600">Law student training</p>
                    <div className="mt-3 text-xs text-ochre-600 font-medium">View Photos →</div>
                  </CardBody>
                </Card>

                <Card className="border-2 border-ochre-200 hover:border-ochre-400 transition-colors cursor-pointer">
                  <CardBody className="p-6 text-center">
                    <div className="text-3xl mb-2">🏡</div>
                    <h3 className="font-semibold text-earth-900 mb-1">Atnarpa Homestead</h3>
                    <p className="text-sm text-earth-600">On-country experiences</p>
                    <div className="mt-3 text-xs text-ochre-600 font-medium">13 Photos</div>
                  </CardBody>
                </Card>

                <Card className="border-2 border-ochre-200 hover:border-ochre-400 transition-colors cursor-pointer">
                  <CardBody className="p-6 text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <h3 className="font-semibold text-earth-900 mb-1">Cultural Brokerage</h3>
                    <p className="text-sm text-earth-600">Service navigation</p>
                    <div className="mt-3 text-xs text-ochre-600 font-medium">View Photos →</div>
                  </CardBody>
                </Card>
              </div>

              {/* Instructions */}
              <Card className="bg-gradient-to-r from-eucalyptus-50 to-sand-50 border-eucalyptus-200">
                <CardBody className="p-6">
                  <h3 className="text-lg font-semibold text-earth-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    How to Tag Photos for Services
                  </h3>
                  <div className="space-y-3 text-earth-700">
                    <p className="flex items-start gap-2">
                      <span className="text-ochre-600 font-bold">1.</span>
                      <span>Upload photos to gallery using the "Upload New" tab</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-ochre-600 font-bold">2.</span>
                      <span>Add relevant tags like "youth-mentorship", "true-justice", "atnarpa-homestead"</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-ochre-600 font-bold">3.</span>
                      <span>Photos will automatically appear on the service detail pages</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-ochre-600 font-bold">4.</span>
                      <span>Ensure all photos have Elder approval before making public</span>
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Current Atnarpa Photos */}
              <Card>
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold text-earth-900 mb-4">
                    🏡 Current Atnarpa Homestead Photos (13 photos)
                  </h3>
                  <p className="text-earth-600 mb-4">Photos automatically pulled from "Returning Home to Atnarpa" and "Healing Journey" stories</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-earth-100 rounded-lg flex items-center justify-center text-earth-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
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
                    🗂️ Organise by Tags
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
