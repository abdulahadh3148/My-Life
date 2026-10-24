import React, { useMemo } from 'react';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Flame,
  Sprout,
  GraduationCap,
  Target,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../common/EmptyState';
import {
  getTodayDateString,
  addDays,
  formatDuration,
  calculateDurationMinutes
} from '../../utils/time';

export const AnalyticsView: React.FC = () => {
  const {
    activities,
    workSessions,
    growthSessions,
    workoutLogs,
    gardeningTasks,
    weeklyGoals
  } = useApp();

  const today = getTodayDateString();

  // Past 7 days
  const past7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  }, [today]);

  // 1. Scheduled vs Actual Work Time data
  const workComparisonData = useMemo(() => {
    return past7Days.map((dStr) => {
      const scheduledMins = activities
        .filter((a) => a.date === dStr && a.category === 'work')
        .reduce((sum, a) => sum + calculateDurationMinutes(a.startTime, a.endTime), 0);

      const actualMins = workSessions
        .filter((s) => s.date === dStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      const [y, m, d] = dStr.split('-').map(Number);
      const dayLabel = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'narrow' });

      return {
        date: dStr,
        dayLabel,
        scheduledMins,
        actualMins
      };
    });
  }, [past7Days, activities, workSessions]);

  const maxWorkMins = Math.max(
    180,
    ...workComparisonData.map((d) => Math.max(d.scheduledMins, d.actualMins))
  );

  // 2. Learning Hours by Category
  const learningByCategory = useMemo(() => {
    const map: Record<string, number> = {
      coding: 0,
      hndit: 0,
      english: 0,
      reading: 0,
      other: 0
    };

    growthSessions.forEach((s) => {
      // Find goal category
      const cat = s.goalId.includes('1')
        ? 'coding'
        : s.goalId.includes('2')
        ? 'hndit'
        : s.goalId.includes('3')
        ? 'english'
        : 'reading';
      map[cat] = (map[cat] || 0) + s.durationMinutes;
    });

    return map;
  }, [growthSessions]);

  const totalLearningMinutes = Object.values(learningByCategory).reduce((a, b) => a + b, 0);

  // 3. Routine Completion Rate over past 7 days
  const dailyCompletionRate = useMemo(() => {
    return past7Days.map((dStr) => {
      const acts = activities.filter((a) => a.date === dStr);
      const done = acts.filter((a) => a.completed).length;
      const rate = acts.length > 0 ? Math.round((done / acts.length) * 100) : 0;

      const [y, m, d] = dStr.split('-').map(Number);
      const label = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'narrow' });

      return {
        date: dStr,
        label,
        total: acts.length,
        done,
        rate
      };
    });
  }, [past7Days, activities]);

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Analytics Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-[#111728] dark:via-[#131A2D] dark:to-[#0F1420] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Productivity & Consistency Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live quantitative telemetry derived strictly from your tracked schedule, work timers, and logs.
            </p>
          </div>
        </div>
      </div>

      {/* Grid 1: Scheduled vs Actual Work & Routine Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Scheduled vs Actual Work Time */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scheduled vs Actual Work Time
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Past 7 days grouped comparison (Minutes)
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Scheduled
              </span>
              <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Actual
              </span>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800/80">
            {workComparisonData.map((item) => {
              const scheduledHeight = Math.max(6, (item.scheduledMins / maxWorkMins) * 100);
              const actualHeight = Math.max(6, (item.actualMins / maxWorkMins) * 100);

              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Scheduled bar */}
                    <div
                      className="w-3 rounded-t bg-slate-200 dark:bg-slate-700 transition-all group-hover:opacity-80"
                      style={{ height: `${scheduledHeight}%` }}
                      title={`Scheduled: ${formatDuration(item.scheduledMins)}`}
                    />
                    {/* Actual bar */}
                    <div
                      className="w-3 rounded-t bg-indigo-500 transition-all group-hover:bg-indigo-400"
                      style={{ height: `${actualHeight}%` }}
                      title={`Actual: ${formatDuration(item.actualMins)}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono mt-1">
                    {item.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Daily Completion Rate Trend */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Routine Completion Rate
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Percentage of scheduled daily blocks checked off
              </p>
            </div>
          </div>

          {/* Bar & percentage graph */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800/80">
            {dailyCompletionRate.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.rate}%
                </span>
                <div
                  className="w-6 rounded-t bg-emerald-500/80 group-hover:bg-emerald-400 transition-all"
                  style={{ height: `${Math.max(8, d.rate)}%` }}
                  title={`${d.done}/${d.total} Done (${d.rate}%)`}
                />
                <span className="text-[10px] font-bold text-slate-500 font-mono mt-1">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Learning Breakdown & Discipline Consistency Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Learning Distribution */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Learning Hours Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Total Recorded: {formatDuration(totalLearningMinutes)} across curriculum
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Fullstack Coding (React & TS)', mins: learningByCategory.coding, color: 'bg-cyan-500' },
              { label: 'HNDIT Diploma Curriculum', mins: learningByCategory.hndit, color: 'bg-purple-500' },
              { label: 'English Pronunciation & Fluency', mins: learningByCategory.english, color: 'bg-emerald-500' },
              { label: 'Technical Reading', mins: learningByCategory.reading, color: 'bg-amber-500' }
            ].map((item) => {
              const percent = totalLearningMinutes > 0 ? Math.round((item.mins / totalLearningMinutes) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    <span className="font-mono text-slate-400">{formatDuration(item.mins)} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Outcomes Progress */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Outcomes Completion
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live tracking toward target milestone quotas
            </p>
          </div>

          <div className="space-y-3">
            {weeklyGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{goal.title}</span>
                    <span className="font-mono text-slate-400">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${goal.completed ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
