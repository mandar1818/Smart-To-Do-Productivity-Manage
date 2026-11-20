import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function TaskFilters() {
  const {
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    categories,
    stats,
  } = useTasks();

  const statuses = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'overdue', label: 'Overdue', count: stats.overdue },
  ];

  const hasActiveFilters =
    filterStatus !== 'all' ||
    filterPriority !== 'all' ||
    filterCategory !== 'all' ||
    sortBy !== 'dueDate';

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setSortBy('dueDate');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/50 rounded-xl overflow-x-auto max-w-full">
        {statuses.map((tab) => {
          const isActive = filterStatus === tab.id;
          const isOverdueTab = tab.id === 'overdue' && tab.count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-2 focus:outline-none whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-white text-slate-900 shadow-2xs font-bold ring-1 ring-black/[0.04]'
                  : cn(
                      'text-slate-600 hover:text-slate-900 hover:bg-white/40',
                      isOverdueTab && 'text-rose-600 hover:text-rose-700'
                    )
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : isOverdueTab
                    ? 'bg-rose-100 text-rose-700 font-semibold'
                    : 'bg-slate-200/80 text-slate-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 shadow-2xs transition-colors cursor-pointer"
        >
          <option value="all">Priority: All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 shadow-2xs transition-colors cursor-pointer"
        >
          <option value="all">Category: All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 shadow-2xs transition-colors cursor-pointer"
        >
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-rose-50/50 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer"
            title="Clear all filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
