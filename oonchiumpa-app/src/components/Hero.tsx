import React from 'react';
import { Button } from './Button';
import { WavePattern, CirclePattern } from '../design-system/symbols';

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
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <CirclePattern className="absolute top-10 right-10 w-64 h-64 text-ochre-400 opacity-10 animate-dreamtime" />
        <CirclePattern className="absolute bottom-20 left-20 w-96 h-96 text-eucalyptus-500 opacity-10 animate-pulse-slow" />
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-ochre-700 bg-ochre-100 rounded-full animate-fade-in">
              {subtitle}
            </span>
          )}
          
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-display font-bold text-earth-900 animate-slide-up">
            <span className="block mb-2">{title.split(' ').slice(0, -1).join(' ')}</span>
            <span className="text-gradient">{title.split(' ').slice(-1)}</span>
          </h1>
          
          {description && (
            <p className="mb-10 text-lg md:text-xl text-earth-700 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
            {primaryAction && (
              <Button
                variant="primary"
                size="lg"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="secondary"
                size="lg"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <WavePattern className="w-full h-24 text-white" />
      </div>
    </section>
  );
};