import React from 'react';
import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 select-none disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600/90 shadow-sm shadow-indigo-500/20 active:scale-[0.99] focus-visible:ring-indigo-500',
    dark: 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-900 shadow-xs focus-visible:ring-neutral-900',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 shadow-xs focus-visible:ring-indigo-600',
    secondary: 'bg-white hover:bg-neutral-50/80 text-neutral-700 border border-neutral-200/90 shadow-2xs hover:border-neutral-300 focus-visible:ring-neutral-400',
    ghost: 'bg-transparent hover:bg-neutral-150/70 text-neutral-600 hover:text-neutral-900 focus-visible:ring-neutral-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-xs focus-visible:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1.5 sm:py-2 gap-2',
    lg: 'text-sm px-4 py-2.5 gap-2.5',
    icon: 'p-1.5 text-neutral-500 hover:text-neutral-800 rounded-md',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      
      {children}

      {!isLoading && RightIcon ? (
        <RightIcon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
    </button>
  );
}
