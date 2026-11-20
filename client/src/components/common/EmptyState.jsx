import React from 'react';
import { Button } from './Button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function EmptyState({
  icon: Icon = CheckCircle2,
  title = 'No tasks found',
  description = 'You are all caught up or no tasks matched your active filters.',
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-5 text-center rounded-xl border border-slate-200/90 bg-white shadow-2xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3.5 shadow-2xs">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="font-semibold shadow-sm shadow-indigo-500/20">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
