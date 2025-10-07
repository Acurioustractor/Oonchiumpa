# 🚀 Quick Start: Using Oonchiumpa Content on Your Site

This guide shows you how to add Oonchiumpa stories, quotes, transcripts, and profile images to your website.

---

## ✅ What You Can Now Do

You can now easily:
- ✅ Display storyteller profiles with photos
- ✅ Show quotes from transcripts filtered by theme/philosophy
- ✅ Add relevant stories based on impact areas
- ✅ Query AI analysis for insights and themes
- ✅ Search content by cultural significance

---

## 📦 New Files Created

### 1. **Data Service** - [oonchiumpaData.ts](oonchiumpa-app/src/services/oonchiumpaData.ts)
Core functions to query Supabase:
- `getStorytellers()` - Get all Oonchiumpa storytellers
- `getPublicStories()` - Get published stories
- `getFeaturedStories()` - Get featured stories
- `getTranscripts()` - Get transcripts with AI analysis
- `searchStoriesByTheme()` - Search by theme
- `getQuotes()` - Get quotes from transcripts
- `getAIInsights()` - Get AI-processed insights

### 2. **React Hooks** - [useOonchiumpaContent.ts](oonchiumpa-app/src/hooks/useOonchiumpaContent.ts)
Easy-to-use hooks for components:
- `useFeaturedStories(limit)` - Featured stories
- `usePublicStories(limit)` - All public stories
- `useStorytellers()` - All storytellers
- `useQuotesByImpactArea(area)` - Quotes filtered by impact area
- `usePhilosophyContent()` - Content aligned with philosophy
- `useStorytellerContent(id)` - Specific storyteller + their content

### 3. **Components**
- **[QuoteShowcase.tsx](oonchiumpa-app/src/components/QuoteShowcase.tsx)** - Display quotes by theme
- **[StorytellerGrid.tsx](oonchiumpa-app/src/components/StorytellerGrid.tsx)** - Display storytellers with photos

---

## 🎯 Usage Examples

### Example 1: Show Quotes on Homepage

```tsx
// In your HomePage.tsx or any component
import { QuoteShowcase } from '../components/QuoteShowcase';

export function HomePage() {
  return (
    <div>
      <h1>Welcome to Oonchiumpa</h1>

      {/* Show quotes related to community connection */}
      <QuoteShowcase
        impactArea="community_connection"
        title="Voices from Our Community"
        limit={5}
      />

      {/* Show quotes about cultural identity */}
      <QuoteShowcase
        impactArea="cultural_identity"
        title="Cultural Wisdom"
        limit={3}
      />
    </div>
  );
}
```

### Example 2: Display Storyteller Profiles

```tsx
// Show storytellers with their photos
import { StorytellerGrid } from '../components/StorytellerGrid';

export function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>

      <StorytellerGrid
        limit={6}
        title="Our Storytellers"
        showBio={true}
      />
    </div>
  );
}
```

### Example 3: Featured Stories Section

```tsx
import { useFeaturedStories } from '../hooks/useOonchiumpaContent';

export function FeaturedStories() {
  const { stories, loading, error } = useFeaturedStories(3);

  if (loading) return <div>Loading stories...</div>;
  if (error) return <div>Error loading stories</div>;

  return (
    <section>
      <h2>Featured Stories</h2>
      {stories.map(story => (
        <article key={story.id}>
          <h3>{story.title}</h3>
          <p>{story.summary || story.content.substring(0, 200)}...</p>
          <p className="author">
            By {story.author?.display_name || story.author?.full_name}
          </p>
          {story.author?.profile_image_url && (
            <img src={story.author.profile_image_url} alt={story.author.full_name} />
          )}
        </article>
      ))}
    </section>
  );
}
```

### Example 4: Impact Area Content

```tsx
import { useQuotesByImpactArea, useStoriesByTheme } from '../hooks/useOonchiumpaContent';

export function ImpactAreaPage({ impactArea }: { impactArea: string }) {
  const { quotes } = useQuotesByImpactArea(impactArea);
  const { stories } = useStoriesByTheme(impactArea);

  return (
    <div>
      <h1>{impactArea.replace('_', ' ')}</h1>

      {/* Show relevant quotes */}
      <section>
        <h2>Community Voices</h2>
        {quotes.slice(0, 5).map((q, i) => (
          <blockquote key={i}>
            <p>"{q.quote}"</p>
            <cite>— {q.storyteller?.display_name}</cite>
          </blockquote>
        ))}
      </section>

      {/* Show related stories */}
      <section>
        <h2>Related Stories</h2>
        {stories.map(story => (
          <div key={story.id}>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

### Example 5: Philosophy-Aligned Content

```tsx
import { usePhilosophyContent } from '../hooks/useOonchiumpaContent';

export function PhilosophySection() {
  const { content, loading } = usePhilosophyContent();

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <h2>Stories Aligned with Our Philosophy</h2>
      <p>Content reflecting community connection, cultural identity, and resilience</p>

      <div className="story-grid">
        {content.map(story => (
          <article key={story.id}>
            <h3>{story.title}</h3>
            <div className="themes">
              {story.themes.map(theme => (
                <span key={theme} className="theme-tag">{theme}</span>
              ))}
            </div>
            <p>{story.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Example 6: Direct Data Access

```tsx
import { oonchiumpaData, contentHelpers } from '../services/oonchiumpaData';

// In a component or page
async function loadContent() {
  // Get all storytellers
  const storytellers = await oonchiumpaData.getStorytellers();

  // Get quotes for hope & resilience
  const quotes = await contentHelpers.getQuotesForImpactArea('hope_resilience');

  // Get AI insights
  const insights = await oonchiumpaData.getAIInsights(10);

  // Search for specific themes
  const culturalStories = await oonchiumpaData.getContentByCulturalTheme('Traditional knowledge');

  // Get specific storyteller with all their content
  const storytellerData = await oonchiumpaData.getStorytellerWithContent('storyteller-id');

  return { storytellers, quotes, insights, culturalStories, storytellerData };
}
```

---

## 🎨 Available Impact Areas

Use these as `impactArea` parameter for quotes:

- `community_connection` - Community building, relationships
- `cultural_identity` - Cultural protocols, traditional knowledge
- `hope_resilience` - Healing, resilience, hope
- `youth_empowerment` - Education, mentorship, youth
- `healing` - Mental health, wellness, healing

These map to themes in your transcripts and stories.

---

## 🔍 Search by Theme

Your stories and transcripts have these common themes:

**From Stories:**
- "Community connection"
- "Hope and resilience"
- "Mutual support"
- "Cultural identity"
- "Traditional knowledge"

**From Transcripts (AI-extracted):**
- "relationship_building"
- "cultural_protocol"
- "intergenerational_connection"
- "healing"
- "community_leadership"

Use these in:
```tsx
const { stories } = useStoriesByTheme("Community connection");
const { quotes } = useQuotesByImpactArea("cultural_identity");
```

---

## 📸 Profile Images

Profile images are available at:
```tsx
storyteller.profile_image_url
```

Example:
```tsx
{storyteller.profile_image_url && (
  <img
    src={storyteller.profile_image_url}
    alt={storyteller.full_name}
    className="profile-image"
  />
)}
```

If no image is available, use the `StorytellerCard` component which shows initials as fallback.

---

## 💾 Data Structure

### Storyteller (Profile)
```typescript
{
  id: string;
  full_name: string;
  display_name: string;
  email?: string;
  bio?: string;
  profile_image_url?: string;
  cultural_background?: string;
  tenant_roles: string[];  // e.g., ["storyteller", "elder"]
  is_storyteller: boolean;
  is_elder: boolean;
  geographic_connections?: string[];
}
```

### Story
```typescript
{
  id: string;
  title: string;
  content: string;
  summary?: string;
  themes: string[];
  cultural_themes?: string[];
  story_type: string;
  is_public: boolean;
  is_featured: boolean;
  author?: Profile;  // Nested storyteller data
  created_at: string;
}
```

### Quote (from transcripts)
```typescript
{
  quote: string;
  storyteller: {
    full_name: string;
    display_name: string;
  };
  themes: string[];
  transcriptId: string;
  transcriptTitle?: string;
}
```

---

## ✨ Integration Checklist

- [ ] Import `oonchiumpaData` service
- [ ] Import hooks from `useOonchiumpaContent`
- [ ] Import `QuoteShowcase` component
- [ ] Import `StorytellerGrid` component
- [ ] Add quotes to homepage
- [ ] Add storyteller profiles to about page
- [ ] Add featured stories section
- [ ] Test profile images display correctly
- [ ] Verify themes match your content philosophy

---

## 🎯 Next Steps

1. **Add to HomePage.tsx**:
   ```tsx
   import { QuoteShowcase } from './components/QuoteShowcase';
   import { StorytellerGrid } from './components/StorytellerGrid';

   // In your component
   <QuoteShowcase impactArea="community_connection" limit={5} />
   <StorytellerGrid limit={6} />
   ```

2. **Test the integration**:
   ```bash
   cd oonchiumpa-app
   npm run dev
   ```

3. **Check the data**:
   - Open browser console
   - Verify quotes and stories load
   - Check profile images appear

4. **Customize styling**:
   - Modify the `<style jsx>` blocks in components
   - Match your site's color scheme
   - Adjust layout as needed

---

## 🚨 Important Notes

### Multi-tenant Filtering
All queries automatically filter to Oonchiumpa tenant (`bf17d0a9-2b12-4e4a-982e-09a8b1952ec6`), so you only get Oonchiumpa content.

### Privacy & Consent
- Only public stories are returned (`is_public = true`)
- Only transcripts with consent are processed
- Cultural sensitivity levels are preserved

### AI Processing
- Transcripts have AI-extracted themes, quotes, and insights
- Only processed transcripts have `ai_processing_status = 'completed'`
- Use `getAIInsights()` to access AI analysis

---

## 💡 Pro Tips

### 1. Combine Multiple Queries
```tsx
// Get quotes AND stories for same theme
const quotes = await contentHelpers.getQuotesForImpactArea('healing');
const stories = await oonchiumpaData.searchStoriesByTheme('healing');
```

### 2. Format Quotes Nicely
```tsx
import { contentHelpers } from '../services/oonchiumpaData';

const formatted = contentHelpers.formatQuote({
  quote: "This is the quote text",
  storyteller: { full_name: "John Doe" }
});

console.log(formatted.formatted);
// Output: "This is the quote text"
//         — John Doe
```

### 3. Get Story Excerpts
```tsx
const excerpt = contentHelpers.getStoryExcerpt(story, 200);
// Returns first 200 chars with "..."
```

### 4. Cache Results
```tsx
// Use React Query or SWR for caching
import useSWR from 'swr';

function useStorytellers() {
  return useSWR('storytellers', () => oonchiumpaData.getStorytellers());
}
```

---

## 📞 Need Help?

- Check the [EXISTING_SUPABASE_STRUCTURE.md](EXISTING_SUPABASE_STRUCTURE.md) for full schema details
- Review example components in the `components/` folder
- Test queries in browser console using `oonchiumpaData.*` functions

Ready to bring Oonchiumpa stories and voices to your website! 🎉
