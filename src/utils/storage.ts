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
  AppNotification,
  IncomeRecord,
  ExpenseRecord,
  DebtRecord,
  ExplorerPlace
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
import {
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  INITIAL_DEBTS
} from '../data/initialFinanceData';
import { INITIAL_EXPLORER_PLACES } from '../data/initialExplorerData';

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
  // Feature 3: Finance
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  debts: DebtRecord[];
  // Feature 4: Sri Lanka Explorer
  explorerPlaces: ExplorerPlace[];
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
        message: 'Your personal life operating system is active. Check today’s timeline, prayers, and finance overview.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'system'
      }
    ],
    incomes: INITIAL_INCOMES,
    expenses: INITIAL_EXPENSES,
    debts: INITIAL_DEBTS,
    explorerPlaces: INITIAL_EXPLORER_PLACES
  };
}

// Legacy mock/dummy identifiers that should never be shown to real users
const MOCK_EXPLORER_IDS = new Set([
  'place-sigiriya',
  'place-galle',
  'place-ella',
  'place-mirissa',
  'place-yala',
  'place-horton',
  'place-jaffna',
  'place-arugam'
]);

const MOCK_FINANCE_IDS = new Set([
  'inc-1', 'inc-2', 'inc-3',
  'exp-1', 'exp-2', 'exp-3', 'exp-4', 'exp-5',
  'debt-1', 'debt-2', 'debt-3',
  'pay-1', 'pay-2'
]);

const MOCK_ACTIVITY_REGEX = /^act-(1[0-6]?|[1-9])$/;
const MOCK_PLANT_REGEX = /^plant-[1-9]$/;
const MOCK_GTASK_REGEX = /^gt(ask)?-[1-9]$/;
const MOCK_WORK_TASK_REGEX = /^(wt|task)-[1-9]$/;
const MOCK_WORK_SESSION_REGEX = /^(ws|session)-[1-9]$/;
const MOCK_GROWTH_GOAL_REGEX = /^(gg-[1-9]|goal-(react|fitness|gardening))$/;
const MOCK_GROWTH_SESSION_REGEX = /^gs-[1-9]$/;
const MOCK_HABIT_REGEX = /^(hab(it)?-[1-9]|habit-(quran|workout|code|sleep|water))$/;
const MOCK_WEEKLY_GOAL_REGEX = /^wg-[1-9]$/;
const MOCK_WORKOUT_LOG_REGEX = /^(wlog|wl|log)-[1-9]$/;
const MOCK_PRAYER_LOG_REGEX = /^plog-[1-9]$/;

export function loadStoredState(): AppStateData {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return getInitialState();
    
    // Merge safely with initial state to handle any new fields
    const initial = getInitialState();
    const cleanedState: AppStateData = {
      version: parsed.version || 1,
      settings: {
        ...initial.settings,
        ...(parsed.settings || {}),
        userName:
          parsed.settings?.userName &&
          parsed.settings.userName !== 'Abdul' &&
          parsed.settings.userName !== 'User'
            ? parsed.settings.userName
            : 'Guest',
        madhab: parsed.settings?.madhab || 'shafii'
      },
      prayerTimes: Array.isArray(parsed.prayerTimes) && parsed.prayerTimes.length ? parsed.prayerTimes : initial.prayerTimes,
      activities: (Array.isArray(parsed.activities) ? parsed.activities : initial.activities)
        .filter((a: any) => !MOCK_ACTIVITY_REGEX.test(a?.id || '')),
      plants: (Array.isArray(parsed.plants) ? parsed.plants : initial.plants)
        .filter((p: any) => !MOCK_PLANT_REGEX.test(p?.id || '')),
      gardeningTasks: (Array.isArray(parsed.gardeningTasks) ? parsed.gardeningTasks : initial.gardeningTasks)
        .filter((t: any) => !MOCK_GTASK_REGEX.test(t?.id || '')),
      workoutPlans: Array.isArray(parsed.workoutPlans) ? parsed.workoutPlans : initial.workoutPlans,
      workoutLogs: (Array.isArray(parsed.workoutLogs) ? parsed.workoutLogs : initial.workoutLogs)
        .filter((l: any) => !MOCK_WORKOUT_LOG_REGEX.test(l?.id || '')),
      workTasks: (Array.isArray(parsed.workTasks) ? parsed.workTasks : initial.workTasks)
        .filter((t: any) => !MOCK_WORK_TASK_REGEX.test(t?.id || '')),
      workSessions: (Array.isArray(parsed.workSessions) ? parsed.workSessions : initial.workSessions)
        .filter((s: any) => !MOCK_WORK_SESSION_REGEX.test(s?.id || '')),
      growthGoals: (Array.isArray(parsed.growthGoals) ? parsed.growthGoals : initial.growthGoals)
        .filter((g: any) => !MOCK_GROWTH_GOAL_REGEX.test(g?.id || '')),
      growthSessions: (Array.isArray(parsed.growthSessions) ? parsed.growthSessions : initial.growthSessions)
        .filter((s: any) => !MOCK_GROWTH_SESSION_REGEX.test(s?.id || '')),
      dailyHabits: (Array.isArray(parsed.dailyHabits) ? parsed.dailyHabits : initial.dailyHabits)
        .filter((h: any) => !MOCK_HABIT_REGEX.test(h?.id || '')),
      weeklyGoals: (Array.isArray(parsed.weeklyGoals) ? parsed.weeklyGoals : initial.weeklyGoals)
        .filter((g: any) => !MOCK_WEEKLY_GOAL_REGEX.test(g?.id || '')),
      prayerLogs: (Array.isArray(parsed.prayerLogs) ? parsed.prayerLogs : initial.prayerLogs)
        .filter((l: any) => !MOCK_PRAYER_LOG_REGEX.test(l?.id || '')),
      weeklyReview: parsed.weeklyReview && parsed.weeklyReview.highlights ? parsed.weeklyReview : initial.weeklyReview,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : initial.notifications,
      incomes: (Array.isArray(parsed.incomes) ? parsed.incomes : initial.incomes)
        .filter((i: any) => !MOCK_FINANCE_IDS.has(i?.id || '')),
      expenses: (Array.isArray(parsed.expenses) ? parsed.expenses : initial.expenses)
        .filter((e: any) => !MOCK_FINANCE_IDS.has(e?.id || '')),
      debts: (Array.isArray(parsed.debts) ? parsed.debts : initial.debts)
        .filter((d: any) => !MOCK_FINANCE_IDS.has(d?.id || '')),
      explorerPlaces: (Array.isArray(parsed.explorerPlaces) ? parsed.explorerPlaces : initial.explorerPlaces)
        .filter((p: any) => !MOCK_EXPLORER_IDS.has(p?.id || ''))
    };

    return cleanedState;
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

export interface BackupRecordCounts {
  activities: number;
  plants: number;
  gardeningTasks: number;
  workoutPlans: number;
  workoutLogs: number;
  workTasks: number;
  workSessions: number;
  growthGoals: number;
  growthSessions: number;
  dailyHabits: number;
  weeklyGoals: number;
  prayerLogs: number;
  incomes: number;
  expenses: number;
  debts: number;
  debtPayments: number;
  explorerPlaces: number;
  explorerPhotos: number;
}

export interface BackupMetadata {
  appIdentifier: 'mylife-os';
  backupVersion: 1;
  exportedAt: string;
  appVersion?: string;
  recordCounts: BackupRecordCounts;
}

export interface BackupEnvelope {
  appIdentifier: 'mylife-os';
  backupVersion: 1;
  exportedAt: string;
  metadata: BackupMetadata;
  state: AppStateData;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
  isLegacy?: boolean;
  exportedAt?: string;
  backupVersion?: number;
  recordCounts?: BackupRecordCounts;
  validatedState?: AppStateData;
}

export function computeRecordCounts(state: Partial<AppStateData>): BackupRecordCounts {
  const debts = Array.isArray(state.debts) ? state.debts : [];
  const debtPaymentsCount = debts.reduce(
    (acc, d) => acc + (Array.isArray(d?.payments) ? d.payments.length : 0),
    0
  );

  const places = Array.isArray(state.explorerPlaces) ? state.explorerPlaces : [];
  const photosCount = places.reduce(
    (acc, p) => acc + (Array.isArray(p?.photos) ? p.photos.length : 0),
    0
  );

  return {
    activities: Array.isArray(state.activities) ? state.activities.length : 0,
    plants: Array.isArray(state.plants) ? state.plants.length : 0,
    gardeningTasks: Array.isArray(state.gardeningTasks) ? state.gardeningTasks.length : 0,
    workoutPlans: Array.isArray(state.workoutPlans) ? state.workoutPlans.length : 0,
    workoutLogs: Array.isArray(state.workoutLogs) ? state.workoutLogs.length : 0,
    workTasks: Array.isArray(state.workTasks) ? state.workTasks.length : 0,
    workSessions: Array.isArray(state.workSessions) ? state.workSessions.length : 0,
    growthGoals: Array.isArray(state.growthGoals) ? state.growthGoals.length : 0,
    growthSessions: Array.isArray(state.growthSessions) ? state.growthSessions.length : 0,
    dailyHabits: Array.isArray(state.dailyHabits) ? state.dailyHabits.length : 0,
    weeklyGoals: Array.isArray(state.weeklyGoals) ? state.weeklyGoals.length : 0,
    prayerLogs: Array.isArray(state.prayerLogs) ? state.prayerLogs.length : 0,
    incomes: Array.isArray(state.incomes) ? state.incomes.length : 0,
    expenses: Array.isArray(state.expenses) ? state.expenses.length : 0,
    debts: debts.length,
    debtPayments: debtPaymentsCount,
    explorerPlaces: places.length,
    explorerPhotos: photosCount
  };
}

export function createBackupEnvelope(state: AppStateData): BackupEnvelope {
  const exportedAt = new Date().toISOString();
  const recordCounts = computeRecordCounts(state);
  return {
    appIdentifier: 'mylife-os',
    backupVersion: 1,
    exportedAt,
    metadata: {
      appIdentifier: 'mylife-os',
      backupVersion: 1,
      exportedAt,
      appVersion: '1.0.0',
      recordCounts
    },
    state
  };
}

export function exportStateAsJSON(state: AppStateData): void {
  const envelope = createBackupEnvelope(state);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(envelope, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mylife-os-backup-${dateStamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function createSafetyBackupSnapshot(state: AppStateData): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope = createBackupEnvelope(state);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(envelope, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mylife-os-safety-snapshot-${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.warn('Failed to auto-download safety snapshot:', err);
  }
}

export function validateImportedData(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Uploaded file is not a valid JSON object.' };
  }

  const payload = raw as Record<string, any>;
  const warnings: string[] = [];

  let candidateState: any = null;
  let isLegacy = false;
  let exportedAt: string | undefined;
  let backupVersion: number | undefined;

  // 1. Detect format (Enveloped vs Legacy raw state)
  if ('appIdentifier' in payload || 'backupVersion' in payload || 'state' in payload) {
    // Enveloped format
    if (payload.appIdentifier !== 'mylife-os') {
      return {
        valid: false,
        error: `Unsupported backup file: App identifier "${payload.appIdentifier || 'unknown'}" does not match MyLife OS.`
      };
    }

    if (typeof payload.backupVersion === 'number' && payload.backupVersion > 1) {
      return {
        valid: false,
        error: `This backup was created with a newer MyLife OS backup format (v${payload.backupVersion}). Please update the application.`
      };
    }

    if (!payload.state || typeof payload.state !== 'object' || Array.isArray(payload.state)) {
      return {
        valid: false,
        error: 'Backup envelope is missing a valid application state object.'
      };
    }

    candidateState = payload.state;
    isLegacy = false;
    backupVersion = payload.backupVersion || 1;
    exportedAt = payload.exportedAt || payload.metadata?.exportedAt;
  } else {
    // Legacy format (direct AppStateData object)
    if (!('activities' in payload) && !('settings' in payload)) {
      return {
        valid: false,
        error: 'Unrecognized file format: missing MyLife OS state structures.'
      };
    }
    candidateState = payload;
    isLegacy = true;
    backupVersion = 1;
    warnings.push('Legacy backup format detected (without metadata envelope).');
  }

  // 2. Validate Settings (singleton)
  if (candidateState.settings !== undefined) {
    if (typeof candidateState.settings !== 'object' || candidateState.settings === null || Array.isArray(candidateState.settings)) {
      return { valid: false, error: 'Malformed settings object in backup data.' };
    }
  }

  // 3. Helper to validate array collections and uniqueness of IDs
  const arrayCollections = [
    'activities',
    'plants',
    'gardeningTasks',
    'workoutPlans',
    'workoutLogs',
    'workTasks',
    'workSessions',
    'growthGoals',
    'growthSessions',
    'dailyHabits',
    'weeklyGoals',
    'prayerTimes',
    'prayerLogs',
    'incomes',
    'expenses',
    'debts',
    'explorerPlaces'
  ] as const;

  for (const collectionName of arrayCollections) {
    const val = candidateState[collectionName];
    if (val !== undefined) {
      if (!Array.isArray(val)) {
        return {
          valid: false,
          error: `Collection "${collectionName}" must be an array, found ${typeof val}.`
        };
      }

      // Check key uniqueness within collection (prayerTimes uses 'name', prayerLogs uses 'date', others use 'id')
      const seenKeys = new Set<string>();
      const keyField = collectionName === 'prayerTimes' ? 'name' : collectionName === 'prayerLogs' ? 'date' : 'id';
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        if (!item || typeof item !== 'object') {
          return {
            valid: false,
            error: `Invalid record in "${collectionName}" at index ${i}: expected an object.`
          };
        }
        const recordKey = item[keyField];
        if (typeof recordKey !== 'string' || !recordKey.trim()) {
          return {
            valid: false,
            error: `Record in "${collectionName}" at index ${i} is missing a valid non-empty string "${keyField}".`
          };
        }
        if (seenKeys.has(recordKey)) {
          return {
            valid: false,
            error: `Duplicate ${keyField} "${recordKey}" detected in "${collectionName}".`
          };
        }
        seenKeys.add(recordKey);
      }
    }
  }

  // 4. Validate Specific Fields & Nested Relationships

  // 4a. Activities
  if (Array.isArray(candidateState.activities)) {
    for (let i = 0; i < candidateState.activities.length; i++) {
      const act = candidateState.activities[i];
      if (typeof act.title !== 'string') {
        return { valid: false, error: `Activity at index ${i} is missing a string "title".` };
      }
      if (typeof act.date !== 'string') {
        return { valid: false, error: `Activity "${act.title}" is missing a valid string "date".` };
      }
    }
  }

  // 4b. Incomes
  if (Array.isArray(candidateState.incomes)) {
    for (let i = 0; i < candidateState.incomes.length; i++) {
      const inc = candidateState.incomes[i];
      if (typeof inc.amount !== 'number' || isNaN(inc.amount) || inc.amount < 0) {
        return { valid: false, error: `Income at index ${i} has an invalid amount (${inc.amount}).` };
      }
      if (typeof inc.source !== 'string' || !inc.source.trim()) {
        return { valid: false, error: `Income at index ${i} is missing a source.` };
      }
    }
  }

  // 4c. Expenses
  if (Array.isArray(candidateState.expenses)) {
    for (let i = 0; i < candidateState.expenses.length; i++) {
      const exp = candidateState.expenses[i];
      if (typeof exp.amount !== 'number' || isNaN(exp.amount) || exp.amount < 0) {
        return { valid: false, error: `Expense at index ${i} has an invalid amount (${exp.amount}).` };
      }
      if (typeof exp.category !== 'string' || !exp.category.trim()) {
        return { valid: false, error: `Expense at index ${i} is missing a category.` };
      }
    }
  }

  // 4d. Debts & nested DebtPayments
  if (Array.isArray(candidateState.debts)) {
    for (let i = 0; i < candidateState.debts.length; i++) {
      const debt = candidateState.debts[i];
      if (debt.type !== 'i_owe' && debt.type !== 'owed_to_me') {
        return {
          valid: false,
          error: `Debt "${debt.id}" has invalid type "${debt.type}". Must be "i_owe" or "owed_to_me".`
        };
      }
      if (typeof debt.personName !== 'string' || !debt.personName.trim()) {
        return { valid: false, error: `Debt "${debt.id}" is missing "personName".` };
      }
      if (debt.payments !== undefined) {
        if (!Array.isArray(debt.payments)) {
          return { valid: false, error: `Debt "${debt.id}" payments must be an array.` };
        }
        const seenPayIds = new Set<string>();
        for (let j = 0; j < debt.payments.length; j++) {
          const pay = debt.payments[j];
          if (!pay || typeof pay !== 'object') {
            return { valid: false, error: `Invalid payment in debt "${debt.id}" at index ${j}.` };
          }
          if (typeof pay.id !== 'string' || !pay.id.trim()) {
            return { valid: false, error: `Payment at index ${j} in debt "${debt.id}" is missing "id".` };
          }
          if (typeof pay.amount !== 'number' || isNaN(pay.amount)) {
            return { valid: false, error: `Payment "${pay.id}" in debt "${debt.id}" has invalid amount.` };
          }
          if (seenPayIds.has(pay.id)) {
            return { valid: false, error: `Duplicate payment ID "${pay.id}" in debt "${debt.id}".` };
          }
          seenPayIds.add(pay.id);
        }
      }
    }
  }

  // 4e. Explorer Places & nested PlacePhotos
  if (Array.isArray(candidateState.explorerPlaces)) {
    for (let i = 0; i < candidateState.explorerPlaces.length; i++) {
      const place = candidateState.explorerPlaces[i];
      if (typeof place.title !== 'string' || !place.title.trim()) {
        return { valid: false, error: `Explorer place at index ${i} is missing "title".` };
      }
      if (typeof place.district !== 'string') {
        return { valid: false, error: `Explorer place "${place.title}" is missing "district".` };
      }
      if (typeof place.latitude !== 'number' || isNaN(place.latitude) || typeof place.longitude !== 'number' || isNaN(place.longitude)) {
        return { valid: false, error: `Explorer place "${place.title}" has invalid latitude or longitude.` };
      }
      if (place.photos !== undefined) {
        if (!Array.isArray(place.photos)) {
          return { valid: false, error: `Explorer place "${place.title}" photos must be an array.` };
        }
        const seenPhotoIds = new Set<string>();
        for (let j = 0; j < place.photos.length; j++) {
          const photo = place.photos[j];
          if (!photo || typeof photo !== 'object') {
            return { valid: false, error: `Invalid photo in place "${place.title}" at index ${j}.` };
          }
          if (typeof photo.id !== 'string' || !photo.id.trim()) {
            return { valid: false, error: `Photo at index ${j} in place "${place.title}" is missing "id".` };
          }
          if (typeof photo.url !== 'string' || !photo.url.trim()) {
            return { valid: false, error: `Photo "${photo.id}" in place "${place.title}" is missing "url".` };
          }
          if (seenPhotoIds.has(photo.id)) {
            return { valid: false, error: `Duplicate photo ID "${photo.id}" in place "${place.title}".` };
          }
          seenPhotoIds.add(photo.id);
        }
      }
    }
  }

  // 5. Check Relational Integrity (soft warnings)
  if (Array.isArray(candidateState.plants) && Array.isArray(candidateState.gardeningTasks)) {
    const plantIds = new Set(candidateState.plants.map((p: any) => p.id));
    for (const task of candidateState.gardeningTasks) {
      if (task.plantId && !plantIds.has(task.plantId)) {
        warnings.push(`Gardening task "${task.title || task.id}" references non-existent plant "${task.plantId}".`);
      }
    }
  }

  if (Array.isArray(candidateState.workoutPlans) && Array.isArray(candidateState.workoutLogs)) {
    const planIds = new Set(candidateState.workoutPlans.map((p: any) => p.id));
    for (const log of candidateState.workoutLogs) {
      if (log.planId && !planIds.has(log.planId)) {
        warnings.push(`Workout log "${log.id}" references non-existent workout plan "${log.planId}".`);
      }
    }
  }

  if (Array.isArray(candidateState.workTasks) && Array.isArray(candidateState.workSessions)) {
    const taskIds = new Set(candidateState.workTasks.map((t: any) => t.id));
    for (const sess of candidateState.workSessions) {
      if (sess.taskId && !taskIds.has(sess.taskId)) {
        warnings.push(`Work session "${sess.id}" references non-existent work task "${sess.taskId}".`);
      }
    }
  }

  // 6. Build a complete, sanitized AppStateData by merging with default initial state
  const initial = getInitialState();
  const cleanState: AppStateData = {
    version: typeof candidateState.version === 'number' ? candidateState.version : 1,
    settings: { ...initial.settings, ...(candidateState.settings || {}) },
    prayerTimes: Array.isArray(candidateState.prayerTimes) && candidateState.prayerTimes.length ? candidateState.prayerTimes : initial.prayerTimes,
    activities: Array.isArray(candidateState.activities) ? candidateState.activities : initial.activities,
    plants: Array.isArray(candidateState.plants) ? candidateState.plants : initial.plants,
    gardeningTasks: Array.isArray(candidateState.gardeningTasks) ? candidateState.gardeningTasks : initial.gardeningTasks,
    workoutPlans: Array.isArray(candidateState.workoutPlans) ? candidateState.workoutPlans : initial.workoutPlans,
    workoutLogs: Array.isArray(candidateState.workoutLogs) ? candidateState.workoutLogs : initial.workoutLogs,
    workTasks: Array.isArray(candidateState.workTasks) ? candidateState.workTasks : initial.workTasks,
    workSessions: Array.isArray(candidateState.workSessions) ? candidateState.workSessions : initial.workSessions,
    growthGoals: Array.isArray(candidateState.growthGoals) ? candidateState.growthGoals : initial.growthGoals,
    growthSessions: Array.isArray(candidateState.growthSessions) ? candidateState.growthSessions : initial.growthSessions,
    dailyHabits: Array.isArray(candidateState.dailyHabits) ? candidateState.dailyHabits : initial.dailyHabits,
    weeklyGoals: Array.isArray(candidateState.weeklyGoals) ? candidateState.weeklyGoals : initial.weeklyGoals,
    prayerLogs: Array.isArray(candidateState.prayerLogs) ? candidateState.prayerLogs : initial.prayerLogs,
    weeklyReview: candidateState.weeklyReview || initial.weeklyReview,
    notifications: Array.isArray(candidateState.notifications) ? candidateState.notifications : initial.notifications,
    incomes: Array.isArray(candidateState.incomes) ? candidateState.incomes : initial.incomes,
    expenses: Array.isArray(candidateState.expenses) ? candidateState.expenses : initial.expenses,
    debts: Array.isArray(candidateState.debts) ? candidateState.debts : initial.debts,
    explorerPlaces: Array.isArray(candidateState.explorerPlaces) ? candidateState.explorerPlaces : initial.explorerPlaces
  };

  const actualCounts = computeRecordCounts(cleanState);

  // If envelope metadata has recordCounts, compare for transparency
  if (payload.metadata?.recordCounts && typeof payload.metadata.recordCounts === 'object') {
    const metaCounts = payload.metadata.recordCounts;
    for (const key of Object.keys(metaCounts)) {
      const expected = metaCounts[key];
      const actual = (actualCounts as any)[key];
      if (typeof expected === 'number' && actual !== expected) {
        warnings.push(`Record count mismatch for "${key}": metadata indicates ${expected}, file contains ${actual}.`);
      }
    }
  }

  return {
    valid: true,
    isLegacy,
    exportedAt,
    backupVersion,
    recordCounts: actualCounts,
    warnings: warnings.length > 0 ? warnings : undefined,
    validatedState: cleanState
  };
}
