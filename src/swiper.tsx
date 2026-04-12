/**
 * Swiper Slider components - using Swiper library
 */
import React, { useRef, useEffect, useCallback, Children, isValidElement } from 'react';
import { Swiper, SwiperSlide as SwiperSlideCore } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';
import { Navigation, Pagination, Scrollbar, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards, EffectCreative, FreeMode } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import type { AnimationEffect, AnimationEasing } from './types';

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
// TYPES
// ============================================================================

export interface SwiperSliderProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  direction?: 'horizontal' | 'vertical';
  loop?: boolean;
  speed?: number;
  initialSlide?: number;
  slidesPerGroup?: number;
  autoplay?: boolean | { delay?: number; disableOnInteraction?: boolean; pauseOnMouseEnter?: boolean };
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative';
  navigation?: boolean;
  pagination?: boolean | { type?: 'bullets' | 'fraction' | 'progressbar'; clickable?: boolean };
  scrollbar?: boolean | { draggable?: boolean };
  allowTouchMove?: boolean;
  grabCursor?: boolean;
  freeMode?: boolean;
  centeredSlides?: boolean;
  slidesPerViewTablet?: number;
  slidesPerViewMobile?: number;
  spaceBetweenTablet?: number;
  spaceBetweenMobile?: number;
  breakpoints?: Record<number, Partial<SwiperOptions>>;
  [key: string]: any;
}

export interface SwiperSlideProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// ============================================================================
// COMPONENTS
// ============================================================================

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
  slidesPerViewTablet,
  slidesPerViewMobile,
  spaceBetweenTablet,
  spaceBetweenMobile,
  breakpoints: breakpointsProp,
  ...rest
}: SwiperSliderProps) {
  const hasResponsiveProps = slidesPerViewTablet !== undefined || slidesPerViewMobile !== undefined ||
                              spaceBetweenTablet !== undefined || spaceBetweenMobile !== undefined;

  const breakpoints = breakpointsProp || (hasResponsiveProps ? (() => {
    const bp: Record<number, Partial<SwiperOptions>> = {};
    if (slidesPerViewMobile !== undefined || spaceBetweenMobile !== undefined) {
      bp[0] = {};
      if (slidesPerViewMobile !== undefined) bp[0].slidesPerView = slidesPerViewMobile;
      if (spaceBetweenMobile !== undefined) bp[0].spaceBetween = spaceBetweenMobile;
    }
    if (slidesPerViewTablet !== undefined || spaceBetweenTablet !== undefined) {
      bp[768] = {};
      if (slidesPerViewTablet !== undefined) bp[768].slidesPerView = slidesPerViewTablet;
      if (spaceBetweenTablet !== undefined) bp[768].spaceBetween = spaceBetweenTablet;
    }
    bp[992] = { slidesPerView, spaceBetween };
    return bp;
  })() : undefined);

  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (staticMode || !swiperRef.current) return;
    const target = e.target as HTMLElement;
    const navEl = target.closest('[data-swiper-nav]') as HTMLElement;
    if (!navEl) return;
    const navType = navEl.getAttribute('data-swiper-nav');
    if (navType === 'prev') swiperRef.current.slidePrev();
    else if (navType === 'next') swiperRef.current.slideNext();
  }, [staticMode]);

  const effectiveAutoplay = staticMode ? false : autoplay;
  const effectiveAllowTouchMove = staticMode ? false : allowTouchMove;
  const effectiveGrabCursor = staticMode ? false : grabCursor;
  const effectiveInitialSlide = staticMode ? 0 : initialSlide;

  const slides: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];
  let hasCustomNav = false;
  let hasCustomPagination = false;
  let hasCustomScrollbar = false;

  const checkForControls = (node: React.ReactNode): void => {
    if (!isValidElement(node)) return;
    const displayName = (node.type as any)?.displayName || (node.type as any)?.name;
    if (displayName === 'SwiperNavPrev' || displayName === 'SwiperNavNext' || node.type === SwiperNavPrev || node.type === SwiperNavNext) hasCustomNav = true;
    if (displayName === 'SwiperPagination' || node.type === SwiperPagination) hasCustomPagination = true;
    if (displayName === 'SwiperScrollbar' || node.type === SwiperScrollbar) hasCustomScrollbar = true;
    Children.forEach((node.props as any)?.children, checkForControls);
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) { otherChildren.push(child); return; }
    const displayName = (child.type as any)?.displayName || (child.type as any)?.name;
    if (displayName === 'SwiperSlide' || child.type === SwiperSlide) slides.push(child);
    else { checkForControls(child); otherChildren.push(child); }
  });

  const modules = [Navigation, Pagination, Scrollbar, Autoplay, FreeMode];
  if (effect === 'fade') modules.push(EffectFade);
  if (effect === 'cube') modules.push(EffectCube);
  if (effect === 'coverflow') modules.push(EffectCoverflow);
  if (effect === 'flip') modules.push(EffectFlip);
  if (effect === 'cards') modules.push(EffectCards);
  if (effect === 'creative') modules.push(EffectCreative);

  const autoplayConfig = effectiveAutoplay === true
    ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }
    : effectiveAutoplay || false;

  const paginationConfig = pagination === true ? { clickable: true } : pagination ? { ...pagination } : false;
  const scrollbarConfig = scrollbar === true ? { draggable: true } : scrollbar ? { ...scrollbar } : false;

  return (
    <div ref={containerRef} className={`${className || ''} swiper`} data-swiper-container="true" data-up-node-id={nodeId} onClick={handleContainerClick} {...props} {...animAttrs}>
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
        navigation={staticMode ? false : hasCustomNav ? false : navigation}
        pagination={staticMode ? false : hasCustomPagination && pagination ? { el: null } : paginationConfig}
        scrollbar={staticMode ? false : hasCustomScrollbar && scrollbar ? { el: null } : scrollbarConfig}
        allowTouchMove={effectiveAllowTouchMove}
        grabCursor={effectiveGrabCursor}
        freeMode={freeMode}
        centeredSlides={centeredSlides}
        breakpoints={breakpoints}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;
            if (hasCustomPagination && pagination) {
              const paginationEl = container.querySelector('[data-swiper-pagination="true"]') as HTMLElement;
              if (paginationEl) {
                swiper.params.pagination = { ...(typeof paginationConfig === 'object' ? paginationConfig : { clickable: true }), el: paginationEl };
                swiper.pagination.init();
                swiper.pagination.update();
              }
            }
            if (hasCustomScrollbar && scrollbar) {
              const scrollbarEl = container.querySelector('[data-swiper-scrollbar="true"]') as HTMLElement;
              if (scrollbarEl) {
                swiper.params.scrollbar = { ...(typeof scrollbarConfig === 'object' ? scrollbarConfig : { draggable: true }), el: scrollbarEl };
                swiper.scrollbar.init();
                (swiper.scrollbar as any).update();
              }
            }
          }, 0);
        }}
      >
        {slides.map((slide, idx) => {
          const slideElement = slide as React.ReactElement<SwiperSlideProps>;
          return (
            <SwiperSlideCore key={idx} className={slideElement.props.className}>
              {slideElement.props.children}
            </SwiperSlideCore>
          );
        })}
      </Swiper>
      {otherChildren}
    </div>
  );
}

export function SwiperSlide({ className, children, ...rest }: SwiperSlideProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <div className={`${className || ''} swiper-slide`} data-swiper-slide="true" data-up-node-id={nodeId} {...props} {...animAttrs}>
      {children}
    </div>
  );
}
SwiperSlide.displayName = 'SwiperSlide';

export interface SwiperNavProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SwiperNavPrev({ className, children, ...rest }: SwiperNavProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
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
      {...animAttrs}
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

export function SwiperNavNext({ className, children, ...rest }: SwiperNavProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
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
      {...animAttrs}
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

export interface SwiperPaginationProps extends AnimationProps {
  className?: string;
  [key: string]: any;
}

export function SwiperPagination({ className, ...rest }: SwiperPaginationProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div className={className || ''} data-swiper-pagination="true" data-up-node-id={nodeId} {...props} {...animAttrs} />;
}
SwiperPagination.displayName = 'SwiperPagination';

export function SwiperScrollbar({ className, ...rest }: SwiperPaginationProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div className={className || ''} data-swiper-scrollbar="true" data-up-node-id={nodeId} {...props} {...animAttrs} />;
}
SwiperScrollbar.displayName = 'SwiperScrollbar';
