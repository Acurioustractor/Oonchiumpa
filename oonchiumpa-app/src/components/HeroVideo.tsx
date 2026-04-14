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
}

/**
 * Hero video with poster-first rendering.
 *
 * The poster loads immediately so the hero is never blank. The video
 * is lazy-loaded and fades in when ready. On slow connections or if
 * the user has prefers-reduced-motion set, only the poster shows.
 *
 * Always muted (autoplay requires it) and loops.
 */
export function HeroVideo({
  src,
  poster,
  alt,
  className = "",
  wrapperClassName = "",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Lazy-load video after first paint so LCP isn't blocked
    const timeout = setTimeout(() => setShouldLoadVideo(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;
    const video = videoRef.current;
    const onCanPlay = () => {
      setVideoReady(true);
      video.play().catch(() => {
        // Autoplay blocked — poster stays visible, which is fine
      });
    };
    video.addEventListener("canplay", onCanPlay);
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [shouldLoadVideo]);

  return (
    <div className={`absolute inset-0 ${wrapperClassName}`}>
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        aria-hidden={videoReady ? "true" : undefined}
      />
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          loop
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
