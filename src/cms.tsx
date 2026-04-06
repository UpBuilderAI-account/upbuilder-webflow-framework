/**
 * CMS/Dynamic components for Webflow Collection Lists
 *
 * Structure:
 *   DynamoWrapper (binds to collection)
 *   ├── DynamoList (w-dyn-items container)
 *   │   └── DynamoItem (w-dyn-item, repeated)
 *   │       └── [Field binding components]
 *   └── DynamoEmpty (w-dyn-empty fallback)
 *
 * In preview: Components read from CmsProvider context to display sample data.
 * In Webflow: Components render with data-dyn-* hints for post-paste binding.
 */
import React, { createContext, useContext } from 'react';
import { useNodeID } from './node-id';
import { useCmsItems, useCmsFieldValue, useCmsCurrentItem, CmsItemProvider } from './cms-context';

// =============================================================================
// INTERNAL CONTEXT - passes collection info from DynamoWrapper to DynamoList
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

/** CMS field types supported by Webflow */
export type CMSFieldType =
  | 'PlainText'
  | 'RichText'
  | 'Image'
  | 'MultiImage'
  | 'Video'
  | 'File'
  | 'Link'
  | 'Email'
  | 'Phone'
  | 'Number'
  | 'DateTime'
  | 'Switch'
  | 'Option'
  | 'Color'
  | 'Reference'
  | 'MultiReference';

/** Filter conditions for collection queries */
export type FilterCondition =
  | 'is'
  | 'is-not'
  | 'is-set'
  | 'is-not-set'
  | 'contains'
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'less-than'
  | 'greater-than'
  | 'equals'
  | 'before-today'
  | 'after-today'
  | 'on'
  | 'before'
  | 'after';

/** Single filter rule */
export interface FilterRule {
  field: string;
  condition: FilterCondition;
  value?: string | number | boolean;
}

/** Sort configuration */
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

// =============================================================================
// DYNAMO WRAPPER - Collection binding
// =============================================================================

export interface DynamoWrapperProps {
  /** Collection slug to bind to */
  collection?: string;
  /** Alias for collection */
  dynCollection?: string;
  /** Max items to display (default: 100, max: 100) */
  limit?: number;
  /** Alias for limit */
  dynLimit?: number;
  /** Skip items for pagination */
  offset?: number;
  /** Sort configuration */
  sort?: SortConfig;
  /** Alias for sort */
  dynSort?: SortConfig;
  /** Filter rules */
  filters?: FilterRule[];
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoWrapper({
  collection,
  dynCollection,
  limit,
  dynLimit,
  offset,
  sort,
  dynSort,
  filters,
  className,
  children,
  ...rest
}: DynamoWrapperProps) {
  const nodeId = useNodeID();
  const col = collection || dynCollection || '';
  const lim = limit || dynLimit || 100;
  const srt = sort || dynSort;

  return (
    <CollectionContext.Provider value={{ collectionSlug: col, limit: lim }}>
      <div
        {...rest}
        className={className}
        data-up-node-id={nodeId}
        data-up-cms-collection={col}
        data-dyn-collection={col}
        data-dyn-limit={lim}
        data-dyn-offset={offset}
        data-dyn-sort={srt ? JSON.stringify(srt) : undefined}
        data-dyn-filters={filters?.length ? JSON.stringify(filters) : undefined}
      >
        {children}
      </div>
    </CollectionContext.Provider>
  );
}

// =============================================================================
// DYNAMO LIST - Items container
// =============================================================================

export interface DynamoListProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoList({ className, children, ...rest }: DynamoListProps) {
  const nodeId = useNodeID();
  const collectionCtx = useCollectionContext();
  const items = useCmsItems(collectionCtx?.collectionSlug || '', collectionCtx?.limit);

  // If we have CMS data, iterate over items
  if (items.length > 0) {
    return (
      <div
        {...rest}
        className={`${className || ''} w-dyn-items`.trim()}
        data-up-node-id={nodeId}
      >
        {items.map((item, index) => (
          <CmsItemProvider
            key={item.slug || item.id || index}
            collectionSlug={collectionCtx?.collectionSlug || ''}
            item={item}
            index={index}
          >
            {children}
          </CmsItemProvider>
        ))}
      </div>
    );
  }

  // No CMS data - render children as-is (single template item with placeholders)
  return (
    <div
      {...rest}
      className={`${className || ''} w-dyn-items`.trim()}
      data-up-node-id={nodeId}
    >
      {children}
    </div>
  );
}

// =============================================================================
// DYNAMO ITEM - Single item template
// =============================================================================

export interface DynamoItemProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoItem({ className, children, ...rest }: DynamoItemProps) {
  const nodeId = useNodeID();
  return (
    <div
      {...rest}
      className={`${className || ''} w-dyn-item`.trim()}
      data-up-node-id={nodeId}
    >
      {children}
    </div>
  );
}

// =============================================================================
// DYNAMO EMPTY - No items fallback
// =============================================================================

export interface DynamoEmptyProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynamoEmpty({ text, className, children, ...rest }: DynamoEmptyProps) {
  const nodeId = useNodeID();
  const collectionCtx = useCollectionContext();
  const items = useCmsItems(collectionCtx?.collectionSlug || '', collectionCtx?.limit);

  // If we have CMS data with items, don't render empty state
  if (items.length > 0) {
    return null;
  }

  return (
    <div
      {...rest}
      className={`${className || ''} w-dyn-empty`.trim()}
      data-up-node-id={nodeId}
    >
      {children || text || 'No items found.'}
    </div>
  );
}

// =============================================================================
// FIELD BINDING COMPONENTS
// =============================================================================

// -----------------------------------------------------------------------------
// DynText - PlainText field binding
// -----------------------------------------------------------------------------

export interface DynTextProps {
  /** CMS field slug to bind */
  field: string;
  /** HTML tag to render */
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';
  /** Fallback text if field is empty */
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynText({ field, tag = 'span', fallback, className, children, ...rest }: DynTextProps) {
  const nodeId = useNodeID();
  const Tag = tag as keyof JSX.IntrinsicElements;
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? fallback ?? `{${field}}`;

  return (
    <Tag
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="PlainText"
    >
      {displayValue}
    </Tag>
  );
}

// -----------------------------------------------------------------------------
// DynRichText - RichText field binding (HTML content)
// -----------------------------------------------------------------------------

export interface DynRichTextProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynRichText({ field, className, children, ...rest }: DynRichTextProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? `{${field}}`;

  // If value is HTML string, render it dangerously (for preview)
  if (typeof displayValue === 'string' && displayValue.includes('<')) {
    return (
      <div
        {...rest}
        className={`${className || ''} w-richtext`.trim()}
        data-up-node-id={nodeId}
        data-dyn-bind={field}
        data-dyn-type="RichText"
        dangerouslySetInnerHTML={{ __html: displayValue }}
      />
    );
  }

  return (
    <div
      {...rest}
      className={`${className || ''} w-richtext`.trim()}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="RichText"
    >
      {displayValue}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynImage - Image field binding
// -----------------------------------------------------------------------------

export interface DynImageProps {
  /** CMS field slug to bind */
  field: string;
  /** Alt text (or bind to field with {fieldname}) */
  alt?: string;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  className?: string;
  [key: string]: any;
}

export function DynImage({ field, alt, loading = 'lazy', className, ...rest }: DynImageProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  // Value can be a URL string or an object { url, alt }
  const src = typeof value === 'string' ? value : value?.url || `/placeholder-${field}.jpg`;
  const imgAlt = alt || (typeof value === 'object' ? value?.alt : '') || '';

  return (
    <img
      {...rest}
      className={className}
      src={src}
      alt={imgAlt}
      loading={loading}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Image"
    />
  );
}

// -----------------------------------------------------------------------------
// DynVideo - Video field binding
// -----------------------------------------------------------------------------

export interface DynVideoProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  [key: string]: any;
}

export function DynVideo({ field, className, ...rest }: DynVideoProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  const videoUrl = value || '';

  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Video"
    >
      {videoUrl ? (
        <video src={videoUrl} controls style={{ width: '100%' }} />
      ) : (
        `Video: {${field}}`
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynLink - Link/URL field binding
// -----------------------------------------------------------------------------

export interface DynLinkProps {
  /** CMS field slug to bind */
  field: string;
  /** Open in new tab */
  newTab?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynLink({ field, newTab, className, children, ...rest }: DynLinkProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  // Value can be a URL string or an object { url, text }
  const href = typeof value === 'string' ? value : value?.url || '#';
  const displayText = children ?? (typeof value === 'object' ? value?.text : value) ?? `{${field}}`;

  return (
    <a
      {...rest}
      href={href}
      className={className}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Link"
    >
      {displayText}
    </a>
  );
}

// -----------------------------------------------------------------------------
// DynSlugLink - Link to collection item page (uses slug)
// -----------------------------------------------------------------------------

export interface DynSlugLinkProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynSlugLink({ className, children, ...rest }: DynSlugLinkProps) {
  const nodeId = useNodeID();
  const itemCtx = useCmsCurrentItem();
  const slug = itemCtx?.item?.slug || '#';
  const collection = itemCtx?.collectionSlug || '';
  // Build a preview-friendly URL
  const href = slug !== '#' ? `/${collection}/${slug}` : '#';

  return (
    <a
      {...rest}
      href={href}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind="slug"
      data-dyn-type="FullSlug"
    >
      {children}
    </a>
  );
}

// -----------------------------------------------------------------------------
// DynEmail - Email field binding (mailto: link)
// -----------------------------------------------------------------------------

export interface DynEmailProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynEmail({ field, className, children, ...rest }: DynEmailProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  const email = value || '';
  const href = email ? `mailto:${email}` : '#';
  const displayText = children ?? value ?? `{${field}}`;

  return (
    <a
      {...rest}
      href={href}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Email"
    >
      {displayText}
    </a>
  );
}

// -----------------------------------------------------------------------------
// DynPhone - Phone field binding (tel: link)
// -----------------------------------------------------------------------------

export interface DynPhoneProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynPhone({ field, className, children, ...rest }: DynPhoneProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  const phone = value || '';
  const href = phone ? `tel:${phone.replace(/\s/g, '')}` : '#';
  const displayText = children ?? value ?? `{${field}}`;

  return (
    <a
      {...rest}
      href={href}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Phone"
    >
      {displayText}
    </a>
  );
}

// -----------------------------------------------------------------------------
// DynFile - File field binding (download link)
// -----------------------------------------------------------------------------

export interface DynFileProps {
  /** CMS field slug to bind */
  field: string;
  /** Link text */
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynFile({ field, text, className, children, ...rest }: DynFileProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  // Value can be URL string or { url, name } object
  const href = typeof value === 'string' ? value : value?.url || '#';
  const fileName = typeof value === 'object' ? value?.name : undefined;

  return (
    <a
      {...rest}
      href={href}
      className={className}
      download={fileName}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="File"
    >
      {children || text || fileName || 'Download'}
    </a>
  );
}

// -----------------------------------------------------------------------------
// DynDate - DateTime field binding
// -----------------------------------------------------------------------------

export interface DynDateProps {
  /** CMS field slug to bind */
  field: string;
  /** Date format preset */
  format?: 'short' | 'medium' | 'long' | 'full' | 'relative';
  /** Custom format string (e.g., "MMM D, YYYY") */
  customFormat?: string;
  className?: string;
  [key: string]: any;
}

export function DynDate({ field, format = 'medium', customFormat, className, ...rest }: DynDateProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);

  // Format date for display
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
    } catch {
      displayValue = String(value);
    }
  }

  return (
    <time
      {...rest}
      className={className}
      dateTime={value || undefined}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="DateTime"
      data-dyn-format={customFormat || format}
    >
      {displayValue}
    </time>
  );
}

// -----------------------------------------------------------------------------
// DynNumber - Number field binding
// -----------------------------------------------------------------------------

export interface DynNumberProps {
  /** CMS field slug to bind */
  field: string;
  /** Prefix text (e.g., "$") */
  prefix?: string;
  /** Suffix text (e.g., "%") */
  suffix?: string;
  /** Decimal places */
  decimals?: number;
  className?: string;
  [key: string]: any;
}

export function DynNumber({ field, prefix, suffix, decimals, className, ...rest }: DynNumberProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);

  let displayValue: string;
  if (value !== undefined && value !== null) {
    const num = typeof value === 'number' ? value : parseFloat(value);
    displayValue = isNaN(num) ? String(value) : (decimals !== undefined ? num.toFixed(decimals) : String(num));
  } else {
    displayValue = `{${field}}`;
  }

  return (
    <span
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Number"
      data-dyn-prefix={prefix}
      data-dyn-suffix={suffix}
      data-dyn-decimals={decimals}
    >
      {prefix || ''}{displayValue}{suffix || ''}
    </span>
  );
}

// -----------------------------------------------------------------------------
// DynColor - Color field binding
// -----------------------------------------------------------------------------

export interface DynColorProps {
  /** CMS field slug to bind */
  field: string;
  /** Where to apply the color */
  apply?: 'background' | 'text' | 'border';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynColor({ field, apply = 'background', className, children, ...rest }: DynColorProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);

  // Build inline style based on color value and apply type
  const colorStyle: React.CSSProperties = {};
  if (value) {
    switch (apply) {
      case 'background':
        colorStyle.backgroundColor = value;
        break;
      case 'text':
        colorStyle.color = value;
        break;
      case 'border':
        colorStyle.borderColor = value;
        break;
    }
  }

  return (
    <div
      {...rest}
      className={className}
      style={{ ...rest.style, ...colorStyle }}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Color"
      data-dyn-apply={apply}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynOption - Option/Select field binding
// -----------------------------------------------------------------------------

export interface DynOptionProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynOption({ field, className, children, ...rest }: DynOptionProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);
  const displayValue = value ?? children ?? `{${field}}`;

  return (
    <span
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Option"
    >
      {displayValue}
    </span>
  );
}

// -----------------------------------------------------------------------------
// DynSwitch - Switch/Boolean field for conditional visibility
// -----------------------------------------------------------------------------

export interface DynSwitchProps {
  /** CMS field slug to bind */
  field: string;
  /** Show when field is true or false */
  showWhen?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynSwitch({ field, showWhen = true, className, children, ...rest }: DynSwitchProps) {
  const nodeId = useNodeID();
  const value = useCmsFieldValue(field);

  // If we have CMS data, conditionally render based on switch value
  if (value !== undefined) {
    const shouldShow = showWhen ? Boolean(value) : !Boolean(value);
    if (!shouldShow) {
      return null;
    }
  }

  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Switch"
      data-dyn-show-when={showWhen}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynReference - Single reference field (nested item)
// -----------------------------------------------------------------------------

export interface DynReferenceProps {
  /** CMS field slug to bind */
  field: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynReference({ field, className, children, ...rest }: DynReferenceProps) {
  const nodeId = useNodeID();
  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="Reference"
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynMultiReference - Multi-reference field (nested list)
// -----------------------------------------------------------------------------

export interface DynMultiReferenceProps {
  /** CMS field slug to bind */
  field: string;
  /** Max items from reference */
  limit?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynMultiReference({ field, limit, className, children, ...rest }: DynMultiReferenceProps) {
  const nodeId = useNodeID();
  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="MultiReference"
      data-dyn-limit={limit}
    >
      <div className="w-dyn-items">{children}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// DynMultiImage - Multi-image field (image gallery)
// -----------------------------------------------------------------------------

export interface DynMultiImageProps {
  /** CMS field slug to bind */
  field: string;
  /** Max images to show */
  limit?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function DynMultiImage({ field, limit, className, children, ...rest }: DynMultiImageProps) {
  const nodeId = useNodeID();
  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-bind={field}
      data-dyn-type="MultiImage"
      data-dyn-limit={limit}
    >
      <div className="w-dyn-items">{children}</div>
    </div>
  );
}

// =============================================================================
// PAGINATION
// =============================================================================

export interface DynPaginationProps {
  /** Previous button text */
  prevText?: string;
  /** Next button text */
  nextText?: string;
  /** Show page numbers */
  showNumbers?: boolean;
  className?: string;
  [key: string]: any;
}

export function DynPagination({
  prevText = 'Previous',
  nextText = 'Next',
  showNumbers,
  className,
  ...rest
}: DynPaginationProps) {
  const nodeId = useNodeID();
  return (
    <div
      {...rest}
      className={className}
      data-up-node-id={nodeId}
      data-dyn-pagination
    >
      <a href="#" className="w-pagination-previous">
        {prevText}
      </a>
      {showNumbers && <div className="w-pagination-numbers" />}
      <a href="#" className="w-pagination-next">
        {nextText}
      </a>
    </div>
  );
}

// =============================================================================
// SEARCH COMPONENTS
// =============================================================================

export interface SearchFormProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchForm({ className, children, ...rest }: SearchFormProps) {
  const nodeId = useNodeID();
  return (
    <form {...rest} className={className} role="search" data-up-node-id={nodeId}>
      {children}
    </form>
  );
}

export interface SearchInputProps {
  name?: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export function SearchInput({ name = 'query', placeholder = 'Search...', className, ...rest }: SearchInputProps) {
  const nodeId = useNodeID();
  return (
    <input
      {...rest}
      type="search"
      name={name}
      placeholder={placeholder}
      className={className}
      data-up-node-id={nodeId}
    />
  );
}

export interface SearchButtonProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function SearchButton({ text = 'Search', className, children, ...rest }: SearchButtonProps) {
  const nodeId = useNodeID();
  return (
    <button {...rest} type="submit" className={className} data-up-node-id={nodeId}>
      {children || text}
    </button>
  );
}

export function SearchResults({ className, children, ...rest }: DynamoListProps) {
  const nodeId = useNodeID();
  return (
    <div {...rest} className={className} data-up-node-id={nodeId}>
      {children}
    </div>
  );
}

// =============================================================================
// LIGHTBOX COMPONENTS
// =============================================================================

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
  return (
    <a
      {...rest}
      href="#"
      className={`${className || ''} w-lightbox`.trim()}
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
    <a {...rest} href={href} className={`${className || ''} w-lightbox-link`.trim()} data-up-node-id={nodeId}>
      {children}
    </a>
  );
}

// =============================================================================
// MAP WIDGET
// =============================================================================

export interface MapWidgetProps {
  apiKey?: string;
  address?: string;
  className?: string;
  [key: string]: any;
}

export function MapWidget({ apiKey, address, className, ...rest }: MapWidgetProps) {
  const nodeId = useNodeID();
  if (!apiKey || !address) {
    return (
      <div {...rest} className={className} data-up-node-id={nodeId}>
        Map placeholder
      </div>
    );
  }

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
