import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Coffee, BellRing, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, getTodayDateString } from '../../utils/time';

export const WorkTimer: React.FC = () => {
  const { settings, logWorkSession, addNotification } = useApp();

  const [isActive, setIsActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  const breakIntervalSeconds = (settings.breakReminderMinutes || 45) * 60;
  const notifiedBreakRef = useRef(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          // Trigger break reminder
          if (next >= breakIntervalSeconds && !notifiedBreakRef.current) {
            notifiedBreakRef.current = true;
            addNotification({
              title: 'Time for a Restorative Break',
              message: `You have been deep working for ${settings.breakReminderMinutes} minutes. Step away, stretch, and rest your eyes.`,
              type: 'work'
            });
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, breakIntervalSeconds, settings.breakReminderMinutes, addNotification]);

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsElapsed(0);
    setSessionStartTime(null);
    notifiedBreakRef.current = false;
  };

  const handleFinish = () => {
    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    logWorkSession({
      date: getTodayDateString(),
      startTime: sessionStartTime || nowTime,
      endTime: nowTime,
      durationMinutes,
      targetMinutes: settings.dailyWorkTargetMinutes || 180,
      notes: sessionNotes.trim() || undefined
    });

    handleReset();
    setSessionNotes('');
  };

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  const formattedTimer = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-6 shadow-sm text-center relative overflow-hidden">
      {/* Background glow when active */}
      {isActive && (
        <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deep Focus Timer</span>
        </div>

        {/* Big Digital Timer Display */}
        <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white my-2">
          {formattedTimer}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Target Session: {formatDuration(settings.dailyWorkTargetMinutes || 180)} • Break Alert after {settings.breakReminderMinutes || 45}m
        </p>

        {/* Break Alert Warning if elapsed */}
        {secondsElapsed >= breakIntervalSeconds && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-center gap-2">
            <Coffee className="w-4 h-4 text-amber-500" />
            <span>Break recommended! Step away for 5-10 minutes.</span>
          </div>
        )}

        {/* Session Notes input */}
        <input
          type="text"
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="Session outcome (e.g. Completed API refactor)..."
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-950/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{secondsElapsed > 0 ? 'Resume Focus' : 'Start Focus Session'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Focus</span>
            </button>
          )}

          {secondsElapsed > 0 && (
            <>
              <button
                onClick={handleFinish}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                title="Finish & Log Work Session"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Log Session</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
