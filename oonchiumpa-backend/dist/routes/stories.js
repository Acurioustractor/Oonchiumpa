"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all published stories
router.get('/', async (req, res, next) => {
    try {
        const { category, limit = '10', offset = '0', search } = req.query;
        const stories = await index_1.prisma.story.findMany({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                ...(category && { category: category }),
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                        { tags: { has: search } }
                    ]
                })
            },
            include: {
                mediaItems: true,
                authorUser: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { publishedAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        const total = await index_1.prisma.story.count({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                ...(category && { category: category }),
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                        { tags: { has: search } }
                    ]
                })
            }
        });
        res.json({
            stories,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: total > (parseInt(offset) + stories.length)
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get story by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const story = await index_1.prisma.story.findFirst({
            where: {
                id,
                status: client_1.ContentStatus.PUBLISHED
            },
            include: {
                mediaItems: true,
                authorUser: {
                    select: { name: true, avatar: true }
                },
                extractionSource: {
                    select: { filename: true, uploadedAt: true }
                }
            }
        });
        if (!story) {
            return res.status(404).json({
                error: 'Story not found',
                message: 'The requested story could not be found or is not published'
            });
        }
        res.json(story);
    }
    catch (error) {
        next(error);
    }
});
// Get story categories
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await index_1.prisma.story.groupBy({
            by: ['category'],
            where: {
                status: client_1.ContentStatus.PUBLISHED
            },
            _count: {
                category: true
            },
            orderBy: {
                _count: {
                    category: 'desc'
                }
            }
        });
        res.json(categories.map(cat => ({
            name: cat.category,
            count: cat._count.category
        })));
    }
    catch (error) {
        next(error);
    }
});
// Search stories
router.get('/search', async (req, res, next) => {
    try {
        const { q, category } = req.query;
        if (!q) {
            return res.status(400).json({
                error: 'Search query required',
                message: 'Please provide a search query'
            });
        }
        const stories = await index_1.prisma.story.findMany({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                ...(category && { category: category }),
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { content: { contains: q, mode: 'insensitive' } },
                    { culturalSignificance: { contains: q, mode: 'insensitive' } },
                    { tags: { has: q } }
                ]
            },
            include: {
                mediaItems: true,
                authorUser: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { publishedAt: 'desc' },
            take: 20,
        });
        res.json({
            query: q,
            results: stories,
            count: stories.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=stories.js.map