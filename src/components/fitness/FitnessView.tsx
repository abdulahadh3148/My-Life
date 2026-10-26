import React, { useState } from 'react';
import {
  Flame,
  Play,
  CheckCircle2,
  Calendar,
  History,
  Shield,
  Dumbbell,
  Clock,
  Sparkles,
  Video,
  ExternalLink,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutPlayerModal } from './WorkoutPlayerModal';
import { ExerciseVideoModal } from './ExerciseVideoModal';
import { formatDuration, formatDisplayDate, getTodayDateString } from '../../utils/time';
import { WorkoutPlan, ExerciseItem } from '../../types';

export const FitnessView: React.FC = () => {
  const { workoutPlans, workoutLogs, logWorkout } = useApp();
  const [activePlan, setActivePlan] = useState<WorkoutPlan>(workoutPlans[0] || {} as WorkoutPlan);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedVideoExercise, setSelectedVideoExercise] = useState<ExerciseItem | null>(null);

  const today = getTodayDateString();
  const todayCompletedLog = workoutLogs.find((l) => l.date === today && l.completed);

  const totalWorkouts = workoutLogs.filter((l) => l.completed).length;
  const totalMinutes = workoutLogs
    .filter((l) => l.completed)
    .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  const handleManualComplete = () => {
    logWorkout({
      date: today,
      planId: activePlan.id,
      planTitle: activePlan.title,
      completed: true,
      durationMinutes: activePlan.estimatedMinutes,
      notes: 'Manually logged workout completion.'
    });
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Fitness Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-rose-50/20 to-white dark:from-[#191118] dark:via-[#16121D] dark:to-[#0F1420] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Flame className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fitness & Core Training
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Targeted abdominal stability, posture alignment, and functional endurance. Includes video demonstrations, rest interval timers, and workout history.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {todayCompletedLog ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Today's Routine Finished</span>
              </div>
            ) : (
              <button
                onClick={() => setIsPlayerOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-950/20 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Guided Workout</span>
              </button>
            )}
          </div>
        </div>

        {/* Real User Workout Statistics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Workouts Done</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{totalWorkouts}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Time</span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">{totalMinutes}m</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Routine</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate block mt-1">
              {activePlan.title ? activePlan.title.split(' ')[0] : 'Core'}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {workoutPlans.map((plan) => {
          const isSelected = activePlan.id === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan)}
              className={`px-3.5 py-2 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{plan.title}</span>
              {plan.isRestDay && (
                <span className="text-[10px] uppercase font-bold opacity-80">(Rest)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Workout Plan Details */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activePlan.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Focus: {activePlan.focusArea} • Estimated: {activePlan.estimatedMinutes} mins • {activePlan.exercises?.length || 0} exercises
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!todayCompletedLog && (
              <button
                onClick={handleManualComplete}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Mark as Done
              </button>
            )}
            <button
              onClick={() => setIsPlayerOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              Start Guided Workout
            </button>
          </div>
        </div>

        {/* Exercises List with Video Demonstration Action */}
        <div className="space-y-3">
          {activePlan.exercises?.map((ex, idx) => (
            <div
              key={ex.id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151C2A] space-y-3 transition-all hover:border-rose-400/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ex.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target: {ex.targetMuscle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {ex.sets} sets
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                      {ex.durationSeconds ? `${ex.durationSeconds}s` : `${ex.reps} reps`}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {ex.restSeconds}s rest
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedVideoExercise(ex)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white text-xs font-bold transition-all shadow-sm"
                    title={`Watch demonstration video for ${ex.name}`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {ex.instructions}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Workout History */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workout History & Progress
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {workoutLogs.length} total logged sessions
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {workoutLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No workouts logged yet. Start your first guided routine above!
            </div>
          ) : (
            workoutLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151C2A] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {log.planTitle}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDisplayDate(log.date)} • {log.notes || 'Completed full workout.'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {formatDuration(log.durationMinutes)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Interactive Workout Player Modal */}
      {isPlayerOpen && (
        <WorkoutPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          plan={activePlan}
        />
      )}

      {/* Demonstration Video Modal */}
      <ExerciseVideoModal
        isOpen={!!selectedVideoExercise}
        onClose={() => setSelectedVideoExercise(null)}
        exercise={selectedVideoExercise}
        onStartExercise={() => setIsPlayerOpen(true)}
      />
    </div>
  );
};
