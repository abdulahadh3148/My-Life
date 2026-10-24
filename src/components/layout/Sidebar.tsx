import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Flame,
  Sprout,
  Moon,
  GraduationCap,
  CalendarDays,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';
import { detectOverlaps } from '../../utils/timeBalancer';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, todayActivities, setIsBalancerOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const conflicts = detectOverlaps(todayActivities);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Daily Schedule', icon: Calendar, badge: conflicts.length > 0 ? `${conflicts.length}!` : undefined },
    { id: 'work', label: 'Work Focus', icon: Briefcase },
    { id: 'fitness', label: 'Fitness & Core', icon: Flame },
    { id: 'gardening', label: 'Gardening', icon: Sprout },
    { id: 'prayer', label: 'Prayer Times', icon: Moon },
    { id: 'growth', label: 'Personal Growth', icon: GraduationCap },
    { id: 'weekly', label: 'Weekly Planner', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0E131E]/80 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-950/20">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MyLife <span className="text-emerald-500 font-black">OS</span>
              </div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Personal System
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active Bar indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}
              />
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Smart Balancer Quick Assistant Button on Sidebar */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-100 dark:via-slate-900/60 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Smart Time Balancer
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-snug">
            {conflicts.length > 0
              ? `${conflicts.length} scheduling clash(es) detected.`
              : 'Schedule is balanced with zero time overlaps.'}
          </p>
          <button
            onClick={() => setIsBalancerOpen(true)}
            className="w-full py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-sm transition-all text-center"
          >
            {conflicts.length > 0 ? 'Resolve Clashes' : 'Inspect Timeline'}
          </button>
        </div>
      )}

      {/* Collapse button at bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <span className="flex items-center gap-1.5"><ChevronLeft className="w-3.5 h-3.5" /> Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
