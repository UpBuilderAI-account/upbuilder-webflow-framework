/**
 * CMS Data Context
 * Provides sample CMS data to components for preview rendering.
 * In production (Webflow), this data is ignored - Webflow handles real CMS binding.
 */

import React, { createContext, useContext } from 'react';
import { SkipNodeIDProvider } from './node-id';

// =============================================================================
// TYPES
// =============================================================================

export interface CmsFieldSchema {
  type: string;
  required?: boolean;
  choices?: string[];
  collection?: string; // For Reference/MultiReference
}

export interface CmsCollection {
  displayName: string;
  singularName: string;
  fields: Record<string, CmsFieldSchema>;
  items: Array<Record<string, any>>;
}

export interface CmsData {
  $schema?: string;
  collections: Record<string, CmsCollection>;
}

interface CmsContextValue {
  data: CmsData;
  getCollection: (slug: string) => CmsCollection | null;
  getItems: (slug: string, limit?: number) => Array<Record<string, any>>;
}

interface CmsItemContextValue {
  collectionSlug: string;
  item: Record<string, any>;
  index: number;
}

// =============================================================================
// CONTEXTS
// =============================================================================

const CmsContext = createContext<CmsContextValue | null>(null);
const CmsItemContext = createContext<CmsItemContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function CmsProvider({
  data,
  children
}: {
  data?: CmsData | null;
  children: React.ReactNode;
}) {
  const safeData: CmsData = data || { collections: {} };

  const getCollection = (slug: string): CmsCollection | null => {
    return safeData.collections[slug] || null;
  };

  const getItems = (slug: string, limit?: number): Array<Record<string, any>> => {
    const collection = getCollection(slug);
    if (!collection) return [];
    const items = collection.items || [];
    return limit ? items.slice(0, limit) : items;
  };

  return (
    <CmsContext.Provider value={{ data: safeData, getCollection, getItems }}>
      {children}
    </CmsContext.Provider>
  );
}

// =============================================================================
// ITEM PROVIDER (used by DynamoItem)
// =============================================================================

export function CmsItemProvider({
  collectionSlug,
  item,
  index,
  children,
}: {
  collectionSlug: string;
  item: Record<string, any>;
  index: number;
  children: React.ReactNode;
}) {
  // For CMS items after the first (index > 0), skip generating node IDs
  // This prevents duplicate IDs since the parser only sees the template once
  const shouldSkipNodeIds = index > 0;

  return (
    <CmsItemContext.Provider value={{ collectionSlug, item, index }}>
      <SkipNodeIDProvider skip={shouldSkipNodeIds}>
        {children}
      </SkipNodeIDProvider>
    </CmsItemContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    // Return empty context if not wrapped in provider
    return {
      data: { collections: {} },
      getCollection: () => null,
      getItems: () => [],
    };
  }
  return ctx;
}

export function useCmsCollection(slug: string): CmsCollection | null {
  const { getCollection } = useCms();
  return getCollection(slug);
}

export function useCmsItems(slug: string, limit?: number): Array<Record<string, any>> {
  const { getItems } = useCms();
  return getItems(slug, limit);
}

export function useCmsCurrentItem(): CmsItemContextValue | null {
  return useContext(CmsItemContext);
}

export function useCmsFieldValue(field: string): any {
  const itemCtx = useCmsCurrentItem();
  if (!itemCtx) return undefined;
  return itemCtx.item[field];
}

// =============================================================================
// GLOBAL DATA LOADER (for preview)
// =============================================================================

/**
 * Load CMS data from window global (injected by preview bundler)
 */
export function loadCmsDataFromWindow(): CmsData | null {
  if (typeof window !== 'undefined' && (window as any).__UP_CMS_DATA) {
    return (window as any).__UP_CMS_DATA as CmsData;
  }
  return null;
}
