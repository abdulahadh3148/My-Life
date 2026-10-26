import React, { useState } from 'react';
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
  RefreshCw,
  SunMedium,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrayerEditModal } from './PrayerEditModal';
import { SriLankaCitySelector } from './SriLankaCitySelector';
import { PrayerCountdownCard } from './PrayerCountdownCard';
import { PrayerTime, PrayerName } from '../../types';
import {
  formatTime,
  getTodayDateString,
  parseTimeToMinutes,
  minutesToTimeString,
  formatDisplayDate
} from '../../utils/time';
import { SriLankaCity } from '../../utils/prayerEngine';

export const PrayerView: React.FC = () => {
  const {
    prayerTimes,
    prayerLogs,
    togglePrayerCompleted,
    settings,
    updateSettings,
    addActivity,
    activities,
    updateActivity,
    addNotification,
    setSriLankaCity,
    setMadhab,
    syncPrayerTimes
  } = useApp();

  const [editingPrayer, setEditingPrayer] = useState<PrayerTime | null>(null);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);

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

  const handleSelectCity = (city: SriLankaCity) => {
    if (setSriLankaCity) {
      setSriLankaCity(city);
    } else {
      updateSettings({
        sriLankaCity: city.name,
        latitude: city.latitude,
        longitude: city.longitude
      });
    }

    addNotification({
      title: 'Prayer Location Updated',
      message: `Set to ${city.name}, Sri Lanka (${city.district} District). Timetable updated.`,
      type: 'prayer'
    });
  };

  const handleUpdateMadhab = (madhab: 'shafii' | 'hanafi') => {
    if (setMadhab) {
      setMadhab(madhab);
    } else {
      updateSettings({ madhab });
    }
  };

  const handleLiveSync = async () => {
    setIsSyncingLive(true);
    try {
      if (syncPrayerTimes) {
        await syncPrayerTimes(true);
      }
      addNotification({
        title: 'Timings Synced',
        message: 'Synchronized with live Sri Lankan prayer timetable calculation.',
        type: 'prayer'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  // Sync / create prayer blocks in today's daily schedule
  const handleSyncToSchedule = () => {
    let syncedCount = 0;

    prayerTimes.forEach((pt) => {
      // Don't create obligatory congregation buffer for sunrise unless desired
      const buffer = pt.mosqueBufferMinutes || (pt.name === 'sunrise' ? 0 : 15);
      const prayerStartMin = parseTimeToMinutes(pt.time) - buffer;
      const prayerEndMin = parseTimeToMinutes(pt.time) + (pt.name === 'sunrise' ? 15 : 30);

      const startStr = minutesToTimeString(Math.max(0, prayerStartMin));
      const endStr = minutesToTimeString(prayerEndMin);
      const title = pt.name === 'sunrise' ? 'Sunrise / Ishraq' : `${pt.label} Prayer & Mosque Buffer`;

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
          description: pt.name === 'sunrise' ? 'Astronomical sunrise and Ishraq time.' : `Includes ${buffer}m mosque travel and wudu buffer before prayer.`,
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
      title: 'Prayers Synced to Timeline',
      message: `Preserved all existing tasks and updated 6 fixed prayer blocks with mosque travel buffers.`,
      type: 'prayer'
    });
  };

  const completedTodayCount = prayerTimes.filter((pt) => Boolean(todayLog[pt.name])).length;

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Live Next Prayer & Countdown Digital Clock Card */}
      <PrayerCountdownCard
        prayerTimes={prayerTimes}
        cityName={settings.sriLankaCity || 'Colombo'}
        madhab={settings.madhab || 'shafii'}
        timeFormat={settings.timeFormat || '12h'}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
      />

      {/* Control Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCitySelectorOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Location: {settings.sriLankaCity || 'Colombo'}, Sri Lanka</span>
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          </button>

          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            Asr Rule: {settings.madhab === 'hanafi' ? 'Hanafi' : 'Shafi‘i (Standard)'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleLiveSync}
            disabled={isSyncingLive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
            title="Recalculate or sync with live AlAdhan API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin text-emerald-500' : ''}`} />
            <span>Recalculate / Sync</span>
          </button>

          <button
            onClick={handleSyncToSchedule}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Sync into Schedule Blocks</span>
          </button>
        </div>
      </div>

      {/* 6 Prayer Times Cards (Fajr, Sunrise, Dhuhr, Asr (Shafi'i), Maghrib, Isha) */}
      <div className="space-y-3">
        {prayerTimes.map((pt) => {
          const isDone = Boolean(todayLog[pt.name]);
          const isSunrise = pt.name === 'sunrise';

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
                      {isSunrise ? (
                        <SunMedium className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-emerald-500" />
                      )}
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

                      {pt.manualAdjustmentMinutes ? (
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {pt.manualAdjustmentMinutes > 0 ? `+${pt.manualAdjustmentMinutes}m` : `${pt.manualAdjustmentMinutes}m`} mosque offset
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      {!isSunrise ? (
                        <>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span>Mosque Buffer: {pt.mosqueBufferMinutes}m</span>
                          </span>
                          <span>•</span>
                        </>
                      ) : (
                        <>
                          <span>Shurooq / Ishraq Horizon</span>
                          <span>•</span>
                        </>
                      )}
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
                  title={`Configure ${pt.label} timetable and mosque buffer`}
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

      {/* Sri Lanka City & Madhab Selector Modal */}
      <SriLankaCitySelector
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        selectedCity={settings.sriLankaCity || 'Colombo'}
        onSelectCity={handleSelectCity}
        madhab={settings.madhab || 'shafii'}
        onUpdateMadhab={handleUpdateMadhab}
        isLoading={isSyncingLive}
        onRecalculate={handleLiveSync}
      />
    </div>
  );
};
