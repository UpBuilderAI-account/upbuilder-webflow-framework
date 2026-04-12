/**
 * Symbol components for Webflow Component/Symbol support
 */
import React, { createContext, useContext } from 'react';
import { useNodeID } from './node-id';
import type { AnimationEffect, AnimationEasing } from './types';

// Animation props interface
interface AnimationProps {
  animate?: AnimationEffect;
  animateHover?: AnimationEffect;
  animateClick?: AnimationEffect;
  animatePageLoad?: AnimationEffect;
  animateDelay?: number;
  animateDuration?: number;
  animateEasing?: AnimationEasing;
}

function extractAnimationAttrs(props: AnimationProps): Record<string, any> {
  const attrs: Record<string, any> = {};
  if (props.animate) attrs['data-animate'] = props.animate;
  if (props.animateHover) attrs['data-animate-hover'] = props.animateHover;
  if (props.animateClick) attrs['data-animate-click'] = props.animateClick;
  if (props.animatePageLoad) attrs['data-animate-pageload'] = props.animatePageLoad;
  if (props.animateDelay !== undefined) attrs['data-animate-delay'] = props.animateDelay;
  if (props.animateDuration !== undefined) attrs['data-animate-duration'] = props.animateDuration;
  if (props.animateEasing) attrs['data-animate-easing'] = props.animateEasing;
  return attrs;
}

function omitAnimationProps<T extends AnimationProps>(props: T): Omit<T, keyof AnimationProps> {
  const { animate, animateHover, animateClick, animatePageLoad, animateDelay, animateDuration, animateEasing, ...rest } = props;
  return rest as Omit<T, keyof AnimationProps>;
}

// =============================================================================
// TYPES
// =============================================================================

export type SymbolPropType = 'text' | 'rich-text' | 'image' | 'link' | 'video' | 'alt-text' | 'visibility';

export interface SymbolProps extends AnimationProps {
  name: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export interface SymbolPropProps {
  field: string;
  defaultValue?: string;
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

export function Symbol({ name, id, className, children, ...rest }: SymbolProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <SymbolContext.Provider value={{ symbolName: name, symbolId: id }}>
      <div
        {...props}
        {...animAttrs}
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

export function SymbolText({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="text">{children}</SymbolPropWrapper>;
}

export function SymbolRichText({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="rich-text">{children}</SymbolPropWrapper>;
}

export function SymbolImage({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="image">{children}</SymbolPropWrapper>;
}

export function SymbolLink({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="link">{children}</SymbolPropWrapper>;
}

export function SymbolVideo({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="video">{children}</SymbolPropWrapper>;
}

export function SymbolVisibility({ field, children }: SymbolPropProps) {
  return <SymbolPropWrapper field={field} type="visibility">{children}</SymbolPropWrapper>;
}

// =============================================================================
// INTERNAL WRAPPER
// =============================================================================

interface SymbolPropWrapperProps {
  field: string;
  type: SymbolPropType;
  children: React.ReactNode;
}

function SymbolPropWrapper({ field, type, children }: SymbolPropWrapperProps) {
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      'data-up-prop': field,
      'data-up-prop-type': type,
    });
  }

  return (
    <span data-up-prop={field} data-up-prop-type={type}>
      {children}
    </span>
  );
}

// =============================================================================
// SYMBOL INSTANCE
// =============================================================================

export interface SymbolInstanceProps extends AnimationProps {
  symbolId: string;
  overrides?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SymbolInstance({ symbolId, overrides, className, children, ...rest }: SymbolInstanceProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <div
      {...props}
      {...animAttrs}
      className={className}
      data-up-node-id={nodeId}
      data-up-symbol-instance={symbolId}
      data-up-symbol-overrides={overrides ? JSON.stringify(overrides) : undefined}
    >
      {children}
    </div>
  );
}
