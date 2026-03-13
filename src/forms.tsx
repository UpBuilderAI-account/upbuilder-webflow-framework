/**
 * Form components - local implementations
 */
import React from 'react';

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

interface FormSelectPropsBase {
  name?: string;
  required?: boolean;
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

export interface FormWrapperProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormWrapper({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-form`}>{children}</div>;
}

export interface FormFormProps extends FormProps {
  action?: string;
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  [key: string]: any;
}

export function FormForm({ name, action, method = 'post', className, children, onSubmit, ...rest }: FormFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form {...rest} name={name} action={action} method={method} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

export interface FormLabelProps extends FormLabelPropsBase {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormBlockLabel({ text, htmlFor, className, children, ...rest }: FormLabelProps) {
  return <label {...rest} htmlFor={htmlFor} className={className}>{children || text}</label>;
}

export function FormInlineLabel({ text, htmlFor, className, children, ...rest }: FormLabelProps) {
  return <label {...rest} htmlFor={htmlFor} className={className} style={{ display: 'inline' }}>{children || text}</label>;
}

export interface FormTextInputComponentProps extends FormInputProps {
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormTextInput({ name, type = 'text', placeholder, required, value, className, onChange, ...rest }: FormTextInputComponentProps) {
  return (
    <input
      {...rest}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={value}
      className={`${className || ''} w-input`}
      onChange={onChange}
    />
  );
}

export interface FormTextareaComponentProps extends FormTextareaPropsBase {
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

export function FormTextarea({ name, placeholder, required, value, className, onChange, ...rest }: FormTextareaComponentProps) {
  return (
    <textarea
      {...rest}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={value}
      className={`${className || ''} w-input`}
      onChange={onChange}
    />
  );
}

export interface FormSelectComponentProps extends FormSelectPropsBase {
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  [key: string]: any;
}

export function FormSelect({ name, required, className, children, onChange, ...rest }: FormSelectComponentProps) {
  return (
    <select {...rest} name={name} required={required} className={`${className || ''} w-select`} onChange={onChange}>
      {children}
    </select>
  );
}

export interface FormButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormButton({ text, type = 'submit', className, children, ...rest }: FormButtonProps) {
  return (
    <button {...rest} type={type} className={`${className || ''} w-button`}>
      {children || text}
    </button>
  );
}

export function FormCheckboxWrapper({ className, children, ...rest }: FormWrapperProps) {
  return <label {...rest} className={`${className || ''} w-checkbox`}>{children}</label>;
}

export interface FormCheckboxInputProps {
  name?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormCheckboxInput({ name, required, className, onChange, ...rest }: FormCheckboxInputProps) {
  return <input {...rest} type="checkbox" name={name} required={required} className={`${className || ''} w-checkbox-input`} onChange={onChange} />;
}

export function FormRadioWrapper({ className, children, ...rest }: FormWrapperProps) {
  return <label {...rest} className={`${className || ''} w-radio`}>{children}</label>;
}

export interface FormRadioInputProps {
  name?: string;
  value?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormRadioInput({ name, value, required, className, onChange, ...rest }: FormRadioInputProps) {
  return <input {...rest} type="radio" name={name} value={value} required={required} className={`${className || ''} w-radio-input`} onChange={onChange} />;
}

export interface FormMessageProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function FormSuccessMessage({ text, className, children, ...rest }: FormMessageProps) {
  return <div {...rest} className={`${className || ''} w-form-done`}>{children || text || 'Thank you! Your submission has been received!'}</div>;
}

export function FormErrorMessage({ text, className, children, ...rest }: FormMessageProps) {
  return <div {...rest} className={`${className || ''} w-form-fail`}>{children || text || 'Oops! Something went wrong.'}</div>;
}

// File upload components (simplified)
export function FormFileUploadWrapper({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-file-upload`}>{children}</div>;
}

export function FormFileUploadDefault({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-default`}>{children}</div>;
}

export function FormFileUploadUploading({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-uploading`}>{children}</div>;
}

export function FormFileUploadSuccess({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-success`}>{children}</div>;
}

export function FormFileUploadError({ className, children, ...rest }: FormWrapperProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-error`}>{children}</div>;
}

export interface FormFileUploadInputProps {
  name?: string;
  accept?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export function FormFileUploadInput({ name, accept, className, onChange, ...rest }: FormFileUploadInputProps) {
  return <input {...rest} type="file" name={name} accept={accept} className={`${className || ''} w-file-upload-input`} onChange={onChange} />;
}

export function FormFileUploadLabel({ text, className, children, ...rest }: FormMessageProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-label`}>{children || text}</div>;
}

export function FormFileUploadErrorMsg({ text, className, children, ...rest }: FormMessageProps) {
  return <div {...rest} className={`${className || ''} w-file-upload-error-msg`}>{children || text}</div>;
}

export interface FormReCaptchaProps {
  siteKey?: string;
  className?: string;
  [key: string]: any;
}

export function FormReCaptcha({ siteKey, className, ...rest }: FormReCaptchaProps) {
  return <div {...rest} className={className} data-sitekey={siteKey} />;
}
