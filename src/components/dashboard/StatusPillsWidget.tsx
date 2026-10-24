import React from 'react';
import { Flame, Sprout, CheckCircle2, ArrowRight, Droplets } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, addDays } from '../../utils/time';

export const StatusPillsWidget: React.FC = () => {
  const {
    plants,
    waterPlant,
    workoutLogs,
    workoutPlans,
    setActiveView
  } = useApp();

  const today = getTodayDateString();

  // Determine plants that need watering today
  const duePlants = plants.filter((p) => {
    if (!p.lastWateredDate) return true;
    const nextWaterDate = addDays(p.lastWateredDate, p.wateringFrequencyDays);
    return nextWaterDate <= today;
  });

  // Workout status today
  const todayWorkoutLog = workoutLogs.find((l) => l.date === today && l.completed);
  const activePlan = workoutPlans[0]; // Monday / Core routine

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Fitness Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fitness & Core
              </h3>
            </div>
            <button
              onClick={() => setActiveView('fitness')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 group"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="mt-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {todayWorkoutLog ? todayWorkoutLog.planTitle : activePlan?.title || 'Daily Workout'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {todayWorkoutLog
                ? `Logged ${todayWorkoutLog.durationMinutes} mins completed with focus.`
                : `${activePlan?.exercises.length || 5} exercises • Abdominal stability`}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Status</span>
          {todayWorkoutLog ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-500">
              Scheduled Today
            </span>
          )}
        </div>
      </div>

      {/* Gardening Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Garden Care
              </h3>
            </div>
            <button
              onClick={() => setActiveView('gardening')}
              className="text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 flex items-center gap-1 group"
            >
              <span>Plants</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="mt-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {duePlants.length === 0
                ? 'All plants sufficiently hydrated'
                : `${duePlants.length} Plant(s) Due for Watering`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {duePlants.length > 0
                ? duePlants.map((p) => p.name).join(', ')
                : 'Next inspection scheduled for tomorrow.'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">
            Total Plants: {plants.length}
          </span>
          {duePlants.length > 0 && (
            <button
              onClick={() => duePlants.forEach((p) => waterPlant(p.id))}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold transition-all active:scale-95"
            >
              <Droplets className="w-3 h-3" />
              <span>Water All Due</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
