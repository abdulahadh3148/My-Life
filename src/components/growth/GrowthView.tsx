import React, { useState } from 'react';
import {
  GraduationCap,
  Code2,
  BookOpen,
  MessageSquare,
  Play,
  Plus,
  History,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyTimerModal } from './StudyTimerModal';
import { GrowthGoalModal } from './GrowthGoalModal';
import { ProgressRing } from '../common/ProgressRing';
import { GrowthGoal } from '../../types';
import { formatDuration, formatDisplayDate, getStartOfWeek } from '../../utils/time';

export const GrowthView: React.FC = () => {
  const { growthGoals, growthSessions } = useApp();
  const [activeTimerGoal, setActiveTimerGoal] = useState<GrowthGoal | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const weekStart = getStartOfWeek();

  // Calculate tracked minutes for each goal this week
  const goalProgress = growthGoals.map((g) => {
    const trackedMinutes = growthSessions
      .filter((s) => s.goalId === g.id && s.date >= weekStart)
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    const percent = Math.min(100, Math.round((trackedMinutes / g.weeklyTargetMinutes) * 100));

    return {
      goal: g,
      trackedMinutes,
      percent
    };
  });

  const getStreamIcon = (cat: string) => {
    switch (cat) {
      case 'coding':
        return Code2;
      case 'hndit':
        return GraduationCap;
      case 'english':
        return MessageSquare;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Growth Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-cyan-50/20 to-white dark:from-[#0B151F] dark:via-[#0F1C28] dark:to-[#091119] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Personal Growth & Learning
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Software engineering architecture, HNDIT diploma curriculum, English fluency practice, and deliberate reading.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-950/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Growth Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goalProgress.map(({ goal, trackedMinutes, percent }) => {
          const StreamIcon = getStreamIcon(goal.category);

          return (
            <div
              key={goal.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                    >
                      <StreamIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <ProgressRing progress={percent} size={50} strokeWidth={5} color="#06B6D4">
                    <span className="text-[10px] font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {percent}%
                    </span>
                  </ProgressRing>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {goal.description}
                </p>

                {/* Hours summary */}
                <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-600 dark:text-slate-300 py-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Tracked: {formatDuration(trackedMinutes)}</span>
                  <span>Target: {formatDuration(goal.weeklyTargetMinutes)} / wk</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTimerGoal(goal)}
                className="mt-3 w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-sm hover:opacity-90 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Practice Timer</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Practice Sessions Log */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Learning Logs
          </h3>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {growthSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151C2A] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {session.title}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {formatDisplayDate(session.date)} {session.notes ? `• "${session.notes}"` : ''}
                </div>
              </div>

              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                {formatDuration(session.durationMinutes)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {activeTimerGoal && (
        <StudyTimerModal
          isOpen={!!activeTimerGoal}
          onClose={() => setActiveTimerGoal(null)}
          goal={activeTimerGoal}
        />
      )}

      <GrowthGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
