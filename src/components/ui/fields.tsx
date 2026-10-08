import React from 'react';

const joinClasses = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary-700',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
  outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: 'default' | 'sm' | 'icon';
};

export function Button({ variant = 'default', size = 'default', className, type = 'button', ...props }: ButtonProps) {
  const sizes = { default: 'min-h-10 px-4 py-2', sm: 'min-h-8 px-3 py-1.5 text-xs', icon: 'size-10 p-0' };
  return <button type={type} className={joinClasses('inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', buttonVariants[variant], sizes[size], className)} {...props} />;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={joinClasses('input-field', className)} {...props} />
));
Input.displayName = 'Input';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={joinClasses('textarea-field', className)} {...props} />
));
Textarea.displayName = 'Textarea';

import { CustomSelect } from './CustomSelect';
export const Select = CustomSelect;

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={joinClasses('label', className)} {...props} />;
}

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={joinClasses('size-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />;
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}