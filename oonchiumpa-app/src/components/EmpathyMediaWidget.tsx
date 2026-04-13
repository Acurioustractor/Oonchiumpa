import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';
import { isConfigured, type MediaAsset } from '../services/empathyLedgerClient';
import { MediaBrowser } from './MediaBrowser';
import {
  clearPhoto,
  getPhoto,
  resetAllWithRemote,
  setPhoto,
  subscribePhotoChanges,
} from '../services/siteConfig';
import {
  canUseRemoteOverrides,
  fetchSharedPhotoOverrideEvents,
  type PhotoOverrideEvent,
} from '../services/photoOverridesService';

type SlotInfo = {
  id: string;
  label: string;
  currentUrl: string | null;
};

function labelFromSlotId(slotId: string): string {
  return slotId
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function scanEditableSlots(): SlotInfo[] {
  if (typeof document === 'undefined') return [];

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('[data-editable-slot]'),
  );
  const seen = new Set<string>();
  const slots: SlotInfo[] = [];

  for (const node of nodes) {
    const slotId = node.dataset.editableSlot;
    if (!slotId || seen.has(slotId)) continue;
    seen.add(slotId);

    const saved = getPhoto(slotId);
    const defaultAlt = node.dataset.editableDefaultAlt || '';

    slots.push({
      id: slotId,
      label: defaultAlt || labelFromSlotId(slotId),
      currentUrl: saved?.url || null,
    });
  }

  return slots.sort((a, b) => a.id.localeCompare(b.id));
}

function areSlotsEqual(a: SlotInfo[], b: SlotInfo[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].id !== b[i].id ||
      a[i].label !== b[i].label ||
      a[i].currentUrl !== b[i].currentUrl
    ) {
      return false;
    }
  }
  return true;
}

export function EmpathyMediaWidget() {
  const location = useLocation();
  const { isEditMode } = useEditMode();
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isResettingAll, setIsResettingAll] = useState(false);
  const [activity, setActivity] = useState<PhotoOverrideEvent[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const refreshSlots = useCallback(() => {
    const nextSlots = scanEditableSlots();
    setSlots((prev) => (areSlotsEqual(prev, nextSlots) ? prev : nextSlots));
    setSelectedSlotId((prev) => {
      if (prev && nextSlots.some((slot) => slot.id === prev)) return prev;
      return nextSlots[0]?.id || null;
    });
  }, []);

  const refreshActivity = useCallback(async () => {
    if (!canUseRemoteOverrides()) return;
    setActivityLoading(true);
    const events = await fetchSharedPhotoOverrideEvents(20);
    setActivity(events);
    setActivityLoading(false);
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setOpen(false);
      return;
    }
    refreshSlots();
  }, [isEditMode, location.pathname, refreshSlots]);

  useEffect(() => {
    if (!isEditMode || !open) return;
    const observer = new MutationObserver(() => refreshSlots());
    observer.observe(document.body, { childList: true, subtree: true });
    void refreshActivity();
    return () => observer.disconnect();
  }, [isEditMode, open, refreshSlots, refreshActivity]);

  useEffect(() => {
    if (!isEditMode) return;
    return subscribePhotoChanges(() => {
      refreshSlots();
      void refreshActivity();
    });
  }, [isEditMode, refreshSlots, refreshActivity]);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) || null,
    [slots, selectedSlotId],
  );

  const handleSelect = useCallback(
    (url: string, asset: MediaAsset) => {
      if (!selectedSlotId) return;
      const alt =
        asset.altText ||
        asset.title ||
        asset.filename ||
        selectedSlot?.label ||
        'Oonchiumpa program image';
      setPhoto(selectedSlotId, url, alt, asset.id);
    },
    [selectedSlotId, selectedSlot],
  );

  const handleReset = useCallback(() => {
    if (!selectedSlotId) return;
    clearPhoto(selectedSlotId);
  }, [selectedSlotId]);

  const handleResetAll = useCallback(async () => {
    const confirmed = window.confirm(
      'Reset all editable slots to default images?',
    );
    if (!confirmed) return;

    setIsResettingAll(true);
    await resetAllWithRemote();
    refreshSlots();
    setIsResettingAll(false);
  }, [refreshSlots]);

  if (!isConfigured || !isEditMode) return null;

  const cloudSyncReady = canUseRemoteOverrides();

  const formatEventTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <button
        onClick={() => {
          refreshSlots();
          setOpen((prev) => !prev);
        }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl bg-earth-900 text-white/90 hover:text-white transition-colors"
        title="Open Empathy Ledger media widget"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs font-medium">Media Widget</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <aside className="absolute left-0 top-0 h-full w-full max-w-[460px] bg-earth-950 border-r border-white/10 overflow-y-auto">
            <div className="p-5 border-b border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-ochre-300 text-xs uppercase tracking-[0.2em] mb-2">
                    Empathy Ledger
                  </p>
                  <h2 className="text-white font-semibold">Photo Swap Widget</h2>
                  <p className="text-white/60 text-xs mt-1">
                    Swap any visible page slot from Empathy Ledger galleries.
                  </p>
                  <p className="text-[11px] mt-2 text-white/50">
                    {cloudSyncReady
                      ? 'Cloud sync: enabled'
                      : 'Cloud sync: unavailable (local-only fallback)'}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {slots.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-white/70 text-sm">
                    No editable slots were detected on this page.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">
                      Select image slot
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                            selectedSlotId === slot.id
                              ? 'border-ochre-500 bg-ochre-500/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30'
                          }`}
                        >
                          <p className="text-xs font-medium truncate">{slot.label}</p>
                          <p className="text-[11px] opacity-70 truncate">{slot.id}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedSlot && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/50 mb-1">
                        Selected slot
                      </p>
                      <p className="text-sm text-white">{selectedSlot.label}</p>
                      <p className="text-[11px] text-white/60 mt-1">{selectedSlot.id}</p>
                      <button
                        onClick={handleReset}
                        className="mt-3 px-3 py-1.5 text-xs font-medium rounded border border-white/25 text-white/80 hover:text-white hover:border-white/45"
                      >
                        Reset this slot
                      </button>
                      <button
                        onClick={handleResetAll}
                        disabled={isResettingAll}
                        className="mt-2 ml-2 px-3 py-1.5 text-xs font-medium rounded border border-sunset-300/35 text-sunset-100 hover:text-white hover:border-sunset-200/60 disabled:opacity-50"
                      >
                        {isResettingAll ? 'Resetting...' : 'Reset all slots'}
                      </button>
                    </div>
                  )}

                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <MediaBrowser
                      inline
                      type="image"
                      limit={160}
                      selectedUrl={selectedSlot?.currentUrl || undefined}
                      onSelect={handleSelect}
                    />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">
                      Recent activity
                    </p>
                    {activityLoading ? (
                      <p className="text-xs text-white/50">Loading activity…</p>
                    ) : activity.length === 0 ? (
                      <p className="text-xs text-white/50">
                        No shared activity yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {activity.map((event) => {
                          const actionLabel =
                            event.action === 'set'
                              ? 'Updated'
                              : event.action === 'clear'
                                ? 'Cleared'
                                : 'Reset all';
                          return (
                            <div
                              key={event.id}
                              className="rounded border border-white/10 bg-black/20 px-2 py-1.5"
                            >
                              <p className="text-[11px] text-white/85">
                                {actionLabel}{' '}
                                <span className="text-white/60">
                                  {event.slotId || 'all slots'}
                                </span>
                              </p>
                              <p className="text-[10px] text-white/45">
                                {event.actorEmail || 'Editor'} · {formatEventTime(event.createdAt)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
