import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Plus,
  SlidersHorizontal,
  Download,
  AlertTriangle,
  Cloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate, getGreeting } from '../../utils/time';
import { ProgressRing } from '../common/ProgressRing';
import { detectOverlaps } from '../../utils/timeBalancer';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    selectedDate,
    todayCompletionPercentage,
    todayActivities,
    todayCompletedCount,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    setIsQuickAddOpen,
    setIsBalancerOpen,
    setIsPwaPromptOpen,
    currentUser,
    setActiveView
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const conflicts = detectOverlaps(todayActivities);

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  const formattedClock = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: settings.timeFormat === '12h'
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#0B0F17]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 pt-safe transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Greeting & Date */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {getGreeting()}, {settings.userName}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 font-mono">
              {settings.timezone}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              {formatDisplayDate(selectedDate)}
            </h1>
            <span className="text-xs sm:text-sm font-mono font-medium text-slate-500 dark:text-slate-400">
              {formattedClock}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Smart Balancer Conflict Alert Trigger */}
          {conflicts.length > 0 && (
            <button
              onClick={() => setIsBalancerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all animate-pulse"
              title="Time overlap detected. Open Smart Balancer."
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">Conflicts ({conflicts.length})</span>
              <span className="md:hidden">{conflicts.length}</span>
            </button>
          )}

          {/* Today's completion ring badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
            title={`${todayCompletedCount} of ${todayActivities.length} items completed today`}
          >
            <ProgressRing progress={todayCompletionPercentage} size={28} strokeWidth={3}>
              <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {todayCompletionPercentage}%
              </span>
            </ProgressRing>
            <div className="text-left hidden lg:block">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-none">
                Daily Focus
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {todayCompletedCount}/{todayActivities.length} Done
              </div>
            </div>
          </div>

          {/* PWA Install Guide */}
          <button
            onClick={() => setIsPwaPromptOpen(true)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="Install App / PWA Instructions"
            aria-label="Install App"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Notification Center */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B0F17]" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Cloud Sync Status Pill */}
          <button
            onClick={() => setActiveView('settings')}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              currentUser
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
            }`}
            title={currentUser ? `Cloud Synced as ${currentUser.displayName || currentUser.email}` : 'Click to connect Google Cloud'}
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="" className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <Cloud className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-500' : 'text-slate-400'}`} />
            )}
            <span className="hidden md:inline text-[11px] font-bold">
              {currentUser ? 'Cloud Synced' : 'Sync'}
            </span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>
    </header>
  );
};
