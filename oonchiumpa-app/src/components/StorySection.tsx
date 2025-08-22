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
  return (
    <Section className="relative">
      <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}>
        <div className={`space-y-6 ${reversed ? 'md:order-2' : ''}`}>
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
        
        <div className={`relative ${reversed ? 'md:order-1' : ''}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full rounded-2xl shadow-xl"
            />
          ) : (
            <div className="aspect-video bg-gradient-to-br from-ochre-100 to-eucalyptus-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <CirclePattern className="absolute inset-0 w-full h-full text-ochre-300 opacity-20" />
              <span className="text-earth-600 font-medium z-10">Story Visual</span>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};