/**
 * Impact Metrics Data Models
 * Based on Oonchiumpa evaluation report data
 */

import { z } from 'zod';

// Enum definitions for metrics
export const MetricCategory = z.enum([
  'education',
  'safety', 
  'cultural',
  'employment',
  'wellbeing',
  'housing',
  'justice'
]);

export const MetricUnit = z.enum([
  'percentage',
  'count',
  'days',
  'hours',
  'currency',
  'ratio',
  'score'
]);

export const TrendDirection = z.enum([
  'improving',
  'stable', 
  'declining'
]);

// Core impact metric schema
export const ImpactMetricSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  key: z.string().regex(/^[a-z_]+$/, 'Key must be lowercase with underscores'),
  value: z.number(),
  unit: MetricUnit,
  category: MetricCategory,
  subcategory: z.string().optional(),
  
  // Time period for this metric
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
  }),

  // Target and achievement
  target: z.object({
    value: z.number(),
    description: z.string(),
    achievedPercentage: z.number().min(0)
  }).optional(),

  // Data source information
  source: z.object({
    type: z.enum(['evaluation', 'survey', 'administrative', 'observation']),
    document: z.string(),
    collector: z.string(),
    methodology: z.string().optional()
  }),

  // Participant demographics
  participants: z.object({
    total: z.number().int().min(0),
    demographic: z.object({
      age: z.object({
        under18: z.number().int().min(0),
        '18to25': z.number().int().min(0),
        over25: z.number().int().min(0)
      }).optional(),
      gender: z.object({
        male: z.number().int().min(0),
        female: z.number().int().min(0),
        nonBinary: z.number().int().min(0),
        notSpecified: z.number().int().min(0)
      }).optional(),
      community: z.array(z.string()).optional()
    }).optional()
  }).optional(),

  // Statistical significance
  significance: z.object({
    statistical: z.number().min(0).max(1).optional(), // p-value
    practical: z.string().optional(),
    cultural: z.string().optional()
  }).optional(),

  // Trend analysis
  trends: z.object({
    direction: TrendDirection,
    rate: z.number().optional(),
    historical: z.array(z.object({
      date: z.string().datetime(),
      value: z.number()
    })).optional()
  }).optional(),

  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  verifiedBy: z.string().optional(),
  verificationDate: z.string().datetime().optional()
});

// Specific metrics based on Oonchiumpa evaluation report
export const OonchiumpaMetricsSchema = z.object({
  // Education outcomes
  schoolReengagement: z.object({
    percentage: z.number().min(0).max(100), // 72% from evaluation
    totalParticipants: z.number().int(),
    returnedToSchool: z.number().int(),
    alternativeEducation: z.number().int()
  }),

  // Safety and justice outcomes  
  operationLunaReduction: z.object({
    percentage: z.number().min(0).max(100), // 95% from evaluation
    beforeCount: z.number().int(),
    afterCount: z.number().int(),
    participants: z.number().int() // 18 of 19 youth
  }),

  // Service delivery metrics
  serviceReferrals: z.object({
    total: z.number().int(),
    byGender: z.object({
      female: z.number().int(), // 32 from evaluation
      male: z.number().int()    // 39 from evaluation
    }),
    byType: z.record(z.string(), z.number().int())
  }),

  // Wellbeing assessments
  wellbeingScores: z.object({
    happiness: z.object({
      before: z.number().min(1).max(10),
      after: z.number().min(1).max(10),
      improvement: z.number()
    }),
    safety: z.object({
      before: z.number().min(1).max(10),
      after: z.number().min(1).max(10),
      improvement: z.number()
    }),
    needs: z.object({
      before: z.number().min(1).max(10),
      after: z.number().min(1).max(10),
      improvement: z.number()
    })
  }),

  // Cultural engagement
  culturalParticipation: z.object({
    onCountryTrips: z.number().int(),
    culturalActivities: z.number().int(),
    elderEngagement: z.number().int(),
    culturalKnowledgeTransfer: z.number().int()
  }),

  // Program reach
  programReach: z.object({
    totalYouthServed: z.number().int(),
    newParticipants: z.number().int(),
    retentionRate: z.number().min(0).max(100),
    averageEngagementDuration: z.number() // in days
  })
});

// Dashboard visualization configuration
export const MetricVisualizationSchema = z.object({
  metricId: z.string().uuid(),
  chartType: z.enum(['bar', 'line', 'pie', 'counter', 'progress', 'map', 'gauge']),
  displayFormat: z.string(),
  colorScheme: z.enum(['cultural', 'earth', 'ocean', 'fire', 'accessible']),
  culturalContext: z.string().optional(),
  animationStyle: z.enum(['none', 'fade', 'slide', 'count-up', 'progress']),
  refreshInterval: z.number().int().min(0).optional() // seconds, 0 = no auto-refresh
});

// Three Horizons model for strategic planning
export const ThreeHorizonsSchema = z.object({
  horizon1: z.object({
    title: z.literal('Core Programs'),
    description: z.string(),
    timeframe: z.literal('0-1 years'),
    programs: z.array(z.object({
      name: z.string(),
      status: z.enum(['active', 'planned', 'completed']),
      metrics: z.array(z.string().uuid()),
      outcomes: z.array(z.string())
    }))
  }),
  
  horizon2: z.object({
    title: z.literal('Emerging Initiatives'),
    description: z.string(),
    timeframe: z.literal('1-3 years'),
    initiatives: z.array(z.object({
      name: z.string(),
      status: z.enum(['planning', 'pilot', 'scaling', 'evaluating']),
      expectedMetrics: z.array(z.string()),
      dependencies: z.array(z.string())
    }))
  }),

  horizon3: z.object({
    title: z.literal('Transformational Vision'),
    description: z.string(),
    timeframe: z.literal('3+ years'),
    visions: z.array(z.object({
      description: z.string(),
      indicators: z.array(z.string()),
      systemicChanges: z.array(z.string())
    }))
  })
});

// Export types
export type ImpactMetric = z.infer<typeof ImpactMetricSchema>;
export type OonchiumpaMetrics = z.infer<typeof OonchiumpaMetricsSchema>;
export type MetricVisualization = z.infer<typeof MetricVisualizationSchema>;
export type ThreeHorizons = z.infer<typeof ThreeHorizonsSchema>;
export type MetricCategoryType = z.infer<typeof MetricCategory>;
export type MetricUnitType = z.infer<typeof MetricUnit>;

// Real data from Oonchiumpa evaluation report
export const EVALUATION_METRICS: OonchiumpaMetrics = {
  schoolReengagement: {
    percentage: 72,
    totalParticipants: 19,
    returnedToSchool: 14,
    alternativeEducation: 0
  },
  
  operationLunaReduction: {
    percentage: 95,
    beforeCount: 19,
    afterCount: 1,
    participants: 18
  },

  serviceReferrals: {
    total: 71,
    byGender: {
      female: 32,
      male: 39
    },
    byType: {
      'mental_health': 15,
      'housing': 12,
      'education': 14,
      'employment': 8,
      'cultural_support': 11,
      'family_services': 11
    }
  },

  wellbeingScores: {
    happiness: {
      before: 5.2,
      after: 7.8,
      improvement: 2.6
    },
    safety: {
      before: 4.9,
      after: 8.1,
      improvement: 3.2
    },
    needs: {
      before: 4.1,
      after: 7.5,
      improvement: 3.4
    }
  },

  culturalParticipation: {
    onCountryTrips: 8,
    culturalActivities: 24,
    elderEngagement: 12,
    culturalKnowledgeTransfer: 16
  },

  programReach: {
    totalYouthServed: 19,
    newParticipants: 19,
    retentionRate: 89,
    averageEngagementDuration: 180
  }
};