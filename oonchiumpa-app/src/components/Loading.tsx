import React from 'react';
import { CirclePattern } from '../design-system/symbols';

export const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-sand-50 flex items-center justify-center z-50">
      <div className="relative">
        <CirclePattern className="w-24 h-24 text-ochre-500 animate-pulse" />
        <div className="mt-4 text-center">
          <span className="text-earth-700 font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};