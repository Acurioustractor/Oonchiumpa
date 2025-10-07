"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCulturalConsultation = exports.culturalValidationMiddleware = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Middleware to check if content requires cultural consultation
 * and validate cultural appropriateness before publishing
 */
const culturalValidationMiddleware = async (req, res, next) => {
    try {
        const { body, params } = req;
        const contentType = req.route?.path?.includes('stories') ? 'story' :
            req.route?.path?.includes('outcomes') ? 'outcome' :
                req.route?.path?.includes('media') ? 'media' : 'unknown';
        // Skip validation for non-publishing actions
        if (req.method !== 'POST' && req.method !== 'PUT') {
            return next();
        }
        // Skip if not publishing or if status is not being changed to published
        if (body.status !== 'PUBLISHED' && body.status !== 'APPROVED') {
            return next();
        }
        const contentId = params.id || body.id || `${Date.now()}-${contentType}`;
        // Check for cultural keywords that require consultation
        const culturalKeywords = [
            'dreaming', 'dreamtime', 'sacred', 'ceremony', 'traditional',
            'elders', 'elder', 'songlines', 'rainbow serpent', 'ancestor',
            'spiritual', 'totem', 'mob', 'country', 'sorry business',
            'men\'s business', 'women\'s business', 'initiation', 'smoking ceremony'
        ];
        let requiresConsultation = false;
        let sensitiveContent = [];
        // Check content for cultural keywords
        const textToCheck = [
            body.title,
            body.content,
            body.description,
            body.culturalSignificance,
            ...(body.tags || [])
        ].join(' ').toLowerCase();
        culturalKeywords.forEach(keyword => {
            if (textToCheck.includes(keyword)) {
                requiresConsultation = true;
                sensitiveContent.push(keyword);
            }
        });
        // Check if content already has consultation
        if (requiresConsultation) {
            const existingConsultation = await prisma.culturalConsultation.findFirst({
                where: {
                    contentType,
                    contentId,
                    approvalStatus: 'APPROVED',
                    status: 'COMPLETED'
                },
                include: {
                    advisor: { select: { name: true, title: true } }
                }
            });
            if (!existingConsultation) {
                // Check for pending consultation
                const pendingConsultation = await prisma.culturalConsultation.findFirst({
                    where: {
                        contentType,
                        contentId,
                        status: { in: ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS'] }
                    },
                    include: {
                        advisor: { select: { name: true, title: true } }
                    }
                });
                if (pendingConsultation) {
                    return res.status(400).json({
                        error: 'Cultural consultation in progress',
                        message: `This ${contentType} is currently under cultural consultation with ${pendingConsultation.advisor.name}. Please wait for approval before publishing.`,
                        consultationId: pendingConsultation.id,
                        advisorName: pendingConsultation.advisor.name,
                        status: pendingConsultation.status
                    });
                }
                // Find appropriate advisor based on content type
                const advisors = await prisma.culturalAdvisor.findMany({
                    where: { isActive: true },
                    orderBy: { name: 'asc' }
                });
                let recommendedAdvisor = advisors[0]; // Default to first active advisor
                // Recommend specific advisor based on content
                if (sensitiveContent.some(content => ['women\'s business', 'healing', 'ceremony'].some(keyword => content.includes(keyword)))) {
                    recommendedAdvisor = advisors.find(advisor => advisor.specialties.includes('Women\'s Business') ||
                        advisor.specialties.includes('Traditional Healing')) || recommendedAdvisor;
                }
                else if (sensitiveContent.some(content => ['dreaming', 'dreamtime', 'ancestor'].some(keyword => content.includes(keyword)))) {
                    recommendedAdvisor = advisors.find(advisor => advisor.specialties.includes('Dreamtime Stories')) || recommendedAdvisor;
                }
                return res.status(400).json({
                    error: 'Cultural consultation required',
                    message: `This ${contentType} contains culturally sensitive content and requires Elder consultation before publishing.`,
                    sensitiveContent,
                    requiresConsultation: true,
                    recommendedAdvisor: {
                        id: recommendedAdvisor.id,
                        name: recommendedAdvisor.name,
                        title: recommendedAdvisor.title,
                        specialties: recommendedAdvisor.specialties
                    },
                    suggestedAction: {
                        endpoint: '/api/cultural-advisory/consultations',
                        method: 'POST',
                        payload: {
                            contentType,
                            contentId,
                            purpose: `Cultural validation for ${contentType} containing: ${sensitiveContent.join(', ')}`,
                            advisorId: recommendedAdvisor.id,
                            priority: sensitiveContent.includes('sacred') || sensitiveContent.includes('ceremony') ? 'HIGH' : 'MEDIUM'
                        }
                    }
                });
            }
            // Attach consultation info to request for use by route handlers
            req.culturalValidation = {
                requiresConsultation: true,
                consultationStatus: 'APPROVED',
                advisorRecommendations: existingConsultation.recommendations ? [existingConsultation.recommendations] : [],
                restrictions: []
            };
        }
        else {
            req.culturalValidation = {
                requiresConsultation: false,
                consultationStatus: 'NOT_REQUIRED'
            };
        }
        next();
    }
    catch (error) {
        console.error('Cultural validation middleware error:', error);
        // Don't block the request if validation fails, but log the error
        next();
    }
};
exports.culturalValidationMiddleware = culturalValidationMiddleware;
/**
 * Helper function to automatically create consultation request
 */
const requestCulturalConsultation = async (contentType, contentId, purpose, requestedById, priority = 'MEDIUM') => {
    try {
        // Find appropriate advisor
        const advisor = await prisma.culturalAdvisor.findFirst({
            where: {
                isActive: true,
                specialties: {
                    hasSome: contentType === 'story' ? ['Dreamtime Stories'] : ['Cultural Protocols']
                }
            }
        });
        if (!advisor) {
            // Fallback to any active advisor
            const anyAdvisor = await prisma.culturalAdvisor.findFirst({
                where: { isActive: true }
            });
            if (!anyAdvisor) {
                throw new Error('No active cultural advisors available');
            }
            return await prisma.culturalConsultation.create({
                data: {
                    contentType,
                    contentId,
                    purpose,
                    priority,
                    requestedById,
                    advisorId: anyAdvisor.id
                }
            });
        }
        return await prisma.culturalConsultation.create({
            data: {
                contentType,
                contentId,
                purpose,
                priority,
                requestedById,
                advisorId: advisor.id
            }
        });
    }
    catch (error) {
        console.error('Error requesting cultural consultation:', error);
        throw error;
    }
};
exports.requestCulturalConsultation = requestCulturalConsultation;
exports.default = exports.culturalValidationMiddleware;
//# sourceMappingURL=culturalValidation.js.map