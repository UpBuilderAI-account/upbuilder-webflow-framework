/**
 * Navigation components - local implementations
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NavbarSettings, AnimationEffect, AnimationEasing } from './types';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';

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

export interface NavbarWrapperProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  collapse?: 'small' | 'medium' | 'all';
  settings?: NavbarSettings;
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
};

export function NavbarWrapper({ className, children, collapse, settings, ...rest }: NavbarWrapperProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const s = { ...DEFAULT_NAVBAR, ...settings };
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
        role="banner"
      >
        {children}
        {effectiveMenuOpen && (
          <div
            className="w-nav-overlay w--open"
            style={{
              display: 'block',
              transition: `opacity ${s.animationDuration}ms ease`,
            }}
          />
        )}
      </div>
    </NavbarContext.Provider>
  );
}

export interface NavbarContainerProps extends AnimationProps {
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

export interface NavbarBrandProps extends AnimationProps {
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

export interface NavbarMenuProps extends AnimationProps {
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
      className={`${className || ''} w-nav-menu ${isMenuOpen ? 'w--open' : ''}`}
      role="navigation"
      data-up-node-id={nodeId}
      {...(isMenuOpen ? { 'data-nav-menu-open': '' } : {})}
    >
      {children}
    </nav>
  );
}

export interface NavbarLinkProps extends AnimationProps {
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

export interface NavbarButtonProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function NavbarButton({ className, children, ...rest }: NavbarButtonProps) {
  const nodeId = useNodeID();
  const { isMenuOpen, toggleMenu, staticMode } = useNavbarContext();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  return (
    <div
      {...props}
      {...animAttrs}
      className={`${className || ''} w-nav-button ${isMenuOpen ? 'w--open' : ''}`}
      onClick={staticMode ? undefined : toggleMenu}
      role="button"
      tabIndex={staticMode ? -1 : 0}
      aria-expanded={isMenuOpen}
      aria-label="menu"
      aria-haspopup="menu"
      style={{ cursor: staticMode ? 'default' : 'pointer' }}
      data-up-node-id={nodeId}
    >
      {children || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </div>
  );
}
