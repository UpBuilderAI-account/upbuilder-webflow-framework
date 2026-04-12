/**
 * Static Mode System - Disables interactivity for canvas/preview mode
 *
 * When __UP_STATIC_MODE is true (set by bundler):
 * - Dropdowns: Always closed, no hover/click
 * - Accordions: All collapsed, no toggle
 * - Tabs: Only first tab visible, no switching
 * - Navbar: Menu always closed, hamburger disabled
 *
 * This allows the canvas preview to show a clean, non-interactive view
 * while live preview maintains full interactivity.
 *
 * The provider listens for UP_SET_STATIC_MODE messages from the parent frame
 * to toggle between design mode (static) and live mode (interactive).
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Read static mode from window flag (injected by bundler in preview HTML)
 */
function getStaticMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (window as any).__UP_STATIC_MODE === true;
}

const StaticModeContext = createContext<boolean>(false);

/**
 * Provider that reads the static mode flag and listens for mode changes.
 * Wrap your app root with this provider.
 */
export function StaticModeProvider({ children }: { children: React.ReactNode }) {
  const [isStatic, setIsStatic] = useState(() => getStaticMode());

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'UP_SET_STATIC_MODE') {
        const newStaticMode = e.data.staticMode;
        setIsStatic(newStaticMode);
        // Also update the window flag for consistency
        (window as any).__UP_STATIC_MODE = newStaticMode;
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <StaticModeContext.Provider value={isStatic}>
      {children}
    </StaticModeContext.Provider>
  );
}

/**
 * Hook to check if we're in static mode.
 * Returns true when interactivity should be disabled.
 */
export function useStaticMode(): boolean {
  return useContext(StaticModeContext);
}

/**
 * Direct check without context (for use outside React tree)
 */
export function isStaticMode(): boolean {
  return getStaticMode();
}
