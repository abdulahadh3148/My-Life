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
  Info,
  Video,
  ChevronDown,
  ChevronUp,
  Volume2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { WorkoutPlan, ExerciseItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';
import { getExerciseGuide } from '../../data/exerciseVideos';

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
  const { logWorkout, addNotification } = useApp();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState(0);
  const [showVideoDemo, setShowVideoDemo] = useState(false);

  const currentExercise: ExerciseItem | undefined = plan.exercises[currentExerciseIndex];
  const currentGuide = currentExercise ? getExerciseGuide(currentExercise.name) : null;

  // Reset exercise state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setTotalWorkoutSeconds(0);
      setIsResting(false);
      setIsTimerRunning(false);
      setShowVideoDemo(false);
    }
  }, [isOpen]);

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

  // Rest timer
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
      notes: `Finished ${plan.exercises.length} exercises with deliberate technique.`
    });

    addNotification({
      title: 'Workout Completed! 🔥',
      message: `Great job! Logged ${plan.title} (${durationMinutes} mins) into your fitness history.`,
      type: 'work'
    });

    onClose();
  };

  if (!currentExercise || !currentGuide) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan.title}
      subtitle={`Guided Routine • Exercise ${currentExerciseIndex + 1} of ${plan.exercises.length}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Rest Mode Banner */}
        {isResting ? (
          <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-center animate-pulse space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Rest & Recovery Interval
            </div>
            <div className="text-5xl font-black font-mono text-cyan-700 dark:text-cyan-300">
              {timerSeconds}s
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deep diaphragmatic breathing. Next up: <strong>Set {currentSet} of {currentExercise.name}</strong>
            </p>
            <button
              onClick={() => {
                setIsResting(false);
                setIsTimerRunning(false);
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:bg-cyan-600/30 transition-colors"
            >
              Skip Rest Interval
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
            <div className="flex items-center justify-center gap-3 text-xs font-mono font-bold">
              <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                Set {currentSet} of {currentExercise.sets}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 shadow-sm">
                {currentExercise.durationSeconds
                  ? `${currentExercise.durationSeconds}s Hold / Duration`
                  : `${currentExercise.reps} Repetitions`}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm">
                {currentExercise.restSeconds}s Rest
              </span>
            </div>

            {/* Toggle Video Demonstration */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowVideoDemo(!showVideoDemo)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-rose-600 dark:text-rose-400 hover:border-rose-400 transition-all shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{showVideoDemo ? 'Hide Video Demonstration' : 'Watch Technique Demonstration'}</span>
                {showVideoDemo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Embedded Video Demo Drawer */}
            {showVideoDemo && (
              <div className="mt-3 rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-md aspect-video animate-in fade-in">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentGuide.videoEmbedId}?rel=0&modestbranding=1`}
                  title={`${currentGuide.videoTitle} Form Demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {/* Instruction Callout */}
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-200 font-semibold mb-0.5">
                  Form Instruction:
                </strong>
                <span>{currentExercise.instructions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>Exercise {currentExerciseIndex + 1} of {plan.exercises.length}</span>
          <span>Elapsed: {Math.floor(totalWorkoutSeconds / 60)}m {totalWorkoutSeconds % 60}s</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            End Early
          </button>

          <button
            onClick={handleNextSet}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>
              {currentExerciseIndex === plan.exercises.length - 1 && currentSet === currentExercise.sets
                ? 'Finish Workout Routine'
                : isResting
                ? 'Skip Rest & Begin Set'
                : `Complete Set ${currentSet}`}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
