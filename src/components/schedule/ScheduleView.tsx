import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityCard } from './ActivityCard';
import { FreeTimeBlock } from './FreeTimeBlock';
import { ActivityFormModal } from './ActivityFormModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { Activity, ActivityCategory } from '../../types';
import {
  addDays,
  getTodayDateString,
  formatDisplayDate,
  parseTimeToMinutes
} from '../../utils/time';
import { detectOverlaps, findFreeSlots } from '../../utils/timeBalancer';
import { CATEGORIES } from '../../data/initialData';

export const ScheduleView: React.FC = () => {
  const {
    activities,
    deleteActivity,
    selectedDate,
    setSelectedDate,
    setIsBalancerOpen,
    settings
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; title: string } | null>(null);

  // Slot to pre-fill when user clicks "Add Here" on a FreeTimeBlock
  const [slotToFill, setSlotToFill] = useState<{ start: string; end: string } | null>(null);

  const today = getTodayDateString();

  // Filter activities for selected date
  const dayActivities = useMemo(() => {
    return activities
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
  }, [activities, selectedDate]);

  // Detected overlaps for selected day
  const conflicts = useMemo(() => {
    return detectOverlaps(dayActivities);
  }, [dayActivities]);

  const conflictingActivityIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.activityA.id);
      ids.add(c.activityB.id);
    });
    return ids;
  }, [conflicts]);

  // Free gaps in schedule for selected day
  const freeSlots = useMemo(() => {
    const wakeMin = parseTimeToMinutes(settings.wakeTime || '05:00');
    const sleepMin = parseTimeToMinutes(settings.sleepTime || '22:30');
    return findFreeSlots(dayActivities, wakeMin, sleepMin);
  }, [dayActivities, settings.wakeTime, settings.sleepTime]);

  // Apply category filter
  const filteredActivities = useMemo(() => {
    if (filterCategory === 'all') return dayActivities;
    return dayActivities.filter((a) => a.category === filterCategory);
  }, [dayActivities, filterCategory]);

  // Generate 7-day strip around selected date
  const dateStrip = useMemo(() => {
    const days: { dateStr: string; dayName: string; dayNumber: number }[] = [];
    for (let i = -3; i <= 3; i++) {
      const dStr = addDays(selectedDate, i);
      const [y, m, d] = dStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      days.push({
        dateStr: dStr,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNumber: dateObj.getDate()
      });
    }
    return days;
  }, [selectedDate]);

  const handleOpenEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setSlotToFill(null);
    setIsFormOpen(true);
  };

  const handleOpenFillSlot = (start: string, end: string) => {
    setEditingActivity(null);
    setSlotToFill({ start, end });
    setIsFormOpen(true);
  };

  const handleOpenNew = () => {
    setEditingActivity(null);
    setSlotToFill(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingTarget) {
      deleteActivity(deletingTarget.id);
      setDeletingTarget(null);
    }
  };

  return (
    <div className="space-y-5 pb-safe-nav">
      {/* Date Navigation & Calendar Strip */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatDisplayDate(selectedDate)}
            </h2>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedDate !== today && (
              <button
                onClick={() => setSelectedDate(today)}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                Today
              </button>
            )}
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Activity</span>
            </button>
          </div>
        </div>

        {/* 7-Day Quick Strip */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {dateStrip.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            const isToday = item.dateStr === today;
            const hasActivities = activities.some((a) => a.date === item.dateStr);

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/20 scale-[1.03]'
                    : isToday
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold">{item.dayName}</span>
                <span className="text-sm font-bold font-mono mt-0.5">{item.dayNumber}</span>
                {hasActivities && (
                  <span
                    className={`w-1 h-1 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlap Alert Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {conflicts.length} Overlapping Activity Block(s) Detected
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Two or more activities have conflicting time intervals. Smart Balancer can propose non-overlapping slots.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBalancerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Smart Balancer</span>
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            filterCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All Activities ({dayActivities.length})
        </button>
        {Object.values(CATEGORIES).map((cat) => {
          const count = dayActivities.filter((a) => a.category === cat.id).length;
          if (count === 0 && filterCategory !== cat.id) return null;
          const isSelected = filterCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className="opacity-70 font-mono text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Activities Timeline & Free Blocks */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No Activities Scheduled"
          description={`Your schedule for ${formatDisplayDate(selectedDate)} is currently clear. Add a work session, workout, prayer, or routine.`}
          actionLabel="Add Activity"
          onAction={handleOpenNew}
        />
      ) : (
        <div className="space-y-2">
          {/* If viewing all, interleave free slots */}
          {filterCategory === 'all' ? (
            <>
              {filteredActivities.map((activity, index) => {
                const nextAct = filteredActivities[index + 1];
                let freeGapSlot: { start: string; end: string; durationMinutes: number } | null = null;

                if (nextAct) {
                  const currEndMin = parseTimeToMinutes(activity.endTime);
                  const nextStartMin = parseTimeToMinutes(nextAct.startTime);
                  if (nextStartMin > currEndMin) {
                    const diff = nextStartMin - currEndMin;
                    if (diff >= 15) {
                      freeGapSlot = {
                        start: activity.endTime,
                        end: nextAct.startTime,
                        durationMinutes: diff
                      };
                    }
                  }
                }

                return (
                  <React.Fragment key={activity.id}>
                    <ActivityCard
                      activity={activity}
                      hasConflict={conflictingActivityIds.has(activity.id)}
                      onEdit={handleOpenEdit}
                      onDelete={(id, title) => setDeletingTarget({ id, title })}
                    />
                    {freeGapSlot && (
                      <FreeTimeBlock
                        slot={freeGapSlot}
                        onFillSlot={handleOpenFillSlot}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                hasConflict={conflictingActivityIds.has(activity.id)}
                onEdit={handleOpenEdit}
                onDelete={(id, title) => setDeletingTarget({ id, title })}
              />
            ))
          )}
        </div>
      )}

      {/* Activity Create / Edit Modal */}
      <ActivityFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialActivity={editingActivity}
        defaultStartTime={slotToFill?.start || '09:00'}
        defaultEndTime={slotToFill?.end || '10:00'}
        defaultDate={selectedDate}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTarget}
        onClose={() => setDeletingTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        message={`Are you sure you want to delete "${deletingTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
