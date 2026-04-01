/**
 * Typography components - local implementations
 */
import React from 'react';
import { useNodeID } from './node-id';

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

export interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  richText?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Heading({ as = 'h2', text, richText, className, children, ...props }: HeadingProps) {
  const nodeId = useNodeID();
  const Tag = as;
  return <Tag className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</Tag>;
}

export interface TextProps {
  text?: string;
  richText?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Paragraph({ text, richText, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <p className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</p>;
}

export function Span({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <span className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</span>;
}

export function Blockquote({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <blockquote className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</blockquote>;
}

export interface RichTextProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function RichText({ className, children, ...props }: RichTextProps) {
  const nodeId = useNodeID();
  return <div className={`${className || ''} w-richtext`} data-up-node-id={nodeId} {...props}>{children}</div>;
}

export function Figure({ className, children, ...props }: RichTextProps) {
  const nodeId = useNodeID();
  return <figure className={className} data-up-node-id={nodeId} {...props}>{children}</figure>;
}

export function Figcaption({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <figcaption className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</figcaption>;
}

export function Strong({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <strong className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</strong>;
}

export function Emphasized({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <em className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</em>;
}

export function Superscript({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <sup className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</sup>;
}

export function Subscript({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <sub className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</sub>;
}

export function InlineCode({ text, className, children, ...props }: TextProps) {
  const nodeId = useNodeID();
  return <code className={className} data-up-node-id={nodeId} {...props}>{children || renderTextWithBreaks(text)}</code>;
}

export interface LinkProps {
  href?: string;
  text?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Link({ href = '#', text, target, className, children, ...props }: LinkProps) {
  const nodeId = useNodeID();
  return (
    <a href={href} target={target} className={className} data-up-node-id={nodeId} {...props}>
      {children || renderTextWithBreaks(text)}
    </a>
  );
}

export function LinkBlock({ href = '#', target, className, children, ...props }: LinkProps) {
  const nodeId = useNodeID();
  return (
    <a href={href} target={target} className={`${className || ''} w-inline-block`} data-up-node-id={nodeId} {...props}>
      {children}
    </a>
  );
}

export function TextLink({ href = '#', text, target, className, children, ...props }: LinkProps) {
  const nodeId = useNodeID();
  return (
    <a href={href} target={target} className={className} data-up-node-id={nodeId} {...props}>
      {children || renderTextWithBreaks(text)}
    </a>
  );
}

export interface ButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Button({ text, type = 'button', className, children, ...props }: ButtonProps) {
  const nodeId = useNodeID();
  return (
    <button type={type} className={`${className || ''} w-button`} data-up-node-id={nodeId} {...props}>
      {children || renderTextWithBreaks(text)}
    </button>
  );
}
