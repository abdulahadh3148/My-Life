import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Plus,
  Flame,
  Sprout,
  Moon,
  GraduationCap,
  CalendarDays,
  BarChart2,
  Settings,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setIsQuickAddOpen } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const moreItems: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'fitness', label: 'Fitness & Core', icon: Flame },
    { id: 'gardening', label: 'Gardening', icon: Sprout },
    { id: 'prayer', label: 'Prayer Times', icon: Moon },
    { id: 'growth', label: 'Personal Growth', icon: GraduationCap },
    { id: 'weekly', label: 'Weekly Planner', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSelectMoreItem = (id: NavView) => {
    setActiveView(id);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* More Navigation Drawer Sheet for Mobile */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsMoreMenuOpen(false)} />
          <div className="relative w-full rounded-t-3xl bg-white dark:bg-[#121824] border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-10 pb-safe">
            {/* Sheet Handle */}
            <div className="flex justify-center -mt-2 mb-3">
              <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                More Modules
              </h3>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 py-2">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreItem(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-1.5 ${isActive ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="text-xs font-medium leading-tight line-clamp-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main iPhone Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pb-safe select-none">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          {/* Schedule */}
          <button
            onClick={() => setActiveView('schedule')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'schedule'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1">Schedule</span>
          </button>

          {/* Center Elevated Quick Add Button */}
          <div className="flex-1 flex justify-center -mt-5">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 active:scale-90 transition-transform border-4 border-slate-50 dark:border-[#0B0F17]"
              aria-label="Add activity"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Work */}
          <button
            onClick={() => setActiveView('work')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeView === 'work'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-1">Work</span>
          </button>

          {/* More Menu */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isMoreMenuOpen || moreItems.some(i => i.id === activeView)
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
