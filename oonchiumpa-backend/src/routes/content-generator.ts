import express from 'express';
import { ContentOrchestrator, ContentGenerationRequest } from '../services/contentOrchestrator';
import { logger } from '../utils/logger';
import { authenticateToken, requireAIAccess, optionalAuth, requirePermission } from '../middleware/auth';

const router = express.Router();
const contentOrchestrator = new ContentOrchestrator();

/**
 * Generate team profile from interview documents
 * POST /api/content-generator/team-profile
 * REQUIRES: Oonchiumpa staff or admin access
 */
router.post('/team-profile', authenticateToken, requireAIAccess, async (req, res) => {
  try {
    const { memberName, interviewFiles } = req.body;
    
    logger.info(`🎭 Generating team profile for: ${memberName}`);
    
    const profile = await contentOrchestrator.generateTeamProfile(memberName, interviewFiles);
    
    // Save to database with demo user
    await contentOrchestrator.saveGeneratedContent(profile, 'demo-user');
    
    logger.info(`✅ Team profile generated: ${profile.title}`);
    
    res.json({
      success: true,
      profile: profile
    });
    
  } catch (error) {
    logger.error('Team profile generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate team profile'
    });
  }
});

/**
 * Generate historical education piece
 * POST /api/content-generator/historical-piece
 * REQUIRES: Oonchiumpa staff or admin access
 */
router.post('/historical-piece', authenticateToken, requireAIAccess, async (req, res) => {
  try {
    const { topic, sourceDocuments } = req.body;
    
    logger.info(`📜 Generating historical piece: ${topic}`);
    
    const historicalContent = await contentOrchestrator.generateHistoricalPiece(topic, sourceDocuments);
    
    await contentOrchestrator.saveGeneratedContent(historicalContent, 'demo-user');
    
    logger.info(`✅ Historical piece generated: ${historicalContent.title}`);
    
    res.json({
      success: true,
      content: historicalContent
    });
    
  } catch (error) {
    logger.error('Historical piece generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate historical piece'
    });
  }
});

/**
 * Generate transformation story case study
 * POST /api/content-generator/transformation-story
 * REQUIRES: Oonchiumpa staff or admin access
 */
router.post('/transformation-story', authenticateToken, requireAIAccess, async (req, res) => {
  try {
    const { focusArea, sourceDocuments } = req.body;
    
    logger.info(`🌟 Generating transformation story: ${focusArea}`);
    
    const story = await contentOrchestrator.generateTransformationStory(focusArea, sourceDocuments);
    
    await contentOrchestrator.saveGeneratedContent(story, 'demo-user');
    
    logger.info(`✅ Transformation story generated: ${story.title}`);
    
    res.json({
      success: true,
      story: story
    });
    
  } catch (error) {
    logger.error('Transformation story generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate transformation story'
    });
  }
});

/**
 * Generate dynamic blog post
 * POST /api/content-generator/blog-post
 * REQUIRES: Oonchiumpa staff or admin access
 */
router.post('/blog-post', authenticateToken, requireAIAccess, async (req, res) => {
  try {
    const { theme, recentDocuments } = req.body;
    
    logger.info(`📝 Generating blog post: ${theme}`);
    
    const blogPost = await contentOrchestrator.generateBlogPost(theme, recentDocuments);
    
    await contentOrchestrator.saveGeneratedContent(blogPost, 'demo-user');
    
    logger.info(`✅ Blog post generated: ${blogPost.title}`);
    
    res.json({
      success: true,
      blogPost: blogPost
    });
    
  } catch (error) {
    logger.error('Blog post generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate blog post'
    });
  }
});

/**
 * Build comprehensive content library from all documents
 * POST /api/content-generator/build-library
 * REQUIRES: Admin access only
 */
router.post('/build-library', authenticateToken, requirePermission('ai.configure'), async (req, res) => {
  try {
    logger.info('🏗️ Building comprehensive content library from all documents...');
    
    const library = await contentOrchestrator.buildContentLibrary();
    
    // Save all content to database
    const savePromises = [];
    
    for (const profile of library.teamProfiles) {
      savePromises.push(contentOrchestrator.saveGeneratedContent(profile, 'demo-user'));
    }
    
    for (const post of library.blogPosts) {
      savePromises.push(contentOrchestrator.saveGeneratedContent(post, 'demo-user'));
    }
    
    for (const study of library.caseStudies) {
      savePromises.push(contentOrchestrator.saveGeneratedContent(study, 'demo-user'));
    }
    
    for (const piece of library.historicalPieces) {
      savePromises.push(contentOrchestrator.saveGeneratedContent(piece, 'demo-user'));
    }
    
    await Promise.all(savePromises);
    
    logger.info(`✅ Content library built: ${library.teamProfiles.length + library.blogPosts.length + library.caseStudies.length + library.historicalPieces.length} pieces generated`);
    
    res.json({
      success: true,
      library: {
        teamProfiles: library.teamProfiles.length,
        blogPosts: library.blogPosts.length,
        caseStudies: library.caseStudies.length,
        historicalPieces: library.historicalPieces.length,
        totalContent: library.teamProfiles.length + library.blogPosts.length + library.caseStudies.length + library.historicalPieces.length
      },
      samples: {
        teamProfile: library.teamProfiles[0]?.title,
        blogPost: library.blogPosts[0]?.title,
        caseStudy: library.caseStudies[0]?.title,
        historicalPiece: library.historicalPieces[0]?.title
      }
    });
    
  } catch (error) {
    logger.error('Content library generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to build content library'
    });
  }
});

/**
 * Generate custom content from specific requirements
 * POST /api/content-generator/custom
 * REQUIRES: Oonchiumpa staff or admin access
 */
router.post('/custom', authenticateToken, requireAIAccess, async (req, res) => {
  try {
    const request: ContentGenerationRequest = req.body;
    
    logger.info(`🎯 Generating custom ${request.type}: ${request.focusArea}`);
    
    const content = await contentOrchestrator.generateContentFromInterviews(request);
    
    await contentOrchestrator.saveGeneratedContent(content, 'demo-user');
    
    logger.info(`✅ Custom content generated: ${content.title}`);
    
    res.json({
      success: true,
      content: content
    });
    
  } catch (error) {
    logger.error('Custom content generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate custom content'
    });
  }
});

/**
 * Test endpoint - Generate sample content to showcase capabilities
 * GET /api/content-generator/demo
 * PUBLIC: Demo accessible to show capabilities
 */
router.get('/demo', optionalAuth, async (req, res) => {
  try {
    logger.info('🚀 Generating demo content showcase...');
    
    const documentsPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Interviews';
    
    // Generate one sample of each content type
    const [teamProfile, blogPost, historicalPiece, transformationStory] = await Promise.all([
      contentOrchestrator.generateTeamProfile('Kristy Bloomfield', [`${documentsPath}/Kristy1.md`]),
      contentOrchestrator.generateBlogPost('Daily Realities of Community Youth Work', [`${documentsPath}/Kristy1.md`]),
      contentOrchestrator.generateHistoricalPiece('Understanding the Intervention Impact', [`${documentsPath}/Intervention.md`]),
      contentOrchestrator.generateTransformationStory('Cultural Identity and Youth Development', [`${documentsPath}/Kristy1.md`])
    ]);
    
    logger.info('✅ Demo content generated successfully');
    
    res.json({
      success: true,
      message: 'Demo content generated - showcasing AI-powered content creation capabilities',
      samples: {
        teamProfile: {
          title: teamProfile.title,
          excerpt: teamProfile.excerpt,
          themes: teamProfile.metaData.keyThemes
        },
        blogPost: {
          title: blogPost.title,
          excerpt: blogPost.excerpt,
          keywords: blogPost.seoData.keywords
        },
        historicalPiece: {
          title: historicalPiece.title,
          excerpt: historicalPiece.excerpt,
          culturalConsiderations: historicalPiece.metaData.culturalConsiderations
        },
        transformationStory: {
          title: transformationStory.title,
          excerpt: transformationStory.excerpt,
          recommendedImages: transformationStory.metaData.recommendedImages
        }
      }
    });
    
  } catch (error) {
    logger.error('Demo content generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate demo content'
    });
  }
});

export default router;