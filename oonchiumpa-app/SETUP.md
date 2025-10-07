# 🏛️ Oonchiumpa Platform Setup Guide

Complete setup instructions for the Oonchiumpa content management platform.

## 🚀 Production Setup - No Demo Mode

### Step 1: Initial Admin Account Creation

Go to the setup page in your browser:

```
http://localhost:3001/setup
```

This will attempt to create your admin account automatically. If you encounter "email rate limit exceeded" (common with Supabase free tier), follow the manual setup instructions provided on the page:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to Authentication → Users
3. Click "Add user" manually
4. Enter:
   - **Email:** admin@oonchiumpa.org
   - **Password:** oonchiumpa2024!
   - **Confirm password:** oonchiumpa2024!
   - **Auto confirm user:** ✅
5. Click "Create user"

This creates your admin account with:
- **Email:** admin@oonchiumpa.org  
- **Password:** oonchiumpa2024!
- **Role:** Administrator with full permissions
- **Cultural Authority:** Yes (can approve content)

### Step 2: Start the Development Server

```bash
npm run dev
```

The platform will be available at: **http://localhost:3001/**

### Step 3: Login as Administrator

1. Go to: **http://localhost:3001/login**
2. Enter credentials:
   - Email: `admin@oonchiumpa.org`
   - Password: `oonchiumpa2024!`
3. Click "Sign In"

### Step 4: Access Content Dashboard

After login, you'll be redirected to the staff portal. From there:
1. Click your profile menu (top right)
2. Select "Content Dashboard"
3. Or go directly to: **http://localhost:3001/content-dashboard**

### Step 5: Seed Platform with Content

1. In the Content Dashboard, click **"Content Seeder"** tab
2. Click **"Seed Platform Content"**
3. This will populate the platform with authentic sample stories and blog posts

## 🎯 Platform Features Available

### Content Management
- **Story Creation:** Full editor with cultural protocols
- **Blog Management:** Community blog posts  
- **Media Upload:** Photos, videos, audio with tagging
- **Content Seeding:** Pre-built authentic content

### User Management  
- **Role-Based Access:** Admin, Elder, Editor, Contributor, Storyteller
- **Cultural Authority:** Elder and Traditional Owner permissions
- **Team Management:** Create and manage staff accounts

### Cultural Protocols
- **Elder Approval:** Required for sensitive content
- **Privacy Levels:** Public, Community, Private, Sacred
- **Traditional Owner Authority:** Cultural oversight
- **Community Consent:** Respectful content sharing

## 🛠️ Admin Tasks After Setup

### Create Team Members
1. Go to Content Dashboard → User Management tab
2. Click "Add New User"  
3. Set appropriate roles and permissions
4. Assign cultural authority as needed

### Configure Content Categories
1. Stories are pre-configured with cultural categories
2. Media is organized by: Story Media, Team Photos, Cultural Artifacts
3. Blog posts are categorized by content type

### Review Sample Content
1. Check seeded stories for authenticity
2. Review blog posts for accuracy
3. Modify or add content as needed

## 🔒 Security & Access

### Default Admin Credentials
- Change the default password after first login
- Create additional admin accounts as needed
- Regular users must be created by administrators

### Cultural Protocols
- Elder approval required for culturally sensitive content
- Privacy levels protect sacred knowledge
- Community leadership guides all content decisions

## 📊 Platform URLs

- **Homepage:** http://localhost:3001/
- **Admin Login:** http://localhost:3001/login
- **Content Dashboard:** http://localhost:3001/content-dashboard  
- **Staff Portal:** http://localhost:3001/staff-portal
- **Stories:** http://localhost:3001/stories
- **Blog:** http://localhost:3001/blog
- **About:** http://localhost:3001/about

## ⚡ Quick Commands

```bash
# Create admin account
node create-admin.js

# Start development server  
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🌟 Success Indicators

✅ Admin account created successfully  
✅ Can login without errors  
✅ Content Dashboard accessible  
✅ All tabs working (Overview, Stories, Media, Seeder, Users)  
✅ Sample content seeded successfully  
✅ Public site displaying content  

The platform is now fully operational and ready for the Oonchiumpa team!