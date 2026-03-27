/**
 * Swiper Slider components - using Swiper library
 * Full-featured, modern slider with no restrictions
 */
import React, { useRef, useEffect, useCallback, Children, isValidElement } from 'react';
import { Swiper, SwiperSlide as SwiperSlideCore } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';
import { Navigation, Pagination, Scrollbar, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards, EffectCreative, FreeMode } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';
import 'swiper/css/free-mode';

// ============================================================================
// TYPES
// ============================================================================

export interface SwiperSliderProps {
  className?: string;
  children?: React.ReactNode;
  // Core settings
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  direction?: 'horizontal' | 'vertical';
  loop?: boolean;
  speed?: number;
  initialSlide?: number;
  slidesPerGroup?: number;
  // Autoplay
  autoplay?: boolean | { delay?: number; disableOnInteraction?: boolean; pauseOnMouseEnter?: boolean };
  // Effects
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative';
  // Navigation
  navigation?: boolean;
  pagination?: boolean | { type?: 'bullets' | 'fraction' | 'progressbar'; clickable?: boolean };
  scrollbar?: boolean | { draggable?: boolean };
  // Touch & Interaction
  allowTouchMove?: boolean;
  grabCursor?: boolean;
  freeMode?: boolean;
  centeredSlides?: boolean;
  // Responsive - simple props (preferred over breakpoints object)
  slidesPerViewTablet?: number;  // At 768-991px
  slidesPerViewMobile?: number;  // At 0-767px
  spaceBetweenTablet?: number;
  spaceBetweenMobile?: number;
  // Responsive - advanced (raw Swiper breakpoints)
  breakpoints?: Record<number, Partial<SwiperOptions>>;
  // Other props
  [key: string]: any;
}

export interface SwiperSlideProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * SwiperSlider - Main slider container
 * Wraps Swiper library with support for custom navigation/pagination placement
 */
export function SwiperSlider({
  className,
  children,
  slidesPerView = 1,
  spaceBetween = 0,
  direction = 'horizontal',
  loop = true,
  speed = 300,
  initialSlide = 0,
  slidesPerGroup = 1,
  autoplay = true,
  effect = 'slide',
  navigation = false,
  pagination = false,
  scrollbar = false,
  allowTouchMove = true,
  grabCursor = false,
  freeMode = false,
  centeredSlides = false,
  // Responsive simple props
  slidesPerViewTablet,
  slidesPerViewMobile,
  spaceBetweenTablet,
  spaceBetweenMobile,
  breakpoints: breakpointsProp,
  ...props
}: SwiperSliderProps) {
  // Build breakpoints from simple responsive props if not using raw breakpoints
  const hasResponsiveProps = slidesPerViewTablet !== undefined || slidesPerViewMobile !== undefined ||
                              spaceBetweenTablet !== undefined || spaceBetweenMobile !== undefined;

  const breakpoints = breakpointsProp || (hasResponsiveProps ? (() => {
    const bp: Record<number, Partial<SwiperOptions>> = {};

    // Mobile first: 0px+ (mobile values)
    if (slidesPerViewMobile !== undefined || spaceBetweenMobile !== undefined) {
      bp[0] = {};
      if (slidesPerViewMobile !== undefined) bp[0].slidesPerView = slidesPerViewMobile;
      if (spaceBetweenMobile !== undefined) bp[0].spaceBetween = spaceBetweenMobile;
    }

    // Tablet: 768px+
    if (slidesPerViewTablet !== undefined || spaceBetweenTablet !== undefined) {
      bp[768] = {};
      if (slidesPerViewTablet !== undefined) bp[768].slidesPerView = slidesPerViewTablet;
      if (spaceBetweenTablet !== undefined) bp[768].spaceBetween = spaceBetweenTablet;
    }

    // Desktop: 992px+ (use main slidesPerView/spaceBetween)
    bp[992] = {
      slidesPerView,
      spaceBetween,
    };

    return bp;
  })() : undefined);

  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Handle clicks on custom nav elements via event delegation
  // This is more reliable than Swiper's navigation.init() for custom elements
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (staticMode || !swiperRef.current) return;

    const target = e.target as HTMLElement;
    // Check if click is on or inside a nav element
    const navEl = target.closest('[data-swiper-nav]') as HTMLElement;
    if (!navEl) return;

    const navType = navEl.getAttribute('data-swiper-nav');
    if (navType === 'prev') {
      swiperRef.current.slidePrev();
    } else if (navType === 'next') {
      swiperRef.current.slideNext();
    }
  }, [staticMode]);

  // In static mode: disable autoplay, touch interactions, and show first slide
  const effectiveAutoplay = staticMode ? false : autoplay;
  const effectiveAllowTouchMove = staticMode ? false : allowTouchMove;
  const effectiveGrabCursor = staticMode ? false : grabCursor;
  const effectiveInitialSlide = staticMode ? 0 : initialSlide;

  // Separate children into slides and other elements
  const slides: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  // Track if we have custom nav/pagination (for Swiper config)
  let hasCustomNav = false;
  let hasCustomPagination = false;
  let hasCustomScrollbar = false;

  // Recursively check if a node tree contains swiper controls
  const checkForControls = (node: React.ReactNode): void => {
    if (!isValidElement(node)) return;
    const displayName = (node.type as any)?.displayName || (node.type as any)?.name;
    if (displayName === 'SwiperNavPrev' || displayName === 'SwiperNavNext' || node.type === SwiperNavPrev || node.type === SwiperNavNext) {
      hasCustomNav = true;
    }
    if (displayName === 'SwiperPagination' || node.type === SwiperPagination) {
      hasCustomPagination = true;
    }
    if (displayName === 'SwiperScrollbar' || node.type === SwiperScrollbar) {
      hasCustomScrollbar = true;
    }
    // Check nested children
    Children.forEach((node.props as any)?.children, checkForControls);
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      otherChildren.push(child);
      return;
    }

    const displayName = (child.type as any)?.displayName || (child.type as any)?.name;

    if (displayName === 'SwiperSlide' || child.type === SwiperSlide) {
      slides.push(child);
    } else {
      // Check this child and its descendants for controls
      checkForControls(child);
      // Keep all non-slide children in otherChildren (including wrappers with nav elements)
      otherChildren.push(child);
    }
  });

  // Build modules array based on enabled features
  const modules = [Navigation, Pagination, Scrollbar, Autoplay, FreeMode];
  if (effect === 'fade') modules.push(EffectFade);
  if (effect === 'cube') modules.push(EffectCube);
  if (effect === 'coverflow') modules.push(EffectCoverflow);
  if (effect === 'flip') modules.push(EffectFlip);
  if (effect === 'cards') modules.push(EffectCards);
  if (effect === 'creative') modules.push(EffectCreative);

  // Build autoplay config (disabled in static mode)
  const autoplayConfig = effectiveAutoplay === true
    ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }
    : effectiveAutoplay || false;

  // Build pagination config - use data attribute selector if we have custom pagination
  const paginationConfig = pagination === true
    ? { clickable: true }
    : pagination
      ? { ...pagination }
      : false;

  // Build scrollbar config
  const scrollbarConfig = scrollbar === true
    ? { draggable: true }
    : scrollbar
      ? { ...scrollbar }
      : false;

  return (
    <div ref={containerRef} className={`${className || ''} swiper`} data-swiper-container="true" data-up-node-id={nodeId} onClick={handleContainerClick} {...props}>
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        direction={direction}
        loop={loop}
        speed={speed}
        initialSlide={effectiveInitialSlide}
        slidesPerGroup={slidesPerGroup}
        autoplay={autoplayConfig}
        effect={effect}
        // For custom nav: we handle clicks via event delegation (no Swiper navigation needed)
        // For default nav: pass true (Swiper creates its own buttons)
        navigation={
          staticMode ? false :
          hasCustomNav ? false :
          navigation
        }
        // For custom pagination: pass empty object to initialize module
        pagination={
          staticMode ? false :
          hasCustomPagination && pagination ? { el: null } :
          paginationConfig
        }
        // For custom scrollbar: pass empty object to initialize module
        scrollbar={
          staticMode ? false :
          hasCustomScrollbar && scrollbar ? { el: null } :
          scrollbarConfig
        }
        allowTouchMove={effectiveAllowTouchMove}
        grabCursor={effectiveGrabCursor}
        freeMode={freeMode}
        centeredSlides={centeredSlides}
        breakpoints={breakpoints}
        onSwiper={(swiper) => {
          // Store swiper instance for click handling
          swiperRef.current = swiper;

          // Connect custom pagination/scrollbar elements after Swiper is initialized
          // Navigation is handled via event delegation (handleContainerClick)
          setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;

            // Connect custom pagination via data attribute
            if (hasCustomPagination && pagination) {
              const paginationEl = container.querySelector('[data-swiper-pagination="true"]') as HTMLElement;
              if (paginationEl) {
                swiper.params.pagination = {
                  ...(typeof paginationConfig === 'object' ? paginationConfig : { clickable: true }),
                  el: paginationEl,
                };
                swiper.pagination.init();
                swiper.pagination.update();
              }
            }

            // Connect custom scrollbar via data attribute
            if (hasCustomScrollbar && scrollbar) {
              const scrollbarEl = container.querySelector('[data-swiper-scrollbar="true"]') as HTMLElement;
              if (scrollbarEl) {
                swiper.params.scrollbar = {
                  ...(typeof scrollbarConfig === 'object' ? scrollbarConfig : { draggable: true }),
                  el: scrollbarEl,
                };
                swiper.scrollbar.init();
                (swiper.scrollbar as any).update();
              }
            }
          }, 0);
        }}
      >
        {slides.map((slide, idx) => {
          // SwiperSlide component already renders content - just extract children
          // to avoid double-nesting (SwiperSlideCore would add another swiper-slide div)
          const slideElement = slide as React.ReactElement<SwiperSlideProps>;
          return (
            <SwiperSlideCore key={idx} className={slideElement.props.className}>
              {slideElement.props.children}
            </SwiperSlideCore>
          );
        })}
      </Swiper>

      {/* Custom controls rendered outside Swiper for flexible placement */}
      {/* Note: Controls stay in otherChildren if wrapped in a Block - they're only
          extracted here if they're direct children of SwiperSlider */}
      {otherChildren}
    </div>
  );
}

/**
 * SwiperSlide - Individual slide
 */
export function SwiperSlide({ className, children, ...props }: SwiperSlideProps) {
  const nodeId = useNodeID();
  return (
    <div className={`${className || ''} swiper-slide`} data-swiper-slide="true" data-up-node-id={nodeId} {...props}>
      {children}
    </div>
  );
}
SwiperSlide.displayName = 'SwiperSlide';

/**
 * SwiperNavPrev - Previous navigation button
 * NOTE: We don't add swiper-button-prev class because it shows Swiper's default arrow via ::after
 * The init script connects this element via data-swiper-nav attribute instead
 */
export function SwiperNavPrev({ className, children, ...props }: { className?: string; children?: React.ReactNode; [key: string]: any }) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  return (
    <div
      className={className || ''}
      role="button"
      tabIndex={staticMode ? -1 : 0}
      aria-label="Previous slide"
      data-swiper-nav="prev"
      data-up-node-id={nodeId}
      style={staticMode ? { cursor: 'default', pointerEvents: 'none' } : undefined}
      {...props}
    >
      {children || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      )}
    </div>
  );
}
SwiperNavPrev.displayName = 'SwiperNavPrev';

/**
 * SwiperNavNext - Next navigation button
 * NOTE: We don't add swiper-button-next class because it shows Swiper's default arrow via ::after
 * The init script connects this element via data-swiper-nav attribute instead
 */
export function SwiperNavNext({ className, children, ...props }: { className?: string; children?: React.ReactNode; [key: string]: any }) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  return (
    <div
      className={className || ''}
      role="button"
      tabIndex={staticMode ? -1 : 0}
      aria-label="Next slide"
      data-swiper-nav="next"
      data-up-node-id={nodeId}
      style={staticMode ? { cursor: 'default', pointerEvents: 'none' } : undefined}
      {...props}
    >
      {children || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </div>
  );
}
SwiperNavNext.displayName = 'SwiperNavNext';

/**
 * SwiperPagination - Pagination dots/bullets
 * NOTE: We don't add swiper-pagination class because it shows Swiper's default dots
 * For custom pagination, use your own styling; for default dots, Swiper will populate this element
 */
export function SwiperPagination({ className, ...props }: { className?: string; [key: string]: any }) {
  const nodeId = useNodeID();
  return <div className={className || ''} data-swiper-pagination="true" data-up-node-id={nodeId} {...props} />;
}
SwiperPagination.displayName = 'SwiperPagination';

/**
 * SwiperScrollbar - Scrollbar
 * NOTE: We don't add swiper-scrollbar class because it shows Swiper's default scrollbar
 */
export function SwiperScrollbar({ className, ...props }: { className?: string; [key: string]: any }) {
  const nodeId = useNodeID();
  return <div className={className || ''} data-swiper-scrollbar="true" data-up-node-id={nodeId} {...props} />;
}
SwiperScrollbar.displayName = 'SwiperScrollbar';
