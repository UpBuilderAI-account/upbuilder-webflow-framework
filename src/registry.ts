// ============================================================================
// COMPONENT REGISTRY
// Single source of truth for all component definitions
// ============================================================================

import type { ComponentFeature } from './types';

// =============================================================================
// COMPONENT DEFINITION
// =============================================================================

export interface ComponentDefinition {
  /** Default HTML tag */
  tag: string;

  /** XSCP type if different from component name */
  xscpType?: string;

  /** Webflow classes to auto-add (w-* classes) */
  webflowClasses?: string[];

  /** Feature category for CSS generation */
  feature?: ComponentFeature;

  /** True if element cannot have children (img, input, br, etc.) */
  voidElement?: boolean;

  /** CSS validation rules/notes */
  cssRules?: string[];

  /** Required child components */
  requiredChildren?: string[];

  /** Props that map to specific behavior */
  propMappings?: Record<string, string>;
}

// =============================================================================
// COMPONENT REGISTRY
// =============================================================================

export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  // -------------------------------------------------------------------------
  // LAYOUT
  // -------------------------------------------------------------------------
  Block: {
    tag: 'div',
    propMappings: { tag: 'tag' }, // tag prop changes element type
  },
  Section: {
    tag: 'section',
  },
  BlockContainer: {
    tag: 'div',
  },
  Container: {
    tag: 'div',
    webflowClasses: ['w-container'],
  },
  Clearfix: {
    tag: 'div',
    webflowClasses: ['w-clearfix'],
  },
  InlineBlock: {
    tag: 'div',
    webflowClasses: ['w-inline-block'],
  },
  BlockLink: {
    tag: 'a',
    webflowClasses: ['w-inline-block'],
  },
  HFlex: {
    tag: 'div',
    webflowClasses: ['w-layout-hflex'],
  },
  VFlex: {
    tag: 'div',
    webflowClasses: ['w-layout-vflex'],
  },
  Grid: {
    tag: 'div',
    webflowClasses: ['w-layout-grid'],
  },
  Row: {
    tag: 'div',
    webflowClasses: ['w-row'],
  },
  Column: {
    tag: 'div',
    webflowClasses: ['w-col'],
  },

  // -------------------------------------------------------------------------
  // TYPOGRAPHY
  // -------------------------------------------------------------------------
  Heading: {
    tag: 'h2', // Default, 'as' prop changes it
    propMappings: { as: 'tag' },
  },
  Paragraph: {
    tag: 'p',
  },
  Span: {
    tag: 'span',
    xscpType: 'Block',
  },
  Strong: {
    tag: 'strong',
  },
  Emphasized: {
    tag: 'em',
  },
  LineBreak: {
    tag: 'br',
    voidElement: true,
  },
  Blockquote: {
    tag: 'blockquote',
  },
  RichText: {
    tag: 'div',
    webflowClasses: ['w-richtext'],
  },
  Figure: {
    tag: 'figure',
  },
  Figcaption: {
    tag: 'figcaption',
  },
  Superscript: {
    tag: 'sup',
  },
  Subscript: {
    tag: 'sub',
  },
  InlineCode: {
    tag: 'code',
  },
  CodeBlock: {
    tag: 'pre',
    webflowClasses: ['w-code-block'],
  },

  // -------------------------------------------------------------------------
  // LINKS & BUTTONS
  // -------------------------------------------------------------------------
  Link: {
    tag: 'a',
  },
  LinkBlock: {
    tag: 'a',
    xscpType: 'Link',
  },
  TextLink: {
    tag: 'a',
    xscpType: 'Link',
  },
  Button: {
    tag: 'a',
    xscpType: 'Link',
    webflowClasses: ['w-button'],
  },

  // -------------------------------------------------------------------------
  // LISTS
  // -------------------------------------------------------------------------
  List: {
    tag: 'ul', // 'ol' with ordered prop
    propMappings: { ordered: 'tag' },
  },
  ListItem: {
    tag: 'li',
  },
  ListUnstyled: {
    tag: 'ul',
    webflowClasses: ['w-list-unstyled'],
  },

  // -------------------------------------------------------------------------
  // MEDIA
  // -------------------------------------------------------------------------
  Image: {
    tag: 'img',
    voidElement: true,
  },
  Video: {
    tag: 'div',
    webflowClasses: ['w-video', 'w-embed'],
    feature: 'video',
  },
  BackgroundVideoWrapper: {
    tag: 'div',
    webflowClasses: ['w-background-video'],
    feature: 'video',
  },
  BackgroundVideoPlayPauseButton: {
    tag: 'button',
    feature: 'video',
    requiredChildren: ['BackgroundVideoPlayPauseButtonPlaying', 'BackgroundVideoPlayPauseButtonPaused'],
  },
  BackgroundVideoPlayPauseButtonPlaying: {
    tag: 'div',
    feature: 'video',
  },
  BackgroundVideoPlayPauseButtonPaused: {
    tag: 'div',
    feature: 'video',
  },
  // Lottie Animation
  Lottie: {
    tag: 'div',
    xscpType: 'Animation',
    feature: 'lottie',
  },
  HtmlEmbed: {
    tag: 'div',
    webflowClasses: ['w-embed'],
  },

  // -------------------------------------------------------------------------
  // NAVBAR
  // -------------------------------------------------------------------------
  NavbarWrapper: {
    tag: 'nav',
    webflowClasses: ['w-nav'],
    feature: 'navbar',
    cssRules: [
      'Must have background-color (use #00000000 for transparent)',
      'Never use overflow: hidden',
    ],
    requiredChildren: ['NavbarMenu', 'NavbarButton'],
  },
  NavbarBrand: {
    tag: 'a',
    webflowClasses: ['w-nav-brand'],
    feature: 'navbar',
  },
  NavbarMenu: {
    tag: 'nav',
    webflowClasses: ['w-nav-menu'],
    feature: 'navbar',
  },
  NavbarLink: {
    tag: 'a',
    webflowClasses: ['w-nav-link'],
    feature: 'navbar',
  },
  NavbarButton: {
    tag: 'div',
    webflowClasses: ['w-nav-button'],
    feature: 'navbar',
    cssRules: ['Never set display, visibility, or opacity'],
  },
  NavbarContainer: {
    tag: 'div',
    feature: 'navbar',
  },
  HamburgerIcon: {
    tag: 'div',
    webflowClasses: ['w-icon-nav-menu'],
    feature: 'navbar',
    voidElement: true,
  },

  // -------------------------------------------------------------------------
  // DROPDOWN
  // -------------------------------------------------------------------------
  DropdownWrapper: {
    tag: 'div',
    webflowClasses: ['w-dropdown'],
    feature: 'dropdown',
    requiredChildren: ['DropdownToggle', 'DropdownList'],
  },
  DropdownToggle: {
    tag: 'div',
    webflowClasses: ['w-dropdown-toggle'],
    feature: 'dropdown',
  },
  DropdownList: {
    tag: 'nav',
    webflowClasses: ['w-dropdown-list'],
    feature: 'dropdown',
    cssRules: ['Never use display: flex'],
  },
  DropdownLink: {
    tag: 'a',
    webflowClasses: ['w-dropdown-link'],
    feature: 'dropdown',
  },
  // Accordion aliases
  AccordionItem: {
    tag: 'div',
    webflowClasses: ['w-dropdown'],
    feature: 'dropdown',
  },
  AccordionTrigger: {
    tag: 'div',
    webflowClasses: ['w-dropdown-toggle'],
    feature: 'dropdown',
  },
  AccordionContent: {
    tag: 'nav',
    webflowClasses: ['w-dropdown-list'],
    feature: 'dropdown',
  },

  // -------------------------------------------------------------------------
  // TABS
  // -------------------------------------------------------------------------
  TabsWrapper: {
    tag: 'div',
    webflowClasses: ['w-tabs'],
    feature: 'tabs',
    requiredChildren: ['TabsMenu', 'TabsContent'],
  },
  TabsMenu: {
    tag: 'div',
    webflowClasses: ['w-tab-menu'],
    feature: 'tabs',
  },
  TabsLink: {
    tag: 'a',
    webflowClasses: ['w-tab-link'],
    feature: 'tabs',
  },
  TabsContent: {
    tag: 'div',
    webflowClasses: ['w-tab-content'],
    feature: 'tabs',
  },
  TabsPane: {
    tag: 'div',
    webflowClasses: ['w-tab-pane'],
    feature: 'tabs',
  },

  // -------------------------------------------------------------------------
  // SWIPER SLIDER
  // Uses Swiper.js library, NOT Webflow's native slider
  // All components render as Block (div) - Swiper handles functionality via JS
  // -------------------------------------------------------------------------
  SwiperSlider: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },
  SwiperSlide: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },
  SwiperNavPrev: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },
  SwiperNavNext: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },
  SwiperPagination: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },
  SwiperScrollbar: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'swiper',
  },

  // -------------------------------------------------------------------------
  // MARQUEE
  // -------------------------------------------------------------------------
  Marquee: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'marquee',
  },
  /** @deprecated Use Marquee directly with items as children */
  MarqueeTrack: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'marquee',
  },

  // -------------------------------------------------------------------------
  // FORMS
  // -------------------------------------------------------------------------
  FormWrapper: {
    tag: 'div',
    webflowClasses: ['w-form'],
    feature: 'forms',
    requiredChildren: ['FormForm'],
  },
  FormForm: {
    tag: 'form',
    feature: 'forms',
  },
  FormTextInput: {
    tag: 'input',
    webflowClasses: ['w-input'],
    feature: 'forms',
    voidElement: true,
  },
  FormTextarea: {
    tag: 'textarea',
    webflowClasses: ['w-input'],
    feature: 'forms',
  },
  FormSelect: {
    tag: 'select',
    webflowClasses: ['w-select'],
    feature: 'forms',
  },
  FormButton: {
    tag: 'button',
    webflowClasses: ['w-button'],
    feature: 'forms',
  },
  FormCheckboxWrapper: {
    tag: 'label',
    webflowClasses: ['w-checkbox'],
    feature: 'forms',
    requiredChildren: ['FormCheckboxInput'],
  },
  FormCheckboxInput: {
    tag: 'input',
    webflowClasses: ['w-checkbox-input'],
    feature: 'forms',
    voidElement: true,
  },
  FormRadioWrapper: {
    tag: 'label',
    webflowClasses: ['w-radio'],
    feature: 'forms',
    requiredChildren: ['FormRadioInput'],
  },
  FormRadioInput: {
    tag: 'input',
    webflowClasses: ['w-radio-input'],
    feature: 'forms',
    voidElement: true,
  },
  FormBlockLabel: {
    tag: 'label',
    feature: 'forms',
  },
  FormInlineLabel: {
    tag: 'label',
    feature: 'forms',
  },
  FormSuccessMessage: {
    tag: 'div',
    webflowClasses: ['w-form-done'],
    feature: 'forms',
  },
  FormErrorMessage: {
    tag: 'div',
    webflowClasses: ['w-form-fail'],
    feature: 'forms',
  },
  FormReCaptcha: {
    tag: 'div',
    feature: 'forms',
  },

  // -------------------------------------------------------------------------
  // CMS / DYNAMIC - Collection Structure
  // -------------------------------------------------------------------------
  DynamoWrapper: {
    tag: 'div',
    feature: 'cms',
  },
  DynamoList: {
    tag: 'div',
    webflowClasses: ['w-dyn-items'],
    feature: 'cms',
  },
  DynamoItem: {
    tag: 'div',
    webflowClasses: ['w-dyn-item'],
    feature: 'cms',
  },
  DynamoEmpty: {
    tag: 'div',
    webflowClasses: ['w-dyn-empty'],
    feature: 'cms',
  },

  // -------------------------------------------------------------------------
  // CMS / DYNAMIC - Field Bindings
  // xscpType maps to valid Webflow XSCP types (Block, Image, Link, etc.)
  // The dyn.bind data carries the CMS field binding info
  // -------------------------------------------------------------------------
  DynText: {
    tag: 'span',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynRichText: {
    tag: 'div',
    xscpType: 'RichText',
    webflowClasses: ['w-richtext'],
    feature: 'cms',
  },
  DynImage: {
    tag: 'img',
    xscpType: 'Image',
    voidElement: true,
    feature: 'cms',
  },
  DynVideo: {
    tag: 'div',
    xscpType: 'Video',
    feature: 'cms',
  },
  DynLink: {
    tag: 'a',
    xscpType: 'Link',
    feature: 'cms',
  },
  DynSlugLink: {
    tag: 'a',
    xscpType: 'Link',
    feature: 'cms',
  },
  DynEmail: {
    tag: 'a',
    xscpType: 'Link',
    feature: 'cms',
  },
  DynPhone: {
    tag: 'a',
    xscpType: 'Link',
    feature: 'cms',
  },
  DynFile: {
    tag: 'a',
    xscpType: 'Link',
    feature: 'cms',
  },
  DynDate: {
    tag: 'time',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynNumber: {
    tag: 'span',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynColor: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynOption: {
    tag: 'span',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynSwitch: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynReference: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynMultiReference: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynMultiImage: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },
  DynPagination: {
    tag: 'div',
    xscpType: 'Block',
    feature: 'cms',
  },

  // -------------------------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------------------------
  SearchForm: {
    tag: 'form',
  },
  SearchInput: {
    tag: 'input',
    voidElement: true,
  },
  SearchButton: {
    tag: 'button',
  },
  SearchResults: {
    tag: 'div',
  },

  // -------------------------------------------------------------------------
  // LIGHTBOX
  // -------------------------------------------------------------------------
  LightboxWrapper: {
    tag: 'a',
    webflowClasses: ['w-lightbox'],
    feature: 'lightbox',
  },
  LightboxLink: {
    tag: 'a',
    webflowClasses: ['w-lightbox-link'],
    feature: 'lightbox',
  },

  // -------------------------------------------------------------------------
  // MAP
  // -------------------------------------------------------------------------
  MapWidget: {
    tag: 'div',
    webflowClasses: ['w-widget', 'w-widget-map'],
    voidElement: true,
  },

  // -------------------------------------------------------------------------
  // SYMBOLS / COMPONENTS
  // -------------------------------------------------------------------------
  Symbol: {
    tag: 'div',
    xscpType: 'Block', // Renders as Block, but with symbol metadata
    feature: 'symbol',
  },
  SymbolInstance: {
    tag: 'div',
    xscpType: 'Symbol', // Actual Webflow Symbol type
    feature: 'symbol',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get component definition by name
 */
export function getComponentDef(componentType: string): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY[componentType];
}

/**
 * Get default HTML tag for a component type
 */
export function getDefaultTag(componentType: string): string {
  return COMPONENT_REGISTRY[componentType]?.tag ?? 'div';
}

/**
 * Get XSCP type for a component (for Webflow export)
 * Returns the component name if no specific XSCP type is defined
 */
export function getXSCPType(componentType: string): string {
  const def = COMPONENT_REGISTRY[componentType];
  return def?.xscpType ?? componentType;
}

/**
 * Get Webflow classes (w-*) that should be auto-added to a component
 */
export function getWebflowClasses(componentType: string): string[] {
  return COMPONENT_REGISTRY[componentType]?.webflowClasses ?? [];
}

/**
 * Check if a component is a void element (cannot have children)
 */
export function isVoidElement(componentType: string): boolean {
  return COMPONENT_REGISTRY[componentType]?.voidElement ?? false;
}

/**
 * Get the feature category for a component (for CSS generation)
 */
export function getComponentFeature(componentType: string): ComponentFeature | undefined {
  return COMPONENT_REGISTRY[componentType]?.feature;
}

/**
 * Get CSS validation rules for a component
 */
export function getCSSRules(componentType: string): string[] {
  return COMPONENT_REGISTRY[componentType]?.cssRules ?? [];
}

/**
 * Get required children for a component
 */
export function getRequiredChildren(componentType: string): string[] {
  return COMPONENT_REGISTRY[componentType]?.requiredChildren ?? [];
}

/**
 * Check if a component type exists in the registry
 */
export function isValidComponentType(componentType: string): boolean {
  return componentType in COMPONENT_REGISTRY;
}

/**
 * Get all component names
 */
export function getAllComponentTypes(): string[] {
  return Object.keys(COMPONENT_REGISTRY);
}

/**
 * Get all component names for a specific feature
 */
export function getComponentsByFeature(feature: ComponentFeature): string[] {
  return Object.entries(COMPONENT_REGISTRY)
    .filter(([_, def]) => def.feature === feature)
    .map(([name]) => name);
}

/**
 * Get all void element component names
 */
export function getVoidElements(): string[] {
  return Object.entries(COMPONENT_REGISTRY)
    .filter(([_, def]) => def.voidElement)
    .map(([name]) => name);
}

/**
 * Build COMPONENT_FEATURES map from registry (for webflow-defaults compatibility)
 */
export function buildComponentFeaturesMap(): Record<string, ComponentFeature> {
  const map: Record<string, ComponentFeature> = {};
  for (const [name, def] of Object.entries(COMPONENT_REGISTRY)) {
    if (def.feature) {
      map[name] = def.feature;
    }
  }
  return map;
}

/**
 * Build webflow classes lookup (component → classes)
 */
export function buildWebflowClassesMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const [name, def] of Object.entries(COMPONENT_REGISTRY)) {
    if (def.webflowClasses && def.webflowClasses.length > 0) {
      map[name] = def.webflowClasses;
    }
  }
  return map;
}

// =============================================================================
// REVERSE LOOKUPS
// =============================================================================

/** Map from Webflow w-* class to component types */
let _webflowClassToComponents: Map<string, string[]> | null = null;

function getWebflowClassToComponentsMap(): Map<string, string[]> {
  if (_webflowClassToComponents === null) {
    _webflowClassToComponents = new Map();
    for (const [name, def] of Object.entries(COMPONENT_REGISTRY)) {
      if (def.webflowClasses) {
        for (const cls of def.webflowClasses) {
          const existing = _webflowClassToComponents.get(cls) ?? [];
          existing.push(name);
          _webflowClassToComponents.set(cls, existing);
        }
      }
    }
  }
  return _webflowClassToComponents;
}

/**
 * Find component types that use a specific Webflow class
 */
export function findComponentsByWebflowClass(webflowClass: string): string[] {
  return getWebflowClassToComponentsMap().get(webflowClass) ?? [];
}

/**
 * Infer component type from Webflow classes
 * Returns the first matching component type or undefined
 */
export function inferComponentFromClasses(classes: string[]): string | undefined {
  const map = getWebflowClassToComponentsMap();
  for (const cls of classes) {
    const components = map.get(cls);
    if (components && components.length > 0) {
      return components[0];
    }
  }
  return undefined;
}
