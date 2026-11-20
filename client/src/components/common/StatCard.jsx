import React from 'react';
import { cn } from '../../utils/helpers';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  progress,
  badge,
  badgeColor = 'bg-slate-100 text-slate-600',
  className,
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs', iconBg)}>
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      {/* Progress meter (if passed) */}
      {typeof progress === 'number' && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
            <span>Progress</span>
            <span className="text-emerald-700 font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Badge */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium">
          {subtitle}
        </span>
        {badge && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider', badgeColor)}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
