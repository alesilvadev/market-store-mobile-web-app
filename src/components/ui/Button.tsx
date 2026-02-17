/**
 * Button Component
 * A versatile, accessible button supporting various variants and states
 */

import React, { ButtonHTMLAttributes } from 'react';
import cn from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button is in loading state */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Button Component
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * // Loading state
 * <Button isLoading>Saving...</Button>
 *
 * // Full width with icon
 * <Button fullWidth size="lg">
 *   <span>🛒 Add to Cart</span>
 * </Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  // Base styles for all buttons
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-lg',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-[44px] px-4', // Touch target: 44px minimum
    fullWidth && 'w-full'
  );

  // Variant styles
  const variantStyles = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-200',
    danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 disabled:bg-error-600',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-gray-400',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-sm h-8 px-3',
    md: 'text-base h-10 px-4',
    lg: 'text-lg h-12 px-6',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="spinner h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
