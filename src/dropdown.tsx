/**
 * Dropdown components - local implementations
 */
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
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

// Dropdown configuration props
export interface DropdownProps {
  open?: boolean;
  hover?: boolean;
  delay?: number;
  animateOpen?: AnimationEffect;
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

export interface DropdownWrapperProps extends DropdownProps, AnimationProps {
  className?: string;
  children?: React.ReactNode;
  accordion?: boolean;
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
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const isHover = !accordion && hover;

  const [isOpen, setIsOpen] = useState(staticMode ? false : startOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveIsOpen = staticMode ? false : isOpen;

  const toggle = () => {
    if (staticMode) return;
    setIsOpen(!isOpen);
  };
  const open = () => {
    if (staticMode) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };
  const close = () => {
    if (staticMode) return;
    if (isHover && delay > 0) {
      closeTimeoutRef.current = setTimeout(() => setIsOpen(false), delay);
    } else {
      setIsOpen(false);
    }
  };

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
        {...props}
        {...animAttrs}
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

export interface DropdownToggleProps extends AnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownToggle({ text, className, children, ...rest }: DropdownToggleProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const { toggle, isOpen, isAccordion } = useDropdownContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <div
      {...props}
      {...animAttrs}
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

export interface DropdownListProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownList({ className, children, ...rest }: DropdownListProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const { isOpen } = useDropdownContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  const staticStyles = staticMode ? { display: 'none' } as React.CSSProperties : undefined;

  return (
    <nav
      {...props}
      {...animAttrs}
      className={`${className || ''} w-dropdown-list ${isOpen ? 'w--open' : ''}`}
      style={staticStyles}
      role="menu"
      data-up-node-id={nodeId}
    >
      {children}
    </nav>
  );
}

export interface DropdownLinkProps extends AnimationProps {
  text?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DropdownLink({ text, href = '#', className, children, ...rest }: DropdownLinkProps) {
  const nodeId = useNodeID();
  const { close, isAccordion } = useDropdownContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  const handleClick = () => {
    if (!isAccordion) close();
  };

  return (
    <a
      {...props}
      {...animAttrs}
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
// ACCORDION
// ============================================================================

export interface AccordionItemProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  [key: string]: any;
}

export function AccordionItem({ className, children, ...rest }: AccordionItemProps) {
  return <DropdownWrapper {...rest} className={className} accordion>{children}</DropdownWrapper>;
}

export function AccordionTrigger({ className, children, ...rest }: DropdownToggleProps) {
  return <DropdownToggle {...rest} className={className}>{children}</DropdownToggle>;
}

export function AccordionContent({ className, children, ...rest }: DropdownListProps) {
  return <DropdownList {...rest} className={className}>{children}</DropdownList>;
}

// ============================================================================
// DROPDOWN ICON
// ============================================================================

export interface DropdownIconProps extends AnimationProps {
  className?: string;
  src?: string;
  alt?: string;
  rotateOnOpen?: number;
  [key: string]: any;
}

export function DropdownIcon({
  className,
  src,
  alt = 'Toggle dropdown',
  rotateOnOpen = 180,
  ...rest
}: DropdownIconProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  const ctx = useContext(DropdownContext);
  const isOpen = ctx?.isOpen ?? false;

  const rotationStyle: React.CSSProperties = isOpen ? {
    transform: `rotate(${rotateOnOpen}deg)`,
    transition: 'transform 0.2s ease',
  } : {
    transform: 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={rotationStyle}
        data-up-node-id={nodeId}
        {...props}
        {...animAttrs}
      />
    );
  }

  return (
    <div
      className={`w-icon-dropdown-toggle ${className || ''}`}
      style={rotationStyle}
      data-up-node-id={nodeId}
      {...props}
      {...animAttrs}
    />
  );
}
