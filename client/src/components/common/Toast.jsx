import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: (
      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ),
    error: (
      <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
        <AlertCircle className="w-4 h-4" />
      </div>
    ),
    warning: (
      <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
        <AlertCircle className="w-4 h-4" />
      </div>
    ),
    info: (
      <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Info className="w-4 h-4" />
      </div>
    ),
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-3 p-3.5 rounded-xl shadow-xl border border-slate-200/90 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold">
        {icons[toast.type] || icons.info}
        <span className="flex-1 text-xs text-slate-700 leading-snug">{toast.message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
