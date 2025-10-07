"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentOrchestrator = void 0;
const aiOrchestrator_1 = require("./aiOrchestrator");
const client_1 = require("@prisma/client");
const promises_1 = __importDefault(require("fs/promises"));
class ContentOrchestrator {
    aiOrchestrator;
    prisma;
    constructor() {
        this.aiOrchestrator = new aiOrchestrator_1.AIOrchestrator();
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Generate comprehensive content from interview documents
     */
    async generateContentFromInterviews(request) {
        const documentContents = await this.loadSourceDocuments(request.sourceDocuments);
        const prompt = this.buildContentGenerationPrompt(request, documentContents);
        // Use multiple AI providers for rich content generation
        const processingResults = await this.aiOrchestrator.processInterview(documentContents.join('\n\n---DOCUMENT BREAK---\n\n'), { contentType: request.type, prompt: prompt.primary });
        const primaryContent = this.extractContentFromResults(processingResults);
        const seoAnalysis = { keywords: [], description: '', tags: [] }; // Simplified for now
        const culturalReview = processingResults.find(r => r.type === 'cultural_insight');
        return this.structureGeneratedContent(primaryContent, seoAnalysis, culturalReview, request);
    }
    /**
     * Create detailed team profile from interview transcripts
     */
    async generateTeamProfile(memberName, interviewFiles) {
        const interviews = await this.loadSourceDocuments(interviewFiles);
        const profilePrompt = `
    Create a compelling team member profile for ${memberName} based on the following authentic interview content.

    CONTENT GUIDELINES:
    - Use direct quotes from the interviews to show authentic voice
    - Highlight professional journey and expertise
    - Show cultural authority and community connections  
    - Include specific examples of impact and approach
    - Maintain respectful, professional tone
    - Focus on strengths, vision, and community leadership

    STRUCTURE:
    1. Professional background and credentials
    2. Cultural connections and traditional authority
    3. Approach to youth work and community engagement
    4. Key achievements and impact stories
    5. Vision for community development
    6. Personal philosophy and values

    Interview content:
    ${interviews.join('\n\n---\n\n')}
    `;
        return this.generateContentFromPrompt(profilePrompt, 'team-profile');
    }
    /**
     * Generate historical education blog post
     */
    async generateHistoricalPiece(topic, sourceDocuments) {
        const sources = await this.loadSourceDocuments(sourceDocuments);
        const historicalPrompt = `
    Create an educational blog post about "${topic}" that helps readers understand historical context and its impact on present-day challenges.

    APPROACH:
    - Truth-telling with empathy and respect
    - Connect historical events to current realities
    - Include community voices and perspectives
    - Provide hope and pathway forward
    - Challenge misconceptions respectfully
    - Use evidence-based analysis

    AVOID:
    - Trauma porn or sensationalism  
    - Oversimplification of complex issues
    - Speaking for community without attribution
    - Perpetuating harmful stereotypes

    Source material:
    ${sources.join('\n\n---\n\n')}
    `;
        return this.generateContentFromPrompt(historicalPrompt, 'historical-piece');
    }
    /**
     * Create transformation story case study
     */
    async generateTransformationStory(focusArea, sourceDocuments) {
        const sources = await this.loadSourceDocuments(sourceDocuments);
        const storyPrompt = `
    Create an inspiring transformation story focused on "${focusArea}" that shows the power of culturally-led, community-controlled approaches.

    STORYTELLING ELEMENTS:
    - Real impact with specific examples
    - Journey from challenge to breakthrough
    - Role of cultural connection and identity
    - Community and family involvement
    - Systemic changes that enabled success
    - Lessons for broader application

    TONE:
    - Hopeful and empowering
    - Authentic and respectful
    - Evidence-based but human-centered
    - Celebrates community strength

    Source material:
    ${sources.join('\n\n---\n\n')}
    `;
        return this.generateContentFromPrompt(storyPrompt, 'transformation-story');
    }
    /**
     * Generate dynamic blog content from daily work and insights
     */
    async generateBlogPost(theme, recentDocuments) {
        const sources = await this.loadSourceDocuments(recentDocuments);
        const blogPrompt = `
    Create an engaging blog post about "${theme}" that shares insights from frontline community work.

    BLOG STYLE:
    - Conversational but informative
    - Mix of personal reflection and professional insight
    - Practical examples and real situations
    - Community voice and perspective
    - Call to action or reflection for readers

    CONTENT MIX:
    - Current work and challenges
    - Success stories and breakthroughs  
    - Community wisdom and cultural knowledge
    - Systemic analysis with human impact
    - Vision for positive change

    Recent work and insights:
    ${sources.join('\n\n---\n\n')}
    `;
        return this.generateContentFromPrompt(blogPrompt, 'blog-post');
    }
    /**
     * Build comprehensive content library from all documents
     */
    async buildContentLibrary() {
        const documentsPath = '/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs';
        // Generate team profiles from interviews
        const teamProfiles = await Promise.all([
            this.generateTeamProfile('Kristy Bloomfield', [`${documentsPath}/Interviews/Kristy1.md`, `${documentsPath}/Interviews/Kristy2.md`]),
            this.generateTeamProfile('Tanya Turner', [`${documentsPath}/Interviews/Tanya1.md`])
        ]);
        // Generate historical education pieces
        const historicalPieces = await Promise.all([
            this.generateHistoricalPiece('The Intervention: Understanding Past to Transform Present', [`${documentsPath}/Interviews/Intervention.md`]),
            this.generateHistoricalPiece('Land Rights and Cultural Authority', [`${documentsPath}/Interviews/Kristy1.md`]),
            this.generateHistoricalPiece('Truth-Telling and Community Healing', [`${documentsPath}/Interviews/Tanya1.md`])
        ]);
        // Generate transformation stories
        const caseStudies = await Promise.all([
            this.generateTransformationStory('Youth Justice and Community Healing', [`${documentsPath}/Interviews/Kristy1.md`]),
            this.generateTransformationStory('Professional Development and Community Service', [`${documentsPath}/Interviews/Tanya1.md`]),
            this.generateTransformationStory('Cultural Identity and Leadership', [`${documentsPath}/Interviews/Carride.md`])
        ]);
        // Generate ongoing blog content
        const blogPosts = await Promise.all([
            this.generateBlogPost('Daily Realities of Youth Work in Central Australia', [`${documentsPath}/Interviews/Kristy1.md`]),
            this.generateBlogPost('Justice Reinvestment: Evidence from the Frontline', [`${documentsPath}/Interviews/Tanya1.md`]),
            this.generateBlogPost('Media Narratives vs. Community Truth', [`${documentsPath}/Interviews/Intervention.md`])
        ]);
        return {
            teamProfiles,
            blogPosts,
            caseStudies,
            historicalPieces
        };
    }
    async loadSourceDocuments(filePaths) {
        const documents = [];
        for (const filePath of filePaths) {
            try {
                const content = await promises_1.default.readFile(filePath, 'utf-8');
                documents.push(content);
            }
            catch (error) {
                console.warn(`Could not load document: ${filePath}`, error);
            }
        }
        return documents;
    }
    buildContentGenerationPrompt(request, documents) {
        const baseContext = `
    You are generating content for Oonchiumpa, a community-controlled Aboriginal youth service in Central Australia.
    
    CULTURAL PROTOCOLS:
    - Always approach with respect and cultural sensitivity
    - Use community voices and quotes authentically  
    - Avoid speaking for community without attribution
    - Highlight community strength and agency
    - Challenge deficit narratives respectfully
    
    CONTENT TYPE: ${request.type}
    TONE: ${request.tone}
    AUDIENCE: ${request.targetAudience}
    CULTURAL SENSITIVITY: ${request.culturalSensitivity}
    `;
        return {
            primary: `${baseContext}\n\nSource Documents:\n${documents.join('\n\n---\n\n')}`,
            seo: `Generate SEO data for ${request.type} content about ${request.focusArea || 'Oonchiumpa community work'}`,
        };
    }
    async generateContentFromPrompt(prompt, contentType) {
        const processingResults = await this.aiOrchestrator.processInterview(prompt, { contentType });
        const content = this.extractContentFromResults(processingResults);
        const seoData = { keywords: [], description: '', tags: [] }; // Simplified for now
        // Parse and structure the generated content
        return this.structureGeneratedContent(content, seoData, null, { type: contentType });
    }
    /**
     * Extract meaningful content from AI processing results
     */
    extractContentFromResults(results) {
        // Find the best story or content result
        const storyResult = results.find(r => r.type === 'story') || results.find(r => r.type === 'outcome') || results[0];
        if (!storyResult) {
            return {
                title: 'Generated Content',
                content: 'Content generation in progress...',
                excerpt: 'AI-generated content from community documents'
            };
        }
        return {
            title: storyResult.content?.title || 'Generated Content',
            content: storyResult.content?.content || storyResult.content || 'Generated content',
            excerpt: storyResult.content?.excerpt || this.createExcerpt(storyResult.content?.content || storyResult.content),
            themes: storyResult.content?.themes || []
        };
    }
    /**
     * Safely create excerpt from content
     */
    createExcerpt(content) {
        if (typeof content === 'string') {
            return content.length > 200 ? content.substring(0, 200) + '...' : content;
        }
        if (content && typeof content === 'object') {
            const str = JSON.stringify(content);
            return str.length > 200 ? str.substring(0, 200) + '...' : str;
        }
        return 'AI-generated content from community documents';
    }
    structureGeneratedContent(content, seoData, culturalReview, request) {
        // Structure the AI-generated content into our format
        return {
            title: content.title || 'Generated Content',
            slug: content.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'generated-content',
            excerpt: content.excerpt || content.content?.substring(0, 200) + '...',
            content: content.content || content,
            metaData: {
                sourceDocuments: request.sourceDocuments || [],
                keyThemes: content.themes || [],
                culturalConsiderations: culturalReview?.considerations || [],
                recommendedImages: content.suggestedImages || []
            },
            seoData: {
                metaDescription: seoData?.description || content.excerpt || '',
                keywords: seoData?.keywords || [],
                suggestedTags: seoData?.tags || []
            }
        };
    }
    /**
     * Save generated content to database
     */
    async saveGeneratedContent(content, authorId) {
        await this.prisma.story.create({
            data: {
                title: content.title,
                slug: content.slug,
                excerpt: content.excerpt,
                content: content.content,
                isPublished: false,
                authorId: authorId,
                tags: content.seoData.suggestedTags.join(','),
                metadata: JSON.stringify(content.metaData)
            }
        });
    }
}
exports.ContentOrchestrator = ContentOrchestrator;
//# sourceMappingURL=contentOrchestrator.js.map