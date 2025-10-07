import dotenv from "dotenv";
import path from "path";
import fs from "fs";

interface EnvironmentConfig {
  // Database (Prisma - legacy, keeping for migration)
  DATABASE_URL: string;

  // Supabase (primary database)
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  SUPABASE_ANON_KEY: string;

  // Server
  PORT: number;
  NODE_ENV: string;

  // JWT
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;

  // AI Providers
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  PERPLEXITY_API_KEY?: string;

  // Computer Vision
  GOOGLE_CLOUD_VISION_API_KEY?: string;
  AZURE_COMPUTER_VISION_KEY?: string;
  AZURE_COMPUTER_VISION_ENDPOINT?: string;

  // Audio Processing
  AZURE_SPEECH_KEY?: string;
  AZURE_SPEECH_REGION?: string;
  ASSEMBLYAI_API_KEY?: string;

  // Cloud Storage
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_S3_BUCKET?: string;
  AWS_REGION?: string;

  // Redis
  REDIS_URL: string;

  // Upload limits
  MAX_FILE_SIZE: string;
  MAX_FILES: number;

  // Cultural
  REQUIRE_ELDER_APPROVAL: boolean;
  DEFAULT_SENSITIVITY_LEVEL: string;

  // Frontend
  FRONTEND_URL: string;
}

class ConfigManager {
  private config: EnvironmentConfig;
  private envPaths: string[] = [];

  constructor() {
    this.findEnvFiles();
    this.loadEnvironment();
    this.config = this.validateAndParseConfig();
  }

  /**
   * Find all possible .env file locations
   */
  private findEnvFiles() {
    const possiblePaths = [
      // Current directory
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), ".env.local"),

      // Backend directory specifically
      path.resolve(__dirname, "../../.env"),
      path.resolve(__dirname, "../../.env.local"),

      // Parent directory (in case running from different location)
      path.resolve(process.cwd(), "../.env"),
      path.resolve(process.cwd(), "../../.env"),

      // Absolute path to your backend
      "/Users/benknight/Code/Oochiumpa/oonchiumpa-backend/.env",

      // Home directory fallback
      path.resolve(process.env.HOME || "~", ".oonchiumpa.env"),
    ];

    this.envPaths = possiblePaths.filter((envPath) => {
      try {
        return fs.existsSync(envPath);
      } catch (error) {
        return false;
      }
    });

    console.log(`🔍 Found .env files:`, this.envPaths);
  }

  /**
   * Load environment variables from all found .env files
   */
  private loadEnvironment() {
    // Load from system environment first
    dotenv.config();

    // Load from each found .env file (later ones override earlier ones)
    this.envPaths.forEach((envPath) => {
      console.log(`📄 Loading environment from: ${envPath}`);
      dotenv.config({ path: envPath, override: true });
    });

    // Log which env file is being used
    if (this.envPaths.length === 0) {
      console.warn(
        "⚠️  No .env files found! Using system environment variables only.",
      );
      this.createDefaultEnvFile();
    }
  }

  /**
   * Create a default .env file if none exists
   */
  private createDefaultEnvFile() {
    const defaultEnvPath = path.resolve(process.cwd(), ".env");
    const defaultEnvContent = this.getDefaultEnvContent();

    try {
      fs.writeFileSync(defaultEnvPath, defaultEnvContent);
      console.log(`✅ Created default .env file at: ${defaultEnvPath}`);
      console.log("🔐 Please update the API keys in your .env file");

      // Load the newly created file
      dotenv.config({ path: defaultEnvPath, override: true });
    } catch (error) {
      console.error("❌ Failed to create default .env file:", error);
    }
  }

  /**
   * Get default environment content
   */
  private getDefaultEnvContent(): string {
    return `# Database (Legacy Prisma - keeping for migration)
DATABASE_URL="postgresql://\${USER}@localhost:5432/oonchiumpa"

# Supabase (Primary Database)
SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_KEY="your-supabase-service-key" 
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# JWT (Generate new secrets for production!)
JWT_SECRET=dev-super-secret-jwt-key-replace-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-replace-in-production

# AI Providers (Add your API keys here)
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
PERPLEXITY_API_KEY=your-perplexity-api-key-here

# Computer Vision
GOOGLE_CLOUD_VISION_API_KEY=your-google-vision-api-key-here
AZURE_COMPUTER_VISION_KEY=your-azure-vision-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.cognitiveservices.azure.com/

# Audio Processing
AZURE_SPEECH_KEY=your-azure-speech-key-here
AZURE_SPEECH_REGION=your-azure-region
ASSEMBLYAI_API_KEY=your-assemblyai-api-key-here

# Additional AI Services
COHERE_API_KEY=your-cohere-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=oonchiumpa-media-dev
AWS_REGION=us-west-2

# Redis
REDIS_URL=redis://localhost:6379

# Upload limits
MAX_FILE_SIZE=50MB
MAX_FILES=10

# Cultural sensitivity
REQUIRE_ELDER_APPROVAL=true
DEFAULT_SENSITIVITY_LEVEL=community

# Development helpers (remove in production)
DEBUG=true
VERBOSE_LOGGING=true
`;
  }

  /**
   * Validate and parse configuration
   */
  private validateAndParseConfig(): EnvironmentConfig {
    const config = {
      // Database (Prisma - legacy, keeping for migration)
      DATABASE_URL: this.getRequired("DATABASE_URL"),

      // Supabase (primary database)
      SUPABASE_URL: this.getRequired("SUPABASE_URL"),
      SUPABASE_SERVICE_KEY: this.getRequired("SUPABASE_SERVICE_KEY"),
      SUPABASE_ANON_KEY: this.getRequired("SUPABASE_ANON_KEY"),

      // Server
      PORT: parseInt(process.env.PORT || "3001"),
      NODE_ENV: process.env.NODE_ENV || "development",

      // JWT (required)
      JWT_SECRET: this.getRequired("JWT_SECRET"),
      JWT_REFRESH_SECRET: this.getRequired("JWT_REFRESH_SECRET"),

      // AI Providers (optional)
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,

      // Computer Vision (optional)
      GOOGLE_CLOUD_VISION_API_KEY: process.env.GOOGLE_CLOUD_VISION_API_KEY,
      AZURE_COMPUTER_VISION_KEY: process.env.AZURE_COMPUTER_VISION_KEY,
      AZURE_COMPUTER_VISION_ENDPOINT:
        process.env.AZURE_COMPUTER_VISION_ENDPOINT,

      // Audio Processing (optional)
      AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
      AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
      ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,

      // Cloud Storage (optional)
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
      AWS_REGION: process.env.AWS_REGION || "us-west-2",

      // Redis
      REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

      // Upload limits
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || "50MB",
      MAX_FILES: parseInt(process.env.MAX_FILES || "10"),

      // Cultural
      REQUIRE_ELDER_APPROVAL: process.env.REQUIRE_ELDER_APPROVAL !== "false",
      DEFAULT_SENSITIVITY_LEVEL:
        process.env.DEFAULT_SENSITIVITY_LEVEL || "community",

      // Frontend
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    };

    this.validateConfig(config);
    return config;
  }

  /**
   * Get required environment variable
   */
  private getRequired(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`❌ Required environment variable ${key} is not set!`);
    }
    return value;
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: EnvironmentConfig) {
    const errors: string[] = [];

    // Check database URL format
    if (!config.DATABASE_URL.startsWith("postgresql://")) {
      errors.push("DATABASE_URL must be a valid PostgreSQL connection string");
    }

    // Check port
    if (isNaN(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
      errors.push("PORT must be a valid port number (1-65535)");
    }

    // Check JWT secrets (should not be defaults in production)
    if (config.NODE_ENV === "production") {
      if (config.JWT_SECRET.includes("dev-super-secret")) {
        errors.push("JWT_SECRET must be changed for production!");
      }
      if (config.JWT_REFRESH_SECRET.includes("dev-refresh-secret")) {
        errors.push("JWT_REFRESH_SECRET must be changed for production!");
      }
    }

    if (errors.length > 0) {
      console.error("❌ Configuration validation errors:");
      errors.forEach((error) => console.error(`   - ${error}`));

      if (config.NODE_ENV === "production") {
        process.exit(1);
      } else {
        console.warn("⚠️  Continuing with invalid config in development mode");
      }
    }

    // Log which AI providers are available
    this.logAIProviderStatus(config);
  }

  /**
   * Log AI provider availability
   */
  private logAIProviderStatus(config: EnvironmentConfig) {
    console.log("\n🤖 AI Provider Status:");

    const providers = [
      {
        name: "OpenAI",
        key: "OPENAI_API_KEY",
        available:
          !!config.OPENAI_API_KEY && !config.OPENAI_API_KEY.includes("your-"),
      },
      {
        name: "Anthropic",
        key: "ANTHROPIC_API_KEY",
        available:
          !!config.ANTHROPIC_API_KEY &&
          !config.ANTHROPIC_API_KEY.includes("your-"),
      },
      {
        name: "Perplexity",
        key: "PERPLEXITY_API_KEY",
        available:
          !!config.PERPLEXITY_API_KEY &&
          !config.PERPLEXITY_API_KEY.includes("your-"),
      },
      {
        name: "Google Vision",
        key: "GOOGLE_CLOUD_VISION_API_KEY",
        available:
          !!config.GOOGLE_CLOUD_VISION_API_KEY &&
          !config.GOOGLE_CLOUD_VISION_API_KEY.includes("your-"),
      },
      {
        name: "Azure Vision",
        key: "AZURE_COMPUTER_VISION_KEY",
        available:
          !!config.AZURE_COMPUTER_VISION_KEY &&
          !config.AZURE_COMPUTER_VISION_KEY.includes("your-"),
      },
    ];

    providers.forEach((provider) => {
      const status = provider.available ? "✅" : "❌";
      console.log(`   ${status} ${provider.name}`);
    });

    const availableCount = providers.filter((p) => p.available).length;
    console.log(
      `\n📊 ${availableCount}/${providers.length} AI providers configured`,
    );

    if (availableCount === 0) {
      console.log("💡 Add your API keys to .env to enable AI features");
    }
    console.log("");
  }

  /**
   * Get configuration
   */
  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Get specific config value
   */
  public get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.config[key];
  }

  /**
   * Check if AI provider is available
   */
  public isAIProviderAvailable(
    provider:
      | "openai"
      | "anthropic"
      | "perplexity"
      | "google_vision"
      | "azure_vision",
  ): boolean {
    switch (provider) {
      case "openai":
        return (
          !!this.config.OPENAI_API_KEY &&
          !this.config.OPENAI_API_KEY.includes("your-")
        );
      case "anthropic":
        return (
          !!this.config.ANTHROPIC_API_KEY &&
          !this.config.ANTHROPIC_API_KEY.includes("your-")
        );
      case "perplexity":
        return (
          !!this.config.PERPLEXITY_API_KEY &&
          !this.config.PERPLEXITY_API_KEY.includes("your-")
        );
      case "google_vision":
        return (
          !!this.config.GOOGLE_CLOUD_VISION_API_KEY &&
          !this.config.GOOGLE_CLOUD_VISION_API_KEY.includes("your-")
        );
      case "azure_vision":
        return (
          !!this.config.AZURE_COMPUTER_VISION_KEY &&
          !this.config.AZURE_COMPUTER_VISION_KEY.includes("your-")
        );
      default:
        return false;
    }
  }

  /**
   * Reload configuration (useful for development)
   */
  public reload() {
    this.findEnvFiles();
    this.loadEnvironment();
    this.config = this.validateAndParseConfig();
    console.log("🔄 Configuration reloaded");
  }
}

// Create singleton instance
const configManager = new ConfigManager();

// Export configuration
export const config = configManager.getConfig();
export const env = configManager;

// Export for debugging
export const debugEnv = () => {
  console.log("🔍 Environment Debug Info:");
  console.log("Current working directory:", process.cwd());
  console.log("__dirname:", __dirname);
  console.log("Found .env files:", configManager["envPaths"]);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
  console.log("Config loaded:", !!config);
};
