import { Router } from 'express';
import { prisma } from '../index';
import { ContentStatus } from '@prisma/client';

const router = Router();

// Get all published outcomes
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = '10', offset = '0' } = req.query;
    
    const outcomes = await prisma.outcome.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && { category: category as string })
      },
      include: {
        metrics: true,
        mediaItems: true,
        authorUser: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.outcome.count({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && { category: category as string })
      }
    });

    res.json({
      outcomes,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: total > (parseInt(offset as string) + outcomes.length)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get outcome by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const outcome = await prisma.outcome.findFirst({
      where: {
        id,
        status: ContentStatus.PUBLISHED
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
  } catch (error) {
    next(error);
  }
});

// Get outcome categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.outcome.groupBy({
      by: ['category'],
      where: {
        status: ContentStatus.PUBLISHED
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
  } catch (error) {
    next(error);
  }
});

// Get impact statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalOutcomes = await prisma.outcome.count({
      where: { status: ContentStatus.PUBLISHED }
    });

    const totalBeneficiaries = await prisma.outcome.aggregate({
      where: { status: ContentStatus.PUBLISHED },
      _sum: { beneficiaries: true }
    });

    const outcomesByCategory = await prisma.outcome.groupBy({
      by: ['category'],
      where: { status: ContentStatus.PUBLISHED },
      _count: { category: true }
    });

    const locations = await prisma.outcome.findMany({
      where: { 
        status: ContentStatus.PUBLISHED,
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
  } catch (error) {
    next(error);
  }
});

export default router;