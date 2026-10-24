import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Sparkles, BookOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { GrowthGoal } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: GrowthGoal;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({ isOpen, onClose, goal }) => {
  const { logGrowthSession } = useApp();

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [topicNotes, setTopicNotes] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleFinish = () => {
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    logGrowthSession({
      goalId: goal.id,
      title: goal.title,
      date: getTodayDateString(),
      durationMinutes,
      notes: topicNotes.trim() || undefined
    });
    onClose();
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Practice Session: ${goal.title}`}
      subtitle={`Category: ${goal.category.toUpperCase()}`}
      maxWidth="max-w-md"
    >
      <div className="text-center space-y-4">
        <div className="font-mono text-5xl font-extrabold text-slate-900 dark:text-white my-3">
          {formattedTimer}
        </div>

        <input
          type="text"
          value={topicNotes}
          onChange={(e) => setTopicNotes(e.target.value)}
          placeholder="What did you study or practice? (e.g. Chapter 4..."
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex items-center justify-center gap-3 pt-2">
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{seconds > 0 ? 'Resume' : 'Start Timer'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          )}

          {seconds > 0 && (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Log Session</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
