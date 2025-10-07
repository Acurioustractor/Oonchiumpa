import React, { useState } from "react";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { Section } from "../components/Section";
import ContentSeeder from "../components/ContentSeeder";
import { StoryEditor } from "../components/StoryEditor";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";
import UserManagement from "../components/UserManagement";
import { useAuth } from "../contexts/AuthContext";

export const ContentDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "overview" | "stories" | "media" | "seeder" | "users"
  >("overview");
  const { user, isAdmin, hasPermission } = useAuth();

  // Demo mode - create mock user when no auth
  const isDemoMode = !user;
  const demoUser = {
    full_name: "Demo Admin (Kristy Bloomfield)",
    role: "admin" as const,
  };
  const displayUser = user || demoUser;
  const displayIsAdmin = isDemoMode ? true : isAdmin();
  const displayHasPermission = (permission: string) =>
    isDemoMode ? true : hasPermission(permission);

  const sections = [
    { id: "overview", label: "Overview", icon: "📊", permission: null },
    {
      id: "stories",
      label: "Story Editor",
      icon: "📖",
      permission: "create_content",
    },
    {
      id: "media",
      label: "Media Manager",
      icon: "📸",
      permission: "manage_media",
    },
    {
      id: "seeder",
      label: "Content Seeder",
      icon: "🌱",
      permission: "create_content",
    },
    { id: "users", label: "User Management", icon: "👥", permission: "admin" },
  ];

  const availableSections = sections.filter(
    (section) =>
      !section.permission ||
      (section.permission === "admin"
        ? displayIsAdmin
        : displayHasPermission(section.permission)),
  );

  return (
    <>
      {/* Header */}
      <Section className="bg-gradient-to-br from-ochre-50 via-eucalyptus-50 to-earth-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6">
            📋 Content Management Dashboard
          </h1>
          <p className="text-lg md:text-xl text-earth-700 mb-8">
            Centralized hub for creating, managing, and organizing all
            Oonchiumpa platform content
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-earth-600">
            <span>👋 Welcome, {displayUser?.full_name}</span>
            <span>•</span>
            <span className="capitalize">{displayUser?.role} Access</span>
            {isDemoMode && (
              <span className="bg-ochre-100 text-ochre-800 px-2 py-1 rounded-full text-xs">
                Demo Mode
              </span>
            )}
            <span>•</span>
            <span>{availableSections.length} Tools Available</span>
          </div>
        </div>
      </Section>

      {/* Navigation */}
      <Section className="py-6 bg-white border-b">
        <div className="flex flex-wrap justify-center gap-2">
          {availableSections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "primary" : "secondary"}
              onClick={() => setActiveSection(section.id as any)}
              className="flex items-center space-x-2"
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </Button>
          ))}
        </div>
      </Section>

      {/* Content Area */}
      <Section className="py-8">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6 bg-gradient-to-br from-ochre-50 to-ochre-100">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="font-semibold text-earth-900 mb-2">
                  Story Creation
                </h3>
                <p className="text-earth-700 text-sm mb-4">
                  Create and edit community stories with cultural oversight
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveSection("stories")}
                >
                  Open Story Editor
                </Button>
              </Card>

              <Card className="text-center p-6 bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
                <div className="text-4xl mb-3">📸</div>
                <h3 className="font-semibold text-earth-900 mb-2">
                  Media Management
                </h3>
                <p className="text-earth-700 text-sm mb-4">
                  Upload and organize photos, videos, and audio content
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveSection("media")}
                >
                  Open Media Manager
                </Button>
              </Card>

              <Card className="text-center p-6 bg-gradient-to-br from-earth-50 to-earth-100">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-semibold text-earth-900 mb-2">
                  Content Seeding
                </h3>
                <p className="text-earth-700 text-sm mb-4">
                  Populate platform with sample stories and blog posts
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveSection("seeder")}
                >
                  Open Content Seeder
                </Button>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-earth-900 mb-4">
                  ⚡ Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="secondary" className="w-full justify-start">
                    ✏️ Create New Story
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    📝 Write Blog Post
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    📤 Upload Media
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    👀 Review Content
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-ochre-600 mb-2">12</div>
                <div className="text-earth-700 font-medium">
                  Stories Published
                </div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-eucalyptus-600 mb-2">
                  8
                </div>
                <div className="text-earth-700 font-medium">Blog Posts</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-earth-600 mb-2">45</div>
                <div className="text-earth-700 font-medium">Media Files</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-sunset-600 mb-2">3</div>
                <div className="text-earth-700 font-medium">Pending Review</div>
              </Card>
            </div>
          </div>
        )}

        {/* Story Editor Section */}
        {activeSection === "stories" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-earth-900 mb-2">
                📖 Story Creation & Editing
              </h2>
              <p className="text-earth-700">
                Create authentic community stories with proper cultural
                oversight and Elder consultation
              </p>
            </div>
            <StoryEditor
              mode="create"
              onSave={(story) => {
                console.log("Story saved:", story);
                alert("Story saved successfully!");
              }}
            />
          </div>
        )}

        {/* Media Management Section */}
        {activeSection === "media" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-earth-900 mb-2">
                📸 Media Management
              </h2>
              <p className="text-earth-700">
                Upload, organize, and manage photos, videos, and audio content
                for stories and blog posts
              </p>
            </div>

            {/* Upload Section */}
            <MediaUpload
              onUploadComplete={(media) => {
                console.log("Media uploaded:", media);
              }}
              maxFiles={10}
            />

            {/* Gallery Section */}
            <MediaGallery
              layout="grid"
              maxItems={50}
              allowFullscreen={true}
              showMetadata={true}
            />
          </div>
        )}

        {/* Content Seeder Section */}
        {activeSection === "seeder" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-earth-900 mb-2">
                🌱 Platform Content Seeding
              </h2>
              <p className="text-earth-700">
                Bootstrap the platform with authentic sample content that
                represents Oonchiumpa's work and values
              </p>
            </div>
            <ContentSeeder />
          </div>
        )}

        {/* User Management Section */}
        {activeSection === "users" && displayIsAdmin && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-earth-900 mb-2">
                👥 User Management
              </h2>
              <p className="text-earth-700">
                Manage team member access, roles, and permissions across the
                platform
              </p>
            </div>
            <UserManagement />
          </div>
        )}
      </Section>

      {/* Footer Notice */}
      <Section className="bg-earth-800 text-white py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3 text-white">
            🛡️ Cultural Protocols
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium">Community Leadership</div>
              <div className="text-earth-300 text-sm">
                All content creation guided by Traditional Owners
              </div>
            </div>
            <div>
              <div className="text-2xl mb-2">✅</div>
              <div className="font-medium">Elder Approval</div>
              <div className="text-earth-300 text-sm">
                Cultural review required before publication
              </div>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-medium">Privacy Respected</div>
              <div className="text-earth-300 text-sm">
                Community consent obtained for all shared content
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default ContentDashboardPage;
