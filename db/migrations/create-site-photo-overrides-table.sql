-- Shared photo slot overrides for Oonchiumpa web edit mode
-- Run in Supabase SQL editor for project yvnuayzslukamizrlhwb

create table if not exists public.site_photo_overrides (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'oonchiumpa-main',
  slot_id text not null,
  url text not null,
  alt_text text,
  asset_id text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (site_key, slot_id)
);

create index if not exists idx_site_photo_overrides_site_key
  on public.site_photo_overrides(site_key);

alter table public.site_photo_overrides enable row level security;

drop policy if exists "Site photo overrides are readable by everyone"
  on public.site_photo_overrides;
create policy "Site photo overrides are readable by everyone"
  on public.site_photo_overrides
  for select
  using (true);

drop policy if exists "Authenticated users can modify site photo overrides"
  on public.site_photo_overrides;
create policy "Authenticated users can modify site photo overrides"
  on public.site_photo_overrides
  for all
  to authenticated
  using (true)
  with check (true);

-- Optional activity log table (for widget "Recent activity")
create table if not exists public.site_photo_override_events (
  id uuid primary key default gen_random_uuid(),
  site_key text not null default 'oonchiumpa-main',
  slot_id text,
  action text not null check (action in ('set', 'clear', 'reset_all')),
  url text,
  alt_text text,
  asset_id text,
  actor_id uuid references auth.users(id),
  actor_email text,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_photo_override_events_site_key_created
  on public.site_photo_override_events(site_key, created_at desc);

alter table public.site_photo_override_events enable row level security;

drop policy if exists "Site photo override events are readable by everyone"
  on public.site_photo_override_events;
create policy "Site photo override events are readable by everyone"
  on public.site_photo_override_events
  for select
  using (true);

drop policy if exists "Authenticated users can insert site photo override events"
  on public.site_photo_override_events;
create policy "Authenticated users can insert site photo override events"
  on public.site_photo_override_events
  for insert
  to authenticated
  with check (true);
