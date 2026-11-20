import React from 'react';
import { TaskItem } from './TaskItem';
import { EmptyState } from '../common/EmptyState';
import { CheckSquare } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export function TaskList({
  tasks = [],
  emptyTitle = 'No tasks found',
  emptyDescription = 'There are no tasks matching your current view or filter criteria.',
  showCategory = true,
  className = '',
}) {
  const { openCreateModal } = useTasks();

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Create task"
        onAction={() => openCreateModal()}
      />
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden ${className}`}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} showCategory={showCategory} />
      ))}
    </div>
  );
}
