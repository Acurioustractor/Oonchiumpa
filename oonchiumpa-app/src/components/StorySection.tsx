import React from 'react';
import { Section } from './Section';
import { DotPattern, CirclePattern } from '../design-system/symbols';

interface StorySectionProps {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  reversed?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({
  title,
  subtitle,
  content,
  imageUrl,
  imageAlt,
  reversed = false
}) => {
  const hasImage = Boolean(imageUrl);
  const JourneyVisual = () => {
    const pillars = [
      {
        label: 'Cultural Authority',
        description: 'Traditional Owner leadership (Kristy Bloomfield) grounding every decision in Country, kinship, and Elder-guided protocols.',
      },
      {
        label: 'Systems Navigation',
        description: 'Strategic advocacy and legal expertise (Tanya Turner) translating community priorities into agreements, policy, and resourcing.',
      },
      {
        label: 'Community Activation',
        description: 'Stories become programs, evidence, and partnerships that sustain healing-led change across regions and sectors.',
      },
    ];

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-earth-900 via-earth-800 to-earth-900 text-white shadow-2xl border border-white/5">
        <div className="absolute -top-32 -left-28 w-80 h-80 rounded-full bg-ochre-500/20 blur-3xl" />
        <div className="absolute -bottom-36 -right-24 w-96 h-96 rounded-full bg-eucalyptus-500/20 blur-3xl" />

        <div className="relative px-8 md:px-10 py-10 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-end space-x-2">
                <span className="block w-11 h-11 rounded-full border-[6px] border-ochre-500" />
                <span className="block w-11 h-11 rounded-full border-[6px] border-eucalyptus-600 -ml-3" />
              </div>
              <span className="px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] bg-white/10 border border-white/20 rounded-full">
                Oonchiumpa Two-World Model
              </span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-3xl">
              Two-world leadership weaving cultural truth with contemporary systems so Aboriginal knowledge guides every platform, partner, and policy decision.
            </p>
          </div>

          <div className="space-y-6">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="flex items-start space-x-4 bg-white/6 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
                <span className="mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-white/12 border border-white/25 text-lg font-display">
                  •
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-display text-white">{pillar.label}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-5 bg-white/8 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-ochre-200">Kristy Bloomfield · Cultural Leadership</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                Traditional Owner authority on Arrernte Country, stewarding Elder councils, knowledge protocols, and community healing practices.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-eucalyptus-200">Tanya Turner · Systems Navigation</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                Contemporary legal excellence translating community stories into advocacy, justice reform, and sustainable funding pathways.
              </p>
            </div>
            <div className="bg-black/20 border border-white/10 rounded-xl p-5">
              <p className="text-sm text-white/85 leading-relaxed">
                Together they steward the Oonchiumpa model, a living system where stories travel from Country to Story to Impact, guiding governance, measurement, and future planning across both cultural and corporate worlds.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section className="relative">
      <div className={`grid ${hasImage ? 'md:grid-cols-2' : ''} gap-12 items-center ${reversed && hasImage ? 'md:flex-row-reverse' : ''}`}>
        <div className={`space-y-6 ${reversed && hasImage ? 'md:order-2' : ''}`}>
          {subtitle && (
            <span className="inline-block px-4 py-2 text-sm font-semibold text-eucalyptus-700 bg-eucalyptus-100 rounded-full">
              {subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-900">
            {title}
          </h2>
          <p className="text-lg text-earth-700 leading-relaxed">
            {content}
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <DotPattern className="w-8 h-8 text-ochre-500" />
            <CirclePattern className="w-8 h-8 text-eucalyptus-500" />
            <DotPattern className="w-8 h-8 text-sunset-500" />
          </div>
        </div>
        
        {hasImage && (
          <div className={`relative ${reversed ? 'md:order-1' : ''}`}>
            <img
              src={imageUrl!}
              alt={imageAlt || title}
              className="w-full rounded-2xl shadow-xl"
            />
          </div>
        )}
      </div>
      <div className="mt-12">
        <JourneyVisual />
      </div>
    </Section>
  );
};
