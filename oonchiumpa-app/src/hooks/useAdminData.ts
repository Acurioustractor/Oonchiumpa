import { useState, useEffect } from "react";
import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";

interface AdminStats {
  totalContent: number;
  weeklyGenerated: number;
  pendingReview: number;
  published: number;
  totalStorytellers: number;
  oonchiumpaStorytellers: number;
}

interface AdminStory {
  id: string;
  title: string;
  storyteller_name: string;
  status: "published" | "private" | "draft";
  category: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  privacy_level: string;
  cultural_sensitivity: "low" | "medium" | "high" | "sacred";
}

interface AdminActivity {
  id: string;
  type: "published" | "review_needed" | "ai_generated";
  title: string;
  description: string;
  timestamp: string;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalContent: 0,
    weeklyGenerated: 0,
    pendingReview: 0,
    published: 0,
    totalStorytellers: 0,
    oonchiumpaStorytellers: 0,
  });

  const [stories, setStories] = useState<AdminStory[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = SUPABASE_PROJECT_ID || "";

  const fetchStats = async () => {
    try {
      // Get Oonchiumpa storytellers first
      let storytellerQuery = supabase.from("storytellers").select("id");
      if (projectId) {
        storytellerQuery = storytellerQuery.eq("project_id", projectId);
      }

      const { data: oonchiumpaStorytellers } = await storytellerQuery;

      const oonchiumpaStorytellerIds =
        oonchiumpaStorytellers?.map((st) => st.id) || [];

      if (oonchiumpaStorytellerIds.length === 0) {
        console.log("No Oonchiumpa storytellers found");
        return;
      }

      // Get ONLY stories from Oonchiumpa storytellers
      let totalStoriesQuery = supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .in("storyteller_id", oonchiumpaStorytellerIds);

      if (projectId) {
        totalStoriesQuery = totalStoriesQuery.eq("project_id", projectId);
      }

      const { count: totalStories } = await totalStoriesQuery;

      // Get published stories from Oonchiumpa storytellers
      let publishedStoriesQuery = supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .in("storyteller_id", oonchiumpaStorytellerIds)
        .eq("is_public", true);

      if (projectId) {
        publishedStoriesQuery = publishedStoriesQuery.eq(
          "project_id",
          projectId,
        );
      }

      const { count: publishedStories } = await publishedStoriesQuery;

      // Get private stories from Oonchiumpa storytellers
      let privateStoriesQuery = supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .in("storyteller_id", oonchiumpaStorytellerIds)
        .eq("is_public", false);

      if (projectId) {
        privateStoriesQuery = privateStoriesQuery.eq("project_id", projectId);
      }

      const { count: privateStories } = await privateStoriesQuery;

      // Get Oonchiumpa storytellers count
      let storytellerCountQuery = supabase
        .from("storytellers")
        .select("*", { count: "exact", head: true });

      if (projectId) {
        storytellerCountQuery = storytellerCountQuery.eq(
          "project_id",
          projectId,
        );
      }

      const { count: oonchiumpaStorytellerCount } = await storytellerCountQuery;

      // Stories created this week by Oonchiumpa storytellers
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      let weeklyStoriesQuery = supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .in("storyteller_id", oonchiumpaStorytellerIds)
        .gte("created_at", weekAgo.toISOString());

      if (projectId) {
        weeklyStoriesQuery = weeklyStoriesQuery.eq("project_id", projectId);
      }

      const { count: weeklyStories } = await weeklyStoriesQuery;

      setStats({
        totalContent: totalStories || 0,
        published: publishedStories || 0,
        pendingReview: privateStories || 0,
        weeklyGenerated: weeklyStories || 0,
        totalStorytellers: oonchiumpaStorytellerCount || 0,
        oonchiumpaStorytellers: oonchiumpaStorytellerCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchStories = async () => {
    try {
      let storytellerQuery = supabase.from("storytellers").select("id");
      if (projectId) {
        storytellerQuery = storytellerQuery.eq("project_id", projectId);
      }

      const { data: oonchiumpaStorytellers } = await storytellerQuery;
      const oonchiumpaStorytellerIds =
        oonchiumpaStorytellers?.map((st) => st.id) || [];

      if (oonchiumpaStorytellerIds.length === 0) {
        setStories([]);
        return;
      }

      let storiesQuery = supabase
        .from("stories")
        .select(
          `
          id, title, is_public, privacy_level, story_category,
          created_at, updated_at,
          storytellers(full_name)
        `,
        )
        .in("storyteller_id", oonchiumpaStorytellerIds)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (projectId) {
        storiesQuery = storiesQuery.eq("project_id", projectId);
      }

      const { data: storiesData } = await storiesQuery;

      const formattedStories: AdminStory[] = (storiesData || []).map(
        (story) => ({
          id: story.id,
          title: story.title || "Untitled Story",
          storyteller_name:
            story.storytellers?.full_name || "Unknown Storyteller",
          status: story.is_public ? "published" : "private",
          category: story.story_category || "general",
          created_at: story.created_at,
          updated_at: story.updated_at,
          is_public: story.is_public,
          privacy_level: story.privacy_level || "Community",
          cultural_sensitivity: getCulturalSensitivity(story.privacy_level),
        }),
      );

      setStories(formattedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      let storytellerQuery = supabase.from("storytellers").select("id");
      if (projectId) {
        storytellerQuery = storytellerQuery.eq("project_id", projectId);
      }

      const { data: oonchiumpaStorytellers } = await storytellerQuery;
      const oonchiumpaStorytellerIds =
        oonchiumpaStorytellers?.map((st) => st.id) || [];

      if (oonchiumpaStorytellerIds.length === 0) {
        setActivities([]);
        return;
      }

      let recentStoriesQuery = supabase
        .from("stories")
        .select(
          `
          id, title, is_public, updated_at,
          storytellers(full_name)
        `,
        )
        .in("storyteller_id", oonchiumpaStorytellerIds)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (projectId) {
        recentStoriesQuery = recentStoriesQuery.eq("project_id", projectId);
      }

      const { data: recentStories } = await recentStoriesQuery;

      const formattedActivities: AdminActivity[] = (recentStories || [])
        .slice(0, 5)
        .map((story) => ({
          id: story.id,
          type: story.is_public ? "published" : "review_needed",
          title: story.is_public ? "Content Published" : "Review Required",
          description: `"${story.title}" by ${story.storytellers?.full_name || "Unknown"}`,
          timestamp: story.updated_at,
        }));

      setActivities(formattedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getCulturalSensitivity = (
    privacyLevel: string,
  ): "low" | "medium" | "high" | "sacred" => {
    switch (privacyLevel) {
      case "Public":
        return "low";
      case "Community":
        return "medium";
      case "Private":
        return "high";
      case "Organization":
        return "medium";
      default:
        return "medium";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchStories(), fetchActivities()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscriptions for stats updates
    const channel = supabase
      .channel("admin-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stories" },
        () => {
          fetchStats();
          fetchStories();
          fetchActivities();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    stats,
    stories,
    activities,
    loading,
    refresh: () => {
      fetchStats();
      fetchStories();
      fetchActivities();
    },
  };
};
