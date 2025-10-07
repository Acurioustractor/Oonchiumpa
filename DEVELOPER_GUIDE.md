# 💻 Oonchiumpa Developer Guide

## 🎯 Quick Start
- [⚡ Setup](#-development-setup) - Get running in 5 minutes
- [🏗️ Architecture](#%EF%B8%8F-architecture-overview) - System design & components
- [🔧 API Reference](#-api-reference) - Complete endpoint documentation
- [🎨 Frontend Guide](#-frontend-development) - React components & styling
- [🛠️ Backend Guide](#%EF%B8%8F-backend-development) - Node.js API & database

---

## ⚡ Development Setup

### 🚀 **Quick Start (5 Minutes)**

```bash
# 1. Navigate to project
cd /Users/benknight/Code/Oochiumpa

# 2. Start Backend (Terminal 1)
cd oonchiumpa-backend
npm run dev  # Runs on http://localhost:3001

# 3. Start Frontend (Terminal 2)  
cd oonchiumpa-app
npm run dev  # Runs on http://localhost:5173

# 4. Access Platform
# Public Site: http://localhost:5173
# Staff Login: http://localhost:5173/login
# Staff Portal: http://localhost:5173/staff-portal
```

### 🔑 **Default Credentials**
```javascript
// Admin Account (Already Created)
email: "kristy@oonchiumpa.com"
password: "oonchiumpa123"
role: "ADMIN"
```

### ✅ **Verification Checklist**
- [ ] Backend running on port 3001 ✅
- [ ] Frontend running on port 5173 ✅ 
- [ ] Database connected (PostgreSQL) ✅
- [ ] AI services configured (OpenAI, Anthropic) ✅
- [ ] Media storage working (Cloudinary) ✅

---

## 🏗️ Architecture Overview

### 🎯 **System Components**

```mermaid
graph TB
    A[React Frontend] --> B[Node.js Backend]
    B --> C[PostgreSQL Database]
    B --> D[AI Services]
    B --> E[Cloudinary CDN]
    
    D --> D1[OpenAI GPT-4]
    D --> D2[Anthropic Claude]
    D --> D3[Perplexity AI]
```

### 📁 **Project Structure**

```
oonchiumpa-platform/
├── 🌐 oonchiumpa-app/          # React Frontend (Vite + TypeScript)
│   ├── src/components/         # Reusable UI components
│   ├── src/pages/             # Route-based page components
│   ├── src/contexts/          # React context (Auth, Theme)
│   ├── src/services/          # API calls & data management
│   └── src/design-system/     # Aboriginal design tokens
│
├── 🏢 oonchiumpa-backend/      # Node.js API (Express + TypeScript)
│   ├── src/routes/            # API endpoint definitions
│   ├── src/services/          # Business logic & AI orchestration
│   ├── src/middleware/        # Auth, validation, error handling
│   ├── src/utils/             # Utilities & helpers
│   └── prisma/               # Database schema & migrations
│
└── 🗄️ oonchiumpa-platform/    # Legacy & documentation
    ├── docs/                  # Interview transcripts & reports
    └── data/                  # Raw data & media assets
```

### 🔄 **Data Flow**

```javascript
// 1. User uploads document → Staff Portal
// 2. Document → Cloudinary storage
// 3. AI Analysis → OpenAI/Anthropic processing
// 4. Generated content → PostgreSQL database
// 5. Content review → Elder approval workflow
// 6. Published content → Public website display
```

---

## 🔧 API Reference

### 🔐 **Authentication Endpoints**

#### **User Registration**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepassword123",
  "role": "COMMUNITY_COORDINATOR"
}

Response:
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John Doe", "role": "COMMUNITY_COORDINATOR" },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### **User Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "kristy@oonchiumpa.com",
  "password": "oonchiumpa123"
}

Response:
{
  "message": "Login successful",
  "user": { "id": "...", "name": "Kristy Bloomfield", "role": "ADMIN" },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 📄 **Content Management**

#### **Get Published Blog Posts** (Public)
```http
GET /api/content/blog-posts?limit=20&offset=0&category=all

Response:
{
  "success": true,
  "posts": [
    {
      "id": "cuid123",
      "title": "Traditional Law Teaching Session",
      "excerpt": "Elder shares wisdom on traditional justice...",
      "content": "Full story content...",
      "author": "Editorial Team",
      "publishedAt": "2025-08-22T22:00:00.000Z",
      "tags": ["Traditional Law", "Elder Wisdom"],
      "type": "historical-piece",
      "readTime": 3,
      "heroImage": "https://cloudinary.../image.jpg"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### **Create Blog Post** (Staff Only)
```http
POST /api/content/blog-posts
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Community Healing Circle",
  "excerpt": "Powerful family conversation about healing...",
  "content": "Full story content with cultural context...",
  "type": "community-story",
  "tags": ["Healing", "Family", "Community"]
}

Response:
{
  "success": true,
  "post": { "id": "...", "title": "...", "status": "DRAFT" }
}
```

### 📤 **Media Upload**

#### **Single Image Upload**
```http
POST /api/upload/image
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

form-data:
- image: [file] (PNG, JPG, WebP, GIF)
- context: "law-teaching"

Response:
{
  "success": true,
  "image": {
    "id": "oonchiumpa/law-teaching/law-teaching_1234567890",
    "url": "https://res.cloudinary.com/dzwywf1gw/image/upload/v1234567890/...",
    "filename": "document.png",
    "size": 12345,
    "width": 800,
    "height": 600,
    "format": "png",
    "context": "law-teaching",
    "uploadedAt": "2025-08-22T22:00:00.000Z"
  }
}
```

#### **Video Upload**
```http
POST /api/media-gallery/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

form-data:
- media: [file] (MP4, WebM, QuickTime, AVI - max 500MB)
- title: "Traditional Teaching Session"
- description: "Elder teaching traditional law"
- culturalContext: {"sensitivity": "COMMUNITY"}

Response:
{
  "success": true,
  "items": [
    {
      "id": "cuid123",
      "type": "VIDEO",
      "originalUrl": "https://cloudinary.../video.mp4",
      "thumbnailUrl": "https://cloudinary.../thumb.jpg",
      "title": "Traditional Teaching Session",
      "duration": 300,
      "width": 1920,
      "height": 1080
    }
  ]
}
```

### 🤖 **AI Content Generation**

#### **Custom Content Generation**
```http
POST /api/content-generator/custom
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "type": "historical-piece",
  "focusArea": "Traditional law teaching methodology",
  "sourceDocuments": ["interview-transcript.pdf"],
  "documentType": "law-teaching"
}

Response:
{
  "success": true,
  "content": {
    "title": "Traditional Law Teaching: Ancient Wisdom for Modern Justice",
    "excerpt": "Exploring how Aboriginal law traditions...",
    "content": "Full AI-generated story content...",
    "metaData": {
      "keyThemes": ["Traditional Law", "Elder Wisdom", "Community Justice"],
      "culturalConsiderations": ["Elder guidance recommended"],
      "recommendedImages": ["traditional-justice.jpg"],
      "wordCount": 1200
    }
  }
}
```

### 📊 **Dashboard & Analytics**

#### **Staff Dashboard Stats**
```http
GET /api/content/dashboard-stats
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "stats": {
    "documentsPending": 3,
    "storiesInReview": 7,
    "publishedThisMonth": 12,
    "totalContent": 45
  }
}
```

---

## 🎨 Frontend Development

### ⚛️ **React Architecture**

#### **Component Structure**
```typescript
// src/components/Card.tsx - Reusable UI component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border border-earth-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

#### **Authentication Context**
```typescript
// src/contexts/AuthContext.tsx - Global authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem('authToken', data.accessToken);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **Video Player Component**
```typescript
// src/components/VideoPlayer.tsx - YouTube + direct video support
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}` 
    : url;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-video">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
        allowFullScreen
        className="absolute inset-0"
      />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}
    </div>
  );
};
```

### 🎨 **Design System**

#### **Aboriginal Color Palette**
```css
/* tailwind.config.js - Custom color extensions */
module.exports = {
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#fef7f0',   // Lightest earth tone
          100: '#fef0e1',  // Light earth
          500: '#92400e',  // Medium earth
          900: '#451a03'   // Darkest earth
        },
        ochre: {
          50: '#fff7ed',   // Light ochre
          500: '#ea580c',  // Traditional ochre (primary)
          900: '#9a3412'   // Dark ochre
        },
        eucalyptus: {
          50: '#ecfdf5',   // Light eucalyptus  
          500: '#059669',  // Native green
          900: '#064e3b'   // Dark eucalyptus
        },
        sand: {
          50: '#fffbeb',   // Lightest sand
          200: '#fde68a',  // Desert sand
          900: '#78350f'   // Dark sand
        }
      }
    }
  }
};
```

#### **Typography System**
```css
/* Aboriginal-inspired typography */
.heading-primary {
  @apply text-4xl md:text-6xl font-bold text-earth-900 leading-tight;
}

.heading-secondary {
  @apply text-2xl md:text-3xl font-semibold text-earth-800;
}

.body-text {
  @apply text-earth-700 leading-relaxed text-base md:text-lg;
}

.cultural-accent {
  @apply text-ochre-600 font-medium;
}
```

### 🛣️ **Routing & Navigation**
```typescript
// src/routes/Routes.tsx - Application routing
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Staff Routes */}
      <Route path="/staff-portal" element={<StaffPortalPage />} />
      
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:id" element={<StoryDetailPage />} />
        <Route path="outcomes" element={<OutcomesPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogPostDetailPage />} />
      </Route>
    </Routes>
  );
};
```

---

## 🛠️ Backend Development

### 🏗️ **Express Server Setup**

#### **Main Server** (src/index.ts)
```typescript
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Routes
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/upload';
import contentGeneratorRoutes from './routes/content-generator';

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/content-generator', contentGeneratorRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

#### **Authentication Middleware**
```typescript
// src/middleware/auth.ts - JWT authentication & role-based access
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: ROLE_PERMISSIONS[decoded.role] || []
    };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(permission)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    next();
  };
};
```

### 🗄️ **Database Schema** (Prisma)

#### **Core Models**
```prisma
// prisma/schema.prisma - Database models
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(COMMUNITY_MEMBER)
  password  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  stories         Story[]
  outcomes        Outcome[]
  mediaItems      MediaItem[]
  generatedContent GeneratedContent[]
  
  @@map("users")
}

model GeneratedContent {
  id          String        @id @default(cuid())
  title       String
  excerpt     String
  content     String        @db.Text
  type        ContentType
  status      ContentStatus @default(DRAFT)
  
  // Metadata
  metaData    Json?
  seoData     Json?
  
  // Timestamps
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  publishedAt DateTime?
  
  // Relations
  author      User?         @relation(fields: [authorUserId], references: [id])
  authorUserId String?
  
  @@map("generated_content")
}

enum UserRole {
  ADMIN
  ELDER
  COMMUNITY_COORDINATOR  
  COMMUNITY_MEMBER
}

enum ContentType {
  BLOG_POST
  TEAM_PROFILE
  HISTORICAL_PIECE
  TRANSFORMATION_STORY
  COMMUNITY_STORY
  CULTURAL_INSIGHT
  YOUTH_WORK
}
```

#### **Database Operations**
```typescript
// Example: Content CRUD operations
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create content
export const createBlogPost = async (data: {
  title: string;
  excerpt: string;
  content: string;
  type: string;
  authorUserId: string;
}) => {
  return await prisma.generatedContent.create({
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      type: data.type.toUpperCase() as any,
      status: 'DRAFT',
      authorUserId: data.authorUserId,
      metaData: {
        wordCount: data.content.length,
        keyThemes: [],
        culturalConsiderations: []
      }
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } }
    }
  });
};

// Fetch published content
export const getPublishedPosts = async (limit = 20, offset = 0) => {
  return await prisma.generatedContent.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      author: { select: { id: true, name: true, avatar: true } }
    }
  });
};
```

### 🤖 **AI Service Integration**

#### **Content Orchestrator**
```typescript
// src/services/contentOrchestrator.ts - AI content generation
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export class ContentOrchestrator {
  private openai: OpenAI;
  private anthropic: Anthropic;
  
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async generateContentFromInterviews(
    focusArea: string, 
    documentType: string,
    sourceDocuments: string[]
  ) {
    try {
      // 1. Analyze documents with Claude
      const analysis = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Analyze these ${documentType} materials for ${focusArea}...`
        }]
      });

      // 2. Generate content with OpenAI
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'You are a culturally-sensitive content creator for Aboriginal communities...'
        }, {
          role: 'user', 
          content: `Create compelling content based on: ${analysis.content[0].text}`
        }]
      });

      return {
        title: 'AI-Generated Title',
        excerpt: 'Compelling excerpt...',
        content: completion.choices[0].message.content,
        metaData: {
          keyThemes: ['Traditional Knowledge', 'Community Strength'],
          culturalConsiderations: ['Elder review recommended'],
          sourceDocuments,
          aiProvider: 'openai-gpt-4'
        }
      };
    } catch (error) {
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }
}
```

#### **Media Processing**
```typescript
// File upload with AI analysis
import { v2 as cloudinary } from 'cloudinary';

export const processMediaUpload = async (file: Express.Multer.File) => {
  // 1. Upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(file.path, {
    folder: 'oonchiumpa/media',
    resource_type: 'auto'
  });

  // 2. AI analysis for images
  if (file.mimetype.startsWith('image/')) {
    const aiDescription = await analyzeImageWithAI(uploadResult.secure_url);
    
    return {
      url: uploadResult.secure_url,
      type: 'IMAGE',
      aiDescription,
      width: uploadResult.width,
      height: uploadResult.height
    };
  }

  // 3. Video processing
  if (file.mimetype.startsWith('video/')) {
    return {
      url: uploadResult.secure_url,
      type: 'VIDEO',
      duration: uploadResult.duration,
      width: uploadResult.width,
      height: uploadResult.height
    };
  }
};
```

---

## 🧪 Testing & Debugging

### 🔍 **API Testing**

#### **Manual Testing with curl**
```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kristy@oonchiumpa.com","password":"oonchiumpa123"}'

# Test protected endpoint
curl -X GET http://localhost:3001/api/content/dashboard-stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test file upload
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@test-image.png" \
  -F "context=law-teaching"
```

#### **Frontend Testing**
```javascript
// src/services/api.ts - API client with error handling
const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
};
```

### 🐛 **Common Issues & Solutions**

#### **Authentication Errors**
```javascript
// Problem: 401 Unauthorized
// Solution: Check token expiration and refresh
const handleAuthError = async (error) => {
  if (error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Attempt token refresh
      await refreshAuthToken(refreshToken);
    } else {
      // Redirect to login
      window.location.href = '/login';
    }
  }
};
```

#### **CORS Issues**
```typescript
// Backend CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🚀 Deployment

### 📦 **Production Build**

#### **Frontend Build**
```bash
cd oonchiumpa-app
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

#### **Backend Build**
```bash
cd oonchiumpa-backend
npm run build    # TypeScript compilation
npm start        # Production server
```

### 🌍 **Environment Variables**

#### **Production .env**
```bash
# Database
DATABASE_URL="postgresql://user:pass@prod-server:5432/oonchiumpa"

# JWT Secrets (Generate new ones!)
JWT_SECRET="production-super-secure-secret-key"
JWT_REFRESH_SECRET="production-refresh-secret-key"

# AI Services
OPENAI_API_KEY="sk-proj-PRODUCTION-KEY"
ANTHROPIC_API_KEY="sk-ant-api03-PRODUCTION-KEY"

# Media Storage
CLOUDINARY_CLOUD_NAME="your-prod-cloud"
CLOUDINARY_API_KEY="your-prod-api-key"
CLOUDINARY_API_SECRET="your-prod-secret"
```

---

## 🌟 **Best Practices**

### 🔒 **Security**
- ✅ **Never commit** API keys or secrets
- ✅ **Use environment variables** for all config
- ✅ **Validate all inputs** on backend
- ✅ **Implement rate limiting** on API endpoints
- ✅ **Use HTTPS** in production

### 🎨 **Code Quality**
- ✅ **TypeScript** for type safety
- ✅ **Consistent naming** conventions
- ✅ **Component composition** over inheritance
- ✅ **Error boundaries** in React
- ✅ **Proper error handling** in API routes

### 🚀 **Performance**
- ✅ **Lazy load** components and routes
- ✅ **Optimize images** with Cloudinary
- ✅ **Use CDN** for static assets
- ✅ **Database indexing** for queries
- ✅ **API response caching**

---

**🎯 Ready to build authentic Aboriginal community platforms!**

*This developer guide provides everything needed to extend and maintain the Oonchiumpa platform with cultural respect and technical excellence.*