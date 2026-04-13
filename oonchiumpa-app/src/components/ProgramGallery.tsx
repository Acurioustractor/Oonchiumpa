import React from "react";
import { EditableImage } from "./EditableImage";

export interface ProgramGalleryItem {
  slotId: string;
  defaultSrc: string;
  defaultAlt: string;
  imageCaption?: string;
  kicker?: string;
  title: string;
  description: string;
  proof?: string;
  proofLabel?: string;
  method?: string;
}

interface ProgramGalleryProps {
  eyebrow: string;
  title: string;
  description: string;
  items: ProgramGalleryItem[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  variant?: "cards" | "rows";
  className?: string;
}

export const ProgramGallery: React.FC<ProgramGalleryProps> = ({
  eyebrow,
  title,
  description,
  items,
  ctaLabel,
  onCtaClick,
  variant = "cards",
  className = "",
}) => {
  if (variant === "rows") {
    return (
      <section className={`bg-white py-16 md:py-20 px-6 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.25em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4">
              {title}
            </h2>
            <p className="text-earth-700 text-lg leading-relaxed">{description}</p>
          </div>

          <div className="space-y-8">
            {items.map((item) => (
              <article
                key={item.slotId}
                className="grid lg:grid-cols-5 rounded-2xl overflow-hidden border border-earth-100 bg-earth-50"
              >
                <div className="relative min-h-[260px] lg:col-span-2">
                  <EditableImage
                    slotId={item.slotId}
                    defaultSrc={item.defaultSrc}
                    defaultAlt={item.defaultAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                    wrapperClassName="absolute inset-0"
                  />
                  {item.imageCaption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white/90 text-xs leading-relaxed">
                        {item.imageCaption}
                      </p>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-3 p-6 md:p-8">
                  {item.kicker && (
                    <p className="text-ochre-600 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
                      {item.kicker}
                    </p>
                  )}
                  <h3 className="text-2xl md:text-3xl font-display text-earth-950 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-earth-700 text-base md:text-lg leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <div className={`grid gap-4 ${item.method ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
                    {item.proof && (
                      <div className="bg-white border border-earth-100 rounded-lg p-4">
                        <p className="text-earth-500 text-xs uppercase tracking-[0.18em] mb-2">
                          {item.proofLabel || "Evidence"}
                        </p>
                        <p className="text-earth-800 text-sm leading-relaxed font-medium">
                          {item.proof}
                        </p>
                      </div>
                    )}
                    {item.method && (
                      <div className="bg-white border border-earth-100 rounded-lg p-4">
                        <p className="text-earth-500 text-xs uppercase tracking-[0.18em] mb-2">
                          How we do it
                        </p>
                        <p className="text-earth-700 text-sm leading-relaxed">
                          {item.method}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-earth-50 py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-ochre-600 text-sm uppercase tracking-[0.25em] mb-4">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-earth-950 mb-4">
              {title}
            </h2>
            <p className="text-earth-700 text-lg leading-relaxed">{description}</p>
          </div>
          {ctaLabel && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="px-6 py-3 bg-earth-900 text-white rounded-lg hover:bg-earth-800 transition-colors font-medium"
            >
              {ctaLabel}
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <article
              key={item.slotId}
              className="bg-white border border-earth-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <EditableImage
                slotId={item.slotId}
                defaultSrc={item.defaultSrc}
                defaultAlt={item.defaultAlt}
                className="absolute inset-0 w-full h-full object-cover"
                wrapperClassName="relative h-52"
              />
              {item.imageCaption && (
                <p className="px-4 py-2 text-xs text-earth-600 bg-earth-50 border-t border-earth-100">
                  {item.imageCaption}
                </p>
              )}
              <div className="p-6">
                {item.kicker && (
                  <p className="text-ochre-600 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
                    {item.kicker}
                  </p>
                )}
                <h3 className="text-xl font-semibold text-earth-950 mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-earth-700 text-sm leading-relaxed">
                  {item.description}
                </p>
                {item.proof && (
                  <div className="mt-5 pt-5 border-t border-earth-100">
                    <p className="text-earth-500 text-xs uppercase tracking-[0.18em] mb-2">
                      {item.proofLabel || "Proof point"}
                    </p>
                    <p className="text-earth-800 text-sm font-medium leading-relaxed">
                      {item.proof}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

