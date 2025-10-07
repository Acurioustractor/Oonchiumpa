# 🔐 Bulletproof .env Setup Guide

## The Problem with .env Files

You mentioned having "heaps of issues" with .env files. Here's why that happens and how our system solves it:

### Common .env Problems:
1. **Wrong file location** - .env in wrong directory
2. **Loading order issues** - Multiple .env files overriding each other
3. **Missing variables** - Required keys not set
4. **Cache issues** - Old environment variables stuck in memory
5. **Production vs Development** - Different environments need different configs

## 🛡️ Our Bulletproof Solution

Our new config system (`src/config/env.ts`) automatically:

### 1. **Multi-Location Search**
Searches for .env files in ALL possible locations:
```
✅ /Users/benknight/Code/Oochiumpa/oonchiumpa-backend/.env
✅ /Users/benknight/Code/Oochiumpa/oonchiumpa-backend/.env.local  
✅ Current working directory/.env
✅ Parent directories (in case you run from different folders)
✅ Your home directory/.oonchiumpa.env (global fallback)
```

### 2. **Auto-Creates Missing .env**
If no .env file found, creates one automatically with all required defaults.

### 3. **Smart Validation**
- Checks required variables exist
- Validates database URL format  
- Ensures JWT secrets aren't defaults in production
- Reports which AI providers are available

### 4. **Multi-Environment Support**
```bash
# Development
.env                 # Main config
.env.local          # Local overrides (git ignored)

# Production  
.env.production     # Production config
.env.production.local # Production secrets
```

## 📁 Where to Put Your .env File

### Option 1: Backend Root (Recommended)
```
/Users/benknight/Code/Oochiumpa/oonchiumpa-backend/.env
```

### Option 2: Any Parent Directory
```
/Users/benknight/Code/Oochiumpa/.env
/Users/benknight/Code/.env
```

### Option 3: Global Fallback
```
~/.oonchiumpa.env  # Works from anywhere
```

## 🚀 Quick Setup

### 1. Let the system create your .env file:
```bash
cd /Users/benknight/Code/Oochiumpa/oonchiumpa-backend
npm run dev
```

The system will automatically create `.env` with all required variables.

### 2. Add your API keys:
```bash
# Edit the created .env file
nano .env

# Or use VS Code
code .env
```

### 3. Replace placeholder values:
```bash
# Change these:
OPENAI_API_KEY=your-actual-openai-key-here
ANTHROPIC_API_KEY=your-actual-anthropic-key-here
PERPLEXITY_API_KEY=your-actual-perplexity-key-here
```

## 🔧 Environment Variables Explained

### Required (System won't start without these):
```bash
DATABASE_URL=postgresql://benknight@localhost:5432/oonchiumpa
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

### Optional (AI features):
```bash
# Text Processing
OPENAI_API_KEY=sk-...                    # OpenAI GPT-4 ($20/month)
ANTHROPIC_API_KEY=sk-ant-...             # Claude 3.5 ($20/month)  
PERPLEXITY_API_KEY=pplx-...              # Perplexity Pro ($20/month)

# Computer Vision  
GOOGLE_CLOUD_VISION_API_KEY=AIza...      # Google Vision (~$1.50/1000 images)
AZURE_COMPUTER_VISION_KEY=...            # Azure Vision (backup)

# Audio Processing
ASSEMBLYAI_API_KEY=...                   # AssemblyAI ($0.37/hour audio)
AZURE_SPEECH_KEY=...                     # Azure Speech Services

# Cloud Storage (optional)
AWS_ACCESS_KEY_ID=...                    # AWS S3 for media storage
AWS_SECRET_ACCESS_KEY=...
```

## 🔍 Debugging Environment Issues

### Check what's loaded:
```bash
# In your backend directory:
node -e "
const { debugEnv } = require('./dist/config/env');
debugEnv();
"
```

### Or add this to any file temporarily:
```typescript
import { debugEnv } from './config/env';
debugEnv();
```

### Environment Debug Output:
```
🔍 Environment Debug Info:
Current working directory: /Users/benknight/Code/Oochiumpa/oonchiumpa-backend
__dirname: /Users/benknight/Code/Oochiumpa/oonchiumpa-backend/dist/config
Found .env files: ['/Users/benknight/Code/Oochiumpa/oonchiumpa-backend/.env']
NODE_ENV: development
DATABASE_URL set: true
Config loaded: true

🤖 AI Provider Status:
   ✅ OpenAI
   ❌ Anthropic  
   ❌ Perplexity
   ❌ Google Vision
   ❌ Azure Vision

📊 1/5 AI providers configured
```

## 🐛 Common Issues & Solutions

### Issue: "Required environment variable X is not set!"
**Solution**: Add the missing variable to your .env file
```bash
echo "MISSING_VARIABLE=your-value" >> .env
```

### Issue: "No .env files found!"
**Solution**: Let the system create one automatically or create manually:
```bash
cd /Users/benknight/Code/Oochiumpa/oonchiumpa-backend
touch .env
```

### Issue: Changes to .env not taking effect
**Solution**: Restart your development server
```bash
# Kill current server (Ctrl+C)
npm run dev  # Start fresh
```

### Issue: Database connection failed
**Solution**: Check PostgreSQL is running and database exists
```bash
# Start PostgreSQL
brew services start postgresql

# Create database if needed
createdb oonchiumpa

# Test connection
psql -d oonchiumpa -c "SELECT 1;"
```

### Issue: AI features not working
**Solution**: Check AI provider status in startup logs
```
🤖 AI Provider Status:
   ❌ OpenAI  <- Add OPENAI_API_KEY to .env
```

## 🚦 Production Deployment

### 1. Use separate production .env:
```bash
.env.production
```

### 2. Set strong production secrets:
```bash
# Generate secure JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

### 3. Use environment-specific database:
```bash
DATABASE_URL=postgresql://prod_user:secure_password@prod-db:5432/oonchiumpa_prod
```

## 🔐 Security Best Practices

### 1. Never commit .env files:
```gitignore
# .gitignore
.env
.env.local
.env.production
.env.production.local
*.env
```

### 2. Use different secrets per environment:
```bash
# Development
JWT_SECRET=dev-secret-key

# Production  
JWT_SECRET=super-secure-production-key-generated-with-openssl
```

### 3. Restrict API key permissions:
- OpenAI: Limit to specific models/usage
- Cloud providers: Use IAM roles with minimal permissions

## ✅ Final Checklist

- [ ] .env file exists in correct location
- [ ] Database URL is correct and PostgreSQL is running
- [ ] Required variables (DATABASE_URL, JWT_SECRET) are set
- [ ] API keys added (at least OpenAI for basic AI features)
- [ ] Server starts without errors
- [ ] AI provider status shows at least 1 provider available

## 🆘 Still Having Issues?

Run our diagnostic command:
```bash
cd /Users/benknight/Code/Oochiumpa/oonchiumpa-backend
npm run dev 2>&1 | head -20
```

This will show exactly what's happening during startup and which .env files are being loaded.

The system is designed to be **bulletproof** - it should work regardless of where you run it from or where your .env files are located! 🎯