import React from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  AlignLeft,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { cn, PRIORITY_CONFIG, CATEGORY_COLORS } from '../../utils/helpers';
import { formatFriendlyDate, isTaskOverdue } from '../../utils/dateUtils';

export function TaskItem({ task, showCategory = true }) {
  const { toggleTask, openEditModal, deleteTask, updateTask } = useTasks();
  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const categoryStyle = CATEGORY_COLORS[task.category] || {
    bg: 'bg-indigo-50/70',
    text: 'text-indigo-700',
    border: 'border-indigo-200/60',
  };

  const handleCyclePriority = (e) => {
    e.stopPropagation();
    const nextPriority =
      task.priority === 'Low' ? 'Medium' : task.priority === 'Medium' ? 'High' : 'Low';
    updateTask(task.id, { priority: nextPriority });
  };

  return (
    <div
      className={cn(
        'group flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-150 gap-3 hover:bg-slate-50/80',
        task.completed && 'opacity-65 bg-slate-50/40'
      )}
    >
      {/* Left: Checkbox & Title */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 focus:outline-none cursor-pointer',
            task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
              : 'border-slate-300 hover:border-indigo-600 bg-white hover:bg-indigo-50/40 hover:scale-105 active:scale-95'
          )}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <Check className="w-3 h-3 stroke-[3] animate-check" />}
        </button>

        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
          <span
            onClick={() => openEditModal(task)}
            className={cn(
              'text-xs sm:text-sm font-medium text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors truncate',
              task.completed && 'line-through text-slate-400 font-normal hover:text-slate-500'
            )}
          >
            {task.title}
          </span>

          {/* Description Indicator */}
          {task.description && (
            <span
              title={task.description}
              className="text-slate-400 hover:text-indigo-600 inline-flex items-center cursor-help shrink-0 transition-colors"
            >
              <AlignLeft className="w-3.5 h-3.5 stroke-[1.8]" />
            </span>
          )}

          {/* Category Tag */}
          {showCategory && task.category && (
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 tracking-wide',
                categoryStyle.bg,
                categoryStyle.text,
                categoryStyle.border
              )}
            >
              {task.category}
            </span>
          )}
        </div>
      </div>

      {/* Right: Metadata (Priority, Due Date) & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Interactive Priority badge */}
        <button
          type="button"
          onClick={handleCyclePriority}
          title="Click to cycle priority (Low -> Medium -> High)"
          className={cn(
            'text-[10px] font-medium hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all cursor-pointer hover:scale-105 active:scale-95',
            task.priority === 'High' && 'bg-rose-50 text-rose-700 border-rose-200/60 font-semibold',
            task.priority === 'Medium' && 'bg-amber-50 text-amber-700 border-amber-200/60',
            task.priority === 'Low' && 'bg-slate-50 text-slate-600 border-slate-200/60'
          )}
        >
          <span
            className={cn('w-1.5 h-1.5 rounded-full', priorityInfo.dotColor)}
          />
          {task.priority}
        </button>

        {/* Due Date */}
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md transition-colors',
            isOverdue
              ? 'bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold'
              : 'text-slate-500 bg-slate-50/80 border border-slate-100'
          )}
        >
          {isOverdue ? (
            <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
          ) : (
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          )}
          <span className="text-[11px] font-medium">{formatFriendlyDate(task.dueDate)}</span>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-0.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openEditModal(task)}
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
