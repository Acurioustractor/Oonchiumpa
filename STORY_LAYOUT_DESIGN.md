# 🎨 Oonchiumpa Story Layout Design

**Created**: October 7, 2025
**Status**: ✅ Complete

---

## 🎯 Design Objectives

Create an elegant, readable story layout that:
- **Highlights visual content** with dedicated image galleries
- **Easy to read** with excellent typography and spacing
- **Culturally respectful** with sensitivity notices
- **Metadata rich** showing impact, participants, and themes
- **Responsive** works beautifully on all devices

---

## 📐 Layout Architecture

### Enhanced Story Detail Page

#### Hero Section
- **Breadcrumb navigation** - Easy return to stories list
- **Story type badge** - Visual story classification
- **Large title** - 4xl to 6xl responsive typography
- **Summary** - Prominent 2xl lead paragraph
- **Meta information** - Date, location, photo count with icons

#### Two-Column Layout (Desktop)

**Main Content (2/3 width):**
- Story content card with elegant typography
- Prose formatting for paragraphs and headings
- Image gallery placeholder (ready for photos)
- Cultural themes section

**Sidebar (1/3 width):**
- **Impact Highlights** - Sticky card with checkmarks
- **Participants** - List of people involved
- **Themes** - Filterable tag pills
- **Cultural Protocol Notice** - Sensitivity badge
- **Share buttons** - Social sharing

#### Special Features
- Gradient backgrounds (sand/ochre)
- Sticky sidebar on scroll
- Smooth transitions and hover effects
- Icon-driven visual hierarchy

---

## 🎨 Visual Design System

### Color Palette Usage

```
Hero & Backgrounds:
- from-white via-sand-50/30 to-ochre-50/20 (main gradient)
- from-sand-50 to-ochre-50/50 (image gallery card)
- from-ochre-50 to-sunset-50 (impact highlights)
- from-eucalyptus-50 to-earth-50 (cultural themes)
- from-amber-50 to-orange-50 (protocol notice)

Badges & Tags:
- ochre-500 to ochre-600 (story type)
- eucalyptus-100/800 (cultural themes)
- earth-100/700 (general themes)
- amber-200/900 (cultural notice)

Text:
- earth-900 (headings)
- earth-700 (body text)
- earth-600 (meta info)
- earth-500 (icons)
```

### Typography Hierarchy

```
H1: text-4xl md:text-5xl lg:text-6xl font-display font-bold
H2: text-2xl md:text-3xl font-bold
H3: text-xl/text-2xl font-bold
Summary: text-xl md:text-2xl font-medium
Body: text-lg leading-relaxed
Meta: text-sm
Tags: text-xs font-medium
```

### Spacing System

```
Section padding: py-8 to py-16
Card padding: p-6 to p-12
Gap sizes: gap-3, gap-6, gap-8
Margin bottom: mb-4, mb-6, mb-8
```

---

## 🖼️ Image Integration Strategy

### Current State (Placeholder)
```tsx
<div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-dashed border-ochre-200">
  <svg className="w-16 h-16 mx-auto text-ochre-300 mb-4">
    {/* Image icon */}
  </svg>
  <p>{imageCount} photos from this story</p>
  <p>Images will appear here once uploaded</p>
</div>
```

### Future Implementation (Once Images Uploaded)
```tsx
{/* Hero Image */}
<div className="aspect-video overflow-hidden rounded-2xl">
  <img src={story.story_image_url} alt={story.title} />
</div>

{/* Image Gallery Grid */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {story.media_urls?.map((url, idx) => (
    <div key={idx} className="aspect-square overflow-hidden rounded-xl">
      <img
        src={url}
        alt={`${story.title} - photo ${idx + 1}`}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
    </div>
  ))}
</div>

{/* Lightbox on click */}
<ImageLightbox images={story.media_urls} />
```

---

## 📊 Metadata Display Components

### Impact Highlights Card
```tsx
<Card className="p-6 bg-gradient-to-br from-ochre-50 to-sunset-50">
  <h3>✨ Impact Highlights</h3>
  <ul className="space-y-3">
    {impactHighlights.map(highlight => (
      <li className="flex items-start gap-3">
        <CheckIcon className="text-ochre-500" />
        <span>{highlight}</span>
      </li>
    ))}
  </ul>
</Card>
```

### Cultural Themes
```tsx
<Card className="bg-gradient-to-r from-eucalyptus-50 to-earth-50">
  <h3>🪃 Cultural Elements</h3>
  <div className="flex flex-wrap gap-2">
    {cultural_themes.map(theme => (
      <span className="px-4 py-2 bg-eucalyptus-100 text-eucalyptus-800 rounded-full">
        {theme.replace(/_/g, ' ')}
      </span>
    ))}
  </div>
</Card>
```

### Participants List
```tsx
<Card className="p-6 bg-sand-50">
  <h3>👥 Participants</h3>
  <div className="space-y-2">
    {participants.map(person => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-ochre-400 rounded-full" />
        <span>{person}</span>
      </div>
    ))}
  </div>
</Card>
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked sidebar content
- Larger touch targets
- Simplified navigation

### Tablet (768px - 1024px)
- Two-column grid for stories list
- Single column story detail
- Sidebar below main content

### Desktop (> 1024px)
- Three-column stories grid
- Two-column story detail (2/3 + 1/3)
- Sticky sidebar
- Hover effects enabled

---

## 🎯 Stories List Page Updates

### Enhanced Features
1. **Story Type Filtering**
   - Uses `story_type` instead of `category`
   - Formatted display (Youth Success, On Country Experience, etc.)

2. **Improved Search**
   - Searches title, content, AND summary
   - Real-time filtering

3. **Better Card Display**
   - Shows summary if available (AI-generated stories)
   - Falls back to subtitle or content preview
   - Proper story type badges

### Card Layout
```tsx
<Card>
  {imageUrl && <img className="aspect-video" />}
  <CardBody>
    <StoryTypeBadge />
    <h3>{title}</h3>
    {summary && <p className="line-clamp-2">{summary}</p>}
    <MetaInfo date={date} author={author} />
    <ReadMoreButton />
  </CardBody>
</Card>
```

---

## 🔄 Integration Points

### Database Fields Used
- `title` - Main heading
- `summary` - Lead paragraph
- `content` - Main story text
- `story_type` - Story classification
- `themes` - General themes array
- `cultural_themes` - Cultural elements array
- `media_metadata.impact_highlights` - Impact bullets
- `media_metadata.participants` - People involved
- `media_metadata.location` - Geographic info
- `media_metadata.date_period` - Time period
- `media_metadata.image_count` - Number of photos
- `story_image_url` - Hero image (future)
- `media_urls` - Gallery images (future)

### API Integration
```typescript
const { data: story } = useApi(
  () => storiesAPI.getById(id!),
  [id]
);

const metadata = story.media_metadata || {};
const imageCount = metadata.image_count || 0;
const participants = metadata.participants || [];
// ... etc
```

---

## ✨ Special Design Elements

### Gradient Text
```tsx
<span className="text-gradient">Stories</span>
```

### Icon Integration
- Calendar icon for dates
- Map pin for locations
- Image icon for photo counts
- Checkmarks for impact highlights
- Boomerang emoji for cultural themes
- Shield emoji for cultural protocols

### Hover Effects
```css
hover:scale-110 transition-transform duration-300  /* Images */
hover:shadow-lg transition-shadow             /* Cards */
hover:text-ochre-600 transition-colors        /* Links */
group-hover:-translate-x-1                    /* Back button */
```

### Loading States
```tsx
{loading && <Loading />}
{imageCount > 0 && !images && <ImagePlaceholder count={imageCount} />}
```

---

## 🚀 Next Steps

### Image Upload Workflow
1. **Extract images from DOCX files** (63 photos)
   - Use pandoc media extraction
   - Organize by story

2. **Upload to Supabase Storage**
   - Create `story-images` bucket
   - Upload with story ID prefix
   - Generate public URLs

3. **Update Database**
   ```sql
   UPDATE stories
   SET
     story_image_url = 'first-image-url',
     media_urls = ARRAY['url1', 'url2', 'url3']
   WHERE id = 'story-id'
   ```

4. **Add Lightbox Component**
   - Click to expand images
   - Gallery navigation
   - Swipe gestures on mobile

### Enhancement Ideas
- **Related stories** section at bottom
- **Print/PDF export** button
- **Audio narration** option
- **Translation** toggle
- **Reading progress** indicator
- **Estimated read time** based on content length

---

## 📁 Files Modified

### New Files
- `/src/pages/EnhancedStoryDetailPage.tsx` - New elegant story layout

### Modified Files
- `/src/routes/Routes.tsx` - Updated to use EnhancedStoryDetailPage
- `/src/pages/StoriesPage.tsx` - Enhanced filtering and display

---

## 🎉 Success Criteria

✅ **Elegant Visual Hierarchy** - Clear structure, easy to scan
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **Metadata Rich** - Shows all relevant story information
✅ **Image Ready** - Prepared for gallery integration
✅ **Culturally Sensitive** - Displays protocols and notices
✅ **Accessible** - Semantic HTML, proper ARIA labels
✅ **Performance** - Fast loading, smooth transitions

---

**Next Phase**: Image extraction and upload system
**Current Status**: Layout complete, awaiting image content

---

*Generated: October 7, 2025*
*Platform: Oonchiumpa Empathy Ledger*
*Framework: React + TypeScript + Tailwind CSS*
