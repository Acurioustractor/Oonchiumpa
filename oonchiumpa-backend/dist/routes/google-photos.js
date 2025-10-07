"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googlePhotosIntegration_1 = require("../services/googlePhotosIntegration");
const index_1 = require("../index");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
/**
 * Get Google Photos authorization URL
 * POST /api/photos/auth/url
 */
router.post('/auth/url', async (req, res) => {
    try {
        const authUrl = googlePhotosIntegration_1.googlePhotos.getAuthUrl();
        res.json({
            success: true,
            authUrl,
            message: 'Please visit this URL to authorize Google Photos access'
        });
    }
    catch (error) {
        logger_1.logger.error('Error generating Google Photos auth URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate authorization URL'
        });
    }
});
/**
 * Handle Google Photos OAuth callback
 * GET /api/photos/auth/callback
 */
router.get('/auth/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Authorization code is required'
            });
        }
        const tokens = await googlePhotosIntegration_1.googlePhotos.setCredentials(code);
        // Store tokens in user session or database as needed
        // For now, just return success
        res.json({
            success: true,
            message: 'Google Photos authorization successful! You can now import photos.',
            tokens: {
                hasAccessToken: !!tokens.access_token,
                hasRefreshToken: !!tokens.refresh_token,
                expiryDate: tokens.expiry_date
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error handling Google Photos OAuth callback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete authorization'
        });
    }
});
/**
 * Get Google Photos albums
 * GET /api/photos/albums
 */
router.get('/albums', async (req, res) => {
    try {
        const albums = await googlePhotosIntegration_1.googlePhotos.getAlbums();
        res.json({
            success: true,
            albums,
            count: albums.length
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching Google Photos albums:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch albums. Make sure you have authorized Google Photos access.'
        });
    }
});
/**
 * Get photos from specific album or all photos
 * GET /api/photos/:albumId?
 */
router.get('/:albumId?', async (req, res) => {
    try {
        const { albumId } = req.params;
        const { limit = 50 } = req.query;
        const photos = await googlePhotosIntegration_1.googlePhotos.getPhotos(albumId, parseInt(limit));
        res.json({
            success: true,
            photos,
            count: photos.length,
            albumId: albumId || null
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching Google Photos:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch photos'
        });
    }
});
/**
 * Search photos by date range
 * POST /api/photos/search/date
 */
router.post('/search/date', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }
        const photos = await googlePhotosIntegration_1.googlePhotos.searchPhotosByDateRange(new Date(startDate), new Date(endDate));
        res.json({
            success: true,
            photos,
            count: photos.length,
            dateRange: { startDate, endDate }
        });
    }
    catch (error) {
        logger_1.logger.error('Error searching photos by date:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search photos'
        });
    }
});
/**
 * Import specific photos
 * POST /api/photos/import
 */
router.post('/import', async (req, res) => {
    try {
        const { photoIds, programId, outcomeId, storyId, autoAnalyze = true, tags = [] } = req.body;
        // TODO: Get userId from authentication when implemented
        const userId = 'demo-user';
        if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Photo IDs array is required'
            });
        }
        // Get photos from Google Photos
        const photos = [];
        for (const photoId of photoIds) {
            try {
                const photoInfo = await googlePhotosIntegration_1.googlePhotos.getPhotoSharingInfo(photoId);
                photos.push(photoInfo);
            }
            catch (error) {
                logger_1.logger.warn(`Failed to get photo info for ${photoId}:`, error);
            }
        }
        if (photos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No valid photos found'
            });
        }
        // Import photos
        const result = await googlePhotosIntegration_1.googlePhotos.importPhotos(photos, {
            programId,
            outcomeId,
            storyId,
            uploadedById: userId,
            autoAnalyze,
            tags: [...tags, 'google-photos-import']
        });
        res.json({
            success: true,
            message: `Successfully imported ${result.successful} of ${result.total} photos`,
            result
        });
    }
    catch (error) {
        logger_1.logger.error('Error importing Google Photos:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import photos'
        });
    }
});
/**
 * Batch import from album
 * POST /api/photos/import/album/:albumId
 */
router.post('/import/album/:albumId', async (req, res) => {
    try {
        const { albumId } = req.params;
        const { programId, outcomeId, batchSize = 5 } = req.body;
        // TODO: Get userId from authentication when implemented
        const userId = 'demo-user';
        // Set up real-time progress updates via WebSocket if available
        const io = req.app.get('socketio');
        const progressHandler = io ? (progress) => {
            io.emit('import-progress', {
                albumId,
                userId,
                progress
            });
        } : undefined;
        logger_1.logger.info(`🚀 Starting batch import from album ${albumId} for user ${userId}`);
        const result = await googlePhotosIntegration_1.googlePhotos.batchImportFromAlbum(albumId, {
            uploadedById: userId,
            programId,
            outcomeId,
            batchSize: parseInt(batchSize),
            onProgress: progressHandler
        });
        res.json({
            success: true,
            message: `Batch import completed: ${result.successful}/${result.totalPhotos} photos imported`,
            result
        });
    }
    catch (error) {
        logger_1.logger.error('Error in batch album import:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import album'
        });
    }
});
/**
 * Get import history and status
 * GET /api/photos/imports
 */
router.get('/imports/history', async (req, res) => {
    try {
        // TODO: Get userId from authentication when implemented
        const userId = 'demo-user';
        const { page = 1, limit = 20 } = req.query;
        const imports = await index_1.prisma.mediaItem.findMany({
            where: {
                uploadedById: userId,
                tags: {
                    has: 'google-photos'
                }
            },
            select: {
                id: true,
                title: true,
                filename: true,
                createdAt: true,
                cdnUrl: true,
                thumbnailUrl: true,
                culturalContext: true,
                aiDescription: true,
                tags: true,
                stories: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                outcomes: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });
        const totalCount = await index_1.prisma.mediaItem.count({
            where: {
                uploadedById: userId,
                tags: {
                    has: 'google-photos'
                }
            }
        });
        res.json({
            success: true,
            imports,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching import history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch import history'
        });
    }
});
exports.default = router;
//# sourceMappingURL=google-photos.js.map