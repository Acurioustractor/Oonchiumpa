import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { requestCulturalConsultation } from '../middleware/culturalValidation';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'bulk');
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}_${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      // Audio
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      // Video
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  }
});

// Bulk upload endpoint - handles multiple files and document types
router.post('/upload', upload.array('files', 50), async (req, res, next) => {
  try {
    const { 
      category = 'general',
      tags = [],
      authorUserId,
      processImmediately = true,
      culturalContext = {}
    } = req.body;

    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    const uploadResults = [];
    
    for (const file of files) {
      try {
        // Create report document record
        const reportDoc = await prisma.reportDocument.create({
          data: {
            filename: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
            documentType: getDocumentType(file.mimetype),
            uploadedById: authorUserId,
            category,
            tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()),
            metadata: {
              originalName: file.originalname,
              uploadTimestamp: new Date().toISOString(),
              culturalContext
            }
          }
        });

        let processingResult = null;

        // Process immediately if requested
        if (processImmediately) {
          processingResult = await processDocument(reportDoc.id, file);
        }

        uploadResults.push({
          documentId: reportDoc.id,
          filename: file.originalname,
          status: processImmediately ? 'processed' : 'uploaded',
          size: file.size,
          processingResult
        });

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        uploadResults.push({
          filename: file.originalname,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.json({
      message: `Uploaded ${files.length} files`,
      results: uploadResults,
      summary: {
        total: files.length,
        successful: uploadResults.filter(r => r.status !== 'error').length,
        errors: uploadResults.filter(r => r.status === 'error').length
      }
    });

  } catch (error) {
    next(error);
  }
});

// Process existing documents with AI
router.post('/process/:documentId', async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { 
      providers = ['openai', 'anthropic'],
      extractTypes = ['stories', 'outcomes', 'insights'],
      culturalReviewRequired = true 
    } = req.body;

    const document = await prisma.reportDocument.findUnique({
      where: { id: documentId },
      include: {
        uploadedBy: { select: { name: true, email: true } }
      }
    });

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The specified document could not be found'
      });
    }

    // Read document content
    const content = await readDocumentContent(document.filePath, document.mimeType);
    
    // Process with AI orchestrator
    let aiResults = [];
    
    if (document.mimeType.startsWith('text/') || document.mimeType.includes('pdf') || document.mimeType.includes('word')) {
      // Text document processing
      aiResults = await aiOrchestrator.processInterview(content, {
        filename: document.filename,
        category: document.category,
        uploadedBy: document.uploadedBy?.name,
        culturalContext: document.metadata
      });
    } else if (document.mimeType.startsWith('image/')) {
      // Image processing
      aiResults = await aiOrchestrator.analyzeMedia(document.filePath, 'image');
    } else if (document.mimeType.startsWith('video/')) {
      // Video processing
      aiResults = await aiOrchestrator.analyzeMedia(document.filePath, 'video');
    }

    // Create stories and outcomes from AI results
    const createdContent = await createContentFromAI(aiResults, document, culturalReviewRequired);

    // Update document status
    await prisma.reportDocument.update({
      where: { id: documentId },
      data: {
        processingStatus: 'COMPLETED',
        processedAt: new Date(),
        aiMetadata: {
          providers: providers,
          extractedTypes: extractTypes,
          results: aiResults.map(r => ({
            provider: r.provider,
            type: r.type,
            confidence: r.confidence
          }))
        }
      }
    });

    res.json({
      documentId,
      filename: document.filename,
      processingResults: aiResults,
      createdContent,
      summary: {
        storiesCreated: createdContent.stories?.length || 0,
        outcomesCreated: createdContent.outcomes?.length || 0,
        culturalConsultationsRequired: createdContent.consultationsRequired || 0
      }
    });

  } catch (error) {
    next(error);
  }
});

// Batch process multiple documents
router.post('/batch-process', async (req, res, next) => {
  try {
    const { documentIds, processors = ['openai'], culturalReviewRequired = true } = req.body;

    if (!documentIds || !Array.isArray(documentIds)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'documentIds must be an array'
      });
    }

    const batchResults = [];

    for (const documentId of documentIds) {
      try {
        // Process each document individually
        const result = await processSingleDocument(documentId, processors, culturalReviewRequired);
        batchResults.push({
          documentId,
          status: 'success',
          result
        });
      } catch (error) {
        batchResults.push({
          documentId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Processing failed'
        });
      }
    }

    res.json({
      message: `Batch processed ${documentIds.length} documents`,
      results: batchResults,
      summary: {
        total: documentIds.length,
        successful: batchResults.filter(r => r.status === 'success').length,
        errors: batchResults.filter(r => r.status === 'error').length
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get processing status for documents
router.get('/status/:documentId', async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.reportDocument.findUnique({
      where: { id: documentId },
      include: {
        extractedStories: {
          select: { id: true, title: true, status: true }
        },
        extractedOutcomes: {
          select: { id: true, title: true, status: true }
        },
        extractedMedia: {
          select: { id: true, title: true, type: true }
        }
      }
    });

    if (!document) {
      return res.status(404).json({
        error: 'Document not found'
      });
    }

    res.json({
      documentId,
      filename: document.filename,
      uploadedAt: document.uploadedAt,
      processingStatus: document.processingStatus,
      processedAt: document.processedAt,
      extractedContent: {
        stories: document.extractedStories,
        outcomes: document.extractedOutcomes,
        media: document.extractedMedia
      },
      aiMetadata: document.aiMetadata
    });

  } catch (error) {
    next(error);
  }
});

// Import from existing oonchiumpa-platform docs
router.post('/import-platform-docs', async (req, res, next) => {
  try {
    const platformPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs';
    const { authorUserId, processImmediately = true } = req.body;

    // Import interviews
    const interviewsPath = path.join(platformPath, 'Interviews');
    const interviews = await importFromDirectory(interviewsPath, 'interview', authorUserId, processImmediately);

    // Import reports  
    const reportsPath = path.join(platformPath, 'Reports');
    const reports = await importFromDirectory(reportsPath, 'report', authorUserId, processImmediately);

    const summary = {
      interviews: interviews.length,
      reports: reports.length,
      total: interviews.length + reports.length
    };

    res.json({
      message: 'Successfully imported platform documents',
      imported: [...interviews, ...reports],
      summary
    });

  } catch (error) {
    next(error);
  }
});

// Helper methods
async function processDocument(documentId: string, file: Express.Multer.File) {
  // Implementation for immediate processing
  return { status: 'queued_for_processing' };
}

function getDocumentType(mimeType: string): string {
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word')) return 'DOCX';
  if (mimeType.startsWith('text/')) return 'TXT';
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  return 'OTHER';
}

async function readDocumentContent(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType.startsWith('text/') || mimeType.includes('markdown')) {
      return await fs.readFile(filePath, 'utf-8');
    }
    
    // For other file types, would implement appropriate readers
    // PDF: pdf-parse, DOCX: mammoth, etc.
    return `Content extraction for ${mimeType} not yet implemented`;
    
  } catch (error) {
    console.error('Error reading document content:', error);
    throw new Error('Failed to read document content');
  }
}

async function createContentFromAI(aiResults: any[], document: any, culturalReviewRequired: boolean) {
  const createdContent: any = {
    stories: [],
    outcomes: [],
    consultationsRequired: 0
  };

  for (const result of aiResults) {
    if (result.type === 'story' && result.content.items) {
      for (const storyData of result.content.items.filter((item: any) => item.type === 'story')) {
        const story = await prisma.story.create({
          data: {
            title: storyData.title,
            content: storyData.content || storyData.description,
            category: storyData.category || document.category,
            culturalSignificance: storyData.cultural_significance,
            tags: storyData.tags || [],
            status: culturalReviewRequired ? 'DRAFT' : 'PENDING_APPROVAL',
            sensitivityLevel: mapSensitivityLevel(storyData.sensitivity_level),
            extractionSourceId: document.id,
            authorUserId: document.uploadedById
          }
        });

        createdContent.stories.push(story);

        // Request cultural consultation if needed
        if (result.culturalSensitivity?.requiresReview) {
          await requestCulturalConsultation(
            'story',
            story.id,
            `Cultural review required for story extracted from ${document.filename}`,
            document.uploadedById,
            result.culturalSensitivity.sensitivityLevel === 'SACRED' ? 'URGENT' : 'HIGH'
          );
          createdContent.consultationsRequired++;
        }
      }
    }

    if (result.type === 'outcome' && result.content.items) {
      for (const outcomeData of result.content.items.filter((item: any) => item.type === 'outcome')) {
        const outcome = await prisma.outcome.create({
          data: {
            title: outcomeData.title,
            description: outcomeData.description,
            impact: outcomeData.impact,
            category: outcomeData.category || document.category,
            status: culturalReviewRequired ? 'DRAFT' : 'PENDING_APPROVAL',
            extractionSourceId: document.id,
            authorUserId: document.uploadedById
          }
        });

        createdContent.outcomes.push(outcome);
      }
    }
  }

  return createdContent;
}

function mapSensitivityLevel(level: string): string {
  switch (level?.toLowerCase()) {
    case 'low':
    case 'public': return 'PUBLIC';
    case 'medium':
    case 'community': return 'COMMUNITY';
    case 'high':
    case 'restricted': return 'RESTRICTED';
    default: return 'COMMUNITY';
  }
}

async function processSingleDocument(documentId: string, processors: string[], culturalReviewRequired: boolean) {
  // Implementation for single document processing
  return { status: 'processed' };
}

async function importFromDirectory(dirPath: string, category: string, authorUserId: string, processImmediately: boolean) {
  const results = [];
  
  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.pdf')) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        const reportDoc = await prisma.reportDocument.create({
          data: {
            filename: file,
            filePath,
            fileSize: stats.size,
            mimeType: file.endsWith('.md') ? 'text/markdown' : 'application/pdf',
            documentType: file.endsWith('.md') ? 'TXT' : 'PDF',
            uploadedById: authorUserId,
            category,
            metadata: {
              importedFrom: 'oonchiumpa-platform',
              importedAt: new Date().toISOString()
            }
          }
        });

        results.push({
          documentId: reportDoc.id,
          filename: file,
          category,
          size: stats.size
        });
      }
    }
    
  } catch (error) {
    console.error(`Error importing from ${dirPath}:`, error);
  }

  return results;
}

export default router;