import { Router } from 'express';
import { prisma } from '../index';
import { MediaType } from '@prisma/client';

const router = Router();

// Get gallery photos
router.get('/gallery', async (req, res, next) => {
  try {
    const { limit = '20', offset = '0', tags } = req.query;
    
    const mediaItems = await prisma.mediaItem.findMany({
      where: {
        type: MediaType.IMAGE,
        ...(tags && { 
          tags: { 
            hasSome: (tags as string).split(',') 
          }
        })
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
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
  } catch (error) {
    next(error);
  }
});

// Get videos
router.get('/videos', async (req, res, next) => {
  try {
    const { limit = '10', offset = '0' } = req.query;
    
    const mediaItems = await prisma.mediaItem.findMany({
      where: {
        type: MediaType.VIDEO,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
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
  } catch (error) {
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

    const mediaItems = await prisma.mediaItem.findMany({
      where: {
        tags: { 
          hasSome: (tags as string).split(',') 
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
  } catch (error) {
    next(error);
  }
});

export default router;