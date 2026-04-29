/**
 * Base components - local implementations
 */
import React from 'react';
import type { VideoSettings, AnimationEffect, AnimationEasing } from './types';
import { useNodeID } from './node-id';
import { extractAnimationAttrs, omitAnimationProps, type UpAnimationProps } from './animations';

// Re-export animation types for convenience
export type { AnimationEffect, AnimationEasing, Ix3AnimationConfig, Ix3AnimationProps, Ix3Preset, Ix3Split, Ix3Trigger } from './types';

export interface BlockProps extends UpAnimationProps {
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  /** Scroll reveal animation - triggers when element scrolls into view */
  animate?: AnimationEffect;
  /** Hover animation - triggers on mouse enter/leave */
  animateHover?: AnimationEffect;
  /** Click animation - triggers on click (toggle) */
  animateClick?: AnimationEffect;
  /** Page load animation - triggers when page loads */
  animatePageLoad?: AnimationEffect;
  /** Animation delay in milliseconds */
  animateDelay?: number;
  /** Animation duration in milliseconds */
  animateDuration?: number;
  /** Animation easing function */
  animateEasing?: AnimationEasing;
  [key: string]: any;
}

export function Block({ className, tag = 'div', children, ...rest }: BlockProps) {
  const nodeId = useNodeID();
  const Tag = tag as any;
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <Tag
      className={className}
      data-up-node-id={nodeId}
      {...animAttrs}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Section({ className, children, ...rest }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <section
      className={className}
      data-up-node-id={nodeId}
      {...animAttrs}
      {...props}
    >
      {children}
    </section>
  );
}

export function BlockContainer({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function Container({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`${className || ''} w-container`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function Clearfix({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`${className || ''} w-clearfix`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function InlineBlock({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function BlockLink({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <a className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</a>;
}

export interface ImageProps extends UpAnimationProps {
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}

export function Image({ src, alt = '', className, ...props }: ImageProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <img src={src} alt={alt} className={className} loading="lazy" data-up-node-id={nodeId} {...animAttrs} {...rest} />;
}

export interface VideoProps extends UpAnimationProps {
  videoUrl?: string;
  videoTitle?: string;
  className?: string;
  [key: string]: any;
}

export function Video({ videoUrl, videoTitle = 'Video', className, ...props }: VideoProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  // Handle YouTube/Vimeo embeds
  let embedUrl = videoUrl || '';
  if (embedUrl.includes('youtube.com/watch')) {
    const videoId = embedUrl.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (embedUrl.includes('vimeo.com/')) {
    const videoId = embedUrl.split('vimeo.com/')[1]?.split('?')[0];
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  return (
    <div className={`${className || ''} w-video`} data-up-node-id={nodeId} {...animAttrs} {...rest}>
      <iframe
        src={embedUrl}
        title={videoTitle}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

/**
 * HamburgerIcon - Webflow's official nav-menu icon for hamburger menus
 * Uses CSS :before pseudo-element with Webflow's icon font
 */
export function HamburgerIcon({ className, ...props }: { className?: string; [key: string]: any } & UpAnimationProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return (
    <div className={`w-icon-nav-menu ${className || ''}`} data-up-node-id={nodeId} {...animAttrs} {...rest} />
  );
}

export interface HtmlEmbedProps extends UpAnimationProps {
  html?: string;
  className?: string;
  [key: string]: any;
}

export function HtmlEmbed({ html = '', className, ...props }: HtmlEmbedProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} data-up-node-id={nodeId} {...animAttrs} {...rest} />;
}

export function LineBreak() {
  return <br />;
}

export interface ListProps extends UpAnimationProps {
  ordered?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function List({ ordered, className, children, ...props }: ListProps) {
  const nodeId = useNodeID();
  const Tag = ordered ? 'ol' : 'ul';
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <Tag className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</Tag>;
}

export function ListUnstyled({ className, children, ...props }: ListProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <ul className={`${className || ''} w-list-unstyled`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</ul>;
}

export interface ListItemProps extends UpAnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function ListItem({ text, className, children, ...props }: ListItemProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <li className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children || text}</li>;
}

// Layout components
export interface LayoutProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Row({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`${className || ''} w-row`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function Column({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`${className || ''} w-col`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function Grid({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function HFlex({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`w-layout-hflex ${className || ''}`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function VFlex({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={`w-layout-vflex ${className || ''}`} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export interface CodeBlockProps extends UpAnimationProps {
  code?: string;
  language?: string;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ code = '', language = '', className, ...props }: CodeBlockProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return (
    <pre className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>
      <code className={language ? `language-${language}` : ''}>{code}</code>
    </pre>
  );
}

// Background video components
export interface BackgroundVideoWrapperProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  videoUrl?: string;
  settings?: VideoSettings;
  [key: string]: any;
}

const DEFAULT_VIDEO: Required<Omit<VideoSettings, 'poster'>> & { poster?: string } = {
  autoplay: true,
  loop: true,
  muted: true,
  controls: false,
  poster: undefined,
};

export function BackgroundVideoWrapper({ className, children, videoUrl, settings, ...props }: BackgroundVideoWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  const s = { ...DEFAULT_VIDEO, ...settings };

  return (
    <div className={`${className || ''} w-background-video`} data-up-node-id={nodeId} {...animAttrs} {...rest}>
      {videoUrl && (
        <video
          autoPlay={s.autoplay}
          muted={s.muted}
          loop={s.loop}
          controls={s.controls}
          playsInline
          poster={s.poster}
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute' }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {children}
    </div>
  );
}

export interface BackgroundVideoButtonProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function BackgroundVideoPlayPauseButton({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function BackgroundVideoPlayPauseButtonPlaying({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}

export function BackgroundVideoPlayPauseButtonPaused({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(props);
  const rest = omitAnimationProps(props);
  return <div className={className} data-up-node-id={nodeId} {...animAttrs} {...rest}>{children}</div>;
}
