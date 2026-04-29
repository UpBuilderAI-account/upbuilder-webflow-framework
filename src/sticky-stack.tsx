/**
 * StickyStackSection - generic sticky intro + stacked sticky cards layout.
 *
 * This is a layout primitive, not a feature-specific section. Use it for
 * features, services, process steps, pricing notes, testimonials, FAQs, etc.
 */
import React, { useEffect } from 'react';
import { useNodeID } from './node-id';
import { extractAnimationAttrs, omitAnimationProps, type UpAnimationProps } from './animations';

type CssLength = string | number;

export interface StickyStackSectionProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  columns?: string;
  gap?: CssLength;
  padding?: CssLength;
  minHeight?: CssLength;
  introFraction?: number;
  cardsFraction?: number;
  stackBreakpoint?: number;
  mobilePadding?: CssLength;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface StickyStackIntroProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  stickyTop?: CssLength;
  maxWidth?: CssLength;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface StickyStackCardsProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  maxWidth?: CssLength;
  gap?: CssLength;
  align?: 'start' | 'end' | 'stretch';
  baseTop?: number;
  offsetStep?: number;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface StickyStackCardProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  stickyTop?: CssLength;
  height?: CssLength;
  minHeight?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  background?: string;
  hoverBackground?: string;
  border?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const STYLE_ID = 'up-sticky-stack-styles';

function cssValue(value: CssLength | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function injectStickyStackStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .up-sticky-stack-section {
      position: relative;
      display: grid;
      grid-template-columns: var(--up-sticky-stack-columns, minmax(0, 1fr) minmax(0, 1fr));
      gap: var(--up-sticky-stack-gap, 20px);
      align-items: start;
      min-height: var(--up-sticky-stack-min-height, auto);
      padding: var(--up-sticky-stack-padding, 120px 2%);
    }
    .up-sticky-stack-intro {
      position: sticky;
      top: var(--up-sticky-stack-intro-top, 100px);
      max-width: var(--up-sticky-stack-intro-max, 90%);
    }
    .up-sticky-stack-cards {
      display: flex;
      flex-direction: column;
      gap: var(--up-sticky-stack-card-gap, 20px);
      width: 100%;
      max-width: var(--up-sticky-stack-cards-max, 420px);
    }
    .up-sticky-stack-cards[data-align="end"] {
      margin-left: auto;
    }
    .up-sticky-stack-card {
      position: sticky;
      top: var(--up-sticky-stack-card-top, 100px);
      height: var(--up-sticky-stack-card-height, auto);
      min-height: var(--up-sticky-stack-card-min-height, 350px);
      padding: var(--up-sticky-stack-card-padding, 25px);
      border: var(--up-sticky-stack-card-border, 1px solid rgba(255,255,255,0.16));
      border-radius: var(--up-sticky-stack-card-radius, 8px);
      background: var(--up-sticky-stack-card-bg, transparent);
      transition: background-color 200ms ease, border-color 200ms ease, transform 200ms ease;
    }
    .up-sticky-stack-card:hover {
      background: var(--up-sticky-stack-card-hover-bg, var(--up-sticky-stack-card-bg, transparent));
    }
  `;
  document.head.appendChild(style);
}

function injectStickyStackResponsiveStyle(scopeClass: string, breakpoint: number): void {
  if (typeof document === 'undefined') return;
  const styleId = `up-sticky-stack-responsive-${scopeClass}`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @media (max-width: ${breakpoint}px) {
      .${scopeClass} {
        grid-template-columns: 1fr;
        padding: var(--up-sticky-stack-mobile-padding, 64px 20px);
      }
      .${scopeClass} .up-sticky-stack-intro,
      .${scopeClass} .up-sticky-stack-card {
        position: relative;
        top: auto;
      }
      .${scopeClass} .up-sticky-stack-intro,
      .${scopeClass} .up-sticky-stack-cards {
        max-width: 100%;
        margin-left: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export function StickyStackSection({
  className,
  children,
  tag = 'section',
  columns,
  gap = 20,
  padding = '120px 2%',
  minHeight,
  introFraction = 1,
  cardsFraction = 1,
  stackBreakpoint = 767,
  mobilePadding = '64px 20px',
  style,
  ...rest
}: StickyStackSectionProps) {
  const nodeId = useNodeID();
  const scopeClass = `up-sticky-stack-${React.useId().replace(/:/g, '')}`;
  useEffect(() => {
    injectStickyStackStyles();
    injectStickyStackResponsiveStyle(scopeClass, stackBreakpoint);
  }, [scopeClass, stackBreakpoint]);

  const Tag = tag as any;
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const resolvedColumns = columns || `minmax(0, ${introFraction}fr) minmax(0, ${cardsFraction}fr)`;

  const sectionStyle = {
    '--up-sticky-stack-columns': resolvedColumns,
    '--up-sticky-stack-gap': cssValue(gap),
    '--up-sticky-stack-padding': cssValue(padding),
    '--up-sticky-stack-mobile-padding': cssValue(mobilePadding),
    '--up-sticky-stack-min-height': cssValue(minHeight),
    ...style,
  } as React.CSSProperties;

  return (
    <Tag
      className={`up-sticky-stack-section ${scopeClass}${className ? ` ${className}` : ''}`}
      data-up-node-id={nodeId}
      data-sticky-stack="section"
      style={sectionStyle}
      {...animAttrs}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function StickyStackIntro({
  className,
  children,
  stickyTop = 100,
  maxWidth = '90%',
  style,
  ...rest
}: StickyStackIntroProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const introStyle = {
    '--up-sticky-stack-intro-top': cssValue(stickyTop),
    '--up-sticky-stack-intro-max': cssValue(maxWidth),
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={`up-sticky-stack-intro${className ? ` ${className}` : ''}`}
      data-up-node-id={nodeId}
      data-sticky-stack="intro"
      style={introStyle}
      {...animAttrs}
      {...props}
    >
      {children}
    </div>
  );
}

export function StickyStackCards({
  className,
  children,
  maxWidth = 420,
  gap = 20,
  align = 'end',
  baseTop = 100,
  offsetStep = 20,
  style,
  ...rest
}: StickyStackCardsProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const cardsStyle = {
    '--up-sticky-stack-cards-max': cssValue(maxWidth),
    '--up-sticky-stack-card-gap': cssValue(gap),
    ...style,
  } as React.CSSProperties;

  const renderedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    const childProps = child.props as StickyStackCardProps;
    if (childProps.stickyTop !== undefined) return child;
    return React.cloneElement(child as React.ReactElement<StickyStackCardProps>, {
      stickyTop: baseTop + index * offsetStep,
    });
  });

  return (
    <div
      className={`up-sticky-stack-cards${className ? ` ${className}` : ''}`}
      data-up-node-id={nodeId}
      data-sticky-stack="cards"
      data-align={align}
      style={cardsStyle}
      {...animAttrs}
      {...props}
    >
      {renderedChildren}
    </div>
  );
}

export function StickyStackCard({
  className,
  children,
  stickyTop = 100,
  height,
  minHeight = 350,
  padding = 25,
  radius = 8,
  background = 'transparent',
  hoverBackground,
  border = '1px solid rgba(255,255,255,0.16)',
  style,
  ...rest
}: StickyStackCardProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const cardStyle = {
    '--up-sticky-stack-card-top': cssValue(stickyTop),
    '--up-sticky-stack-card-height': cssValue(height),
    '--up-sticky-stack-card-min-height': cssValue(minHeight),
    '--up-sticky-stack-card-padding': cssValue(padding),
    '--up-sticky-stack-card-radius': cssValue(radius),
    '--up-sticky-stack-card-bg': background,
    '--up-sticky-stack-card-hover-bg': hoverBackground || background,
    '--up-sticky-stack-card-border': border,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={`up-sticky-stack-card${className ? ` ${className}` : ''}`}
      data-up-node-id={nodeId}
      data-sticky-stack="card"
      style={cardStyle}
      {...animAttrs}
      {...props}
    >
      {children}
    </div>
  );
}

StickyStackSection.displayName = 'StickyStackSection';
StickyStackIntro.displayName = 'StickyStackIntro';
StickyStackCards.displayName = 'StickyStackCards';
StickyStackCard.displayName = 'StickyStackCard';
