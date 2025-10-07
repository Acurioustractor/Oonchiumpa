export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export declare const TABLES: {
    readonly STORIES: "stories";
    readonly STORYTELLERS: "storytellers";
    readonly STORY_PERMISSIONS: "story_permissions";
    readonly PARTNERS: "partners";
    readonly FUNDING_GRANTS: "funding_grants";
    readonly OUTCOMES: "outcomes";
    readonly MEDIA_ITEMS: "media_items";
    readonly PROJECTS: "projects";
    readonly INTERVIEWS: "interviews";
    readonly EMPATHY_LEDGER: "empathy_ledger_entries";
};
export declare enum StoryVisibilityLevel {
    PRIVATE = "private",// Only storyteller can see
    COMMUNITY = "community",// Community members can see
    ORGANIZATION = "organization",// Organization staff can see
    PUBLIC = "public",// Everyone can see
    ARCHIVED = "archived"
}
export declare enum StoryControlLevel {
    FULL_CONTROL = "full_control",// Storyteller has complete control
    COLLABORATIVE = "collaborative",// Storyteller + org can edit
    ORGANIZATION = "organization",// Organization controls
    LOCKED = "locked"
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
    expiry_date?: string;
    cultural_sensitivity_level: "low" | "medium" | "high";
    approval_required: boolean;
    created_at: string;
    updated_at: string;
}
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
    empathy_ledger_id?: string;
    created_at: string;
    updated_at: string;
}
export interface EmpathyLedgerStory {
    id: string;
    title: string;
    content: string;
    storyteller_id: string;
    storyteller?: Storyteller;
    permissions?: StoryPermission;
    empathy_ledger_id: string;
    is_active: boolean;
    storyteller_approved: boolean;
    organization_approved: boolean;
    category: string;
    tags: string[];
    cultural_context?: string;
    location?: string;
    date_occurred?: string;
    media_items?: string[];
    audio_url?: string;
    video_url?: string;
    view_count: number;
    engagement_score: number;
    last_viewed?: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    archived_at?: string;
}
export declare const canViewStory: (story: EmpathyLedgerStory, userRole: string, userCommunity?: string) => boolean;
export declare const canEditStory: (story: EmpathyLedgerStory, userRole: string, userId: string) => boolean;
export declare const supabaseHelpers: {
    getVisibleStories(userRole: string, userCommunity?: string, userId?: string): Promise<any[]>;
    toggleStoryVisibility(storyId: string, storytellerId: string, isActive: boolean): Promise<any>;
    updateStoryPermissions(storyId: string, permissions: Partial<StoryPermission>): Promise<any>;
    createStoryWithPermissions(story: Omit<EmpathyLedgerStory, "id" | "created_at" | "updated_at">, permissions: Omit<StoryPermission, "id" | "story_id" | "created_at" | "updated_at">): Promise<{
        story: any;
        permissions: any;
    }>;
};
export default supabaseAdmin;
//# sourceMappingURL=supabase.d.ts.map