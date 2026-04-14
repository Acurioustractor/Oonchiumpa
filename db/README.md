# Database migrations

One-off SQL files used to evolve the Supabase schema. Run against the
Oonchiumpa project via the Supabase SQL editor or `psql`.

## Migrations (chronological)

- `empathy-ledger-integration-schema.sql` — initial EL cross-project tables
- `empathy-ledger-integration-schema-complete.sql` — follow-up additions
- `fix-stories-author-id.sql` — backfill missing author links
- `create-outcomes-schema.sql` — impact/outcomes tracking tables
- `create-video-gallery-schema.sql` — video library tables
- `create-site-photo-overrides-table.sql` — editable image overrides
- `add-notion-source-to-blog-posts.sql` — Notion sync column on blog_posts
- `add-descript-support.sql` — Descript transcription fields

All are idempotent where possible (`CREATE TABLE IF NOT EXISTS`, etc.).
If you add a new migration, prefix with a timestamp (`YYYYMMDD-`) so
ordering is preserved.
