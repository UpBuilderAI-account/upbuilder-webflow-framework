/**
 * Base components - local implementations
 */
import React from 'react';
import type { VideoSettings } from './types';
import { useNodeID } from './node-id';

export interface BlockProps {
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  animate?: string;
  [key: string]: any;
}

export function Block({ className, tag = 'div', children, animate, ...props }: BlockProps) {
  const nodeId = useNodeID();
  const Tag = tag as any;
  return (
    <Tag className={className} data-animate={animate} data-up-node-id={nodeId} {...props}>
      {children}
    </Tag>
  );
}

export function Section({ className, children, animate, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return (
    <section className={className} data-animate={animate} data-up-node-id={nodeId} {...props}>
      {children}
    </section>
  );
}

export function BlockContainer({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return <div className={className} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function Container({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-container`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function Clearfix({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-clearfix`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function InlineBlock({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function BlockLink({ className, children, ...props }: BlockProps) {
  const nodeId = useNodeID();
  return <a className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...props}>{children}</a>;
}

export interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}

export function Image({ src, alt = '', className, ...props }: ImageProps) {
  const nodeId = useNodeID();
  return <img src={src} alt={alt} className={className} loading="lazy" data-up-node-id={nodeId} {...props} />;
}

export interface VideoProps {
  videoUrl?: string;
  videoTitle?: string;
  className?: string;
  [key: string]: any;
}

export function Video({ videoUrl, videoTitle = 'Video', className, ...props }: VideoProps) {
  const nodeId = useNodeID();
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
    <div className={`${className || ''} w-video`} data-up-node-id={nodeId} {...props}>
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
 */
export function HamburgerIcon({ className, ...props }: { className?: string; [key: string]: any }) {
  const nodeId = useNodeID();
  return (
    <div className={`w-icon-nav-menu ${className || ''}`} data-up-node-id={nodeId} {...props}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </div>
  );
}

export interface HtmlEmbedProps {
  html?: string;
  className?: string;
  [key: string]: any;
}

export function HtmlEmbed({ html = '', className, ...props }: HtmlEmbedProps) {
  const nodeId = useNodeID();
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} data-up-node-id={nodeId} {...props} />;
}

export function LineBreak() {
  return <br />;
}

export interface ListProps {
  ordered?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function List({ ordered, className, children, ...props }: ListProps) {
  const nodeId = useNodeID();
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className={className} data-up-node-id={nodeId} {...props}>{children}</Tag>;
}

export function ListUnstyled({ className, children, ...props }: ListProps) {
  const nodeId = useNodeID();
  return <ul className={`${className || ''} w-list-unstyled`} data-up-node-id={nodeId} {...props}>{children}</ul>;
}

export interface ListItemProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function ListItem({ text, className, children, ...props }: ListItemProps) {
  const nodeId = useNodeID();
  return <li className={className} data-up-node-id={nodeId} {...props}>{children || text}</li>;
}

// Layout components
export interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Row({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-row`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function Column({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-col`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function Grid({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  return <div className={className} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function HFlex({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  return <div className={className} style={{ display: 'flex', flexDirection: 'row' }} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function VFlex({ className, children, ...props }: LayoutProps) {
  const nodeId = useNodeID();
  return <div className={className} style={{ display: 'flex', flexDirection: 'column' }} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export interface CodeBlockProps {
  code?: string;
  language?: string;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ code = '', language = '', className, ...props }: CodeBlockProps) {
  const nodeId = useNodeID();
  return (
    <pre className={className} data-up-node-id={nodeId} {...props}>
      <code className={language ? `language-${language}` : ''}>{code}</code>
    </pre>
  );
}

// Background video components
export interface BackgroundVideoWrapperProps {
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
  const s = { ...DEFAULT_VIDEO, ...settings };

  return (
    <div className={`${className || ''} w-background-video`} data-up-node-id={nodeId} {...props}>
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

export interface BackgroundVideoButtonProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function BackgroundVideoPlayPauseButton({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  return <div className={className} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function BackgroundVideoPlayPauseButtonPlaying({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  return <div className={className} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function BackgroundVideoPlayPauseButtonPaused({ className, children, ...props }: BackgroundVideoButtonProps) {
  const nodeId = useNodeID();
  return <div className={className} data-up-node-id={nodeId} {...props}>{children}</div>;
}
