import React from 'react';
import {
  Briefcase,
  Clock,
  Target,
  CalendarCheck,
  TrendingUp,
  Settings as SettingsIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkTimer } from './WorkTimer';
import { WorkTaskChecklist } from './WorkTaskChecklist';
import { WorkHistoryList } from './WorkHistoryList';
import { formatDuration, getTodayDateString, calculateDurationMinutes } from '../../utils/time';

export const WorkView: React.FC = () => {
  const { settings, workSessions, activities, setActiveView } = useApp();
  const today = getTodayDateString();

  // Scheduled work duration from activities
  const scheduledMinutesToday = activities
    .filter((a) => a.date === today && a.category === 'work')
    .reduce((sum, a) => sum + calculateDurationMinutes(a.startTime, a.endTime), 0);

  // Actual tracked work duration from sessions
  const trackedMinutesToday = workSessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const targetMinutes = settings.dailyWorkTargetMinutes || 180;
  const progressPercent = Math.min(100, Math.round((trackedMinutesToday / targetMinutes) * 100));

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Top Header & Scheduled vs Tracked Metrics */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-[#111726] dark:via-[#131A2B] dark:to-[#0E1422] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Work Focus & Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Standard Daily Target: {formatDuration(targetMinutes)} • Preferred Window: {settings.workWindowStart} – {settings.workWindowEnd}
            </p>
          </div>

          <button
            onClick={() => setActiveView('settings')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Target Settings</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Daily Target */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Daily Target</span>
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {formatDuration(targetMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Approx. 3 hours baseline</div>
          </div>

          {/* Card 2: Scheduled in Routine */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Scheduled Today</span>
              <CalendarCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {formatDuration(scheduledMinutesToday)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Planned in daily schedule</div>
          </div>

          {/* Card 3: Actual Tracked */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Actual Tracked</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatDuration(trackedMinutesToday)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono font-medium">
              {progressPercent}% of target logged
            </div>
          </div>
        </div>
      </div>

      {/* Focus Timer */}
      <WorkTimer />

      {/* Sprint Tasks and History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WorkTaskChecklist />
        <WorkHistoryList />
      </div>
    </div>
  );
};
