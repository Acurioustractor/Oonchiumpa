"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const stories_1 = __importDefault(require("./routes/stories"));
const outcomes_1 = __importDefault(require("./routes/outcomes"));
const media_1 = __importDefault(require("./routes/media"));
const reports_1 = __importDefault(require("./routes/reports"));
const widgets_1 = __importDefault(require("./routes/widgets"));
const admin_1 = __importDefault(require("./routes/admin"));
const cultural_advisory_1 = __importDefault(require("./routes/cultural-advisory"));
const admin_stories_1 = __importDefault(require("./routes/admin-stories"));
const google_photos_1 = __importDefault(require("./routes/google-photos"));
const document_processor_1 = __importDefault(require("./routes/document-processor"));
const content_generator_1 = __importDefault(require("./routes/content-generator"));
const upload_1 = __importDefault(require("./routes/upload"));
const content_1 = __importDefault(require("./routes/content"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const partners_1 = __importDefault(require("./routes/partners"));
const empathy_stories_1 = __importDefault(require("./routes/empathy-stories"));
// import bulkUploadRoutes from './routes/bulk-upload';
// import mediaGalleryRoutes from './routes/media-gallery';
// Load bulletproof environment configuration
const env_1 = require("./config/env");
// Debug environment loading (remove in production)
if (env_1.config.NODE_ENV === "development") {
    (0, env_1.debugEnv)();
}
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.config.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});
exports.io = io;
// Initialize Prisma
exports.prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
});
// Global middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(rateLimiter_1.rateLimiter);
// Logging middleware
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
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
        description: "Aboriginal community platform with AI-powered content management",
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
            openai: !!env_1.config.OPENAI_API_KEY,
            anthropic: !!env_1.config.ANTHROPIC_API_KEY,
            perplexity: !!env_1.config.PERPLEXITY_API_KEY,
        },
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.config.NODE_ENV,
    });
});
// API Routes
app.use("/api/auth", auth_1.default);
app.use("/api/stories", stories_1.default);
app.use("/api/outcomes", outcomes_1.default);
app.use("/api/media", media_1.default);
app.use("/api/reports", reports_1.default);
app.use("/api/widgets", widgets_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/cultural-advisory", cultural_advisory_1.default);
app.use("/api/admin/stories", admin_stories_1.default);
app.use("/api/photos", google_photos_1.default);
app.use("/api/process-document", document_processor_1.default);
app.use("/api/content-generator", content_generator_1.default);
app.use("/api/upload", upload_1.default);
app.use("/api/content", content_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/partners", partners_1.default);
app.use("/api/empathy-stories", empathy_stories_1.default);
// app.use('/api/bulk-upload', bulkUploadRoutes);
// app.use('/api/media-gallery', mediaGalleryRoutes);
// Socket.IO for real-time updates
io.on("connection", (socket) => {
    logger_1.logger.info("Client connected", { socketId: socket.id });
    socket.on("subscribe-widget", (widgetId) => {
        socket.join(`widget-${widgetId}`);
        logger_1.logger.info("Client subscribed to widget", {
            socketId: socket.id,
            widgetId,
        });
    });
    socket.on("unsubscribe-widget", (widgetId) => {
        socket.leave(`widget-${widgetId}`);
        logger_1.logger.info("Client unsubscribed from widget", {
            socketId: socket.id,
            widgetId,
        });
    });
    socket.on("disconnect", () => {
        logger_1.logger.info("Client disconnected", { socketId: socket.id });
    });
});
// Make io available globally
app.set("socketio", io);
// Error handling
app.use(errorHandler_1.errorHandler);
// Handle 404
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});
const PORT = env_1.config.PORT;
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger_1.logger.info("SIGTERM received, shutting down gracefully");
    await exports.prisma.$disconnect();
    server.close(() => {
        logger_1.logger.info("Process terminated");
        process.exit(0);
    });
});
process.on("SIGINT", async () => {
    logger_1.logger.info("SIGINT received, shutting down gracefully");
    await exports.prisma.$disconnect();
    server.close(() => {
        logger_1.logger.info("Process terminated");
        process.exit(0);
    });
});
// Start server
server.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server running on port ${PORT}`);
    logger_1.logger.info(`📊 Environment: ${env_1.config.NODE_ENV}`);
    logger_1.logger.info(`🔒 CORS enabled for: ${env_1.config.FRONTEND_URL}`);
});
//# sourceMappingURL=index.js.map