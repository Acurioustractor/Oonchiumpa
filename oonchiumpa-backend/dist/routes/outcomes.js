"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all published outcomes
router.get('/', async (req, res, next) => {
    try {
        const { category, limit = '10', offset = '0' } = req.query;
        const outcomes = await index_1.prisma.outcome.findMany({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                ...(category && { category: category })
            },
            include: {
                metrics: true,
                mediaItems: true,
                authorUser: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { date: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        const total = await index_1.prisma.outcome.count({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                ...(category && { category: category })
            }
        });
        res.json({
            outcomes,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: total > (parseInt(offset) + outcomes.length)
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get outcome by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const outcome = await index_1.prisma.outcome.findFirst({
            where: {
                id,
                status: client_1.ContentStatus.PUBLISHED
            },
            include: {
                metrics: true,
                mediaItems: true,
                authorUser: {
                    select: { name: true, avatar: true }
                },
                extractionSource: {
                    select: { filename: true, uploadedAt: true }
                }
            }
        });
        if (!outcome) {
            return res.status(404).json({
                error: 'Outcome not found',
                message: 'The requested outcome could not be found or is not published'
            });
        }
        res.json(outcome);
    }
    catch (error) {
        next(error);
    }
});
// Get outcome categories
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await index_1.prisma.outcome.groupBy({
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
// Get impact statistics
router.get('/stats', async (req, res, next) => {
    try {
        const totalOutcomes = await index_1.prisma.outcome.count({
            where: { status: client_1.ContentStatus.PUBLISHED }
        });
        const totalBeneficiaries = await index_1.prisma.outcome.aggregate({
            where: { status: client_1.ContentStatus.PUBLISHED },
            _sum: { beneficiaries: true }
        });
        const outcomesByCategory = await index_1.prisma.outcome.groupBy({
            by: ['category'],
            where: { status: client_1.ContentStatus.PUBLISHED },
            _count: { category: true }
        });
        const locations = await index_1.prisma.outcome.findMany({
            where: {
                status: client_1.ContentStatus.PUBLISHED,
                location: { not: null }
            },
            select: { location: true },
            distinct: ['location']
        });
        res.json({
            totalOutcomes,
            totalBeneficiaries: totalBeneficiaries._sum.beneficiaries || 0,
            categoriesCount: outcomesByCategory.length,
            locationsCount: locations.length,
            outcomesByCategory: outcomesByCategory.map(cat => ({
                category: cat.category,
                count: cat._count.category
            }))
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=outcomes.js.map