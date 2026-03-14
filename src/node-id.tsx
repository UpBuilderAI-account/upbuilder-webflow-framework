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
 */
import { useRef } from 'react';

/**
 * Global counter - reset when a new render cycle starts
 * In preview mode, this counter increments for each component that renders
 */
let globalNodeCounter = 0;

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
  return `node_${globalNodeCounter++}`;
}

/**
 * Hook to get a stable node ID for a component instance
 * The ID is generated once on first render and cached
 */
export function useNodeID(): string {
  const nodeIdRef = useRef<string | null>(null);
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
