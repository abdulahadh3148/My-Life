import React from 'react';
import { Moon, CheckCircle2, Circle, ArrowRight, SunMedium, Compass, MapPin } from 'lucide-react';
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
    sunrise: false,
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

  const completedCount = prayers.filter((p) => p.name !== 'sunrise' && p.completed).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Prayer Timetable
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                {settings.sriLankaCity || 'Colombo'} • {settings.madhab === 'hanafi' ? 'Hanafi' : 'Shafi‘i'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {completedCount} of 5 Fard Prayers Completed Today • Asia/Colombo
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('prayer')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Full Sri Lanka Timetable</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 6 Times Grid: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {prayers.map((prayer) => {
          const isSunrise = prayer.name === 'sunrise';

          return (
            <button
              key={prayer.name}
              onClick={() => togglePrayerCompleted(prayer.name, today)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                prayer.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                {isSunrise && <SunMedium className="w-3 h-3 text-amber-500" />}
                <span className="text-[11px] font-bold tracking-tight truncate">
                  {prayer.name === 'asr' ? 'Asr (Shafi‘i)' : prayer.label}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-80 mt-0.5 font-bold">
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
          );
        })}
      </div>
    </div>
  );
};
