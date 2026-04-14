/**
 * EditModeContext — toggle edit mode to show photo swap buttons, content editors, etc.
 *
 * Edit mode is activated via:
 *   - The floating edit button (bottom-right)
 *   - Keyboard shortcut: Ctrl/Cmd + E
 *   - URL param: ?edit=true
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isConfigured } from '../services/empathyLedgerClient';

interface EditModeContextValue {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextValue>({
  isEditMode: false,
  toggleEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(() => {
    // Check URL param
    const params = new URLSearchParams(window.location.search);
    return params.get('edit') === 'true';
  });

  // Keyboard shortcut: Ctrl/Cmd + E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  // Don't render the edit button if EL not configured
  if (!isConfigured) {
    return (
      <EditModeContext.Provider value={{ isEditMode: false, toggleEditMode }}>
        {children}
      </EditModeContext.Provider>
    );
  }

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}

      {/* Floating edit toggle */}
      <button
        onClick={toggleEditMode}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl transition-all ${
          isEditMode
            ? 'bg-ochre-600 text-white'
            : 'bg-earth-900 text-white/80 hover:text-white'
        }`}
        title={isEditMode ? 'Exit edit mode (Cmd+E)' : 'Edit mode (Cmd+E)'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span className="text-xs font-medium">
          {isEditMode ? 'Editing' : 'Edit'}
        </span>
      </button>
    </EditModeContext.Provider>
  );
}
