import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { getGreeting, getFormattedTodayDisplay } from '../../utils/dateUtils';
import { Button } from '../common/Button';
import { Plus, Calendar, AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export function WelcomeSection() {
  const { user, stats, todayTasks, openCreateModal, isAuthenticated } = useTasks();
  const greeting = getGreeting();
  const dateDisplay = getFormattedTodayDisplay();
  const displayName = user?.name ? user.name.split(' ')[0] : null;

  const pendingToday = todayTasks.filter((t) => !t.completed).length;
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;
  const todayVelocity = todayTotal > 0 ? Math.round((completedToday / todayTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      {/* Left briefing column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dateDisplay}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Daily Focus</span>
          </span>

          {!isAuthenticated && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Demo Workspace</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {displayName ? `${greeting}, ${displayName}` : greeting}
        </h1>

        <div className="mt-2 text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2.5">
          {stats.overdue > 0 ? (
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/80">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{stats.overdue} {stats.overdue === 1 ? 'task is' : 'tasks are'} overdue & needs triage</span>
            </span>
          ) : pendingToday > 0 ? (
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span>{pendingToday} active {pendingToday === 1 ? 'task' : 'tasks'} planned for today</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">{todayVelocity}% resolved today</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All tasks for today resolved. Clean state achieved.
            </span>
          )}
        </div>
      </div>

      {/* Right Action & Today Progress Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 pt-2 md:pt-0">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 min-w-[160px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Today's Rate
            </span>
            <span className="font-mono text-slate-900">{todayVelocity}%</span>
          </div>
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${todayVelocity}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-right">
            {completedToday} of {todayTotal} tasks done
          </p>
        </div>

        <Button
          onClick={() => openCreateModal()}
          variant="primary"
          size="md"
          leftIcon={Plus}
          className="shadow-md shadow-indigo-600/25 px-5 py-2.5 font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl"
        >
          New task
        </Button>
      </div>
    </div>
  );
}
