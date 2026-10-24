import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WorkoutPlan, ExerciseItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';

interface WorkoutPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WorkoutPlan;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const { logWorkout } = useApp();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState(0);

  const currentExercise: ExerciseItem | undefined = plan.exercises[currentExerciseIndex];

  // Overall workout timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen) {
      interval = setInterval(() => {
        setTotalWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Exercise or Rest timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (isResting) {
              setIsResting(false); // Rest completed
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, isResting]);

  const handleStartRest = () => {
    if (!currentExercise) return;
    setIsResting(true);
    setTimerSeconds(currentExercise.restSeconds || 30);
    setIsTimerRunning(true);
  };

  const handleNextSet = () => {
    if (!currentExercise) return;
    if (currentSet < currentExercise.sets) {
      setCurrentSet((prev) => prev + 1);
      handleStartRest();
    } else {
      // Completed all sets for this exercise, advance to next exercise
      if (currentExerciseIndex < plan.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        handleStartRest();
      } else {
        // Entire workout finished!
        handleFinishWorkout();
      }
    }
  };

  const handleFinishWorkout = () => {
    const durationMinutes = Math.max(1, Math.round(totalWorkoutSeconds / 60));
    logWorkout({
      date: getTodayDateString(),
      planId: plan.id,
      planTitle: plan.title,
      completed: true,
      durationMinutes,
      notes: 'Completed guided routine with deliberate abdominal control.'
    });
    onClose();
  };

  if (!currentExercise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan.title}
      subtitle={`Guided Player • Exercise ${currentExerciseIndex + 1} of ${plan.exercises.length}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Rest Mode Banner */}
        {isResting ? (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center animate-pulse">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Rest & Recovery Interval
            </div>
            <div className="text-4xl font-black font-mono text-cyan-700 dark:text-cyan-300 my-1">
              {timerSeconds}s
            </div>
            <p className="text-xs text-slate-500">
              Deep diaphragmatic breathing. Next up: Set {currentSet}
            </p>
            <button
              onClick={() => {
                setIsResting(false);
                setIsTimerRunning(false);
              }}
              className="mt-2 text-xs font-semibold text-cyan-600 underline"
            >
              Skip Rest
            </button>
          </div>
        ) : (
          /* Active Exercise Banner */
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 via-slate-50 dark:via-slate-900 to-rose-500/5 border border-rose-500/20 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Target: {currentExercise.targetMuscle}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentExercise.name}
            </h3>

            {/* Set and Rep / Duration */}
            <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                Set {currentSet} of {currentExercise.sets}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 shadow-sm">
                {currentExercise.durationSeconds
                  ? `${currentExercise.durationSeconds}s Duration`
                  : `${currentExercise.reps} Repetitions`}
              </span>
            </div>

            {/* Instruction Callout */}
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{currentExercise.instructions}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-mono text-slate-400">
            Total Elapsed: {Math.floor(totalWorkoutSeconds / 60)}m {totalWorkoutSeconds % 60}s
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextSet}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>
                {currentExerciseIndex === plan.exercises.length - 1 && currentSet === currentExercise.sets
                  ? 'Finish Workout'
                  : 'Complete Set'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
