/**
 * Site Config — persists editorial choices (photo swaps, content overrides)
 *
 * Stores in localStorage immediately for responsive editing.
 * Also mirrors to Supabase (when configured) for team-wide shared overrides.
 */
import {
  canUseRemoteOverrides,
  deleteAllSharedPhotoOverrides,
  deleteSharedPhotoOverride,
  loadSharedPhotoOverrides,
  upsertSharedPhotoOverride,
} from './photoOverridesService';

const STORAGE_KEY = 'oonchiumpa_site_config';
const PHOTO_CHANGE_EVENT = 'oonchiumpa:photo-change';
let hydrationPromise: Promise<void> | null = null;
let hydrated = false;

export interface SiteConfig {
  /** Photo overrides: slot ID → { url, alt, assetId } */
  photos: Record<string, { url: string; alt: string; assetId?: string }>;
  /** Last updated timestamp */
  updatedAt: string;
}

export interface PhotoChangeEventDetail {
  action: 'set' | 'clear' | 'reset-all';
  slotId?: string;
  photo?: { url: string; alt: string; assetId?: string };
}

function emitPhotoChange(detail: PhotoChangeEventDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<PhotoChangeEventDetail>(PHOTO_CHANGE_EVENT, { detail }));
}

export function subscribePhotoChanges(
  listener: (detail: PhotoChangeEventDetail) => void,
) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<PhotoChangeEventDetail>;
    listener(customEvent.detail);
  };
  window.addEventListener(PHOTO_CHANGE_EVENT, handler as EventListener);
  return () => window.removeEventListener(PHOTO_CHANGE_EVENT, handler as EventListener);
}

function getConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { photos: {}, updatedAt: new Date().toISOString() };
}

function saveConfig(config: SiteConfig) {
  config.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** Pull latest shared overrides from Supabase and hydrate local cache */
export async function hydratePhotosFromRemote(force = false) {
  if (!canUseRemoteOverrides()) return;
  if (hydrated && !force) return;
  if (hydrationPromise && !force) return hydrationPromise;

  hydrationPromise = (async () => {
    const remote = await loadSharedPhotoOverrides();
    const remoteKeys = Object.keys(remote);
    if (remoteKeys.length === 0) {
      hydrated = true;
      return;
    }

    const config = getConfig();
    config.photos = {
      ...config.photos,
      ...remote,
    };
    saveConfig(config);
    hydrated = true;
    emitPhotoChange({ action: 'reset-all' });
  })().finally(() => {
    hydrationPromise = null;
  });

  return hydrationPromise;
}

/** Get a photo override for a slot, or null if using default */
export function getPhoto(slotId: string): { url: string; alt: string } | null {
  const config = getConfig();
  return config.photos[slotId] || null;
}

/** Set a photo override for a slot */
export function setPhoto(slotId: string, url: string, alt: string, assetId?: string) {
  const config = getConfig();
  config.photos[slotId] = { url, alt, assetId };
  saveConfig(config);
  emitPhotoChange({
    action: 'set',
    slotId,
    photo: { url, alt, assetId },
  });
  void upsertSharedPhotoOverride(slotId, { url, alt, assetId });
}

/** Clear a photo override (revert to default) */
export function clearPhoto(slotId: string) {
  const config = getConfig();
  delete config.photos[slotId];
  saveConfig(config);
  emitPhotoChange({ action: 'clear', slotId });
  void deleteSharedPhotoOverride(slotId);
}

/** Get all photo overrides */
export function getAllPhotos(): Record<string, { url: string; alt: string; assetId?: string }> {
  return getConfig().photos;
}

/** Clear all overrides */
export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  emitPhotoChange({ action: 'reset-all' });
}

/** Clear all local overrides and attempt to clear shared cloud overrides */
export async function resetAllWithRemote() {
  resetAll();
  if (!canUseRemoteOverrides()) return false;
  return deleteAllSharedPhotoOverrides();
}
