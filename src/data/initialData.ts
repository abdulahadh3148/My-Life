import {
  Activity,
  ActivityCategory,
  CategoryMeta,
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
  WorkTask
} from '../types';
import { getTodayDateString, getStartOfWeek } from '../utils/time';

export const CATEGORIES: Record<ActivityCategory, CategoryMeta> = {
  prayer: {
    id: 'prayer',
    label: 'Prayer',
    icon: 'Moon',
    color: '#10B981',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-emerald-500',
    darkBgColor: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    darkBorderColor: 'dark:border-emerald-500'
  },
  work: {
    id: 'work',
    label: 'Work',
    icon: 'Briefcase',
    color: '#6366F1',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderColor: 'border-indigo-500',
    darkBgColor: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    darkBorderColor: 'dark:border-indigo-500'
  },
  exercise: {
    id: 'exercise',
    label: 'Exercise',
    icon: 'Flame',
    color: '#F43F5E',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-500',
    darkBgColor: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    darkBorderColor: 'dark:border-rose-500'
  },
  gardening: {
    id: 'gardening',
    label: 'Gardening',
    icon: 'Sprout',
    color: '#22C55E',
    bgColor: 'bg-green-50 text-green-700 border-green-200',
    borderColor: 'border-green-500',
    darkBgColor: 'dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/60',
    darkBorderColor: 'dark:border-green-500'
  },
  meals: {
    id: 'meals',
    label: 'Meals',
    icon: 'Utensils',
    color: '#F59E0B',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    borderColor: 'border-amber-500',
    darkBgColor: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    darkBorderColor: 'dark:border-amber-500'
  },
  coding: {
    id: 'coding',
    label: 'Coding',
    icon: 'Code2',
    color: '#06B6D4',
    bgColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    borderColor: 'border-cyan-500',
    darkBgColor: 'dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60',
    darkBorderColor: 'dark:border-cyan-500'
  },
  learning: {
    id: 'learning',
    label: 'Learning',
    icon: 'GraduationCap',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    borderColor: 'border-purple-500',
    darkBgColor: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    darkBorderColor: 'dark:border-purple-500'
  },
  personal_projects: {
    id: 'personal_projects',
    label: 'Projects',
    icon: 'Rocket',
    color: '#EC4899',
    bgColor: 'bg-pink-50 text-pink-700 border-pink-200',
    borderColor: 'border-pink-500',
    darkBgColor: 'dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
    darkBorderColor: 'dark:border-pink-500'
  },
  family: {
    id: 'family',
    label: 'Family',
    icon: 'Heart',
    color: '#EAB308',
    bgColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    borderColor: 'border-yellow-500',
    darkBgColor: 'dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800/60',
    darkBorderColor: 'dark:border-yellow-500'
  },
  rest: {
    id: 'rest',
    label: 'Rest',
    icon: 'Coffee',
    color: '#64748B',
    bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
    borderColor: 'border-slate-500',
    darkBgColor: 'dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700',
    darkBorderColor: 'dark:border-slate-500'
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    icon: 'Bed',
    color: '#3B82F6',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    borderColor: 'border-blue-500',
    darkBgColor: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    darkBorderColor: 'dark:border-blue-500'
  },
  other: {
    id: 'other',
    label: 'Other',
    icon: 'Sparkles',
    color: '#71717A',
    bgColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    borderColor: 'border-zinc-500',
    darkBgColor: 'dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700',
    darkBorderColor: 'dark:border-zinc-500'
  }
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: 'User',
  avatar: '👤',
  bio: '',
  theme: 'dark',
  timeFormat: '12h',
  weekStartsOn: 'monday',
  timezone: 'Asia/Colombo',
  dailyWorkTargetMinutes: 180, // 3 hours
  workWindowStart: '09:00',
  workWindowEnd: '17:00',
  wakeTime: '05:00',
  sleepTime: '22:30',
  mosqueTravelBufferMinutes: 15,
  notificationsEnabled: true,
  breakReminderMinutes: 45,
  sriLankaCity: 'Colombo',
  latitude: 6.9271,
  longitude: 79.8612,
  calculationMethod: 'MWL (Muslim World League)',
  madhab: 'shafii'
};

export const DEFAULT_PRAYER_TIMES: PrayerTime[] = [
  { name: 'fajr', label: 'Fajr', time: '04:58', mosqueBufferMinutes: 15, reminder: true },
  { name: 'sunrise', label: 'Sunrise', time: '06:08', mosqueBufferMinutes: 0, reminder: false },
  { name: 'dhuhr', label: 'Dhuhr', time: '12:12', mosqueBufferMinutes: 15, reminder: true },
  { name: 'asr', label: 'Asr (Shafi‘i)', time: '15:28', mosqueBufferMinutes: 15, reminder: true },
  { name: 'maghrib', label: 'Maghrib', time: '18:11', mosqueBufferMinutes: 15, reminder: true },
  { name: 'isha', label: 'Isha', time: '19:22', mosqueBufferMinutes: 15, reminder: true }
];

// Clean initial state: Starts empty. Only user-created items will be shown.
export function getInitialActivities(): Activity[] {
  return [];
}

export const INITIAL_PLANTS: Plant[] = [];
export const INITIAL_GARDENING_TASKS: GardeningTask[] = [];

// Workout reference routine templates (Guides for users to follow)
export const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'wp-abs-1',
    title: 'Abdominal Core & Stability Focus',
    dayOfWeek: 1, // Monday
    focusArea: 'Rectus Abdominis & Transverse Core',
    isRestDay: false,
    estimatedMinutes: 30,
    notes: 'Focus on deliberate mind-muscle contraction, no neck pulling.',
    exercises: [
      {
        id: 'ex-1',
        name: 'Forearm Plank with Squeeze',
        targetMuscle: 'Core & Abdominal Wall',
        instructions: 'Keep body in straight line, glutes engaged, draw navel toward spine.',
        sets: 3,
        durationSeconds: 45,
        restSeconds: 30
      },
      {
        id: 'ex-2',
        name: 'Controlled Bicycle Crunches',
        targetMuscle: 'Obliques & Upper Abs',
        instructions: 'Slow 2-second tempo per side, bring opposite elbow to knee with shoulder blade lifted.',
        sets: 3,
        reps: 20,
        restSeconds: 30
      },
      {
        id: 'ex-3',
        name: 'Lying Leg Raises with Hip Lift',
        targetMuscle: 'Lower Abdominals',
        instructions: 'Press lower back into floor, lower legs slowly without touching the ground.',
        sets: 3,
        reps: 15,
        restSeconds: 30
      },
      {
        id: 'ex-4',
        name: 'Russian Twists',
        targetMuscle: 'Obliques & Rotational Core',
        instructions: 'Elevate feet slightly or touch heels down, rotate torso smoothly side to side.',
        sets: 3,
        reps: 24,
        restSeconds: 30
      },
      {
        id: 'ex-5',
        name: 'Mountain Climbers Pace Control',
        targetMuscle: 'Core Endurance & Cardio',
        instructions: 'High plank position, drive knees to chest rhythmically.',
        sets: 3,
        durationSeconds: 35,
        restSeconds: 40
      }
    ]
  },
  {
    id: 'wp-abs-2',
    title: 'Full Body Mobility & Core Stamina',
    dayOfWeek: 2, // Tuesday
    focusArea: 'Full Body & Core',
    isRestDay: false,
    estimatedMinutes: 35,
    notes: 'Elevate heart rate and build core stability under fatigue.',
    exercises: [
      {
        id: 'ex-6',
        name: 'Bodyweight Air Squats',
        targetMuscle: 'Quads, Glutes & Core',
        instructions: 'Chest tall, knees tracking toes, full depth.',
        sets: 3,
        reps: 20,
        restSeconds: 45
      },
      {
        id: 'ex-7',
        name: 'Push-Up to Side Plank',
        targetMuscle: 'Chest, Shoulders & Lateral Core',
        instructions: 'Full push up, open arm toward ceiling into side plank.',
        sets: 3,
        reps: 12,
        restSeconds: 45
      },
      {
        id: 'ex-8',
        name: 'Dead Bugs',
        targetMuscle: 'Deep Transverse Abdominis',
        instructions: 'Alternate opposite arm and leg extension while maintaining neutral spine.',
        sets: 3,
        reps: 16,
        restSeconds: 30
      }
    ]
  },
  {
    id: 'wp-rest',
    title: 'Rest & Gentle Mobility Recovery',
    dayOfWeek: 3, // Wednesday
    focusArea: 'Recovery & Flexibility',
    isRestDay: true,
    estimatedMinutes: 15,
    notes: 'Active recovery day. Light walks, deep diaphragmatic breathing and hamstring stretches.',
    exercises: [
      {
        id: 'ex-9',
        name: 'Child’s Pose to Cobra Flow',
        targetMuscle: 'Spine & Lower Back',
        instructions: 'Breathe deeply, hold each position for 5 slow breaths.',
        sets: 3,
        durationSeconds: 60,
        restSeconds: 20
      }
    ]
  }
];

export const INITIAL_WORKOUT_LOGS: WorkoutLog[] = [];
export const INITIAL_WORK_TASKS: WorkTask[] = [];
export const INITIAL_WORK_SESSIONS: WorkSession[] = [];
export const INITIAL_GROWTH_GOALS: GrowthGoal[] = [];
export const INITIAL_GROWTH_SESSIONS: GrowthSession[] = [];
export const INITIAL_DAILY_HABITS: DailyHabit[] = [];

export function getInitialWeeklyGoals(): WeeklyGoal[] {
  return [];
}

export const INITIAL_PRAYER_LOGS: PrayerLog[] = [];

export const INITIAL_WEEKLY_REVIEW: WeeklyReviewNote = {
  id: 'rev-1',
  weekStart: getStartOfWeek(),
  highlights: '',
  challenges: '',
  actionItems: '',
  updatedAt: new Date().toISOString()
};
