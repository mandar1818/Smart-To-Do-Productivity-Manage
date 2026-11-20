import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskItem } from '../tasks/TaskItem';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { EmptyState } from '../common/EmptyState';

export function TaskSections() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'upcoming' | 'completed'
  const { todayTasks, upcomingTasks, recentlyCompletedTasks, openCreateModal } = useTasks();

  const tabs = [
    {
      id: 'today',
      label: "Today's Tasks",
      count: todayTasks.length,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: upcomingTasks.length,
    },
    {
      id: 'completed',
      label: 'Recently Completed',
      count: recentlyCompletedTasks.length,
    },
  ];

  const getActiveTasks = () => {
    switch (activeTab) {
      case 'today':
        return todayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'completed':
        return recentlyCompletedTasks;
      default:
        return todayTasks;
    }
  };

  const tasksToDisplay = getActiveTasks();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Tab Header & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 sm:py-3.5 border-b border-slate-100 gap-3 bg-slate-50/50">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 rounded-lg max-w-full overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-2 focus:outline-none whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors',
                    isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-400 bg-slate-200/60'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tasks"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors group px-2 py-1 rounded-md hover:bg-indigo-50/60"
          >
            <span>View all tasks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Task List Container */}
      <div>
        {tasksToDisplay.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={
                activeTab === 'today'
                  ? 'No tasks scheduled for today'
                  : activeTab === 'upcoming'
                  ? 'No upcoming tasks'
                  : 'No completed tasks'
              }
              description={
                activeTab === 'today'
                  ? 'You are all caught up for today. Click below to add a new task.'
                  : activeTab === 'upcoming'
                  ? 'Plan ahead by scheduling tasks for the days to come.'
                  : 'Tasks you complete will appear here.'
              }
              actionLabel="Add task"
              onAction={() => openCreateModal()}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasksToDisplay.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
