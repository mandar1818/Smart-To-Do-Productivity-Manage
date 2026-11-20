import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardStats() {
  const { stats } = useTasks();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Initiatives */}
      <Link
        to="/tasks"
        className="group bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Backlog
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {stats.total}
          </span>
          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Active workspace items</span>
          <span className="font-mono text-slate-700 font-medium">100% indexed</span>
        </div>
      </Link>

      {/* 2. Completion Velocity */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Completion Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600 font-mono">
              {stats.completionRate}%
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {stats.completed} resolved
            </span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Overall velocity</span>
          <span className="text-emerald-700 font-semibold">{stats.completed}/{stats.total} tasks</span>
        </div>
      </div>

      {/* 3. In Flight (Pending) */}
      <Link
        to="/tasks"
        className="group bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pending Execution
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {stats.pending}
          </span>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
            In Flight
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Current active queue</span>
          <span className="text-slate-700 font-mono">{stats.pending} remaining</span>
        </div>
      </Link>

      {/* 4. Overdue Triage */}
      <Link
        to="/today"
        className={`group bg-white rounded-xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between ${
          stats.overdue > 0 ? 'border-rose-200/80 hover:border-rose-300' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Overdue Triage
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
            stats.overdue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className={`text-3xl font-extrabold tracking-tight font-mono ${
            stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {stats.overdue}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            stats.overdue > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200/80 animate-pulse'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {stats.overdue > 0 ? 'Needs Action' : 'All Clear'}
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{stats.overdue > 0 ? 'Exceeded target date' : 'Schedule on track'}</span>
          <span className="text-slate-700 font-mono">{stats.overdue > 0 ? 'Triage now' : '0 delayed'}</span>
        </div>
      </Link>
    </div>
  );
}
