import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNav } from './MobileNav';
import { Toast } from '../common/Toast';
import { TaskModal } from '../tasks/TaskModal';
import { AuthModal } from '../auth/AuthModal';
import { useTasks } from '../../context/TaskContext';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useTasks();

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col antialiased text-slate-900">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile Navigation Drawer & Bottom Bar */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-20 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Task Create/Edit Modal */}
      <TaskModal />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Toast Notification Container */}
      <Toast toast={toast} />
    </div>
  );
}
