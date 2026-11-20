import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { Button } from '../components/common/Button';
import { Plus, CheckSquare } from 'lucide-react';

export function MyTasksPage() {
  const { filteredTasks, openCreateModal, searchQuery } = useTasks();

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              All Tasks
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? `Filtered results matching "${searchQuery}"`
              : 'Complete backlog across all domains and priority tiers'}
          </p>
        </div>

        <Button
          onClick={() => openCreateModal()}
          variant="primary"
          size="sm"
          leftIcon={Plus}
          className="self-start sm:self-center font-semibold shadow-sm shadow-indigo-500/20"
        >
          Add task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <TaskFilters />

      {/* Clean Task Table/List */}
      <TaskList
        tasks={filteredTasks}
        emptyTitle="No matching tasks"
        emptyDescription="Try adjusting your filters, resetting category selections, or searching another keyword."
      />
    </div>
  );
}
