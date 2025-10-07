import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import {
  empathyLedgerAPI,
  storyUtils,
  StoryVisibilityLevel,
  StoryControlLevel,
  EmpathyLedgerStory,
} from "../config/supabase";

interface StorytellerDashboard {
  empathy_ledger_id: string;
  name: string;
  community?: string;
  total_stories: number;
  active_stories: number;
  views_this_month: number;
}

const StorytellerDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const [stories, setStories] = useState<EmpathyLedgerStory[]>([]);
  const [dashboard, setDashboard] = useState<StorytellerDashboard | null>(null);
  const [loadingStories, setLoadingStories] = useState(true);
  const [selectedStory, setSelectedStory] = useState<EmpathyLedgerStory | null>(
    null,
  );
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.empathy_ledger_id) {
      loadStorytellerData();
    }
  }, [isAuthenticated, user]);

  const loadStorytellerData = async () => {
    if (!user?.empathy_ledger_id) return;

    setLoadingStories(true);
    try {
      // Load storyteller's stories
      const storiesResponse = await empathyLedgerAPI.getStoriesByStoryteller(
        user.empathy_ledger_id,
      );
      setStories(storiesResponse.stories || []);

      // Calculate dashboard stats
      const activeStories =
        storiesResponse.stories?.filter(
          (s: EmpathyLedgerStory) => s.is_active,
        ) || [];
      const totalViews =
        storiesResponse.stories?.reduce(
          (sum: number, s: EmpathyLedgerStory) => sum + s.view_count,
          0,
        ) || 0;

      setDashboard({
        empathy_ledger_id: user.empathy_ledger_id,
        name: user.name || "Storyteller",
        community: user.community,
        total_stories: storiesResponse.stories?.length || 0,
        active_stories: activeStories.length,
        views_this_month: totalViews,
      });
    } catch (error) {
      console.error("Error loading storyteller data:", error);
      setStories([]);
      setDashboard(null);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleToggleStoryVisibility = async (
    storyId: string,
    currentState: boolean,
  ) => {
    if (!token) return;

    try {
      await empathyLedgerAPI.toggleStoryVisibility(
        storyId,
        !currentState,
        token,
      );

      // Update local state
      setStories((prev) =>
        prev.map((story) =>
          story.id === storyId ? { ...story, is_active: !currentState } : story,
        ),
      );

      // Update dashboard stats
      if (dashboard) {
        const newActiveCount = currentState
          ? dashboard.active_stories - 1
          : dashboard.active_stories + 1;

        setDashboard({
          ...dashboard,
          active_stories: newActiveCount,
        });
      }
    } catch (error) {
      console.error("Error toggling story visibility:", error);
      alert("Failed to update story visibility. Please try again.");
    }
  };

  const handleUpdatePermissions = async (permissions: any) => {
    if (!selectedStory || !token) return;

    try {
      await empathyLedgerAPI.updateStoryPermissions(
        selectedStory.id,
        permissions,
        token,
      );

      // Refresh stories
      await loadStorytellerData();
      setShowPermissionsModal(false);
      setSelectedStory(null);
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update story permissions. Please try again.");
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-50 to-eucalyptus-50">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-earth-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has storyteller role and empathy ledger ID
  if (!user?.empathy_ledger_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold text-earth-900 mb-4">
              Empathy Ledger Registration Required
            </h1>
            <p className="text-earth-700 mb-6">
              To access the Storyteller Dashboard, you need to be registered
              with our Empathy Ledger system.
            </p>
            <p className="text-earth-600 mb-8">
              The Empathy Ledger gives you complete control over your stories -
              you can turn them on or off anytime, set who can see them, and
              manage cultural sensitivity levels.
            </p>
            <div className="space-x-4">
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/contact")}
              >
                Request Registration
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      {/* Header */}
      <div className="bg-earth-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🎭</div>
              <div>
                <h1 className="text-2xl font-bold">Empathy Ledger Dashboard</h1>
                <p className="text-ochre-200">Your stories, your control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/")}
                className="text-ochre-200 hover:text-white"
              >
                ← Back to Stories
              </Button>
              <div className="text-right">
                <div className="font-semibold">{dashboard?.name}</div>
                <div className="text-sm text-earth-300">
                  {dashboard?.community && `${dashboard.community} Community`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-ochre-50 to-ochre-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-ochre-700">
                  {dashboard?.total_stories || 0}
                </div>
                <div className="text-ochre-600 font-medium">Total Stories</div>
              </div>
              <div className="text-4xl text-ochre-400">📖</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-eucalyptus-700">
                  {dashboard?.active_stories || 0}
                </div>
                <div className="text-eucalyptus-600 font-medium">
                  Active & Visible
                </div>
              </div>
              <div className="text-4xl text-eucalyptus-400">👁️</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-earth-50 to-earth-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-earth-700">
                  {dashboard?.views_this_month || 0}
                </div>
                <div className="text-earth-600 font-medium">Total Views</div>
              </div>
              <div className="text-4xl text-earth-400">📊</div>
            </div>
          </Card>
        </div>

        {/* Empathy Ledger Explanation */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-sand-50 to-eucalyptus-50">
          <h2 className="text-2xl font-bold text-earth-900 mb-4">
            🎭 Your Empathy Ledger Control Center
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-earth-700 mb-4">
                The Empathy Ledger puts you in complete control of how your
                stories are shared. You can turn stories on or off anytime,
                control who sees them, and set cultural sensitivity levels.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-earth-600">
                    Toggle stories on/off instantly
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span className="text-sm text-earth-600">
                    Set visibility levels (Private, Community, Public)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="text-sm text-earth-600">
                    Manage cultural sensitivity settings
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-6xl mb-2">🛡️</div>
              <p className="text-earth-600 font-medium">
                Your stories, your rules
              </p>
            </div>
          </div>
        </Card>

        {/* Stories Management */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-900">
              📚 Your Stories
            </h2>
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/stories/new")}
            >
              + Share New Story
            </Button>
          </div>

          {loadingStories ? (
            <div className="text-center py-8">
              <Loading />
              <p className="mt-4 text-earth-600">Loading your stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✍️</div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">
                No Stories Yet
              </h3>
              <p className="text-earth-600 mb-6">
                Share your first story and start building your collection.
                You'll have complete control over how it's shared.
              </p>
              <Button
                variant="primary"
                onClick={() => (window.location.href = "/stories/new")}
              >
                Share Your First Story
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className={`p-4 border rounded-lg transition-all ${
                    story.is_active
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-earth-900">
                          {story.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {/* Visibility Status */}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              story.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {story.is_active ? "👁️ Visible" : "🔒 Hidden"}
                          </span>

                          {/* Visibility Level */}
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {storyUtils.getVisibilityDisplayName(
                              story.permissions?.visibility_level ||
                                StoryVisibilityLevel.PRIVATE,
                            )}
                          </span>

                          {/* Cultural Sensitivity */}
                          {story.permissions?.cultural_sensitivity_level && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                story.permissions.cultural_sensitivity_level ===
                                "high"
                                  ? "bg-red-100 text-red-800"
                                  : story.permissions
                                        .cultural_sensitivity_level === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {
                                storyUtils.getSensitivityInfo(
                                  story.permissions.cultural_sensitivity_level,
                                ).name
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-earth-600 text-sm mb-3">
                        {story.excerpt ||
                          story.content?.substring(0, 150) + "..."}
                      </p>

                      <div className="flex items-center text-xs text-earth-500 space-x-4">
                        <span>👀 {story.view_count} views</span>
                        <span>
                          📅 {new Date(story.created_at).toLocaleDateString()}
                        </span>
                        {story.category && <span>🏷️ {story.category}</span>}
                      </div>
                    </div>

                    {/* Story Controls */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Visibility Toggle */}
                      <button
                        onClick={() =>
                          handleToggleStoryVisibility(story.id, story.is_active)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:ring-offset-2 ${
                          story.is_active ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            story.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Settings Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStory(story);
                          setShowPermissionsModal(true);
                        }}
                        className="text-earth-600 hover:text-earth-800"
                      >
                        ⚙️ Settings
                      </Button>

                      {/* View Story Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/stories/${story.id}`)
                        }
                        className="text-ochre-600 hover:text-ochre-800"
                      >
                        View →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Permissions Modal */}
      {showPermissionsModal && selectedStory && (
        <StoryPermissionsModal
          story={selectedStory}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedStory(null);
          }}
          onUpdate={handleUpdatePermissions}
        />
      )}
    </div>
  );
};

// Story Permissions Modal Component
interface StoryPermissionsModalProps {
  story: EmpathyLedgerStory;
  onClose: () => void;
  onUpdate: (permissions: any) => void;
}

const StoryPermissionsModal: React.FC<StoryPermissionsModalProps> = ({
  story,
  onClose,
  onUpdate,
}) => {
  const [visibilityLevel, setVisibilityLevel] = useState(
    story.permissions?.visibility_level || StoryVisibilityLevel.PRIVATE,
  );
  const [controlLevel, setControlLevel] = useState(
    story.permissions?.control_level || StoryControlLevel.FULL_CONTROL,
  );
  const [culturalSensitivity, setCulturalSensitivity] = useState(
    story.permissions?.cultural_sensitivity_level || "medium",
  );

  const handleSave = () => {
    onUpdate({
      visibility_level: visibilityLevel,
      control_level: controlLevel,
      cultural_sensitivity_level: culturalSensitivity,
      can_edit: controlLevel !== StoryControlLevel.LOCKED,
      can_delete: controlLevel === StoryControlLevel.FULL_CONTROL,
      can_share: visibilityLevel !== StoryVisibilityLevel.PRIVATE,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-900">
              ⚙️ Story Settings
            </h2>
            <button
              onClick={onClose}
              className="text-earth-400 hover:text-earth-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Story Title */}
            <div className="p-4 bg-earth-50 rounded-lg">
              <h3 className="font-semibold text-earth-900 mb-1">
                {story.title}
              </h3>
              <p className="text-earth-600 text-sm">
                {story.excerpt || story.content?.substring(0, 100) + "..."}
              </p>
            </div>

            {/* Visibility Level */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">
                👀 Who can see this story?
              </label>
              <div className="space-y-2">
                {Object.values(StoryVisibilityLevel).map((level) => (
                  <label key={level} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="visibility"
                      value={level}
                      checked={visibilityLevel === level}
                      onChange={(e) =>
                        setVisibilityLevel(
                          e.target.value as StoryVisibilityLevel,
                        )
                      }
                      className="text-ochre-600 focus:ring-ochre-500"
                    />
                    <div>
                      <div className="font-medium text-earth-900">
                        {storyUtils.getVisibilityDisplayName(level)}
                      </div>
                      <div className="text-sm text-earth-600">
                        {level === StoryVisibilityLevel.PRIVATE &&
                          "Only you can see this story"}
                        {level === StoryVisibilityLevel.COMMUNITY &&
                          "Members of your community can see this"}
                        {level === StoryVisibilityLevel.ORGANIZATION &&
                          "Oonchiumpa staff and coordinators can see this"}
                        {level === StoryVisibilityLevel.PUBLIC &&
                          "Everyone can see this story"}
                        {level === StoryVisibilityLevel.ARCHIVED &&
                          "Hidden from all views"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Control Level */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">
                🎛️ Who can edit this story?
              </label>
              <div className="space-y-2">
                {Object.values(StoryControlLevel).map((level) => (
                  <label key={level} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="control"
                      value={level}
                      checked={controlLevel === level}
                      onChange={(e) =>
                        setControlLevel(e.target.value as StoryControlLevel)
                      }
                      className="text-ochre-600 focus:ring-ochre-500"
                    />
                    <div>
                      <div className="font-medium text-earth-900">
                        {storyUtils.getControlDisplayName(level)}
                      </div>
                      <div className="text-sm text-earth-600">
                        {level === StoryControlLevel.FULL_CONTROL &&
                          "You have complete control over edits and sharing"}
                        {level === StoryControlLevel.COLLABORATIVE &&
                          "You and trusted staff can make edits"}
                        {level === StoryControlLevel.ORGANIZATION &&
                          "Organization manages edits with your input"}
                        {level === StoryControlLevel.LOCKED &&
                          "Story is locked - no changes allowed"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cultural Sensitivity */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-3">
                🛡️ Cultural sensitivity level
              </label>
              <div className="space-y-2">
                {(["low", "medium", "high"] as const).map((level) => {
                  const info = storyUtils.getSensitivityInfo(level);
                  return (
                    <label key={level} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="sensitivity"
                        value={level}
                        checked={culturalSensitivity === level}
                        onChange={(e) =>
                          setCulturalSensitivity(
                            e.target.value as "low" | "medium" | "high",
                          )
                        }
                        className="text-ochre-600 focus:ring-ochre-500"
                      />
                      <div>
                        <div className="font-medium text-earth-900">
                          {info.name}
                        </div>
                        <div className="text-sm text-earth-600">
                          {info.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-earth-200">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorytellerDashboardPage;
