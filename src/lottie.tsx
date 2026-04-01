/**
 * Lottie Animation component
 * Renders dotLottie animations from .json or .lottie files
 * Uses @dotlottie/player-component web component
 */
import React from 'react';
import { useNodeID } from './node-id';

export interface LottieProps {
  /** URL to the Lottie animation file (.json or .lottie) */
  src: string;
  /** Whether to loop the animation (default: true) */
  loop?: boolean;
  /** Whether to autoplay the animation (default: true) */
  autoplay?: boolean;
  /** Play animation in reverse */
  reverse?: boolean;
  /** Renderer type: 'svg' (default) or 'canvas' */
  renderer?: 'svg' | 'canvas';
  /** CSS class name */
  className?: string;
  /** Additional props */
  [key: string]: any;
}

// Extend JSX to recognize dotlottie-player
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          autoplay?: boolean;
          loop?: boolean;
          direction?: string;
          renderer?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * Lottie component using dotlottie-player web component
 * Supports both .json and .lottie (dotLottie) formats
 */
export function Lottie({
  src,
  loop = true,
  autoplay = true,
  reverse = false,
  renderer = 'svg',
  className,
  style,
  ...props
}: LottieProps) {
  const nodeId = useNodeID();

  return (
    <dotlottie-player
      src={src}
      autoplay={autoplay}
      loop={loop}
      direction={reverse ? '-1' : '1'}
      renderer={renderer}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
      data-up-node-id={nodeId}
      {...props}
    />
  );
}
