import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  FolderTree,
  BarChart2,
  Settings,
  Plus,
  LogOut,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

export function Sidebar({ className, onCloseMobile }) {
  const { openCreateModal, stats, todayTasks, overdueTasks, categories } = useTasks();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const primaryNavigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: stats.pending > 0 ? stats.pending : null,
      badgeColor: 'text-slate-300 bg-slate-800/80 border border-slate-700/60',
    },
    {
      name: 'Today',
      href: '/today',
      icon: Calendar,
      badge: todayTasks.filter((t) => !t.completed).length || null,
      badgeColor: 'text-indigo-200 bg-indigo-500/25 border border-indigo-400/40 font-semibold',
    },
    {
      name: 'Upcoming',
      href: '/upcoming',
      icon: Clock,
      badge: null,
    },
  ];

  const workspaceNavigation = [
    {
      name: 'Categories',
      href: '/categories',
      icon: FolderTree,
      badge: categories.length,
      badgeColor: 'text-slate-400 bg-slate-800/60 border border-slate-700/40',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart2,
      badge: null,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const renderNavLink = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.name}
        to={item.href}
        end={item.href === '/'}
        onClick={handleLinkClick}
        className={({ isActive }) =>
          cn(
            'group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
            isActive
              ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-white font-semibold border-l-2 border-indigo-400 pl-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-indigo-400 stroke-[2.2]'
                    : 'text-slate-500 group-hover:text-slate-300 stroke-[1.8]'
                )}
              />
              <span className="truncate">{item.name}</span>
            </div>

            {item.badge !== null && item.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 font-mono leading-none',
                  isActive
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                    : item.badgeColor || 'bg-slate-800 text-slate-400'
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        'w-64 bg-[#0b0f19] border-r border-[#1a2333] flex flex-col h-screen select-none shrink-0 shadow-[4px_0_24px_0_rgba(0,0,0,0.25)] z-20',
        className
      )}
    >
      {/* Brand Identity */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#162032]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/10">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">
              Smart Task
            </span>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Productivity Manager</p>
          </div>
        </div>
      </div>

      {/* Prominent Primary Add Task Action */}
      <div className="px-3 pt-3.5 pb-2">
        <button
          onClick={() => {
            openCreateModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white rounded-lg transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New task
          </span>
          <kbd className="text-[10px] bg-black/30 text-indigo-100 px-1.5 py-0.5 rounded font-mono font-medium border border-white/10">
            N
          </kbd>
        </button>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {/* Group 1: FOCUS / TASKS */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 pb-1.5">
            Focus
          </p>
          <div className="space-y-0.5">
            {primaryNavigation.map(renderNavLink)}
          </div>
        </div>

        {/* Group 2: WORKSPACE & INSIGHTS */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 pb-1.5">
            Workspace
          </p>
          <div className="space-y-0.5">
            {workspaceNavigation.map(renderNavLink)}
          </div>
        </div>

        {/* Overdue Alert Banner in Sidebar if tasks are overdue */}
        {overdueTasks.length > 0 && (
          <div className="pt-2 border-t border-[#162032]">
            <NavLink
              to="/today"
              onClick={handleLinkClick}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 text-rose-300 font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Overdue Tasks
              </span>
              <span className="text-[11px] font-bold font-mono bg-rose-900/60 text-rose-200 px-1.5 py-0.2 rounded-full border border-rose-700/50">
                {overdueTasks.length}
              </span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Profile / Auth Footer */}
      <div className="p-3 border-t border-[#162032] bg-[#070a11]/70">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#111827] border border-[#1e293b] shadow-sm">
            <NavLink
              to="/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 flex-1 min-w-0 group/profile"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ring-1 ring-white/10">
                {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight group-hover/profile:text-indigo-300 transition-colors">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[10px] text-slate-400 truncate">
                    Online
                  </span>
                </div>
              </div>
            </NavLink>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium">Demo Workspace</span>
            </div>
            <button
              onClick={() => {
                openAuthModal('login');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
