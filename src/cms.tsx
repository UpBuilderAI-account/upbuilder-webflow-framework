/**
 * CMS/Dynamic components for Webflow Collection Lists
 */
import React, { createContext, useContext } from 'react';
import { useNodeID } from './node-id';
import { useCmsItems, useCmsFieldValue, useCmsCurrentItem, CmsItemProvider } from './cms-context';
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

// =============================================================================
// INTERNAL CONTEXT
// =============================================================================

interface CollectionContextValue {
  collectionSlug: string;
  limit?: number;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

function useCollectionContext() {
  return useContext(CollectionContext);
}

// =============================================================================
// TYPES
// =============================================================================

export type CMSFieldType = 'PlainText' | 'RichText' | 'Image' | 'MultiImage' | 'Video' | 'File' | 'Link' | 'Email' | 'Phone' | 'Number' | 'DateTime' | 'Switch' | 'Option' | 'Color' | 'Reference' | 'MultiReference';

export type FilterCondition = 'is' | 'is-not' | 'is-set' | 'is-not-set' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'less-than' | 'greater-than' | 'equals' | 'before-today' | 'after-today' | 'on' | 'before' | 'after';

export interface FilterRule { field: string; condition: FilterCondition; value?: string | number | boolean; }
export interface SortConfig { field: string; order: 'asc' | 'desc'; }

// =============================================================================
// DYNAMO WRAPPER
// =============================================================================

export interface DynamoWrapperProps extends AnimationProps {
  collection?: string;
  dynCollection?: string;
  limit?: number;
  dynLimit?: number;
  offset?: number;
  sort?: SortConfig;
  dynSort?: SortConfig;
  filters?: FilterRule[];
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoWrapper({ collection, dynCollection, limit, dynLimit, offset, sort, dynSort, filters, className, children, ...rest }: DynamoWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const col = collection || dynCollection || '';
  const lim = limit || dynLimit || 100;
  const srt = sort || dynSort;

  return (
    <CollectionContext.Provider value={{ collectionSlug: col, limit: lim }}>
      <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-up-cms-collection={col} data-dyn-collection={col} data-dyn-limit={lim} data-dyn-offset={offset} data-dyn-sort={srt ? JSON.stringify(srt) : undefined} data-dyn-filters={filters?.length ? JSON.stringify(filters) : undefined}>
        {children}
      </div>
    </CollectionContext.Provider>
  );
}

// =============================================================================
// DYNAMO LIST
// =============================================================================

export interface DynamoListProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoList({ className, children, ...rest }: DynamoListProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const collectionCtx = useCollectionContext();
  const items = useCmsItems(collectionCtx?.collectionSlug || '', collectionCtx?.limit);

  if (items.length > 0) {
    return (
      <div {...props} {...animAttrs} className={`${className || ''} w-dyn-items`.trim()} data-up-node-id={nodeId}>
        {items.map((item, index) => (
          <CmsItemProvider key={item.slug || item.id || index} collectionSlug={collectionCtx?.collectionSlug || ''} item={item} index={index}>
            {children}
          </CmsItemProvider>
        ))}
      </div>
    );
  }

  return <div {...props} {...animAttrs} className={`${className || ''} w-dyn-items`.trim()} data-up-node-id={nodeId}>{children}</div>;
}

// =============================================================================
// DYNAMO ITEM
// =============================================================================

export interface DynamoItemProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoItem({ className, children, ...rest }: DynamoItemProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={`${className || ''} w-dyn-item`.trim()} data-up-node-id={nodeId}>{children}</div>;
}

// =============================================================================
// DYNAMO EMPTY
// =============================================================================

export interface DynamoEmptyProps extends AnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoEmpty({ text, className, children, ...rest }: DynamoEmptyProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const collectionCtx = useCollectionContext();
  const items = useCmsItems(collectionCtx?.collectionSlug || '', collectionCtx?.limit);
  if (items.length > 0) return null;
  return <div {...props} {...animAttrs} className={`${className || ''} w-dyn-empty`.trim()} data-up-node-id={nodeId}>{children || text || 'No items found.'}</div>;
}

// =============================================================================
// FIELD BINDING COMPONENTS
// =============================================================================

export interface DynTextProps extends AnimationProps {
  field: string;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynText({ field, tag = 'span', fallback, className, children, ...rest }: DynTextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const Tag = tag as keyof JSX.IntrinsicElements;
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? fallback ?? `{${field}}`;
  return <Tag {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="PlainText">{displayValue}</Tag>;
}

export interface DynRichTextProps extends AnimationProps {
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynRichText({ field, className, children, ...rest }: DynRichTextProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? `{${field}}`;
  if (typeof displayValue === 'string' && displayValue.includes('<')) {
    return <div {...props} {...animAttrs} className={`${className || ''} w-richtext`.trim()} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="RichText" dangerouslySetInnerHTML={{ __html: displayValue }} />;
  }
  return <div {...props} {...animAttrs} className={`${className || ''} w-richtext`.trim()} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="RichText">{displayValue}</div>;
}

export interface DynImageProps extends AnimationProps {
  field: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  [key: string]: any;
}

export function DynImage({ field, alt, loading = 'lazy', className, ...rest }: DynImageProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const src = typeof value === 'string' ? value : value?.url || `/placeholder-${field}.jpg`;
  const imgAlt = alt || (typeof value === 'object' ? value?.alt : '') || '';
  return <img {...props} {...animAttrs} className={className} src={src} alt={imgAlt} loading={loading} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Image" />;
}

export interface DynVideoProps extends AnimationProps {
  field: string;
  className?: string;
  [key: string]: any;
}

export function DynVideo({ field, className, ...rest }: DynVideoProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const videoUrl = value || '';
  return (
    <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Video">
      {videoUrl ? <video src={videoUrl} controls style={{ width: '100%' }} /> : `Video: {${field}}`}
    </div>
  );
}

export interface DynLinkProps extends AnimationProps {
  field: string;
  newTab?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynLink({ field, newTab, className, children, ...rest }: DynLinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const href = typeof value === 'string' ? value : value?.url || '#';
  const displayText = children ?? (typeof value === 'object' ? value?.text : value) ?? `{${field}}`;
  return <a {...props} {...animAttrs} href={href} className={className} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Link">{displayText}</a>;
}

export interface DynSlugLinkProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynSlugLink({ className, children, ...rest }: DynSlugLinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const itemCtx = useCmsCurrentItem();
  const slug = itemCtx?.item?.slug || '#';
  const collection = itemCtx?.collectionSlug || '';
  const href = slug !== '#' ? `/${collection}/${slug}` : '#';
  return <a {...props} {...animAttrs} href={href} className={className} data-up-node-id={nodeId} data-dyn-bind="slug" data-dyn-type="FullSlug">{children}</a>;
}

export interface DynEmailProps extends AnimationProps {
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynEmail({ field, className, children, ...rest }: DynEmailProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const email = value || '';
  const href = email ? `mailto:${email}` : '#';
  const displayText = children ?? value ?? `{${field}}`;
  return <a {...props} {...animAttrs} href={href} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Email">{displayText}</a>;
}

export interface DynPhoneProps extends AnimationProps {
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynPhone({ field, className, children, ...rest }: DynPhoneProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const phone = value || '';
  const href = phone ? `tel:${phone.replace(/\s/g, '')}` : '#';
  const displayText = children ?? value ?? `{${field}}`;
  return <a {...props} {...animAttrs} href={href} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Phone">{displayText}</a>;
}

export interface DynFileProps extends AnimationProps {
  field: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynFile({ field, text, className, children, ...rest }: DynFileProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const href = typeof value === 'string' ? value : value?.url || '#';
  const fileName = typeof value === 'object' ? value?.name : undefined;
  return <a {...props} {...animAttrs} href={href} className={className} download={fileName} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="File">{children || text || fileName || 'Download'}</a>;
}

export interface DynDateProps extends AnimationProps {
  field: string;
  format?: 'short' | 'medium' | 'long' | 'full' | 'relative';
  customFormat?: string;
  className?: string;
  [key: string]: any;
}

export function DynDate({ field, format = 'medium', customFormat, className, ...rest }: DynDateProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  let displayValue = `{${field}}`;
  if (value) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
          short: { month: 'numeric', day: 'numeric', year: '2-digit' },
          medium: { month: 'short', day: 'numeric', year: 'numeric' },
          long: { month: 'long', day: 'numeric', year: 'numeric' },
          full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
        };
        displayValue = date.toLocaleDateString('en-US', formatOptions[format] || formatOptions.medium);
      }
    } catch { displayValue = String(value); }
  }
  return <time {...props} {...animAttrs} className={className} dateTime={value || undefined} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="DateTime" data-dyn-format={customFormat || format}>{displayValue}</time>;
}

export interface DynNumberProps extends AnimationProps {
  field: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  [key: string]: any;
}

export function DynNumber({ field, prefix, suffix, decimals, className, ...rest }: DynNumberProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  let displayValue: string;
  if (value !== undefined && value !== null) {
    const num = typeof value === 'number' ? value : parseFloat(value);
    displayValue = isNaN(num) ? String(value) : (decimals !== undefined ? num.toFixed(decimals) : String(num));
  } else { displayValue = `{${field}}`; }
  return <span {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Number" data-dyn-prefix={prefix} data-dyn-suffix={suffix} data-dyn-decimals={decimals}>{prefix || ''}{displayValue}{suffix || ''}</span>;
}

export interface DynColorProps extends AnimationProps {
  field: string;
  apply?: 'background' | 'text' | 'border';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynColor({ field, apply = 'background', className, children, ...rest }: DynColorProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const colorStyle: React.CSSProperties = {};
  if (value) {
    if (apply === 'background') colorStyle.backgroundColor = value;
    else if (apply === 'text') colorStyle.color = value;
    else if (apply === 'border') colorStyle.borderColor = value;
  }
  return <div {...props} {...animAttrs} className={className} style={{ ...rest.style, ...colorStyle }} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Color" data-dyn-apply={apply}>{children}</div>;
}

export interface DynOptionProps extends AnimationProps {
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynOption({ field, className, children, ...rest }: DynOptionProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? `{${field}}`;
  return <span {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Option">{displayValue}</span>;
}

export interface DynSwitchProps extends AnimationProps {
  field: string;
  showWhen?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynSwitch({ field, showWhen = true, className, children, ...rest }: DynSwitchProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  const value = useCmsFieldValue(field);
  if (value !== undefined) {
    const shouldShow = showWhen ? Boolean(value) : !Boolean(value);
    if (!shouldShow) return null;
  }
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Switch" data-dyn-show-when={showWhen}>{children}</div>;
}

export interface DynReferenceProps extends AnimationProps {
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynReference({ field, className, children, ...rest }: DynReferenceProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="Reference">{children}</div>;
}

export interface DynMultiReferenceProps extends AnimationProps {
  field: string;
  limit?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynMultiReference({ field, limit, className, children, ...rest }: DynMultiReferenceProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="MultiReference" data-dyn-limit={limit}><div className="w-dyn-items">{children}</div></div>;
}

export interface DynMultiImageProps extends AnimationProps {
  field: string;
  limit?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynMultiImage({ field, limit, className, children, ...rest }: DynMultiImageProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-bind={field} data-dyn-type="MultiImage" data-dyn-limit={limit}><div className="w-dyn-items">{children}</div></div>;
}

// =============================================================================
// PAGINATION
// =============================================================================

export interface DynPaginationProps extends AnimationProps {
  prevText?: string;
  nextText?: string;
  showNumbers?: boolean;
  className?: string;
  [key: string]: any;
}

export function DynPagination({ prevText = 'Previous', nextText = 'Next', showNumbers, className, ...rest }: DynPaginationProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId} data-dyn-pagination>
      <a href="#" className="w-pagination-previous">{prevText}</a>
      {showNumbers && <div className="w-pagination-numbers" />}
      <a href="#" className="w-pagination-next">{nextText}</a>
    </div>
  );
}

// =============================================================================
// SEARCH COMPONENTS
// =============================================================================

export interface SearchFormProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchForm({ className, children, ...rest }: SearchFormProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <form {...props} {...animAttrs} className={className} role="search" data-up-node-id={nodeId}>{children}</form>;
}

export interface SearchInputProps extends AnimationProps {
  name?: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export function SearchInput({ name = 'query', placeholder = 'Search...', className, ...rest }: SearchInputProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <input {...props} {...animAttrs} type="search" name={name} placeholder={placeholder} className={className} data-up-node-id={nodeId} />;
}

export interface SearchButtonProps extends AnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchButton({ text = 'Search', className, children, ...rest }: SearchButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <button {...props} {...animAttrs} type="submit" className={className} data-up-node-id={nodeId}>{children || text}</button>;
}

export function SearchResults({ className, children, ...rest }: DynamoListProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId}>{children}</div>;
}

// =============================================================================
// LIGHTBOX COMPONENTS
// =============================================================================

export interface LightboxItem { url: string; type?: 'image' | 'video'; caption?: string; thumbnail?: string; }

export interface LightboxWrapperProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  group?: string;
  items?: LightboxItem[];
  searchExclude?: boolean;
  [key: string]: any;
}

export function LightboxWrapper({ className, children, group, items, searchExclude, ...rest }: LightboxWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <a {...props} {...animAttrs} href="#" className={`${className || ''} w-lightbox`.trim()} data-lightbox-group={group} onClick={(e) => e.preventDefault()} data-up-node-id={nodeId}>{children}</a>;
}

export interface LightboxLinkProps extends AnimationProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
  [key: string]: any;
}

export function LightboxLink({ className, children, href = '#', ...rest }: LightboxLinkProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <a {...props} {...animAttrs} href={href} className={`${className || ''} w-lightbox-link`.trim()} data-up-node-id={nodeId}>{children}</a>;
}

// =============================================================================
// MAP WIDGET
// =============================================================================

export interface MapWidgetProps extends AnimationProps {
  apiKey?: string;
  address?: string;
  className?: string;
  [key: string]: any;
}

export function MapWidget({ apiKey, address, className, ...rest }: MapWidgetProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  if (!apiKey || !address) {
    return <div {...props} {...animAttrs} className={className} data-up-node-id={nodeId}>Map placeholder</div>;
  }
  const encodedAddress = encodeURIComponent(address);
  return <iframe {...props} {...animAttrs} className={className} src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`} style={{ border: 0, width: '100%', height: '100%' }} allowFullScreen loading="lazy" data-up-node-id={nodeId} />;
}
