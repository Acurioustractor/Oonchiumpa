import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import { useAdminData } from "../hooks/useAdminData";
import { useAIStatus } from "../hooks/useAIStatus";
import ContentSeeder from "./ContentSeeder";
import { ServicesManager } from "./ServicesManager";
import { TeamManager } from "./TeamManager";
import { StatsManager } from "./StatsManager";
import { TestimonialsManager } from "./TestimonialsManager";
import { PartnersManager } from "./PartnersManager";
import { MediaLibraryManager } from "./MediaLibraryManager";

interface DashboardStats {
  totalContent: number;
  weeklyGenerated: number;
  pendingReview: number;
  published: number;
  weeklyViews: number;
  engagementRate: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "draft" | "pending" | "published" | "archived";
  createdAt: string;
  author: string;
  views: number;
  engagementScore: number;
  culturalSensitivity: "low" | "medium" | "high";
  aiGenerated: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, stories, activities, loading } = useAdminData();
  const { aiStatus, loading: aiLoading } = useAIStatus();

  const [selectedTab, setSelectedTab] = useState<
    "overview" | "content" | "ai" | "cultural" | "seeder" | "cms"
  >("overview");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkGeneration = async () => {
    setIsProcessing(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${apiBase}/api/content-generator/build-library`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (data.success) {
        console.log("Bulk generation completed:", data);
      }
    } catch (error) {
      console.error("Bulk generation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-eucalyptus-100 text-eucalyptus-800";
      case "pending":
        return "bg-ochre-100 text-ochre-800";
      case "draft":
        return "bg-earth-100 text-earth-800";
      case "archived":
        return "bg-sunset-100 text-sunset-800";
      default:
        return "bg-earth-100 text-earth-800";
    }
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-sunset-100 text-sunset-800";
      case "medium":
        return "bg-ochre-100 text-ochre-800";
      case "low":
        return "bg-eucalyptus-100 text-eucalyptus-800";
      default:
        return "bg-earth-100 text-earth-800";
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "cms", name: "Content CMS", icon: "⚙️" },
    { id: "content", name: "Content Library", icon: "📚" },
    { id: "seeder", name: "Content Seeder", icon: "🌱" },
    { id: "ai", name: "AI System", icon: "🤖" },
    { id: "cultural", name: "Cultural Review", icon: "🛡️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-earth-950 mb-2">
            🏛️ Oonchiumpa Admin Dashboard
          </h1>
          <p className="text-earth-600">
            Manage AI-generated content and cultural protocols
          </p>
        </div>

        <div className="flex space-x-4">
          <Button variant="secondary" size="sm">
            📤 Export Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleBulkGeneration}
            disabled={isProcessing}
          >
            {isProcessing ? <Loading /> : "🚀"} Bulk Generate
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-earth-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? "bg-white text-earth-950 shadow-sm"
                : "text-earth-600 hover:text-earth-950"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 text-center bg-gradient-to-br from-ochre-50 to-ochre-100">
              <div className="text-2xl font-bold text-ochre-800">
                {stats.totalContent}
              </div>
              <div className="text-ochre-600 text-sm">Oonchiumpa Stories</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
              <div className="text-2xl font-bold text-eucalyptus-800">
                {stats.weeklyGenerated}
              </div>
              <div className="text-eucalyptus-600 text-sm">New This Week</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-ochre-50 to-ochre-100">
              <div className="text-2xl font-bold text-ochre-800">
                {stats.pendingReview}
              </div>
              <div className="text-ochre-600 text-sm">Private Stories</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
              <div className="text-2xl font-bold text-eucalyptus-800">
                {stats.published}
              </div>
              <div className="text-eucalyptus-600 text-sm">Published Stories</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
              <div className="text-2xl font-bold text-eucalyptus-800">
                {stats.totalStorytellers}
              </div>
              <div className="text-eucalyptus-600 text-sm">Storytellers</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-earth-50 to-earth-100">
              <div className="text-2xl font-bold text-earth-800">🎭</div>
              <div className="text-earth-700 text-sm">
                Empathy Ledger Active
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="secondary" className="w-full">
                🎤 Process New Interview
              </Button>
              <Button variant="secondary" className="w-full">
                📝 Generate Blog Post
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/media")}
              >
                📸 Manage Media
              </Button>
              <Button variant="secondary" className="w-full">
                👥 Create Team Profile
              </Button>
              <Button variant="secondary" className="w-full">
                🌟 Draft Success Story
              </Button>
            </div>
          </Card>

          {/* Empathy Ledger Management */}
          <Card className="p-6 border-amber-200 bg-amber-50">
            <h3 className="text-lg font-semibold text-earth-950 mb-4 flex items-center gap-2">
              🎭 Empathy Ledger Management
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                Backend Control
              </span>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="secondary"
                  className="w-full border-amber-300 hover:bg-amber-100"
                  onClick={() => window.open("/empathy-ledger", "_blank")}
                >
                  👤 Storyteller Dashboard
                </Button>
                <Button
                  variant="secondary"
                  className="w-full border-amber-300 hover:bg-amber-100"
                >
                  📊 Story Analytics
                </Button>
                <Button
                  variant="secondary"
                  className="w-full border-amber-300 hover:bg-amber-100"
                >
                  🔒 Privacy Controls
                </Button>
              </div>
              <div className="text-sm text-amber-700 bg-amber-100 p-3 rounded-lg">
                <strong>Empathy Ledger</strong> gives storytellers complete
                control over their narrative visibility and privacy settings.
                Manage storyteller permissions, story visibility toggles, and
                cultural sensitivity protocols.
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              📈 Recent Activity
            </h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-earth-100"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "published"
                          ? "bg-eucalyptus-100"
                          : activity.type === "review_needed"
                            ? "bg-ochre-100"
                            : "bg-eucalyptus-100"
                      }`}
                    >
                      {activity.type === "published"
                        ? "✅"
                        : activity.type === "review_needed"
                          ? "⏳"
                          : "🤖"}
                    </div>
                    <div>
                      <div className="font-medium text-earth-950">
                        {activity.title}
                      </div>
                      <div className="text-sm text-earth-600">
                        {activity.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-earth-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-4 text-earth-500">
                  No recent activity
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Content Library Tab */}
      {selectedTab === "content" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              📚 Content Library
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-earth-200">
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Cultural Level
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Views
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-earth-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-earth-100 hover:bg-earth-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-earth-950">
                            {item.title}
                          </div>
                          <div className="text-sm text-earth-500">
                            {item.storyteller_name} •{" "}
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-earth-100 text-earth-800 rounded text-xs capitalize">
                          {item.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs capitalize ${getSensitivityColor(item.cultural_sensitivity)}`}
                        >
                          {item.cultural_sensitivity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-earth-700">-</td>
                      <td className="py-3 px-4 text-earth-700">
                        {item.is_public ? "✅" : "🔒"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-eucalyptus-600 hover:text-eucalyptus-800 text-sm">
                            Edit
                          </button>
                          <button className="text-eucalyptus-600 hover:text-eucalyptus-800 text-sm">
                            Publish
                          </button>
                          <button className="text-sunset-600 hover:text-sunset-800 text-sm">
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* AI System Tab */}
      {selectedTab === "ai" && (
        <div className="space-y-6">
          {/* AI Provider Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              🤖 AI Provider Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(aiStatus.providers).map(([provider, status]) => (
                <div
                  key={provider}
                  className="border border-earth-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-earth-950 capitalize">
                      {provider}
                    </h4>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        status.status === "active"
                          ? "bg-eucalyptus-500"
                          : status.status === "quota_exceeded"
                            ? "bg-ochre-500"
                            : "bg-sunset-500"
                      }`}
                    ></span>
                  </div>
                  <div className="text-sm text-earth-600 mb-1">
                    Status:{" "}
                    <span className="capitalize">
                      {status.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-earth-600">
                    Quota: {status.quota}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              📊 AI Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-eucalyptus-600 mb-2">
                  {aiStatus.totalProcessed}
                </div>
                <div className="text-earth-600">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eucalyptus-600 mb-2">
                  {aiStatus.successRate}%
                </div>
                <div className="text-earth-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-earth-700 mb-2">
                  {aiStatus.culturalReviews}
                </div>
                <div className="text-earth-600">Cultural Reviews</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Content CMS Tab */}
      {selectedTab === "cms" && (
        <CMSTabContent />
      )}

      {/* Content Seeder Tab */}
      {selectedTab === "seeder" && (
        <div className="space-y-6">
          <ContentSeeder />
        </div>
      )}
      {/* Cultural Review Tab */}
      {selectedTab === "cultural" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-earth-950 mb-4">
              🛡️ Cultural Protocol Dashboard
            </h3>
            <div className="bg-ochre-50 border border-ochre-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-ochre-600">⚠️</span>
                <div className="font-medium text-ochre-800">
                  Elder Consultation Required
                </div>
              </div>
              <p className="text-ochre-700 text-sm">
                8 pieces of content are flagged for cultural sensitivity review.
                Please arrange Elder consultation before publishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-earth-950 mb-3">
                  Cultural Sensitivity Guidelines
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-eucalyptus-500 rounded-full"></span>
                    <span>Community voices amplified authentically</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-eucalyptus-500 rounded-full"></span>
                    <span>Cultural protocols respected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-eucalyptus-500 rounded-full"></span>
                    <span>Traditional knowledge protected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-eucalyptus-500 rounded-full"></span>
                    <span>Elder consultation for sacred content</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-earth-950 mb-3">
                  Review Process
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center text-sm">
                      1
                    </div>
                    <span className="text-sm">
                      AI Cultural Sensitivity Scan
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center text-sm">
                      2
                    </div>
                    <span className="text-sm">Community Team Review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center text-sm">
                      3
                    </div>
                    <span className="text-sm">
                      Elder Consultation (if required)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </div>
                    <span className="text-sm">Approval & Publication</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// CMS Tab Content Component
const CMSTabContent: React.FC = () => {
  const [cmsTab, setCmsTab] = useState<'services' | 'team' | 'stats' | 'testimonials' | 'partners' | 'media'>('services');

  const cmsTabs = [
    { id: 'services', name: 'Services', icon: '🎯' },
    { id: 'team', name: 'Team Members', icon: '👥' },
    { id: 'stats', name: 'Impact Stats', icon: '📊' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'partners', name: 'Partners', icon: '🤝' },
    { id: 'media', name: 'Media Library', icon: '📸' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs for CMS */}
      <div className="flex space-x-1 bg-earth-100 rounded-lg p-1">
        {cmsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCmsTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              cmsTab === tab.id
                ? "bg-white text-earth-950 shadow-sm"
                : "text-earth-600 hover:text-earth-950"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* CMS Content */}
      {cmsTab === 'services' && <ServicesManager />}
      {cmsTab === 'team' && <TeamManager />}
      {cmsTab === 'stats' && <StatsManager />}
      {cmsTab === 'testimonials' && <TestimonialsManager />}
      {cmsTab === 'partners' && <PartnersManager />}
      {cmsTab === 'media' && <MediaLibraryManager />}
    </div>
  );
};

export default AdminDashboard;
