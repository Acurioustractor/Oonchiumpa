# Converting Documents to Markdown for Story Extraction

## Current Documents in Reports Directory:

### Good News Stories (DOCX - with images):
1. ✅ **Atnarpa Station Trip**
2. ✅ **Basketball Game**
3. ✅ **Fellas Day Trip to Standly Chasm**
4. ✅ **Girl Days Trip out Standly Chasm**
5. ✅ **McDonalds Fellas Tour**
6. ✅ **Atnarpa Homestead and Campgroup**

### Reports (PDF):
7. ✅ **July 24 to Dec 24 Report**
8. ✅ **NIAA Progress Report**
9. ✅ **Stage 1 Developmental Evaluation**

### Other:
10. ✅ **Alliance Statement** (DOCX)
11. ✅ **Oonch_report.md** (Already markdown! ✨)

---

## Option 1: Use Claude Desktop (EASIEST - with images!)

Since you have Claude Code, you can use Claude.ai to read and extract:

1. Upload DOCX/PDF files one at a time to Claude.ai
2. Ask Claude: "Extract all stories from this document as markdown with images"
3. Save the markdown output to `/Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports/`

**Pros:**
- ✅ Preserves images
- ✅ Best quality extraction
- ✅ Can review and edit before saving

---

## Option 2: Use Pandoc (Command Line)

Install pandoc:
\`\`\`bash
brew install pandoc
\`\`\`

Convert DOCX to markdown:
\`\`\`bash
cd /Users/benknight/Code/Oochiumpa/oonchiumpa-platform/docs/Reports

# Convert each DOCX
pandoc "Oochiumpa Good News Stories - Atnarpa Station Trip.docx" -o "Atnarpa_Station_Trip.md"
pandoc "Oochiumpa Good News Stories - Basketball Game.docx" -o "Basketball_Game.md"
pandoc "Oonchiumpa Good News Stories - Fellas Day Trip to Standly Chasm.docx" -o "Fellas_Standly_Chasm.md"
pandoc "Oonchiumpa Good News Stories - Girl Days Trip out Standly Chasm 29022024.docx" -o "Girls_Standly_Chasm.md"
pandoc "Oonchiumpa Good News Stories - McDonalds Fellas Tour 28122023.docx" -o "McDonalds_Fellas_Tour.md"
pandoc "Atnarpa Homestead and Campgroup.docx" -o "Atnarpa_Homestead.md"
pandoc "Alliance Statement 2 August 24.docx" -o "Alliance_Statement.md"
\`\`\`

**Note:** Pandoc extracts images to a separate folder - you'll need to handle images separately.

---

## Option 3: Use Python Script (Advanced)

I can create a Python script using `python-docx` and `PyPDF2` to extract text and images.

---

## Recommended Approach:

**For Good News Stories (with lots of images):**
1. Use Claude.ai to read each DOCX
2. Save extracted markdown manually
3. This preserves context and image descriptions

**For Reports (mostly text):**
1. Use Pandoc for quick conversion
2. Review and clean up output

---

## Next Steps:

1. Choose your conversion method
2. Convert documents to markdown
3. Run the extraction tool: \`node extract-stories-from-docs.js\`
4. Review extracted stories in \`extracted-stories.json\`
5. Import to Supabase: \`node extract-stories-from-docs.js --import\`

---

## Image Handling:

After converting documents, we can:
1. Extract images from DOCX files
2. Upload to Supabase Storage
3. Link images to stories in database
4. I can create a script for this once stories are imported
