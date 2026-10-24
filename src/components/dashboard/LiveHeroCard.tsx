import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTime, formatDuration, getGreeting, parseTimeToMinutes } from '../../utils/time';
import { ProgressRing } from '../common/ProgressRing';
import { CategoryBadge } from '../common/CategoryBadge';
import { detectOverlaps } from '../../utils/timeBalancer';

export const LiveHeroCard: React.FC = () => {
  const {
    settings,
    todayActivities,
    todayCompletedCount,
    todayCompletionPercentage,
    nextUpcomingActivity,
    toggleActivityComplete,
    setActiveView,
    setIsBalancerOpen
  } = useApp();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const conflicts = detectOverlaps(todayActivities);

  // Minutes until next activity
  const minutesUntilNext = React.useMemo(() => {
    if (!nextUpcomingActivity) return null;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = parseTimeToMinutes(nextUpcomingActivity.startTime);
    return startMins - currentMins;
  }, [nextUpcomingActivity, now]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-[#111723] dark:via-[#0F1420] dark:to-emerald-950/20 p-5 sm:p-6 shadow-sm">
      {/* Decorative ambient subtle glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Summary & Greeting */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Daily Momentum</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {todayCompletedCount === todayActivities.length && todayActivities.length > 0
                ? 'All Daily Goals Accomplished!'
                : `${todayActivities.length - todayCompletedCount} Activities Remaining`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
              {todayCompletedCount} of {todayActivities.length} scheduled blocks completed. Keep maintaining your steady rhythm.
            </p>
          </div>

          {/* Conflict Alert Link if clashing */}
          {conflicts.length > 0 && (
            <button
              onClick={() => setIsBalancerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{conflicts.length} time overlap(s) need balancing</span>
            </button>
          )}
        </div>

        {/* Center / Right: Circular progress & Next Event Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/70 dark:bg-[#161D2C]/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shrink-0">
          {/* Progress Ring */}
          <div className="flex items-center gap-3">
            <ProgressRing
              progress={todayCompletionPercentage}
              size={68}
              strokeWidth={7}
              color="#10B981"
            >
              <div className="text-center">
                <div className="text-xs font-black font-mono text-slate-900 dark:text-white">
                  {todayCompletionPercentage}%
                </div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  Done
                </div>
              </div>
            </ProgressRing>
          </div>

          {/* Next Up Activity */}
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4 min-w-[200px]">
            <div className="flex items-center justify-between gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> Next Up
              </span>
              {minutesUntilNext !== null && (
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {minutesUntilNext <= 0 ? 'Happening now' : `in ${minutesUntilNext}m`}
                </span>
              )}
            </div>

            {nextUpcomingActivity ? (
              <div className="mt-1.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[210px]">
                  {nextUpcomingActivity.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {formatTime(nextUpcomingActivity.startTime, settings.timeFormat)}
                  </span>
                  <CategoryBadge category={nextUpcomingActivity.category} size="sm" />
                </div>
                <button
                  onClick={() => toggleActivityComplete(nextUpcomingActivity.id)}
                  className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
                >
                  <span>Mark Completed</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="mt-1.5 text-xs text-slate-400">
                No more upcoming events today. Great work!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
