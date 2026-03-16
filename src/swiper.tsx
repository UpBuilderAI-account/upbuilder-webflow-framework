/**
 * Swiper Slider components - using Swiper library
 * Full-featured, modern slider with no restrictions
 */
import React, { useRef, Children, isValidElement } from 'react';
import { Swiper, SwiperSlide as SwiperSlideCore } from 'swiper/react';
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
  // Responsive
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
  breakpoints,
  ...props
}: SwiperSliderProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className={`${className || ''} swiper`} data-swiper-container="true" data-up-node-id={nodeId} {...props}>
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
        // Disable default navigation if we have custom nav elements
        // We'll connect them manually in onSwiper after refs are ready
        navigation={navigation && !hasCustomNav && !staticMode}
        pagination={paginationConfig && !hasCustomPagination && !staticMode ? paginationConfig : false}
        scrollbar={scrollbarConfig && !hasCustomScrollbar && !staticMode ? scrollbarConfig : false}
        allowTouchMove={effectiveAllowTouchMove}
        grabCursor={effectiveGrabCursor}
        freeMode={freeMode}
        centeredSlides={centeredSlides}
        breakpoints={breakpoints}
        onSwiper={(swiper) => {
          // Connect custom control elements after Swiper is initialized
          // Use setTimeout to ensure DOM elements are rendered
          setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;

            // Connect custom navigation via data attributes
            if (hasCustomNav && navigation) {
              const prevEl = container.querySelector('[data-swiper-nav="prev"]') as HTMLElement;
              const nextEl = container.querySelector('[data-swiper-nav="next"]') as HTMLElement;
              if (prevEl || nextEl) {
                swiper.params.navigation = { prevEl, nextEl };
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }

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
