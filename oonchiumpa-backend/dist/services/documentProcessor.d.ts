import { ProcessingStatus, SensitivityLevel } from '@prisma/client';
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
    metrics: Array<{
        label: string;
        value: string;
    }>;
    sensitivityLevel: SensitivityLevel;
}
export declare class DocumentProcessor {
    private uploadDir;
    constructor();
    private ensureUploadDir;
    processDocument(file: Express.Multer.File, userId?: string): Promise<ProcessingResult>;
    private extractTextFromFile;
    private analyzeContent;
    private extractStories;
    private extractOutcomes;
    private getDocumentType;
}
//# sourceMappingURL=documentProcessor.d.ts.map