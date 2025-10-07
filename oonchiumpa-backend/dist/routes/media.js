"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get gallery photos
router.get('/gallery', async (req, res, next) => {
    try {
        const { limit = '20', offset = '0', tags } = req.query;
        const mediaItems = await index_1.prisma.mediaItem.findMany({
            where: {
                type: client_1.MediaType.IMAGE,
                ...(tags && {
                    tags: {
                        hasSome: tags.split(',')
                    }
                })
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        res.json(mediaItems.map(item => ({
            id: item.id,
            type: item.type,
            url: item.cdnUrl,
            thumbnail: item.thumbnailUrl,
            title: item.title,
            description: item.description,
            tags: item.tags,
            date: item.createdAt.toISOString()
        })));
    }
    catch (error) {
        next(error);
    }
});
// Get videos
router.get('/videos', async (req, res, next) => {
    try {
        const { limit = '10', offset = '0' } = req.query;
        const mediaItems = await index_1.prisma.mediaItem.findMany({
            where: {
                type: client_1.MediaType.VIDEO,
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        res.json(mediaItems.map(item => ({
            id: item.id,
            type: item.type,
            url: item.cdnUrl,
            thumbnail: item.thumbnailUrl,
            title: item.title,
            description: item.description,
            tags: item.tags,
            date: item.createdAt.toISOString()
        })));
    }
    catch (error) {
        next(error);
    }
});
// Get media by tags
router.get('/tags', async (req, res, next) => {
    try {
        const { tags } = req.query;
        if (!tags) {
            return res.status(400).json({
                error: 'Tags required',
                message: 'Please provide tags parameter'
            });
        }
        const mediaItems = await index_1.prisma.mediaItem.findMany({
            where: {
                tags: {
                    hasSome: tags.split(',')
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(mediaItems.map(item => ({
            id: item.id,
            type: item.type,
            url: item.cdnUrl,
            thumbnail: item.thumbnailUrl,
            title: item.title,
            description: item.description,
            tags: item.tags,
            date: item.createdAt.toISOString()
        })));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=media.js.map