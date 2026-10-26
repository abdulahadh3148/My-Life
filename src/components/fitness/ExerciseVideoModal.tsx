import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  Wind,
  ShieldCheck,
  Video,
  Play,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ExerciseItem } from '../../types';
import { getExerciseGuide, ExerciseGuide } from '../../data/exerciseVideos';

interface ExerciseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseItem | null;
  onStartExercise?: (exercise: ExerciseItem) => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  isOpen,
  onClose,
  exercise,
  onStartExercise
}) => {
  const [videoError, setVideoError] = useState(false);

  if (!exercise) return null;

  const guide: ExerciseGuide = getExerciseGuide(exercise.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      subtitle={`Form Demonstration • Target: ${exercise.targetMuscle}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-1">
        {/* Video Embed Player */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md aspect-video flex items-center justify-center">
          {!videoError ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${guide.videoEmbedId}?rel=0&modestbranding=1&enablejsapi=1`}
              title={`${guide.videoTitle} Demonstration`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">Video Player Offline</div>
              <p className="text-xs text-slate-400 max-w-sm">
                Embedded stream could not be loaded directly. Follow the step-by-step biomechanical form cues below or view on YouTube.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${guide.videoEmbedId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 mt-2"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Prescription Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sets</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
              {exercise.sets} Sets
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target</span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">
              {exercise.durationSeconds ? `${exercise.durationSeconds}s` : `${exercise.reps} Reps`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Rest Time</span>
            <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
              {exercise.restSeconds}s Rest
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Focus Area</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-1">
              {exercise.targetMuscle}
            </span>
          </div>
        </div>

        {/* Key Form Techniques */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Key Biomechanical Technique Cues</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {guide.techniqueCues.map((cue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes to Avoid */}
        <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Common Form Mistakes to Avoid</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {guide.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Breathing Guidance */}
        <div className="p-3.5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <Wind className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-800 dark:text-cyan-300 font-bold block mb-0.5">
              Breathing Pattern:
            </strong>
            <span>{guide.breathingGuidance}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close Guide
          </button>

          {onStartExercise && (
            <button
              type="button"
              onClick={() => {
                onStartExercise(exercise);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start This Exercise</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
