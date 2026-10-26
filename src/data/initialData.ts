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
import { getTodayDateString, getStartOfWeek, addDays } from '../utils/time';

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
  userName: 'Abdul',
  avatar: '👨‍💻',
  bio: 'Software Engineer & Life Architecture Enthusiast',
  theme: 'dark',
  timeFormat: '12h',
  weekStartsOn: 'monday',
  timezone: 'Asia/Colombo',
  dailyWorkTargetMinutes: 180, // 3 hours
  workWindowStart: '09:00',
  workWindowEnd: '11:30',
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

export function getInitialActivities(): Activity[] {
  const today = getTodayDateString();

  return [
    {
      id: 'act-1',
      title: 'Fajr Prayer & Morning Dhikr',
      description: 'Congregation at the mosque followed by morning reflection.',
      startTime: '05:00',
      endTime: '05:45',
      date: today,
      category: 'prayer',
      isFixed: true,
      priority: 'critical',
      completed: true,
      completedAt: '05:40',
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-2',
      title: 'Abdominal Core & Mobility Workout',
      description: 'Plank progression, bicycle crunches, leg raises & dynamic mobility.',
      startTime: '06:00',
      endTime: '06:45',
      date: today,
      category: 'exercise',
      isFixed: false,
      priority: 'high',
      completed: true,
      completedAt: '06:45',
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-3',
      title: 'Garden Care & Plant Watering',
      description: 'Water chillies and mint, inspect tomato blossoms, clear dry leaves.',
      startTime: '07:00',
      endTime: '07:45',
      date: today,
      category: 'gardening',
      isFixed: false,
      priority: 'medium',
      completed: true,
      completedAt: '07:40',
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-4',
      title: 'Healthy Breakfast & Family Time',
      description: 'Nutritious breakfast and planning the day ahead.',
      startTime: '08:00',
      endTime: '08:45',
      date: today,
      category: 'meals',
      isFixed: false,
      priority: 'medium',
      completed: true,
      completedAt: '08:45',
      reminder: false,
      isRecurring: true
    },
    {
      id: 'act-5',
      title: 'Deep Work Session — System Architecture',
      description: 'Implement core modules, optimize database indexing, code review.',
      startTime: '09:00',
      endTime: '11:30',
      date: today,
      category: 'work',
      isFixed: false,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-6',
      title: 'Dhuhr Prayer & Mosque Congregation',
      description: 'Midday prayer at mosque with 15-minute travel buffer.',
      startTime: '12:00',
      endTime: '12:50',
      date: today,
      category: 'prayer',
      isFixed: true,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-7',
      title: 'Lunch & Rest Break',
      description: 'Wholesome meal followed by short restorative pause.',
      startTime: '13:00',
      endTime: '14:00',
      date: today,
      category: 'meals',
      isFixed: false,
      priority: 'medium',
      completed: false,
      reminder: false,
      isRecurring: true
    },
    {
      id: 'act-8',
      title: 'HNDIT Study Session — Network Systems',
      description: 'Review network security concepts, practical lab exercises.',
      startTime: '14:15',
      endTime: '15:15',
      date: today,
      category: 'learning',
      isFixed: false,
      priority: 'high',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-9',
      title: 'Asr Prayer & Afternoon Refresh',
      description: 'Asr prayer and light tea break.',
      startTime: '15:30',
      endTime: '16:15',
      date: today,
      category: 'prayer',
      isFixed: true,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-10',
      title: 'Coding Practice — TypeScript & React Architecture',
      description: 'Build reusable PWA components and test performance.',
      startTime: '16:30',
      endTime: '17:45',
      date: today,
      category: 'coding',
      isFixed: false,
      priority: 'high',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-11',
      title: 'Maghrib Prayer & Quran Recitation',
      description: 'Sunset prayer in congregation followed by surah reading.',
      startTime: '18:05',
      endTime: '18:50',
      date: today,
      category: 'prayer',
      isFixed: true,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-12',
      title: 'English Fluency & Vocabulary Practice',
      description: 'Listen to tech podcasts, articulate concepts aloud, flashcards.',
      startTime: '19:00',
      endTime: '19:35',
      date: today,
      category: 'learning',
      isFixed: false,
      priority: 'medium',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-13',
      title: 'Isha Prayer & Mosque Gathering',
      description: 'Night prayer at the local mosque.',
      startTime: '19:45',
      endTime: '20:30',
      date: today,
      category: 'prayer',
      isFixed: true,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    },
    {
      id: 'act-14',
      title: 'Dinner & Family Connection',
      description: 'Evening dinner and quality conversation.',
      startTime: '20:30',
      endTime: '21:15',
      date: today,
      category: 'family',
      isFixed: false,
      priority: 'medium',
      completed: false,
      reminder: false,
      isRecurring: true
    },
    {
      id: 'act-15',
      title: 'Personal Projects & Day Reflection',
      description: 'Review weekly progress, plan tomorrow, read 15 pages.',
      startTime: '21:30',
      endTime: '22:15',
      date: today,
      category: 'personal_projects',
      isFixed: false,
      priority: 'medium',
      completed: false,
      reminder: false,
      isRecurring: true
    },
    {
      id: 'act-16',
      title: 'Sleep & Night Recovery',
      description: 'Restorative sleep in a cool, dark room.',
      startTime: '22:30',
      endTime: '05:00',
      date: today,
      category: 'sleep',
      isFixed: true,
      priority: 'critical',
      completed: false,
      reminder: true,
      isRecurring: true
    }
  ];
}

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    name: 'Curry Leaf Plant',
    scientificName: 'Murraya koenigii',
    type: 'herb',
    location: 'Balcony Sunlight Stand',
    wateringFrequencyDays: 2,
    lastWateredDate: addDays(getTodayDateString(), -1),
    sunlight: 'Full Sun',
    notes: 'Prune top shoots to encourage bushy branching.'
  },
  {
    id: 'plant-2',
    name: 'Green Chillies',
    scientificName: 'Capsicum annuum',
    type: 'vegetable',
    location: 'Terracotta Planter #1',
    wateringFrequencyDays: 2,
    lastWateredDate: addDays(getTodayDateString(), -2), // Due today!
    sunlight: 'Full Sun',
    notes: 'Flowers emerging, added organic compost.'
  },
  {
    id: 'plant-3',
    name: 'Fresh Peppermint',
    scientificName: 'Mentha piperita',
    type: 'herb',
    location: 'Kitchen Windowsill',
    wateringFrequencyDays: 1, // Daily
    lastWateredDate: addDays(getTodayDateString(), -1), // Due today!
    sunlight: 'Partial Shade',
    notes: 'Loves moist soil. Harvest fresh leaves for morning tea.'
  },
  {
    id: 'plant-4',
    name: 'Roma Tomatoes',
    scientificName: 'Solanum lycopersicum',
    type: 'vegetable',
    location: 'Raised Garden Bed A',
    wateringFrequencyDays: 2,
    lastWateredDate: getTodayDateString(),
    sunlight: 'Full Sun',
    notes: 'Tied main stem to bamboo stake for support.'
  },
  {
    id: 'plant-5',
    name: 'Aloe Vera Barbadensis',
    scientificName: 'Aloe barbadensis miller',
    type: 'indoor',
    location: 'Living Room Shelf',
    wateringFrequencyDays: 7,
    lastWateredDate: addDays(getTodayDateString(), -4),
    sunlight: 'Indirect Light',
    notes: 'Drought tolerant succulent. Allow soil to dry out between waterings.'
  },
  {
    id: 'plant-6',
    name: 'Arabian Jasmine',
    scientificName: 'Jasminum sambac',
    type: 'flowering',
    location: 'Garden Entrance Pot',
    wateringFrequencyDays: 3,
    lastWateredDate: addDays(getTodayDateString(), -3), // Due today!
    sunlight: 'Full Sun',
    notes: 'Fragrant white blossoms; keep soil slightly acidic.'
  }
];

export const INITIAL_GARDENING_TASKS: GardeningTask[] = [
  {
    id: 'gt-1',
    plantId: 'plant-2',
    plantName: 'Green Chillies',
    title: 'Water Green Chillies & inspect underside of leaves',
    type: 'watering',
    durationMinutes: 10,
    date: getTodayDateString(),
    completed: true
  },
  {
    id: 'gt-2',
    plantId: 'plant-3',
    plantName: 'Fresh Peppermint',
    title: 'Moisturize peppermint pot & trim unruly runners',
    type: 'watering',
    durationMinutes: 10,
    date: getTodayDateString(),
    completed: true
  },
  {
    id: 'gt-3',
    plantId: 'plant-6',
    plantName: 'Arabian Jasmine',
    title: 'Deep root watering & deadhead spent jasmine blooms',
    type: 'pruning',
    durationMinutes: 15,
    date: getTodayDateString(),
    completed: false
  },
  {
    id: 'gt-4',
    title: 'Compost tea application on vegetable raised beds',
    type: 'fertilizing',
    durationMinutes: 20,
    date: addDays(getTodayDateString(), 1),
    completed: false
  }
];

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

export const INITIAL_WORKOUT_LOGS: WorkoutLog[] = [
  {
    id: 'wlog-1',
    date: getTodayDateString(),
    planId: 'wp-abs-1',
    planTitle: 'Abdominal Core & Stability Focus',
    completed: true,
    durationMinutes: 32,
    notes: 'Felt strong on planks; good engagement on lower leg raises.'
  },
  {
    id: 'wlog-2',
    date: addDays(getTodayDateString(), -1),
    planId: 'wp-abs-2',
    planTitle: 'Full Body Mobility & Core Stamina',
    completed: true,
    durationMinutes: 35,
    notes: 'High energy session.'
  },
  {
    id: 'wlog-3',
    date: addDays(getTodayDateString(), -2),
    planId: 'wp-abs-1',
    planTitle: 'Abdominal Core & Stability Focus',
    completed: true,
    durationMinutes: 30,
    notes: 'Consistent sets completed.'
  }
];

export const INITIAL_WORK_TASKS: WorkTask[] = [
  {
    id: 'wt-1',
    title: 'Implement token-based auth flow for API endpoints',
    completed: true,
    date: getTodayDateString(),
    estimatedMinutes: 60
  },
  {
    id: 'wt-2',
    title: 'Optimize database indexing on activity timeline queries',
    completed: false,
    date: getTodayDateString(),
    estimatedMinutes: 45
  },
  {
    id: 'wt-3',
    title: 'Code review PR #142: Refactor notification service',
    completed: false,
    date: getTodayDateString(),
    estimatedMinutes: 30
  }
];

export const INITIAL_WORK_SESSIONS: WorkSession[] = [
  {
    id: 'ws-1',
    date: addDays(getTodayDateString(), -1),
    startTime: '09:00',
    endTime: '11:45',
    durationMinutes: 165,
    targetMinutes: 180,
    notes: 'Completed sprint backlog items and fixed authentication race condition.'
  },
  {
    id: 'ws-2',
    date: addDays(getTodayDateString(), -2),
    startTime: '09:15',
    endTime: '12:00',
    durationMinutes: 165,
    targetMinutes: 180,
    notes: 'Refactored backend data sync and wrote unit test cases.'
  }
];

export const INITIAL_GROWTH_GOALS: GrowthGoal[] = [
  {
    id: 'gg-1',
    title: 'Fullstack React & TypeScript Mastery',
    category: 'coding',
    weeklyTargetMinutes: 420, // 7 hours
    color: '#06B6D4',
    icon: 'Code2',
    description: 'Advanced React patterns, state machines, offline PWA architectures.'
  },
  {
    id: 'gg-2',
    title: 'HNDIT Diploma Curriculum',
    category: 'hndit',
    weeklyTargetMinutes: 300, // 5 hours
    color: '#8B5CF6',
    icon: 'GraduationCap',
    description: 'Database design, network security protocols, system analysis coursework.'
  },
  {
    id: 'gg-3',
    title: 'Spoken English & Communication Fluency',
    category: 'english',
    weeklyTargetMinutes: 180, // 3 hours
    color: '#10B981',
    icon: 'MessageSquare',
    description: 'Daily speaking practice, technical articulation, vocabulary expansion.'
  },
  {
    id: 'gg-4',
    title: 'Books & Mindset Reading',
    category: 'reading',
    weeklyTargetMinutes: 120, // 2 hours
    color: '#F59E0B',
    icon: 'BookOpen',
    description: 'Deep work principles, software engineering best practices.'
  }
];

export const INITIAL_GROWTH_SESSIONS: GrowthSession[] = [
  {
    id: 'gs-1',
    goalId: 'gg-1',
    title: 'React Concurrent Mode & PWA Lifecycle',
    date: addDays(getTodayDateString(), -1),
    durationMinutes: 75,
    notes: 'Studied service worker cache invalidation strategies.'
  },
  {
    id: 'gs-2',
    goalId: 'gg-2',
    title: 'HNDIT Network Security Lab 3',
    date: addDays(getTodayDateString(), -1),
    durationMinutes: 60,
    notes: 'Configured VLAN tagging and firewall rules.'
  },
  {
    id: 'gs-3',
    goalId: 'gg-3',
    title: 'English Pronunciation & Tech Standup Drill',
    date: addDays(getTodayDateString(), -2),
    durationMinutes: 35,
    notes: 'Practiced presenting sprint achievements smoothly.'
  }
];

export const INITIAL_DAILY_HABITS: DailyHabit[] = [
  {
    id: 'hab-1',
    title: '5 Daily Prayers on Time',
    category: 'Spiritual',
    streak: 14,
    completedDates: [
      getTodayDateString(),
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2),
      addDays(getTodayDateString(), -3)
    ]
  },
  {
    id: 'hab-2',
    title: 'Core & Abdominal Training',
    category: 'Fitness',
    streak: 6,
    completedDates: [
      getTodayDateString(),
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2)
    ]
  },
  {
    id: 'hab-3',
    title: '3 Hours Deep Work Target',
    category: 'Work',
    streak: 5,
    completedDates: [
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2)
    ]
  },
  {
    id: 'hab-4',
    title: 'Garden Inspection & Hydration',
    category: 'Gardening',
    streak: 9,
    completedDates: [
      getTodayDateString(),
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2)
    ]
  },
  {
    id: 'hab-5',
    title: '3 Liters Pure Water Intake',
    category: 'Health',
    streak: 8,
    completedDates: [
      getTodayDateString(),
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2)
    ]
  },
  {
    id: 'hab-6',
    title: 'No Blue Light 30m Before Sleep',
    category: 'Sleep',
    streak: 4,
    completedDates: [
      addDays(getTodayDateString(), -1),
      addDays(getTodayDateString(), -2)
    ]
  }
];

export function getInitialWeeklyGoals(): WeeklyGoal[] {
  const weekStart = getStartOfWeek();

  return [
    {
      id: 'wg-1',
      title: 'Achieve 15 Hours Tracked Deep Work',
      category: 'Work',
      targetValue: 15,
      currentValue: 11.5,
      unit: 'hrs',
      completed: false,
      weekStart
    },
    {
      id: 'wg-2',
      title: 'Complete 5 Core & Abdominal Sessions',
      category: 'Fitness',
      targetValue: 5,
      currentValue: 4,
      unit: 'sessions',
      completed: false,
      weekStart
    },
    {
      id: 'wg-3',
      title: 'HNDIT Network Security Assignment Submission',
      category: 'Study',
      targetValue: 1,
      currentValue: 1,
      unit: 'milestone',
      completed: true,
      weekStart
    },
    {
      id: 'wg-4',
      title: 'Harvest Fresh Green Chillies & Mint Leaves',
      category: 'Gardening',
      targetValue: 2,
      currentValue: 1,
      unit: 'harvests',
      completed: false,
      weekStart
    },
    {
      id: 'wg-5',
      title: 'Read 50 Pages of Software Architecture Book',
      category: 'Growth',
      targetValue: 50,
      currentValue: 38,
      unit: 'pages',
      completed: false,
      weekStart
    }
  ];
}

export const INITIAL_PRAYER_LOGS: PrayerLog[] = [
  {
    date: getTodayDateString(),
    fajr: true,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  },
  {
    date: addDays(getTodayDateString(), -1),
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  },
  {
    date: addDays(getTodayDateString(), -2),
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  }
];

export const INITIAL_WEEKLY_REVIEW: WeeklyReviewNote = {
  id: 'rev-1',
  weekStart: getStartOfWeek(),
  highlights: 'Maintained strong morning workout streak; Deep work sessions yielded significant architecture progress.',
  challenges: 'Afternoon energy slump around 2:30 PM — solved by taking a brief 10-minute walk before study.',
  actionItems: 'Continue hydrating adequately and prep garden soil for organic compost next weekend.',
  updatedAt: new Date().toISOString()
};
