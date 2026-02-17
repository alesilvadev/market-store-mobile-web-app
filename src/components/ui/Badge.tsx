/**
 * Badge Component
 * Small tag or label for status, tags, or categories
 */

import React, { HTMLAttributes } from 'react';
import cn from '@/lib/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant of the badge */
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  /** Size of the badge */
  size?: 'sm' | 'md';
  /** Pill-shaped badge */
  pill?: boolean;
}

/**
 * Badge Component
 *
 * @example
 * // Status badge
 * <Badge variant="success">Completed</Badge>
 *
 * // Price badge
 * <Badge variant="primary" pill>$99.99</Badge>
 *
 * // Tag badge
 * <Badge>New</Badge>
 */
export function Badge({
  variant = 'primary',
  size = 'md',
  pill = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-300',
    accent: 'bg-accent-100 text-accent-800 border border-accent-300',
    success: 'bg-success-100 text-success-800 border border-success-300',
    warning: 'bg-warning-100 text-warning-800 border border-warning-300',
    error: 'bg-error-100 text-error-800 border border-error-300',
    info: 'bg-info-100 text-info-800 border border-info-300',
    gray: 'bg-gray-100 text-gray-800 border border-gray-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'font-medium inline-flex items-center gap-1',
        'transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        pill && 'rounded-full',
        !pill && 'rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
