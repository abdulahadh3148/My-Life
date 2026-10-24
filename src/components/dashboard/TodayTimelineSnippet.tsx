import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTime, parseTimeToMinutes, formatDuration, calculateDurationMinutes } from '../../utils/time';
import { CategoryBadge } from '../common/CategoryBadge';

export const TodayTimelineSnippet: React.FC = () => {
  const { todayActivities, toggleActivityComplete, setActiveView, settings } = useApp();

  const sortedActivities = React.useMemo(() => {
    return [...todayActivities].sort(
      (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
    );
  }, [todayActivities]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Schedule Timeline
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Click any circle to mark complete instantly
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('schedule')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
        >
          <span>Full Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sortedActivities.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No activities scheduled today.
          </div>
        ) : (
          sortedActivities.map((act) => {
            const duration = calculateDurationMinutes(act.startTime, act.endTime);

            return (
              <div
                key={act.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  act.completed
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                    : 'bg-white dark:bg-[#151C2A] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleActivityComplete(act.id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-emerald-500 shrink-0"
                  >
                    {act.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold text-slate-900 dark:text-slate-100 truncate ${
                        act.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {act.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {formatTime(act.startTime, settings.timeFormat)} – {formatTime(act.endTime, settings.timeFormat)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({formatDuration(duration)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <CategoryBadge category={act.category} size="sm" showIcon={false} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
