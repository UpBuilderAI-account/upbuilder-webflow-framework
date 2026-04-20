/**
 * Marquee component - Infinite scroll for logos, brands, etc.
 *
 * Uses CSS keyframes for preview animation (reliable).
 * XSCP export generates IX2 for Webflow compatibility.
 * Simplified API: Items are direct children, no wrapper needed.
 */
import React, { useRef, useEffect, useId } from 'react';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';
import type { AnimationEffect, AnimationEasing } from './types';

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

// ============================================================================
// TYPES
// ============================================================================

export interface MarqueeProps extends AnimationProps {
  /** Class for the marquee container - just like any other component */
  className?: string;
  children?: React.ReactNode;
  /** Direction of movement */
  direction?: 'left' | 'right';
  /** Speed in pixels per second (default: 50) */
  speed?: number;
  /** Duration in ms (alternative to speed, overrides speed calculation) */
  duration?: number;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Show edge fade effect */
  edgeFade?: boolean;
  /** Width of edge fade in px */
  fadeWidth?: number;
  /** Number of times to duplicate content for seamless loop (default: 2) */
  duplicateCount?: number;
  [key: string]: any;
}

// ============================================================================
// CSS KEYFRAMES INJECTION
// ============================================================================

const injectedKeyframes = new Set<string>();

function injectMarqueeKeyframes(
  animationName: string,
  direction: 'left' | 'right',
  duplicateCount: number
): void {
  if (typeof document === 'undefined') return;
  if (injectedKeyframes.has(animationName)) return;

  const translatePercent = -100 / duplicateCount;
  const isRight = direction === 'right';
  const startX = isRight ? translatePercent : 0;
  const endX = isRight ? 0 : translatePercent;

  const keyframes = `
    @keyframes ${animationName} {
      0% { transform: translateX(${startX}%); }
      100% { transform: translateX(${endX}%); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
  injectedKeyframes.add(animationName);
}

// ============================================================================
// MARQUEE COMPONENT
// ============================================================================

export function Marquee({
  className,
  children,
  direction = 'left',
  speed = 50,
  duration: durationProp,
  pauseOnHover = false,
  edgeFade = false,
  fadeWidth = 48,
  duplicateCount = 2,
  animate,
  animateHover,
  animateClick,
  animatePageLoad,
  animateDelay,
  animateDuration,
  animateEasing,
  ...rest
}: MarqueeProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const trackRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const trackId = `marquee-${reactId.replace(/:/g, '')}`;
  const animationName = `marquee-scroll-${trackId}`;

  const animAttrs = extractAnimationAttrs({
    animate, animateHover, animateClick, animatePageLoad,
    animateDelay, animateDuration, animateEasing,
  });

  // Calculate duration from speed if not explicitly set
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  useEffect(() => {
    if (trackRef.current) {
      const width = trackRef.current.scrollWidth / duplicateCount;
      setMeasuredWidth(width);
    }
  }, [children, duplicateCount]);

  const calculatedDuration = durationProp || (measuredWidth > 0 ? (measuredWidth / speed) * 1000 : 10000);

  // Track when keyframes are ready
  const [keyframesReady, setKeyframesReady] = React.useState(false);

  // Inject CSS keyframes for this marquee instance
  useEffect(() => {
    if (!staticMode && calculatedDuration > 0) {
      injectMarqueeKeyframes(animationName, direction, duplicateCount);
      setKeyframesReady(true);
    }
  }, [animationName, direction, duplicateCount, calculatedDuration, staticMode]);

  // Container style with edge fade
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    ...(rest.style || {}),
  };

  if (edgeFade) {
    containerStyle.maskImage = `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`;
    containerStyle.WebkitMaskImage = containerStyle.maskImage;
  }

  // Track style with CSS animation
  const trackStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    width: 'max-content',
    flexShrink: 0,
    backfaceVisibility: 'hidden',
  };

  // Add animation in non-static mode when keyframes are ready
  if (!staticMode && calculatedDuration > 0 && keyframesReady) {
    trackStyle.animation = `${animationName} ${calculatedDuration}ms linear infinite`;
  }

  // Duplicate children for seamless infinite loop
  const renderChildren = () => {
    const duplicates = [];
    for (let i = 0; i < duplicateCount; i++) {
      duplicates.push(
        <div key={i} style={{ display: 'contents' }}>
          {children}
        </div>
      );
    }
    return duplicates;
  };

  return (
    <div
      className={className}
      data-up-node-id={nodeId}
      data-marquee-container="true"
      data-marquee-pause-on-hover={pauseOnHover || undefined}
      data-marquee-edge-fade={edgeFade || undefined}
      data-marquee-fade-width={edgeFade ? fadeWidth : undefined}
      style={containerStyle}
      {...animAttrs}
      {...rest}
    >
      <div
        ref={trackRef}
        data-marquee-track="true"
        data-marquee-track-id={trackId}
        data-marquee-direction={direction}
        data-marquee-speed={speed}
        data-marquee-duration={durationProp}
        data-marquee-duplicate-count={duplicateCount}
        style={trackStyle}
      >
        {renderChildren()}
      </div>
    </div>
  );
}
Marquee.displayName = 'Marquee';

// ============================================================================
// DEPRECATED - MarqueeTrack (kept for backwards compatibility)
// ============================================================================

/** @deprecated Use Marquee directly with items as children. MarqueeTrack is no longer needed. */
export interface MarqueeTrackProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  duration?: number;
  infinite?: boolean;
  duplicateCount?: number;
  [key: string]: any;
}

/** @deprecated Use Marquee directly with items as children. */
export function MarqueeTrack({
  className,
  children,
  direction = 'left',
  speed = 50,
  duration,
  infinite = true,
  duplicateCount = 2,
  ...rest
}: MarqueeTrackProps) {
  const nodeId = useNodeID();

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    width: 'max-content',
    ...(rest.style || {}),
  };

  const renderChildren = () => {
    if (!infinite) return children;
    const duplicates = [];
    for (let i = 0; i < duplicateCount; i++) {
      duplicates.push(
        <div key={i} style={{ display: 'contents' }}>
          {children}
        </div>
      );
    }
    return duplicates;
  };

  return (
    <div
      className={className}
      data-up-node-id={nodeId}
      data-marquee-track="true"
      data-marquee-direction={direction}
      data-marquee-speed={speed}
      data-marquee-duration={duration}
      data-marquee-infinite={infinite || undefined}
      data-marquee-duplicate-count={duplicateCount}
      style={trackStyle}
      {...rest}
    >
      {renderChildren()}
    </div>
  );
}
MarqueeTrack.displayName = 'MarqueeTrack';
