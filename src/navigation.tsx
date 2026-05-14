/**
 * Navigation components - local implementations
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NavbarSettings } from './types';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';
import { extractAnimationAttrs, omitAnimationProps, type UpAnimationProps } from './animations';
import type { AccordionAnimationPreset, AccordionEasing } from './dropdown';

// ============================================================================
// NAVBAR CONTEXT
// ============================================================================

interface NavbarContextValue {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  staticMode: boolean;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

function useNavbarContext() {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error('Navbar components must be used within NavbarWrapper');
  return ctx;
}

// ============================================================================
// NAVBAR COMPONENTS
// ============================================================================

export interface NavbarWrapperProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  collapse?: 'small' | 'medium' | 'all';
  settings?: NavbarSettings;
  /** Webflow IX2 preset for collapsed NavbarMenu open/close motion. */
  menuAnimationPreset?: AccordionAnimationPreset;
  /** Open duration in ms. Close duration is derived unless menuAnimationCloseDuration is set in settings later. */
  menuAnimationDuration?: number;
  /** Easing for generated NavbarMenu IX2 motion. */
  menuAnimationEasing?: AccordionEasing;
  [key: string]: any;
}

const DEFAULT_NAVBAR: Required<NavbarSettings> = {
  collapseAt: 'medium',
  animation: 'default',
  animationDuration: 400,
  dropdownMode: 'hover',
  dropdownDelay: 300,
  docHeight: false,
  noScroll: false,
  menuAnimationPreset: 'slide-fade',
  menuAnimationDuration: 320,
  menuAnimationEasing: 'outQuad',
};

export function NavbarWrapper({
  className,
  children,
  collapse,
  settings,
  menuAnimationPreset,
  menuAnimationDuration,
  menuAnimationEasing,
  ...rest
}: NavbarWrapperProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const s = { ...DEFAULT_NAVBAR, ...settings };
  const resolvedMenuAnimationPreset = menuAnimationPreset ?? s.menuAnimationPreset;
  const resolvedMenuAnimationDuration = menuAnimationDuration ?? s.menuAnimationDuration;
  const resolvedMenuAnimationEasing = menuAnimationEasing ?? s.menuAnimationEasing;
  const collapseBreakpoint = s.collapseAt === 'none' ? 'none' : (collapse || s.collapseAt);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const effectiveMenuOpen = staticMode ? false : isMenuOpen;

  const toggleMenu = () => {
    if (staticMode) return;
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    if (staticMode) return;
    setIsMenuOpen(false);
  };

  const getBreakpointWidth = () => {
    switch (collapseBreakpoint) {
      case 'small': return 767;
      case 'medium': return 991;
      default: return 991;
    }
  };

  useEffect(() => {
    if (staticMode || collapseBreakpoint === 'none') return;
    const handleResize = () => {
      if (window.innerWidth > getBreakpointWidth() && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, collapseBreakpoint, staticMode]);

  return (
    <NavbarContext.Provider value={{ isMenuOpen: effectiveMenuOpen, toggleMenu, closeMenu, staticMode }}>
      <div
        {...props}
        {...animAttrs}
        className={`${className || ''} w-nav`}
        data-up-node-id={nodeId}
        data-collapse={collapseBreakpoint}
        data-animation={s.animation}
        data-duration={s.animationDuration}
        data-menu-animation-preset={resolvedMenuAnimationPreset}
        data-menu-animation-duration={resolvedMenuAnimationDuration}
        data-menu-animation-easing={resolvedMenuAnimationEasing}
        role="banner"
      >
        {children}
        {effectiveMenuOpen && (
          <div
            className="w-nav-overlay w--open"
          />
        )}
      </div>
    </NavbarContext.Provider>
  );
}

export interface NavbarContainerProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

/** @deprecated Use Block instead - NavbarContainer is not a valid Webflow component */
export function NavbarContainer({ className, children, ...rest }: NavbarContainerProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId}>{children}</div>;
}

export interface NavbarBrandProps extends UpAnimationProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function NavbarBrand({ href = '/', className, children, ...rest }: NavbarBrandProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <a {...props} {...animAttrs} className={`${className || ''} w-nav-brand`} href={href} aria-label="home" data-up-node-id={nodeId}>
      {children}
    </a>
  );
}

export interface NavbarMenuProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function NavbarMenu({ className, children, ...rest }: NavbarMenuProps) {
  const nodeId = useNodeID();
  const { isMenuOpen, staticMode } = useNavbarContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <nav
      {...props}
      {...animAttrs}
      className={`${className || ''} w-nav-menu${isMenuOpen ? ' w--open' : ''}`}
      role="navigation"
      data-up-node-id={nodeId}
      {...(isMenuOpen ? { 'data-nav-menu-open': '' } : {})}
    >
      {children}
    </nav>
  );
}

export interface NavbarLinkProps extends UpAnimationProps {
  text?: string;
  href?: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function NavbarLink({ text, href = '#', isActive, className, children, ...rest }: NavbarLinkProps) {
  const nodeId = useNodeID();
  const { isMenuOpen, closeMenu } = useNavbarContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <a
      {...props}
      {...animAttrs}
      className={`${className || ''} w-nav-link ${isMenuOpen ? 'w--nav-link-open' : ''}`}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => closeMenu()}
      data-up-node-id={nodeId}
    >
      {children || text}
    </a>
  );
}

export interface NavbarButtonProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  /**
   * Hamburger icon style.
   * - `'lines'` (default): class-only 3-line structure that animates into an X
   *   when menu opens. Project CSS owns dimensions, color, and preview states.
   * - `'svg'`: legacy inline SVG hamburger (no close animation)
   * - `'custom'`: render whatever children are passed
   * For Webflow export, provide page-specific iconClassName/iconLine*ClassName
   * props so each navbar can own its hamburger colors and sizing.
   */
  icon?: 'lines' | 'svg' | 'custom';
  iconClassName?: string;
  iconLineTopClassName?: string;
  iconLineMiddleClassName?: string;
  iconLineMiddleInnerClassName?: string;
  iconLineBottomClassName?: string;
  [key: string]: any;
}

export function NavbarButton({
  className,
  children,
  icon,
  iconClassName,
  iconLineTopClassName,
  iconLineMiddleClassName,
  iconLineMiddleInnerClassName,
  iconLineBottomClassName,
  ...rest
}: NavbarButtonProps) {
  const nodeId = useNodeID();
  const { isMenuOpen, toggleMenu, staticMode } = useNavbarContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  const resolvedIcon: 'lines' | 'svg' | 'custom' =
    icon ?? (children ? 'custom' : 'lines');
  const openCls = isMenuOpen ? ' w--open' : '';

  let content: React.ReactNode;
  if (resolvedIcon === 'custom') {
    content = children;
  } else if (resolvedIcon === 'svg') {
    content = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    );
  } else {
    // Project CSS owns all dimensions, colors, spacing, and preview states.
    const wrapperClass = iconClassName || 'menu-icon_component';
    const topClass = iconLineTopClassName || 'menu-icon_line-top';
    const middleClass = iconLineMiddleClassName || 'menu-icon_line-middle';
    const middleInnerClass = iconLineMiddleInnerClassName || 'menu-icon_line-middle-inner';
    const bottomClass = iconLineBottomClassName || 'menu-icon_line-bottom';

    content = (
      <div className={`${wrapperClass}${openCls}`} aria-hidden="true">
        <div className={`${topClass}${openCls}`} />
        <div className={`${middleClass}${openCls}`}>
          <div className={`${middleInnerClass}${openCls}`} />
        </div>
        <div className={`${bottomClass}${openCls}`} />
      </div>
    );
  }

  return (
    <div
      {...props}
      {...animAttrs}
      className={`${className || ''} w-nav-button${openCls}`}
      onClick={staticMode ? undefined : toggleMenu}
      role="button"
      tabIndex={staticMode ? -1 : 0}
      aria-expanded={isMenuOpen}
      aria-label="menu"
      aria-haspopup="menu"
      data-up-node-id={nodeId}
      data-up-icon={resolvedIcon}
    >
      {content}
    </div>
  );
}
