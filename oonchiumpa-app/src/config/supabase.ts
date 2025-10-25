import { createClient } from "@supabase/supabase-js";

// Supabase configuration from environment variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 30) + '...'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

// Custom fetch with logging and timeout
const customFetch: typeof fetch = async (input, init) => {
  console.log('🌐 Fetch request:', typeof input === 'string' ? input : input.url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ Fetch timeout after 30s');
    controller.abort();
  }, 30000);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    console.log('✅ Fetch response:', response.status, response.statusText);
    return response;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Create Supabase client for frontend using env-provided values
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
  global: {
    headers: {
      'x-application-name': 'oonchiumpa-app',
      'apikey': supabaseAnonKey,
    },
    fetch: customFetch,  // Use custom fetch with logging
  },
  db: {
    schema: 'public',
  },
});

export const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ||
  process.env.REACT_APP_SUPABASE_PROJECT_ID;

if (!SUPABASE_PROJECT_ID) {
  console.warn(
    "Missing Supabase project ID. Set VITE_SUPABASE_PROJECT_ID in your environment.",
  );
}

// Story visibility levels (match backend)
export enum StoryVisibilityLevel {
  PRIVATE = "private",
  COMMUNITY = "community",
  ORGANIZATION = "organization",
  PUBLIC = "public",
  ARCHIVED = "archived",
}

export enum StoryControlLevel {
  FULL_CONTROL = "full_control",
  COLLABORATIVE = "collaborative",
  ORGANIZATION = "organization",
  LOCKED = "locked",
}

// Types for TypeScript (matching backend)
export interface Storyteller {
  id: string;
  name: string;
  email?: string;
  community?: string;
  cultural_background?: string;
  empathy_ledger_id?: string;
  active: boolean;
  created_at: string;
}

export interface StoryPermission {
  id: string;
  story_id: string;
  storyteller_id: string;
  visibility_level: StoryVisibilityLevel;
  control_level: StoryControlLevel;
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
  cultural_sensitivity_level: "low" | "medium" | "high";
  approval_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmpathyLedgerStory {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  storyteller_id: string;
  storyteller?: Storyteller;
  permissions?: StoryPermission;

  // Empathy Ledger specific
  empathy_ledger_id: string;
  is_active: boolean;
  storyteller_approved: boolean;
  organization_approved: boolean;

  // Metadata
  category: string;
  tags: string[];
  cultural_context?: string;
  location?: string;
  date_occurred?: string;

  // Media
  featured_image_url?: string;
  media_items?: string[];
  audio_url?: string;
  video_url?: string;

  // Analytics
  view_count: number;
  engagement_score: number;
  last_viewed?: string;

  // Status
  status: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Frontend API helpers for Empathy Ledger
export const empathyLedgerAPI = {
  // Get stories with permission filtering (uses backend API)
  async getStories(
    params: {
      limit?: number;
      offset?: number;
      category?: string;
      search?: string;
      storyteller_id?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/empathy-stories?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch stories");
    }
    return response.json();
  },

  // Get single story
  async getStory(id: string) {
    const response = await fetch(`/api/empathy-stories/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch story");
    }
    return response.json();
  },

  // Toggle story visibility (Empathy Ledger control)
  async toggleStoryVisibility(
    storyId: string,
    isActive: boolean,
    authToken?: string,
  ) {
    const response = await fetch(
      `/api/empathy-stories/${storyId}/toggle-visibility`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({ is_active: isActive }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to toggle story visibility");
    }
    return response.json();
  },

  // Create new story with Empathy Ledger permissions
  async createStory(
    storyData: {
      title: string;
      content: string;
      storyteller_id: string;
      empathy_ledger_id: string;
      category?: string;
      tags?: string[];
      cultural_context?: string;
      location?: string;
      visibility_level?: StoryVisibilityLevel;
      control_level?: StoryControlLevel;
      cultural_sensitivity_level?: "low" | "medium" | "high";
    },
    authToken?: string,
  ) {
    const response = await fetch("/api/empathy-stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      throw new Error("Failed to create story");
    }
    return response.json();
  },

  // Update story permissions
  async updateStoryPermissions(
    storyId: string,
    permissions: {
      visibility_level?: StoryVisibilityLevel;
      control_level?: StoryControlLevel;
      can_edit?: boolean;
      can_delete?: boolean;
      can_share?: boolean;
      cultural_sensitivity_level?: "low" | "medium" | "high";
    },
    authToken?: string,
  ) {
    const response = await fetch(
      `/api/empathy-stories/${storyId}/permissions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(permissions),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update story permissions");
    }
    return response.json();
  },

  // Get stories by storyteller (Empathy Ledger ID)
  async getStoriesByStoryteller(empathyLedgerId: string) {
    const response = await fetch(
      `/api/empathy-stories/storyteller/${empathyLedgerId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch storyteller stories");
    }
    return response.json();
  },
};

// Utility functions for story permissions
export const storyUtils = {
  // Check if story is visible to current user context
  canViewStory: (
    story: EmpathyLedgerStory,
    userRole: string,
    userCommunity?: string,
  ) => {
    if (!story.is_active) return false;

    const permission = story.permissions;
    if (!permission) return false;

    switch (permission.visibility_level) {
      case StoryVisibilityLevel.PRIVATE:
        return userRole === "storyteller" || userRole === "admin";
      case StoryVisibilityLevel.COMMUNITY:
        return (
          userCommunity === story.storyteller?.community ||
          userRole === "admin" ||
          userRole === "staff"
        );
      case StoryVisibilityLevel.ORGANIZATION:
        return ["admin", "staff", "coordinator"].includes(userRole);
      case StoryVisibilityLevel.PUBLIC:
        return story.storyteller_approved && story.organization_approved;
      case StoryVisibilityLevel.ARCHIVED:
        return userRole === "admin";
      default:
        return false;
    }
  },

  // Get visibility level display name
  getVisibilityDisplayName: (level: StoryVisibilityLevel) => {
    const names = {
      [StoryVisibilityLevel.PRIVATE]: "Private (Only You)",
      [StoryVisibilityLevel.COMMUNITY]: "Community Members",
      [StoryVisibilityLevel.ORGANIZATION]: "Organization Staff",
      [StoryVisibilityLevel.PUBLIC]: "Public (Everyone)",
      [StoryVisibilityLevel.ARCHIVED]: "Archived",
    };
    return names[level] || level;
  },

  // Get control level display name
  getControlDisplayName: (level: StoryControlLevel) => {
    const names = {
      [StoryControlLevel.FULL_CONTROL]: "Full Control (You Decide)",
      [StoryControlLevel.COLLABORATIVE]: "Collaborative (You + Staff)",
      [StoryControlLevel.ORGANIZATION]: "Organization Managed",
      [StoryControlLevel.LOCKED]: "Locked (No Changes)",
    };
    return names[level] || level;
  },

  // Get cultural sensitivity display info
  getSensitivityInfo: (level: "low" | "medium" | "high") => {
    const info = {
      low: {
        name: "Low Sensitivity",
        description: "General community content",
        color: "green",
      },
      medium: {
        name: "Medium Sensitivity",
        description: "Requires community consideration",
        color: "yellow",
      },
      high: {
        name: "High Sensitivity",
        description: "Requires elder/cultural advisor approval",
        color: "red",
      },
    };
    return info[level] || info.medium;
  },
};

export default supabase;
