import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Tag,
  Flag,
  Lock,
  Unlock,
  Bell,
  Repeat,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Activity, ActivityCategory } from '../../types';
import { CATEGORIES } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { calculateDurationMinutes, formatDuration, parseTimeToMinutes } from '../../utils/time';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivity?: Activity | null;
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultDate?: string;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  initialActivity,
  defaultStartTime = '09:00',
  defaultEndTime = '10:00',
  defaultDate
}) => {
  const { addActivity, updateActivity, activities, selectedDate } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || selectedDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [category, setCategory] = useState<ActivityCategory>('work');
  const [isFixed, setIsFixed] = useState(false);
  const [priority, setPriority] = useState<Activity['priority']>('medium');
  const [reminder, setReminder] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setDescription(initialActivity.description || '');
      setDate(initialActivity.date);
      setStartTime(initialActivity.startTime);
      setEndTime(initialActivity.endTime);
      setCategory(initialActivity.category);
      setIsFixed(initialActivity.isFixed);
      setPriority(initialActivity.priority);
      setReminder(initialActivity.reminder);
      setIsRecurring(initialActivity.isRecurring);
    } else {
      setTitle('');
      setDescription('');
      setDate(defaultDate || selectedDate);
      setStartTime(defaultStartTime);
      setEndTime(defaultEndTime);
      setCategory('work');
      setIsFixed(false);
      setPriority('medium');
      setReminder(true);
      setIsRecurring(false);
    }
    setError(null);
  }, [initialActivity, isOpen, defaultStartTime, defaultEndTime, defaultDate, selectedDate]);

  const duration = useMemo(() => {
    return calculateDurationMinutes(startTime, endTime);
  }, [startTime, endTime]);

  // Check if current slot conflicts with any existing item on selected date
  const potentialConflicts = useMemo(() => {
    if (!startTime || !endTime) return [];
    const myStart = parseTimeToMinutes(startTime);
    let myEnd = parseTimeToMinutes(endTime);
    if (myEnd <= myStart) myEnd += 1440;

    return activities.filter((act) => {
      if (act.date !== date) return false;
      if (initialActivity && act.id === initialActivity.id) return false;

      const actStart = parseTimeToMinutes(act.startTime);
      let actEnd = parseTimeToMinutes(act.endTime);
      if (actEnd <= actStart) actEnd += 1440;

      return myStart < actEnd && myEnd > actStart;
    });
  }, [activities, date, startTime, endTime, initialActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Activity title is required.');
      return;
    }

    if (startTime === endTime) {
      setError('Start time and End time cannot be identical.');
      return;
    }

    if (initialActivity) {
      updateActivity(initialActivity.id, {
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime,
        category,
        isFixed,
        priority,
        reminder,
        isRecurring
      });
    } else {
      addActivity({
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime,
        category,
        isFixed,
        priority,
        completed: false,
        reminder,
        isRecurring
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialActivity ? 'Edit Activity' : 'Create New Activity'}
      subtitle="Schedule routines, deep work, prayer, workouts or learning blocks"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Real-time Overlap Notice */}
        {potentialConflicts.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <span className="font-semibold">Notice: Overlaps with {potentialConflicts.length} activity(ies):</span>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                {potentialConflicts.map((c) => (
                  <li key={c.id}>
                    "{c.title}" ({c.startTime} – {c.endTime}){c.isFixed ? ' [Locked Fixed]' : ' [Flexible]'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Activity Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep Work Session, Fajr Prayer, Core Workout"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Description / Checklist Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key outcomes, agenda, or relevant links..."
            rows={2}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Date & Times Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Calculated Duration pill */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Scheduled Duration:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800/80 rounded-xl">
            {Object.values(CATEGORIES).map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    isSelected
                      ? `${cat.bgColor} ${cat.darkBgColor} ring-2 ring-emerald-500 font-bold`
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority & Fixed Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" /> Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical / Essential</option>
            </select>
          </div>

          {/* Fixed / Flexible Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
              <div className="flex items-center gap-2">
                {isFixed ? (
                  <Lock className="w-4 h-4 text-amber-500" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isFixed ? 'Fixed Commitment' : 'Flexible Time Slot'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isFixed ? 'Locked: Smart Balancer never shifts' : 'Can be rebalanced if clashing'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Reminder & Recurring Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span>Enable Reminder Alert</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <Repeat className="w-3.5 h-3.5 text-slate-400" />
            <span>Repeat Daily</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            {initialActivity ? 'Save Changes' : 'Add to Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
