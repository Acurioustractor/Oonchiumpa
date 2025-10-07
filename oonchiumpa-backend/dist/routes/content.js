"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
/**
 * Get all published blog posts (public endpoint)
 * GET /api/content/blog-posts
 */
router.get('/blog-posts', auth_1.optionalAuth, async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;
        const where = {
            status: 'PUBLISHED',
            ...(category && category !== 'all' ? { category: category } : {})
        };
        const [posts, total] = await Promise.all([
            prisma.generatedContent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    author: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            }),
            prisma.generatedContent.count({ where })
        ]);
        // Transform to blog post format
        const blogPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author?.name || 'Editorial Team',
            publishedAt: post.createdAt,
            tags: post.metaData?.keyThemes || [],
            type: post.type.toLowerCase().replace('_', '-'),
            readTime: Math.ceil(post.content.length / 1000), // Rough estimate
            heroImage: post.metaData?.recommendedImages?.[0] || null,
            gallery: post.metaData?.recommendedImages || [],
            curatedBy: 'Oonchiumpa Editorial Team',
            culturalReview: 'Elder Approved'
        }));
        res.json({
            success: true,
            posts: blogPosts,
            total,
            page: Math.floor(Number(offset) / Number(limit)) + 1,
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching blog posts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch blog posts'
        });
    }
});
/**
 * Get single blog post by ID (public endpoint)
 * GET /api/content/blog-posts/:id
 */
router.get('/blog-posts/:id', auth_1.optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.generatedContent.findFirst({
            where: {
                id,
                status: 'PUBLISHED'
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Blog post not found'
            });
        }
        // Transform to blog post format
        const blogPost = {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author?.name || 'Editorial Team',
            publishedAt: post.createdAt,
            tags: post.metaData?.keyThemes || [],
            type: post.type.toLowerCase().replace('_', '-'),
            readTime: Math.ceil(post.content.length / 1000),
            heroImage: post.metaData?.recommendedImages?.[0] || null,
            gallery: post.metaData?.recommendedImages || [],
            curatedBy: 'Oonchiumpa Editorial Team',
            culturalReview: 'Elder Approved',
            seoData: post.seoData,
            metaData: post.metaData
        };
        res.json({
            success: true,
            post: blogPost
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching blog post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch blog post'
        });
    }
});
/**
 * Create new blog post (staff only)
 * POST /api/content/blog-posts
 */
router.post('/blog-posts', auth_1.authenticateToken, (0, auth_1.requirePermission)('content.generate'), async (req, res) => {
    try {
        const { title, excerpt, content, type, tags, heroImage, gallery } = req.body;
        const post = await prisma.generatedContent.create({
            data: {
                title,
                excerpt,
                content,
                type: type.toUpperCase().replace('-', '_'),
                status: 'DRAFT',
                metaData: {
                    keyThemes: tags || [],
                    recommendedImages: gallery || (heroImage ? [heroImage] : []),
                    culturalConsiderations: [],
                    wordCount: content.length
                },
                seoData: {
                    keywords: tags || [],
                    metaDescription: excerpt
                },
                authorUserId: req.user?.id
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });
        logger_1.logger.info(`📝 Blog post created: ${title} by ${req.user?.email}`);
        res.json({
            success: true,
            post: {
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author?.name || 'Editorial Team',
                publishedAt: post.createdAt,
                tags: post.metaData?.keyThemes || [],
                type: post.type.toLowerCase().replace('_', '-'),
                readTime: Math.ceil(post.content.length / 1000),
                heroImage: post.metaData?.recommendedImages?.[0] || null,
                gallery: post.metaData?.recommendedImages || [],
                status: post.status
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error creating blog post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create blog post'
        });
    }
});
/**
 * Update blog post (staff only)
 * PUT /api/content/blog-posts/:id
 */
router.put('/blog-posts/:id', auth_1.authenticateToken, (0, auth_1.requirePermission)('content.generate'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, type, tags, heroImage, gallery, status } = req.body;
        const post = await prisma.generatedContent.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(excerpt && { excerpt }),
                ...(content && { content }),
                ...(type && { type: type.toUpperCase().replace('-', '_') }),
                ...(status && { status }),
                ...(tags || heroImage || gallery) && {
                    metaData: {
                        keyThemes: tags || [],
                        recommendedImages: gallery || (heroImage ? [heroImage] : []),
                        culturalConsiderations: [],
                        wordCount: content?.length || 0
                    }
                },
                ...(tags && {
                    seoData: {
                        keywords: tags,
                        metaDescription: excerpt
                    }
                })
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });
        logger_1.logger.info(`📝 Blog post updated: ${post.title} by ${req.user?.email}`);
        res.json({
            success: true,
            post: {
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author?.name || 'Editorial Team',
                publishedAt: post.createdAt,
                tags: post.metaData?.keyThemes || [],
                type: post.type.toLowerCase().replace('_', '-'),
                readTime: Math.ceil(post.content.length / 1000),
                heroImage: post.metaData?.recommendedImages?.[0] || null,
                gallery: post.metaData?.recommendedImages || [],
                status: post.status
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating blog post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update blog post'
        });
    }
});
/**
 * Get staff content queue (staff only)
 * GET /api/content/queue
 */
router.get('/queue', auth_1.authenticateToken, (0, auth_1.requirePermission)('content.generate'), async (req, res) => {
    try {
        const [drafts, inReview, culturalReview] = await Promise.all([
            prisma.generatedContent.findMany({
                where: { status: 'DRAFT' },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, name: true }
                    }
                }
            }),
            prisma.generatedContent.findMany({
                where: { status: 'PENDING_APPROVAL' },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, name: true }
                    }
                }
            }),
            prisma.generatedContent.findMany({
                where: { status: 'APPROVED' },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, name: true }
                    }
                }
            })
        ]);
        const queue = [...drafts, ...inReview, ...culturalReview].map(item => ({
            id: item.id,
            title: item.title,
            author: item.author?.name || 'Editorial Team',
            status: item.status.toLowerCase().replace('_', '-'),
            createdAt: item.createdAt,
            type: item.type.toLowerCase().replace('_', '-')
        }));
        res.json({
            success: true,
            queue,
            stats: {
                drafts: drafts.length,
                inReview: inReview.length,
                culturalReview: culturalReview.length,
                total: queue.length
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching content queue:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch content queue'
        });
    }
});
/**
 * Get staff dashboard stats (staff only)
 * GET /api/content/dashboard-stats
 */
router.get('/dashboard-stats', auth_1.authenticateToken, (0, auth_1.requirePermission)('content.generate'), async (req, res) => {
    try {
        const [totalContent, publishedThisMonth, pendingReview, culturalReview] = await Promise.all([
            prisma.generatedContent.count(),
            prisma.generatedContent.count({
                where: {
                    status: 'PUBLISHED',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.generatedContent.count({
                where: { status: 'PENDING_APPROVAL' }
            }),
            prisma.generatedContent.count({
                where: { status: 'APPROVED' }
            })
        ]);
        res.json({
            success: true,
            stats: {
                documentsPending: 0, // Will be updated when document processing is implemented
                storiesInReview: pendingReview + culturalReview,
                publishedThisMonth,
                totalContent
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard stats'
        });
    }
});
exports.default = router;
//# sourceMappingURL=content.js.map