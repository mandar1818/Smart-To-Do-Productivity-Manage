import React from 'react';
import { cn } from '../../utils/helpers';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className,
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200/80',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    neutral: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 font-medium leading-none',
    md: 'text-xs px-2 py-0.5 font-medium',
    lg: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border tracking-tight',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor || 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
}
