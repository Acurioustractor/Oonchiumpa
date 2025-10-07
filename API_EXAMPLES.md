# 🔌 Oonchiumpa API Examples

## 🎯 Quick Reference
- [🔐 Authentication](#-authentication-examples) - Login, register, tokens
- [📄 Content](#-content-management) - Blog posts, stories, publishing  
- [📤 Media](#-media--file-uploads) - Photos, videos, documents
- [🤖 AI Generation](#-ai-content-generation) - Custom content, analysis
- [🎥 Video Examples](#-video-integration) - YouTube, direct uploads

---

## 🔐 Authentication Examples

### 👤 **User Registration**

```bash
# Create new staff account
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Wilson",
    "email": "sarah@oonchiumpa.com", 
    "password": "securepass123",
    "role": "COMMUNITY_COORDINATOR"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cmendp7sh0000lutjbnxonf1w",
    "email": "sarah@oonchiumpa.com",
    "name": "Sarah Wilson", 
    "role": "COMMUNITY_COORDINATOR",
    "createdAt": "2025-08-22T22:04:56.370Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔑 **User Login**

```bash
# Login with existing account
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kristy@oonchiumpa.com",
    "password": "oonchiumpa123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "cmendp7sh0000lutjbnxonf1w",
    "email": "kristy@oonchiumpa.com", 
    "name": "Kristy Bloomfield",
    "role": "ADMIN",
    "avatar": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔄 **Token Refresh**

```bash
# Refresh expired access token
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmendp7sh0000lutjbnxonf1w",
    "email": "kristy@oonchiumpa.com",
    "name": "Kristy Bloomfield",
    "role": "ADMIN"
  }
}
```

---

## 📄 Content Management

### 📚 **Get Published Blog Posts** (Public)

```bash
# Fetch latest blog posts (no auth required)
curl -X GET "http://localhost:3001/api/content/blog-posts?limit=5&offset=0"
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "clp123456789",
      "title": "Traditional Law Teaching: Ancient Wisdom for Modern Justice",
      "excerpt": "Elder Mary shares profound insights into traditional Aboriginal law systems...",
      "content": "In the heart of our community, Elder Mary Wilson gathered the young ones...",
      "author": "Editorial Team",
      "publishedAt": "2025-08-22T22:00:00.000Z",
      "tags": ["Traditional Law", "Elder Wisdom", "Community Justice"],
      "type": "historical-piece",
      "readTime": 4,
      "heroImage": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1234567890/oonchiumpa/law-teaching.jpg",
      "gallery": [
        "https://res.cloudinary.com/dzwywf1gw/image/upload/v1234567890/oonchiumpa/gathering.jpg"
      ],
      "curatedBy": "Oonchiumpa Editorial Team",
      "culturalReview": "Elder Approved"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### ✍️ **Create Blog Post** (Staff Only)

```bash
# Create new blog post
curl -X POST http://localhost:3001/api/content/blog-posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Family Healing Circle: Strengthening Community Bonds",
    "excerpt": "A powerful gathering where three generations shared stories of healing, resilience, and hope for the future.",
    "content": "Under the old gum tree, three generations of the Johnson family sat in circle. Grandmother Alice, her weathered hands gesturing as she spoke of the old ways. Her daughter Patricia, bridging tradition and modernity. And young Tommy, sixteen and full of questions about his heritage...\n\nThis healing circle represented more than just family conversation—it embodied the living tradition of Aboriginal storytelling, the passing of knowledge from Elder to youth, and the healing power of authentic connection to culture and country.",
    "type": "community-story",
    "tags": ["Family Healing", "Intergenerational", "Cultural Connection", "Storytelling"],
    "heroImage": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1234567890/oonchiumpa/family-circle.jpg"
  }'
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "clp987654321",
    "title": "Family Healing Circle: Strengthening Community Bonds",
    "excerpt": "A powerful gathering where three generations shared stories...",
    "content": "Under the old gum tree, three generations...",
    "author": "Editorial Team",
    "publishedAt": "2025-08-22T22:15:00.000Z",
    "tags": ["Family Healing", "Intergenerational", "Cultural Connection"],
    "type": "community-story",
    "readTime": 3,
    "heroImage": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1234567890/oonchiumpa/family-circle.jpg",
    "gallery": [],
    "status": "DRAFT"
  }
}
```

### 📊 **Staff Dashboard Stats**

```bash
# Get dashboard statistics (staff only)
curl -X GET http://localhost:3001/api/content/dashboard-stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "documentsPending": 5,
    "storiesInReview": 12,
    "publishedThisMonth": 18,
    "totalContent": 67
  }
}
```

### 📋 **Content Queue** (Staff Portal)

```bash
# Get staff content queue
curl -X GET http://localhost:3001/api/content/queue \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response:**
```json
{
  "success": true,
  "queue": [
    {
      "id": "clp111222333",
      "title": "Traditional Fishing Techniques Workshop",
      "author": "Editorial Team",
      "status": "pending-approval",
      "createdAt": "2025-08-22T21:30:00.000Z",
      "type": "cultural-insight"
    },
    {
      "id": "clp444555666",
      "title": "Youth Leadership Program Results",
      "author": "Sarah Wilson",
      "status": "draft", 
      "createdAt": "2025-08-22T20:45:00.000Z",
      "type": "youth-work"
    }
  ],
  "stats": {
    "drafts": 8,
    "inReview": 4,
    "culturalReview": 0,
    "total": 12
  }
}
```

---

## 📤 Media & File Uploads

### 📷 **Single Image Upload**

```bash
# Upload single image with context
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "image=@traditional-ceremony.jpg" \
  -F "context=cultural-event"
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "oonchiumpa/cultural-event/cultural-event_1755900631160",
    "url": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1755900632/oonchiumpa/cultural-event/cultural-event_1755900631160.jpg",
    "filename": "traditional-ceremony.jpg",
    "size": 245760,
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "context": "cultural-event",
    "uploadedAt": "2025-08-22T22:10:33.093Z"
  }
}
```

### 🎬 **Video Upload with Metadata**

```bash
# Upload video file with detailed metadata
curl -X POST http://localhost:3001/api/media-gallery/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "media=@elder-teaching.mp4" \
  -F "title=Elder Teaching Traditional Law" \
  -F "description=Uncle Robert shares ancient law traditions with community youth" \
  -F "tags=Traditional Law,Elder Teaching,Youth Education" \
  -F "culturalContext={\"sensitivity\":\"COMMUNITY\",\"elderApproval\":true}"
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "clv123456789",
      "type": "VIDEO",
      "originalUrl": "https://res.cloudinary.com/dzwywf1gw/video/upload/v1755900800/oonchiumpa/elder-teaching.mp4",
      "thumbnailUrl": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1755900801/oonchiumpa/elder-teaching_thumb.jpg", 
      "cdnUrl": "https://res.cloudinary.com/dzwywf1gw/video/upload/q_auto/oonchiumpa/elder-teaching.mp4",
      "title": "Elder Teaching Traditional Law",
      "description": "Uncle Robert shares ancient law traditions with community youth",
      "tags": ["Traditional Law", "Elder Teaching", "Youth Education"],
      "processingStatus": "COMPLETED",
      "sensitivityLevel": "COMMUNITY",
      "filename": "elder-teaching.mp4",
      "fileSize": 52428800,
      "mimeType": "video/mp4",
      "width": 1920,
      "height": 1080,
      "duration": 420,
      "aiDescription": "Video shows Elder teaching traditional law concepts to attentive youth audience",
      "culturalContext": "Elder-guided traditional knowledge sharing session"
    }
  ]
}
```

### 📁 **Bulk File Upload**

```bash
# Upload multiple images at once
curl -X POST http://localhost:3001/api/upload/images \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg" \
  -F "images=@photo3.jpg" \
  -F "context=community-event"
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "oonchiumpa/community-event/community-event_1755900900",
      "url": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1755900901/oonchiumpa/community-event/photo1.jpg",
      "filename": "photo1.jpg"
    },
    {
      "id": "oonchiumpa/community-event/community-event_1755900902", 
      "url": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1755900903/oonchiumpa/community-event/photo2.jpg",
      "filename": "photo2.jpg"
    }
  ],
  "uploadedCount": 3,
  "totalSize": 1572864
}
```

---

## 🤖 AI Content Generation

### ✨ **Custom Content Generation**

```bash
# Generate content from uploaded documents
curl -X POST http://localhost:3001/api/content-generator/custom \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "community-story",
    "focusArea": "Youth leadership development through traditional mentorship",
    "sourceDocuments": ["youth-leadership-interview.pdf", "mentor-session-notes.docx"],
    "documentType": "family-conversations",
    "culturalContext": {
      "sensitivity": "COMMUNITY",
      "elderGuidance": true,
      "traditionalKnowledge": false
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "content": {
    "title": "Growing Strong Leaders: Traditional Mentorship in Modern Times",
    "excerpt": "When sixteen-year-old Marcus began his journey with Elder Uncle James, neither knew they were embarking on a transformation that would ripple through generations.",
    "content": "The morning mist clung to the river as Marcus arrived early for his first mentorship session with Uncle James. At sixteen, Marcus carried the weight of community expectations—gifted in school, natural leader among his peers, but disconnected from the cultural foundations that could truly ground his leadership...\n\nOver twelve months of patient guidance, Uncle James didn't just teach Marcus about traditional leadership—he helped him discover the leader that already existed within. Through story, ceremony, and countless conversations by the river, a remarkable transformation unfolded.\n\nToday, Marcus mentors younger community members, bridging ancient wisdom with contemporary challenges. His journey exemplifies how traditional mentorship creates not just leaders, but cultural bearers who strengthen community bonds across generations.",
    "metaData": {
      "keyThemes": [
        "Traditional Mentorship",
        "Youth Leadership", 
        "Cultural Connection",
        "Intergenerational Wisdom",
        "Community Strengthening"
      ],
      "culturalConsiderations": [
        "Elder guidance incorporated throughout",
        "Traditional teaching methods respected",
        "Community consent for story sharing"
      ],
      "recommendedImages": [
        "river-mentorship-session.jpg",
        "youth-elder-conversation.jpg",
        "community-leadership-circle.jpg"
      ],
      "sourceDocuments": [
        "youth-leadership-interview.pdf",
        "mentor-session-notes.docx"
      ],
      "wordCount": 1247,
      "readingTime": 5,
      "aiProvider": "anthropic-claude-3.5",
      "generatedAt": "2025-08-22T22:30:00.000Z"
    },
    "seoData": {
      "keywords": [
        "Aboriginal youth leadership",
        "traditional mentorship",
        "cultural education",
        "community development"
      ],
      "metaDescription": "Discover how traditional Aboriginal mentorship transforms young leaders through the inspiring journey of Marcus and Elder Uncle James."
    }
  }
}
```

### 👥 **Team Profile Generation**

```bash
# Generate team member profile from interview
curl -X POST http://localhost:3001/api/content-generator/team-profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "memberName": "Sarah Wilson",
    "interviewFiles": ["sarah-interview-transcript.pdf"]
  }'
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "title": "Sarah Wilson: Bridging Communities Through Compassionate Leadership",
    "excerpt": "Community Coordinator Sarah Wilson brings fifteen years of grassroots organizing experience and an unshakeable commitment to cultural healing.",
    "content": "Sarah Wilson's journey to community leadership began not in boardrooms or classrooms, but in the living rooms of families seeking healing and connection...",
    "metaData": {
      "profileType": "team-member",
      "memberRole": "Community Coordinator", 
      "keyStrengths": [
        "Family engagement",
        "Cultural sensitivity",
        "Grassroots organizing",
        "Healing-centered approach"
      ],
      "communityImpact": [
        "150+ families supported",
        "12 healing circles facilitated",
        "3 community programs developed"
      ]
    }
  }
}
```

### 📊 **Case Study Generation**

```bash
# Generate case study from outcome data
curl -X POST http://localhost:3001/api/content-generator/case-study \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "Cultural Connections Youth Program",
    "outcomeData": {
      "participantCount": 24,
      "completionRate": 92,
      "culturalKnowledgeIncrease": 78,
      "communityEngagementImprovement": 85
    },
    "testimonials": [
      "This program helped me connect with my culture in ways I never thought possible - Emma, 17"
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "caseStudy": {
    "title": "Cultural Connections: Transforming Youth Through Cultural Immersion",
    "excerpt": "How 24 young people rediscovered their cultural identity and strengthened community bonds through innovative programming.",
    "content": "When the Cultural Connections Youth Program launched eighteen months ago, coordinators hoped to reach twelve young people. By program's end, 24 youth had not only participated but become cultural ambassadors...",
    "metaData": {
      "programDuration": "18 months",
      "keyOutcomes": [
        "92% program completion rate",
        "78% increase in cultural knowledge",
        "85% improvement in community engagement"
      ],
      "impactMetrics": {
        "participantRetention": "High",
        "communityFeedback": "Overwhelmingly positive",
        "culturalLearning": "Significant improvement"
      }
    }
  }
}
```

---

## 🎥 Video Integration

### 📺 **YouTube Video Embedding**

#### **Frontend Implementation:**
```javascript
// Automatic YouTube URL to embed conversion
const VideoPlayer = ({ url, title }) => {
  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}` 
    : url;

  return (
    <div className="aspect-video rounded-2xl overflow-hidden">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};
```

#### **API Usage:**
```bash
# Add YouTube video to story content
curl -X POST http://localhost:3001/api/content/blog-posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Elder Teaching Session: Traditional Fishing",
    "content": "Uncle Robert demonstrates traditional fishing techniques...",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "type": "cultural-insight"
  }'
```

### 🎬 **Direct Video Upload & Processing**

```bash
# Upload video file with auto-processing
curl -X POST http://localhost:3001/api/media-gallery/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "media=@fishing-demonstration.mp4" \
  -F "title=Traditional Fishing Techniques" \
  -F "description=Uncle Robert demonstrates traditional Aboriginal fishing methods using handmade tools and ancestral knowledge" \
  -F "culturalContext={\"elderTeaching\":true,\"traditionalKnowledge\":true,\"sensitivity\":\"COMMUNITY\"}"
```

### 📱 **Video Gallery API**

```bash
# Fetch all videos for gallery display
curl -X GET http://localhost:3001/api/media/videos
```

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "id": "clv789012345",
      "url": "https://res.cloudinary.com/dzwywf1gw/video/upload/oonchiumpa/fishing-demo.mp4",
      "thumbnailUrl": "https://res.cloudinary.com/dzwywf1gw/image/upload/oonchiumpa/fishing-demo_thumb.jpg",
      "title": "Traditional Fishing Techniques",
      "description": "Uncle Robert demonstrates traditional Aboriginal fishing methods...",
      "duration": 480,
      "width": 1920,
      "height": 1080,
      "tags": ["Traditional Knowledge", "Fishing", "Elder Teaching"],
      "culturalContext": "Elder-guided traditional skills demonstration"
    },
    {
      "id": "youtube_dQw4w9WgXcQ",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
      "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "title": "Community Healing Circle",
      "description": "Families share stories of healing and connection",
      "type": "youtube",
      "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ]
}
```

---

## 🚨 Error Handling Examples

### 🔐 **Authentication Errors**

```bash
# Request without token
curl -X GET http://localhost:3001/api/content/dashboard-stats
```

**Error Response:**
```json
{
  "success": false,
  "error": "Access token required"
}
```

```bash
# Request with invalid token
curl -X GET http://localhost:3001/api/content/dashboard-stats \
  -H "Authorization: Bearer invalid_token_here"
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 📤 **Upload Errors**

```bash
# Upload unsupported file type
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer valid_token" \
  -F "image=@document.txt"
```

**Error Response:**
```json
{
  "error": "Error",
  "message": "Only image files (JPEG, PNG, WebP, GIF) are allowed"
}
```

### 🤖 **AI Service Errors**

```bash
# AI generation with quota exceeded
curl -X POST http://localhost:3001/api/content-generator/custom \
  -H "Authorization: Bearer valid_token" \
  -H "Content-Type: application/json" \
  -d '{"type":"blog-post","focusArea":"test"}'
```

**Error Response:**
```json
{
  "success": false,
  "error": "AI service quota exceeded. Please try again later."
}
```

---

## 🧪 Testing Workflows

### 🔄 **Complete Content Creation Flow**

```bash
#!/bin/bash
# Complete workflow: Login → Upload → Generate → Publish

# 1. Login and get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kristy@oonchiumpa.com","password":"oonchiumpa123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

# 2. Upload source document
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@interview-notes.pdf" \
  -F "context=family-conversations")

# 3. Generate content from uploaded document
CONTENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/content-generator/custom \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "community-story",
    "focusArea": "Healing and reconciliation through family dialogue",
    "sourceDocuments": ["interview-notes.pdf"],
    "documentType": "family-conversations"
  }')

# 4. Create blog post with generated content
CONTENT_TITLE=$(echo $CONTENT_RESPONSE | jq -r '.content.title')
CONTENT_EXCERPT=$(echo $CONTENT_RESPONSE | jq -r '.content.excerpt')
CONTENT_BODY=$(echo $CONTENT_RESPONSE | jq -r '.content.content')

BLOG_RESPONSE=$(curl -s -X POST http://localhost:3001/api/content/blog-posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$CONTENT_TITLE\",
    \"excerpt\": \"$CONTENT_EXCERPT\",
    \"content\": \"$CONTENT_BODY\",
    \"type\": \"community-story\"
  }")

echo "✅ Content creation workflow completed!"
echo "📄 Blog Post ID: $(echo $BLOG_RESPONSE | jq -r '.post.id')"
```

### 📊 **Health Check Endpoints**

```bash
# Check all services are running
curl -s http://localhost:3001/api/health && echo "✅ Backend API"
curl -s http://localhost:5173 && echo "✅ Frontend App"

# Test database connection
curl -s -X GET http://localhost:3001/api/content/blog-posts | jq '.success'

# Test AI services (requires auth)
curl -s -X POST http://localhost:3001/api/content-generator/custom \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"test","focusArea":"health check"}' | jq '.success'
```

---

## 🌟 **Ready to Build!**

These API examples provide everything needed to:

- ✅ **Authenticate users** with secure JWT tokens
- ✅ **Create and manage content** with cultural sensitivity  
- ✅ **Upload photos and videos** with AI analysis
- ✅ **Generate authentic content** from community documents
- ✅ **Integrate YouTube videos** seamlessly
- ✅ **Handle errors gracefully** with proper responses

**🎯 Start building authentic Aboriginal community platforms with confidence!**