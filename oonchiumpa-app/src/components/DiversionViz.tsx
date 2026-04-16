import React, { useEffect, useRef, useState } from "react";

interface DiversionVizProps {
  diverted: number;
  active: number;
  /** ms between each dot filling in. Default 60. */
  stepMs?: number;
}

/**
 * Animated dot-grid visualisation of diversion outcomes.
 * Each dot represents one young person. When the card scrolls into view,
 * the ochre "diverted" dots fill in sequentially and the counter ticks up;
 * the remaining "active" dot reveals last with a pulsing ring.
 */
export function DiversionViz({ diverted, active, stepMs = 60 }: DiversionVizProps) {
  const total = diverted + active;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setStarted(true);
      setFilled(total);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  useEffect(() => {
    if (!started || filled >= total) return;
    const t = window.setTimeout(() => setFilled((n) => n + 1), stepMs);
    return () => window.clearTimeout(t);
  }, [started, filled, total, stepMs]);

  const divertedShown = Math.min(filled, diverted);
  const activeShown = filled > diverted ? filled - diverted : 0;

  return (
    <div ref={ref}>
      <div
        className="flex flex-wrap gap-2 justify-center py-3"
        role="img"
        aria-label={`${diverted} of ${total} young people diverted, ${active} still active`}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isDiverted = i < diverted;
          const revealed = i < filled;
          if (isDiverted) {
            return (
              <span
                key={i}
                aria-hidden
                className={`w-5 h-5 rounded-full transition-[background-color,transform,opacity] duration-300 ease-out ${
                  revealed
                    ? "bg-ochre-400 scale-100 opacity-100"
                    : "bg-white/10 scale-75 opacity-60"
                }`}
              />
            );
          }
          return (
            <span
              key={i}
              aria-hidden
              className={`w-5 h-5 rounded-full ring-2 ring-sunset-400 transition-[transform,opacity] duration-300 ease-out ${
                revealed
                  ? "scale-100 opacity-100 animate-pulse"
                  : "scale-75 opacity-30"
              }`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 text-center">
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-4xl font-display text-ochre-300 tabular-nums leading-none">
            {divertedShown}
          </p>
          <p className="text-xs text-white/75 mt-2">Diverted from Operation Luna</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4 ring-1 ring-sunset-400/30">
          <p className="text-4xl font-display text-sunset-300 tabular-nums leading-none">
            {activeShown}
          </p>
          <p className="text-xs text-white/75 mt-2">Active case · still engaged</p>
        </div>
      </div>
    </div>
  );
}
