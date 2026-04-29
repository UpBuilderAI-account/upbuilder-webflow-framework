/**
 * Form components - local implementations
 */
import React from 'react';
import { extractAnimationAttrs, omitAnimationProps, type UpAnimationProps } from './animations';
import { useNodeID } from './node-id';
import { useStaticMode } from './static-mode';


// Form configuration props
export interface FormProps {
  name?: string;
  redirect?: string;
}

export interface FormInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

interface FormTextareaPropsBase {
  name?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

export interface FormSelectOption {
  value: string;
  text: string;
}

interface FormSelectPropsBase {
  name?: string;
  required?: boolean;
  multiple?: boolean;
  options?: FormSelectOption[];
}

export interface FormCheckboxProps {
  name?: string;
  required?: boolean;
  checked?: boolean;
}

export interface FormRadioProps {
  name?: string;
  value?: string;
  required?: boolean;
}

interface FormLabelPropsBase {
  htmlFor?: string;
}

export interface FormWrapperProps extends UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormWrapper({ className, children, ...rest }: FormWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={`${className || ''} w-form`} data-up-node-id={nodeId}>{children}</div>;
}

export interface FormFormProps extends FormProps, UpAnimationProps {
  action?: string;
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  [key: string]: any;
}

export function FormForm({ name, action, method = 'post', className, children, onSubmit, ...rest }: FormFormProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staticMode) return;
    onSubmit?.(e);
  };

  return (
    <form {...props} {...animAttrs} name={name} action={action} method={method} className={className} onSubmit={handleSubmit} data-up-node-id={nodeId}>
      {children}
    </form>
  );
}

export interface FormLabelProps extends FormLabelPropsBase, UpAnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormBlockLabel({ text, htmlFor, className, children, ...rest }: FormLabelProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <label {...props} {...animAttrs} htmlFor={htmlFor} className={className} data-up-node-id={nodeId}>{children || text}</label>;
}

export function FormInlineLabel({ text, htmlFor, className, children, ...rest }: FormLabelProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <label {...props} {...animAttrs} htmlFor={htmlFor} className={className} style={{ display: 'inline' }} data-up-node-id={nodeId}>{children || text}</label>;
}

export interface FormTextInputComponentProps extends FormInputProps, UpAnimationProps {
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormTextInput({ name, type = 'text', placeholder, required, value, className, onChange, ...rest }: FormTextInputComponentProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <input
      {...props}
      {...animAttrs}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={value}
      className={`${className || ''} w-input`}
      onChange={onChange}
      data-up-node-id={nodeId}
    />
  );
}

export interface FormTextareaComponentProps extends FormTextareaPropsBase, UpAnimationProps {
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

export function FormTextarea({ name, placeholder, required, value, className, onChange, ...rest }: FormTextareaComponentProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <textarea
      {...props}
      {...animAttrs}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={value}
      className={`${className || ''} w-input`}
      onChange={onChange}
      data-up-node-id={nodeId}
    />
  );
}

export interface FormSelectComponentProps extends FormSelectPropsBase, UpAnimationProps {
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  [key: string]: any;
}

export function FormSelect({ name, required, multiple, options, className, children, onChange, ...rest }: FormSelectComponentProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <select {...props} {...animAttrs} name={name} required={required} multiple={multiple} className={`${className || ''} w-select`} onChange={onChange} data-up-node-id={nodeId} data-form-options={options ? JSON.stringify(options) : undefined}>
      {options ? options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.text}</option>
      )) : children}
    </select>
  );
}

export interface FormButtonProps extends UpAnimationProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormButton({ text, type = 'submit', className, children, ...rest }: FormButtonProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return (
    <button {...props} {...animAttrs} type={type} className={`${className || ''} w-button`} data-up-node-id={nodeId}>
      {children || text}
    </button>
  );
}

export function FormCheckboxWrapper({ className, children, ...rest }: FormWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <label {...props} {...animAttrs} className={`${className || ''} w-checkbox`} data-up-node-id={nodeId}>{children}</label>;
}

export interface FormCheckboxInputProps extends UpAnimationProps {
  name?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormCheckboxInput({ name, required, className, onChange, ...rest }: FormCheckboxInputProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <input {...props} {...animAttrs} type="checkbox" name={name} required={required} className={`${className || ''} w-checkbox-input`} onChange={onChange} data-up-node-id={nodeId} />;
}

export function FormRadioWrapper({ className, children, ...rest }: FormWrapperProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <label {...props} {...animAttrs} className={`${className || ''} w-radio`} data-up-node-id={nodeId}>{children}</label>;
}

export interface FormRadioInputProps extends UpAnimationProps {
  name?: string;
  value?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormRadioInput({ name, value, required, className, onChange, ...rest }: FormRadioInputProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <input {...props} {...animAttrs} type="radio" name={name} value={value} required={required} className={`${className || ''} w-radio-input`} onChange={onChange} data-up-node-id={nodeId} />;
}

export interface FormMessageProps extends UpAnimationProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormSuccessMessage({ text, className, children, ...rest }: FormMessageProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  if (staticMode) {
    return <div {...props} {...animAttrs} className={`${className || ''} w-form-done`} style={{ display: 'none' }} data-up-node-id={nodeId}>{children || text || 'Thank you! Your submission has been received!'}</div>;
  }
  return <div {...props} {...animAttrs} className={`${className || ''} w-form-done`} data-up-node-id={nodeId}>{children || text || 'Thank you! Your submission has been received!'}</div>;
}

export function FormErrorMessage({ text, className, children, ...rest }: FormMessageProps) {
  const nodeId = useNodeID();
  const staticMode = useStaticMode();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  if (staticMode) {
    return <div {...props} {...animAttrs} className={`${className || ''} w-form-fail`} style={{ display: 'none' }} data-up-node-id={nodeId}>{children || text || 'Oops! Something went wrong.'}</div>;
  }
  return <div {...props} {...animAttrs} className={`${className || ''} w-form-fail`} data-up-node-id={nodeId}>{children || text || 'Oops! Something went wrong.'}</div>;
}

export interface FormReCaptchaProps extends UpAnimationProps {
  siteKey?: string;
  className?: string;
  [key: string]: any;
}

export function FormReCaptcha({ siteKey, className, ...rest }: FormReCaptchaProps) {
  const nodeId = useNodeID();
  const animAttrs = extractAnimationAttrs(rest);
  const props = omitAnimationProps(rest);
  return <div {...props} {...animAttrs} className={className} data-sitekey={siteKey} data-up-node-id={nodeId} />;
}
