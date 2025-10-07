import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { DocumentProcessor } from '../services/documentProcessor';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import { logger } from '../utils/logger';

const router = Router();
const documentProcessor = new DocumentProcessor();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads', 'documents'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Supported types: ${allowedTypes.join(', ')}`));
    }
  }
});

// Apply upload rate limiting
router.use(uploadRateLimiter);

// Upload and process document
router.post('/upload', upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a document file'
      });
    }

    logger.info('Document upload started', {
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
  } catch (error) {
    logger.error('Document upload failed', { error: error.message });
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
  } catch (error) {
    next(error);
  }
});

export default router;