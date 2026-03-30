/**
 * Symbol components for Webflow Component/Symbol support
 *
 * These components mark element trees as symbol definitions and their
 * override fields, enabling round-trip conversion to Webflow Components.
 *
 * Usage:
 * ```tsx
 * <Symbol name="Testimonial Card">
 *   <Block className="card">
 *     <SymbolText field="quote">
 *       <Paragraph>Default quote text...</Paragraph>
 *     </SymbolText>
 *     <SymbolImage field="avatar">
 *       <Image src="/default-avatar.jpg" alt="Avatar" />
 *     </SymbolImage>
 *   </Block>
 * </Symbol>
 * ```
 *
 * The XSCP export will emit:
 * ```html
 * <div data-up-symbol="true" data-up-symbol-name="Testimonial Card">
 *   <div class="card">
 *     <p data-up-prop="quote" data-up-prop-type="text">Default quote text...</p>
 *     <img data-up-prop="avatar" data-up-prop-type="image" src="..." />
 *   </div>
 * </div>
 * ```
 *
 * A Designer Extension can then use webflow.registerComponent() to convert
 * these marked trees into actual Webflow Components with override properties.
 */
import React, { createContext, useContext } from 'react';
import { useNodeID } from './node-id';

// =============================================================================
// TYPES
// =============================================================================

export type SymbolPropType = 'text' | 'rich-text' | 'image' | 'link' | 'video' | 'alt-text' | 'visibility';

export interface SymbolProps {
  /** Symbol/Component name as shown in Webflow's Components panel */
  name: string;
  /** Optional symbol ID for tracking (auto-generated if not provided) */
  id?: string;
  /** CSS class for the symbol root element */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

export interface SymbolPropProps {
  /** Field name for this override property */
  field: string;
  /** Optional default value (extracted from children if not provided) */
  defaultValue?: string;
  /** Child element to wrap */
  children: React.ReactNode;
}

// =============================================================================
// CONTEXT
// =============================================================================

interface SymbolContextValue {
  symbolName: string;
  symbolId?: string;
}

const SymbolContext = createContext<SymbolContextValue | null>(null);

export function useSymbol(): SymbolContextValue | null {
  return useContext(SymbolContext);
}

// =============================================================================
// SYMBOL WRAPPER
// =============================================================================

/**
 * Marks an element tree as a Webflow Symbol/Component definition.
 *
 * The root element will receive:
 * - `data-up-symbol="true"` - marks this as a symbol definition
 * - `data-up-symbol-name="Name"` - the symbol's display name
 * - `data-up-symbol-id="uuid"` - optional tracking ID
 */
export function Symbol({ name, id, className, children }: SymbolProps) {
  const nodeId = useNodeID();

  return (
    <SymbolContext.Provider value={{ symbolName: name, symbolId: id }}>
      <div
        className={className}
        data-up-node-id={nodeId}
        data-up-symbol="true"
        data-up-symbol-name={name}
        data-up-symbol-id={id}
      >
        {children}
      </div>
    </SymbolContext.Provider>
  );
}

// =============================================================================
// SYMBOL PROPERTY WRAPPERS
// =============================================================================

/**
 * Marks a text element as an override property.
 * Wraps children and adds data-up-prop attributes.
 */
export function SymbolText({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="text">
      {children}
    </SymbolPropWrapper>
  );
}

/**
 * Marks a rich text element as an override property.
 */
export function SymbolRichText({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="rich-text">
      {children}
    </SymbolPropWrapper>
  );
}

/**
 * Marks an image element as an override property.
 */
export function SymbolImage({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="image">
      {children}
    </SymbolPropWrapper>
  );
}

/**
 * Marks a link element as an override property.
 */
export function SymbolLink({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="link">
      {children}
    </SymbolPropWrapper>
  );
}

/**
 * Marks a video element as an override property.
 */
export function SymbolVideo({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="video">
      {children}
    </SymbolPropWrapper>
  );
}

/**
 * Marks an element's visibility as an override property (show/hide toggle).
 */
export function SymbolVisibility({ field, children }: SymbolPropProps) {
  return (
    <SymbolPropWrapper field={field} type="visibility">
      {children}
    </SymbolPropWrapper>
  );
}

// =============================================================================
// INTERNAL WRAPPER
// =============================================================================

interface SymbolPropWrapperProps {
  field: string;
  type: SymbolPropType;
  children: React.ReactNode;
}

/**
 * Internal wrapper that clones the child element and adds symbol prop attributes.
 *
 * Instead of wrapping in an extra div, we clone the child and add attributes directly.
 * This preserves the intended DOM structure.
 */
function SymbolPropWrapper({ field, type, children }: SymbolPropWrapperProps) {
  // If child is a valid React element, clone it with additional props
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      'data-up-prop': field,
      'data-up-prop-type': type,
    });
  }

  // If children is text or other non-element, wrap in span
  return (
    <span data-up-prop={field} data-up-prop-type={type}>
      {children}
    </span>
  );
}

// =============================================================================
// SYMBOL INSTANCE (for rendering imported symbols)
// =============================================================================

export interface SymbolInstanceProps {
  /** Reference to the symbol definition ID */
  symbolId: string;
  /** Override values for this instance */
  overrides?: Record<string, string>;
  /** CSS class */
  className?: string;
  /** Children (typically empty - content comes from symbol definition) */
  children?: React.ReactNode;
}

/**
 * Renders a symbol instance reference.
 *
 * In static preview, this renders the children (or a placeholder).
 * The XSCP export will emit this as a proper symbol instance reference.
 */
export function SymbolInstance({ symbolId, overrides, className, children }: SymbolInstanceProps) {
  const nodeId = useNodeID();

  return (
    <div
      className={className}
      data-up-node-id={nodeId}
      data-up-symbol-instance={symbolId}
      data-up-symbol-overrides={overrides ? JSON.stringify(overrides) : undefined}
    >
      {children}
    </div>
  );
}
