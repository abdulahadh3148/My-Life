import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Copy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Briefcase,
  Flame,
  Sprout,
  GraduationCap,
  Save,
  Sparkles,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  getStartOfWeek,
  addDays,
  formatDisplayDate,
  calculateDurationMinutes,
  formatDuration
} from '../../utils/time';
import { CATEGORIES } from '../../data/initialData';

export const WeeklyView: React.FC = () => {
  const {
    settings,
    activities,
    workSessions,
    growthSessions,
    workoutLogs,
    weeklyGoals,
    weeklyReview,
    updateWeeklyReview,
    copyPreviousWeekRoutine,
    addNotification
  } = useApp();

  const [currentWeekStart, setCurrentWeekStart] = useState<string>(() =>
    getStartOfWeek(new Date(), settings.weekStartsOn)
  );

  const [isCopyConfirmOpen, setIsCopyConfirmOpen] = useState(false);
  const [highlights, setHighlights] = useState(weeklyReview.highlights || '');
  const [challenges, setChallenges] = useState(weeklyReview.challenges || '');
  const [actionItems, setActionItems] = useState(weeklyReview.actionItems || '');
  const [isSavingReview, setIsSavingReview] = useState(false);

  // 7 days of the week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  // Aggregate stats across the 7 days
  const weekActivities = activities.filter((a) => weekDays.includes(a.date));
  const completedActivitiesCount = weekActivities.filter((a) => a.completed).length;

  const totalWorkMinutes = workSessions
    .filter((s) => weekDays.includes(s.date))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const totalStudyMinutes = growthSessions
    .filter((s) => weekDays.includes(s.date))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const workoutsThisWeek = workoutLogs.filter((l) => weekDays.includes(l.date) && l.completed).length;

  const handleCopyRoutine = () => {
    const result = copyPreviousWeekRoutine();
    setIsCopyConfirmOpen(false);
    addNotification({
      title: 'Routine Copied',
      message: `Copied ${result.count} recurring activities from previous week into current week.`,
      type: 'system'
    });
  };

  const handleSaveReview = () => {
    setIsSavingReview(true);
    updateWeeklyReview({
      highlights,
      challenges,
      actionItems
    });
    setTimeout(() => setIsSavingReview(false), 800);
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Weekly Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-white dark:from-[#111724] dark:via-[#131929] dark:to-[#0E131E] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <CalendarDays className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Weekly Timetable & Review
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Week of {formatDisplayDate(currentWeekStart)} – {formatDisplayDate(weekDays[6])}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeekStart(getStartOfWeek(new Date(), settings.weekStartsOn))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCopyConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Previous Routine</span>
            </button>
          </div>
        </div>

        {/* 4 Weekly Consistency Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Work Hours */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Work Time</span>
              <Briefcase className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {formatDuration(totalWorkMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tracked deep focus</div>
          </div>

          {/* Study Hours */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Learning</span>
              <GraduationCap className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {formatDuration(totalStudyMinutes)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">HNDIT & Coding</div>
          </div>

          {/* Workouts */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Core Fitness</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {workoutsThisWeek} sessions
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Abdominal routine</div>
          </div>

          {/* Task Completion */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Routines Met</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {completedActivitiesCount} done
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across 7 days</div>
          </div>
        </div>
      </div>

      {/* 7-Day Timetable Grid */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          7-Day Schedule Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((dStr) => {
            const [y, m, d] = dStr.split('-').map(Number);
            const dateObj = new Date(y, m - 1, d);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            const dayActs = activities.filter((a) => a.date === dStr);
            const dayDone = dayActs.filter((a) => a.completed).length;

            return (
              <div
                key={dStr}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#161D2C]/60 flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {dayName}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{d}</span>
                  </div>

                  <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-0.5">
                    {dayActs.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">No items</span>
                    ) : (
                      dayActs.slice(0, 4).map((act) => (
                        <div
                          key={act.id}
                          className="px-2 py-1 rounded-lg text-[10px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 truncate"
                          title={`${act.startTime} ${act.title}`}
                        >
                          <span className="font-mono opacity-70 mr-1">{act.startTime}</span>
                          <span>{act.title}</span>
                        </div>
                      ))
                    )}
                    {dayActs.length > 4 && (
                      <div className="text-[10px] text-slate-400 font-medium pl-1">
                        +{dayActs.length - 4} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-slate-400 text-right">
                  {dayDone}/{dayActs.length} Done
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Review & Reflection Notes */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Review & Reflection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reflect on achievements, resolve friction points, and set action items for next week
            </p>
          </div>

          <button
            onClick={handleSaveReview}
            disabled={isSavingReview}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingReview ? 'Saved!' : 'Save Review'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              Highlights & Wins
            </label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="What went exceptionally well this week?..."
              rows={4}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1.5">
              Obstacles & Friction Points
            </label>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="What drained focus or interrupted routine?..."
              rows={4}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1.5">
              Action Items for Next Week
            </label>
            <textarea
              value={actionItems}
              onChange={(e) => setActionItems(e.target.value)}
              placeholder="Specific systemic tweaks to test next week..."
              rows={4}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Copy Routine Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCopyConfirmOpen}
        onClose={() => setIsCopyConfirmOpen(false)}
        onConfirm={handleCopyRoutine}
        title="Copy Routine From Previous Week"
        message="This will replicate recurring scheduled activities from the previous 7 days into this week, skipping any duplicates. Existing activities will not be deleted."
        confirmLabel="Copy Routine"
        isDestructive={false}
      />
    </div>
  );
};
