import { Router } from 'express';
import { prisma } from '../index';
import { ContentStatus } from '@prisma/client';

const router = Router();

// Get all published stories
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = '10', offset = '0', search } = req.query;
    
    const stories = await prisma.story.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && { category: category as string }),
        ...(search && {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { content: { contains: search as string, mode: 'insensitive' } },
            { tags: { has: search as string } }
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
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.story.count({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && { category: category as string }),
        ...(search && {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { content: { contains: search as string, mode: 'insensitive' } },
            { tags: { has: search as string } }
          ]
        })
      }
    });

    res.json({
      stories,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: total > (parseInt(offset as string) + stories.length)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get story by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findFirst({
      where: {
        id,
        status: ContentStatus.PUBLISHED
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
  } catch (error) {
    next(error);
  }
});

// Get story categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.story.groupBy({
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

    const stories = await prisma.story.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && { category: category as string }),
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { content: { contains: q as string, mode: 'insensitive' } },
          { culturalSignificance: { contains: q as string, mode: 'insensitive' } },
          { tags: { has: q as string } }
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
  } catch (error) {
    next(error);
  }
});

export default router;