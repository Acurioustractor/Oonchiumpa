import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all cultural advisors
router.get('/advisors', async (req, res, next) => {
  try {
    const advisors = await prisma.culturalAdvisor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            consultations: true,
            protocols: true
          }
        }
      }
    });

    res.json(advisors);
  } catch (error) {
    next(error);
  }
});

// Get specific advisor details
router.get('/advisors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const advisor = await prisma.culturalAdvisor.findUnique({
      where: { id },
      include: {
        consultations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            requestedBy: {
              select: { name: true, email: true }
            }
          }
        },
        protocols: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!advisor) {
      return res.status(404).json({
        error: 'Advisor not found',
        message: 'Cultural advisor not found'
      });
    }

    res.json(advisor);
  } catch (error) {
    next(error);
  }
});

// Request cultural consultation
router.post('/consultations', async (req, res, next) => {
  try {
    const {
      contentType,
      contentId,
      purpose,
      advisorId,
      priority = 'MEDIUM',
      requestedById
    } = req.body;

    // Validate required fields
    if (!contentType || !contentId || !purpose || !advisorId || !requestedById) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'contentType, contentId, purpose, advisorId, and requestedById are required'
      });
    }

    const consultation = await prisma.culturalConsultation.create({
      data: {
        contentType,
        contentId,
        purpose,
        priority,
        requestedById,
        advisorId,
      },
      include: {
        advisor: {
          select: { name: true, title: true, specialties: true }
        },
        requestedBy: {
          select: { name: true, email: true }
        }
      }
    });

    res.status(201).json(consultation);
  } catch (error) {
    next(error);
  }
});

// Get consultations (with filters)
router.get('/consultations', async (req, res, next) => {
  try {
    const { 
      status, 
      priority, 
      advisorId, 
      contentType,
      limit = '20',
      offset = '0' 
    } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (advisorId) where.advisorId = advisorId;
    if (contentType) where.contentType = contentType;

    const consultations = await prisma.culturalConsultation.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        advisor: {
          select: { name: true, title: true, specialties: true }
        },
        requestedBy: {
          select: { name: true, email: true }
        }
      }
    });

    const total = await prisma.culturalConsultation.count({ where });

    res.json({
      consultations,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: total > parseInt(offset as string) + parseInt(limit as string)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update consultation (Elder/Advisor use)
router.put('/consultations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status,
      notes,
      recommendations,
      culturalSensitivityRating,
      approvalStatus,
      followUpRequired,
      scheduledAt,
      completedAt
    } = req.body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (recommendations !== undefined) updateData.recommendations = recommendations;
    if (culturalSensitivityRating !== undefined) updateData.culturalSensitivityRating = culturalSensitivityRating;
    if (approvalStatus !== undefined) updateData.approvalStatus = approvalStatus;
    if (followUpRequired !== undefined) updateData.followUpRequired = followUpRequired;
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);
    if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);

    // Auto-complete when status is COMPLETED
    if (status === 'COMPLETED' && !completedAt) {
      updateData.completedAt = new Date();
    }

    const consultation = await prisma.culturalConsultation.update({
      where: { id },
      data: updateData,
      include: {
        advisor: {
          select: { name: true, title: true, specialties: true }
        },
        requestedBy: {
          select: { name: true, email: true }
        }
      }
    });

    res.json(consultation);
  } catch (error) {
    next(error);
  }
});

// Create Dreaming story protocol
router.post('/protocols', async (req, res, next) => {
  try {
    const {
      storyTitle,
      storyType,
      traditionalOwners,
      geographicOrigin,
      seasonalRestrictions = [],
      genderRestrictions,
      ageRestrictions,
      ceremonialContext,
      sharingPermissions,
      consultationRequired = true,
      advisorId,
      validatedAt,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!storyTitle || !storyType || !sharingPermissions || !advisorId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'storyTitle, storyType, sharingPermissions, and advisorId are required'
      });
    }

    const protocol = await prisma.dreamingStoryProtocol.create({
      data: {
        storyTitle,
        storyType,
        traditionalOwners: traditionalOwners || [],
        geographicOrigin,
        seasonalRestrictions,
        genderRestrictions,
        ageRestrictions,
        ceremonialContext,
        sharingPermissions,
        consultationRequired,
        advisorId,
        validatedAt: validatedAt ? new Date(validatedAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        advisor: {
          select: { name: true, title: true }
        }
      }
    });

    res.status(201).json(protocol);
  } catch (error) {
    next(error);
  }
});

// Get protocols for stories
router.get('/protocols', async (req, res, next) => {
  try {
    const { storyTitle, storyType, advisorId } = req.query;

    const where: any = {};
    if (storyTitle) where.storyTitle = { contains: storyTitle as string, mode: 'insensitive' };
    if (storyType) where.storyType = storyType;
    if (advisorId) where.advisorId = advisorId;

    const protocols = await prisma.dreamingStoryProtocol.findMany({
      where,
      orderBy: { validatedAt: 'desc' },
      include: {
        advisor: {
          select: { name: true, title: true }
        }
      }
    });

    res.json(protocols);
  } catch (error) {
    next(error);
  }
});

// Check if content needs cultural consultation
router.get('/check-consultation/:contentType/:contentId', async (req, res, next) => {
  try {
    const { contentType, contentId } = req.params;
    
    // Check for existing consultations
    const existingConsultation = await prisma.culturalConsultation.findFirst({
      where: {
        contentType,
        contentId,
        status: { in: ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS'] }
      },
      include: {
        advisor: { select: { name: true } }
      }
    });

    if (existingConsultation) {
      return res.json({
        requiresConsultation: true,
        status: 'IN_PROGRESS',
        consultation: existingConsultation
      });
    }

    // Check for completed consultations and protocols
    const completedConsultation = await prisma.culturalConsultation.findFirst({
      where: {
        contentType,
        contentId,
        status: 'COMPLETED',
        approvalStatus: 'APPROVED'
      },
      orderBy: { completedAt: 'desc' }
    });

    if (completedConsultation) {
      return res.json({
        requiresConsultation: false,
        status: 'APPROVED',
        consultation: completedConsultation
      });
    }

    // For Dreaming stories, check if there are protocols
    if (contentType === 'story') {
      const story = await prisma.story.findUnique({
        where: { id: contentId },
        select: { title: true, category: true }
      });

      if (story && story.category?.toLowerCase().includes('dreaming')) {
        const protocol = await prisma.dreamingStoryProtocol.findFirst({
          where: { storyTitle: story.title }
        });

        if (!protocol) {
          return res.json({
            requiresConsultation: true,
            status: 'REQUIRES_PROTOCOL',
            reason: 'Dreaming story requires cultural protocol validation'
          });
        }
      }
    }

    res.json({
      requiresConsultation: false,
      status: 'CLEARED'
    });
  } catch (error) {
    next(error);
  }
});

export default router;