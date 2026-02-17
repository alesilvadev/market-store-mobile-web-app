/**
 * Card Component
 * Container for content with optional header and footer
 */

import React, { HTMLAttributes } from 'react';
import cn from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Add interactive styling (hover effect) */
  interactive?: boolean;
  /** Add padding inside card */
  padded?: boolean;
}

interface CardPartProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Card Component - Main Container
 */
export function Card({
  className,
  interactive = false,
  padded = true,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg',
        padded && 'p-6',
        interactive && 'hover:border-primary-400 hover:shadow-md transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header - Title section at top of card
 */
export function CardHeader({ className, children, ...props }: CardPartProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Title - Heading inside CardHeader
 */
export function CardTitle({ className, children, ...props }: CardPartProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
}

/**
 * Card Description - Subtitle or description text
 */
export function CardDescription({ className, children, ...props }: CardPartProps) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Card Content - Main content area
 */
export function CardContent({ className, children, ...props }: CardPartProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Footer - Section at bottom of card
 */
export function CardFooter({ className, children, ...props }: CardPartProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-gray-200 flex gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
