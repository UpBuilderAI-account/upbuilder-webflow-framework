// ============================================================================
// SHARED TYPES
// Core type definitions used across the entire UpBuilder system
// ============================================================================

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const BREAKPOINTS = {
  desktop: { min: 992 },
  tablet: { max: 991, min: 768 },
  mobileLandscape: { max: 767, min: 480 },
  mobile: { max: 479 },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Valid breakpoint max-widths with 1px tolerance */
export const VALID_BREAKPOINT_WIDTHS = {
  tablet: [991, 992] as const,
  mobileLandscape: [767, 768] as const,
  mobile: [479, 480] as const,
} as const;

/** Set of all valid breakpoint widths for quick validation */
export const ALL_VALID_BREAKPOINT_WIDTHS = new Set<number>([
  ...VALID_BREAKPOINT_WIDTHS.tablet,
  ...VALID_BREAKPOINT_WIDTHS.mobileLandscape,
  ...VALID_BREAKPOINT_WIDTHS.mobile,
]);

/** Check if a width is a valid breakpoint */
export function isValidBreakpointWidth(width: number): boolean {
  return ALL_VALID_BREAKPOINT_WIDTHS.has(width);
}

/** Get breakpoint name for a width */
export function getBreakpointForWidth(width: number): 'tablet' | 'mobileLandscape' | 'mobile' | null {
  if ((VALID_BREAKPOINT_WIDTHS.tablet as readonly number[]).includes(width)) return 'tablet';
  if ((VALID_BREAKPOINT_WIDTHS.mobileLandscape as readonly number[]).includes(width)) return 'mobileLandscape';
  if ((VALID_BREAKPOINT_WIDTHS.mobile as readonly number[]).includes(width)) return 'mobile';
  return null;
}

/** Legacy breakpoint aliases for backward compatibility */
export const BREAKPOINT_ALIASES: Record<string, Breakpoint> = {
  main: 'desktop',
  medium: 'tablet',
  small: 'mobileLandscape',
  tiny: 'mobile',
};

/** Convert legacy breakpoint name to standard name */
export function normalizeBreakpoint(key: string): Breakpoint {
  if (key in BREAKPOINTS) return key as Breakpoint;
  return BREAKPOINT_ALIASES[key] ?? 'desktop';
}

/** Get media query string for a breakpoint */
export function getMediaQuery(breakpoint: Exclude<Breakpoint, 'desktop'>): string {
  const bp = BREAKPOINTS[breakpoint];
  return `@media (max-width: ${bp.max}px)`;
}

// =============================================================================
// PSEUDO STATES
// =============================================================================

export const PSEUDO_STATES = [
  'none',
  'hover',
  'focus',
  'active',
  'visited',
  'focusVisible',
  'current',
  'placeholder',
  'checked',
  'disabled',
] as const;

export type PseudoState = typeof PSEUDO_STATES[number];

/** CSS pseudo-selector for each state */
export const PSEUDO_STATE_SELECTORS: Record<Exclude<PseudoState, 'none'>, string> = {
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  visited: ':visited',
  focusVisible: ':focus-visible',
  current: '.w--current',
  placeholder: '::placeholder',
  checked: ':checked',
  disabled: ':disabled',
};

// =============================================================================
// STYLE TYPES
// =============================================================================

/** Comb type for style composition: '' = base class, '&' = combo/modifier */
export type CombType = '' | '&';

/** Normalize comb value - invalid values become '&' */
export function normalizeComb(raw: string): CombType {
  return (raw === '' || raw === '&') ? raw : '&';
}

/** CSS for a single breakpoint with all pseudo-states */
export interface BreakpointStyles {
  none?: string;
  hover?: string;
  focus?: string;
  active?: string;
  visited?: string;
  focusVisible?: string;
  current?: string;
  placeholder?: string;
  checked?: string;
  disabled?: string;
}

/** Unified style definition */
export interface FrameworkStyle {
  /** Unique identifier */
  id: string;
  /** CSS class name */
  name: string;
  /** Base class or combo modifier */
  comb: CombType;
  /** Parent class chain for combo styles */
  chainContext?: string[];
  /** Child combo class IDs */
  children?: string[];
  /** CSS by breakpoint and state */
  css: {
    desktop?: BreakpointStyles;
    tablet?: BreakpointStyles;
    mobileLandscape?: BreakpointStyles;
    mobile?: BreakpointStyles;
  };
  /** Number of elements using this style */
  usageCount?: number;
  /** Element IDs using this style */
  elementIds?: string[];
  /** Preserved Webflow style ID for synced imports */
  webflowStyleId?: string;
}

/** Convert legacy style format to unified format */
export function convertLegacyStyle(legacy: {
  id: string;
  name: string;
  comb?: string;
  main?: string;
  medium?: string;
  small?: string;
  tiny?: string;
  hover?: string;
  focus?: string;
  active?: string;
}): FrameworkStyle {
  return {
    id: legacy.id,
    name: legacy.name,
    comb: normalizeComb(legacy.comb ?? ''),
    css: {
      desktop: {
        none: legacy.main,
        hover: legacy.hover,
        focus: legacy.focus,
        active: legacy.active,
      },
      tablet: legacy.medium ? { none: legacy.medium } : undefined,
      mobileLandscape: legacy.small ? { none: legacy.small } : undefined,
      mobile: legacy.tiny ? { none: legacy.tiny } : undefined,
    },
  };
}

// =============================================================================
// ANIMATION TYPES
// =============================================================================

/**
 * Animation effect types for IX2 animations
 */
export type AnimationEffect =
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'fade-in'
  | 'pop'
  | 'grow'
  | 'bounce'
  | 'shrink'
  | 'flip';

/**
 * Animation trigger types
 */
export type AnimationTrigger = 'scroll' | 'hover' | 'click' | 'pageLoad' | 'dropdownOpen' | 'dropdownClose';

/**
 * Animation easing types (maps to GSAP easing)
 */
export type AnimationEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

// =============================================================================
// COMPONENT SETTINGS
// =============================================================================

export interface SwiperSettings {
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  direction?: 'horizontal' | 'vertical';
  loop?: boolean;
  speed?: number;
  initialSlide?: number;
  slidesPerGroup?: number;
  autoplay?: boolean | {
    delay?: number;
    disableOnInteraction?: boolean;
    pauseOnMouseEnter?: boolean;
  };
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative';
  navigation?: boolean;
  pagination?: boolean | {
    type?: 'bullets' | 'fraction' | 'progressbar';
    clickable?: boolean;
  };
  scrollbar?: boolean | { draggable?: boolean };
  allowTouchMove?: boolean;
  grabCursor?: boolean;
  freeMode?: boolean;
  centeredSlides?: boolean;
}

export interface NavbarSettings {
  collapseAt?: 'medium' | 'small' | 'none';
  animation?: 'default' | 'over-left' | 'over-right';
  animationDuration?: number;
  dropdownMode?: 'hover' | 'click';
  dropdownDelay?: number;
  docHeight?: boolean;
  noScroll?: boolean;
}

export interface DropdownSettings {
  hover?: boolean;
  delay?: number;
  startOpen?: boolean;
  accordion?: boolean;
  /** Animation effect when dropdown opens */
  animateOpen?: AnimationEffect;
  /** Animation effect when dropdown closes */
  animateClose?: AnimationEffect;
}

export interface TabsSettings {
  defaultTab?: string;
  fadeIn?: number;
  fadeOut?: number;
  easing?: string;
}

export interface VideoSettings {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

export interface FormSettings {
  name?: string;
  action?: string;
  method?: 'get' | 'post';
  redirect?: string;
}

export interface LightboxSettings {
  group?: string;
  items?: Array<{
    url: string;
    type?: 'image' | 'video';
    caption?: string;
    thumbnail?: string;
  }>;
}

/** All component settings in one interface */
export interface ComponentSettings {
  swiper?: SwiperSettings;
  navbar?: NavbarSettings;
  dropdown?: DropdownSettings;
  tabs?: TabsSettings;
  video?: VideoSettings;
  form?: FormSettings;
  lightbox?: LightboxSettings;
}

// =============================================================================
// COMPONENT FEATURES (for CSS generation)
// =============================================================================

export type ComponentFeature =
  | 'navbar'
  | 'dropdown'
  | 'tabs'
  | 'swiper'
  | 'forms'
  | 'lightbox'
  | 'video'
  | 'lottie'
  | 'cms'
  | 'symbol';

export interface UsedFeatures {
  navbar: boolean;
  dropdown: boolean;
  tabs: boolean;
  swiper: boolean;
  forms: boolean;
  lightbox: boolean;
  video: boolean;
  lottie: boolean;
  cms: boolean;
  symbol: boolean;
}

export function createUsedFeatures(features: Partial<UsedFeatures> = {}): UsedFeatures {
  return {
    navbar: features.navbar ?? false,
    dropdown: features.dropdown ?? false,
    tabs: features.tabs ?? false,
    swiper: features.swiper ?? false,
    forms: features.forms ?? false,
    lightbox: features.lightbox ?? false,
    video: features.video ?? false,
    lottie: features.lottie ?? false,
    cms: features.cms ?? false,
    symbol: features.symbol ?? false,
  };
}
