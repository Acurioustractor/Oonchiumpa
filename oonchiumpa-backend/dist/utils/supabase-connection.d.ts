import { SupabaseClient } from "@supabase/supabase-js";
/**
 * 🎭 Oonchiumpa Supabase Connection Manager
 * World-class database connection handling with Empathy Ledger integration
 */
declare class SupabaseConnectionManager {
    private client;
    private connectionAttempts;
    private maxRetryAttempts;
    private retryDelay;
    private healthCheckInterval;
    constructor();
    /**
     * Initialize Supabase connection with retry logic
     */
    private initializeConnection;
    /**
     * Validate Supabase configuration
     */
    private validateConfiguration;
    /**
     * Create Supabase client with optimal configuration
     */
    private createSupabaseClient;
    /**
     * Test database connection
     */
    private testConnection;
    /**
     * Validate that Empathy Ledger schema exists
     */
    private validateEmpathyLedgerSchema;
    /**
     * Handle connection failures with exponential backoff
     */
    private handleConnectionFailure;
    /**
     * Set up periodic health checks
     */
    private setupHealthCheck;
    /**
     * Perform health check
     */
    private performHealthCheck;
    /**
     * Reconnect to database
     */
    private reconnect;
    /**
     * Get the Supabase client instance
     */
    getClient(): SupabaseClient;
    /**
     * Check if connection is healthy
     */
    isConnected(): boolean;
    /**
     * Get connection statistics
     */
    getConnectionStats(): {
        connected: boolean;
        connectionAttempts: number;
        maxRetryAttempts: number;
        hasHealthCheck: boolean;
        config: {
            url: string;
            hasServiceKey: boolean;
            hasAnonKey: boolean;
        };
    };
    /**
     * Empathy Ledger specific helpers
     */
    getEmpathyLedgerHelpers(): {
        getStorytellerStories(empathyLedgerId: string): Promise<any[]>;
        toggleStoryVisibility(storyId: string, isActive: boolean, storytellerId?: string): Promise<any>;
        getVisibleStories(userRole?: string, userCommunity?: string): Promise<any[]>;
        createStoryWithPermissions(storyData: any, permissionsData: any): Promise<{
            story: any;
            permissions: any;
        }>;
    };
    /**
     * Cleanup connections
     */
    cleanup(): Promise<void>;
    /**
     * Mask sensitive URL for logging
     */
    private maskUrl;
}
declare const supabaseConnectionManager: SupabaseConnectionManager;
export declare const supabaseClient: () => SupabaseClient<any, "public", "public", any, any>;
export declare const supabaseEmpathyLedger: () => {
    getStorytellerStories(empathyLedgerId: string): Promise<any[]>;
    toggleStoryVisibility(storyId: string, isActive: boolean, storytellerId?: string): Promise<any>;
    getVisibleStories(userRole?: string, userCommunity?: string): Promise<any[]>;
    createStoryWithPermissions(storyData: any, permissionsData: any): Promise<{
        story: any;
        permissions: any;
    }>;
};
export declare const supabaseStats: () => {
    connected: boolean;
    connectionAttempts: number;
    maxRetryAttempts: number;
    hasHealthCheck: boolean;
    config: {
        url: string;
        hasServiceKey: boolean;
        hasAnonKey: boolean;
    };
};
export declare const cleanupSupabase: () => Promise<void>;
export default supabaseConnectionManager;
//# sourceMappingURL=supabase-connection.d.ts.map