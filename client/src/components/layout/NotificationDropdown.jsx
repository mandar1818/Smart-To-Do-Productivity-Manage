import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { cn } from '../../utils/helpers';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, markAllNotificationsRead, isAuthenticated } = useTasks();

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 stroke-[2]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-dropdown border border-slate-200/90 py-1 z-50 animate-in fade-in duration-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/70 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {!isAuthenticated ? 'Sign in to view notifications' : 'No active alerts or overdue items'}
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-3.5 hover:bg-slate-50/80 transition-colors text-xs',
                    item.unread ? 'bg-indigo-50/30' : ''
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5 line-clamp-2 text-[11px] leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
