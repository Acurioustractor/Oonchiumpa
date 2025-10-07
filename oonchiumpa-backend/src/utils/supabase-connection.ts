import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config/env";
import { logger } from "./logger";

/**
 * 🎭 Oonchiumpa Supabase Connection Manager
 * World-class database connection handling with Empathy Ledger integration
 */

class SupabaseConnectionManager {
  private client: SupabaseClient | null = null;
  private connectionAttempts = 0;
  private maxRetryAttempts = 5;
  private retryDelay = 1000; // Start with 1 second
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeConnection();
    this.setupHealthCheck();
  }

  /**
   * Initialize Supabase connection with retry logic
   */
  private async initializeConnection() {
    try {
      this.validateConfiguration();
      this.client = await this.createSupabaseClient();
      await this.testConnection();

      logger.info("✅ Supabase connection established successfully", {
        url: this.maskUrl(config.SUPABASE_URL),
        hasServiceKey: !!config.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!config.SUPABASE_ANON_KEY,
      });

      this.connectionAttempts = 0; // Reset on successful connection
    } catch (error) {
      await this.handleConnectionFailure(error);
    }
  }

  /**
   * Validate Supabase configuration
   */
  private validateConfiguration() {
    const errors: string[] = [];

    if (!config.SUPABASE_URL) {
      errors.push("SUPABASE_URL is required");
    } else if (!config.SUPABASE_URL.startsWith("https://")) {
      errors.push("SUPABASE_URL must be a valid HTTPS URL");
    }

    if (!config.SUPABASE_SERVICE_KEY) {
      errors.push("SUPABASE_SERVICE_KEY is required");
    } else if (!config.SUPABASE_SERVICE_KEY.startsWith("eyJ")) {
      errors.push(
        "SUPABASE_SERVICE_KEY appears to be invalid (should start with 'eyJ')",
      );
    }

    if (!config.SUPABASE_ANON_KEY) {
      errors.push("SUPABASE_ANON_KEY is required");
    }

    if (errors.length > 0) {
      throw new Error(
        `Supabase configuration errors:\n- ${errors.join("\n- ")}`,
      );
    }
  }

  /**
   * Create Supabase client with optimal configuration
   */
  private async createSupabaseClient(): Promise<SupabaseClient> {
    const client = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: false, // Server-side, don't persist sessions
          detectSessionInUrl: false,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "oonchiumpa-backend/1.0.0",
            "User-Agent": "Oonchiumpa-Platform/1.0.0",
          },
        },
        realtime: {
          params: {
            eventsPerSecond: 10, // Rate limit real-time events
          },
        },
      },
    );

    return client;
  }

  /**
   * Test database connection
   */
  private async testConnection() {
    if (!this.client) {
      throw new Error("Supabase client not initialized");
    }

    // Test basic connectivity
    const { error: healthError } = await this.client
      .from("storytellers")
      .select("id")
      .limit(1);

    if (healthError && !healthError.message.includes("does not exist")) {
      throw new Error(
        `Database connection test failed: ${healthError.message}`,
      );
    }

    // Test Empathy Ledger specific tables
    await this.validateEmpathyLedgerSchema();

    logger.info("📊 Database connectivity test passed");
  }

  /**
   * Validate that Empathy Ledger schema exists
   */
  private async validateEmpathyLedgerSchema() {
    if (!this.client) return;

    const requiredTables = [
      "storytellers",
      "stories",
      "story_permissions",
      "partners",
      "outcomes",
    ];

    for (const table of requiredTables) {
      const { error } = await this.client.from(table).select("*").limit(0); // Just test table existence

      if (error && error.message.includes("does not exist")) {
        logger.warn(
          `⚠️  Table '${table}' does not exist. Run migrations first.`,
        );
      }
    }

    logger.info("🎭 Empathy Ledger schema validation completed");
  }

  /**
   * Handle connection failures with exponential backoff
   */
  private async handleConnectionFailure(error: any) {
    this.connectionAttempts++;

    logger.error(
      `❌ Supabase connection failed (attempt ${this.connectionAttempts}/${this.maxRetryAttempts})`,
      {
        error: error.message,
        attempt: this.connectionAttempts,
        nextRetryIn: this.retryDelay,
      },
    );

    if (this.connectionAttempts >= this.maxRetryAttempts) {
      logger.error("💥 Max connection attempts reached. Service unavailable.", {
        totalAttempts: this.connectionAttempts,
        finalError: error.message,
      });

      // In production, you might want to exit or send alerts
      if (config.NODE_ENV === "production") {
        process.exit(1);
      }
      return;
    }

    // Exponential backoff with jitter
    const jitter = Math.random() * 1000;
    const delay = Math.min(
      this.retryDelay * Math.pow(2, this.connectionAttempts - 1) + jitter,
      30000,
    );

    logger.info(`⏳ Retrying connection in ${Math.round(delay)}ms...`);

    setTimeout(async () => {
      await this.initializeConnection();
    }, delay);
  }

  /**
   * Set up periodic health checks
   */
  private setupHealthCheck() {
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000);

    logger.info("❤️  Database health check scheduled (30s intervals)");
  }

  /**
   * Perform health check
   */
  private async performHealthCheck() {
    if (!this.client) {
      logger.warn("⚠️  Health check failed: No client connection");
      return;
    }

    try {
      const start = Date.now();

      // Simple health check query
      const { error } = await this.client
        .from("storytellers")
        .select("id")
        .limit(1);

      const responseTime = Date.now() - start;

      if (error && !error.message.includes("does not exist")) {
        throw error;
      }

      // Log slow queries
      if (responseTime > 5000) {
        logger.warn("🐌 Slow database response detected", {
          responseTime: `${responseTime}ms`,
          threshold: "5000ms",
        });
      }

      logger.debug("❤️  Database health check passed", {
        responseTime: `${responseTime}ms`,
      });
    } catch (error) {
      logger.error("💔 Database health check failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      // Attempt reconnection on health check failure
      await this.reconnect();
    }
  }

  /**
   * Reconnect to database
   */
  private async reconnect() {
    logger.info("🔄 Attempting database reconnection...");

    this.client = null;
    this.connectionAttempts = 0;

    await this.initializeConnection();
  }

  /**
   * Get the Supabase client instance
   */
  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error(
        "Supabase client not initialized. Check your configuration.",
      );
    }
    return this.client;
  }

  /**
   * Check if connection is healthy
   */
  public isConnected(): boolean {
    return this.client !== null;
  }

  /**
   * Get connection statistics
   */
  public getConnectionStats() {
    return {
      connected: this.isConnected(),
      connectionAttempts: this.connectionAttempts,
      maxRetryAttempts: this.maxRetryAttempts,
      hasHealthCheck: this.healthCheckInterval !== null,
      config: {
        url: this.maskUrl(config.SUPABASE_URL),
        hasServiceKey: !!config.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!config.SUPABASE_ANON_KEY,
      },
    };
  }

  /**
   * Empathy Ledger specific helpers
   */
  public getEmpathyLedgerHelpers() {
    const client = this.getClient();

    return {
      // Get stories for a storyteller by Empathy Ledger ID
      async getStorytellerStories(empathyLedgerId: string) {
        const { data, error } = await client
          .from("stories")
          .select(
            `
            *,
            storyteller:storytellers!inner(*),
            permissions:story_permissions(*)
          `,
          )
          .eq("storyteller.empathy_ledger_id", empathyLedgerId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },

      // Toggle story visibility (core Empathy Ledger function)
      async toggleStoryVisibility(
        storyId: string,
        isActive: boolean,
        storytellerId?: string,
      ) {
        const updateData: any = {
          is_active: isActive,
          updated_at: new Date().toISOString(),
        };

        let query = client.from("stories").update(updateData).eq("id", storyId);

        // If storyteller ID provided, ensure they own the story
        if (storytellerId) {
          query = query.eq("storyteller_id", storytellerId);
        }

        const { data, error } = await query.select();

        if (error) throw error;
        return data[0];
      },

      // Get stories with permission filtering
      async getVisibleStories(
        userRole: string = "visitor",
        userCommunity?: string,
      ) {
        const { data, error } = await client
          .from("stories")
          .select(
            `
            *,
            storyteller:storytellers(*),
            permissions:story_permissions(*)
          `,
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Filter based on permissions (implement your visibility logic here)
        return data.filter((story: any) => {
          const permission = story.permissions;
          if (!permission) return false;

          switch (permission.visibility_level) {
            case "public":
              return story.storyteller_approved && story.organization_approved;
            case "organization":
              return ["admin", "staff", "coordinator"].includes(userRole);
            case "community":
              return (
                userCommunity === story.storyteller?.community ||
                ["admin", "staff"].includes(userRole)
              );
            case "private":
              return ["admin"].includes(userRole);
            default:
              return false;
          }
        });
      },

      // Create story with permissions
      async createStoryWithPermissions(storyData: any, permissionsData: any) {
        // Start a transaction-like operation
        const { data: story, error: storyError } = await client
          .from("stories")
          .insert(storyData)
          .select()
          .single();

        if (storyError) throw storyError;

        const { data: permissions, error: permissionsError } = await client
          .from("story_permissions")
          .insert({
            ...permissionsData,
            story_id: story.id,
          })
          .select()
          .single();

        if (permissionsError) {
          // Cleanup story if permissions failed
          await client.from("stories").delete().eq("id", story.id);
          throw permissionsError;
        }

        return { story, permissions };
      },
    };
  }

  /**
   * Cleanup connections
   */
  public async cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.client) {
      // Supabase client doesn't need explicit cleanup, but we can null it
      this.client = null;
    }

    logger.info("🧹 Supabase connection manager cleaned up");
  }

  /**
   * Mask sensitive URL for logging
   */
  private maskUrl(url: string): string {
    if (!url) return "not-set";

    try {
      const urlObj = new URL(url);
      const projectId = urlObj.hostname.split(".")[0];
      return `https://${projectId.substring(0, 8)}***.supabase.co`;
    } catch {
      return "invalid-url";
    }
  }
}

// Create singleton instance
const supabaseConnectionManager = new SupabaseConnectionManager();

// Export the client and helpers
export const supabaseClient = () => supabaseConnectionManager.getClient();
export const supabaseEmpathyLedger = () =>
  supabaseConnectionManager.getEmpathyLedgerHelpers();
export const supabaseStats = () =>
  supabaseConnectionManager.getConnectionStats();

// Export for graceful shutdown
export const cleanupSupabase = () => supabaseConnectionManager.cleanup();

// Handle process shutdown
process.on("SIGTERM", cleanupSupabase);
process.on("SIGINT", cleanupSupabase);

export default supabaseConnectionManager;
