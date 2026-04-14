# Scripts

One-off TypeScript scripts for content, data, and integration work.
Run with `bun` or `tsx` from the repo root.

## Layout

- `blog/` — blog post creation, migrations, media updates, column checks
- `content/` — good-news stories, Descript video examples, bulk doc upload, AI analysis
- `empathy-ledger/` — EL sync, schema verification, workflow tests
- `outcomes/` — impact/outcomes table setup, import, verification

Most scripts are single-purpose backfills or verifications. Check the
top of each file for inline docs. Scripts that require env vars expect
`.env` at repo root with Supabase + EL credentials.

If a script has already been run successfully and won't be re-run,
move it to `scripts/archive/` rather than deleting — git history is
more useful when scripts are discoverable.
