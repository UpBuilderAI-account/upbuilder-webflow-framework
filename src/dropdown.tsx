/**
 * Dropdown components - local implementations
 */
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';

import type { AnimationEffect } from './types';

// Dropdown configuration props
export interface DropdownProps {
  open?: boolean;
  hover?: boolean;
  delay?: number;
  /** Animation effect when dropdown opens */
  animateOpen?: AnimationEffect;
  /** Animation effect when dropdown closes */
  animateClose?: AnimationEffect;
}

// ============================================================================
// DROPDOWN CONTEXT
// ============================================================================

interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isAccordion: boolean;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown components must be used within DropdownWrapper');
  return ctx;
}

// ============================================================================
// DROPDOWN
// ============================================================================

export interface DropdownWrapperProps extends DropdownProps {
  className?: string;
  children?: React.ReactNode;
  /** Accordion mode - always uses click trigger */
  accordion?: boolean;
  /** Start in open state */
  startOpen?: boolean;
  [key: string]: any;
}

export function DropdownWrapper({
  className,
  children,
  accordion = false,
  hover = false,
  delay = 200,
  startOpen = false,
  animateOpen,
  animateClose,
  ...rest
}: DropdownWrapperProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  // Accordion always uses click mode
  const isHover = !accordion && hover;

  const [isOpen, setIsOpen] = useState(staticMode ? false : startOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // In static mode, always closed
  const effectiveIsOpen = staticMode ? false : isOpen;

  const toggle = () => {
    if (staticMode) return; // No-op in static mode
    setIsOpen(!isOpen);
  };
  const open = () => {
    if (staticMode) return; // No-op in static mode
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };
  const close = () => {
    if (staticMode) return; // No-op in static mode
    if (isHover && delay > 0) {
      closeTimeoutRef.current = setTimeout(() => setIsOpen(false), delay);
    } else {
      setIsOpen(false);
    }
  };

  // Close on click outside (for all modes including hover)
  useEffect(() => {
    if (staticMode || !isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, isHover, staticMode]);

  return (
    <DropdownContext.Provider value={{ isOpen: effectiveIsOpen, toggle, open, close, isAccordion: accordion }}>
      <div
        {...rest}
        ref={wrapperRef}
        className={`${className || ''} w-dropdown ${effectiveIsOpen ? 'w--open' : ''}`}
        onMouseEnter={isHover && !staticMode ? open : undefined}
        onMouseLeave={isHover && !staticMode ? close : undefined}
        data-hover={isHover ? 'true' : 'false'}
        data-open={effectiveIsOpen}
        data-animate-open={animateOpen}
        data-animate-close={animateClose}
        data-up-node-id={nodeId}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownToggleProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownToggle({ text, className, children, ...rest }: DropdownToggleProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const { toggle, isOpen, isAccordion } = useDropdownContext();

  return (
    <div
      {...rest}
      className={`${className || ''} w-dropdown-toggle`}
      onClick={staticMode ? undefined : toggle}
      style={{ cursor: staticMode ? 'default' : 'pointer' }}
      aria-expanded={isOpen}
      aria-haspopup="true"
      role="button"
      data-up-node-id={nodeId}
    >
      {children || text}
    </div>
  );
}

export interface DropdownListProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownList({ className, children, ...rest }: DropdownListProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const { isOpen } = useDropdownContext();

  // In static mode, force hidden with inline style to guarantee no visibility
  const staticStyles = staticMode ? { display: 'none' } as React.CSSProperties : undefined;

  return (
    <nav
      {...rest}
      className={`${className || ''} w-dropdown-list ${isOpen ? 'w--open' : ''}`}
      style={staticStyles}
      role="menu"
      data-up-node-id={nodeId}
    >
      {children}
    </nav>
  );
}

export interface DropdownLinkProps {
  text?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownLink({ text, href = '#', className, children, ...rest }: DropdownLinkProps) {
  const nodeId = useNodeID();
  const { close, isAccordion } = useDropdownContext();

  const handleClick = () => {
    if (!isAccordion) close();
  };

  return (
    <a
      {...rest}
      className={`${className || ''} w-dropdown-link`}
      href={href}
      onClick={handleClick}
      role="menuitem"
      data-up-node-id={nodeId}
    >
      {children || text}
    </a>
  );
}

// ============================================================================
// ACCORDION (Click-based dropdown for FAQ sections)
// ============================================================================

export interface AccordionItemProps {
  className?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  [key: string]: any;
}

export function AccordionItem({ className, children, ...rest }: AccordionItemProps) {
  // Note: useNodeID is called inside DropdownWrapper, so we don't add it here
  // to avoid double node IDs on the same element
  return <DropdownWrapper {...rest} className={className} accordion>{children}</DropdownWrapper>;
}

export function AccordionTrigger({ className, children, ...rest }: { className?: string; children?: React.ReactNode; [key: string]: any }) {
  // Note: useNodeID is called inside DropdownToggle, so we don't add it here
  // to avoid double node IDs on the same element
  return <DropdownToggle {...rest} className={className}>{children}</DropdownToggle>;
}

export function AccordionContent({ className, children, ...rest }: { className?: string; children?: React.ReactNode; [key: string]: any }) {
  // Note: useNodeID is called inside DropdownList, so we don't add it here
  // to avoid double node IDs on the same element
  return <DropdownList {...rest} className={className}>{children}</DropdownList>;
}
