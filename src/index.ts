// ============================================================================
// @upbuilder/webflow-framework
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

// Static mode system for disabling interactivity in canvas preview
export * from './static-mode';

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

// CMS Data Context (for preview with sample data)
export * from './cms-context';

// Symbol/Component support for Webflow round-trip
export * from './symbol';
