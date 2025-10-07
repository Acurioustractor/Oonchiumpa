# 🤖 Oonchiumpa AI-Powered Content System

## Overview
Your Oonchiumpa platform now has a comprehensive AI-powered system for processing documents, interviews, and media with cultural sensitivity and Elder consultation workflows.

## 🔑 AI Provider Setup

### Required API Keys
Add these to your `.env` file:

```bash
# Primary AI Providers
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
PERPLEXITY_API_KEY=your-perplexity-api-key-here

# Computer Vision
GOOGLE_CLOUD_VISION_API_KEY=your-google-vision-api-key-here
AZURE_COMPUTER_VISION_KEY=your-azure-vision-key-here
AZURE_COMPUTER_VISION_ENDPOINT=https://your-region.cognitiveservices.azure.com/

# Audio Processing
AZURE_SPEECH_KEY=your-azure-speech-key-here
AZURE_SPEECH_REGION=your-azure-region
ASSEMBLYAI_API_KEY=your-assemblyai-api-key-here

# Additional Services
COHERE_API_KEY=your-cohere-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
```

### Recommended AI Provider Plan

1. **OpenAI GPT-4o** ($20/month) - Text processing, interview analysis, story generation
2. **Anthropic Claude 3.5 Sonnet** ($20/month) - Cultural sensitivity analysis  
3. **Perplexity Pro** ($20/month) - Research and fact-checking
4. **Google Cloud Vision** (Pay-per-use, ~$1.50 per 1,000 images) - Photo analysis
5. **Azure Computer Vision** (Pay-per-use, backup for Google) - Image processing
6. **AssemblyAI** ($0.37/hour of audio) - Interview transcription

**Total estimated cost: ~$60-80/month for professional AI capabilities**

## 📁 Document Processing System

### 1. Bulk Upload Documents

Upload multiple documents (PDFs, Word, Markdown, images, videos):

```bash
POST /api/bulk-upload/upload
Content-Type: multipart/form-data

# Form data:
files: [multiple files]
category: "interview" | "report" | "media"  
authorUserId: "user-id"
processImmediately: true
tags: ["community", "healing", "stories"]
culturalContext: {
  "location": "Alice Springs",
  "participants": ["Kristy Bloomfield"],
  "date": "2024-08-22"
}
```

### 2. Import Your Existing Platform Documents

Import all documents from `oonchiumpa-platform/docs/`:

```bash
POST /api/bulk-upload/import-platform-docs
{
  "authorUserId": "admin-user-id",
  "processImmediately": true
}
```

This will automatically import:
- All interviews from `docs/Interviews/`
- All reports from `docs/Reports/`
- Process them with AI to extract stories and outcomes

### 3. AI Processing Results

The system automatically:

1. **Extracts Stories**: Personal narratives, cultural stories, community experiences
2. **Identifies Outcomes**: Program results, community impacts, achievements  
3. **Cultural Analysis**: Sensitivity assessment, Elder consultation requirements
4. **Content Creation**: Auto-generates database entries for stories/outcomes

## 🖼️ Media Gallery System

### Upload Media with Program Linking

```bash
POST /api/media-gallery/upload
Content-Type: multipart/form-data

# Form data:
media: [image/video files]
title: "Community Art Workshop"
description: "Elders teaching traditional painting"
programId: "outcome-id" # Link to specific programs
tags: ["art", "traditional", "community"]
location: "Alice Springs"
photographer: "Community Member"
culturalContext: {
  "ceremony": false,
  "public_sharing": true,
  "traditional_knowledge": true
}
```

### AI-Powered Media Analysis

For each uploaded image/video, AI automatically:
- **Generates descriptions** and alt-text
- **Identifies objects** and people (culturally appropriate)
- **Extracts text** from images
- **Creates thumbnails** and optimized versions
- **Suggests tags** based on content
- **Cultural sensitivity** assessment

### Advanced Gallery Features

1. **Smart Collections**: Media automatically grouped by:
   - Stories and outcomes they're linked to
   - Geographic locations  
   - Cultural themes and tags
   - Programs and workshops

2. **Semantic Search**: Search using natural language:
   ```bash
   GET /api/media-gallery/search?query=traditional%20art%20workshop
   ```

3. **Cultural Filtering**: Filter by sensitivity levels, permissions, locations

## 🎯 AI-Powered Story Generation

### Generate Narratives from Multiple Sources

```bash
POST /api/ai-orchestrator/craft-narrative
{
  "sources": {
    "interviews": ["transcript1.txt", "transcript2.txt"],
    "documents": ["report.pdf"],
    "mediaAnalysis": [aiAnalysisResults],
    "culturalContext": {
      "community": "Yuin Nation",
      "themes": ["healing", "connection to country"]
    }
  }
}
```

The AI will:
- Combine insights from interviews, reports, and media
- Respect cultural protocols and sensitivity
- Generate compelling narratives
- Flag content requiring Elder consultation
- Suggest appropriate sharing levels

## 🛡️ Cultural Safety Features

### Automatic Cultural Validation

Every piece of content is automatically scanned for:

- **Sacred/Sensitive Keywords**: dreaming, ceremony, sacred, traditional
- **Gender Restrictions**: men's business, women's business  
- **Cultural Context**: seasonal restrictions, age appropriateness
- **Elder Consultation**: Required before publishing sensitive content

### Cultural Advisory Integration

- **Krusty Bloofield** - Elder and Traditional Knowledge Keeper (Yuin Nation)
- **Uncle Robert Williams** - Senior Cultural Advisor (Dharug Nation)  
- **Aunty Patricia Thompson** - Cultural Protocol Specialist (Wiradjuri Nation)

System automatically:
1. Detects culturally sensitive content
2. Recommends appropriate Elder for consultation  
3. Blocks publication until approval received
4. Maintains audit trail of all cultural consultations

## 📊 Usage Examples

### Processing Kristy's Interview

1. **Upload**: `POST /api/bulk-upload/upload` with Kristy1.md
2. **AI Processing**: Extracts stories about:
   - Traditional ownership and connection to country
   - Family history and stolen generation experiences  
   - Cultural authority and leadership
3. **Cultural Review**: Flags content about sacred sites and traditional marriage
4. **Elder Consultation**: Recommends Krusty Bloofield for review
5. **Content Creation**: Generates stories and outcomes with proper cultural context

### Building Photo Gallery

1. **Upload Workshop Photos**: Link to specific outcome/program
2. **AI Analysis**: Identifies traditional art techniques, community members
3. **Smart Tagging**: Auto-tags with "traditional art", "community", "elders"
4. **Collections**: Photos automatically grouped by workshop/program
5. **Cultural Context**: Marks as appropriate for public sharing

### Creating Community Impact Story

1. **Multi-Source Input**: 
   - Interview transcripts from multiple community members
   - Program evaluation reports
   - Workshop photos and videos
   - Outcome metrics and data

2. **AI Narrative Crafting**:
   - Combines all sources into compelling narrative
   - Highlights community voices and perspectives
   - Maintains cultural authenticity
   - Suggests multimedia elements

3. **Cultural Validation**:
   - Automatic sensitivity assessment  
   - Elder consultation if required
   - Appropriate sharing level determination

4. **Publication**:
   - Multi-format output (web, PDF, social media)
   - Culturally appropriate imagery
   - Community attribution and acknowledgments

## 🚀 Next Steps

1. **Add your API keys** to the `.env` file
2. **Test with a small batch** of documents first
3. **Import your existing interviews and reports**
4. **Upload workshop/program photos**
5. **Generate your first AI-crafted community story**

This system transforms your raw interviews, documents, and media into polished, culturally-appropriate content that honors community voices while maintaining professional standards for impact reporting and storytelling.