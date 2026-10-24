import React, { useState } from 'react';
import { Flame, CheckCircle2, Circle, Plus, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';

export const DailyHabitsWidget: React.FC = () => {
  const { dailyHabits, toggleHabit, addHabit } = useApp();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const today = getTodayDateString();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit(newHabitTitle.trim(), 'General');
    setNewHabitTitle('');
    setIsAdding(false);
  };

  const completedTodayCount = dailyHabits.filter((h) =>
    h.completedDates.includes(today)
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Habits & Streaks
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {completedTodayCount} of {dailyHabits.length} Done Today
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add Habit"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="New habit name..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Add
          </button>
        </form>
      )}

      {/* Habit items list */}
      <div className="space-y-2">
        {dailyHabits.map((habit) => {
          const isDone = habit.completedDates.includes(today);

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id, today)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="text-slate-300 dark:text-slate-600 hover:text-emerald-500"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-xs font-medium text-slate-800 dark:text-slate-200 ${
                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                  }`}
                >
                  {habit.title}
                </span>
              </div>

              {/* Streak badge */}
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{habit.streak}d</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
