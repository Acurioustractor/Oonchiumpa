import { Router } from 'express';

const router = Router();

// Mock dashboard data that matches the real NIAA report metrics
const dashboardData = {
  keyMetrics: [
    {
      id: '1',
      title: 'Active Clients',
      value: 30,
      change: '+57%',
      changeType: 'positive',
      description: 'Increased from 19 clients in Dec 2023',
      category: 'clients',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Meaningful Contacts',
      value: 2464,
      change: '+23%',
      changeType: 'positive', 
      description: 'Individual engagements in 6 months',
      category: 'engagement',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Cost Effectiveness',
      value: 97.6,
      suffix: '%',
      change: 'vs incarceration',
      changeType: 'positive',
      description: '$91/day vs $3,852/day incarceration',
      category: 'financial',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Engagement Rate',
      value: 91,
      suffix: '%',
      change: '87-95% range',
      changeType: 'positive',
      description: 'Exceptional retention with cultural support',
      category: 'engagement',
      lastUpdated: new Date().toISOString()
    }
  ],
  recentOutcomes: [
    {
      title: 'School Re-engagement Program',
      impact: '72% success rate',
      description: 'Young people returning to education',
      status: 'active',
      horizon: 1,
      date: '2024-08-01'
    },
    {
      title: 'Operation Luna Reduction', 
      impact: '95% reduction',
      description: 'Dramatic decrease in police interactions',
      status: 'active',
      horizon: 1,
      date: '2024-07-15'
    },
    {
      title: 'Digital Content Platform',
      impact: 'Launch phase',
      description: 'AI-powered storytelling system',
      status: 'emerging',
      horizon: 2,
      date: '2024-08-20'
    },
    {
      title: 'Cultural Campus Vision',
      impact: 'Planning phase',
      description: 'Integrated community hub development', 
      status: 'future',
      horizon: 3,
      date: '2024-12-01'
    }
  ],
  summary: {
    totalClients: 30,
    totalContacts: 2464,
    costEffectiveness: 97.6,
    engagementRate: 91
  }
};

// GET /dashboard/metrics - Get all dashboard metrics and outcomes
router.get('/metrics', async (req, res) => {
  try {
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /dashboard/metrics/category/:category - Get metrics by category
router.get('/metrics/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const filteredMetrics = dashboardData.keyMetrics.filter(
      metric => metric.category === category
    );
    
    res.json(filteredMetrics);
  } catch (error) {
    console.error('Dashboard metrics by category error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch metrics by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /dashboard/summary - Get dashboard summary statistics
router.get('/summary', async (req, res) => {
  try {
    res.json(dashboardData.summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /dashboard/real-time - Get real-time metrics (simulated)
router.get('/real-time', async (req, res) => {
  try {
    // Simulate some real-time changes
    const realTimeData = {
      ...dashboardData.summary,
      timestamp: new Date().toISOString(),
      activeUsers: Math.floor(Math.random() * 10) + 5, // 5-15 active users
      systemHealth: Math.random() > 0.1 ? 'healthy' : 'warning', // 90% healthy
      lastUpdate: Date.now()
    };
    
    res.json(realTimeData);
  } catch (error) {
    console.error('Real-time dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch real-time data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;