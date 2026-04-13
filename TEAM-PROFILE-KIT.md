# Team Profile Kit

How to manage Oonchiumpa team profiles — photos, bios, stories — through Empathy Ledger as the single source of truth.

## The vision

**Empathy Ledger is the home of every person's profile.** The website reads from the EL API. When you update someone in EL, the site updates automatically.

- One storyteller record per person (staff, leader, or community)
- Profile photo managed in EL
- Role field uses a prefix convention so the website can group them:
  - `Leader: Director` / `Leader: Legal Advocate`
  - `Staff: Case Worker` / `Staff: Cultural Liaison`
  - `Community: Law Student` / `Community: Partner`
- As you conduct interviews over time, stories and transcripts attach to their storyteller record and surface on their profile page automatically

## One-time setup: extract headshots from group photo

### Step 1 — save the group photo

```
oonchiumpa-app/public/images/team/group-2024.jpg
```

### Step 2 — run the extraction script

```bash
pip3 install rembg opencv-python pillow
python3 scripts/extract-team-headshots.py
```

This auto-detects faces, crops 400×400 squares with room for shoulders, and removes the background (transparent PNG).

Output: `oonchiumpa-app/public/images/team/back-1.png` through `front-3.png` (11 headshots).

### Step 3 — identify and rename

Open the `public/images/team/` folder, review each headshot, rename with real names:

```
back-1.png → sarah-smith.png
back-2.png → mary-jones.png
...etc
```

Or edit `TEAM_ORDER` in the script and rerun.

## Path A: write to Empathy Ledger via API (recommended if you have admin access)

### Prerequisites
- Admin API key for Empathy Ledger (not the org-scoped read key already in `.env`)
- API docs / endpoint for creating storytellers

### The upload script
Build a Node script at `scripts/sync-team-to-empathy-ledger.ts` that:
1. Reads each `<slug>.png` from `public/images/team/`
2. POSTs to `{EL_BASE}/api/v2/admin/storytellers` with:
   - `displayName`
   - `role` (with prefix: `"Staff: Case Worker"`)
   - `isElder` (if applicable)
   - `location`
3. Uploads the image to `{EL_BASE}/api/v2/admin/storytellers/{id}/avatar`

Once this runs, every team member lives in EL. The website picks them up automatically on next load.

### What you need to paste when asked
```
EL_ADMIN_URL=https://...
EL_ADMIN_KEY=...  (never commit this)
```

## Path B: use EL admin UI (if no API write access)

1. Log into Empathy Ledger admin
2. For each headshot, create a storyteller:
   - Upload photo
   - Name, role (with prefix), elder status, location
3. Website picks them up next load

## Website: display logic

The TeamPage is already wired to pull storytellers from EL. Update it to group by role prefix instead of hardcoded categories:

```tsx
// In TeamPage.tsx
const leaders = storytellers.filter(s => s.role?.startsWith("Leader:"));
const staff = storytellers.filter(s => s.role?.startsWith("Staff:"));
const community = storytellers.filter(s => s.role?.startsWith("Community:"));
```

Once all 11 team members are in EL, **delete `src/data/team.ts`** — it's no longer needed.

## The ongoing workflow (interview over time)

Each team member's storyteller record in EL becomes their permanent profile. Over the coming months:

1. Schedule an interview (or sit-down conversation)
2. Record audio/video
3. Upload to EL → attaches to their storyteller ID
4. Transcribe (EL handles this)
5. Storyteller's profile page on the website now shows their story
6. Update their bio in EL with what came out of the interview

Every profile gets richer over time without any code changes.

## Photo updates

To swap someone's headshot:
1. Upload a new photo in EL admin
2. Website auto-updates on next load

No redeploy needed. That's the whole point of this architecture.

## File locations

- Group photo: `oonchiumpa-app/public/images/team/group-2024.jpg`
- Headshots: `oonchiumpa-app/public/images/team/<slug>.png`
- Extraction script: `scripts/extract-team-headshots.py`
- Current static team data (to be retired): `oonchiumpa-app/src/data/team.ts`
- EL client: `oonchiumpa-app/src/services/empathyLedgerClient.ts` (currently read-only)
- Team page: `oonchiumpa-app/src/pages/TeamPage.tsx`
