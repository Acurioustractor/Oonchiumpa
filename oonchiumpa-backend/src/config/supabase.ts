import { createClient } from "@supabase/supabase-js";
import { config } from "./env";

// Supabase configuration
const supabaseUrl = config.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
  config.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.",
  );
}

// Create Supabase client with service key (for backend operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database table names
export const TABLES = {
  STORIES: "stories",
  STORYTELLERS: "storytellers",
  STORY_PERMISSIONS: "story_permissions",
  PARTNERS: "partners",
  FUNDING_GRANTS: "funding_grants",
  OUTCOMES: "outcomes",
  MEDIA_ITEMS: "media_items",
  PROJECTS: "projects",
  INTERVIEWS: "interviews",
  EMPATHY_LEDGER: "empathy_ledger_entries",
} as const;

// Empathy Ledger Story Types
export enum StoryVisibilityLevel {
  PRIVATE = "private", // Only storyteller can see
  COMMUNITY = "community", // Community members can see
  ORGANIZATION = "organization", // Organization staff can see
  PUBLIC = "public", // Everyone can see
  ARCHIVED = "archived", // Hidden but preserved
}

export enum StoryControlLevel {
  FULL_CONTROL = "full_control", // Storyteller has complete control
  COLLABORATIVE = "collaborative", // Storyteller + org can edit
  ORGANIZATION = "organization", // Organization controls
  LOCKED = "locked", // No changes allowed
}

// Story Permission Interface
export interface StoryPermission {
  id: string;
  story_id: string;
  storyteller_id: string;
  visibility_level: StoryVisibilityLevel;
  control_level: StoryControlLevel;
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
  expiry_date?: string;
  cultural_sensitivity_level: "low" | "medium" | "high";
  approval_required: boolean;
  created_at: string;
  updated_at: string;
}

// Storyteller Interface
export interface Storyteller {
  id: string;
  name: string;
  email?: string;
  community?: string;
  cultural_background?: string;
  preferred_contact?: string;
  consent_given: boolean;
  consent_date: string;
  active: boolean;
  empathy_ledger_id?: string; // Link to Empathy Ledger system
  created_at: string;
  updated_at: string;
}

// Enhanced Story Interface with Empathy Ledger integration
export interface EmpathyLedgerStory {
  id: string;
  title: string;
  content: string;
  storyteller_id: string;
  storyteller?: Storyteller;
  permissions?: StoryPermission;

  // Empathy Ledger specific fields
  empathy_ledger_id: string;
  is_active: boolean; // Can storyteller turn on/off
  storyteller_approved: boolean;
  organization_approved: boolean;

  // Metadata
  category: string;
  tags: string[];
  cultural_context?: string;
  location?: string;
  date_occurred?: string;

  // Media attachments
  media_items?: string[];
  audio_url?: string;
  video_url?: string;

  // Analytics (read-only)
  view_count: number;
  engagement_score: number;
  last_viewed?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  archived_at?: string;
}

// Helper functions for story visibility
export const canViewStory = (
  story: EmpathyLedgerStory,
  userRole: string,
  userCommunity?: string,
): boolean => {
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
};

export const canEditStory = (
  story: EmpathyLedgerStory,
  userRole: string,
  userId: string,
): boolean => {
  if (!story.permissions) return false;

  const permission = story.permissions;

  // Storyteller can always edit their own story (unless locked)
  if (
    story.storyteller_id === userId &&
    permission.control_level !== StoryControlLevel.LOCKED
  ) {
    return permission.can_edit;
  }

  // Organization staff rights
  if (["admin", "staff"].includes(userRole)) {
    return (
      permission.control_level === StoryControlLevel.ORGANIZATION ||
      permission.control_level === StoryControlLevel.COLLABORATIVE
    );
  }

  return false;
};

// Supabase helper functions
export const supabaseHelpers = {
  // Get stories with permission filtering
  async getVisibleStories(
    userRole: string,
    userCommunity?: string,
    userId?: string,
  ) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.STORIES)
      .select(
        `
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*)
      `,
      )
      .eq("is_active", true);

    if (error) throw error;

    return (
      data?.filter((story) =>
        canViewStory(story as EmpathyLedgerStory, userRole, userCommunity),
      ) || []
    );
  },

  // Toggle story visibility (storyteller control)
  async toggleStoryVisibility(
    storyId: string,
    storytellerId: string,
    isActive: boolean,
  ) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.STORIES)
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", storyId)
      .eq("storyteller_id", storytellerId)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update story permissions
  async updateStoryPermissions(
    storyId: string,
    permissions: Partial<StoryPermission>,
  ) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.STORY_PERMISSIONS)
      .update({
        ...permissions,
        updated_at: new Date().toISOString(),
      })
      .eq("story_id", storyId)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Create story with initial permissions
  async createStoryWithPermissions(
    story: Omit<EmpathyLedgerStory, "id" | "created_at" | "updated_at">,
    permissions: Omit<
      StoryPermission,
      "id" | "story_id" | "created_at" | "updated_at"
    >,
  ) {
    // First create the story
    const { data: storyData, error: storyError } = await supabaseAdmin
      .from(TABLES.STORIES)
      .insert({
        ...story,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (storyError) throw storyError;

    // Then create permissions
    const { data: permissionData, error: permissionError } = await supabaseAdmin
      .from(TABLES.STORY_PERMISSIONS)
      .insert({
        ...permissions,
        story_id: storyData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (permissionError) throw permissionError;

    return {
      story: storyData,
      permissions: permissionData,
    };
  },
};

export default supabaseAdmin;
