import React from 'react';
import { Briefcase, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, getTodayDateString } from '../../utils/time';

export const QuickWorkWidget: React.FC = () => {
  const {
    settings,
    workSessions,
    workTasks,
    setActiveView
  } = useApp();

  const today = getTodayDateString();

  // Calculate actual tracked minutes today
  const trackedMinutesToday = workSessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const targetMinutes = settings.dailyWorkTargetMinutes || 180;
  const progressPercent = Math.min(100, Math.round((trackedMinutesToday / targetMinutes) * 100));

  const completedTasksToday = workTasks.filter((t) => t.date === today && t.completed).length;
  const totalTasksToday = workTasks.filter((t) => t.date === today).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Deep Work Progress
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Window: {settings.workWindowStart} – {settings.workWindowEnd}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('work')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Timer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Work Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatDuration(trackedMinutesToday)} tracked
            </span>
            <span className="font-mono text-slate-400">
              Target: {formatDuration(targetMinutes)}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tasks snippet */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Sprint Tasks: {completedTasksToday}/{totalTasksToday} Done</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      <button
        onClick={() => setActiveView('work')}
        className="mt-3 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        <span>Open Work Focus Mode</span>
      </button>
    </div>
  );
};
