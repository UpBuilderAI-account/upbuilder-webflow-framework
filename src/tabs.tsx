/**
 * Tabs components - local implementations
 */
import React, { useState, createContext, useContext, useMemo, Children } from 'react';
import { useNodeID } from './node-id';

// Tabs configuration props
export interface TabsProps {
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

export interface TabsWrapperProps extends TabsProps {
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
  const initialTab = defaultTab;
  // Collect tab names from children
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

  const initialIndex = initialTab ? Math.max(0, tabNames.indexOf(initialTab)) : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [activeTab, setActiveTabName] = useState(tabNames[initialIndex] || initialTab);

  const setActiveTab = (tabName: string) => {
    const idx = tabNames.indexOf(tabName);
    if (idx >= 0) {
      setActiveIndex(idx);
      setActiveTabName(tabName);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, activeIndex, setActiveTab, tabNames }}>
      <div {...rest} className={`${className || ''} w-tabs`} data-up-node-id={nodeId}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsMenuProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsMenu({ className, children, ...rest }: TabsMenuProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={`${className || ''} w-tab-menu`} role="tablist" data-up-node-id={nodeId}>{children}</div>;
}

export function TabsContent({ className, children, ...rest }: TabsMenuProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={`${className || ''} w-tab-content`} data-up-node-id={nodeId}>{children}</div>;
}

export interface TabsLinkProps {
  text?: string;
  tabName?: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsLink({ text, tabName = '', isActive, className, children, ...rest }: TabsLinkProps) {
  const nodeId = useNodeID();
  const { activeTab, setActiveTab, tabNames, activeIndex } = useTabsContext();
  const idx = tabNames.indexOf(tabName);
  const active = isActive ?? (idx >= 0 ? activeIndex === idx : activeTab === tabName);

  return (
    <button
      {...rest}
      className={`${className || ''} w-tab-link ${active ? 'w--current' : ''}`}
      role="tab"
      aria-selected={active}
      onClick={() => setActiveTab(tabName)}
      data-up-node-id={nodeId}
    >
      {children || text}
    </button>
  );
}

export interface TabsPaneProps {
  tabName?: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function TabsPane({ tabName = '', isActive, className, children, ...rest }: TabsPaneProps) {
  const nodeId = useNodeID();
  const { activeTab, tabNames, activeIndex } = useTabsContext();
  const idx = tabNames.indexOf(tabName);
  const active = isActive ?? (idx >= 0 ? activeIndex === idx : activeTab === tabName);

  return (
    <div
      {...rest}
      className={`${className || ''} w-tab-pane ${active ? 'w--tab-active' : ''}`}
      role="tabpanel"
      style={{ display: active ? 'block' : 'none' }}
      aria-hidden={!active}
      data-up-node-id={nodeId}
    >
      {children}
    </div>
  );
}
