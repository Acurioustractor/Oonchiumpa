# 📚 Oonchiumpa Story Extraction Guide

Complete workflow for extracting stories from your reports and importing them to Supabase.

---

## 🎯 What We're Doing

Extract stories from your "Good News Stories" and reports, then:
1. ✅ Analyze with AI to create structured story data
2. ✅ Import stories to Supabase database
3. ✅ Extract and upload images
4. ✅ Display on your website

---

## 📁 Your Documents

### Already Ready (Markdown):
- ✅ `Oonch_report.md` - Main evaluation report with case studies

### Need Conversion (DOCX with images):
1. **Atnarpa Station Trip** - 8.4MB (lots of images!)
2. **Basketball Game** - 2.5MB
3. **Fellas Day Trip to Standly Chasm** - 2.6MB
4. **Girl Days Trip Standly Chasm** - 4.0MB
5. **McDonalds Fellas Tour** - 2.2MB
6. **Atnarpa Homestead and Campgroup** - 8.4MB
7. **Alliance Statement** - 31KB

### PDFs:
8. **July 24 to Dec 24 Report** - 1.3MB
9. **NIAA Progress Report** - 3.2MB
10. **Stage 1 Developmental Evaluation** - 1.7MB

---

## 🚀 Quick Start (Recommended Path)

### Step 1: Set Up API Key

You need an Anthropic API key for AI analysis:

1. Get key from: https://console.anthropic.com/
2. Add to `.env` file:
   \`\`\`bash
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   \`\`\`

### Step 2: Install Dependencies

\`\`\`bash
cd /Users/benknight/Code/Oochiumpa
npm install @anthropic-ai/sdk
\`\`\`

### Step 3: Convert Documents to Markdown

**Option A: Use Claude.ai (BEST for documents with images)**

1. Go to claude.ai
2. Upload each DOCX file
3. Ask: "Please extract this as markdown, preserving all story content and describing images"
4. Save output as `.md` files in `/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/`

**Option B: Install Pandoc (QUICK for text-only)**

\`\`\`bash
brew install pandoc

cd /Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports

# Convert all DOCX to markdown
for file in *.docx; do
  output="\${file%.docx}.md"
  pandoc "$file" -o "$output" --extract-media=./images
done
\`\`\`

### Step 4: Extract Stories with AI

\`\`\`bash
cd /Users/benknight/Code/Oochiumpa
node extract-stories-from-docs.js
\`\`\`

This will:
- ✅ Read all `.md` files in Reports directory
- ✅ Use Claude AI to extract structured stories
- ✅ Save results to `extracted-stories.json`

### Step 5: Review & Import to Supabase

1. Review `extracted-stories.json` - make sure stories look good
2. Import to Supabase:
   \`\`\`bash
   node extract-stories-from-docs.js --import
   \`\`\`

---

## 🖼️ Handling Images

After stories are imported, we'll extract images:

### Option 1: Manual Extract (DOCX files)

1. Open each DOCX file
2. Right-click images → Save As
3. Save to `/Users/benknight/Code/Oochiumpa/oonchiumpa-app/public/images/stories/`

### Option 2: Automated Extract

I can create a script to:
1. Extract images from DOCX files
2. Upload to Supabase Storage
3. Link images to stories in database

Let me know when you're ready for this!

---

## 📊 What Gets Extracted

For each story, the AI extracts:

- **Title** - Engaging headline
- **Story Type** - community_story, youth_success, cultural_activity, etc.
- **Summary** - 2-3 sentence overview
- **Full Content** - Complete narrative
- **Themes** - cultural_connection, youth_empowerment, family_healing, etc.
- **Cultural Themes** - on_country, cultural_authority, kinship, etc.
- **Impact Highlights** - Key outcomes
- **Location** - Where it happened
- **Date** - When it happened
- **Cultural Sensitivity** - public/community/sacred

---

## 🎨 After Import

Once stories are in Supabase, they'll automatically appear on:
- ✅ Stories page (`/stories`)
- ✅ Homepage featured stories
- ✅ Filtered by themes and cultural themes

---

## ⚡ Current Status

- ✅ AI extraction tool created
- ✅ Supabase connection ready
- ⏳ Need: Anthropic API key
- ⏳ Need: Convert DOCX/PDF to markdown
- ⏳ Ready: Run extraction and import

---

## 💡 Next Steps

1. **Get Anthropic API key** - https://console.anthropic.com/
2. **Add key to .env file**
3. **Convert 1-2 documents to test** (start with smaller ones)
4. **Run extraction tool**
5. **Review results**
6. **Import to Supabase**
7. **Handle images**

---

## 🆘 Troubleshooting

**"API key missing"**
- Add ANTHROPIC_API_KEY to `.env` file

**"No .md files found"**
- Convert DOCX/PDF files to markdown first

**"Stories look weird"**
- Review document format
- Make sure meaningful content is in the .md file
- Adjust AI prompt if needed

**"Images not showing"**
- Extract images separately
- Upload to Supabase Storage
- Link to stories

---

## 📞 Ready?

Let me know when you have:
1. ✅ Anthropic API key set up
2. ✅ A few documents converted to markdown

Then I'll help you run the extraction and review the results!
