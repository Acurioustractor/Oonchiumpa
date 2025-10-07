"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const openai_1 = __importDefault(require("openai"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class DocumentProcessor {
    uploadDir = path_1.default.join(process.cwd(), 'uploads', 'documents');
    constructor() {
        this.ensureUploadDir();
    }
    async ensureUploadDir() {
        try {
            await fs_1.promises.access(this.uploadDir);
        }
        catch {
            await fs_1.promises.mkdir(this.uploadDir, { recursive: true });
        }
    }
    async processDocument(file, userId) {
        let documentRecord;
        try {
            // Create document record
            documentRecord = await index_1.prisma.reportDocument.create({
                data: {
                    filename: file.originalname,
                    originalUrl: file.path,
                    type: this.getDocumentType(file.originalname),
                    extractionStatus: client_1.ProcessingStatus.PROCESSING,
                    uploadedById: userId,
                }
            });
            logger_1.logger.info('Starting document processing', {
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
            await index_1.prisma.reportDocument.update({
                where: { id: documentRecord.id },
                data: {
                    extractionStatus: client_1.ProcessingStatus.COMPLETED,
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
                await index_1.prisma.story.create({
                    data: {
                        ...storyData,
                        status: client_1.ContentStatus.PENDING_APPROVAL,
                        extractionSourceId: documentRecord.id,
                        authorUserId: userId,
                    }
                });
            }
            // Create outcome records
            for (const outcomeData of extractedOutcomes) {
                const outcome = await index_1.prisma.outcome.create({
                    data: {
                        title: outcomeData.title,
                        description: outcomeData.description,
                        impact: outcomeData.impact,
                        category: outcomeData.category,
                        location: outcomeData.location,
                        beneficiaries: outcomeData.beneficiaries,
                        date: outcomeData.date,
                        status: client_1.ContentStatus.PENDING_APPROVAL,
                        sensitivityLevel: outcomeData.sensitivityLevel,
                        extractionSourceId: documentRecord.id,
                        authorUserId: userId,
                    }
                });
                // Add metrics
                for (const metric of outcomeData.metrics) {
                    await index_1.prisma.outcomeMetric.create({
                        data: {
                            label: metric.label,
                            value: metric.value,
                            outcomeId: outcome.id,
                        }
                    });
                }
            }
            logger_1.logger.info('Document processing completed successfully', {
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
                processingStatus: client_1.ProcessingStatus.COMPLETED,
            };
        }
        catch (error) {
            logger_1.logger.error('Document processing failed', {
                documentId: documentRecord?.id,
                error: error.message
            });
            if (documentRecord) {
                await index_1.prisma.reportDocument.update({
                    where: { id: documentRecord.id },
                    data: {
                        extractionStatus: client_1.ProcessingStatus.FAILED,
                        extractedData: { error: error.message },
                    }
                });
            }
            throw error;
        }
    }
    async extractTextFromFile(file) {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        switch (ext) {
            case '.pdf':
                const pdfBuffer = await fs_1.promises.readFile(file.path);
                const pdfData = await (0, pdf_parse_1.default)(pdfBuffer);
                return pdfData.text;
            case '.docx':
                const docxBuffer = await fs_1.promises.readFile(file.path);
                const docxResult = await mammoth_1.default.extractRawText({ buffer: docxBuffer });
                return docxResult.value;
            case '.txt':
                return await fs_1.promises.readFile(file.path, 'utf-8');
            default:
                throw new Error(`Unsupported file type: ${ext}`);
        }
    }
    async analyzeContent(text) {
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
        }
        catch (error) {
            logger_1.logger.error('AI analysis failed', { error: error.message });
            return {
                summary: 'AI analysis unavailable',
                themes: [],
                culturalElements: [],
                keyDates: [],
                locations: [],
                sentiment: 'neutral',
                confidenceScore: 0,
            };
        }
    }
    async extractStories(text, analysis) {
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
            return stories.map((story) => ({
                ...story,
                sensitivityLevel: story.sensitivityLevel || client_1.SensitivityLevel.COMMUNITY
            }));
        }
        catch (error) {
            logger_1.logger.error('Story extraction failed', { error: error.message });
            return [];
        }
    }
    async extractOutcomes(text, analysis) {
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
            return outcomes.map((outcome) => ({
                ...outcome,
                date: outcome.date ? new Date(outcome.date) : undefined,
                sensitivityLevel: outcome.sensitivityLevel || client_1.SensitivityLevel.COMMUNITY
            }));
        }
        catch (error) {
            logger_1.logger.error('Outcome extraction failed', { error: error.message });
            return [];
        }
    }
    getDocumentType(filename) {
        const ext = path_1.default.extname(filename).toLowerCase();
        switch (ext) {
            case '.pdf':
                return client_1.DocumentType.PDF;
            case '.docx':
                return client_1.DocumentType.DOCX;
            case '.txt':
                return client_1.DocumentType.TXT;
            default:
                return client_1.DocumentType.PDF; // Default fallback
        }
    }
}
exports.DocumentProcessor = DocumentProcessor;
//# sourceMappingURL=documentProcessor.js.map