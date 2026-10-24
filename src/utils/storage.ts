import {
  Activity,
  DailyHabit,
  GardeningTask,
  GrowthGoal,
  GrowthSession,
  Plant,
  PrayerLog,
  PrayerTime,
  UserSettings,
  WeeklyGoal,
  WeeklyReviewNote,
  WorkoutLog,
  WorkoutPlan,
  WorkSession,
  WorkTask,
  AppNotification
} from '../types';
import {
  DEFAULT_USER_SETTINGS,
  DEFAULT_PRAYER_TIMES,
  getInitialActivities,
  INITIAL_PLANTS,
  INITIAL_GARDENING_TASKS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_WORKOUT_LOGS,
  INITIAL_WORK_TASKS,
  INITIAL_WORK_SESSIONS,
  INITIAL_GROWTH_GOALS,
  INITIAL_GROWTH_SESSIONS,
  INITIAL_DAILY_HABITS,
  getInitialWeeklyGoals,
  INITIAL_PRAYER_LOGS,
  INITIAL_WEEKLY_REVIEW
} from '../data/initialData';

export interface AppStateData {
  version: number;
  settings: UserSettings;
  prayerTimes: PrayerTime[];
  activities: Activity[];
  plants: Plant[];
  gardeningTasks: GardeningTask[];
  workoutPlans: WorkoutPlan[];
  workoutLogs: WorkoutLog[];
  workTasks: WorkTask[];
  workSessions: WorkSession[];
  growthGoals: GrowthGoal[];
  growthSessions: GrowthSession[];
  dailyHabits: DailyHabit[];
  weeklyGoals: WeeklyGoal[];
  prayerLogs: PrayerLog[];
  weeklyReview: WeeklyReviewNote;
  notifications: AppNotification[];
}

const STORAGE_KEY = 'mylife_os_state_v1';

export function getInitialState(): AppStateData {
  return {
    version: 1,
    settings: DEFAULT_USER_SETTINGS,
    prayerTimes: DEFAULT_PRAYER_TIMES,
    activities: getInitialActivities(),
    plants: INITIAL_PLANTS,
    gardeningTasks: INITIAL_GARDENING_TASKS,
    workoutPlans: INITIAL_WORKOUT_PLANS,
    workoutLogs: INITIAL_WORKOUT_LOGS,
    workTasks: INITIAL_WORK_TASKS,
    workSessions: INITIAL_WORK_SESSIONS,
    growthGoals: INITIAL_GROWTH_GOALS,
    growthSessions: INITIAL_GROWTH_SESSIONS,
    dailyHabits: INITIAL_DAILY_HABITS,
    weeklyGoals: getInitialWeeklyGoals(),
    prayerLogs: INITIAL_PRAYER_LOGS,
    weeklyReview: INITIAL_WEEKLY_REVIEW,
    notifications: [
      {
        id: 'notif-welcome',
        title: 'Welcome to MyLife OS',
        message: 'Your personal life operating system is active. Check today’s timeline and stay balanced.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'system'
      }
    ]
  };
}

export function loadStoredState(): AppStateData {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return getInitialState();
    
    // Merge safely with initial state to handle any new fields
    const initial = getInitialState();
    return {
      version: parsed.version || 1,
      settings: { ...initial.settings, ...(parsed.settings || {}) },
      prayerTimes: Array.isArray(parsed.prayerTimes) && parsed.prayerTimes.length ? parsed.prayerTimes : initial.prayerTimes,
      activities: Array.isArray(parsed.activities) ? parsed.activities : initial.activities,
      plants: Array.isArray(parsed.plants) ? parsed.plants : initial.plants,
      gardeningTasks: Array.isArray(parsed.gardeningTasks) ? parsed.gardeningTasks : initial.gardeningTasks,
      workoutPlans: Array.isArray(parsed.workoutPlans) ? parsed.workoutPlans : initial.workoutPlans,
      workoutLogs: Array.isArray(parsed.workoutLogs) ? parsed.workoutLogs : initial.workoutLogs,
      workTasks: Array.isArray(parsed.workTasks) ? parsed.workTasks : initial.workTasks,
      workSessions: Array.isArray(parsed.workSessions) ? parsed.workSessions : initial.workSessions,
      growthGoals: Array.isArray(parsed.growthGoals) ? parsed.growthGoals : initial.growthGoals,
      growthSessions: Array.isArray(parsed.growthSessions) ? parsed.growthSessions : initial.growthSessions,
      dailyHabits: Array.isArray(parsed.dailyHabits) ? parsed.dailyHabits : initial.dailyHabits,
      weeklyGoals: Array.isArray(parsed.weeklyGoals) ? parsed.weeklyGoals : initial.weeklyGoals,
      prayerLogs: Array.isArray(parsed.prayerLogs) ? parsed.prayerLogs : initial.prayerLogs,
      weeklyReview: parsed.weeklyReview || initial.weeklyReview,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : initial.notifications
    };
  } catch (err) {
    console.error('Failed to load MyLife OS state from localStorage:', err);
    return getInitialState();
  }
}

export function saveStateToStorage(state: AppStateData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportStateAsJSON(state: AppStateData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mylife-os-backup-${dateStamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateImportedData(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Uploaded file is not a valid JSON object.' };
  }
  if (!Array.isArray(data.activities)) {
    return { valid: false, error: 'Missing activities array in backup file.' };
  }
  return { valid: true };
}
