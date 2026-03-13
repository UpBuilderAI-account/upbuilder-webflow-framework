/**
 * Smart Webflow Defaults CSS Generator
 *
 * Generates only the necessary CSS based on which components are used.
 * Supports 'static' mode (editor preview) and 'live' mode (interactive preview).
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CSS LOADING
// =============================================================================

const CSS_DIR = path.dirname(__filename);

function loadCSS(filename: string): string {
  try {
    return fs.readFileSync(path.join(CSS_DIR, filename), 'utf-8');
  } catch {
    console.warn(`[webflow-defaults] Failed to load ${filename}`);
    return '';
  }
}

// Lazy-load CSS files (cached after first access)
let _baseCSS: string | null = null;
let _navbarCSS: string | null = null;
let _dropdownCSS: string | null = null;
let _tabsCSS: string | null = null;
let _formsCSS: string | null = null;
let _mediaCSS: string | null = null;
let _layoutCSS: string | null = null;
let _staticOverridesCSS: string | null = null;
let _legacyLayoutCSS: string | null = null;
let _legacyFormsCSS: string | null = null;
let _legacyRuntimeCSS: string | null = null;

function getBaseCSS(): string {
  if (_baseCSS === null) _baseCSS = loadCSS('base.css');
  return _baseCSS;
}

function getNavbarCSS(): string {
  if (_navbarCSS === null) _navbarCSS = loadCSS('navbar.css');
  return _navbarCSS;
}

function getDropdownCSS(): string {
  if (_dropdownCSS === null) _dropdownCSS = loadCSS('dropdown.css');
  return _dropdownCSS;
}

function getTabsCSS(): string {
  if (_tabsCSS === null) _tabsCSS = loadCSS('tabs.css');
  return _tabsCSS;
}

function getFormsCSS(): string {
  if (_formsCSS === null) _formsCSS = loadCSS('forms.css');
  return _formsCSS;
}

function getMediaCSS(): string {
  if (_mediaCSS === null) _mediaCSS = loadCSS('media.css');
  return _mediaCSS;
}

function getLayoutCSS(): string {
  if (_layoutCSS === null) _layoutCSS = loadCSS('layout.css');
  return _layoutCSS;
}

function getStaticOverridesCSS(): string {
  if (_staticOverridesCSS === null) _staticOverridesCSS = loadCSS('static-overrides.css');
  return _staticOverridesCSS;
}

function getLegacyLayoutCSS(): string {
  if (_legacyLayoutCSS === null) _legacyLayoutCSS = loadCSS('legacy-layout.css');
  return _legacyLayoutCSS;
}

function getLegacyFormsCSS(): string {
  if (_legacyFormsCSS === null) _legacyFormsCSS = loadCSS('legacy-forms.css');
  return _legacyFormsCSS;
}

function getLegacyRuntimeCSS(): string {
  if (_legacyRuntimeCSS === null) _legacyRuntimeCSS = loadCSS('legacy-runtime.css');
  return _legacyRuntimeCSS;
}

// =============================================================================
// TYPES
// =============================================================================

export interface UsedComponents {
  navbar: boolean;
  dropdown: boolean;
  tabs: boolean;
  swiper: boolean;
  forms: boolean;
  lightbox: boolean;
  video: boolean;
}

export type PreviewMode = 'static' | 'live';
export type WebflowDefaultsPreset = 'smart' | 'full';

export interface GeneratedCSS {
  /** Combined CSS string */
  css: string;
  /** Swiper CDN URL if swiper is used, null otherwise */
  swiperCdnUrl: string | null;
}

// =============================================================================
// COMPONENT DETECTION MAPPING
// =============================================================================

const COMPONENT_FEATURES: Record<string, keyof UsedComponents> = {
  // Navbar
  'NavbarWrapper': 'navbar',
  'NavbarBrand': 'navbar',
  'NavbarMenu': 'navbar',
  'NavbarLink': 'navbar',
  'NavbarButton': 'navbar',
  'HamburgerIcon': 'navbar',

  // Dropdown
  'DropdownWrapper': 'dropdown',
  'DropdownToggle': 'dropdown',
  'DropdownList': 'dropdown',
  'DropdownLink': 'dropdown',
  'AccordionItem': 'dropdown',
  'AccordionTrigger': 'dropdown',
  'AccordionContent': 'dropdown',

  // Tabs
  'TabsWrapper': 'tabs',
  'TabsMenu': 'tabs',
  'TabsLink': 'tabs',
  'TabsContent': 'tabs',
  'TabsPane': 'tabs',

  // Swiper
  'SwiperSlider': 'swiper',
  'SwiperSlide': 'swiper',
  'SwiperNavPrev': 'swiper',
  'SwiperNavNext': 'swiper',
  'SwiperPagination': 'swiper',
  'SwiperScrollbar': 'swiper',

  // Forms
  'FormWrapper': 'forms',
  'FormForm': 'forms',
  'FormTextInput': 'forms',
  'FormTextarea': 'forms',
  'FormSelect': 'forms',
  'FormButton': 'forms',
  'FormCheckboxWrapper': 'forms',
  'FormCheckboxInput': 'forms',
  'FormRadioWrapper': 'forms',
  'FormRadioInput': 'forms',
  'FormBlockLabel': 'forms',
  'FormInlineLabel': 'forms',
  'FormSuccessMessage': 'forms',
  'FormErrorMessage': 'forms',
  'FormFileUploadWrapper': 'forms',
  'FormFileUploadInput': 'forms',
  'FormReCaptcha': 'forms',

  // Lightbox
  'LightboxWrapper': 'lightbox',
  'LightboxLink': 'lightbox',

  // Video
  'Video': 'video',
  'BackgroundVideoWrapper': 'video',
  'BackgroundVideoPlayPauseButton': 'video',
};

// Swiper CDN URL
const SWIPER_CDN_URL = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';

// =============================================================================
// DETECTION FUNCTION
// =============================================================================

/**
 * Detect which components are used from an array of component types
 * @param compTypes - Array of component type strings (e.g., ['NavbarWrapper', 'Block', 'FormWrapper'])
 * @returns UsedComponents object indicating which features are used
 */
export function detectUsedComponents(compTypes: string[]): UsedComponents {
  const used: UsedComponents = {
    navbar: false,
    dropdown: false,
    tabs: false,
    swiper: false,
    forms: false,
    lightbox: false,
    video: false,
  };

  for (const compType of compTypes) {
    const feature = COMPONENT_FEATURES[compType];
    if (feature) {
      used[feature] = true;
    }
  }

  return used;
}

/**
 * Create a default UsedComponents object with all features enabled
 * Use this when component detection is not available
 */
export function allComponentsUsed(): UsedComponents {
  return {
    navbar: true,
    dropdown: true,
    tabs: true,
    swiper: true,
    forms: true,
    lightbox: true,
    video: true,
  };
}

// =============================================================================
// CSS GENERATOR
// =============================================================================

/**
 * Generate Webflow defaults CSS based on used components and preview mode
 * @param used - Which components are used in the project
 * @param mode - 'static' for editor preview, 'live' for interactive preview
 * @returns Generated CSS and optional Swiper CDN URL
 */
export function generateWebflowDefaults(
  used: UsedComponents,
  mode: PreviewMode,
  preset: WebflowDefaultsPreset = 'smart'
): GeneratedCSS {
  const chunks: string[] = [];

  // Base CSS is always included
  chunks.push(getBaseCSS());

  // Layout CSS is always included (containers, grid, flex)
  chunks.push(getLayoutCSS());

  // Component-specific CSS
  if (used.navbar) {
    chunks.push(getNavbarCSS());
  }

  if (used.dropdown) {
    chunks.push(getDropdownCSS());
  }

  if (used.tabs) {
    chunks.push(getTabsCSS());
  }

  if (used.forms) {
    chunks.push(getFormsCSS());
  }

  if (used.lightbox || used.video) {
    chunks.push(getMediaCSS());
  }

  if (preset === 'full') {
    chunks.push(getLegacyLayoutCSS());
    chunks.push(getLegacyFormsCSS());
    chunks.push(getLegacyRuntimeCSS());
  }

  // Static overrides for editor preview
  if (mode === 'static') {
    chunks.push(getStaticOverridesCSS());
  }

  return {
    css: chunks.join('\n\n'),
    swiperCdnUrl: used.swiper ? SWIPER_CDN_URL : null,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  COMPONENT_FEATURES,
  SWIPER_CDN_URL,
};

// Export individual CSS chunk getters for advanced usage
export const cssChunks = {
  get base() { return getBaseCSS(); },
  get navbar() { return getNavbarCSS(); },
  get dropdown() { return getDropdownCSS(); },
  get tabs() { return getTabsCSS(); },
  get forms() { return getFormsCSS(); },
  get media() { return getMediaCSS(); },
  get layout() { return getLayoutCSS(); },
  get legacyLayout() { return getLegacyLayoutCSS(); },
  get legacyForms() { return getLegacyFormsCSS(); },
  get legacyRuntime() { return getLegacyRuntimeCSS(); },
  get staticOverrides() { return getStaticOverridesCSS(); },
};
