import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";
import {
  type Story,
  type Outcome,
  type Media,
  type DashboardData,
  type DashboardMetric,
} from "./api";

const PROJECT_ID = SUPABASE_PROJECT_ID || "";

// Helper function to get Oonchiumpa storyteller IDs
const getOonchiumpaStorytellerIds = async (): Promise<string[]> => {
  let query = supabase.from("storytellers").select("id");
  if (PROJECT_ID) {
    query = query.eq("project_id", PROJECT_ID);
  }

  const { data: storytellers } = await query;

  return storytellers?.map((st) => st.id) || [];
};

// Transform Supabase story data to API Story interface
const transformStoryData = (story: any, storyteller?: any): Story => ({
  id: story.id,
  title: story.title || "Untitled Story",
  content: story.content || "",
  author:
    storyteller?.full_name ||
    story.storytellers?.full_name ||
    "Unknown Storyteller",
  date: story.created_at,
  category: story.story_category || "general",
  tags: story.tags || [],
  culturalSignificance: story.privacy_level || "Community",
  imageUrl: story.featured_image_url || story.image_url || undefined,
});

// Stories API using Supabase
export const supabaseStoriesAPI = {
  getAll: async (): Promise<Story[]> => {
    // Query by tenant_id for Oonchiumpa stories
    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

    const { data: stories, error } = await supabase
      .from("stories")
      .select(
        `
        id, title, summary, content, created_at, story_type, themes, cultural_themes,
        privacy_level, media_metadata, story_image_url, media_urls,
        profiles:author_id(full_name)
      `,
      )
      .eq("tenant_id", OONCHIUMPA_TENANT_ID)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      return [];
    }

    return (stories || []).map((story) => ({
      id: story.id,
      title: story.title || "Untitled Story",
      summary: story.summary,
      content: story.content || "",
      author: story.profiles?.full_name || "Oonchiumpa",
      date: story.created_at,
      category: story.story_type || "general",
      story_type: story.story_type,
      themes: story.themes,
      cultural_themes: story.cultural_themes,
      tags: story.themes || [],
      culturalSignificance: story.privacy_level || "public",
      media_metadata: story.media_metadata,
      imageUrl: story.story_image_url,
      media_urls: story.media_urls,
    }));
  },

  getById: async (id: string): Promise<Story> => {
    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

    const { data: story, error } = await supabase
      .from("stories")
      .select(
        `
        id, title, summary, content, created_at, story_type, themes, cultural_themes,
        privacy_level, media_metadata, story_image_url, media_urls,
        profiles:author_id(full_name)
      `,
      )
      .eq("id", id)
      .eq("tenant_id", OONCHIUMPA_TENANT_ID)
      .single();

    if (error || !story) {
      console.error('Error fetching story:', error);
      throw new Error("Story not found");
    }

    return {
      id: story.id,
      title: story.title || "Untitled Story",
      summary: story.summary,
      content: story.content || "",
      author: story.profiles?.full_name || "Oonchiumpa",
      date: story.created_at,
      category: story.story_type || "general",
      story_type: story.story_type,
      themes: story.themes,
      cultural_themes: story.cultural_themes,
      tags: story.themes || [],
      culturalSignificance: story.privacy_level || "public",
      media_metadata: story.media_metadata,
      imageUrl: story.story_image_url,
      media_urls: story.media_urls,
    };
  },

  getByCategory: async (category: string): Promise<Story[]> => {
    const storytellerIds = await getOonchiumpaStorytellerIds();
    if (storytellerIds.length === 0) return [];

    let query = supabase
      .from("stories")
      .select(
        `
        id, title, content, created_at, story_category, tags, privacy_level,
        storytellers(full_name)
      `,
      )
      .in("storyteller_id", storytellerIds)
      .eq("story_category", category)
      .order("created_at", { ascending: false });

    if (PROJECT_ID) {
      query = query.eq("project_id", PROJECT_ID);
    }

    const { data: stories } = await query;

    return (stories || []).map((story) => transformStoryData(story));
  },

  search: async (query: string): Promise<Story[]> => {
    const storytellerIds = await getOonchiumpaStorytellerIds();
    if (storytellerIds.length === 0) return [];

    let searchQuery = supabase
      .from("stories")
      .select(
        `
        id, title, content, created_at, story_category, tags, privacy_level,
        storytellers(full_name)
      `,
      )
      .in("storyteller_id", storytellerIds)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (PROJECT_ID) {
      searchQuery = searchQuery.eq("project_id", PROJECT_ID);
    }

    const { data: stories } = await searchQuery;

    return (stories || []).map((story) => transformStoryData(story));
  },
};

// Outcomes API - for now return empty arrays as we don't have outcome data in Supabase yet
export const supabaseOutcomesAPI = {
  getAll: async (): Promise<Outcome[]> => {
    // TODO: Implement when outcome data structure is defined in Supabase
    return [];
  },

  getById: async (id: string): Promise<Outcome> => {
    // TODO: Implement when outcome data structure is defined in Supabase
    throw new Error(
      "Outcome not found - outcomes not yet implemented in Supabase",
    );
  },

  getByCategory: async (category: string): Promise<Outcome[]> => {
    // TODO: Implement when outcome data structure is defined in Supabase
    return [];
  },
};

// Media API - return empty arrays as we don't have media data in Supabase yet
export const supabaseMediaAPI = {
  getGallery: async (): Promise<Media[]> => {
    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

    const { data: photos, error } = await supabase
      .from('gallery_media')
      .select('*')
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .eq('media_type', 'photo')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery photos:', error);
      return [];
    }

    return (photos || []).map(photo => ({
      id: photo.id,
      type: 'image' as const,
      url: photo.url,
      title: photo.title,
      description: photo.description,
      date: photo.created_at
    }));
  },

  getVideos: async (): Promise<Media[]> => {
    const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

    const { data: videos, error } = await supabase
      .from('gallery_media')
      .select('*')
      .eq('tenant_id', OONCHIUMPA_TENANT_ID)
      .eq('media_type', 'video')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return (videos || []).map(video => ({
      id: video.id,
      type: 'video' as const,
      url: video.url,
      title: video.title,
      description: video.description,
      date: video.created_at
    }));
  },

  getByTags: async (tags: string[]): Promise<Media[]> => {
    // TODO: Implement tag-based filtering when tags are added to gallery_media
    return [];
  },
};

// Dashboard API using real Supabase data
export const supabaseDashboardAPI = {
  getMetrics: async (): Promise<DashboardData> => {
    const storytellerIds = await getOonchiumpaStorytellerIds();

    // Get story counts
    let totalStoriesQuery = supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .in("storyteller_id", storytellerIds);

    if (PROJECT_ID) {
      totalStoriesQuery = totalStoriesQuery.eq("project_id", PROJECT_ID);
    }

    const { count: totalStories } = await totalStoriesQuery;

    let publishedStoriesQuery = supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .in("storyteller_id", storytellerIds)
      .eq("is_public", true);

    if (PROJECT_ID) {
      publishedStoriesQuery = publishedStoriesQuery.eq("project_id", PROJECT_ID);
    }

    const { count: publishedStories } = await publishedStoriesQuery;

    let storytellerCountQuery = supabase
      .from("storytellers")
      .select("*", { count: "exact", head: true });

    if (PROJECT_ID) {
      storytellerCountQuery = storytellerCountQuery.eq("project_id", PROJECT_ID);
    }

    const { count: storytellerCount } = await storytellerCountQuery;

    // Weekly activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    let weeklyStoriesQuery = supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .in("storyteller_id", storytellerIds)
      .gte("created_at", weekAgo.toISOString());

    if (PROJECT_ID) {
      weeklyStoriesQuery = weeklyStoriesQuery.eq("project_id", PROJECT_ID);
    }

    const { count: weeklyStories } = await weeklyStoriesQuery;

    return {
      keyMetrics: [
        {
          id: "1",
          title: "Storytellers",
          value: storytellerCount || 0,
          description: "Oonchiumpa storytellers",
          category: "storytellers",
        },
        {
          id: "2",
          title: "Total Stories",
          value: totalStories || 0,
          description: "Stories created by Oonchiumpa storytellers",
          category: "content",
        },
        {
          id: "3",
          title: "Published Stories",
          value: publishedStories || 0,
          description: "Public stories available to community",
          category: "content",
        },
        {
          id: "4",
          title: "Weekly Activity",
          value: weeklyStories || 0,
          description: "Stories created this week",
          category: "activity",
        },
      ],
      recentOutcomes: [
        {
          title: "Empathy Ledger Platform",
          impact: "Active",
          description: "Storyteller control system operational",
          status: "active" as const,
          horizon: 1,
        },
        {
          title: "Cultural Story Collection",
          impact: `${totalStories || 0} Stories`,
          description: "Community narratives being preserved",
          status: "active" as const,
          horizon: 1,
        },
        {
          title: "Digital Storytelling Platform",
          impact: "Launch Complete",
          description: "Platform enabling community voice",
          status: "active" as const,
          horizon: 1,
        },
      ],
      summary: {
        totalClients: storytellerCount || 0,
        totalContacts: totalStories || 0,
        costEffectiveness: publishedStories
          ? (publishedStories / (totalStories || 1)) * 100
          : 0,
        engagementRate: totalStories
          ? ((weeklyStories || 0) / (totalStories || 1)) * 100
          : 0,
      },
    };
  },

  getMetricsByCategory: async (
    category: string,
  ): Promise<DashboardMetric[]> => {
    const data = await supabaseDashboardAPI.getMetrics();
    return data.keyMetrics.filter((m) => m.category === category);
  },

  getSummary: async () => {
    const data = await supabaseDashboardAPI.getMetrics();
    return data.summary;
  },
};
