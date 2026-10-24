import React, { useMemo } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Sparkles,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { generateRebalanceProposal } from '../../utils/timeBalancer';
import { formatTime, formatDuration, parseTimeToMinutes } from '../../utils/time';

interface TimeBalancerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeBalancerModal: React.FC<TimeBalancerModalProps> = ({ isOpen, onClose }) => {
  const { todayActivities, applyBalancerFixes, settings } = useApp();

  const proposal = useMemo(() => {
    const wakeMin = parseTimeToMinutes(settings.wakeTime || '05:00');
    const sleepMin = parseTimeToMinutes(settings.sleepTime || '22:30');
    return generateRebalanceProposal(todayActivities, wakeMin, sleepMin);
  }, [todayActivities, settings.wakeTime, settings.sleepTime]);

  const handleApply = () => {
    if (proposal.adjustments.length > 0) {
      applyBalancerFixes(proposal.adjustments);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Time Balancer"
      subtitle="Intelligent schedule assistant with zero silent changes"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Assistant Header status */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            proposal.conflicts.length === 0
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : proposal.isBalanced
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                proposal.conflicts.length === 0
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : proposal.isBalanced
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}
            >
              {proposal.conflicts.length === 0 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : proposal.isBalanced ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {proposal.conflicts.length === 0
                  ? 'Schedule is Harmonious'
                  : proposal.isBalanced
                  ? 'Balanced Proposal Available'
                  : 'Manual Attention Required'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {proposal.message}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Detected Conflicts */}
        {proposal.conflicts.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span>Detected Conflicts ({proposal.conflicts.length})</span>
            </h4>
            <div className="space-y-2">
              {proposal.conflicts.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1420] shadow-sm space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {c.activityA.title}
                      </span>
                      {c.activityA.isFixed ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                          <Lock className="w-2.5 h-2.5" /> Fixed
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                          Flexible
                        </span>
                      )}
                    </div>
                    <span className="text-amber-500 font-mono font-semibold text-[11px]">
                      Overlap: {c.overlapMinutes}m
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      collides with:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.activityB.title}
                    </span>
                    {c.activityB.isFixed ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                        <Lock className="w-2.5 h-2.5" /> Fixed
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                        Flexible
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {c.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Proposed Adjustments Preview */}
        {proposal.adjustments.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <span>Proposed Adjustments ({proposal.adjustments.length})</span>
            </h4>
            <div className="space-y-2">
              {proposal.adjustments.map((adj) => (
                <div
                  key={adj.activityId}
                  className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {adj.activityTitle}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Shift to Free Slot
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                    <span className="line-through text-slate-400">
                      {formatTime(adj.currentStart, settings.timeFormat)} - {formatTime(adj.currentEnd, settings.timeFormat)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatTime(adj.proposedStart, settings.timeFormat)} - {formatTime(adj.proposedEnd, settings.timeFormat)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {adj.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {proposal.adjustments.length > 0 && (
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply {proposal.adjustments.length} Adjustment(s)</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
