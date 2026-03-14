/**
 * CMS/Dynamic components - local implementations
 */
import React from 'react';
import { useNodeID } from './node-id';

export interface DynamoWrapperProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoWrapper({ className, children, ...rest }: DynamoWrapperProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={className} data-up-node-id={nodeId}>{children}</div>;
}

export function DynamoList({ className, children, ...rest }: DynamoWrapperProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={`${className || ''} w-dyn-items`} data-up-node-id={nodeId}>{children}</div>;
}

export function DynamoItem({ className, children, ...rest }: DynamoWrapperProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={`${className || ''} w-dyn-item`} data-up-node-id={nodeId}>{children}</div>;
}

export interface DynamoEmptyProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoEmpty({ text, className, children, ...rest }: DynamoEmptyProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={`${className || ''} w-dyn-empty`} data-up-node-id={nodeId}>{children || text || 'No items found.'}</div>;
}

export interface SearchFormProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchForm({ className, children, ...rest }: SearchFormProps) {
  const nodeId = useNodeID();
  return <form {...rest} className={className} role="search" data-up-node-id={nodeId}>{children}</form>;
}

export interface SearchInputProps {
  name?: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export function SearchInput({ name = 'query', placeholder = 'Search...', className, ...rest }: SearchInputProps) {
  const nodeId = useNodeID();
  return <input {...rest} type="search" name={name} placeholder={placeholder} className={className} data-up-node-id={nodeId} />;
}

export interface SearchButtonProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchButton({ text = 'Search', className, children, ...rest }: SearchButtonProps) {
  const nodeId = useNodeID();
  return <button {...rest} type="submit" className={className} data-up-node-id={nodeId}>{children || text}</button>;
}

export function SearchResults({ className, children, ...rest }: DynamoWrapperProps) {
  const nodeId = useNodeID();
  return <div {...rest} className={className} data-up-node-id={nodeId}>{children}</div>;
}

export interface LightboxItem {
  url: string;
  type?: 'image' | 'video';
  caption?: string;
  thumbnail?: string;
}

export interface LightboxWrapperProps {
  className?: string;
  children?: React.ReactNode;
  /** Lightbox group name - items with same group can be navigated together */
  group?: string;
  /** Media items to show in lightbox (images/videos) */
  items?: LightboxItem[];
  /** Exclude from site search */
  searchExclude?: boolean;
  [key: string]: any;
}

export function LightboxWrapper({ className, children, group, items, searchExclude, ...rest }: LightboxWrapperProps) {
  const nodeId = useNodeID();
  // In React preview, just render as clickable - lightbox behavior handled by Webflow
  return (
    <a
      {...rest}
      href="#"
      className={`${className || ''} w-lightbox`}
      data-lightbox-group={group}
      onClick={(e) => e.preventDefault()}
      data-up-node-id={nodeId}
    >
      {children}
    </a>
  );
}

export interface LightboxLinkProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
  [key: string]: any;
}

export function LightboxLink({ className, children, href = '#', ...rest }: LightboxLinkProps) {
  const nodeId = useNodeID();
  return (
    <a {...rest} href={href} className={`${className || ''} w-lightbox-link`} data-up-node-id={nodeId}>
      {children}
    </a>
  );
}

export interface MapWidgetProps {
  apiKey?: string;
  address?: string;
  className?: string;
  [key: string]: any;
}

export function MapWidget({ apiKey, address, className, ...rest }: MapWidgetProps) {
  const nodeId = useNodeID();
  if (!apiKey || !address) return <div {...rest} className={className} data-up-node-id={nodeId}>Map placeholder</div>;

  const encodedAddress = encodeURIComponent(address);
  return (
    <iframe
      {...rest}
      className={className}
      src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
      style={{ border: 0, width: '100%', height: '100%' }}
      allowFullScreen
      loading="lazy"
      data-up-node-id={nodeId}
    />
  );
}
