"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const documentProcessor_1 = require("../services/documentProcessor");
const rateLimiter_1 = require("../middleware/rateLimiter");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
const documentProcessor = new documentProcessor_1.DocumentProcessor();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(process.cwd(), 'uploads', 'documents'));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitizedName}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.docx', '.txt'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error(`File type not allowed. Supported types: ${allowedTypes.join(', ')}`));
        }
    }
});
// Apply upload rate limiting
router.use(rateLimiter_1.uploadRateLimiter);
// Upload and process document
router.post('/upload', upload.single('document'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file provided',
                message: 'Please upload a document file'
            });
        }
        logger_1.logger.info('Document upload started', {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
        // Start processing (this runs in background)
        const result = await documentProcessor.processDocument(req.file, req.body.userId);
        res.status(202).json({
            message: 'Document uploaded and processing started',
            documentId: result.documentId,
            processingStatus: result.processingStatus,
            storiesExtracted: result.extractedStories.length,
            outcomesExtracted: result.extractedOutcomes.length
        });
    }
    catch (error) {
        logger_1.logger.error('Document upload failed', { error: error.message });
        next(error);
    }
});
// Get processing status
router.get('/processing/:documentId', async (req, res, next) => {
    try {
        const { documentId } = req.params;
        // Implementation would check processing status
        // For now, return mock status
        res.json({
            documentId,
            status: 'completed',
            progress: 100,
            message: 'Document processing completed successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map