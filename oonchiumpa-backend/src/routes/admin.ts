import { Router } from 'express';

const router = Router();

// Admin dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    // Mock stats - will be implemented with real data
    const stats = {
      totalStories: 0,
      totalOutcomes: 0,
      totalMediaItems: 0,
      pendingApprovals: 0,
      totalUsers: 0,
      recentActivity: []
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;