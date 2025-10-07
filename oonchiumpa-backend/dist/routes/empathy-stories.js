"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const router = (0, express_1.Router)();
// Mock authentication middleware (replace with real auth)
const authenticate = (req, res, next) => {
    // TODO: Replace with real JWT authentication
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        // Mock user for development
        req.user = {
            id: "user-123",
            role: req.headers["x-user-role"] || "visitor",
            community: req.headers["x-user-community"],
            empathy_ledger_id: req.headers["x-empathy-ledger-id"],
        };
    }
    next();
};
// ============================================
// EMPATHY LEDGER STORY ENDPOINTS
// ============================================
// GET /api/empathy-stories - Get stories with visibility filtering
router.get("/", authenticate, async (req, res) => {
    try {
        const { category, tags, storyteller_id, limit = "20", offset = "0", visibility_level, search, } = req.query;
        const userRole = req.user?.role || "visitor";
        const userCommunity = req.user?.community;
        const userId = req.user?.id;
        let query = supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORIES)
            .select(`
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*),
        media:media_items(*)
      `)
            .eq("is_active", true)
            .order("created_at", { ascending: false });
        // Apply filters
        if (category && typeof category === "string") {
            query = query.eq("category", category);
        }
        if (storyteller_id && typeof storyteller_id === "string") {
            query = query.eq("storyteller_id", storyteller_id);
        }
        if (search && typeof search === "string") {
            query = query.textSearch("title,content", search);
        }
        // Apply pagination
        const limitNum = Math.min(parseInt(limit) || 20, 100);
        const offsetNum = parseInt(offset) || 0;
        query = query.range(offsetNum, offsetNum + limitNum - 1);
        const { data: stories, error, count } = await query;
        if (error) {
            console.error("Error fetching stories:", error);
            return res.status(500).json({ error: "Failed to fetch stories" });
        }
        // Filter stories based on user permissions
        const visibleStories = stories?.filter((story) => {
            return canViewStory(story, userRole, userCommunity);
        }) || [];
        // Update view counts for public stories (async, don't wait)
        visibleStories.forEach((story) => {
            if (story.permissions?.visibility_level === supabase_1.StoryVisibilityLevel.PUBLIC) {
                supabase_1.supabaseAdmin
                    .from(supabase_1.TABLES.STORIES)
                    .update({
                    last_viewed: new Date().toISOString(),
                })
                    .eq("id", story.id)
                    .then(() => { })
                    .catch(() => { });
            }
        });
        res.json({
            stories: visibleStories,
            pagination: {
                total: count,
                limit: limitNum,
                offset: offsetNum,
                hasMore: offsetNum + limitNum < (count || 0),
            },
            user_context: {
                role: userRole,
                community: userCommunity,
                can_create_story: ["admin", "staff", "storyteller"].includes(userRole),
            },
        });
    }
    catch (error) {
        console.error("Error in stories endpoint:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/empathy-stories/:id - Get single story with permission check
router.get("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user?.role || "visitor";
        const userCommunity = req.user?.community;
        const { data: story, error } = await supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORIES)
            .select(`
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*),
        media:media_items(*),
        related_outcomes:outcomes(*)
      `)
            .eq("id", id)
            .single();
        if (error || !story) {
            return res.status(404).json({ error: "Story not found" });
        }
        // Check if user can view this story
        if (!canViewStory(story, userRole, userCommunity)) {
            return res.status(403).json({ error: "Access denied" });
        }
        // Update view count and last_viewed
        await supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORIES)
            .update({
            last_viewed: new Date().toISOString(),
        })
            .eq("id", id);
        res.json({
            story,
            user_permissions: {
                can_edit: canEditStory(story, userRole, req.user?.id || ""),
                can_toggle_visibility: story.storyteller_id === req.user?.id,
                can_delete: story.storyteller_id === req.user?.id ||
                    ["admin"].includes(userRole),
            },
        });
    }
    catch (error) {
        console.error("Error fetching story:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /api/empathy-stories - Create new story with permissions (Empathy Ledger control)
router.post("/", authenticate, async (req, res) => {
    try {
        const userRole = req.user?.role || "visitor";
        // Check if user can create stories
        if (!["admin", "staff", "storyteller"].includes(userRole)) {
            return res
                .status(403)
                .json({ error: "Insufficient permissions to create stories" });
        }
        const { title, content, category, tags = [], cultural_context, location, date_occurred, storyteller_id, empathy_ledger_id, visibility_level = supabase_1.StoryVisibilityLevel.PRIVATE, control_level = supabase_1.StoryControlLevel.FULL_CONTROL, cultural_sensitivity_level = "medium", } = req.body;
        if (!title || !content || !storyteller_id || !empathy_ledger_id) {
            return res.status(400).json({
                error: "Title, content, storyteller_id, and empathy_ledger_id are required",
            });
        }
        // Create story with initial permissions
        const storyData = {
            title,
            content,
            storyteller_id,
            empathy_ledger_id,
            is_active: true,
            storyteller_approved: true, // Auto-approve if storyteller creates
            organization_approved: ["admin", "staff"].includes(userRole),
            category: category || "general",
            tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
            cultural_context,
            location,
            date_occurred,
            view_count: 0,
            engagement_score: 0,
            status: "draft",
        };
        const permissionsData = {
            storyteller_id,
            visibility_level,
            control_level,
            can_edit: true,
            can_delete: true,
            can_share: true,
            cultural_sensitivity_level,
            approval_required: cultural_sensitivity_level === "high",
        };
        const result = await supabase_1.supabaseHelpers.createStoryWithPermissions(storyData, permissionsData);
        res.status(201).json({
            message: "Story created successfully",
            story: result.story,
            permissions: result.permissions,
            empathy_ledger: {
                active: true,
                storyteller_control: true,
                visibility_level,
            },
        });
    }
    catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// PUT /api/empathy-stories/:id/toggle-visibility - Storyteller control to turn story on/off
router.put("/:id/toggle-visibility", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const userEmpathyId = req.user?.empathy_ledger_id;
        if (!userEmpathyId) {
            return res.status(403).json({ error: "Empathy Ledger ID required" });
        }
        if (typeof is_active !== "boolean") {
            return res.status(400).json({ error: "is_active must be boolean" });
        }
        // Use the Supabase helper function for storyteller control
        const updatedStory = await supabase_1.supabaseHelpers.toggleStoryVisibility(id, req.user?.id || "", is_active);
        if (!updatedStory) {
            return res
                .status(404)
                .json({ error: "Story not found or access denied" });
        }
        res.json({
            message: `Story ${is_active ? "activated" : "deactivated"} successfully`,
            story: updatedStory,
            empathy_ledger_control: {
                storyteller_id: req.user?.id,
                action: is_active ? "activated" : "deactivated",
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Error toggling story visibility:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// PUT /api/empathy-stories/:id/permissions - Update story permissions
router.put("/:id/permissions", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user?.role || "visitor";
        const userId = req.user?.id || "";
        // Check if story exists and get current permissions
        const { data: story, error: storyError } = await supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORIES)
            .select(`
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*)
      `)
            .eq("id", id)
            .single();
        if (storyError || !story) {
            return res.status(404).json({ error: "Story not found" });
        }
        // Check if user can edit permissions
        const canEdit = canEditStory(story, userRole, userId) ||
            story.storyteller_id === userId ||
            ["admin"].includes(userRole);
        if (!canEdit) {
            return res
                .status(403)
                .json({
                error: "Insufficient permissions to modify story permissions",
            });
        }
        const { visibility_level, control_level, can_edit, can_delete, can_share, cultural_sensitivity_level, expiry_date, } = req.body;
        const permissionUpdates = {};
        if (visibility_level)
            permissionUpdates.visibility_level = visibility_level;
        if (control_level)
            permissionUpdates.control_level = control_level;
        if (typeof can_edit === "boolean")
            permissionUpdates.can_edit = can_edit;
        if (typeof can_delete === "boolean")
            permissionUpdates.can_delete = can_delete;
        if (typeof can_share === "boolean")
            permissionUpdates.can_share = can_share;
        if (cultural_sensitivity_level)
            permissionUpdates.cultural_sensitivity_level =
                cultural_sensitivity_level;
        if (expiry_date)
            permissionUpdates.expiry_date = expiry_date;
        const updatedPermissions = await supabase_1.supabaseHelpers.updateStoryPermissions(id, permissionUpdates);
        res.json({
            message: "Story permissions updated successfully",
            permissions: updatedPermissions,
            updated_by: {
                user_id: userId,
                role: userRole,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Error updating story permissions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /api/empathy-stories/storyteller/:empathy_ledger_id - Get stories by storyteller
router.get("/storyteller/:empathy_ledger_id", authenticate, async (req, res) => {
    try {
        const { empathy_ledger_id } = req.params;
        const userRole = req.user?.role || "visitor";
        const userCommunity = req.user?.community;
        // Get storyteller
        const { data: storyteller, error: storytellerError } = await supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORYTELLERS)
            .select("*")
            .eq("empathy_ledger_id", empathy_ledger_id)
            .single();
        if (storytellerError || !storyteller) {
            return res.status(404).json({ error: "Storyteller not found" });
        }
        // Get their stories
        const { data: stories, error } = await supabase_1.supabaseAdmin
            .from(supabase_1.TABLES.STORIES)
            .select(`
        *,
        storyteller:storytellers(*),
        permissions:story_permissions(*),
        media:media_items(*)
      `)
            .eq("storyteller_id", storyteller.id)
            .order("created_at", { ascending: false });
        if (error) {
            return res
                .status(500)
                .json({ error: "Failed to fetch storyteller stories" });
        }
        // Filter based on visibility permissions
        const visibleStories = stories?.filter((story) => {
            return canViewStory(story, userRole, userCommunity);
        }) || [];
        res.json({
            storyteller: {
                id: storyteller.id,
                name: storyteller.name,
                community: storyteller.community,
                empathy_ledger_id: storyteller.empathy_ledger_id,
                active: storyteller.active,
            },
            stories: visibleStories,
            stats: {
                total_stories: stories?.length || 0,
                visible_stories: visibleStories.length,
                active_stories: stories?.filter((s) => s.is_active).length || 0,
            },
        });
    }
    catch (error) {
        console.error("Error fetching storyteller stories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Helper functions (same as in supabase config but repeated for clarity)
const canViewStory = (story, userRole, userCommunity) => {
    if (!story.is_active)
        return false;
    const permission = story.permissions;
    if (!permission)
        return false;
    switch (permission.visibility_level) {
        case supabase_1.StoryVisibilityLevel.PRIVATE:
            return userRole === "storyteller" || userRole === "admin";
        case supabase_1.StoryVisibilityLevel.COMMUNITY:
            return (userCommunity === story.storyteller?.community ||
                userRole === "admin" ||
                userRole === "staff");
        case supabase_1.StoryVisibilityLevel.ORGANIZATION:
            return ["admin", "staff", "coordinator"].includes(userRole);
        case supabase_1.StoryVisibilityLevel.PUBLIC:
            return story.storyteller_approved && story.organization_approved;
        case supabase_1.StoryVisibilityLevel.ARCHIVED:
            return userRole === "admin";
        default:
            return false;
    }
};
const canEditStory = (story, userRole, userId) => {
    if (!story.permissions)
        return false;
    const permission = story.permissions;
    // Storyteller can always edit their own story (unless locked)
    if (story.storyteller_id === userId &&
        permission.control_level !== supabase_1.StoryControlLevel.LOCKED) {
        return permission.can_edit;
    }
    // Organization staff rights
    if (["admin", "staff"].includes(userRole)) {
        return (permission.control_level === supabase_1.StoryControlLevel.ORGANIZATION ||
            permission.control_level === supabase_1.StoryControlLevel.COLLABORATIVE);
    }
    return false;
};
exports.default = router;
//# sourceMappingURL=empathy-stories.js.map