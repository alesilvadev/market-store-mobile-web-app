/**
 * Input Component
 * Accessible form input with support for errors and disabled states
 */

import React, { InputHTMLAttributes } from 'react';
import cn from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above input */
  label?: string;
  /** Error message displayed below input */
  error?: string;
  /** Help text displayed below input */
  helperText?: string;
  /** Full width input */
  fullWidth?: boolean;
  /** Icon to display on the right */
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 *
 * @example
 * // Basic input
 * <Input type="text" placeholder="Enter your name" />
 *
 * // With label and error
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Invalid email address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // With helper text
 * <Input
 *   label="Password"
 *   type="password"
 *   helperText="Minimum 8 characters"
 * />
 */
export function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  rightIcon,
  className,
  id,
  disabled,
  type = 'text',
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('block text-sm font-medium mb-2', hasError && 'text-error-600')}
        >
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={cn(
            'w-full h-10 px-3 py-2 text-base',
            'border border-gray-200 rounded-lg',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500',
            'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            hasError ? 'border-error-500 focus:ring-error-500' : '',
            rightIcon ? 'pr-10' : '',
            className
          )}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {hasError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !hasError && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
