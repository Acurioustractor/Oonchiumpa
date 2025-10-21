import React from "react";
import { Button } from "./Button";
import { CirclePattern } from "../design-system/symbols";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number; // 0-100 for overlay darkness
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 55,
}) => {
  const hasBackgroundMedia = backgroundImage || backgroundVideo;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background Media */}
      <div className="absolute inset-0">
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50" />
        )}

        {/* Overlay */}
        {hasBackgroundMedia && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80"
              style={{ opacity: overlayOpacity / 60 }}
            />
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-earth-900/80 via-earth-900/25 to-transparent" />
          </div>
        )}
      </div>

      {/* Background Patterns (only show if no background media) */}
      {!hasBackgroundMedia && (
        <div className="absolute inset-0 pointer-events-none">
          <CirclePattern className="absolute top-10 right-10 w-64 h-64 text-ochre-400 opacity-10 animate-dreamtime" />
          <CirclePattern className="absolute bottom-20 left-20 w-96 h-96 text-eucalyptus-500 opacity-10 animate-pulse-slow" />
        </div>
      )}

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <span
              className={`inline-block px-4 py-2 mb-6 text-sm font-semibold rounded-full animate-fade-in ${
                hasBackgroundMedia
                  ? "text-white/90 bg-white/15 backdrop-blur-md border border-white/25 shadow-lg"
                  : "text-ochre-700 bg-ochre-100"
              }`}
            >
              {subtitle}
            </span>
          )}

          <h1
            className={`mb-6 text-5xl md:text-6xl lg:text-7xl font-display font-bold animate-slide-up ${
              hasBackgroundMedia ? "text-white" : "text-earth-900"
            }`}
            style={{ textShadow: hasBackgroundMedia ? "0 12px 40px rgba(0,0,0,0.55)" : undefined }}
          >
            <span className="block mb-2">
              {title.split(" ").slice(0, -1).join(" ")}
            </span>
            <span
              className={
                hasBackgroundMedia ? "text-ochre-200" : "text-gradient"
              }
            >
              {title.split(" ").slice(-1)}
            </span>
          </h1>

          {description && (
            <p
              className={`mb-10 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in animation-delay-200 ${
                hasBackgroundMedia ? "text-white/90" : "text-earth-700"
              }`}
              style={{ textShadow: hasBackgroundMedia ? "0 8px 32px rgba(0,0,0,0.45)" : undefined }}
            >
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            {primaryAction && (
              <Button
                variant="primary"
                size="lg"
                onClick={primaryAction.onClick}
                className={hasBackgroundMedia ? "shadow-xl shadow-black/40 hover:shadow-black/50" : ''}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={hasBackgroundMedia ? "ghost" : "secondary"}
                size="lg"
                onClick={secondaryAction.onClick}
                className={hasBackgroundMedia ? "border border-white/50 text-white/85 hover:bg-white/15 hover:text-white" : ''}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-earth-900/40 via-earth-900/10 to-transparent pointer-events-none" />
    </section>
  );
};
