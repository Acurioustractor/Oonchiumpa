# 📸 Google Photos Integration Setup Guide

## Overview
This guide will walk you through setting up Google Photos integration to bulk import your community workshop photos directly into Oonchiumpa with AI-powered analysis and categorization.

## 🚀 Quick Start

### 1. Set up Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google Photos Library API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Photos Library API"
   - Click "Enable"

### 2. Create OAuth Credentials

1. **Go to Credentials**: APIs & Services > Credentials
2. **Click "Create Credentials"** > OAuth 2.0 Client IDs
3. **Configure OAuth consent screen** (if not done):
   - User Type: External (or Internal if G Workspace)
   - App name: "Oonchiumpa Community Platform"
   - User support email: Your email
   - Scopes: Add Google Photos Library API scopes
4. **Create OAuth Client**:
   - Application type: Web application
   - Name: "Oonchiumpa Backend"
   - Authorized redirect URIs:
     ```
     http://localhost:3001/api/photos/auth/callback
     ```

### 3. Update Environment Variables

Update your `.env` file with the credentials:

```bash
# Google Photos API
GOOGLE_PHOTOS_CLIENT_ID=your-actual-client-id-here.googleusercontent.com
GOOGLE_PHOTOS_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_PHOTOS_REDIRECT_URI=http://localhost:3001/api/photos/auth/callback
```

## 📋 API Endpoints

### Authentication Flow

1. **Get Authorization URL**
   ```http
   POST /api/photos/auth/url
   Authorization: Bearer <your-jwt-token>
   ```
   
   Response:
   ```json
   {
     "success": true,
     "authUrl": "https://accounts.google.com/oauth/authorize?...",
     "message": "Please visit this URL to authorize Google Photos access"
   }
   ```

2. **User visits URL and authorizes** → Redirects to callback
3. **Callback processes tokens** automatically

### Discover Photos

1. **Get Albums**
   ```http
   GET /api/photos/albums
   Authorization: Bearer <your-jwt-token>
   ```

2. **Get Photos from Album**
   ```http
   GET /api/photos/{albumId}?limit=100
   Authorization: Bearer <your-jwt-token>
   ```

3. **Search by Date Range**
   ```http
   POST /api/photos/search/date
   Authorization: Bearer <your-jwt-token>
   Content-Type: application/json

   {
     "startDate": "2023-01-01",
     "endDate": "2023-12-31"
   }
   ```

### Import Photos

1. **Import Specific Photos**
   ```http
   POST /api/photos/import
   Authorization: Bearer <your-jwt-token>
   Content-Type: application/json

   {
     "photoIds": ["photo-id-1", "photo-id-2"],
     "programId": "optional-program-id",
     "outcomeId": "optional-outcome-id", 
     "storyId": "optional-story-id",
     "autoAnalyze": true,
     "tags": ["workshop-2023", "community"]
   }
   ```

2. **Bulk Import Entire Album**
   ```http
   POST /api/photos/import/album/{albumId}
   Authorization: Bearer <your-jwt-token>
   Content-Type: application/json

   {
     "programId": "optional-program-id",
     "outcomeId": "optional-outcome-id",
     "batchSize": 5
   }
   ```

## 🎯 How to Use

### Step 1: Authorize Google Photos
```bash
# 1. Get authorization URL
curl -X POST http://localhost:3001/api/photos/auth/url \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 2. Visit the returned URL in your browser
# 3. Authorize the app
# 4. You'll be redirected back with success confirmation
```

### Step 2: Discover Your Photos
```bash
# Get all your albums
curl -X GET http://localhost:3001/api/photos/albums \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get photos from a specific album
curl -X GET http://localhost:3001/api/photos/ALBUM_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 3: Import Photos
```bash
# Import entire album (recommended for workshop photos)
curl -X POST http://localhost:3001/api/photos/import/album/ALBUM_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "programId": "your-program-id",
    "batchSize": 3
  }'
```

## 🤖 AI Processing

Each imported photo automatically gets:

1. **Computer Vision Analysis**:
   - Object detection and scene recognition
   - People counting and activity identification
   - Cultural context analysis

2. **Cloudinary Optimization**:
   - Automatic format conversion (WebP, AVIF)
   - Multiple size variants
   - CDN distribution

3. **Cultural Sensitivity Check**:
   - Community appropriateness scoring
   - Elder consultation flagging for sensitive content

4. **Smart Categorization**:
   - Workshop activity classification
   - Community member identification (with privacy respect)
   - Event timeline reconstruction

## 🎨 Photo Processing Pipeline

```
Google Photos → Download → Cloudinary Upload → AI Analysis → Database Storage
                    ↓             ↓              ↓              ↓
               Original URL → Optimized CDN → Smart Tags → Linked Content
```

### What Happens to Your Photos:

1. **Download**: High-quality version (up to 2048x2048)
2. **Upload**: Stored on Cloudinary CDN with transformations
3. **Analysis**: AI generates descriptions, tags, and cultural context
4. **Thumbnails**: Automatic generation for fast loading
5. **Linking**: Connected to Programs, Outcomes, or Stories as specified

## 🔒 Privacy & Security

- **OAuth 2.0**: Secure, industry-standard authentication
- **Read-only Access**: We never modify your Google Photos
- **Cultural Sensitivity**: Elder approval system for sensitive content
- **Data Ownership**: Your photos, your control - delete anytime

## 📊 Real-time Progress

When importing large albums, you'll get real-time progress updates via WebSocket:

```javascript
// Frontend WebSocket connection
socket.on('import-progress', (data) => {
  console.log(`Progress: ${data.progress.current}/${data.progress.total}`);
  console.log(`Currently processing: ${data.progress.filename}`);
});
```

## 🐛 Troubleshooting

### Error: "Make sure you have authorized Google Photos access"
- **Solution**: Complete the authorization flow first using `/api/photos/auth/url`

### Error: "Failed to fetch albums"
- **Check**: OAuth credentials are correct in .env
- **Verify**: Google Photos Library API is enabled
- **Confirm**: Redirect URI matches exactly

### Import Fails with "No valid photos found"
- **Cause**: Photos might be private or deleted from Google Photos
- **Solution**: Check photo IDs and ensure they exist

### AI Analysis Not Working
- **Check**: OpenAI API key is configured
- **Verify**: Cloudinary credentials are set
- **Monitor**: Server logs for specific AI provider errors

## 📝 Import History

Track all your imports:

```http
GET /api/photos/imports/history?page=1&limit=20
Authorization: Bearer <your-jwt-token>
```

## 🎉 Ready to Import!

Your Google Photos integration is now set up! Start by authorizing access, then explore your albums and import your workshop photos with full AI analysis and cultural context.

The system will:
- ✅ Preserve original quality
- ✅ Generate optimized versions
- ✅ Add intelligent descriptions
- ✅ Respect cultural sensitivities
- ✅ Link to relevant programs/stories
- ✅ Provide real-time progress updates

Happy importing! 📸✨