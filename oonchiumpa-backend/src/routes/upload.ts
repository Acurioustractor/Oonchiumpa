import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
    }
  }
});

/**
 * Upload single image
 * POST /api/upload/image
 * REQUIRES: Content generation permissions
 */
router.post('/image', authenticateToken, requirePermission('content.generate'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { context = 'general' } = req.body;
    
    logger.info(`📸 Uploading image: ${req.file.originalname} for context: ${context}`);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `oonchiumpa/${context}`,
      public_id: `${context}_${Date.now()}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      tags: [context, 'oonchiumpa', req.user?.role || 'unknown']
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    const uploadedImage = {
      id: result.public_id,
      url: result.secure_url,
      filename: req.file.originalname,
      size: req.file.size,
      width: result.width,
      height: result.height,
      format: result.format,
      context: context,
      uploadedBy: req.user?.id,
      uploadedAt: new Date().toISOString()
    };

    logger.info(`✅ Image uploaded successfully: ${result.secure_url}`);

    res.json({
      success: true,
      image: uploadedImage
    });

  } catch (error) {
    logger.error('Image upload error:', error);
    
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

/**
 * Upload multiple images
 * POST /api/upload/images
 * REQUIRES: Content generation permissions
 */
router.post('/images', authenticateToken, requirePermission('content.generate'), upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      });
    }

    const { context = 'general' } = req.body;
    
    logger.info(`📸 Uploading ${req.files.length} images for context: ${context}`);

    const uploadPromises = req.files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `oonchiumpa/${context}`,
          public_id: `${context}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          tags: [context, 'oonchiumpa', req.user?.role || 'unknown']
        });

        // Clean up local file
        fs.unlinkSync(file.path);

        return {
          id: result.public_id,
          url: result.secure_url,
          filename: file.originalname,
          size: file.size,
          width: result.width,
          height: result.height,
          format: result.format,
          context: context,
          uploadedBy: req.user?.id,
          uploadedAt: new Date().toISOString()
        };
      } catch (error) {
        logger.error(`Failed to upload ${file.originalname}:`, error);
        // Clean up local file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        throw error;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    logger.info(`✅ ${uploadedImages.length} images uploaded successfully`);

    res.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    });

  } catch (error) {
    logger.error('Multiple image upload error:', error);
    
    // Clean up any remaining local files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload one or more images'
    });
  }
});

/**
 * Delete image from Cloudinary
 * DELETE /api/upload/image/:id
 * REQUIRES: Content generation permissions
 */
router.delete('/image/:id', authenticateToken, requirePermission('content.generate'), async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info(`🗑️ Deleting image: ${id}`);

    const result = await cloudinary.uploader.destroy(id);

    if (result.result === 'ok') {
      logger.info(`✅ Image deleted successfully: ${id}`);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      logger.warn(`⚠️ Image deletion failed: ${id} - ${result.result}`);
      res.status(404).json({
        success: false,
        error: 'Image not found or already deleted'
      });
    }

  } catch (error) {
    logger.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

/**
 * Get user's uploaded images
 * GET /api/upload/images
 * REQUIRES: Authentication
 */
router.get('/images', authenticateToken, async (req, res) => {
  try {
    const { context, limit = 50 } = req.query;
    
    // Build search expression
    let expression = `tags:oonchiumpa`;
    if (context) {
      expression += ` AND tags:${context}`;
    }

    const result = await cloudinary.search
      .expression(expression)
      .sort_by([['created_at', 'desc']])
      .max_results(Number(limit))
      .execute();

    const images = result.resources.map(resource => ({
      id: resource.public_id,
      url: resource.secure_url,
      filename: resource.filename || resource.public_id,
      size: resource.bytes,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      createdAt: resource.created_at,
      tags: resource.tags
    }));

    res.json({
      success: true,
      images: images,
      count: images.length,
      total: result.total_count
    });

  } catch (error) {
    logger.error('Get images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve images'
    });
  }
});

/**
 * Get image details
 * GET /api/upload/image/:id
 * REQUIRES: Authentication
 */
router.get('/image/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await cloudinary.api.resource(id, {
      colors: true,
      faces: true,
      quality_analysis: true
    });

    const imageDetails = {
      id: result.public_id,
      url: result.secure_url,
      filename: result.filename || result.public_id,
      size: result.bytes,
      width: result.width,
      height: result.height,
      format: result.format,
      createdAt: result.created_at,
      tags: result.tags,
      colors: result.colors,
      faces: result.faces,
      quality: result.quality_analysis
    };

    res.json({
      success: true,
      image: imageDetails
    });

  } catch (error) {
    logger.error('Get image details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve image details'
    });
  }
});

export default router;