import React from 'react';
import { Plus, Coffee } from 'lucide-react';
import { FreeSlot } from '../../types';
import { formatTime, formatDuration } from '../../utils/time';
import { useApp } from '../../context/AppContext';

interface FreeTimeBlockProps {
  slot: FreeSlot;
  onFillSlot: (start: string, end: string) => void;
}

export const FreeTimeBlock: React.FC<FreeTimeBlockProps> = ({ slot, onFillSlot }) => {
  const { settings } = useApp();

  return (
    <div className="group flex items-center justify-between px-4 py-2.5 my-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 text-xs hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all">
      <div className="flex items-center gap-2">
        <Coffee className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        <span className="font-medium text-slate-600 dark:text-slate-300">
          Free Time Window:
        </span>
        <span className="font-mono text-slate-700 dark:text-slate-200">
          {formatTime(slot.start, settings.timeFormat)} – {formatTime(slot.end, settings.timeFormat)}
        </span>
        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          ({formatDuration(slot.durationMinutes)})
        </span>
      </div>

      <button
        onClick={() => onFillSlot(slot.start, slot.end)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm opacity-80 group-hover:opacity-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all active:scale-95 text-[11px] font-semibold"
      >
        <Plus className="w-3 h-3" />
        <span>Add Here</span>
      </button>
    </div>
  );
};
