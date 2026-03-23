/**
 * Node ID System - Generates stable, deterministic IDs for preview/editor sync
 *
 * Uses a simple global counter that increments in render order.
 * Since React renders in depth-first order (same as JSX source order),
 * the IDs will match between:
 * - Parser (reads JSX, assigns node_0, node_1, etc.)
 * - Runtime (renders React, generates same sequence)
 *
 * The key: both traverse depth-first, both use sequential counters.
 * Counter auto-resets when window.__UP_RESET_NODE_COUNTER is true (set by bundler).
 */
import React, { useRef, createContext, useContext } from 'react';

/**
 * Global counter - reset when a new render cycle starts
 * In preview mode, this counter increments for each component that renders
 */
let globalNodeCounter = 0;
let hasAutoReset = false;

/**
 * Context to skip node ID generation for CMS-replicated items (index > 0)
 * When true, useNodeID returns undefined and components skip adding data-up-node-id
 */
const SkipNodeIDContext = createContext<boolean>(false);

/**
 * Provider to skip node IDs for children (used by CMS replication)
 */
export function SkipNodeIDProvider({ skip, children }: { skip: boolean; children: React.ReactNode }) {
  return (
    <SkipNodeIDContext.Provider value={skip}>
      {children}
    </SkipNodeIDContext.Provider>
  );
}

/**
 * Reset the counter - call this at the start of each preview render
 */
export function resetNodeIDCounter(): void {
  globalNodeCounter = 0;
}

/**
 * Get the next node ID - matches parser's node_X format
 */
export function getNextNodeID(): string {
  // Auto-reset on first call if flag is set (injected by bundler)
  if (!hasAutoReset && typeof window !== 'undefined' && (window as any).__UP_RESET_NODE_COUNTER) {
    console.log('[NODE-ID] Auto-resetting counter (was', globalNodeCounter, ')');
    globalNodeCounter = 0;
    hasAutoReset = true;
  }
  return `node_${globalNodeCounter++}`;
}

/**
 * Hook to get a stable node ID for a component instance
 * The ID is generated once on first render and cached
 * Returns undefined when inside CMS replication (index > 0) to avoid duplicate IDs
 */
export function useNodeID(): string | undefined {
  const skipNodeId = useContext(SkipNodeIDContext);
  const nodeIdRef = useRef<string | null>(null);

  // If we're in a CMS replication context (index > 0), don't generate/return an ID
  if (skipNodeId) {
    return undefined;
  }

  if (nodeIdRef.current === null) {
    nodeIdRef.current = getNextNodeID();
  }
  return nodeIdRef.current;
}

// Legacy exports for compatibility (can be removed later)
export function NodeIDProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function NodeIDScope({ children }: { nodeId: string; children: React.ReactNode }) {
  return <>{children}</>;
}
