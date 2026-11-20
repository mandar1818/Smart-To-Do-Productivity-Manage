import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskList } from '../components/tasks/TaskList';
import { Button } from '../components/common/Button';
import { Plus, Calendar, Clock, Compass } from 'lucide-react';

export function UpcomingPage() {
  const { tasks, openCreateModal } = useTasks();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

  const tomorrowTasks = tasks.filter(
    (t) => t.dueDate === tomorrowStr && !t.completed
  );

  const thisWeekTasks = tasks.filter(
    (t) => t.dueDate > tomorrowStr && t.dueDate <= nextWeekStr && !t.completed
  );

  const laterTasks = tasks.filter(
    (t) => t.dueDate > nextWeekStr && !t.completed
  );

  const totalUpcoming = tomorrowTasks.length + thisWeekTasks.length + laterTasks.length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upcoming Horizon
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {totalUpcoming} scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Timeline schedule for tomorrow, the next 7 days, and future milestones
          </p>
        </div>

        <Button
          onClick={() => openCreateModal({ dueDate: tomorrowStr })}
          variant="primary"
          size="sm"
          leftIcon={Plus}
          className="self-start sm:self-center font-semibold shadow-sm shadow-indigo-500/20"
        >
          Schedule task
        </Button>
      </div>

      {/* Tomorrow Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
          <span className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Tomorrow ({tomorrowTasks.length})
          </span>
          <span className="text-[11px] text-slate-400 font-mono font-normal">{tomorrowStr}</span>
        </div>

        {tomorrowTasks.length === 0 ? (
          <div className="p-4 text-center rounded-xl border border-dashed border-slate-200/90 text-xs text-slate-400 bg-white/50">
            No tasks scheduled for tomorrow.
          </div>
        ) : (
          <TaskList tasks={tomorrowTasks} />
        )}
      </div>

      {/* This Week Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
          <span className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Next 7 Days ({thisWeekTasks.length})
          </span>
          <span className="text-[11px] text-slate-400 font-normal">Weekly commitments</span>
        </div>

        {thisWeekTasks.length === 0 ? (
          <div className="p-4 text-center rounded-xl border border-dashed border-slate-200/90 text-xs text-slate-400 bg-white/50">
            No tasks scheduled across the next 7 days.
          </div>
        ) : (
          <TaskList tasks={thisWeekTasks} />
        )}
      </div>

      {/* Later Horizon Section */}
      {laterTasks.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Later Horizons ({laterTasks.length})
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Beyond next week</span>
          </div>

          <TaskList tasks={laterTasks} />
        </div>
      )}
    </div>
  );
}
