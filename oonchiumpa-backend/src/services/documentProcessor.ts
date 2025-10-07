import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { prisma } from '../index';
import { ProcessingStatus, DocumentType, ContentStatus, SensitivityLevel } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProcessingResult {
  documentId: string;
  textContent: string;
  analysis: ContentAnalysis;
  extractedStories: ExtractedStory[];
  extractedOutcomes: ExtractedOutcome[];
  processingStatus: ProcessingStatus;
}

export interface ContentAnalysis {
  summary: string;
  themes: string[];
  culturalElements: string[];
  keyDates: string[];
  locations: string[];
  beneficiaryCount?: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
}

export interface ExtractedStory {
  title: string;
  subtitle?: string;
  content: string;
  category: string;
  culturalSignificance?: string;
  tags: string[];
  sensitivityLevel: SensitivityLevel;
}

export interface ExtractedOutcome {
  title: string;
  description: string;
  impact: string;
  category: string;
  location?: string;
  beneficiaries?: number;
  date?: Date;
  metrics: Array<{ label: string; value: string }>;
  sensitivityLevel: SensitivityLevel;
}

export class DocumentProcessor {
  private uploadDir = path.join(process.cwd(), 'uploads', 'documents');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async processDocument(file: Express.Multer.File, userId?: string): Promise<ProcessingResult> {
    let documentRecord;
    
    try {
      // Create document record
      documentRecord = await prisma.reportDocument.create({
        data: {
          filename: file.originalname,
          originalUrl: file.path,
          type: this.getDocumentType(file.originalname),
          extractionStatus: ProcessingStatus.PROCESSING,
          uploadedById: userId,
        }
      });

      logger.info('Starting document processing', { 
        documentId: documentRecord.id, 
        filename: file.originalname 
      });

      // Extract text content
      const textContent = await this.extractTextFromFile(file);
      
      // AI analysis
      const analysis = await this.analyzeContent(textContent);
      
      // Extract structured data
      const extractedStories = await this.extractStories(textContent, analysis);
      const extractedOutcomes = await this.extractOutcomes(textContent, analysis);

      // Update document with extracted data
      await prisma.reportDocument.update({
        where: { id: documentRecord.id },
        data: {
          extractionStatus: ProcessingStatus.COMPLETED,
          extractedData: {
            analysis,
            storiesCount: extractedStories.length,
            outcomesCount: extractedOutcomes.length,
          },
          processedAt: new Date(),
        }
      });

      // Create story records
      for (const storyData of extractedStories) {
        await prisma.story.create({
          data: {
            ...storyData,
            status: ContentStatus.PENDING_APPROVAL,
            extractionSourceId: documentRecord.id,
            authorUserId: userId,
          }
        });
      }

      // Create outcome records
      for (const outcomeData of extractedOutcomes) {
        const outcome = await prisma.outcome.create({
          data: {
            title: outcomeData.title,
            description: outcomeData.description,
            impact: outcomeData.impact,
            category: outcomeData.category,
            location: outcomeData.location,
            beneficiaries: outcomeData.beneficiaries,
            date: outcomeData.date,
            status: ContentStatus.PENDING_APPROVAL,
            sensitivityLevel: outcomeData.sensitivityLevel,
            extractionSourceId: documentRecord.id,
            authorUserId: userId,
          }
        });

        // Add metrics
        for (const metric of outcomeData.metrics) {
          await prisma.outcomeMetric.create({
            data: {
              label: metric.label,
              value: metric.value,
              outcomeId: outcome.id,
            }
          });
        }
      }

      logger.info('Document processing completed successfully', {
        documentId: documentRecord.id,
        storiesExtracted: extractedStories.length,
        outcomesExtracted: extractedOutcomes.length
      });

      return {
        documentId: documentRecord.id,
        textContent,
        analysis,
        extractedStories,
        extractedOutcomes,
        processingStatus: ProcessingStatus.COMPLETED,
      };

    } catch (error) {
      logger.error('Document processing failed', { 
        documentId: documentRecord?.id, 
        error: error.message 
      });

      if (documentRecord) {
        await prisma.reportDocument.update({
          where: { id: documentRecord.id },
          data: {
            extractionStatus: ProcessingStatus.FAILED,
            extractedData: { error: error.message },
          }
        });
      }

      throw error;
    }
  }

  private async extractTextFromFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();
    
    switch (ext) {
      case '.pdf':
        const pdfBuffer = await fs.readFile(file.path);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
        
      case '.docx':
        const docxBuffer = await fs.readFile(file.path);
        const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
        return docxResult.value;
        
      case '.txt':
        return await fs.readFile(file.path, 'utf-8');
        
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  private async analyzeContent(text: string): Promise<ContentAnalysis> {
    const prompt = `
    Analyze this Aboriginal community report and extract key information. 
    Be respectful and culturally sensitive in your analysis.
    
    Extract and return JSON with:
    1. A brief summary (2-3 sentences)
    2. Main themes and topics
    3. Cultural elements mentioned (ceremonies, traditions, symbols, etc.)
    4. Important dates mentioned
    5. Locations mentioned
    6. Estimated number of people impacted/involved
    7. Overall sentiment (positive/neutral/negative)
    8. Confidence score (0-1) for the analysis
    
    Text to analyze:
    ${text.slice(0, 8000)} // Limit text length for API
    
    Return only valid JSON in this format:
    {
      "summary": "Brief summary...",
      "themes": ["theme1", "theme2"],
      "culturalElements": ["element1", "element2"],
      "keyDates": ["date1", "date2"],
      "locations": ["location1", "location2"],
      "beneficiaryCount": 123,
      "sentiment": "positive",
      "confidenceScore": 0.85
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const analysisText = completion.choices[0].message.content;
      return JSON.parse(analysisText || '{}');
    } catch (error) {
      logger.error('AI analysis failed', { error: error.message });
      return {
        summary: 'AI analysis unavailable',
        themes: [],
        culturalElements: [],
        keyDates: [],
        locations: [],
        sentiment: 'neutral' as const,
        confidenceScore: 0,
      };
    }
  }

  private async extractStories(text: string, analysis: ContentAnalysis): Promise<ExtractedStory[]> {
    const prompt = `
    From this Aboriginal community report, extract individual stories that could be shared on a website.
    Focus on positive community outcomes, cultural preservation activities, educational programs, and inspiring individual journeys.
    
    Be respectful and ensure stories highlight community strength and resilience.
    
    Context from analysis:
    - Themes: ${analysis.themes.join(', ')}
    - Cultural elements: ${analysis.culturalElements.join(', ')}
    - Locations: ${analysis.locations.join(', ')}
    
    Text:
    ${text.slice(0, 6000)}
    
    Extract up to 3 meaningful stories. Return JSON array:
    [
      {
        "title": "Story title",
        "subtitle": "Optional subtitle",
        "content": "Full story content (2-4 paragraphs)",
        "category": "category name",
        "culturalSignificance": "Why this story is culturally important",
        "tags": ["tag1", "tag2", "tag3"],
        "sensitivityLevel": "PUBLIC" | "COMMUNITY" | "RESTRICTED"
      }
    ]
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const storiesText = completion.choices[0].message.content;
      const stories = JSON.parse(storiesText || '[]');
      
      return stories.map((story: any) => ({
        ...story,
        sensitivityLevel: story.sensitivityLevel as SensitivityLevel || SensitivityLevel.COMMUNITY
      }));
    } catch (error) {
      logger.error('Story extraction failed', { error: error.message });
      return [];
    }
  }

  private async extractOutcomes(text: string, analysis: ContentAnalysis): Promise<ExtractedOutcome[]> {
    const prompt = `
    From this Aboriginal community report, extract measurable outcomes and impacts.
    Focus on community achievements, program results, and positive changes.
    
    Context:
    - Estimated beneficiaries: ${analysis.beneficiaryCount || 'unknown'}
    - Locations: ${analysis.locations.join(', ')}
    - Key themes: ${analysis.themes.join(', ')}
    
    Text:
    ${text.slice(0, 6000)}
    
    Extract up to 3 concrete outcomes. Return JSON array:
    [
      {
        "title": "Outcome title",
        "description": "What was achieved",
        "impact": "The positive change this created",
        "category": "category name",
        "location": "where this happened",
        "beneficiaries": 123,
        "date": "2024-01-15T00:00:00Z",
        "metrics": [
          {"label": "People Trained", "value": "45"},
          {"label": "Programs Delivered", "value": "12"}
        ],
        "sensitivityLevel": "PUBLIC" | "COMMUNITY" | "RESTRICTED"
      }
    ]
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const outcomesText = completion.choices[0].message.content;
      const outcomes = JSON.parse(outcomesText || '[]');
      
      return outcomes.map((outcome: any) => ({
        ...outcome,
        date: outcome.date ? new Date(outcome.date) : undefined,
        sensitivityLevel: outcome.sensitivityLevel as SensitivityLevel || SensitivityLevel.COMMUNITY
      }));
    } catch (error) {
      logger.error('Outcome extraction failed', { error: error.message });
      return [];
    }
  }

  private getDocumentType(filename: string): DocumentType {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.pdf':
        return DocumentType.PDF;
      case '.docx':
        return DocumentType.DOCX;
      case '.txt':
        return DocumentType.TXT;
      default:
        return DocumentType.PDF; // Default fallback
    }
  }
}