import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Unlock,
  MoreVertical,
  Copy,
  Trash2,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { Activity } from '../../types';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatTime, calculateDurationMinutes, formatDuration } from '../../utils/time';

interface ActivityCardProps {
  activity: Activity;
  hasConflict?: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string, title: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  hasConflict = false,
  onEdit,
  onDelete
}) => {
  const { toggleActivityComplete, duplicateActivity, settings } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const duration = calculateDurationMinutes(activity.startTime, activity.endTime);

  const priorityColors = {
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  };

  return (
    <div
      className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
        activity.completed
          ? 'bg-slate-50/60 dark:bg-[#0E131E]/40 border-slate-200/50 dark:border-slate-800/50 opacity-75'
          : hasConflict
          ? 'bg-amber-500/5 dark:bg-amber-950/15 border-amber-500/40 shadow-sm'
          : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkmark */}
        <button
          onClick={() => toggleActivityComplete(activity.id)}
          className="mt-0.5 text-slate-300 hover:text-emerald-500 dark:text-slate-600 dark:hover:text-emerald-400 transition-colors shrink-0"
          aria-label={activity.completed ? 'Mark incomplete' : 'Mark completed'}
        >
          {activity.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate ${
                activity.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {activity.title}
            </span>

            {/* Overlap badge */}
            {hasConflict && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                <AlertTriangle className="w-2.5 h-2.5" /> Clashing
              </span>
            )}
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
              {activity.description}
            </p>
          )}

          {/* Meta bar: time, duration, tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Time Slot */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 font-mono text-slate-700 dark:text-slate-300 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                {formatTime(activity.startTime, settings.timeFormat)} – {formatTime(activity.endTime, settings.timeFormat)}
              </span>
              <span className="text-slate-400 font-normal">({formatDuration(duration)})</span>
            </div>

            {/* Category */}
            <CategoryBadge category={activity.category} size="sm" />

            {/* Fixed vs Flexible status */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                activity.isFixed
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
              }`}
              title={activity.isFixed ? 'Fixed commitment — Smart Balancer preserves this slot' : 'Flexible activity — can be rebalanced'}
            >
              {activity.isFixed ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
              {activity.isFixed ? 'Locked' : 'Flexible'}
            </span>

            {/* Priority */}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${priorityColors[activity.priority]}`}>
              {activity.priority}
            </span>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Activity actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs animate-in fade-in">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(activity);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    duplicateActivity(activity.id);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(activity.id, activity.title);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
