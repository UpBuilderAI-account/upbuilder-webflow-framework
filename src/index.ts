// ============================================================================
// @upbuilder/react-framework
// Single source of truth for components, types, and registry
// ============================================================================

// ============================================================================
// CORE TYPES & UTILITIES
// ============================================================================

// Types: Breakpoints, PseudoStates, Styles, ComponentSettings
export * from './types';

// Registry: Component definitions, helpers (getDefaultTag, getXSCPType, etc.)
export * from './registry';

// ============================================================================
// UI COMPONENTS
// Re-exports all components from category files
// ============================================================================

// Node ID system for preview/editor sync
export * from './node-id';

// Base elements
export * from './base';

// Typography
export * from './typography';

// Navigation
export * from './navigation';

// Dropdown & Accordion
export * from './dropdown';

// Tabs
export * from './tabs';

// Swiper Slider (full-featured slider using Swiper library)
export * from './swiper';

// Forms
export * from './forms';

// CMS & Other
export * from './cms';

// Error Boundary
export * from './error-boundary';
