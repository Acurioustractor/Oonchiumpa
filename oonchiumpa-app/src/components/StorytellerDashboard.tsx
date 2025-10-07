import React, { useState, useEffect } from "react";
import { EmpathyLedgerControls } from "./EmpathyLedgerControls";
import { supabase } from "../config/supabase";

interface Story {
  id: string;
  title: string;
  content: string;
  is_active?: boolean;
  is_public: boolean;
  privacy_level: string;
  storyteller_id: string;
  visibility_level?: "private" | "community" | "organization" | "public";
  cultural_sensitivity?: "low" | "medium" | "high" | "sacred";
  created_at: string;
  updated_at: string;
}

interface Storyteller {
  id: string;
  name: string;
  email?: string;
}

interface StorytellerDashboardProps {
  storyteller: Storyteller;
}

export const StorytellerDashboard: React.FC<StorytellerDashboardProps> = ({
  storyteller,
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "visible" | "hidden"
  >("all");

  useEffect(() => {
    fetchStories();
    setupRealTimeSubscription();
  }, [storyteller.id]);

  const fetchStories = async () => {
    try {
      console.log("🔍 Fetching stories for storyteller:", storyteller.id);

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("storyteller_id", storyteller.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log("📚 Stories fetched:", data?.length || 0);
      if (data && data.length > 0) {
        console.log(
          "   Stories:",
          data.map((s) => s.title),
        );
      }

      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel("storyteller-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stories",
          filter: `storyteller_id=eq.${storyteller.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setStories((current) =>
              current.map((story) =>
                story.id === payload.new.id
                  ? { ...story, ...payload.new }
                  : story,
              ),
            );
          } else if (payload.eventType === "INSERT") {
            setStories((current) => [payload.new as Story, ...current]);
          } else if (payload.eventType === "DELETE") {
            setStories((current) =>
              current.filter((story) => story.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredStories = stories.filter((story) => {
    const isActive = story.is_active ?? story.is_public ?? true;
    if (activeFilter === "visible") return isActive;
    if (activeFilter === "hidden") return !isActive;
    return true;
  });

  const stats = {
    total: stories.length,
    visible: stories.filter((s) => s.is_active ?? s.is_public ?? true).length,
    hidden: stories.filter((s) => !(s.is_active ?? s.is_public ?? true)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-2 text-amber-600">Loading your stories...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎭 My Story Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {storyteller.name}. You have full control over your
          stories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                Total Stories
              </h3>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="text-blue-400">📚</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Visible Stories
              </h3>
              <p className="text-3xl font-bold text-green-700">
                {stats.visible}
              </p>
            </div>
            <div className="text-green-400">👁️</div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Hidden Stories
              </h3>
              <p className="text-3xl font-bold text-gray-700">{stats.hidden}</p>
            </div>
            <div className="text-gray-400">🔒</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Stories</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeFilter === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter("visible")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeFilter === "visible"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Visible ({stats.visible})
            </button>
            <button
              onClick={() => setActiveFilter("hidden")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeFilter === "hidden"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hidden ({stats.hidden})
            </button>
          </div>
        </div>

        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeFilter === "all"
                ? "No stories yet"
                : `No ${activeFilter} stories`}
            </h3>
            <p className="text-gray-500">
              {activeFilter === "all"
                ? "Start sharing your story with the community"
                : `You don't have any ${activeFilter} stories at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {story.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {story.content.length > 200
                            ? `${story.content.substring(0, 200)}...`
                            : story.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Created:{" "}
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Updated:{" "}
                        {new Date(story.updated_at).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        Cultural Sensitivity: {story.cultural_sensitivity}
                      </span>
                    </div>
                  </div>

                  <div className="w-80">
                    <EmpathyLedgerControls story={story} isOwner={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
