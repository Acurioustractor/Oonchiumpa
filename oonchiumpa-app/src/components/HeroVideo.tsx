import React, { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  /** Path to the MP4 video file */
  src: string;
  /** Fallback poster image (shown while video loads, or if video fails) */
  poster: string;
  /** Alt text for the poster image */
  alt: string;
  className?: string;
  wrapperClassName?: string;
  /** Crossfade duration in ms. Default 700. */
  crossfadeMs?: number;
}

/**
 * Hero video with poster-first rendering.
 *
 * Desktop: two <video> elements alternate with a crossfade so the loop
 * point isn't a hard cut. Mobile / touch devices use a single looping
 * video — iOS Safari rejects autoplay on a second concurrent video and
 * dual preload wastes cellular bandwidth. Respects prefers-reduced-motion
 * (poster only) and lazy-loads videos after first paint.
 */
export function HeroVideo({
  src,
  poster,
  alt,
  className = "",
  wrapperClassName = "",
  crossfadeMs = 700,
}: HeroVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [mountVideos, setMountVideos] = useState(false);
  const [firstReady, setFirstReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState<"a" | "b">("a");
  const [useCrossfade, setUseCrossfade] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    // Crossfade only on pointer-capable, wide viewports — touch devices
    // (especially iOS) choke on two concurrent autoplaying videos.
    const isDesktop = window.matchMedia("(min-width: 768px) and (hover: hover)").matches;
    setUseCrossfade(isDesktop);
    const t = setTimeout(() => setMountVideos(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mountVideos) return;
    const a = videoARef.current;
    if (!a) return;
    const onReady = () => {
      setFirstReady(true);
      a.play().catch(() => {});
    };
    // iOS sometimes fires loadeddata before canplay, sometimes neither
    // until after a user interaction — listen for both so we don't stall.
    a.addEventListener("canplay", onReady, { once: true });
    a.addEventListener("loadeddata", onReady, { once: true });
    return () => {
      a.removeEventListener("canplay", onReady);
      a.removeEventListener("loadeddata", onReady);
    };
  }, [mountVideos]);

  useEffect(() => {
    if (!mountVideos || !firstReady || !useCrossfade) return;
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    const leadSeconds = crossfadeMs / 1000 + 0.05;
    const isA = activeVideo === "a";
    const active = isA ? a : b;
    const other = isA ? b : a;
    let swapped = false;

    const onTimeUpdate = () => {
      if (swapped) return;
      const duration = active.duration;
      if (!duration || isNaN(duration)) return;
      if (duration - active.currentTime <= leadSeconds) {
        swapped = true;
        other.currentTime = 0;
        other.play().catch(() => {});
        setActiveVideo(isA ? "b" : "a");
        window.setTimeout(() => {
          active.pause();
        }, crossfadeMs);
      }
    };

    active.addEventListener("timeupdate", onTimeUpdate);
    return () => active.removeEventListener("timeupdate", onTimeUpdate);
  }, [mountVideos, firstReady, activeVideo, crossfadeMs, useCrossfade]);

  const isA = activeVideo === "a";
  const transitionStyle = { transitionDuration: `${crossfadeMs}ms` };

  return (
    <div className={`absolute inset-0 ${wrapperClassName}`}>
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        aria-hidden={firstReady ? "true" : undefined}
      />
      {mountVideos && (
        <>
          <video
            ref={videoARef}
            src={src}
            muted
            playsInline
            loop={!useCrossfade}
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-linear ${
              firstReady && (useCrossfade ? isA : true) ? "opacity-100" : "opacity-0"
            } ${className}`}
            style={transitionStyle}
          />
          {useCrossfade && (
            <video
              ref={videoBRef}
              src={src}
              muted
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-linear ${
                firstReady && !isA ? "opacity-100" : "opacity-0"
              } ${className}`}
              style={transitionStyle}
            />
          )}
        </>
      )}
    </div>
  );
}
