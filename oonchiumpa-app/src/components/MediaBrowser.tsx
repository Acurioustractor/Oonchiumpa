/**
 * MediaBrowser. Empathy Ledger photo/media picker widget
 *
 * A reusable widget that lets site editors browse and select photos
 * from their Empathy Ledger organisation. Works with any org via
 * the v2 API key scoping.
 *
 * Usage:
 *   <MediaBrowser
 *     onSelect={(url, asset) => setImage(url)}
 *     trigger={<button>Change photo</button>}
 *   />
 *
 * Or inline (always visible):
 *   <MediaBrowser onSelect={handleSelect} inline />
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as el from '../services/empathyLedgerClient';

interface MediaBrowserProps {
  /** Called when user selects a photo */
  onSelect: (url: string, asset: el.MediaAsset) => void;
  /** Custom trigger element (default: camera icon button) */
  trigger?: React.ReactNode;
  /** Show inline instead of modal */
  inline?: boolean;
  /** Filter by gallery */
  galleryId?: string;
  /** Filter by media type */
  type?: string;
  /** Max items to load */
  limit?: number;
  /** Currently selected URL (shows checkmark) */
  selectedUrl?: string;
}

export function MediaBrowser({
  onSelect,
  trigger,
  inline = false,
  galleryId,
  type,
  limit = 300,
  selectedUrl,
}: MediaBrowserProps) {
  const [open, setOpen] = useState(inline);
  const [media, setMedia] = useState<el.MediaAsset[]>([]);
  const [galleries, setGalleries] = useState<el.Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeGallery, setActiveGallery] = useState<string | undefined>(galleryId);
  const [search, setSearch] = useState('');

  const loadMedia = useCallback(async () => {
    setLoading(true);
    // Fetch across all pages (EL caps at 100/page). No type filter. EL
    // returns type:'unknown' for most items, so filtering on 'image' drops
    // 90%+ of the library. Instead filter client-side by URL shape.
    const all = await el.getAllMedia({
      galleryId: activeGallery,
      type,
      maxItems: limit,
    });
    const imageLike = (url: string) =>
      /\.(jpe?g|png|webp|gif|avif|heic)(\?.*)?$/i.test(url) ||
      url.includes('/profile-images/') ||
      url.includes('/media/') ||
      url.includes('image');
    setMedia(all.filter((m) => m.url && imageLike(m.url)));
    setLoading(false);
  }, [limit, activeGallery, type]);

  const loadGalleries = useCallback(async () => {
    const result = await el.getGalleries({ limit: 50 });
    setGalleries(result.data);
  }, []);

  useEffect(() => {
    if (open) {
      loadMedia();
      if (galleries.length === 0) loadGalleries();
    }
  }, [open, loadMedia, loadGalleries, galleries.length]);

  const handleSelect = (asset: el.MediaAsset) => {
    onSelect(asset.url!, asset);
    if (!inline) setOpen(false);
  };

  const filtered = search
    ? media.filter(
        (m) =>
          m.title?.toLowerCase().includes(search.toLowerCase()) ||
          m.filename?.toLowerCase().includes(search.toLowerCase()) ||
          m.culturalTags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      )
    : media;

  if (!el.isConfigured) return null;

  // Trigger button
  const triggerEl = trigger || (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-earth-800 text-white rounded-lg hover:bg-earth-700 transition-colors"
      title="Browse photos"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Browse photos
    </button>
  );

  if (!inline && !open) {
    return <span onClick={() => setOpen(true)}>{triggerEl}</span>;
  }

  const content = (
    <div className={inline ? '' : 'fixed inset-0 z-50 bg-black/90 overflow-y-auto'}>
      <div className={inline ? '' : 'max-w-5xl mx-auto p-6'}>
        {/* Header */}
        {!inline && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Browse Photos
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Gallery filter + search */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => setActiveGallery(undefined)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              !activeGallery
                ? 'bg-ochre-600 text-white border-ochre-600'
                : 'text-white/60 border-white/20 hover:border-white/40'
            }`}
          >
            All photos
          </button>
          {galleries.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGallery(g.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                activeGallery === g.id
                  ? 'bg-ochre-600 text-white border-ochre-600'
                  : 'text-white/60 border-white/20 hover:border-white/40'
              }`}
            >
              {g.title} ({g.photoCount})
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="ml-auto px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-white/30 w-40"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-white/40 text-sm py-8 text-center">Loading photos...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/40 text-sm py-8 text-center">No photos found</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {filtered.map((asset) => {
              const isSelected = selectedUrl === asset.url;
              return (
                <button
                  key={asset.id}
                  onClick={() => handleSelect(asset)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-ochre-500 ring-2 ring-ochre-500/30'
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <img
                    src={asset.thumbnailUrl || asset.url!}
                    alt={asset.altText || asset.title || asset.filename || ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-ochre-500/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-ochre-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1">
                    <span className="text-white text-[10px] truncate block">
                      {asset.title || asset.filename || ''}
                    </span>
                  </div>
                  {/* Cultural tags */}
                  {asset.culturalTags && asset.culturalTags.length > 0 && (
                    <div className="absolute top-1 left-1">
                      <span className="bg-ochre-600/80 text-white text-[8px] px-1.5 py-0.5 rounded">
                        {asset.culturalTags[0]}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 text-white/30 text-xs text-center">
          {filtered.length} photos from Empathy Ledger
        </div>
      </div>
    </div>
  );

  return content;
}

/**
 * StorytellerPicker, browse and select storytellers from Empathy Ledger
 */
interface StorytellerPickerProps {
  onSelect: (storyteller: el.Storyteller) => void;
  selectedId?: string;
}

export function StorytellerPicker({ onSelect, selectedId }: StorytellerPickerProps) {
  const [open, setOpen] = useState(false);
  const [storytellers, setStorytellers] = useState<el.Storyteller[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && storytellers.length === 0) {
      setLoading(true);
      el.getStorytellers({ limit: 50 })
        .then((r) => setStorytellers(r.data.filter((s) => s.isActive)))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, storytellers.length]);

  if (!el.isConfigured) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-earth-800 text-white rounded-lg hover:bg-earth-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Browse storytellers
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Select Storyteller
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading ? (
              <p className="text-white/40 text-sm py-8 text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {storytellers.map((s) => {
                  const isSelected = selectedId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelect(s);
                        setOpen(false);
                      }}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-ochre-500 bg-ochre-500/10'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      {s.avatarUrl ? (
                        <img
                          src={s.avatarUrl}
                          alt={s.displayName}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-ochre-600/30 flex items-center justify-center mx-auto mb-3">
                          <span className="text-ochre-300 font-bold text-lg">
                            {s.displayName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                      )}
                      <p className="text-white font-medium text-sm text-center truncate">
                        {s.displayName}
                      </p>
                      {s.isElder && (
                        <p className="text-ochre-400 text-xs text-center mt-0.5">Elder</p>
                      )}
                      {s.location && (
                        <p className="text-white/40 text-xs text-center mt-0.5 truncate">
                          {s.location}
                        </p>
                      )}
                      <p className="text-white/30 text-xs text-center mt-1">
                        {s.storyCount} {s.storyCount === 1 ? 'story' : 'stories'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
