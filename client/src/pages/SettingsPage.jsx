import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/common/Button';
import { LogIn, LogOut, User, Bell, Keyboard, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/helpers';

export function SettingsPage() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { showToast } = useTasks();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const [notifications, setNotifSettings] = useState({
    dailyBriefing: true,
    overdueAlerts: true,
    weeklyReport: false,
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Profile preferences updated', 'success');
  };

  const toggleNotif = (key) => {
    setNotifSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Notification preference saved', 'info');
      return next;
    });
  };

  const shortcuts = [
    { key: '⌘ K / Ctrl K', desc: 'Focus global search input' },
    { key: 'N', desc: 'Open new task dialog' },
    { key: '⌘ Enter', desc: 'Save task from inside dialog' },
    { key: 'Esc', desc: 'Close dialog or dismiss active modal' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Workspace identity, notification delivery channels, and productivity shortcuts
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Account Profile & Identity
          </h2>
        </div>

        {isAuthenticated && user ? (
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20">
                  {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Authenticated Session Active
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={LogOut}
                onClick={() => logout()}
                className="self-start sm:self-center"
              >
                Sign out
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed shadow-2xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm" className="font-semibold shadow-sm shadow-indigo-500/20">
                Save changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3.5 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto">
              <p className="text-sm font-semibold text-slate-800">
                Sync across multiple devices
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to persist your tasks and access real-time productivity intelligence across devices.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={LogIn}
              onClick={() => openAuthModal('login')}
              className="font-semibold shadow-sm shadow-indigo-500/20"
            >
              Sign In / Register
            </Button>
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Notification Preferences
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { key: 'dailyBriefing', label: 'Daily Agenda Briefing', desc: 'Receive morning summaries of tasks due today' },
            { key: 'overdueAlerts', label: 'Overdue Task Escalations', desc: 'Notify immediately when high-priority tasks exceed target dates' },
            { key: 'weeklyReport', label: 'Weekly Velocity Summary', desc: 'Receive weekly throughput analytics and completion rates' },
          ].map((item) => (
            <div key={item.key} className="py-3.5 flex items-center justify-between text-xs">
              <div className="pr-4">
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={notifications[item.key]}
                onClick={() => toggleNotif(item.key)}
                className={cn(
                  'w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shrink-0',
                  notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-200'
                )}
              >
                <div
                  className={cn(
                    'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out',
                    notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Keyboard className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Global Keyboard Shortcuts
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-2.5 text-xs"
            >
              <span className="text-slate-600 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200/90 rounded-md shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
