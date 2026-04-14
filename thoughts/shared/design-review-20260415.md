# Design Review — Oonchiumpa (UX behavioral audit)

*Applied with gstack v0.17.0.0 including new Krug-based UX foundations. Report-only mode — no fixes applied.*

**Target:** http://localhost:5173/
**Pages audited:** Home, About, Team, Services, Contact
**Date:** 2026-04-15

---

## Headline scores

| Test | Result |
|------|--------|
| **Trunk test** | 3/6 PASS (site ID, nav, sections) · 3/6 FAIL (page indicator, breadcrumbs, search) = **FAIL overall** |
| **Happy talk** | 0 violations ✓ (zero "welcome to..." / "unlock the..." / "all-in-one") |
| **AI slop language** | 0 violations ✓ |
| **Goodwill reservoir** | ~75/100 — healthy, drained by three specific friction points below |
| **Krug hard rules** | 3 violations (see below) |

The site communicates **cultural authority and community leadership**. Typography (Outfit + Plus Jakarta Sans, earth palette) is intentional — not AI-generic. The content is credible and specific. This is not a SaaS template pretending to be a community organisation.

What it struggles with: *wayfinding*. A user who arrives at `/services` cannot easily tell they're on Services by glancing at the nav. No active-state indicator. No breadcrumb. No search. In a multi-page site this is felt as "where am I?" friction even if the user can't name it.

---

## First Impression (homepage)

I'm looking at the page. My eye goes to: **the video hero with the team at the war memorial**, then **"Culture-led futures for young people"** (the h1), then **the orange "Our stories" button**. That's exactly the intended hierarchy. The hero does its job.

Below the fold, my eye goes to: **Kristy and Tanya's portraits** (the leadership section), then the **stat strip** ($91/day, 30, 87-95%, 100%). Also correct.

If I had to describe this in one word: **grounded**.

The page is doing the work.

---

## Trunk Test results — page by page

The trunk test asks: drop a user on this page with no context. Can they answer 6 questions instantly?

| Question | Home | About | Team | Services | Contact |
|----------|------|-------|------|----------|---------|
| 1. What site is this? (logo visible) | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2. What page am I on? (active nav state) | ✗ | ✗ | ✗ | ✗ | ✗ |
| 3. Major sections? (nav visible) | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4. Options at this level? (local nav/CTAs) | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5. Where am I? (breadcrumbs) | ✗ | ✗ | ✗ | ✗ | ✗ |
| 6. How can I search? | ✗ | ✗ | ✗ | ✗ | ✗ |

**Every page scores 3/6.** The pattern is identical because the nav component doesn't change state across pages.

This isn't a visual bug. It's a wayfinding failure. A user who clicks "Services", then "Team", then "About" — every page's nav looks the same. No orange underline on the current link. No `aria-current`. No breadcrumb trail. They can't see their own progress.

---

## Krug Hard Rule Violations

These are the "always / never" rules now enforced by `/design-review`:

### 1. **Placeholder-as-label** on the contact form (1 input)
At least one form field uses placeholder text as its only label. When the user starts typing, the label disappears — they lose context for what they're filling in. Krug's rule: *labels must be visible when the field has content*.

**Find:** inspect `oonchiumpa-app/src/pages/ContactPage.tsx` for an `<input>` with `placeholder=` but no associated `<label htmlFor=>`.

### 2. **Body text below 16px** — 9–33 paragraphs per page
- Home: some `p` elements below 16px
- About: 13 paragraphs below 16px
- Team: 9 paragraphs below 16px  
- Services: 33 paragraphs below 16px (likely the outcome card text)
- Contact: 24 below 16px (many are form labels, which is conventional)

Krug hard rule: *NEVER use small, low-contrast type* for body text. Labels and microcopy can be smaller. But service card outcome text, team member bios, paragraph descriptions — all should be ≥16px.

### 3. **Visited link distinction missing**
No `:visited` CSS rule found in the stylesheet. All links render the same whether the user has visited them or not.

Krug hard rule: *ALWAYS preserve visited vs unvisited link distinction.* On a multi-page site like this, a user returning to `/blog` can't see which posts they've already read. A user on `/services` can't see which services they've already clicked through to.

Easy fix — add to `index.css`:
```css
a:visited { color: theme('colors.ochre.800'); }
```

---

## Other findings

### Homepage H1 renders as "futuresfor" (one word)
```
HTML: Culture-led futures<br>for young people
Text content: "Culture-led futuresfor young people"
```
The `<br>` creates a visual line break but no whitespace between words. Visually it looks correct, but:
- Screen readers may read "futuresfor" as a single word
- Copy-paste drops the space  
- Browser tab/OG previews will show "futuresfor"

**Fix:** either add a space before the `<br>` (`futures <br>for`) or split into two spans with proper spacing.

### Page title on /team is generic
```
/services → "Services | Oonchiumpa" ✓
/contact → "Contact | Oonchiumpa" ✓
/team → "Oonchiumpa | Cultural Authority in Action" ✗
```
The Team page tab title doesn't say "Team". Users with multiple tabs open can't tell them apart. Check `applyPageMeta` in `Layout.tsx` for `/team` route config.

### Touch targets below 44px
- Nav links: 24px tall (desktop-sized padding). On mobile this becomes a real problem. The 44px rule is mobile-focused — the hamburger menu should have 44px+ targets, and the nav-collapsed state probably handles this, but should be verified.
- Form inputs on Contact (49 elements below 44px) — need to verify on mobile specifically.

### Low-contrast text on Team page (34 elements)
Large number of near-white text elements at <18px detected. Need visual verification. Likely candidates: the community section cards on sand-50 background, staff card role labels. Worth eyeballing in the browser.

### No search on any page
Trunk test Q6 fails across the site. For a content-rich site with blog posts, stories, services, outcomes, videos — no way to find anything except by browsing. On a small site this can be OK. On this one, with the Empathy Ledger pulling 277+ media items and growing, search becomes important.

---

## Goodwill Reservoir walkthrough

Starting at 70/100, walking a realistic user flow (referrer looking to make a referral):

| Step | What happens | Drain/fill |
|------|--------------|------------|
| 1. Land on Home | Hero video, clear value proposition. No splash, no popup. | **+10** (70→80) |
| 2. Look for "Make a referral" | Have to scroll, eventually find it in a dark callout. Or click Services. | **–5** (80→75) |
| 3. Click Services | Page loads. "Make a referral" button is prominent in hero ✓ | **+5** (75→80) |
| 4. Click "Make a referral" on a service | Contact form loads, inquiry type pre-selected ✓ | **+10** (80→90) |
| 5. Fill out form | Some placeholder-as-label friction | **–5** (90→85) |
| 6. Submit | Works (Supabase + mailto fallback) | **+5** (85→90) |

**Final: 90/100 — Healthy.**

The "Make a referral" flow is actually excellent. The form pre-fill with the specific service name is a strong replenisher. Where the reservoir drains is not on this flow — it's on wayfinding (no active nav state, no breadcrumbs, no search).

---

## Page Area Test

On each page, can I name what each section is for in under 2 seconds?

**Home:**
- Hero: clear ✓
- "Cultural authority meets systems change": clear ✓
- Impact strip ($91/day, etc.): clear ✓
- "Real work, with real outcomes": clear ✓
- Video spotlight: clear ✓
- "The people behind the work": **PARTIAL** — this duplicates the new /team page. Viewer is confused about whether this is a preview or the actual team list.
- "Returning to Country": clear ✓
- Stories section: clear ✓
- "Stories of transformation" (case studies): clear ✓
- Partners: clear ✓
- CTA: clear ✓

**11 sections is a lot for a home page.** Each is well-defined but the page runs long. The "people behind the work" section overlaps with /team now that /team exists — consider cutting it from Home.

---

## The three most important fixes

Ranked by impact on the real user experience:

### 1. **Add active nav state + breadcrumbs** (HIGH impact, 30 min)
Single most important fix. Every page currently fails trunk test Q2 and Q5.

- Add `aria-current="page"` to the active nav link in `Layout.tsx` or `Navigation.tsx`
- Style it with underline + ochre color
- Add simple breadcrumbs for detail pages (`/services/:id`, `/stories/:id`, `/blog/:id`) — e.g., `Services › Youth Diversion & Case Management`

Impact: users always know where they are. Eliminates a whole category of "where did I just click?" confusion.

### 2. **Fix Krug hard rule violations** (HIGH impact, 1 hour)
- Body text ≥16px everywhere (audit service outcome cards, team bios, community voices cards)
- Add `:visited` CSS rule
- Fix placeholder-as-label on contact form
- Fix the `futuresfor` h1 rendering

Impact: accessibility, returning-user experience, legibility. None of these are cosmetic.

### 3. **Fix /team page title** (LOW effort, HIGH clarity value)
One line in `Layout.tsx` route config. Tab titles matter when users have 5+ tabs open.

---

## The two fixes to consider but not yet decide

### Add search
Home has 1,188 words. Services has 1,173. Across the site there's probably 10,000+ words of content. No search means discovery is by browsing only. Consider: a simple cmd-k style overlay that searches titles, service names, and Empathy Ledger content.

Effort: medium. Value: grows with content volume.

### Cut one section from the homepage
The home page has 11 sections including "The people behind the work" which now duplicates /team. Consider trimming home to 7-8 sections. Push deeper content to dedicated pages.

Effort: small. Risk: might lose content the team wants visible. Requires a taste call, not just a code change.

---

## What's already excellent (don't change)

- **Typography.** Outfit + Plus Jakarta Sans, not Inter. Intentional.
- **Color palette.** Ochre/earth/eucalyptus/sand — specific to Country, not a SaaS color scheme.
- **Language.** Zero happy talk, zero generic SaaS copy, zero AI slop phrases.
- **Video heroes.** Specific, place-based, matched to page content.
- **Per-service CTAs.** Every service card has its own deep-linked action. That's a 90/100 UX move on its own.
- **The site has a voice.** It sounds like an Aboriginal community-controlled organisation, not a template. This is the hardest thing to fake and you have it.

---

## Recommendation

Ship the three HIGH-impact fixes (active nav, Krug hard rules, page title). That's a full afternoon of work and it takes the site from B+ to A-.

Search and homepage trim are judgement calls — revisit after the site's been live for a few weeks with real visitors, and decide based on what they actually do.
