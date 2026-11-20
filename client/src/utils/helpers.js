import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PRIORITY_CONFIG = {
  High: {
    label: 'High',
    color: 'text-rose-600 bg-rose-50/70 border-rose-200/80',
    dotColor: 'bg-rose-500',
    order: 3,
  },
  Medium: {
    label: 'Medium',
    color: 'text-amber-700 bg-amber-50/70 border-amber-200/80',
    dotColor: 'bg-amber-500',
    order: 2,
  },
  Low: {
    label: 'Low',
    color: 'text-slate-600 bg-slate-100/70 border-slate-200/80',
    dotColor: 'bg-slate-400',
    order: 1,
  },
};

export const CATEGORY_COLORS = {
  Work: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: '#64748b',
  },
  Development: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/70',
    dot: '#3b82f6',
  },
  Design: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/70',
    dot: '#a855f7',
  },
  Personal: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/70',
    dot: '#f59e0b',
  },
  Finance: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/70',
    dot: '#10b981',
  },
  Health: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/70',
    dot: '#f43f5e',
  },
};
