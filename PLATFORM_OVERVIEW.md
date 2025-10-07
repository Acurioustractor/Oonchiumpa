# 🏛️ Oonchiumpa Platform - Complete Overview

## 📋 Table of Contents
- [Platform Architecture](#platform-architecture)
- [Getting Started](#getting-started)
- [User Guides](#user-guides)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)

---

## 🏗️ Platform Architecture

### 🎯 **What is Oonchiumpa?**
A culturally-sensitive content management platform for Aboriginal communities to share stories, track outcomes, and preserve cultural knowledge with Elder approval workflows.

### 🔧 **Core Components**

```
oonchiumpa-platform/
├── 🌐 Frontend App (React/Vite)    → Public website & content display
├── 🏢 Backend API (Node.js/Express) → Authentication, content management, AI
├── 🗄️  Database (PostgreSQL/Prisma) → Stories, outcomes, media, users
├── 🤖 AI Services (OpenAI/Anthropic) → Content generation, cultural analysis
└── ☁️  Media Storage (Cloudinary)   → Images, videos, documents
```

### 🌟 **Key Features**
- ✅ **Cultural Protocols**: Elder approval workflows
- ✅ **AI Content Generation**: From interviews and documents
- ✅ **Media Management**: Photos, videos, documents
- ✅ **Authentication**: Role-based access (Admin, Elder, Staff)
- ✅ **Responsive Design**: Aboriginal cultural design system
- ✅ **Multi-Provider AI**: OpenAI, Anthropic, Perplexity integration

---

## 🚀 Getting Started

### 📦 **Quick Start**

1. **Clone & Setup**
   ```bash
   cd /Users/benknight/Code/Oochiumpa/oonchiumpa-backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Database is already configured
   # AI keys are already set up
   # Check .env file for current config
   ```

3. **Start Services**
   ```bash
   # Backend API (Port 3001)
   cd oonchiumpa-backend && npm run dev
   
   # Frontend App (Port 5173)
   cd oonchiumpa-app && npm run dev
   ```

4. **Access Platform**
   - 🌐 **Public Site**: http://localhost:5173
   - 🔐 **Staff Login**: http://localhost:5173/login
   - 🏢 **Staff Portal**: http://localhost:5173/staff-portal

### 👤 **Default Users**
```
Admin Account:
Email: kristy@oonchiumpa.com
Password: oonchiumpa123
Role: ADMIN (Full access)
```

---

## 📚 User Guides

### 🎭 **For Community Members**

#### **Viewing Stories & Outcomes**
1. Visit http://localhost:5173
2. Navigate through:
   - **Stories**: Community narratives and experiences
   - **Outcomes**: Impact metrics and achievements
   - **Blog**: Latest news and insights

#### **Photo & Video Galleries**
- **Stories Page**: View embedded videos and photo galleries
- **Outcomes Page**: Visual impact documentation
- **Interactive Media**: Click to view full-size content

### 🏛️ **For Staff Members**

#### **Accessing Staff Portal**
1. Go to http://localhost:5173/login
2. Login with your credentials
3. Access http://localhost:5173/staff-portal

#### **Document Processing**
1. **Upload Documents**:
   - Law teaching sessions
   - Family conversations
   - Historical materials
   - Research interviews

2. **AI Content Generation**:
   - Select document type
   - Upload files (PDF, DOCX, images)
   - AI automatically generates stories and insights

3. **Content Review**:
   - Review AI-generated content
   - Edit and refine before publication
   - Submit for Elder approval if needed

#### **Media Management**
1. **Photo Uploads**:
   - Drag & drop images
   - Add descriptions and tags
   - Set cultural sensitivity levels

2. **Video Integration**:
   - Upload video files (MP4, WebM)
   - Add YouTube links (auto-embed)
   - Generate thumbnails automatically

### 👴 **For Elders & Cultural Advisors**

#### **Cultural Review Process**
1. **Content Approval**:
   - Review flagged content
   - Approve or request changes
   - Add cultural guidance notes

2. **Cultural Protocols**:
   - Set sensitivity levels
   - Review traditional knowledge
   - Ensure proper attribution

---

## 💻 Development Guide

### 🛠️ **Technical Stack**

#### **Frontend** (oonchiumpa-app/)
```javascript
// React + TypeScript + Vite
// Tailwind CSS with Aboriginal color palette
// Context-based authentication
// Component library with cultural design
```

#### **Backend** (oonchiumpa-backend/)
```javascript
// Node.js + Express + TypeScript
// PostgreSQL + Prisma ORM
// JWT authentication with role-based permissions
// Multi-provider AI integration
// Cloudinary media storage
```

#### **Database Schema**
```sql
-- Core Models
Users (Admin, Elder, Staff, Community)
Stories (narratives with cultural metadata)
Outcomes (impact tracking)
MediaItems (photos, videos with AI analysis)
GeneratedContent (AI-created content)
CulturalAdvisors (Elder approval system)
```

### 🔌 **API Endpoints**

#### **Authentication**
```http
POST /api/auth/register    # Create account
POST /api/auth/login       # User login
POST /api/auth/refresh     # Token refresh
GET  /api/auth/me          # Get user info
```

#### **Content Management**
```http
GET  /api/content/blog-posts     # Public blog posts
POST /api/content/blog-posts     # Create content (Staff)
GET  /api/content/queue          # Staff content queue
GET  /api/content/dashboard-stats # Dashboard metrics
```

#### **Media & Uploads**
```http
POST /api/upload/image           # Upload single image
POST /api/upload/images          # Bulk image upload
GET  /api/upload/images          # List uploaded images
POST /api/media-gallery/upload   # Advanced media upload
```

#### **AI Content Generation**
```http
POST /api/content-generator/custom        # Custom content
POST /api/content-generator/team-profile  # Team profiles
POST /api/content-generator/case-study    # Case studies
```

### 🎨 **Design System**

#### **Aboriginal Color Palette**
```css
/* Earth Tones */
--earth-50: #fef7f0;   /* Light earth */
--earth-900: #451a03;  /* Dark earth */

/* Ochre (Primary) */
--ochre-500: #ea580c;  /* Traditional ochre */

/* Eucalyptus */
--eucalyptus-500: #059669; /* Native green */

/* Sand */
--sand-200: #fde68a;   /* Desert sand */
```

#### **Components**
- **Card**: Elevated content containers
- **Button**: Accessible action elements  
- **VideoPlayer**: YouTube + direct video support
- **Loading**: Culturally-appropriate loading states

---

## 📖 API Documentation

### 🔐 **Authentication Required**
All protected endpoints require:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 📝 **Content Creation Flow**

#### **1. Upload Document**
```bash
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@document.pdf" \
  -F "context=law-teaching"
```

#### **2. Generate Content**
```bash
curl -X POST http://localhost:3001/api/content-generator/custom \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "historical-piece",
    "focusArea": "Traditional law teaching",
    "sourceDocuments": ["document.pdf"]
  }'
```

#### **3. Review & Publish**
- Content appears in staff queue
- Elder review (if required)
- Publication to public site

### 🎥 **Video Integration**

#### **YouTube Embeds**
```javascript
// Automatic YouTube URL conversion
const videoUrl = "https://www.youtube.com/watch?v=YOUR_VIDEO_ID";
// Renders as responsive iframe embed
```

#### **Direct Video Upload**
```bash
curl -X POST http://localhost:3001/api/media-gallery/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@video.mp4" \
  -F "title=Traditional Teaching" \
  -F "culturalContext={\"sensitivity\":\"COMMUNITY\"}"
```

---

## 🌟 **Platform Highlights**

### ✨ **Cultural Features**
- 🛡️ **Elder Approval Workflows**
- 🎨 **Aboriginal Design System**  
- 🔒 **Cultural Sensitivity Controls**
- 👥 **Community-Centered Content**

### 🤖 **AI Capabilities**
- 📄 **Document Analysis** (PDF, DOCX, images)
- 🎬 **Video Content Analysis**
- 📝 **Story Generation** from interviews
- 🏛️ **Cultural Context Analysis**

### 🚀 **Technical Excellence**
- ⚡ **Fast Loading** (Vite + optimized assets)
- 📱 **Mobile Responsive** (Tailwind CSS)
- 🔒 **Secure Authentication** (JWT + role-based)
- 🌐 **Scalable Architecture** (Node.js + PostgreSQL)

---

## 🎯 **What's Next?**

The platform is **production-ready** with:
- ✅ Complete authentication system
- ✅ Real database operations  
- ✅ AI content generation
- ✅ Media upload & management
- ✅ Cultural approval workflows

**Ready for authentic community storytelling!** 🌟