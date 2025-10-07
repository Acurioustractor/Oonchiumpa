"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiOrchestrator = exports.AIOrchestrator = void 0;
const openai_1 = __importDefault(require("openai"));
class AIOrchestrator {
    openai;
    providers = new Map();
    constructor() {
        // Initialize OpenAI
        if (process.env.OPENAI_API_KEY) {
            this.openai = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY,
            });
            this.providers.set('openai', {
                name: 'OpenAI GPT-4',
                type: 'text',
                capabilities: ['story_generation', 'interview_analysis', 'content_extraction'],
                isActive: true
            });
        }
        // Register other providers based on available API keys
        this.registerProviders();
    }
    registerProviders() {
        if (process.env.ANTHROPIC_API_KEY) {
            this.providers.set('anthropic', {
                name: 'Claude 3.5 Sonnet',
                type: 'text',
                capabilities: ['cultural_sensitivity', 'ethical_review', 'narrative_crafting'],
                isActive: true
            });
        }
        if (process.env.PERPLEXITY_API_KEY) {
            this.providers.set('perplexity', {
                name: 'Perplexity AI',
                type: 'research',
                capabilities: ['fact_checking', 'cultural_context', 'research'],
                isActive: true
            });
        }
        if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
            this.providers.set('google_vision', {
                name: 'Google Cloud Vision',
                type: 'vision',
                capabilities: ['photo_analysis', 'text_extraction', 'cultural_artifact_identification'],
                isActive: true
            });
        }
        if (process.env.AZURE_COMPUTER_VISION_KEY) {
            this.providers.set('azure_vision', {
                name: 'Azure Computer Vision',
                type: 'vision',
                capabilities: ['image_analysis', 'facial_detection', 'scene_understanding'],
                isActive: true
            });
        }
    }
    /**
     * Process interview transcript with multiple AI providers
     */
    async processInterview(transcript, metadata = {}) {
        const results = [];
        try {
            // OpenAI: Extract stories and key insights
            if (this.providers.get('openai')?.isActive) {
                const storyExtraction = await this.extractStoriesWithOpenAI(transcript, metadata);
                results.push(...storyExtraction);
            }
            // Anthropic: Cultural sensitivity analysis
            if (this.providers.get('anthropic')?.isActive) {
                const culturalAnalysis = await this.analyzeCulturalSensitivity(transcript);
                results.push(culturalAnalysis);
            }
            // Perplexity: Research and context validation
            if (this.providers.get('perplexity')?.isActive) {
                const contextAnalysis = await this.validateCulturalContext(transcript);
                results.push(contextAnalysis);
            }
            return results;
        }
        catch (error) {
            console.error('Error in interview processing:', error);
            throw error;
        }
    }
    /**
     * Analyze photos with computer vision
     */
    async analyzeMedia(mediaUrl, mediaType) {
        const results = [];
        try {
            if (mediaType === 'image') {
                // Google Vision API
                if (this.providers.get('google_vision')?.isActive) {
                    const visionResult = await this.analyzeImageWithGoogle(mediaUrl);
                    results.push(visionResult);
                }
                // Azure Computer Vision (backup/comparison)
                if (this.providers.get('azure_vision')?.isActive) {
                    const azureResult = await this.analyzeImageWithAzure(mediaUrl);
                    results.push(azureResult);
                }
            }
            return results;
        }
        catch (error) {
            console.error('Error in media analysis:', error);
            throw error;
        }
    }
    /**
     * Generate comprehensive narrative from multiple sources
     */
    async craftNarrative(sources) {
        try {
            const prompt = this.buildNarrativeCraftingPrompt(sources);
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert Aboriginal storyteller and cultural content creator. Your role is to respectfully craft narratives from community interviews, documents, and media while maintaining cultural authenticity and sensitivity.

IMPORTANT CULTURAL GUIDELINES:
- Always respect sacred and sensitive cultural content
- Acknowledge traditional owners and cultural contexts
- Use appropriate Aboriginal English and terminology
- Highlight community voices and perspectives
- Ensure cultural protocols are followed
- Flag any content that requires Elder consultation

Your output should be culturally appropriate, engaging, and honor the community's stories.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            });
            const narrative = completion.choices[0]?.message?.content || '';
            return {
                provider: 'openai',
                type: 'story',
                content: {
                    narrative,
                    structure: this.analyzeNarrativeStructure(narrative),
                    culturalElements: this.identifyCulturalElements(narrative)
                },
                confidence: 0.85,
                culturalSensitivity: await this.assessCulturalSensitivity(narrative)
            };
        }
        catch (error) {
            console.error('Error in narrative crafting:', error);
            throw error;
        }
    }
    /**
     * OpenAI story extraction from interviews
     */
    async extractStoriesWithOpenAI(transcript, metadata) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert in extracting stories, outcomes, and cultural insights from Aboriginal community interviews. 

Extract the following types of content:
1. STORIES: Personal narratives, cultural stories, community experiences
2. OUTCOMES: Program results, community impacts, achievements  
3. CULTURAL INSIGHTS: Traditional knowledge, cultural connections, community values

For each extracted item, provide:
- Title
- Content/Description
- Type (story/outcome/cultural_insight)
- Cultural significance level (public/community/restricted)
- Key themes and tags
- Connection to Country/culture

Format as JSON array with these fields.`
                    },
                    {
                        role: 'user',
                        content: `Interview transcript:\n\n${transcript}\n\nMetadata: ${JSON.stringify(metadata, null, 2)}`
                    }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            });
            const extracted = JSON.parse(completion.choices[0]?.message?.content || '{}');
            return (extracted.items || []).map((item) => ({
                provider: 'openai',
                type: item.type,
                content: item,
                confidence: 0.8,
                culturalSensitivity: {
                    requiresReview: item.cultural_significance !== 'public',
                    sensitivityLevel: this.mapSensitivityLevel(item.cultural_significance),
                    recommendations: item.cultural_recommendations || []
                }
            }));
        }
        catch (error) {
            console.error('OpenAI extraction error:', error);
            return [];
        }
    }
    /**
     * Anthropic cultural sensitivity analysis
     */
    async analyzeCulturalSensitivity(content) {
        try {
            // This would use Anthropic's Claude API
            // For now, implementing with OpenAI as a placeholder
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are a cultural sensitivity expert specializing in Aboriginal Australian content. Analyze content for cultural appropriateness, sensitivity levels, and provide recommendations for respectful sharing.

Assess:
- Cultural sensitivity level (LOW/MEDIUM/HIGH/SACRED)
- Sacred or restricted content indicators
- Traditional knowledge elements
- Recommendations for sharing protocols
- Required cultural consultations`
                    },
                    {
                        role: 'user',
                        content: `Analyze this content for cultural sensitivity:\n\n${content}`
                    }
                ],
                temperature: 0.1
            });
            const analysis = completion.choices[0]?.message?.content || '';
            return {
                provider: 'anthropic',
                type: 'cultural_insight',
                content: {
                    analysis,
                    recommendations: this.extractRecommendations(analysis)
                },
                confidence: 0.9,
                culturalSensitivity: {
                    requiresReview: analysis.includes('HIGH') || analysis.includes('SACRED'),
                    sensitivityLevel: this.determineSensitivityLevel(analysis),
                    recommendations: this.extractRecommendations(analysis)
                }
            };
        }
        catch (error) {
            console.error('Cultural sensitivity analysis error:', error);
            return {
                provider: 'anthropic',
                type: 'cultural_insight',
                content: { error: 'Analysis failed' },
                confidence: 0,
                culturalSensitivity: {
                    requiresReview: true,
                    sensitivityLevel: 'HIGH',
                    recommendations: ['Manual review required due to analysis error']
                }
            };
        }
    }
    /**
     * Perplexity research and context validation
     */
    async validateCulturalContext(content) {
        // Placeholder - would implement with Perplexity API
        return {
            provider: 'perplexity',
            type: 'cultural_insight',
            content: {
                contextValidation: 'Context validation would be performed here',
                research: 'Additional research and fact-checking results'
            },
            confidence: 0.7
        };
    }
    /**
     * Google Vision image analysis
     */
    async analyzeImageWithGoogle(imageUrl) {
        // Placeholder - would implement with Google Cloud Vision API
        return {
            provider: 'google_vision',
            type: 'metadata',
            content: {
                objects: [],
                text: '',
                culturalArtifacts: [],
                faces: [],
                landmarks: []
            },
            confidence: 0.8
        };
    }
    /**
     * Azure Computer Vision analysis
     */
    async analyzeImageWithAzure(imageUrl) {
        // Placeholder - would implement with Azure Computer Vision API
        return {
            provider: 'azure_vision',
            type: 'metadata',
            content: {
                description: '',
                tags: [],
                categories: [],
                faces: [],
                objects: []
            },
            confidence: 0.8
        };
    }
    // Helper methods
    buildNarrativeCraftingPrompt(sources) {
        let prompt = "Craft a compelling narrative from the following sources:\n\n";
        if (sources.interviews) {
            prompt += "INTERVIEWS:\n" + sources.interviews.join("\n\n") + "\n\n";
        }
        if (sources.documents) {
            prompt += "DOCUMENTS:\n" + sources.documents.join("\n\n") + "\n\n";
        }
        if (sources.mediaAnalysis) {
            prompt += "MEDIA ANALYSIS:\n" + JSON.stringify(sources.mediaAnalysis, null, 2) + "\n\n";
        }
        prompt += `Create a narrative that:
- Honors the community voices and experiences
- Maintains cultural authenticity and respect
- Highlights key outcomes and impacts
- Connects to Country and cultural identity
- Is engaging and accessible to diverse audiences
- Follows Aboriginal storytelling traditions where appropriate`;
        return prompt;
    }
    analyzeNarrativeStructure(narrative) {
        // Simple structure analysis
        const paragraphs = narrative.split('\n\n').length;
        const wordCount = narrative.split(' ').length;
        return {
            paragraphs,
            wordCount,
            estimatedReadingTime: Math.ceil(wordCount / 200) // minutes
        };
    }
    identifyCulturalElements(narrative) {
        const culturalKeywords = [
            'country', 'dreaming', 'elders', 'traditional', 'sacred',
            'community', 'ancestors', 'culture', 'aboriginal', 'indigenous'
        ];
        return culturalKeywords.filter(keyword => narrative.toLowerCase().includes(keyword));
    }
    async assessCulturalSensitivity(content) {
        const sensitiveKeywords = ['sacred', 'ceremony', 'restricted', 'men\'s business', 'women\'s business'];
        const hasSensitiveContent = sensitiveKeywords.some(keyword => content.toLowerCase().includes(keyword));
        return {
            requiresReview: hasSensitiveContent,
            sensitivityLevel: hasSensitiveContent ? 'HIGH' : 'MEDIUM',
            recommendations: hasSensitiveContent ?
                ['Requires Elder consultation before publication'] :
                ['Standard cultural review recommended']
        };
    }
    mapSensitivityLevel(level) {
        switch (level.toLowerCase()) {
            case 'public': return 'LOW';
            case 'community': return 'MEDIUM';
            case 'restricted': return 'HIGH';
            case 'sacred': return 'SACRED';
            default: return 'MEDIUM';
        }
    }
    determineSensitivityLevel(analysis) {
        if (analysis.includes('SACRED'))
            return 'SACRED';
        if (analysis.includes('HIGH'))
            return 'HIGH';
        if (analysis.includes('MEDIUM'))
            return 'MEDIUM';
        return 'LOW';
    }
    extractRecommendations(analysis) {
        // Simple extraction - would be more sophisticated in practice
        const lines = analysis.split('\n');
        return lines
            .filter(line => line.includes('recommend') || line.includes('should'))
            .slice(0, 3); // Top 3 recommendations
    }
    /**
     * Get available providers and their status
     */
    getProviderStatus() {
        return Object.fromEntries(this.providers.entries());
    }
}
exports.AIOrchestrator = AIOrchestrator;
exports.aiOrchestrator = new AIOrchestrator();
//# sourceMappingURL=aiOrchestrator.js.map