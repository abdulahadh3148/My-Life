import React, { useState, useMemo } from 'react';
import {
  Moon,
  Clock,
  MapPin,
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  Edit2,
  Sparkles,
  CalendarCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrayerEditModal } from './PrayerEditModal';
import { PrayerTime } from '../../types';
import {
  formatTime,
  getTodayDateString,
  parseTimeToMinutes,
  minutesToTimeString,
  formatDisplayDate
} from '../../utils/time';

export const PrayerView: React.FC = () => {
  const {
    prayerTimes,
    prayerLogs,
    togglePrayerCompleted,
    settings,
    addActivity,
    activities,
    updateActivity,
    addNotification
  } = useApp();

  const [editingPrayer, setEditingPrayer] = useState<PrayerTime | null>(null);

  const today = getTodayDateString();
  const todayLog = prayerLogs.find((l) => l.date === today) || {
    date: today,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  };

  // Determine next upcoming prayer
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextPrayer = useMemo(() => {
    const upcoming = prayerTimes
      .map((pt) => ({
        ...pt,
        minutes: parseTimeToMinutes(pt.time)
      }))
      .filter((pt) => pt.minutes >= currentMinutes)
      .sort((a, b) => a.minutes - b.minutes);

    return upcoming.length > 0 ? upcoming[0] : prayerTimes[0]; // Wrap around to Fajr next day
  }, [prayerTimes, currentMinutes]);

  const minutesUntilNext = nextPrayer
    ? parseTimeToMinutes(nextPrayer.time) - currentMinutes
    : 0;

  // Sync / create prayer blocks in today's daily schedule
  const handleSyncToSchedule = () => {
    let syncedCount = 0;

    prayerTimes.forEach((pt) => {
      const buffer = pt.mosqueBufferMinutes || 15;
      const prayerStartMin = parseTimeToMinutes(pt.time) - buffer;
      const prayerEndMin = parseTimeToMinutes(pt.time) + 30; // 30 min congregation

      const startStr = minutesToTimeString(Math.max(0, prayerStartMin));
      const endStr = minutesToTimeString(prayerEndMin);
      const title = `${pt.label} Prayer & Mosque Buffer`;

      const existing = activities.find(
        (a) => a.date === today && a.category === 'prayer' && a.title.includes(pt.label)
      );

      if (existing) {
        updateActivity(existing.id, {
          startTime: startStr,
          endTime: endStr,
          isFixed: true
        });
      } else {
        addActivity({
          title,
          description: `Includes ${buffer}m mosque travel and wudu buffer before prayer.`,
          date: today,
          startTime: startStr,
          endTime: endStr,
          category: 'prayer',
          isFixed: true,
          priority: 'critical',
          completed: Boolean(todayLog[pt.name]),
          reminder: pt.reminder,
          isRecurring: true
        });
        syncedCount++;
      }
    });

    addNotification({
      title: 'Prayers Synced to Schedule',
      message: `Updated fixed prayer schedule blocks with mosque buffers in your timeline.`,
      type: 'prayer'
    });
  };

  const completedTodayCount = prayerTimes.filter((pt) => Boolean(todayLog[pt.name])).length;

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Prayer Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-[#0D1814] dark:via-[#0F1E19] dark:to-[#0A1310] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Moon className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Daily Prayer Timetable
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Configured for <strong className="text-slate-800 dark:text-slate-200">{settings.timezone}</strong>. All timings are fully editable to match your local mosque and congregation schedules.
            </p>
          </div>

          <button
            onClick={handleSyncToSchedule}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Sync into Schedule Blocks</span>
          </button>
        </div>

        {/* Next Prayer Callout */}
        <div className="mt-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Next Upcoming Adhan
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {nextPrayer.label} at {formatTime(nextPrayer.time, settings.timeFormat)}
              </div>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
            {minutesUntilNext > 0 ? `in ${minutesUntilNext} minutes` : 'Now approaching'}
          </div>
        </div>
      </div>

      {/* 5 Prayers Cards */}
      <div className="space-y-3">
        {prayerTimes.map((pt) => {
          const isDone = Boolean(todayLog[pt.name]);

          return (
            <div
              key={pt.name}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePrayerCompleted(pt.name, today)}
                    className="text-slate-300 dark:text-slate-600 hover:text-emerald-500"
                    aria-label={`Mark ${pt.label} complete`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-base font-bold text-slate-900 dark:text-white ${
                          isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {pt.label}
                      </h4>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {formatTime(pt.time, settings.timeFormat)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>Mosque Prep Buffer: {pt.mosqueBufferMinutes}m</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {pt.reminder ? (
                          <Bell className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <BellOff className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{pt.reminder ? 'Alert active' : 'Muted'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingPrayer(pt)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={`Configure ${pt.label} timings`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Prayer Time Modal */}
      <PrayerEditModal
        isOpen={!!editingPrayer}
        onClose={() => setEditingPrayer(null)}
        prayer={editingPrayer}
      />
    </div>
  );
};
