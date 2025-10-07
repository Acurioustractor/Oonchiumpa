interface AIProvider {
    name: string;
    type: 'text' | 'vision' | 'audio' | 'research';
    capabilities: string[];
    isActive: boolean;
}
interface ProcessingResult {
    provider: string;
    type: 'story' | 'outcome' | 'cultural_insight' | 'metadata';
    content: any;
    confidence: number;
    culturalSensitivity?: {
        requiresReview: boolean;
        sensitivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SACRED';
        recommendations: string[];
    };
}
export declare class AIOrchestrator {
    private openai;
    private providers;
    constructor();
    private registerProviders;
    /**
     * Process interview transcript with multiple AI providers
     */
    processInterview(transcript: string, metadata?: any): Promise<ProcessingResult[]>;
    /**
     * Analyze photos with computer vision
     */
    analyzeMedia(mediaUrl: string, mediaType: 'image' | 'video'): Promise<ProcessingResult[]>;
    /**
     * Generate comprehensive narrative from multiple sources
     */
    craftNarrative(sources: {
        interviews?: string[];
        documents?: string[];
        mediaAnalysis?: any[];
        culturalContext?: any;
    }): Promise<ProcessingResult>;
    /**
     * OpenAI story extraction from interviews
     */
    private extractStoriesWithOpenAI;
    /**
     * Anthropic cultural sensitivity analysis
     */
    private analyzeCulturalSensitivity;
    /**
     * Perplexity research and context validation
     */
    private validateCulturalContext;
    /**
     * Google Vision image analysis
     */
    private analyzeImageWithGoogle;
    /**
     * Azure Computer Vision analysis
     */
    private analyzeImageWithAzure;
    private buildNarrativeCraftingPrompt;
    private analyzeNarrativeStructure;
    private identifyCulturalElements;
    private assessCulturalSensitivity;
    private mapSensitivityLevel;
    private determineSensitivityLevel;
    private extractRecommendations;
    /**
     * Get available providers and their status
     */
    getProviderStatus(): Record<string, AIProvider>;
}
export declare const aiOrchestrator: AIOrchestrator;
export {};
//# sourceMappingURL=aiOrchestrator.d.ts.map