import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

// Routes
import authRoutes from "./routes/auth";
import storiesRoutes from "./routes/stories";
import outcomesRoutes from "./routes/outcomes";
import mediaRoutes from "./routes/media";
import reportsRoutes from "./routes/reports";
import widgetsRoutes from "./routes/widgets";
import adminRoutes from "./routes/admin";
import culturalAdvisoryRoutes from "./routes/cultural-advisory";
import adminStoriesRoutes from "./routes/admin-stories";
import googlePhotosRoutes from "./routes/google-photos";
import documentProcessorRoutes from "./routes/document-processor";
import contentGeneratorRoutes from "./routes/content-generator";
import uploadRoutes from "./routes/upload";
import contentRoutes from "./routes/content";
import dashboardRoutes from "./routes/dashboard";
import partnersRoutes from "./routes/partners";
import empathyStoriesRoutes from "./routes/empathy-stories";
// import bulkUploadRoutes from './routes/bulk-upload';
// import mediaGalleryRoutes from './routes/media-gallery';

// Load bulletproof environment configuration
import { config, debugEnv } from "./config/env";

// Debug environment loading (remove in production)
if (config.NODE_ENV === "development") {
  debugEnv();
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Initialize Prisma
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Global middleware
app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(rateLimiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Root endpoint - API info
app.get("/", (req, res) => {
  res.json({
    name: "Oonchiumpa Community Platform API",
    version: "1.0.0",
    description:
      "Aboriginal community platform with AI-powered content management",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      stories: "/api/stories",
      outcomes: "/api/outcomes",
      media: "/api/media",
      reports: "/api/reports",
      widgets: "/api/widgets",
      admin: "/api/admin",
      "cultural-advisory": "/api/cultural-advisory",
      "google-photos": "/api/photos",
      "document-processor": "/api/process-document",
      "content-generator": "/api/content-generator",
      upload: "/api/upload",
      content: "/api/content",
      auth: "/api/auth",
      partners: "/api/partners",
      empathy_stories: "/api/empathy-stories",
    },
    ai_providers: {
      openai: !!config.OPENAI_API_KEY,
      anthropic: !!config.ANTHROPIC_API_KEY,
      perplexity: !!config.PERPLEXITY_API_KEY,
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/outcomes", outcomesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/widgets", widgetsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cultural-advisory", culturalAdvisoryRoutes);
app.use("/api/admin/stories", adminStoriesRoutes);
app.use("/api/photos", googlePhotosRoutes);
app.use("/api/process-document", documentProcessorRoutes);
app.use("/api/content-generator", contentGeneratorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/empathy-stories", empathyStoriesRoutes);
// app.use('/api/bulk-upload', bulkUploadRoutes);
// app.use('/api/media-gallery', mediaGalleryRoutes);

// Socket.IO for real-time updates
io.on("connection", (socket) => {
  logger.info("Client connected", { socketId: socket.id });

  socket.on("subscribe-widget", (widgetId: string) => {
    socket.join(`widget-${widgetId}`);
    logger.info("Client subscribed to widget", {
      socketId: socket.id,
      widgetId,
    });
  });

  socket.on("unsubscribe-widget", (widgetId: string) => {
    socket.leave(`widget-${widgetId}`);
    logger.info("Client unsubscribed from widget", {
      socketId: socket.id,
      widgetId,
    });
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected", { socketId: socket.id });
  });
});

// Make io available globally
app.set("socketio", io);

// Error handling
app.use(errorHandler);

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

const PORT = config.PORT;

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.NODE_ENV}`);
  logger.info(`🔒 CORS enabled for: ${config.FRONTEND_URL}`);
});

export { io };
