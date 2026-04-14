/**
 * EditableImage — an image that can be swapped via Empathy Ledger MediaBrowser
 *
 * When edit mode is on, shows a small "swap" button overlay.
 * Clicking it opens the MediaBrowser. Selected photo persists via siteConfig.
 *
 * Usage:
 *   <EditableImage
 *     slotId="hero-main"
 *     defaultSrc="/images/hero/hero-main.jpg"
 *     defaultAlt="Atnarpa sunset"
 *     className="w-full h-full object-cover"
 *   />
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediaBrowser } from './MediaBrowser';
import {
  getPhoto,
  setPhoto,
  clearPhoto,
  subscribePhotoChanges,
} from '../services/siteConfig';
import { useEditMode } from '../contexts/EditModeContext';
import type { MediaAsset } from '../services/empathyLedgerClient';

interface EditableImageProps {
  /** Unique slot ID for persistence */
  slotId: string;
  /** Default image source (used when no override set) */
  defaultSrc: string;
  /** Default alt text */
  defaultAlt: string;
  /** Additional className for the img element */
  className?: string;
  /** Additional className for the wrapper div */
  wrapperClassName?: string;
}

export function EditableImage({
  slotId,
  defaultSrc,
  defaultAlt,
  className = '',
  wrapperClassName = '',
}: EditableImageProps) {
  const { isEditMode } = useEditMode();
  const override = getPhoto(slotId);
  const [currentUrl, setCurrentUrl] = useState(override?.url || defaultSrc);
  const [currentAlt, setCurrentAlt] = useState(override?.alt || defaultAlt);

  useEffect(() => {
    const latest = getPhoto(slotId);
    setCurrentUrl(latest?.url || defaultSrc);
    setCurrentAlt(latest?.alt || defaultAlt);
  }, [slotId, defaultSrc, defaultAlt]);

  useEffect(() => {
    return subscribePhotoChanges((detail) => {
      if (detail.action !== 'reset-all' && detail.slotId !== slotId) return;
      const latest = getPhoto(slotId);
      setCurrentUrl(latest?.url || defaultSrc);
      setCurrentAlt(latest?.alt || defaultAlt);
    });
  }, [slotId, defaultSrc, defaultAlt]);

  const handleSelect = useCallback(
    (url: string, asset: MediaAsset) => {
      const alt = asset.altText || asset.title || asset.filename || defaultAlt;
      setPhoto(slotId, url, alt, asset.id);
      setCurrentUrl(url);
      setCurrentAlt(alt);
    },
    [slotId, defaultAlt],
  );

  const handleReset = useCallback(() => {
    clearPhoto(slotId);
    setCurrentUrl(defaultSrc);
    setCurrentAlt(defaultAlt);
  }, [slotId, defaultSrc, defaultAlt]);

  const hasOverride = currentUrl !== defaultSrc;

  return (
    <div
      className={`relative group ${wrapperClassName}`}
      data-editable-slot={slotId}
      data-editable-default-alt={defaultAlt}
    >
      <img src={currentUrl} alt={currentAlt} className={className} />

      {isEditMode && (
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <MediaBrowser
            onSelect={handleSelect}
            selectedUrl={currentUrl}
            trigger={
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-black/80 backdrop-blur text-white rounded-lg hover:bg-black/90 transition-colors shadow-lg">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Swap photo
              </button>
            }
          />
          {hasOverride && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-sunset-600/80 backdrop-blur text-white rounded-lg hover:bg-sunset-600/90 transition-colors shadow-lg"
              title="Revert to default"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
