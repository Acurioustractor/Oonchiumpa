# Frontend Integration Examples

## Quick Reference: Where to Use Each Component

### 1. **LeadershipShowcase** - Kristy & Tanya Leadership Section
**Best Use**: About page, homepage leadership section
**Shows**: Photos, bios, and authentic quotes from Kristy and Tanya

### 2. **QuoteShowcase** - Impact Area Quotes
**Best Use**: Impact sections, philosophy pages
**Shows**: AI-extracted quotes organized by impact themes

### 3. **StorytellerGrid** - Team Overview
**Best Use**: About page, team page
**Shows**: All 8 core team members in grid format

---

## Example 1: HomePage.tsx - Add Leadership After Team Profiles

**Current structure** (line 121):
```tsx
{/* Team Profiles - Show the authentic voices */}
<TeamProfiles />
```

**Add LeadershipShowcase after this:**

```tsx
import { LeadershipShowcase } from "../components/LeadershipShowcase";

// In your component:

{/* Team Profiles - Show the authentic voices */}
<TeamProfiles />

{/* Leadership Section - Kristy & Tanya with Real Quotes */}
<Section className="bg-earth-50">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
      Our Leadership
    </h2>
    <p className="text-lg text-earth-700 max-w-2xl mx-auto">
      Guided by Traditional Owners and community advocates
    </p>
  </div>
  <LeadershipShowcase showQuotes={true} quotesPerPerson={2} />
</Section>
```

---

## Example 2: HomePage.tsx - Add Impact Area Quotes

**Add QuoteShowcase in philosophy/impact section** (after line 109):

```tsx
import { QuoteShowcase } from "../components/QuoteShowcase";

// After Core Values section:

{/* Community Empowerment - Real Voices */}
<Section>
  <div className="text-center mb-12">
    <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
      In Their Own Words
    </h2>
    <p className="text-lg text-earth-700 max-w-2xl mx-auto">
      Authentic voices from Oonchiumpa leadership
    </p>
  </div>
  <QuoteShowcase
    impactArea="community_empowerment"
    limit={3}
    fromLeadership={true}
  />
</Section>
```

**Available impact areas:**
- `"community_empowerment"` - Community advocacy and empowerment quotes
- `"cultural_identity"` - Cultural connection and belonging quotes
- `"indigenous_justice"` - Justice and legal practice quotes
- `"intergenerational_wisdom"` - Elder wisdom and knowledge transmission
- `"community_resilience"` - Resilience and relationship building
- `"youth_empowerment"` - Education and youth advocacy

---

## Example 3: AboutPage.tsx - Replace Placeholder Team with Real Data

**Current placeholder** (lines 46-69):
```tsx
// TODO: Replace with real Oonchiumpa team members
const teamMembers = [
  {
    name: "Kristy Bloomfield",
    role: "Director, Traditional Owner",
    // ...
  },
  // ...
];
```

**Replace entire Team Section** (lines 223-273) with:

```tsx
import { LeadershipShowcase } from "../components/LeadershipShowcase";
import { StorytellerGrid } from "../components/StorytellerGrid";

// In your AboutPage component:

{/* Leadership Section - Kristy & Tanya */}
<Section id="leadership">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
      Our Leadership
    </h2>
    <p className="text-lg text-earth-700 max-w-2xl mx-auto">
      Traditional Owners and community advocates leading with cultural authority
    </p>
  </div>

  {/* Show Kristy & Tanya with quotes */}
  <LeadershipShowcase showQuotes={true} quotesPerPerson={3} />
</Section>

{/* Full Team Section - All Core Members */}
<Section id="team" className="bg-earth-50">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
      Our Team
    </h2>
    <p className="text-lg text-earth-700 max-w-2xl mx-auto">
      Guided by Elders, law students, and community advocates
    </p>
  </div>

  {/* Show all 8 core team members */}
  <StorytellerGrid limit={8} showBio={true} />
</Section>
```

---

## Example 4: Create New Stories Page with Real Stories

**Create new file:** `src/pages/StoriesPage.tsx`

```tsx
import React, { useEffect, useState } from "react";
import { Section } from "../components/Section";
import { oonchiumpaData } from "../services/oonchiumpaData";
import type { OonchiumpaStory } from "../services/oonchiumpaData";

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<OonchiumpaStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await oonchiumpaData.getPublicStories(10);
        setStories(data);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading stories...</div>;
  }

  return (
    <>
      <Section>
        <h1 className="text-4xl font-display font-bold text-earth-900 mb-8">
          Our Stories
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="border border-earth-200 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">{story.title}</h3>
              <p className="text-earth-600 mb-4">{story.excerpt}</p>
              <div className="text-sm text-earth-500">
                By {story.author?.display_name || story.author?.full_name}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};
```

---

## Example 5: Philosophy Page with Themed Quotes

**Create new file:** `src/pages/PhilosophyPage.tsx`

```tsx
import React from "react";
import { Section } from "../components/Section";
import { QuoteShowcase } from "../components/QuoteShowcase";

export const PhilosophyPage: React.FC = () => {
  return (
    <>
      <Section>
        <h1 className="text-4xl font-display font-bold text-earth-900 mb-4">
          Our Philosophy
        </h1>
        <p className="text-lg text-earth-700 mb-12">
          Guided by cultural wisdom and community voices
        </p>
      </Section>

      {/* Cultural Identity Quotes */}
      <Section className="bg-ochre-50">
        <h2 className="text-3xl font-display font-bold text-earth-900 mb-8">
          Cultural Connection
        </h2>
        <QuoteShowcase
          impactArea="cultural_identity"
          limit={4}
          fromLeadership={true}
        />
      </Section>

      {/* Community Empowerment Quotes */}
      <Section>
        <h2 className="text-3xl font-display font-bold text-earth-900 mb-8">
          Community Empowerment
        </h2>
        <QuoteShowcase
          impactArea="community_empowerment"
          limit={4}
          fromLeadership={true}
        />
      </Section>

      {/* Indigenous Justice Quotes */}
      <Section className="bg-eucalyptus-50">
        <h2 className="text-3xl font-display font-bold text-earth-900 mb-8">
          Indigenous Justice
        </h2>
        <QuoteShowcase
          impactArea="indigenous_justice"
          limit={4}
          fromLeadership={true}
        />
      </Section>

      {/* Intergenerational Wisdom */}
      <Section>
        <h2 className="text-3xl font-display font-bold text-earth-900 mb-8">
          Intergenerational Wisdom
        </h2>
        <QuoteShowcase
          impactArea="intergenerational_wisdom"
          limit={4}
        />
      </Section>
    </>
  );
};
```

---

## Component Props Reference

### LeadershipShowcase Props
```typescript
interface LeadershipShowcaseProps {
  showQuotes?: boolean;        // Default: true
  quotesPerPerson?: number;    // Default: 2
}

// Usage examples:
<LeadershipShowcase />                                    // Default: shows quotes, 2 per person
<LeadershipShowcase showQuotes={false} />                 // Just profiles, no quotes
<LeadershipShowcase quotesPerPerson={5} />                // Show 5 quotes per person
```

### QuoteShowcase Props
```typescript
interface QuoteShowcaseProps {
  impactArea: string;          // Required: see impact areas above
  limit?: number;              // Default: 6
  fromLeadership?: boolean;    // Default: false (shows all core team)
}

// Usage examples:
<QuoteShowcase impactArea="cultural_identity" />                           // 6 quotes from all core team
<QuoteShowcase impactArea="community_empowerment" limit={3} />            // 3 quotes from all core team
<QuoteShowcase impactArea="indigenous_justice" fromLeadership={true} />   // Only Kristy & Tanya quotes
```

### StorytellerGrid Props
```typescript
interface StorytellerGridProps {
  limit?: number;              // Default: all core team (8)
  showBio?: boolean;           // Default: true
  columns?: number;            // Default: 4
}

// Usage examples:
<StorytellerGrid />                                       // All 8 core team members
<StorytellerGrid limit={2} />                            // Just Kristy & Tanya
<StorytellerGrid columns={3} />                          // 3 columns instead of 4
<StorytellerGrid showBio={false} />                      // Just names and photos
```

---

## Quick Integration Steps

### Step 1: Import Components
```tsx
import { LeadershipShowcase } from "../components/LeadershipShowcase";
import { QuoteShowcase } from "../components/QuoteShowcase";
import { StorytellerGrid } from "../components/StorytellerGrid";
```

### Step 2: Add to Your Page
Choose the example that fits your need from above and copy-paste into your page.

### Step 3: Test in Browser
```bash
cd oonchiumpa-app
npm run dev
```

Visit `http://localhost:5173/about` or `http://localhost:5173/` to see your changes.

---

## Troubleshooting

### "No quotes showing"
- Check browser console for errors
- Verify Supabase connection in `.env` file
- Make sure you're using correct impact area names

### "No team members showing"
- Verify Supabase credentials in `.env`
- Check network tab for API errors
- Ensure tenant_id is correct in `oonchiumpaData.ts`

### "Components not rendering"
- Check import paths are correct
- Verify components are exported from their files
- Look for TypeScript errors in terminal

---

## What's Available Right Now

### Core Team (8 people)
- ✅ Kristy Bloomfield (2 stories, 4 transcripts, 10+ quotes)
- ✅ Tanya Turner (1 story, 1 transcript, 4+ quotes)
- ✅ Aunty Bev & Uncle Terry (1 combined profile)
- ✅ Adelaide Hayes, Aidan Harris, Chelsea Kenneally, Suzie Ma (law students)
- ✅ Patricia Miller (community member)

### Content Available
- **47+ Quotes** extracted from AI-analyzed transcripts
- **3 Stories** published by core team
- **5 Transcripts** with themes and key insights
- **Profile images** for all team members

### Impact Areas with Quotes
1. **Community Empowerment** - 15+ quotes
2. **Cultural Identity** - 12+ quotes
3. **Indigenous Justice** - 8+ quotes
4. **Intergenerational Wisdom** - 6+ quotes
5. **Community Resilience** - 4+ quotes
6. **Youth Empowerment** - 2+ quotes

---

## Next Steps

1. **Test LeadershipShowcase** on About page first
2. **Add QuoteShowcase** to homepage or philosophy section
3. **Replace placeholder team data** with real StorytellerGrid
4. **Create new pages** for stories and philosophy if needed

All components are ready to use with real data from Supabase! 🎉
