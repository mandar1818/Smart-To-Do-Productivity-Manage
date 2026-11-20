import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart2,
  Plus,
  X,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useTasks } from '../../context/TaskContext';
import { cn } from '../../utils/helpers';

export function MobileNav({ isOpen, onClose }) {
  const { openCreateModal } = useTasks();

  return (
    <>
      {/* Slide-out Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onClose}
          />

          <div className="relative w-72 max-w-[85vw] bg-[#0b0f19] h-full shadow-2xl z-10 flex flex-col">
            <div className="absolute top-4 right-3.5 z-30">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Sidebar onCloseMobile={onClose} className="w-full border-r-0" />
          </div>
        </div>
      )}

      {/* Clean Bottom Navigation Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0b0f19]/95 backdrop-blur-md border-t border-[#1a2333] px-3 py-2 z-40 flex items-center justify-around shadow-2xl safe-area-pb">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors',
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            )
          }
        >
          <LayoutDashboard className="w-4 h-4 stroke-[2]" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors',
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            )
          }
        >
          <CheckSquare className="w-4 h-4 stroke-[2]" />
          <span>Tasks</span>
        </NavLink>

        {/* Center Quick Add Button */}
        <button
          onClick={() => openCreateModal()}
          className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-[#0b0f19] active:scale-95 transition-all cursor-pointer"
          aria-label="Create Task"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <NavLink
          to="/today"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors',
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            )
          }
        >
          <Calendar className="w-4 h-4 stroke-[2]" />
          <span>Today</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors',
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            )
          }
        >
          <BarChart2 className="w-4 h-4 stroke-[2]" />
          <span>Analytics</span>
        </NavLink>
      </nav>
    </>
  );
}
