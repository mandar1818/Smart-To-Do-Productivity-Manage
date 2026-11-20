import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskList } from '../components/tasks/TaskList';
import { Button } from '../components/common/Button';
import { getFormattedTodayDisplay, getTodayString } from '../utils/dateUtils';
import { Plus, Calendar, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export function TodayPage() {
  const { todayTasks, overdueTasks, openCreateModal, updateTask, showToast } = useTasks();
  const dateDisplay = getFormattedTodayDisplay();

  const pendingToday = todayTasks.filter((t) => !t.completed);
  const completedToday = todayTasks.filter((t) => t.completed);
  const todayTotal = todayTasks.length;
  const todayRate = todayTotal > 0 ? Math.round((completedToday.length / todayTotal) * 100) : 0;

  const handleRescheduleAllToToday = () => {
    const todayStr = getTodayString();
    overdueTasks.forEach((t) => {
      updateTask(t.id, { dueDate: todayStr });
    });
    showToast(`Rescheduled ${overdueTasks.length} tasks to today`, 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateDisplay}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Today's Focus
            </h1>
            {todayTotal > 0 && (
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {todayRate}% done
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingToday.length} active {pendingToday.length === 1 ? 'task' : 'tasks'} remaining today · {completedToday.length} completed
          </p>
        </div>

        <Button
          onClick={() => openCreateModal({ dueDate: getTodayString() })}
          variant="primary"
          size="sm"
          leftIcon={Plus}
          className="self-start sm:self-center font-semibold shadow-md shadow-indigo-600/25 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white"
        >
          Add to Today
        </Button>
      </div>

      {/* Overdue Triage Section (If any) */}
      {overdueTasks.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
            <div className="flex items-center gap-2.5 font-semibold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Backlog Triage: {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task requires' : 'tasks require'} attention</span>
            </div>

            <button
              onClick={handleRescheduleAllToToday}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/80 font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reschedule all to today</span>
            </button>
          </div>

          <TaskList
            tasks={overdueTasks}
            emptyTitle="No overdue tasks"
          />
        </div>
      )}

      {/* Main Today Pending Tasks */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
          <span>Today's Backlog ({pendingToday.length})</span>
          <span className="text-[11px] text-slate-400">Targeting completion by end of day</span>
        </div>

        <TaskList
          tasks={pendingToday}
          emptyTitle="All caught up for today"
          emptyDescription="You have resolved all tasks planned for today. Enjoy your day or add new items."
        />
      </div>

      {/* Completed Today Section */}
      {completedToday.length > 0 && (
        <div className="space-y-2.5 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 px-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed Today ({completedToday.length})</span>
          </div>

          <TaskList
            tasks={completedToday}
            emptyTitle="No tasks completed today"
          />
        </div>
      )}
    </div>
  );
}
