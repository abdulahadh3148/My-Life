import React, { useState, useEffect } from 'react';
import { Moon, Clock, MapPin, Sparkles, SunMedium, Compass } from 'lucide-react';
import { PrayerTime } from '../../types';
import { getLiveNextPrayer, NextPrayerCountdown } from '../../utils/prayerEngine';
import { formatTime } from '../../utils/time';

interface PrayerCountdownCardProps {
  prayerTimes: PrayerTime[];
  cityName: string;
  madhab: 'shafii' | 'hanafi';
  timeFormat: '12h' | '24h';
  onOpenCitySelector: () => void;
}

export const PrayerCountdownCard: React.FC<PrayerCountdownCardProps> = ({
  prayerTimes,
  cityName,
  madhab,
  timeFormat,
  onOpenCitySelector
}) => {
  const [countdown, setCountdown] = useState<NextPrayerCountdown | null>(() =>
    getLiveNextPrayer(prayerTimes)
  );

  useEffect(() => {
    // Tick every second for live countdown
    const updateCountdown = () => {
      setCountdown(getLiveNextPrayer(prayerTimes));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes]);

  if (!countdown) return null;

  const { nextPrayer, hoursRemaining, minutesRemaining, secondsRemaining, isApproaching, progressPercent } =
    countdown;

  const isSunrise = nextPrayer.name === 'sunrise';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0E1B15] to-[#0A1310] text-white p-5 sm:p-6 shadow-lg shadow-emerald-950/20">
      {/* Decorative ambient background glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Upcoming Prayer Info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              {isSunrise ? <SunMedium className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isSunrise ? 'Astronomical Shurooq' : 'Next Adhan'}</span>
            </span>

            <button
              onClick={onOpenCitySelector}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors"
              title="Change Sri Lankan city / district"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{cityName}, Sri Lanka</span>
            </button>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-mono">
              <Compass className="w-3 h-3" />
              <span>{madhab === 'shafii' ? 'Shafi‘i Asr' : 'Hanafi Asr'}</span>
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{nextPrayer.label}</span>
              <span className="text-emerald-400 text-xl sm:text-2xl font-mono">
                {formatTime(nextPrayer.time, timeFormat)}
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isApproaching ? (
                <span className="text-amber-300 font-bold animate-pulse">
                  Prayer time approaching! Prepare for wudu & congregation.
                </span>
              ) : (
                <span>Timezone: Asia/Colombo (UTC+05:30) • Sri Lanka Timetable</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Live Countdown Digital Clock */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col items-center justify-center shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Time Remaining</span>
          </div>

          <div className="flex items-baseline gap-1 font-mono">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {String(hoursRemaining).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-semibold">Hours</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 animate-pulse">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {String(minutesRemaining).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-semibold">Mins</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 animate-pulse">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {String(secondsRemaining).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-semibold">Secs</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
