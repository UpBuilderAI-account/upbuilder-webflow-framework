/**
 * Static Mode System - DEPRECATED
 *
 * Static mode has been removed. All previews now run in live/interactive mode.
 * This file is kept for backwards compatibility with existing code that imports from it.
 * The hook always returns false (interactive mode).
 */
import React from 'react';

/**
 * Provider kept for backwards compatibility. Just passes children through.
 */
export function StaticModeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Hook kept for backwards compatibility. Always returns false (interactive mode).
 */
export function useStaticMode(): boolean {
  return false;
}

/**
 * Direct check kept for backwards compatibility. Always returns false.
 */
export function isStaticMode(): boolean {
  return false;
}
