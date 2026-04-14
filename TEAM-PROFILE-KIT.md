# Team Profile Kit — the simple version

## The whole workflow in plain English

1. Take a good phone photo of each person. Square-ish, head and shoulders, decent light.
2. Drop each into `oonchiumpa-app/public/images/team/` with a sensible filename (e.g. `sarah-smith.jpg`).
3. Add one line to `src/data/team.ts`:
   ```ts
   { name: "Sarah Smith", role: "Case Worker", category: "staff", photo: "/images/team/sarah-smith.jpg", order: 3 },
   ```
4. Save. Site updates.

That's it.

## The group photo

Save the 2024 team photo to `oonchiumpa-app/public/images/team/group-2024.jpg` and it appears as a large banner on the /team page above the individual staff cards. No cropping needed — it's a team photo, it should look like a team photo.

## When you want to migrate to Empathy Ledger (later)

Empathy Ledger becomes the source of truth for profiles. The website already auto-picks up EL storytellers whose role starts with `Leader:`, `Staff:`, or `Community:` — they replace the corresponding placeholders in `team.ts`.

To migrate:
1. For each person, create a storyteller in EL admin UI with:
   - `role`: `"Staff: Case Worker"` (note the prefix)
   - Avatar upload
   - Bio
2. When all 11 are in EL, delete `src/data/team.ts`.

Or use `scripts/sync-team-to-empathy-ledger.ts` if you want to batch-create via the EL admin API (needs `EL_ADMIN_URL` and `EL_ADMIN_KEY`).

## Updating a photo

- If still using `team.ts`: replace the file at `public/images/team/<slug>.jpg`, redeploy.
- If using EL: upload a new avatar in the EL admin. Site updates on next load, no redeploy.

That's why the long-term goal is EL. Everything else is a stepping stone.
