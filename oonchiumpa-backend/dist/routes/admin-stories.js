"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const culturalValidation_1 = require("../middleware/culturalValidation");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all stories (including drafts) - Admin only
router.get('/', async (req, res, next) => {
    try {
        const { status, category, limit = '20', offset = '0' } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        const stories = await prisma.story.findMany({
            where,
            include: {
                mediaItems: true,
                authorUser: {
                    select: { name: true, email: true, avatar: true }
                },
                approvals: {
                    include: {
                        approver: { select: { name: true, role: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                extractionSource: {
                    select: { filename: true, uploadedAt: true }
                }
            },
            orderBy: [
                { status: 'asc' },
                { createdAt: 'desc' }
            ],
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        const total = await prisma.story.count({ where });
        res.json({
            stories,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: total > parseInt(offset) + stories.length
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Create new story
router.post('/', culturalValidation_1.culturalValidationMiddleware, async (req, res, next) => {
    try {
        const { title, subtitle, content, author, category, culturalSignificance, tags = [], status = 'DRAFT', sensitivityLevel = 'COMMUNITY', authorUserId } = req.body;
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Title and content are required'
            });
        }
        const story = await prisma.story.create({
            data: {
                title,
                subtitle,
                content,
                author,
                category,
                culturalSignificance,
                tags,
                status,
                sensitivityLevel,
                authorUserId,
                ...(status === 'PUBLISHED' && { publishedAt: new Date() })
            },
            include: {
                authorUser: {
                    select: { name: true, email: true }
                }
            }
        });
        res.status(201).json({
            story,
            culturalValidation: req.culturalValidation
        });
    }
    catch (error) {
        next(error);
    }
});
// Update story
router.put('/:id', culturalValidation_1.culturalValidationMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        // Handle publishing
        if (updateData.status === 'PUBLISHED' && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const story = await prisma.story.update({
            where: { id },
            data: updateData,
            include: {
                authorUser: {
                    select: { name: true, email: true }
                },
                approvals: {
                    include: {
                        approver: { select: { name: true, role: true } }
                    }
                }
            }
        });
        res.json({
            story,
            culturalValidation: req.culturalValidation
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete story
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if story has cultural consultations
        const consultations = await prisma.culturalConsultation.findMany({
            where: { contentType: 'story', contentId: id }
        });
        if (consultations.length > 0) {
            // Archive rather than delete if there are cultural consultations
            await prisma.story.update({
                where: { id },
                data: { status: 'ARCHIVED' }
            });
            return res.json({
                message: 'Story archived due to existing cultural consultations',
                consultations: consultations.length
            });
        }
        await prisma.story.delete({
            where: { id }
        });
        res.json({ message: 'Story deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
// Request cultural consultation for story
router.post('/:id/request-consultation', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { purpose, advisorId, priority = 'MEDIUM', requestedById } = req.body;
        if (!purpose || !advisorId || !requestedById) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'purpose, advisorId, and requestedById are required'
            });
        }
        // Check if story exists
        const story = await prisma.story.findUnique({
            where: { id },
            select: { title: true, category: true }
        });
        if (!story) {
            return res.status(404).json({
                error: 'Story not found',
                message: 'The requested story could not be found'
            });
        }
        // Check for existing consultation
        const existingConsultation = await prisma.culturalConsultation.findFirst({
            where: {
                contentType: 'story',
                contentId: id,
                status: { in: ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS'] }
            }
        });
        if (existingConsultation) {
            return res.status(400).json({
                error: 'Consultation already exists',
                message: 'There is already an active consultation for this story',
                consultationId: existingConsultation.id
            });
        }
        const consultation = await prisma.culturalConsultation.create({
            data: {
                contentType: 'story',
                contentId: id,
                purpose,
                priority,
                requestedById,
                advisorId
            },
            include: {
                advisor: {
                    select: { name: true, title: true, specialties: true }
                }
            }
        });
        res.status(201).json(consultation);
    }
    catch (error) {
        next(error);
    }
});
// Get cultural consultation status for story
router.get('/:id/cultural-status', async (req, res, next) => {
    try {
        const { id } = req.params;
        const consultations = await prisma.culturalConsultation.findMany({
            where: {
                contentType: 'story',
                contentId: id
            },
            include: {
                advisor: {
                    select: { name: true, title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const protocols = await prisma.story.findUnique({
            where: { id },
            select: { title: true, category: true }
        }).then(async (story) => {
            if (!story)
                return [];
            return await prisma.dreamingStoryProtocol.findMany({
                where: {
                    storyTitle: { contains: story.title, mode: 'insensitive' }
                },
                include: {
                    advisor: { select: { name: true, title: true } }
                }
            });
        });
        const latestConsultation = consultations[0];
        let status = 'NO_CONSULTATION';
        let requiresConsultation = false;
        if (latestConsultation) {
            status = latestConsultation.status;
            if (latestConsultation.status === 'COMPLETED' && latestConsultation.approvalStatus === 'APPROVED') {
                status = 'CULTURALLY_APPROVED';
            }
            else if (latestConsultation.status === 'COMPLETED' && latestConsultation.approvalStatus === 'REJECTED') {
                status = 'CULTURALLY_REJECTED';
            }
        }
        // Check if story content suggests it needs consultation
        const story = await prisma.story.findUnique({
            where: { id },
            select: { title: true, content: true, tags: true, category: true }
        });
        if (story) {
            const culturalKeywords = ['dreaming', 'dreamtime', 'sacred', 'ceremony', 'traditional'];
            const textToCheck = [story.title, story.content, story.category, ...(story.tags || [])].join(' ').toLowerCase();
            requiresConsultation = culturalKeywords.some(keyword => textToCheck.includes(keyword));
        }
        res.json({
            storyId: id,
            culturalStatus: status,
            requiresConsultation,
            consultations,
            protocols,
            summary: {
                totalConsultations: consultations.length,
                approvedConsultations: consultations.filter(c => c.approvalStatus === 'APPROVED').length,
                activeProtocols: protocols.length
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin-stories.js.map