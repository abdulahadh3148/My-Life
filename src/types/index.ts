export type ActivityCategory =
  | 'prayer'
  | 'work'
  | 'exercise'
  | 'gardening'
  | 'meals'
  | 'coding'
  | 'learning'
  | 'personal_projects'
  | 'family'
  | 'rest'
  | 'sleep'
  | 'other';

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  darkBgColor: string;
  darkBorderColor: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime: string; // "HH:mm" (24h format for standard time processing)
  endTime: string;   // "HH:mm"
  date: string;      // "YYYY-MM-DD"
  category: ActivityCategory;
  isFixed: boolean;  // True for hard commitments like prayer or client calls; False for flexible blocks
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  completedAt?: string;
  reminder: boolean;
  isRecurring: boolean;
}

export interface FreeSlot {
  start: string;
  end: string;
  durationMinutes: number;
}

export interface OverlapConflict {
  id: string;
  activityA: Activity;
  activityB: Activity;
  overlapMinutes: number;
  explanation: string;
}

export interface ProposedAdjustment {
  activityId: string;
  activityTitle: string;
  currentStart: string;
  currentEnd: string;
  proposedStart: string;
  proposedEnd: string;
  reason: string;
}

export interface WorkSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  targetMinutes: number;
  notes?: string;
}

export interface WorkTask {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  estimatedMinutes?: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  instructions: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  completed?: boolean;
  videoUrl?: string;
  videoSourceTitle?: string;
  techniqueCues?: string[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  focusArea: string;
  isRestDay: boolean;
  estimatedMinutes: number;
  exercises: ExerciseItem[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  planId: string;
  planTitle: string;
  completed: boolean;
  durationMinutes: number;
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  type: 'vegetable' | 'herb' | 'flowering' | 'indoor' | 'fruit';
  location: string;
  wateringFrequencyDays: number; // e.g. 1 = daily, 2 = every other day, 3 = twice weekly, 7 = weekly
  lastWateredDate: string; // "YYYY-MM-DD"
  sunlight: 'Full Sun' | 'Partial Shade' | 'Indirect Light' | 'Deep Shade';
  notes?: string;
}

export interface GardeningTask {
  id: string;
  plantId?: string;
  plantName?: string;
  title: string;
  type: 'watering' | 'pruning' | 'fertilizing' | 'weeding' | 'harvesting' | 'general';
  durationMinutes: number;
  date: string;
  completed: boolean;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  name: PrayerName;
  label: string;
  time: string; // "HH:mm"
  mosqueBufferMinutes: number; // Prep + travel buffer before/after
  reminder: boolean;
  manualAdjustmentMinutes?: number;
}

export interface PrayerLog {
  date: string;
  fajr: boolean;
  sunrise?: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface GrowthGoal {
  id: string;
  title: string;
  category: 'coding' | 'hndit' | 'english' | 'personal_projects' | 'reading' | 'other';
  weeklyTargetMinutes: number;
  color: string;
  icon: string;
  description: string;
}

export interface GrowthSession {
  id: string;
  goalId: string;
  title: string;
  date: string;
  durationMinutes: number;
  notes?: string;
}

export interface DailyHabit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedDates: string[]; // List of YYYY-MM-DD dates completed
}

export interface WeeklyGoal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  weekStart: string; // "YYYY-MM-DD" of Monday
}

export interface UserSettings {
  userName: string;
  avatar: string;
  bio?: string;
  theme: 'dark' | 'light' | 'system';
  timeFormat: '12h' | '24h';
  weekStartsOn: 'monday' | 'sunday';
  timezone: string;
  dailyWorkTargetMinutes: number; // e.g. 180 (3 hrs)
  workWindowStart: string; // e.g. "09:00"
  workWindowEnd: string;   // e.g. "11:30"
  wakeTime: string;        // e.g. "05:00"
  sleepTime: string;       // e.g. "22:30"
  mosqueTravelBufferMinutes: number;
  notificationsEnabled: boolean;
  breakReminderMinutes: number;
  // Sri Lanka Prayer Settings
  sriLankaCity?: string;
  latitude?: number;
  longitude?: number;
  calculationMethod?: string;
  madhab?: 'shafii' | 'hanafi';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'prayer' | 'work' | 'reminder' | 'conflict' | 'system';
}

export interface WeeklyReviewNote {
  id: string;
  weekStart: string;
  highlights: string;
  challenges: string;
  actionItems: string;
  updatedAt: string;
}

// Re-export finance and explorer types
export * from './finance';
export * from './explorer';

