interface EnvironmentConfig {
    DATABASE_URL: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    SUPABASE_ANON_KEY: string;
    PORT: number;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    PERPLEXITY_API_KEY?: string;
    GOOGLE_CLOUD_VISION_API_KEY?: string;
    AZURE_COMPUTER_VISION_KEY?: string;
    AZURE_COMPUTER_VISION_ENDPOINT?: string;
    AZURE_SPEECH_KEY?: string;
    AZURE_SPEECH_REGION?: string;
    ASSEMBLYAI_API_KEY?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_S3_BUCKET?: string;
    AWS_REGION?: string;
    REDIS_URL: string;
    MAX_FILE_SIZE: string;
    MAX_FILES: number;
    REQUIRE_ELDER_APPROVAL: boolean;
    DEFAULT_SENSITIVITY_LEVEL: string;
    FRONTEND_URL: string;
}
declare class ConfigManager {
    private config;
    private envPaths;
    constructor();
    /**
     * Find all possible .env file locations
     */
    private findEnvFiles;
    /**
     * Load environment variables from all found .env files
     */
    private loadEnvironment;
    /**
     * Create a default .env file if none exists
     */
    private createDefaultEnvFile;
    /**
     * Get default environment content
     */
    private getDefaultEnvContent;
    /**
     * Validate and parse configuration
     */
    private validateAndParseConfig;
    /**
     * Get required environment variable
     */
    private getRequired;
    /**
     * Validate configuration
     */
    private validateConfig;
    /**
     * Log AI provider availability
     */
    private logAIProviderStatus;
    /**
     * Get configuration
     */
    getConfig(): EnvironmentConfig;
    /**
     * Get specific config value
     */
    get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K];
    /**
     * Check if AI provider is available
     */
    isAIProviderAvailable(provider: "openai" | "anthropic" | "perplexity" | "google_vision" | "azure_vision"): boolean;
    /**
     * Reload configuration (useful for development)
     */
    reload(): void;
}
export declare const config: EnvironmentConfig;
export declare const env: ConfigManager;
export declare const debugEnv: () => void;
export {};
//# sourceMappingURL=env.d.ts.map