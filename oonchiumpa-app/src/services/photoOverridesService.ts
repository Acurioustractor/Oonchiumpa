import { supabase } from '../config/supabase';

type PhotoOverride = {
  url: string;
  alt: string;
  assetId?: string;
};

export interface PhotoOverrideEvent {
  id: string;
  action: 'set' | 'clear' | 'reset_all';
  slotId: string | null;
  url: string | null;
  alt: string | null;
  actorEmail: string | null;
  createdAt: string;
}

const TABLE_NAME =
  import.meta.env.VITE_SITE_PHOTO_OVERRIDES_TABLE || 'site_photo_overrides';
const EVENTS_TABLE_NAME =
  import.meta.env.VITE_SITE_PHOTO_OVERRIDE_EVENTS_TABLE ||
  'site_photo_override_events';
const SITE_KEY = import.meta.env.VITE_SITE_CONFIG_KEY || 'oonchiumpa-main';

let remoteDisabled = false;
let warnedTableMissing = false;
let warnedAuthRequired = false;
let warnedEventsTableMissing = false;

function isTableMissingError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  const message = String((error as { message?: string }).message || '').toLowerCase();
  // 42P01 = Postgres "undefined_table"
  // PGRST205 = PostgREST "could not find the table in the schema cache"
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('could not find the table')
  );
}

function handleRemoteError(error: unknown) {
  if (isTableMissingError(error)) {
    remoteDisabled = true;
    if (!warnedTableMissing) {
      warnedTableMissing = true;
      console.warn(
        `[photoOverrides] Table "${TABLE_NAME}" not found. Falling back to local-only overrides.`,
      );
    }
    return;
  }
  const message = String((error as { message?: string }).message || '').toLowerCase();
  const code = (error as { code?: string }).code;
  if (code === '42501' || message.includes('row-level security')) {
    if (!warnedAuthRequired) {
      warnedAuthRequired = true;
      console.warn(
        '[photoOverrides] Sign in is required to save shared photo overrides. Local overrides still work.',
      );
    }
    return;
  }
  console.error('[photoOverrides] Remote sync error:', error);
}

function handleEventTableError(error: unknown) {
  if (isTableMissingError(error)) {
    if (!warnedEventsTableMissing) {
      warnedEventsTableMissing = true;
      console.warn(
        `[photoOverrides] Events table "${EVENTS_TABLE_NAME}" not found. Activity history is disabled.`,
      );
    }
    return;
  }
  const message = String((error as { message?: string }).message || '').toLowerCase();
  const code = (error as { code?: string }).code;
  if (code === '42501' || message.includes('row-level security')) return;
  console.error('[photoOverrides] Event logging error:', error);
}

async function logSharedPhotoOverrideEvent({
  action,
  slotId,
  photo,
  actorId,
  actorEmail,
}: {
  action: 'set' | 'clear' | 'reset_all';
  slotId: string | null;
  photo?: PhotoOverride;
  actorId: string;
  actorEmail: string | null;
}) {
  const { error } = await supabase.from(EVENTS_TABLE_NAME).insert({
    site_key: SITE_KEY,
    slot_id: slotId,
    action,
    url: photo?.url || null,
    alt_text: photo?.alt || null,
    asset_id: photo?.assetId || null,
    actor_id: actorId,
    actor_email: actorEmail,
  });

  if (error) {
    handleEventTableError(error);
  }
}

export function canUseRemoteOverrides() {
  return !remoteDisabled;
}

export async function loadSharedPhotoOverrides() {
  if (remoteDisabled) return {} as Record<string, PhotoOverride>;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('slot_id, url, alt_text, asset_id')
    .eq('site_key', SITE_KEY);

  if (error) {
    handleRemoteError(error);
    return {} as Record<string, PhotoOverride>;
  }

  const overrides: Record<string, PhotoOverride> = {};
  for (const row of data || []) {
    if (!row.slot_id || !row.url) continue;
    overrides[row.slot_id] = {
      url: row.url,
      alt: row.alt_text || 'Oonchiumpa program image',
      assetId: row.asset_id || undefined,
    };
  }
  return overrides;
}

export async function upsertSharedPhotoOverride(slotId: string, photo: PhotoOverride) {
  if (remoteDisabled) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return false;

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      site_key: SITE_KEY,
      slot_id: slotId,
      url: photo.url,
      alt_text: photo.alt,
      asset_id: photo.assetId || null,
      updated_by: user?.id || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'site_key,slot_id' },
  );

  if (error) {
    handleRemoteError(error);
    return false;
  }

  void logSharedPhotoOverrideEvent({
    action: 'set',
    slotId,
    photo,
    actorId: user.id,
    actorEmail: user.email || null,
  });

  return true;
}

export async function deleteSharedPhotoOverride(slotId: string) {
  if (remoteDisabled) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return false;

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('site_key', SITE_KEY)
    .eq('slot_id', slotId);

  if (error) {
    handleRemoteError(error);
    return false;
  }

  void logSharedPhotoOverrideEvent({
    action: 'clear',
    slotId,
    actorId: user.id,
    actorEmail: user.email || null,
  });

  return true;
}

export async function deleteAllSharedPhotoOverrides() {
  if (remoteDisabled) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return false;

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('site_key', SITE_KEY);

  if (error) {
    handleRemoteError(error);
    return false;
  }

  void logSharedPhotoOverrideEvent({
    action: 'reset_all',
    slotId: null,
    actorId: user.id,
    actorEmail: user.email || null,
  });

  return true;
}

export async function fetchSharedPhotoOverrideEvents(limit = 20) {
  if (remoteDisabled) return [] as PhotoOverrideEvent[];

  const { data, error } = await supabase
    .from(EVENTS_TABLE_NAME)
    .select('id, action, slot_id, url, alt_text, actor_email, created_at')
    .eq('site_key', SITE_KEY)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleEventTableError(error);
    return [] as PhotoOverrideEvent[];
  }

  return (data || []).map((row) => ({
    id: String(row.id || ''),
    action: (row.action as PhotoOverrideEvent['action']) || 'set',
    slotId: (row.slot_id as string) || null,
    url: (row.url as string) || null,
    alt: (row.alt_text as string) || null,
    actorEmail: (row.actor_email as string) || null,
    createdAt: String(row.created_at || ''),
  }));
}
