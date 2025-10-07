export interface ContentGenerationRequest {
    type: 'blog-post' | 'team-profile' | 'case-study' | 'historical-piece' | 'transformation-story';
    sourceDocuments: string[];
    focusArea?: string;
    tone: 'professional' | 'conversational' | 'educational' | 'inspiring';
    targetAudience: 'community' | 'funders' | 'policy-makers' | 'general-public';
    culturalSensitivity: 'high' | 'medium';
}
export interface GeneratedContent {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    metaData: {
        sourceDocuments: string[];
        keyThemes: string[];
        culturalConsiderations: string[];
        recommendedImages: string[];
    };
    seoData: {
        metaDescription: string;
        keywords: string[];
        suggestedTags: string[];
    };
}
export declare class ContentOrchestrator {
    private aiOrchestrator;
    private prisma;
    constructor();
    /**
     * Generate comprehensive content from interview documents
     */
    generateContentFromInterviews(request: ContentGenerationRequest): Promise<GeneratedContent>;
    /**
     * Create detailed team profile from interview transcripts
     */
    generateTeamProfile(memberName: string, interviewFiles: string[]): Promise<GeneratedContent>;
    /**
     * Generate historical education blog post
     */
    generateHistoricalPiece(topic: string, sourceDocuments: string[]): Promise<GeneratedContent>;
    /**
     * Create transformation story case study
     */
    generateTransformationStory(focusArea: string, sourceDocuments: string[]): Promise<GeneratedContent>;
    /**
     * Generate dynamic blog content from daily work and insights
     */
    generateBlogPost(theme: string, recentDocuments: string[]): Promise<GeneratedContent>;
    /**
     * Build comprehensive content library from all documents
     */
    buildContentLibrary(): Promise<{
        teamProfiles: GeneratedContent[];
        blogPosts: GeneratedContent[];
        caseStudies: GeneratedContent[];
        historicalPieces: GeneratedContent[];
    }>;
    private loadSourceDocuments;
    private buildContentGenerationPrompt;
    private generateContentFromPrompt;
    /**
     * Extract meaningful content from AI processing results
     */
    private extractContentFromResults;
    /**
     * Safely create excerpt from content
     */
    private createExcerpt;
    private structureGeneratedContent;
    /**
     * Save generated content to database
     */
    saveGeneratedContent(content: GeneratedContent, authorId: string): Promise<void>;
}
//# sourceMappingURL=contentOrchestrator.d.ts.map