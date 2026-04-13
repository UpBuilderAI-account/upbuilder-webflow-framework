/**
 * IX2 Runtime Loader & React Hook
 *
 * Loads Webflow's IX2 animation engine and provides a way to initialize
 * it with custom IX2 data for accordion/dropdown animations.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    jQuery: any;
    $: any;
    Webflow: any;
    __WEBFLOW_IX2_INIT__?: (data: IX2Data) => void;
  }
}

export interface IX2Event {
  id: string;
  name?: string;
  animationType: string;
  eventTypeId: string;
  action: {
    id: string;
    actionTypeId: string;
    config: Record<string, any>;
  };
  mediaQueries: string[];
  target: {
    id?: string;
    selector?: string;
    appliesTo: string;
    styleBlockIds?: string[];
  };
  targets?: Array<{
    id?: string;
    selector?: string;
    appliesTo: string;
    styleBlockIds?: string[];
  }>;
  config: Record<string, any>;
  createdOn?: number;
}

export interface IX2ActionItem {
  id: string;
  actionTypeId: string;
  config: {
    delay: number;
    easing: string;
    duration: number;
    target: {
      selector?: string;
      appliesTo?: string;
      styleBlockIds?: string[];
      useEventTarget?: string;
      boundaryMode?: boolean;
    };
    [key: string]: any;
  };
}

export interface IX2ActionList {
  id: string;
  title: string;
  actionItemGroups: Array<{
    actionItems: IX2ActionItem[];
  }>;
  useFirstGroupAsInitialState?: boolean;
  createdOn?: number;
}

export interface IX2Data {
  events: Record<string, IX2Event>;
  actionLists: Record<string, IX2ActionList>;
  site?: {
    mediaQueries: Array<{
      key: string;
      min?: number;
      max?: number;
    }>;
  };
}

let scriptsLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Load script dynamically
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Maintain load order
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Load all required Webflow IX2 scripts
 */
export async function loadIX2Scripts(basePath = '/webflow-defaults'): Promise<void> {
  if (scriptsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Load jQuery first (required by Webflow)
    await loadScript(`${basePath}/jquery-3.5.1.min.js`);

    // Load Webflow chunk (IX2 engine utilities)
    await loadScript(`${basePath}/webflow-chunk.js`);

    // Load modified Webflow runtime (without auto-init)
    await loadScript(`${basePath}/webflow-ix2.js`);

    scriptsLoaded = true;
    console.log('[IX2 Runtime] All scripts loaded');
  })();

  return loadingPromise;
}

/**
 * Initialize IX2 with custom data
 */
export async function initIX2(data: IX2Data, basePath = '/webflow-defaults'): Promise<void> {
  // Ensure scripts are loaded
  await loadIX2Scripts(basePath);

  // Wait for Webflow to be ready
  if (!window.__WEBFLOW_IX2_INIT__) {
    console.error('[IX2 Runtime] Webflow IX2 init function not available');
    return;
  }

  // Initialize with our data
  window.__WEBFLOW_IX2_INIT__(data);
  console.log('[IX2 Runtime] Initialized with custom IX2 data');
}

/**
 * Re-initialize IX2 (useful after React re-renders)
 */
export function refreshIX2(): void {
  if (window.Webflow) {
    // Trigger Webflow's ready event to re-bind elements
    window.Webflow.ready();
    window.Webflow.require('ix2').init();
    console.log('[IX2 Runtime] Refreshed');
  }
}

/**
 * Destroy IX2 instance
 */
export function destroyIX2(): void {
  if (window.Webflow) {
    window.Webflow.require('ix2').destroy();
    console.log('[IX2 Runtime] Destroyed');
  }
}

/**
 * Check if IX2 is loaded and ready
 */
export function isIX2Ready(): boolean {
  return scriptsLoaded && !!window.Webflow && !!window.__WEBFLOW_IX2_INIT__;
}

// ============================================================================
// REACT HOOK
// ============================================================================

export interface UseIX2Options {
  /** Base path to webflow-defaults folder (default: '/webflow-defaults') */
  basePath?: string;
  /** Delay in ms before initializing (default: 100) */
  initDelay?: number;
}

/**
 * React hook to manage IX2 animation lifecycle
 *
 * @example
 * ```tsx
 * import { useIX2 } from '@upbuilder/webflow-framework';
 *
 * function FaqSection({ ix2Data }) {
 *   const { isReady } = useIX2(ix2Data);
 *
 *   return <DropdownWrapper accordion>...</DropdownWrapper>;
 * }
 * ```
 */
export function useIX2(ix2Data: IX2Data | null, options: UseIX2Options = {}) {
  const { basePath = '/webflow-defaults', initDelay = 100 } = options;

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!ix2Data || initializedRef.current) return;

    const init = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, initDelay));
        await initIX2(ix2Data, basePath);
        initializedRef.current = true;
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    init();

    return () => {
      if (initializedRef.current) {
        destroyIX2();
        initializedRef.current = false;
      }
    };
  }, [ix2Data, basePath, initDelay]);

  const refresh = useCallback(() => {
    if (isReady) refreshIX2();
  }, [isReady]);

  return { isReady, error, refresh };
}
