import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

interface Story {
  id: string;
  title: string;
  is_active?: boolean;
  is_public: boolean;
  privacy_level: string;
  storyteller_id: string;
  visibility_level?: "private" | "community" | "organization" | "public";
  cultural_sensitivity?: "low" | "medium" | "high" | "sacred";
}

interface EmpathyLedgerControlsProps {
  story: Story;
  isOwner: boolean;
}

export const EmpathyLedgerControls: React.FC<EmpathyLedgerControlsProps> = ({
  story,
  isOwner,
}) => {
  // Map existing fields to Empathy Ledger concepts
  const [isActive, setIsActive] = useState(
    story.is_active ?? story.is_public ?? true,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [visibilityLevel, setVisibilityLevel] = useState(
    story.visibility_level ?? mapPrivacyToVisibility(story.privacy_level),
  );

  function mapPrivacyToVisibility(
    privacy: string,
  ): "private" | "community" | "organization" | "public" {
    const map: Record<
      string,
      "private" | "community" | "organization" | "public"
    > = {
      Public: "public",
      Community: "community",
      Private: "private",
      Organization: "organization",
    };
    return map[privacy] || "community";
  }

  useEffect(() => {
    if (!isOwner) return;

    const channel = supabase
      .channel("story-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stories",
          filter: `id=eq.${story.id}`,
        },
        (payload) => {
          setIsActive(payload.new.is_active);
          setVisibilityLevel(payload.new.visibility_level);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [story.id, isOwner]);

  const toggleStoryVisibility = async (newState: boolean) => {
    if (!isOwner) return;

    setIsLoading(true);

    try {
      // Update both new and existing fields for compatibility
      const { error } = await supabase
        .from("stories")
        .update({
          is_public: newState,
          // is_active: newState // Will add this field later
        })
        .eq("id", story.id);

      if (error) throw error;

      setIsActive(newState);
    } catch (error) {
      console.error("Error toggling story visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisibilityLevel = async (newLevel: string) => {
    if (!isOwner) return;

    setIsLoading(true);

    try {
      // Map back to existing privacy_level field
      const privacyMap: Record<string, string> = {
        public: "Public",
        community: "Community",
        private: "Private",
        organization: "Organization",
      };

      const { error } = await supabase
        .from("stories")
        .update({
          privacy_level: privacyMap[newLevel] || "Community",
          // visibility_level: newLevel // Will add this field later
        })
        .eq("id", story.id);

      if (error) throw error;

      setVisibilityLevel(newLevel as any);
    } catch (error) {
      console.error("Error updating visibility level:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Story Status</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
            />
            <span className="text-sm font-medium">
              {isActive ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">Visibility:</span>
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {visibilityLevel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-amber-900 flex items-center gap-2">
          🎭 Empathy Ledger Controls
        </h4>
        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
          Storyteller Control
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-amber-900">
            Story Visibility
          </span>
          <button
            onClick={() => toggleStoryVisibility(!isActive)}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-green-500" : "bg-gray-300"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="font-medium">
            {isActive
              ? "👁️ Story is visible to community"
              : "🔒 Story is hidden from view"}
          </span>
        </div>

        <div className="border-t border-amber-200 pt-3">
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Visibility Level
          </label>
          <select
            value={visibilityLevel}
            onChange={(e) => updateVisibilityLevel(e.target.value)}
            disabled={isLoading}
            className="w-full text-sm border border-amber-200 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="private">🔒 Private (only me)</option>
            <option value="community">🏘️ Community (trusted members)</option>
            <option value="organization">
              🏢 Organization (Oonchiumpa team)
            </option>
            <option value="public">🌍 Public (everyone)</option>
          </select>
        </div>

        {story.cultural_sensitivity === "high" ||
        story.cultural_sensitivity === "sacred" ? (
          <div className="bg-red-50 border border-red-200 p-3 rounded">
            <div className="flex items-center gap-2 text-red-800">
              <span>⚠️</span>
              <span className="text-xs font-medium">
                Cultural Protocol: {story.cultural_sensitivity} sensitivity
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
