import React, { useRef, useEffect } from 'react';
import { Search, Plus, Menu, LogIn } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '../common/Button';

export function TopNavbar({ onOpenMobileMenu }) {
  const { searchQuery, setSearchQuery, openCreateModal } = useTasks();
  const { isAuthenticated, openAuthModal } = useAuth();
  const searchInputRef = useRef(null);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to focus search, N to open task modal
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'n' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        openCreateModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateModal]);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tasks, descriptions, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-xs bg-slate-100/70 hover:bg-slate-100 focus:bg-white rounded-lg border border-slate-200/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800 outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        {isAuthenticated ? (
          <Button
            onClick={() => openCreateModal()}
            size="sm"
            variant="primary"
            leftIcon={Plus}
            className="hidden sm:inline-flex text-xs shadow-sm"
          >
            Add task
          </Button>
        ) : (
          <Button
            onClick={() => openAuthModal('login')}
            size="sm"
            variant="secondary"
            leftIcon={LogIn}
            className="text-xs"
          >
            Sign in
          </Button>
        )}

        <NotificationDropdown />
      </div>
    </header>
  );
}
