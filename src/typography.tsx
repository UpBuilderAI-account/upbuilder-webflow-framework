/**
 * Typography components - local implementations
 */
import React from 'react';
import { useNodeID } from './node-id';
import type { AnimationEffect, AnimationEasing } from './types';

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

/**
 * Render text with newlines as <br /> elements
 */
function renderTextWithBreaks(text: string | undefined): React.ReactNode {
  if (!text) return null;
  if (!text.includes('\n')) return text;

  const parts = text.split('\n');
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

export interface HeadingProps extends AnimationProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  richText?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Heading({ as = 'h2', text, richText, className, children, ...rest }: HeadingProps) {
  const nodeId = useNodeID();
  const Tag = as;
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <Tag className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</Tag>;
}

export interface TextProps extends AnimationProps {
  text?: string;
  richText?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Paragraph({ text, richText, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <p className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</p>;
}

export function Span({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <span className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</span>;
}

export function Blockquote({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <blockquote className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</blockquote>;
}

export interface RichTextProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function RichText({ className, children, ...rest }: RichTextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div className={`${className || ''} w-richtext`} data-up-node-id={nodeId} {...animAttrs} {...props}>{children}</div>;
}

export function Figure({ className, children, ...rest }: RichTextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <figure className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children}</figure>;
}

export function Figcaption({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <figcaption className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</figcaption>;
}

export function Strong({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <strong className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</strong>;
}

export function Emphasized({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <em className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</em>;
}

export function Superscript({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <sup className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</sup>;
}

export function Subscript({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <sub className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</sub>;
}

export function InlineCode({ text, className, children, ...rest }: TextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <code className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>{children || renderTextWithBreaks(text)}</code>;
}

export interface LinkProps extends AnimationProps {
  href?: string;
  text?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Link({ href = '#', text, target, className, children, ...rest }: LinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <a href={href} target={target} className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>
      {children || renderTextWithBreaks(text)}
    </a>
  );
}

export function LinkBlock({ href = '#', target, className, children, ...rest }: LinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <a href={href} target={target} className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...animAttrs} {...props}>
      {children}
    </a>
  );
}

export function TextLink({ href = '#', text, target, className, children, ...rest }: LinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <a href={href} target={target} className={className} data-up-node-id={nodeId} {...animAttrs} {...props}>
      {children || renderTextWithBreaks(text)}
    </a>
  );
}

export interface ButtonProps extends AnimationProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Button({ text, type = 'button', className, children, ...rest }: ButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <button type={type} className={`${className || ''} w-button`} data-up-node-id={nodeId} {...animAttrs} {...props}>
      {children || renderTextWithBreaks(text)}
    </button>
  );
}
