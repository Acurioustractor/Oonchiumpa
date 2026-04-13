# Design System — Oonchiumpa

## Product Context
- **What this is:** Website and app for Oonchiumpa, an Aboriginal community-controlled organisation delivering youth diversion, cultural healing, and family support on Arrernte Country (Alice Springs).
- **Who it's for:** Community members, families, young people, funders, government partners, and the general public.
- **Space/industry:** Indigenous community services, youth justice, cultural healing. Peers include NAAJA, CAAAPU, Tangentyere Council.
- **Project type:** Public-facing website with staff portal, impact reporting, and content management.

## Aesthetic Direction
- **Direction:** Organic/Natural
- **Decoration level:** Intentional — subtle radial gradients on body and section backgrounds create warmth and depth without competing with content.
- **Mood:** Grounded, warm, connected to Country. The design should feel like red earth, gum trees, and open sky. Dignified but approachable. Never clinical, never corporate.
- **Background treatment:** Sand-toned base (`sand-50` / `#fbf8f3`) with soft radial gradients using earth tones. Sections use `section-pattern` with low-opacity ochre and eucalyptus radials.

## Typography
- **Display/Hero:** Outfit (weights 500, 600, 700, 800) — geometric sans with personality. Warm, rounded terminals. Used for all headings.
- **Body:** Plus Jakarta Sans (weights 400, 500, 600, 700) — clean geometric body text with good readability at all sizes.
- **UI/Labels:** Plus Jakarta Sans (same as body)
- **Data/Tables:** Plus Jakarta Sans with `tabular-nums` where needed
- **Code:** System monospace
- **Loading:** Google Fonts CDN — `https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap`
- **Fallback stack:** `"Segoe UI", sans-serif`
- **Scale:**
  - Eyebrow: `text-xs sm:text-sm`, uppercase, `tracking-[0.24em]`, `font-semibold`, `text-ochre-600`
  - Heading XL: `text-4xl sm:text-5xl lg:text-6xl`, `leading-[1.04]`
  - Heading LG: `text-3xl sm:text-4xl lg:text-5xl`, `leading-[1.08]`
  - Lead text: `text-lg sm:text-xl`, `leading-relaxed`, `text-earth-700`
  - Body: `text-base`, `text-earth-800`
- **Heading style:** `font-display font-semibold text-earth-950 tracking-tight`

## Color

### Approach: Balanced
All palettes inspired by Aboriginal art and the Australian landscape. Five 11-step palettes (50–950).

### Ochre (Primary)
The heart of the palette. Used for CTAs, links, accents, and brand moments.
| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fef6ee` | Light backgrounds |
| 100 | `#fde9d6` | Hover states |
| 200 | `#fbd0ac` | Borders, dividers |
| 300 | `#f8af77` | Hero text on dark |
| 400 | `#f48740` | — |
| 500 | `#f16a1a` | — |
| 600 | `#e24e10` | **Primary brand / CTA** |
| 700 | `#bc3a10` | Hover on primary |
| 800 | `#962e14` | — |
| 900 | `#792813` | — |
| 950 | `#411108` | — |

### Earth (Neutrals)
Warm browns for text, borders, backgrounds. The backbone of every layout.
| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#f9f7f4` | Surface soft |
| 100 | `#f0eae3` | Card borders, dividers |
| 200 | `#e0d3c5` | Stronger borders |
| 300 | `#ccb5a0` | Secondary borders |
| 400 | `#b7937a` | — |
| 500 | `#a87a5f` | — |
| 600 | `#9b6852` | — |
| 700 | `#815445` | — |
| 800 | `#6a463c` | **Body text secondary** |
| 900 | `#583b33` | — |
| 950 | `#2f1e1a` | **Primary text / headings** |

### Eucalyptus (Secondary)
Muted sage green. Used for secondary actions, success states, and nature references.
| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#f4f7f5` | Light green backgrounds |
| 100 | `#e4ebe7` | — |
| 200 | `#cbd9d1` | — |
| 300 | `#a6bfb3` | — |
| 400 | `#7a9d8d` | — |
| 500 | `#5d8172` | — |
| 600 | `#49675a` | **Secondary brand** |
| 700 | `#3c534a` | — |
| 800 | `#33443d` | — |
| 900 | `#2b3934` | — |
| 950 | `#161f1b` | — |

### Sunset (Accent)
Warm red for alerts, urgent states, and visual accent.
| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fef3f2` | Error backgrounds |
| 100 | `#fee4e2` | — |
| 200 | `#fececa` | — |
| 300 | `#fcaba5` | — |
| 400 | `#f77b71` | — |
| 500 | `#ed5244` | **Accent / error** |
| 600 | `#da3426` | — |
| 700 | `#b7281c` | — |
| 800 | `#96251b` | — |
| 900 | `#7c241c` | — |
| 950 | `#430f0a` | — |

### Sand (Background)
Warm off-white for page backgrounds and card footers.
| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fbf8f3` | **Page background** |
| 100 | `#f5ede2` | Card footer bg |
| 200 | `#eadac4` | — |
| 300 | `#dcc19e` | — |
| 400 | `#cca477` | — |
| 500 | `#c08d5b` | — |
| 600 | `#b37950` | — |
| 700 | `#946143` | — |
| 800 | `#795039` | — |
| 900 | `#624230` | — |
| 950 | `#342018` | — |

### CSS Custom Properties
```css
--color-primary: #e24e10;
--color-secondary: #49675a;
--color-accent: #ed5244;
--surface-soft: #f9f7f4;
--surface-elevated: #ffffff;
--text-primary: #2f1e1a;
--text-secondary: #6a463c;
--ring-color: rgba(226, 78, 16, 0.18);
--shadow-soft: 0 8px 24px rgba(47, 30, 26, 0.08);
--shadow-elevated: 0 16px 40px rgba(47, 30, 26, 0.12);
```

### Selection Color
`rgba(226, 78, 16, 0.2)` background with `#2f1e1a` text.

### Dark Mode
Not yet implemented. When added: reduce saturation 10-20%, darken surfaces to earth-950 range, keep ochre-600 as primary accent.

## Spacing
- **Base unit:** 4px (Tailwind default)
- **Density:** Comfortable
- **Section padding:** `py-20 md:py-24 lg:py-28` (80px / 96px / 112px)
- **Card internal padding:** `px-6 py-5` (24px / 20px)
- **Container:** `max-w-7xl` with `px-5 sm:px-6 lg:px-10`
- **Gap between elements:** Typically `gap-4` (16px) to `gap-8` (32px)

## Layout
- **Approach:** Grid-disciplined
- **Max content width:** `max-w-7xl` (80rem / 1280px)
- **Container class:** `.container-custom` — `mx-auto px-5 sm:px-6 lg:px-10 max-w-7xl`
- **Border radius hierarchy:**
  - Buttons: `rounded-xl` (12px)
  - Cards: `rounded-2xl` (16px)
  - Section shells: `rounded-3xl` (24px)
  - Full (avatars, badges): `rounded-full`
- **Card behavior:** Lift on hover with `translateY(-1px)` to `translateY(-2px)` and shadow elevation change.
- **Section shell:** `.section-shell` — `rounded-3xl bg-white border-earth-100 shadow-soft`

## Motion
- **Approach:** Minimal-functional
- **Transitions:** `duration-200` (200ms) for buttons, `duration-300` (300ms) for cards
- **Easing:** `ease-out` for entrances (slide-up), `ease-in` for fades
- **Animations:**
  - `slideUp`: 0.35s ease-out — content entrance
  - `fadeIn`: 0.5s ease-in — opacity transitions
  - `dreamtime`: 10s ease-in-out infinite — ambient slow-scale on hero/background elements
  - `pulse-slow`: 4s cubic-bezier(0.4, 0, 0.6, 1) infinite
- **Scroll behavior:** `smooth` on `html`
- **Hover lifts:** Buttons `-translate-y-0.5`, cards `-translate-y-1` to `-translate-y-2px`

## Components

### Buttons
Three variants, three sizes. All use `rounded-xl`, `font-semibold`, `focus:ring-4 focus:ring-offset-2`.

| Variant | Background | Text | Shadow | Hover |
|---------|-----------|------|--------|-------|
| Primary | `ochre-600` | white | `0 10px 24px rgba(226,78,16,0.26)` | `ochre-700`, lift |
| Secondary | white, `border-earth-300` | `earth-800` | none | `earth-50` bg |
| Ghost | `earth-100/75` | `earth-700` | none | `earth-200/85` bg |

| Size | Padding | Text |
|------|---------|------|
| sm | `px-4 py-2.5` | `text-sm` |
| md | `px-6 py-3.5` | `text-sm md:text-base` |
| lg | `px-8 py-4` | `text-base md:text-lg` |

### Cards
`bg-white rounded-2xl border-earth-100 shadow-soft`. Hover: lift + elevated shadow. Internal padding `px-6 py-5`. Footer uses `bg-sand-50` with `border-t border-earth-100`.

### Eyebrow
`.eyebrow` — `inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.24em] text-ochre-600 font-semibold`

### Text Gradient
`.text-gradient` — `bg-gradient-to-r from-ochre-700 via-ochre-500 to-sunset-500 bg-clip-text text-transparent`

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-14 | Initial DESIGN.md created | Formalized existing design system from codebase. All values extracted from tailwind.config.js, index.css, and component files. |
| — | Outfit + Plus Jakarta Sans | Geometric warmth for display, clean readability for body. Both have personality without being distracting. |
| — | 5-palette color system | Ochre/Earth/Eucalyptus/Sunset/Sand — all grounded in the Australian landscape and Aboriginal art traditions. |
| — | Warm sand backgrounds | `sand-50` base with subtle radial gradients. Feels like sunlit earth, not sterile white. |
| — | Rounded corners hierarchy | xl → 2xl → 3xl creates visual hierarchy: interactive elements are tighter, container elements are softer. |
