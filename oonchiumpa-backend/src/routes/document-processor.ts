import express from 'express';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { prisma } from '../index';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Test document processing with AI analysis
 * POST /api/process-document
 */
router.post('/', async (req, res) => {
  try {
    const { content, filename, type = 'interview' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Document content is required'
      });
    }

    logger.info(`🔍 Processing document: ${filename || 'untitled'}`);

    // Process with AI
    const results = await aiOrchestrator.processInterview(content, {
      filename: filename || 'test-document',
      type,
      extractStories: true,
      extractOutcomes: true,
      extractInsights: true
    });

    logger.info(`✅ AI processing completed: ${results.length} items extracted`);

    // Structure the results
    const stories = results.filter(r => r.type === 'story');
    const outcomes = results.filter(r => r.type === 'outcome'); 
    const insights = results.filter(r => r.type === 'insight');
    const keyThemes = results.filter(r => r.type === 'theme');

    res.json({
      success: true,
      document: {
        filename: filename || 'test-document',
        type,
        processedAt: new Date().toISOString()
      },
      analysis: {
        totalExtracted: results.length,
        stories: stories.length,
        outcomes: outcomes.length,
        insights: insights.length,
        themes: keyThemes.length
      },
      extractedContent: {
        stories: stories.map(s => ({
          title: s.content.title,
          summary: s.content.summary,
          impact: s.content.impact,
          culturalSignificance: s.content.culturalSignificance,
          tags: s.content.tags,
          confidence: s.confidence
        })),
        outcomes: outcomes.map(o => ({
          title: o.content.title,
          description: o.content.description,
          impact: o.content.impact,
          metrics: o.content.metrics,
          beneficiaries: o.content.beneficiaries,
          tags: o.content.tags,
          confidence: o.confidence
        })),
        insights: insights.map(i => ({
          insight: i.content.insight,
          implications: i.content.implications,
          actionable: i.content.actionable,
          confidence: i.confidence
        })),
        themes: keyThemes.map(t => ({
          theme: t.content.theme,
          description: t.content.description,
          frequency: t.content.frequency,
          confidence: t.confidence
        }))
      }
    });

  } catch (error) {
    logger.error('Error processing document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Process and save document to database
 * POST /api/process-document/save
 */
router.post('/save', async (req, res) => {
  try {
    const { content, filename, type = 'interview', authorUserId = 'demo-user' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Document content is required'
      });
    }

    logger.info(`📄 Processing and saving document: ${filename || 'untitled'}`);

    // Process with AI
    const results = await aiOrchestrator.processInterview(content, {
      filename: filename || 'test-document',
      type,
      extractStories: true,
      extractOutcomes: true
    });

    // Save stories to database
    const savedStories = [];
    const storyResults = results.filter(r => r.type === 'story');
    
    for (const story of storyResults) {
      if (story.confidence > 0.7) { // Only save high-confidence stories
        const savedStory = await prisma.story.create({
          data: {
            title: story.content.title,
            content: story.content.summary || story.content.description,
            category: story.content.category || 'Community Programs',
            culturalSignificance: story.content.culturalSignificance,
            tags: story.content.tags || [],
            status: 'DRAFT',
            sensitivityLevel: 'COMMUNITY',
            authorUserId,
            extractionMetadata: {
              confidence: story.confidence,
              sourceDocument: filename || 'test-document',
              processedAt: new Date().toISOString(),
              aiProvider: 'multi-ai'
            }
          }
        });
        savedStories.push(savedStory);
      }
    }

    // Save outcomes to database  
    const savedOutcomes = [];
    const outcomeResults = results.filter(r => r.type === 'outcome');
    
    for (const outcome of outcomeResults) {
      if (outcome.confidence > 0.7) { // Only save high-confidence outcomes
        const savedOutcome = await prisma.outcome.create({
          data: {
            title: outcome.content.title,
            description: outcome.content.description,
            impact: outcome.content.impact,
            metrics: outcome.content.metrics || {},
            tags: outcome.content.tags || [],
            status: 'ACTIVE',
            authorUserId,
            extractionMetadata: {
              confidence: outcome.confidence,
              sourceDocument: filename || 'test-document', 
              processedAt: new Date().toISOString(),
              aiProvider: 'multi-ai'
            }
          }
        });
        savedOutcomes.push(savedOutcome);
      }
    }

    logger.info(`✅ Saved ${savedStories.length} stories and ${savedOutcomes.length} outcomes to database`);

    res.json({
      success: true,
      message: `Successfully processed and saved content from ${filename || 'document'}`,
      saved: {
        stories: savedStories.length,
        outcomes: savedOutcomes.length
      },
      data: {
        stories: savedStories.map(s => ({ id: s.id, title: s.title })),
        outcomes: savedOutcomes.map(o => ({ id: o.id, title: o.title }))
      }
    });

  } catch (error) {
    logger.error('Error processing and saving document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process and save document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;