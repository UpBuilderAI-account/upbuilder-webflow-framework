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

// IX2 Accordion animation preset types
export type AccordionAnimationPreset =
  | 'none'           // No animation, instant open/close
  | 'fade'           // Opacity only
  | 'slide'          // Height + opacity + translateY (default)
  | 'slide-fade'     // Height + opacity (no translateY)
  | 'expand'         // Height only
  | 'custom';        // Use individual settings

export type AccordionEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'outQuad'
  | 'inQuad'
  | 'inOutQuad'
  | 'outCubic'
  | 'inCubic'
  | 'outQuart'
  | 'outBack'
  | 'inBack'
  | 'swingFromTo';

// IX2 transition configuration for accordions
export interface AccordionTransitionConfig {
  /** Animation preset (default: 'slide') */
  preset?: AccordionAnimationPreset;
  /** Duration in ms for open animation (default: 400) */
  openDuration?: number;
  /** Duration in ms for close animation (default: 300) */
  closeDuration?: number;
  /** Easing for open animation (default: 'outQuad') */
  openEasing?: AccordionEasing;
  /** Easing for close animation (default: 'outQuad') */
  closeEasing?: AccordionEasing;
  /** Animate height 0 → AUTO (default: true) */
  animateHeight?: boolean;
  /** Animate opacity 0 → 100% (default: true for slide/fade) */
  animateOpacity?: boolean;
  /** Animate translateY (default: true for slide) */
  animateTranslateY?: boolean;
  /** TranslateY distance in px (default: -10) */
  translateYDistance?: number;
  /** Rotate icon on open (default: true) */
  rotateIcon?: boolean;
  /** Icon rotation degrees (default: 180) */
  iconRotation?: number;
  /** Icon rotation easing (default: 'swingFromTo') */
  iconEasing?: AccordionEasing;
  /** Icon rotation duration (default: 500) */
  iconDuration?: number;
}

// Dropdown configuration props
export interface DropdownProps {
  open?: boolean;
  hover?: boolean;
  delay?: number;
  animateOpen?: AnimationEffect;
  animateClose?: AnimationEffect;
  /** IX2 transition config for accordion mode */
  transition?: AccordionTransitionConfig;
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
  /** Shorthand: accordion preset name */
  accordionPreset?: AccordionAnimationPreset;
  /** Shorthand: open/close duration in ms */
  accordionDuration?: number;
  /** Shorthand: easing for open/close */
  accordionEasing?: AccordionEasing;
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
  transition,
  accordionPreset,
  accordionDuration,
  accordionEasing,
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

  // Click-outside handler for regular dropdowns only (NOT accordions)
  // Accordions should only toggle when the toggle button is clicked
  useEffect(() => {
    if (staticMode || !isOpen || accordion) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, isHover, staticMode, accordion]);

  // Build transition config from props (shorthand takes precedence)
  const effectiveTransition: AccordionTransitionConfig = {
    ...transition,
    ...(accordionPreset && { preset: accordionPreset }),
    ...(accordionDuration && { openDuration: accordionDuration, closeDuration: Math.round(accordionDuration * 0.75) }),
    ...(accordionEasing && { openEasing: accordionEasing, closeEasing: accordionEasing }),
  };

  // Serialize transition config for data attribute (only if accordion mode)
  const transitionAttr = accordion && Object.keys(effectiveTransition).length > 0
    ? JSON.stringify(effectiveTransition)
    : undefined;

  // Check if Webflow dropdown handler is active - if so, don't manage .w--open class
  // The script will handle click events and class toggling
  const hasWebflowDropdownHandler = typeof window !== 'undefined' && !!(window as any).__UP_WEBFLOW_DROPDOWN_ACTIVE;
  const wOpenClass = hasWebflowDropdownHandler ? '' : (effectiveIsOpen ? 'w--open' : '');

  return (
    <DropdownContext.Provider value={{ isOpen: effectiveIsOpen, toggle, open, close, isAccordion: accordion }}>
      <div
        {...props}
        {...animAttrs}
        ref={wrapperRef}
        className={`${className || ''} w-dropdown ${wOpenClass}`}
        onMouseEnter={isHover && !staticMode && !hasWebflowDropdownHandler ? open : undefined}
        onMouseLeave={isHover && !staticMode && !hasWebflowDropdownHandler ? close : undefined}
        data-delay={delay}
        data-hover={isHover ? 'true' : 'false'}
        data-open={effectiveIsOpen}
        data-animate-open={animateOpen}
        data-animate-close={animateClose}
        data-accordion={accordion ? 'true' : undefined}
        data-accordion-transition={transitionAttr}
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

  // Check if Webflow dropdown handler is active - if so, let it handle clicks
  // The bundler sets window.__UP_WEBFLOW_DROPDOWN_ACTIVE when loading the runtime
  const hasWebflowDropdownHandler = typeof window !== 'undefined' && !!(window as any).__UP_WEBFLOW_DROPDOWN_ACTIVE;
  const letWebflowHandle = hasWebflowDropdownHandler;

  return (
    <div
      {...props}
      {...animAttrs}
      className={`${className || ''} w-dropdown-toggle`}
      onClick={staticMode || letWebflowHandle ? undefined : toggle}
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
  const { isOpen, isAccordion } = useDropdownContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  // Check if Webflow dropdown handler is active - if so, don't manage .w--open class
  const hasWebflowDropdownHandler = typeof window !== 'undefined' && !!(window as any).__UP_WEBFLOW_DROPDOWN_ACTIVE;
  const wOpenClass = hasWebflowDropdownHandler ? '' : (isOpen ? 'w--open' : '');

  // Styles for initial render:
  // - Static mode: hide completely
  // - Accordion (closed): set height:0 to prevent flash before GSAP initializes
  // - Regular dropdown: no inline styles needed (CSS handles it)
  let inlineStyles: React.CSSProperties | undefined;
  if (staticMode) {
    inlineStyles = { display: 'none' };
  } else if (isAccordion && !isOpen && hasWebflowDropdownHandler) {
    // Accordion starts closed - set initial closed state to prevent flash
    // GSAP will animate from here when opened
    inlineStyles = { height: 0, opacity: 0, overflow: 'hidden' };
  }

  return (
    <nav
      {...props}
      {...animAttrs}
      className={`${className || ''} w-dropdown-list ${wOpenClass}`}
      style={inlineStyles}
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
