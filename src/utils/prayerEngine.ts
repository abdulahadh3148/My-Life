import { PrayerName, PrayerTime } from '../types';

export interface SriLankaCity {
  id: string;
  name: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
}

export const SRI_LANKA_CITIES: SriLankaCity[] = [
  { id: 'colombo', name: 'Colombo', district: 'Colombo', province: 'Western', latitude: 6.9271, longitude: 79.8612 },
  { id: 'kandy', name: 'Kandy', district: 'Kandy', province: 'Central', latitude: 7.2906, longitude: 80.6337 },
  { id: 'galle', name: 'Galle', district: 'Galle', province: 'Southern', latitude: 6.0535, longitude: 80.2210 },
  { id: 'jaffna', name: 'Jaffna', district: 'Jaffna', province: 'Northern', latitude: 9.6615, longitude: 80.0255 },
  { id: 'batticaloa', name: 'Batticaloa', district: 'Batticaloa', province: 'Eastern', latitude: 7.7310, longitude: 81.6747 },
  { id: 'trincomalee', name: 'Trincomalee', district: 'Trincomalee', province: 'Eastern', latitude: 8.5874, longitude: 81.2152 },
  { id: 'negombo', name: 'Negombo', district: 'Gampaha', province: 'Western', latitude: 7.2008, longitude: 79.8737 },
  { id: 'gampaha', name: 'Gampaha', district: 'Gampaha', province: 'Western', latitude: 7.0840, longitude: 79.9940 },
  { id: 'kalutara', name: 'Kalutara / Beruwala', district: 'Kalutara', province: 'Western', latitude: 6.5854, longitude: 79.9607 },
  { id: 'matara', name: 'Matara / Weligama', district: 'Matara', province: 'Southern', latitude: 5.9549, longitude: 80.5550 },
  { id: 'kurunegala', name: 'Kurunegala', district: 'Kurunegala', province: 'North Western', latitude: 7.4863, longitude: 80.3623 },
  { id: 'puttalam', name: 'Puttalam', district: 'Puttalam', province: 'North Western', latitude: 8.0408, longitude: 79.8394 },
  { id: 'anuradhapura', name: 'Anuradhapura', district: 'Anuradhapura', province: 'North Central', latitude: 8.3114, longitude: 80.4037 },
  { id: 'polonnaruwa', name: 'Polonnaruwa', district: 'Polonnaruwa', province: 'North Central', latitude: 7.9403, longitude: 81.0188 },
  { id: 'badulla', name: 'Badulla', district: 'Badulla', province: 'Uva', latitude: 6.9934, longitude: 81.0550 },
  { id: 'ratnapura', name: 'Ratnapura', district: 'Ratnapura', province: 'Sabaragamuwa', latitude: 6.7056, longitude: 80.3847 },
  { id: 'kegalle', name: 'Kegalle / Mawanella', district: 'Kegalle', province: 'Sabaragamuwa', latitude: 7.2513, longitude: 80.3464 },
  { id: 'matale', name: 'Matale', district: 'Matale', province: 'Central', latitude: 7.4675, longitude: 80.6234 },
  { id: 'nuwara-eliya', name: 'Nuwara Eliya', district: 'Nuwara Eliya', province: 'Central', latitude: 6.9497, longitude: 80.7891 },
  { id: 'hambantota', name: 'Hambantota', district: 'Hambantota', province: 'Southern', latitude: 6.1429, longitude: 81.1212 },
  { id: 'mannar', name: 'Mannar', district: 'Mannar', province: 'Northern', latitude: 8.9810, longitude: 79.9044 },
  { id: 'vavuniya', name: 'Vavuniya', district: 'Vavuniya', province: 'Northern', latitude: 8.7542, longitude: 80.4982 },
  { id: 'kilinochchi', name: 'Kilinochchi', district: 'Kilinochchi', province: 'Northern', latitude: 9.3803, longitude: 80.3770 },
  { id: 'mullaitivu', name: 'Mullaitivu', district: 'Mullaitivu', province: 'Northern', latitude: 9.2671, longitude: 80.8142 },
  { id: 'ampara', name: 'Ampara / Kalmunai', district: 'Ampara', province: 'Eastern', latitude: 7.4167, longitude: 81.8333 },
  { id: 'monaragala', name: 'Monaragala', district: 'Monaragala', province: 'Uva', latitude: 6.8728, longitude: 81.3507 }
];

export const DEFAULT_SRI_LANKA_CITY = SRI_LANKA_CITIES[0]; // Colombo

export interface CalculatedPrayerTimetable {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  source: 'astronomical' | 'api' | 'manual';
  calculatedAt: string;
}

// Math helpers for solar astronomy
const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(x));
const acosD = (x: number) => r2d(Math.acos(Math.max(-1, Math.min(1, x))));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

function fixHour(a: number): number {
  a = a - 24 * Math.floor(a / 24);
  return a < 0 ? a + 24 : a;
}

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function formatHourMinute(hoursFloat: number): string {
  const normalized = fixHour(hoursFloat);
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60 + 0.5); // Round to nearest minute
  const totalMin = h * 60 + m;
  const finalH = Math.floor(totalMin / 60) % 24;
  const finalM = totalMin % 60;
  return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;
}

/**
 * Astronomical Prayer Time Engine (Offline & Mathematical)
 * Method: Muslim World League parameters (Fajr 18.0°, Isha 18.0°/17.5°)
 * Madhab: Shafi'i (shadow length ratio = 1.0)
 * Timezone: Asia/Colombo (+5.5)
 */
export function calculateAstronomicalPrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  timezoneOffsetHours: number = 5.5,
  madhab: 'shafii' | 'hanafi' = 'shafii',
  fajrAngle: number = 18.0,
  ishaAngle: number = 18.0
): CalculatedPrayerTimetable {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day);
  const d = jd - 2451545.0; // days since J2000.0

  // Mean solar coordinates
  const q = fixAngle(280.459 + 0.98564736 * d);
  const g = fixAngle(357.529 + 0.98560028 * d);
  const L = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));

  // Obliquity of ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Sun declination & right ascension
  const declination = asinD(sinD(e) * sinD(L));
  let ra = atan2D(cosD(e) * sinD(L), cosD(L)) / 15;
  ra = fixHour(ra);

  // Equation of time in hours
  const eqt = q / 15 - ra;

  // Solar noon (Dhuhr midpoint)
  const noon = fixHour(12 + timezoneOffsetHours - longitude / 15 - eqt);

  // Sun hour angle helper for a given altitude angle (alpha)
  const hourAngle = (alpha: number): number => {
    const val = (sinD(alpha) - sinD(latitude) * sinD(declination)) / (cosD(latitude) * cosD(declination));
    return acosD(val) / 15;
  };

  // Sunrise and Sunset (center of sun at -0.833° accounting for atmospheric refraction and solar radius)
  const sunAngle = -0.8333;
  const haSun = hourAngle(sunAngle);
  const sunrise = noon - haSun;
  const sunset = noon + haSun;

  // Fajr
  const haFajr = hourAngle(-fajrAngle);
  const fajr = noon - haFajr;

  // Isha
  const haIsha = hourAngle(-ishaAngle);
  const isha = noon + haIsha;

  // Asr according to Shafi'i madhab (shadow factor t = 1.0; Hanafi t = 2.0)
  const shadowFactor = madhab === 'hanafi' ? 2.0 : 1.0;
  const asrAltitude = r2d(Math.atan(1 / (shadowFactor + tanD(Math.abs(latitude - declination)))));
  const haAsr = hourAngle(asrAltitude);
  const asr = noon + haAsr;

  return {
    fajr: formatHourMinute(fajr),
    sunrise: formatHourMinute(sunrise),
    dhuhr: formatHourMinute(noon + 1 / 60), // +1 min safety after exact zenith
    asr: formatHourMinute(asr),
    maghrib: formatHourMinute(sunset + 2 / 60), // +2 min safety
    isha: formatHourMinute(isha),
    source: 'astronomical',
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Fetch verified prayer times from AlAdhan API with fallback to local astronomical engine
 * Uses exact GPS coordinates and School=0 (Shafi'i madhhab: Asr shadow factor = 1.0)
 */
export async function fetchLivePrayerTimes(
  city: string,
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  madhab: 'shafii' | 'hanafi' = 'shafii'
): Promise<CalculatedPrayerTimetable> {
  const schoolParam = madhab === 'hanafi' ? 1 : 0; // 0 = Shafi'i (Standard 1.0x shadow), 1 = Hanafi (2.0x shadow)
  const cleanCity = city.split('/')[0].trim();
  const timestamp = Math.floor(date.getTime() / 1000);

  // Exact coordinates query (most accurate for Sri Lanka towns & districts)
  const coordUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=1&school=${schoolParam}`;
  // Fallback by city name
  const cityUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
    cleanCity
  )}&country=Sri+Lanka&method=1&school=${schoolParam}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout

    let res = await fetch(coordUrl, { signal: controller.signal });
    if (!res.ok) {
      res = await fetch(cityUrl, { signal: controller.signal });
    }
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.timings) {
        const timings = data.data.timings;
        // Times from API are in HH:mm or HH:mm (EST), trim any timezone annotations
        const clean = (t: string) => t.split(' ')[0].trim();
        return {
          fajr: clean(timings.Fajr),
          sunrise: clean(timings.Sunrise),
          dhuhr: clean(timings.Dhuhr),
          asr: clean(timings.Asr),
          maghrib: clean(timings.Maghrib),
          isha: clean(timings.Isha),
          source: 'api',
          calculatedAt: new Date().toISOString()
        };
      }
    }
  } catch (err) {
    // API failed or offline - fall back seamlessly to local mathematical engine
    console.info('AlAdhan API unavailable, using offline Shafi‘i astronomical calculation:', err);
  }

  // Pure mathematical offline fallback (Shafi'i: shadowFactor 1.0, Fajr 18°, Isha 18°)
  return calculateAstronomicalPrayerTimes(date, latitude, longitude, 5.5, madhab);
}

/**
 * Generate 6 prayer items (including Sunrise) with manual adjustment offsets
 */
export function buildPrayerTimesList(
  calculated: CalculatedPrayerTimetable,
  manualAdjustments: Record<PrayerName, number> = {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  existingTimes?: PrayerTime[],
  madhab: 'shafii' | 'hanafi' = 'shafii'
): PrayerTime[] {
  const asrLabel = madhab === 'hanafi' ? 'Asr (Hanafi)' : 'Asr (Shafi‘i)';
  const definitions: { name: PrayerName; label: string; baseTime: string; defaultBuffer: number }[] = [
    { name: 'fajr', label: 'Fajr', baseTime: calculated.fajr, defaultBuffer: 15 },
    { name: 'sunrise', label: 'Sunrise', baseTime: calculated.sunrise, defaultBuffer: 0 },
    { name: 'dhuhr', label: 'Dhuhr', baseTime: calculated.dhuhr, defaultBuffer: 15 },
    { name: 'asr', label: asrLabel, baseTime: calculated.asr, defaultBuffer: 15 },
    { name: 'maghrib', label: 'Maghrib', baseTime: calculated.maghrib, defaultBuffer: 15 },
    { name: 'isha', label: 'Isha', baseTime: calculated.isha, defaultBuffer: 15 }
  ];

  return definitions.map((def) => {
    const existing = existingTimes?.find((t) => t.name === def.name);
    const adjustment = manualAdjustments[def.name] || existing?.manualAdjustmentMinutes || 0;

    // Apply offset minutes to base time
    const [h, m] = def.baseTime.split(':').map(Number);
    let totalMins = h * 60 + m + adjustment;
    if (totalMins < 0) totalMins += 1440;
    totalMins = totalMins % 1440;
    const finalH = Math.floor(totalMins / 60);
    const finalM = totalMins % 60;
    const adjustedTime = `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;

    return {
      name: def.name,
      label: def.name === 'asr' ? 'Asr (Shafi‘i)' : def.label,
      time: adjustedTime,
      mosqueBufferMinutes: existing?.mosqueBufferMinutes ?? def.defaultBuffer,
      reminder: existing?.reminder ?? (def.name !== 'sunrise'),
      manualAdjustmentMinutes: adjustment
    };
  });
}

export interface NextPrayerCountdown {
  nextPrayer: PrayerTime;
  isToday: boolean;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  totalSecondsRemaining: number;
  isApproaching: boolean;
  progressPercent: number; // percentage of duration between previous and next prayer elapsed
}

/**
 * Calculates live next prayer and countdown
 */
export function getLiveNextPrayer(prayerTimes: PrayerTime[], now: Date = new Date()): NextPrayerCountdown | null {
  if (!prayerTimes || prayerTimes.length === 0) return null;

  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const timedList = prayerTimes.map((pt) => {
    const [h, m] = pt.time.split(':').map(Number);
    return {
      prayer: pt,
      secondsOfDay: h * 3600 + m * 60
    };
  });

  // Sort chronologically
  timedList.sort((a, b) => a.secondsOfDay - b.secondsOfDay);

  // Find next prayer today
  const upcoming = timedList.find((t) => t.secondsOfDay > currentSeconds);

  let target: { prayer: PrayerTime; secondsOfDay: number };
  let isToday = true;
  let prevSeconds = 0;

  if (upcoming) {
    target = upcoming;
    const index = timedList.indexOf(upcoming);
    prevSeconds = index > 0 ? timedList[index - 1].secondsOfDay : timedList[timedList.length - 1].secondsOfDay - 86400;
  } else {
    // Wrapped around to first prayer tomorrow (Fajr)
    target = timedList[0];
    isToday = false;
    prevSeconds = timedList[timedList.length - 1].secondsOfDay;
  }

  let diffSeconds = target.secondsOfDay - currentSeconds;
  if (diffSeconds < 0) {
    diffSeconds += 86400; // 24 hours in seconds
  }

  const hoursRemaining = Math.floor(diffSeconds / 3600);
  const minutesRemaining = Math.floor((diffSeconds % 3600) / 60);
  const secondsRemaining = diffSeconds % 60;

  const intervalSpan = target.secondsOfDay > prevSeconds ? target.secondsOfDay - prevSeconds : 86400 - (prevSeconds - target.secondsOfDay);
  const elapsed = Math.max(0, intervalSpan - diffSeconds);
  const progressPercent = intervalSpan > 0 ? Math.min(100, Math.round((elapsed / intervalSpan) * 100)) : 0;

  return {
    nextPrayer: target.prayer,
    isToday,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    totalSecondsRemaining: diffSeconds,
    isApproaching: diffSeconds <= 900, // 15 mins or less
    progressPercent
  };
}
