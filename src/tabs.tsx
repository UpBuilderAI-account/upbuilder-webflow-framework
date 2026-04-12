/**
 * Tabs components - local implementations
 */
import React, { useState, createContext, useContext, useMemo, Children } from 'react';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';
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

// Tabs configuration props
export interface TabsProps {
  defaultTab?: string;
  fadeIn?: number;
  fadeOut?: number;
  duration?: number;
  easing?: string;
}

export interface TabLinkProps {
  tabName: string;
}

export interface TabPaneProps {
  tabName: string;
}

// ============================================================================
// TABS CONTEXT
// ============================================================================

interface TabsContextValue {
  activeTab: string;
  activeIndex: number;
  setActiveTab: (tab: string) => void;
  tabNames: string[];
  staticMode: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within TabsWrapper');
  return ctx;
}

// ============================================================================
// TABS COMPONENTS
// ============================================================================

export interface TabsWrapperProps extends TabsProps, AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsWrapper({
  defaultTab = '',
  fadeIn = 300,
  fadeOut = 100,
  easing = 'ease',
  className,
  children,
  ...rest
}: TabsWrapperProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const initialTab = defaultTab;

  const tabNames = useMemo(() => {
    const names: string[] = [];
    Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === TabsMenu) {
        Children.forEach(child.props.children, (link: any, idx: number) => {
          if (React.isValidElement(link)) {
            names.push((link.props as any).tabName || `tab-${idx}`);
          }
        });
      }
    });
    return names;
  }, [children]);

  const initialIndex = staticMode ? 0 : (initialTab ? Math.max(0, tabNames.indexOf(initialTab)) : 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [activeTab, setActiveTabName] = useState(tabNames[initialIndex] || initialTab);

  const setActiveTab = (tabName: string) => {
    if (staticMode) return;
    const idx = tabNames.indexOf(tabName);
    if (idx >= 0) {
      setActiveIndex(idx);
      setActiveTabName(tabName);
    }
  };

  const effectiveActiveIndex = staticMode ? 0 : activeIndex;
  const effectiveActiveTab = staticMode ? (tabNames[0] || '') : activeTab;

  return (
    <TabsContext.Provider value={{ activeTab: effectiveActiveTab, activeIndex: effectiveActiveIndex, setActiveTab, tabNames, staticMode }}>
      <div {...props} {...animAttrs} className={`e-n-tabs w-tabs ${className || ''}`} aria-label="Tabs. Open items with Enter or Space, close with Escape and navigate using the Arrow keys." data-up-node-id={nodeId}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsMenuProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsMenu({ className, children, ...rest }: TabsMenuProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={`e-n-tabs-heading w-tab-menu ${className || ''}`} role="tablist" data-up-node-id={nodeId}>{children}</div>;
}

export function TabsContent({ className, children, ...rest }: TabsMenuProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={`e-n-tabs-content w-tab-content ${className || ''}`} data-up-node-id={nodeId}>{children}</div>;
}

export interface TabsLinkProps extends AnimationProps {
  text?: string;
  tabName?: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsLink({ text, tabName = '', isActive, className, children, ...rest }: TabsLinkProps) {
  const nodeId = useNodeID();
  const { activeTab, setActiveTab, tabNames, activeIndex, staticMode } = useTabsContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const idx = tabNames.indexOf(tabName);
  const active = staticMode ? idx === 0 : (isActive ?? (idx >= 0 ? activeIndex === idx : activeTab === tabName));

  return (
    <button
      {...props}
      {...animAttrs}
      className={`e-n-tab-title w-tab-link ${active ? 'w--current e-active' : ''} ${className || ''}`}
      role="tab"
      aria-selected={active}
      onClick={staticMode ? undefined : () => setActiveTab(tabName)}
      style={staticMode ? { cursor: 'default' } : undefined}
      data-up-node-id={nodeId}
    >
      {children || text}
    </button>
  );
}

export interface TabsPaneProps extends AnimationProps {
  tabName?: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsPane({ tabName = '', isActive, className, children, ...rest }: TabsPaneProps) {
  const nodeId = useNodeID();
  const { activeTab, tabNames, activeIndex, staticMode } = useTabsContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const idx = tabNames.indexOf(tabName);
  const active = staticMode ? idx === 0 : (isActive ?? (idx >= 0 ? activeIndex === idx : activeTab === tabName));

  return (
    <div
      {...props}
      {...animAttrs}
      className={`e-n-tab-content w-tab-pane ${active ? 'w--tab-active e-active' : ''} ${className || ''}`}
      role="tabpanel"
      style={{ display: active ? 'block' : 'none' }}
      aria-hidden={!active}
      data-up-node-id={nodeId}
    >
      {children}
    </div>
  );
}
