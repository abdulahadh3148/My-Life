import React from 'react';
import { History, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, formatDisplayDate } from '../../utils/time';

export const WorkHistoryList: React.FC = () => {
  const { workSessions } = useApp();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Logged Session History
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Verified focus sessions recorded with the timer
          </p>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {workSessions.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No work sessions logged yet. Start the focus timer above!
          </div>
        ) : (
          workSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151C2A] space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {session.startTime} – {session.endTime}
                  </span>
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {formatDuration(session.durationMinutes)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{formatDisplayDate(session.date)}</span>
                {session.notes && (
                  <span className="italic text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                    "{session.notes}"
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
