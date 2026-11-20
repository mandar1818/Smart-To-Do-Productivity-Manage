import React from 'react';
import { cn } from '../../utils/helpers';

export function ProgressBar({ value = 0, max = 100, className, barColor = 'bg-neutral-800', color, height = 'h-1.5' }) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={cn('w-full bg-neutral-100 rounded-full overflow-hidden', height, className)}>
      <div
        className={cn('h-full transition-all duration-300 ease-out rounded-full', !color && barColor)}
        style={{ width: `${percentage}%`, backgroundColor: color || undefined }}
      />
    </div>
  );
}
