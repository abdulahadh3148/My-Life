import React from 'react';
import { Moon, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTime, getTodayDateString } from '../../utils/time';
import { PrayerName } from '../../types';

export const PrayerStrip: React.FC = () => {
  const {
    prayerTimes,
    prayerLogs,
    togglePrayerCompleted,
    settings,
    setActiveView
  } = useApp();

  const today = getTodayDateString();
  const todayLog = prayerLogs.find((l) => l.date === today) || {
    date: today,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  };

  const prayers: { name: PrayerName; label: string; time: string; completed: boolean }[] =
    prayerTimes.map((pt) => ({
      name: pt.name,
      label: pt.label,
      time: pt.time,
      completed: Boolean(todayLog[pt.name])
    }));

  const completedCount = prayers.filter((p) => p.completed).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Prayer Tracker
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {completedCount} of 5 Completed Today • {settings.timezone}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('prayer')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
        >
          <span>Schedule</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 5 Prayers Grid */}
      <div className="grid grid-cols-5 gap-2">
        {prayers.map((prayer) => (
          <button
            key={prayer.name}
            onClick={() => togglePrayerCompleted(prayer.name, today)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
              prayer.completed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold tracking-tight">{prayer.label}</span>
            <span className="text-[10px] font-mono opacity-80 mt-0.5">
              {formatTime(prayer.time, settings.timeFormat)}
            </span>
            <div className="mt-1.5">
              {prayer.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
