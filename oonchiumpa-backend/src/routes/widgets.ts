import { Router } from 'express';

const router = Router();

// Get widget data
router.get('/:id/data', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Mock widget data - will be implemented with real logic
    const mockData = {
      widgetId: id,
      type: 'stories-feed',
      lastUpdated: new Date().toISOString(),
      data: {
        stories: [],
        outcomes: [],
        media: []
      }
    };

    res.json(mockData);
  } catch (error) {
    next(error);
  }
});

export default router;