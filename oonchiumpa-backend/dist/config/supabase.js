"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseHelpers = exports.canEditStory = exports.canViewStory = exports.StoryControlLevel = exports.StoryVisibilityLevel = exports.TABLES = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Supabase configuration
const supabaseUrl = env_1.config.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = env_1.config.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.");
}
// Create Supabase client with service key (for backend operations)
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
// Database table names
exports.TABLES = {
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
};
// Empathy Ledger Story Types
var StoryVisibilityLevel;
(function (StoryVisibilityLevel) {
    StoryVisibilityLevel["PRIVATE"] = "private";
    StoryVisibilityLevel["COMMUNITY"] = "community";
    StoryVisibilityLevel["ORGANIZATION"] = "organization";
    StoryVisibilityLevel["PUBLIC"] = "public";
    StoryVisibilityLevel["ARCHIVED"] = "archived";
})(StoryVisibilityLevel || (exports.StoryVisibilityLevel = StoryVisibilityLevel = {}));
var StoryControlLevel;
(function (StoryControlLevel) {
    StoryControlLevel["FULL_CONTROL"] = "full_control";
    StoryControlLevel["COLLABORATIVE"] = "collaborative";
    StoryControlLevel["ORGANIZATION"] = "organization";
    StoryControlLevel["LOCKED"] = "locked";
})(StoryControlLevel || (exports.StoryControlLevel = StoryControlLevel = {}));
// Helper functions for story visibility
const canViewStory = (story, userRole, userCommunity) => {
    if (!story.is_active)
        return false;
    const permission = story.permissions;
    if (!permission)
        return false;
    switch (permission.visibility_level) {
        case StoryVisibilityLevel.PRIVATE:
            return userRole === "storyteller" || userRole === "admin";
        case StoryVisibilityLevel.COMMUNITY:
            return (userCommunity === story.storyteller?.community ||
                userRole === "admin" ||
                userRole === "staff");
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
exports.canViewStory = canViewStory;
const canEditStory = (story, userRole, userId) => {
    if (!story.permissions)
        return false;
    const permission = story.permissions;
    // Storyteller can always edit their own story (unless locked)
    if (story.storyteller_id === userId &&
        permission.control_level !== StoryControlLevel.LOCKED) {
        return permission.can_edit;
    }
    // Organization staff rights
    if (["admin", "staff"].includes(userRole)) {
        return (permission.control_level === StoryControlLevel.ORGANIZATION ||
            permission.control_level === StoryControlLevel.COLLABORATIVE);
    }
    return false;
};
exports.canEditStory = canEditStory;
// Supabase helper functions
exports.supabaseHelpers = {
    // Get stories with permission filtering
    async getVisibleStories(userRole, userCommunity, userId) {
        const { data, error } = await exports.supabaseAdmin
            .from(exports.TABLES.STORIES)
            .select(`
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*)
      `)
            .eq("is_active", true);
        if (error)
            throw error;
        return (data?.filter((story) => (0, exports.canViewStory)(story, userRole, userCommunity)) || []);
    },
    // Toggle story visibility (storyteller control)
    async toggleStoryVisibility(storyId, storytellerId, isActive) {
        const { data, error } = await exports.supabaseAdmin
            .from(exports.TABLES.STORIES)
            .update({
            is_active: isActive,
            updated_at: new Date().toISOString(),
        })
            .eq("id", storyId)
            .eq("storyteller_id", storytellerId)
            .select();
        if (error)
            throw error;
        return data[0];
    },
    // Update story permissions
    async updateStoryPermissions(storyId, permissions) {
        const { data, error } = await exports.supabaseAdmin
            .from(exports.TABLES.STORY_PERMISSIONS)
            .update({
            ...permissions,
            updated_at: new Date().toISOString(),
        })
            .eq("story_id", storyId)
            .select();
        if (error)
            throw error;
        return data[0];
    },
    // Create story with initial permissions
    async createStoryWithPermissions(story, permissions) {
        // First create the story
        const { data: storyData, error: storyError } = await exports.supabaseAdmin
            .from(exports.TABLES.STORIES)
            .insert({
            ...story,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (storyError)
            throw storyError;
        // Then create permissions
        const { data: permissionData, error: permissionError } = await exports.supabaseAdmin
            .from(exports.TABLES.STORY_PERMISSIONS)
            .insert({
            ...permissions,
            story_id: storyData.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (permissionError)
            throw permissionError;
        return {
            story: storyData,
            permissions: permissionData,
        };
    },
};
exports.default = exports.supabaseAdmin;
//# sourceMappingURL=supabase.js.map