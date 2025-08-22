import React from 'react';

export const DotPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className}
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity="0.3" />
    </pattern>
    <rect width="100" height="100" fill="url(#dot-pattern)" />
  </svg>
);

export const CirclePattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className}
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.5" />
  </svg>
);

export const WavePattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className}
    viewBox="0 0 1200 120" 
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
      fill="currentColor" 
      opacity="0.3"
    />
  </svg>
);

export const SpiralPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className}
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M100,100 Q120,100 120,80 Q120,60 100,60 Q80,60 80,80 Q80,100 100,100 Q120,100 120,120 Q120,140 100,140 Q80,140 80,120 Q80,100 100,100"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      opacity="0.4"
    />
  </svg>
);

export const CrosshatchPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className}
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <pattern id="crosshatch" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M0,10 L10,0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M0,0 L10,10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </pattern>
    <rect width="100" height="100" fill="url(#crosshatch)" />
  </svg>
);