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
 * Hero video with poster-first rendering and crossfade looping.
 *
 * Two <video> elements alternate — as one plays out, the other starts
 * from 0 and fades in, hiding the loop-point cut. Respects
 * prefers-reduced-motion (poster only) and lazy-loads after first paint.
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

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const t = setTimeout(() => setMountVideos(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mountVideos) return;
    const a = videoARef.current;
    if (!a) return;
    const onCanPlay = () => {
      setFirstReady(true);
      a.play().catch(() => {});
    };
    a.addEventListener("canplay", onCanPlay, { once: true });
    return () => a.removeEventListener("canplay", onCanPlay);
  }, [mountVideos]);

  useEffect(() => {
    if (!mountVideos || !firstReady) return;
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
  }, [mountVideos, firstReady, activeVideo, crossfadeMs]);

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
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-linear ${
              firstReady && isA ? "opacity-100" : "opacity-0"
            } ${className}`}
            style={transitionStyle}
          />
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
        </>
      )}
    </div>
  );
}
