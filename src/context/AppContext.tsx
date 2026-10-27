import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Activity,
  DailyHabit,
  GardeningTask,
  GrowthGoal,
  GrowthSession,
  Plant,
  PrayerLog,
  PrayerName,
  PrayerTime,
  ProposedAdjustment,
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
  DebtPayment,
  ExplorerPlace,
  PlacePhoto,
  CloudUserProfile
} from '../types';
import {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  saveUserDataToCloud,
  loadUserDataFromCloud,
  recordUserLogin
} from '../services/firebase';
import {
  AppStateData,
  loadStoredState,
  saveStateToStorage,
  getInitialState
} from '../utils/storage';
import { getTodayDateString, addDays, getStartOfWeek } from '../utils/time';
import { applyAdjustments } from '../utils/timeBalancer';
import { triggerSystemNotification } from '../utils/notifications';
import { SriLankaCity, fetchLivePrayerTimes, buildPrayerTimesList } from '../utils/prayerEngine';

export type NavView =
  | 'dashboard'
  | 'schedule'
  | 'work'
  | 'fitness'
  | 'gardening'
  | 'prayer'
  | 'growth'
  | 'weekly'
  | 'analytics'
  | 'settings'
  | 'finance'
  | 'explorer'
  | 'admin';

interface AppContextType {
  // Navigation & Date
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Modals & UI State
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isBalancerOpen: boolean;
  setIsBalancerOpen: (open: boolean) => void;
  isPwaPromptOpen: boolean;
  setIsPwaPromptOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Core Data
  state: AppStateData;
  settings: UserSettings;
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
  prayerTimes: PrayerTime[];
  prayerLogs: PrayerLog[];
  weeklyReview: WeeklyReviewNote;
  notifications: AppNotification[];
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  debts: DebtRecord[];
  explorerPlaces: ExplorerPlace[];

  // Computed
  todayActivities: Activity[];
  todayCompletedCount: number;
  todayCompletionPercentage: number;
  nextUpcomingActivity: Activity | null;
  unreadNotificationsCount: number;

  // Actions: Activities
  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  duplicateActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  applyBalancerFixes: (adjustments: ProposedAdjustment[]) => void;

  // Actions: Work
  addWorkTask: (title: string, estimatedMinutes?: number) => void;
  toggleWorkTask: (id: string) => void;
  deleteWorkTask: (id: string) => void;
  logWorkSession: (session: Omit<WorkSession, 'id'>) => void;

  // Actions: Fitness
  logWorkout: (log: Omit<WorkoutLog, 'id'>) => void;
  updateWorkoutPlan: (id: string, updates: Partial<WorkoutPlan>) => void;

  // Actions: Gardening
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  toggleGardeningTask: (id: string) => void;
  addGardeningTask: (task: Omit<GardeningTask, 'id'>) => void;

  // Actions: Prayer & Sri Lanka
  togglePrayerCompleted: (name: PrayerName, date?: string) => void;
  updatePrayerTime: (name: PrayerName, updates: Partial<PrayerTime>) => void;
  setSriLankaCity: (city: SriLankaCity) => Promise<void>;
  setMadhab: (madhab: 'shafii' | 'hanafi') => Promise<void>;
  syncPrayerTimes: (forceApi?: boolean) => Promise<void>;

  // Actions: Finance
  addIncome: (record: Omit<IncomeRecord, 'id' | 'createdAt'>) => void;
  updateIncome: (id: string, updates: Partial<IncomeRecord>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (record: Omit<ExpenseRecord, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<ExpenseRecord>) => void;
  deleteExpense: (id: string) => void;
  addDebt: (debt: Omit<DebtRecord, 'id' | 'createdAt' | 'paidAmount' | 'status' | 'payments'>) => void;
  updateDebt: (id: string, updates: Partial<DebtRecord>) => void;
  deleteDebt: (id: string) => void;
  addDebtPayment: (debtId: string, payment: Omit<DebtPayment, 'id'>) => void;
  deleteDebtPayment: (debtId: string, paymentId: string) => void;

  // Actions: Sri Lanka Explorer
  addExplorerPlace: (place: Omit<ExplorerPlace, 'id' | 'createdAt'>) => void;
  updateExplorerPlace: (id: string, updates: Partial<ExplorerPlace>) => void;
  deleteExplorerPlace: (id: string) => void;
  addPlacePhoto: (placeId: string, photo: Omit<PlacePhoto, 'id' | 'uploadedAt'>) => void;
  deletePlacePhoto: (placeId: string, photoId: string) => void;

  // Actions: Growth
  addGrowthGoal: (goal: Omit<GrowthGoal, 'id'>) => void;
  logGrowthSession: (session: Omit<GrowthSession, 'id'>) => void;

  // Actions: Habits
  toggleHabit: (id: string, date?: string) => void;
  addHabit: (title: string, category: string) => void;
  deleteHabit: (id: string) => void;

  // Actions: Weekly
  updateWeeklyGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
  addWeeklyGoal: (goal: Omit<WeeklyGoal, 'id'>) => void;
  updateWeeklyReview: (review: Partial<WeeklyReviewNote>) => void;
  copyPreviousWeekRoutine: () => { count: number };

  // Actions: Settings & System
  updateSettings: (updates: Partial<UserSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: { title: string; message: string; type: AppNotification['type'] }) => void;
  resetToDefaults: () => void;
  importState: (data: AppStateData) => void;

  // Cloud Auth & Sync
  currentUser: CloudUserProfile | null;
  isCloudSyncing: boolean;
  lastSyncedAt: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppStateData>(() => loadStoredState());
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());

  // Modal controls
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isBalancerOpen, setIsBalancerOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Cloud Authentication & Sync
  const [currentUser, setCurrentUser] = useState<CloudUserProfile | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(state.settings.lastCloudSync || null);

  // Synchronize state to localStorage on modification
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Synchronize dark/light theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.settings.theme]);

  // Filter activities for selected date
  const todayActivities = useMemo(() => {
    return state.activities.filter(a => a.date === selectedDate);
  }, [state.activities, selectedDate]);

  const todayCompletedCount = useMemo(() => {
    return todayActivities.filter(a => a.completed).length;
  }, [todayActivities]);

  const todayCompletionPercentage = useMemo(() => {
    if (todayActivities.length === 0) return 0;
    return Math.round((todayCompletedCount / todayActivities.length) * 100);
  }, [todayActivities, todayCompletedCount]);

  // Determine next upcoming activity for today
  const nextUpcomingActivity = useMemo(() => {
    const today = getTodayDateString();
    if (selectedDate !== today) return null;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const upcoming = todayActivities
      .filter(act => {
        if (act.completed) return false;
        const [h, m] = act.startTime.split(':').map(Number);
        const startMins = h * 60 + m;
        return startMins >= currentMins - 15; // Within 15 mins ago or in future
      })
      .sort((a, b) => {
        const [h1, m1] = a.startTime.split(':').map(Number);
        const [h2, m2] = b.startTime.split(':').map(Number);
        return h1 * 60 + m1 - (h2 * 60 + m2);
      });

    return upcoming.length > 0 ? upcoming[0] : null;
  }, [todayActivities, selectedDate]);

  const unreadNotificationsCount = useMemo(() => {
    return state.notifications.filter(n => !n.read).length;
  }, [state.notifications]);

  // Helper to add in-app & system notification
  const addNotification = (notif: { title: string; message: string; type: AppNotification['type'] }) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: notif.title,
      message: notif.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: notif.type
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));

    if (state.settings.notificationsEnabled) {
      triggerSystemNotification(notif.title, { body: notif.message });
    }
  };

  // Activity Actions
  const addActivity = (activityData: Omit<Activity, 'id'>): Activity => {
    const newAct: Activity = {
      ...activityData,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };

    setState(prev => ({
      ...prev,
      activities: [...prev.activities, newAct]
    }));

    addNotification({
      title: 'Activity Scheduled',
      message: `"${newAct.title}" was added to ${newAct.date} at ${newAct.startTime}.`,
      type: 'reminder'
    });

    return newAct;
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.map(a => (a.id === id ? { ...a, ...updates } : a))
    }));
  };

  const deleteActivity = (id: string) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id)
    }));
  };

  const duplicateActivity = (id: string) => {
    const target = state.activities.find(a => a.id === id);
    if (!target) return;

    const duplicated: Activity = {
      ...target,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${target.title} (Copy)`,
      completed: false,
      completedAt: undefined
    };

    setState(prev => ({
      ...prev,
      activities: [...prev.activities, duplicated]
    }));
  };

  const toggleActivityComplete = (id: string) => {
    setState(prev => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        ...prev,
        activities: prev.activities.map(a => {
          if (a.id === id) {
            const nextCompleted = !a.completed;
            return {
              ...a,
              completed: nextCompleted,
              completedAt: nextCompleted ? nowStr : undefined
            };
          }
          return a;
        })
      };
    });
  };

  const applyBalancerFixes = (adjustments: ProposedAdjustment[]) => {
    setState(prev => ({
      ...prev,
      activities: applyAdjustments(prev.activities, adjustments)
    }));

    addNotification({
      title: 'Schedule Rebalanced',
      message: `Smart Balancer resolved ${adjustments.length} activity clash(es).`,
      type: 'system'
    });
  };

  // Work Actions
  const addWorkTask = (title: string, estimatedMinutes?: number) => {
    const newTask: WorkTask = {
      id: `wt-${Date.now()}`,
      title,
      completed: false,
      date: selectedDate,
      estimatedMinutes
    };

    setState(prev => ({
      ...prev,
      workTasks: [newTask, ...prev.workTasks]
    }));
  };

  const toggleWorkTask = (id: string) => {
    setState(prev => ({
      ...prev,
      workTasks: prev.workTasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    }));
  };

  const deleteWorkTask = (id: string) => {
    setState(prev => ({
      ...prev,
      workTasks: prev.workTasks.filter(t => t.id !== id)
    }));
  };

  const logWorkSession = (sessionData: Omit<WorkSession, 'id'>) => {
    const newSession: WorkSession = {
      ...sessionData,
      id: `ws-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      workSessions: [newSession, ...prev.workSessions]
    }));

    addNotification({
      title: 'Work Session Logged',
      message: `Completed ${sessionData.durationMinutes} minutes of focused deep work.`,
      type: 'work'
    });
  };

  // Fitness Actions
  const logWorkout = (logData: Omit<WorkoutLog, 'id'>) => {
    const newLog: WorkoutLog = {
      ...logData,
      id: `wlog-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      workoutLogs: [newLog, ...prev.workoutLogs]
    }));

    addNotification({
      title: 'Workout Completed',
      message: `Logged ${logData.planTitle} (${logData.durationMinutes} mins). Excellent discipline!`,
      type: 'system'
    });
  };

  const updateWorkoutPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    setState(prev => ({
      ...prev,
      workoutPlans: prev.workoutPlans.map(p => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  // Gardening Actions
  const addPlant = (plantData: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: `plant-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      plants: [...prev.plants, newPlant]
    }));
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setState(prev => ({
      ...prev,
      plants: prev.plants.map(p => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  const deletePlant = (id: string) => {
    setState(prev => ({
      ...prev,
      plants: prev.plants.filter(p => p.id !== id),
      gardeningTasks: prev.gardeningTasks.filter(t => t.plantId !== id)
    }));
  };

  const waterPlant = (id: string) => {
    const today = getTodayDateString();
    const plant = state.plants.find(p => p.id === id);

    setState(prev => ({
      ...prev,
      plants: prev.plants.map(p => (p.id === id ? { ...p, lastWateredDate: today } : p)),
      gardeningTasks: prev.gardeningTasks.map(t =>
        t.plantId === id && t.type === 'watering' && t.date === today ? { ...t, completed: true } : t
      )
    }));

    if (plant) {
      addNotification({
        title: 'Plant Hydrated',
        message: `${plant.name} watered successfully on ${today}.`,
        type: 'reminder'
      });
    }
  };

  const toggleGardeningTask = (id: string) => {
    setState(prev => ({
      ...prev,
      gardeningTasks: prev.gardeningTasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    }));
  };

  const addGardeningTask = (taskData: Omit<GardeningTask, 'id'>) => {
    const newTask: GardeningTask = {
      ...taskData,
      id: `gt-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      gardeningTasks: [newTask, ...prev.gardeningTasks]
    }));
  };

  // Prayer Actions
  const togglePrayerCompleted = (name: PrayerName, dateStr: string = selectedDate) => {
    setState(prev => {
      const existing = prev.prayerLogs.find(l => l.date === dateStr);
      let newLogs: PrayerLog[];

      if (existing) {
        newLogs = prev.prayerLogs.map(l => {
          if (l.date === dateStr) {
            return { ...l, [name]: !l[name] };
          }
          return l;
        });
      } else {
        const freshLog: PrayerLog = {
          date: dateStr,
          fajr: false,
          sunrise: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
          [name]: true
        };
        newLogs = [freshLog, ...prev.prayerLogs];
      }

      return {
        ...prev,
        prayerLogs: newLogs
      };
    });
  };

  const updatePrayerTime = (name: PrayerName, updates: Partial<PrayerTime>) => {
    setState(prev => ({
      ...prev,
      prayerTimes: prev.prayerTimes.map(pt => (pt.name === name ? { ...pt, ...updates } : pt))
    }));
  };

  const setSriLankaCity = async (city: SriLankaCity) => {
    const madhab = state.settings.madhab || 'shafii';
    const calculated = await fetchLivePrayerTimes(city.name, city.latitude, city.longitude, new Date(), madhab);
    const updatedPrayerTimes = buildPrayerTimesList(calculated, undefined, state.prayerTimes, madhab);

    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sriLankaCity: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: 'Asia/Colombo'
      },
      prayerTimes: updatedPrayerTimes
    }));
  };

  const setMadhab = async (madhab: 'shafii' | 'hanafi') => {
    const city = state.settings.sriLankaCity || 'Colombo';
    const lat = state.settings.latitude || 6.9271;
    const lng = state.settings.longitude || 79.8612;
    const calculated = await fetchLivePrayerTimes(city, lat, lng, new Date(), madhab);
    const updatedPrayerTimes = buildPrayerTimesList(calculated, undefined, state.prayerTimes, madhab);

    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        madhab
      },
      prayerTimes: updatedPrayerTimes
    }));
  };

  const syncPrayerTimes = async (forceApi: boolean = false) => {
    const city = state.settings.sriLankaCity || 'Colombo';
    const lat = state.settings.latitude || 6.9271;
    const lng = state.settings.longitude || 79.8612;
    const madhab = state.settings.madhab || 'shafii';

    const calculated = await fetchLivePrayerTimes(city, lat, lng, new Date(), madhab);
    const updatedPrayerTimes = buildPrayerTimesList(calculated, undefined, state.prayerTimes, madhab);

    setState(prev => ({
      ...prev,
      prayerTimes: updatedPrayerTimes
    }));
  };

  // Finance Actions
  const addIncome = (data: Omit<IncomeRecord, 'id' | 'createdAt'>) => {
    const newIncome: IncomeRecord = {
      ...data,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, incomes: [newIncome, ...(prev.incomes || [])] }));
    addNotification({
      title: 'Income Recorded',
      message: `Added Rs. ${data.amount.toLocaleString()} from ${data.source}.`,
      type: 'system'
    });
  };

  const updateIncome = (id: string, updates: Partial<IncomeRecord>) => {
    setState(prev => ({
      ...prev,
      incomes: (prev.incomes || []).map(i => i.id === id ? { ...i, ...updates } : i)
    }));
  };

  const deleteIncome = (id: string) => {
    setState(prev => ({
      ...prev,
      incomes: (prev.incomes || []).filter(i => i.id !== id)
    }));
  };

  const addExpense = (data: Omit<ExpenseRecord, 'id' | 'createdAt'>) => {
    const newExpense: ExpenseRecord = {
      ...data,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, expenses: [newExpense, ...(prev.expenses || [])] }));
    addNotification({
      title: 'Expense Recorded',
      message: `Recorded Rs. ${data.amount.toLocaleString()} for ${data.category}.`,
      type: 'system'
    });
  };

  const updateExpense = (id: string, updates: Partial<ExpenseRecord>) => {
    setState(prev => ({
      ...prev,
      expenses: (prev.expenses || []).map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: (prev.expenses || []).filter(e => e.id !== id)
    }));
  };

  const addDebt = (data: Omit<DebtRecord, 'id' | 'createdAt' | 'paidAmount' | 'status' | 'payments'>) => {
    const newDebt: DebtRecord = {
      ...data,
      id: `debt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      paidAmount: 0,
      status: 'pending',
      payments: [],
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, debts: [newDebt, ...(prev.debts || [])] }));
  };

  const updateDebt = (id: string, updates: Partial<DebtRecord>) => {
    setState(prev => ({
      ...prev,
      debts: (prev.debts || []).map(d => {
        if (d.id !== id) return d;
        const updated = { ...d, ...updates };
        const paid = updated.paidAmount || 0;
        updated.status = paid >= updated.originalAmount ? 'settled' : paid > 0 ? 'partially_paid' : 'pending';
        return updated;
      })
    }));
  };

  const deleteDebt = (id: string) => {
    setState(prev => ({
      ...prev,
      debts: (prev.debts || []).filter(d => d.id !== id)
    }));
  };

  const addDebtPayment = (debtId: string, paymentData: Omit<DebtPayment, 'id'>) => {
    const newPayment: DebtPayment = {
      ...paymentData,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    setState(prev => ({
      ...prev,
      debts: (prev.debts || []).map(d => {
        if (d.id !== debtId) return d;
        const payments = [...(d.payments || []), newPayment];
        const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
        const status = paidAmount >= d.originalAmount ? 'settled' : 'partially_paid';
        return { ...d, payments, paidAmount, status };
      })
    }));
    addNotification({
      title: 'Payment Logged',
      message: `Recorded payment of Rs. ${paymentData.amount.toLocaleString()}.`,
      type: 'system'
    });
  };

  const deleteDebtPayment = (debtId: string, paymentId: string) => {
    setState(prev => ({
      ...prev,
      debts: (prev.debts || []).map(d => {
        if (d.id !== debtId) return d;
        const payments = (d.payments || []).filter(p => p.id !== paymentId);
        const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
        const status = paidAmount >= d.originalAmount ? 'settled' : paidAmount > 0 ? 'partially_paid' : 'pending';
        return { ...d, payments, paidAmount, status };
      })
    }));
  };

  // Sri Lanka Explorer Actions
  const addExplorerPlace = (placeData: Omit<ExplorerPlace, 'id' | 'createdAt'>) => {
    const newPlace: ExplorerPlace = {
      ...placeData,
      id: `place-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      explorerPlaces: [newPlace, ...(prev.explorerPlaces || [])]
    }));
    addNotification({
      title: 'Destination Added',
      message: `Added ${placeData.title} to your Sri Lanka Explorer Journal.`,
      type: 'system'
    });
  };

  const updateExplorerPlace = (id: string, updates: Partial<ExplorerPlace>) => {
    setState(prev => ({
      ...prev,
      explorerPlaces: (prev.explorerPlaces || []).map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    }));
  };

  const deleteExplorerPlace = (id: string) => {
    setState(prev => ({
      ...prev,
      explorerPlaces: (prev.explorerPlaces || []).filter(p => p.id !== id)
    }));
  };

  const addPlacePhoto = (placeId: string, photoData: Omit<PlacePhoto, 'id' | 'uploadedAt'>) => {
    const newPhoto: PlacePhoto = {
      ...photoData,
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      uploadedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      explorerPlaces: (prev.explorerPlaces || []).map(p =>
        p.id === placeId ? { ...p, photos: [...(p.photos || []), newPhoto] } : p
      )
    }));
  };

  const deletePlacePhoto = (placeId: string, photoId: string) => {
    setState(prev => ({
      ...prev,
      explorerPlaces: (prev.explorerPlaces || []).map(p =>
        p.id === placeId ? { ...p, photos: (p.photos || []).filter(ph => ph.id !== photoId) } : p
      )
    }));
  };

  // Personal Growth Actions
  const addGrowthGoal = (goalData: Omit<GrowthGoal, 'id'>) => {
    const newGoal: GrowthGoal = {
      ...goalData,
      id: `gg-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      growthGoals: [...prev.growthGoals, newGoal]
    }));
  };

  const logGrowthSession = (sessionData: Omit<GrowthSession, 'id'>) => {
    const newSession: GrowthSession = {
      ...sessionData,
      id: `gs-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      growthSessions: [newSession, ...prev.growthSessions]
    }));

    addNotification({
      title: 'Learning Session Completed',
      message: `Logged ${sessionData.durationMinutes} mins for ${sessionData.title}. Keep growing!`,
      type: 'system'
    });
  };

  // Daily Habits Actions
  const toggleHabit = (id: string, dateStr: string = selectedDate) => {
    setState(prev => ({
      ...prev,
      dailyHabits: prev.dailyHabits.map(h => {
        if (h.id === id) {
          const isDone = h.completedDates.includes(dateStr);
          const nextDates = isDone
            ? h.completedDates.filter(d => d !== dateStr)
            : [...h.completedDates, dateStr];

          const nextStreak = isDone ? Math.max(0, h.streak - 1) : h.streak + 1;

          return {
            ...h,
            completedDates: nextDates,
            streak: nextStreak
          };
        }
        return h;
      })
    }));
  };

  const addHabit = (title: string, category: string) => {
    const newHabit: DailyHabit = {
      id: `hab-${Date.now()}`,
      title,
      category,
      streak: 0,
      completedDates: []
    };

    setState(prev => ({
      ...prev,
      dailyHabits: [...prev.dailyHabits, newHabit]
    }));
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      dailyHabits: prev.dailyHabits.filter(h => h.id !== id)
    }));
  };

  // Weekly Actions
  const updateWeeklyGoal = (id: string, updates: Partial<WeeklyGoal>) => {
    setState(prev => ({
      ...prev,
      weeklyGoals: prev.weeklyGoals.map(g => (g.id === id ? { ...g, ...updates } : g))
    }));
  };

  const addWeeklyGoal = (goalData: Omit<WeeklyGoal, 'id'>) => {
    const newGoal: WeeklyGoal = {
      ...goalData,
      id: `wg-${Date.now()}`
    };

    setState(prev => ({
      ...prev,
      weeklyGoals: [...prev.weeklyGoals, newGoal]
    }));
  };

  const updateWeeklyReview = (reviewUpdates: Partial<WeeklyReviewNote>) => {
    setState(prev => ({
      ...prev,
      weeklyReview: {
        ...prev.weeklyReview,
        ...reviewUpdates,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const copyPreviousWeekRoutine = (): { count: number } => {
    const currentWeekStart = getStartOfWeek(new Date(selectedDate), state.settings.weekStartsOn);
    const prevWeekStart = addDays(currentWeekStart, -7);

    // Get recurring activities from previous week days
    const prevDays = Array.from({ length: 7 }, (_, i) => addDays(prevWeekStart, i));
    const prevActivities = state.activities.filter(a => prevDays.includes(a.date));

    if (prevActivities.length === 0) return { count: 0 };

    const newActivities: Activity[] = [];
    prevActivities.forEach(oldAct => {
      // Map to corresponding day in current week
      const dayOffset = prevDays.indexOf(oldAct.date);
      const targetDate = addDays(currentWeekStart, dayOffset);

      // Avoid creating duplicates if activity with same title & startTime already exists
      const exists = state.activities.some(
        a => a.date === targetDate && a.title === oldAct.title && a.startTime === oldAct.startTime
      );

      if (!exists) {
        newActivities.push({
          ...oldAct,
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: targetDate,
          completed: false,
          completedAt: undefined
        });
      }
    });

    setState(prev => ({
      ...prev,
      activities: [...prev.activities, ...newActivities]
    }));

    return { count: newActivities.length };
  };

  // Settings & System
  const updateSettings = (updates: Partial<UserSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  const resetToDefaults = () => {
    const initial = getInitialState();
    setState(initial);
    saveStateToStorage(initial);
  };

  const importState = (newData: AppStateData) => {
    setState(newData);
    saveStateToStorage(newData);
  };

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        let userRole: 'admin' | 'user' = 'user';
        try {
          const rec = await recordUserLogin(user, {
            placesCount: state.explorerPlaces.length,
            activitiesCount: state.activities.length
          });
          userRole = rec.role;
        } catch (e) {
          console.warn('Could not record user login:', e);
        }

        const profile: CloudUserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: userRole
        };
        setCurrentUser(profile);

        const googleName = user.displayName || user.email?.split('@')[0] || 'User';

        // Fetch cloud data and merge
        try {
          setIsCloudSyncing(true);
          const cloudData = await loadUserDataFromCloud(user.uid);
          if (cloudData && typeof cloudData === 'object' && cloudData.version) {
            setState((prev) => ({
              ...prev,
              ...cloudData,
              settings: {
                ...prev.settings,
                ...(cloudData.settings || {}),
                userName: googleName,
                cloudSyncEnabled: true,
                lastCloudSync: new Date().toISOString()
              }
            }));
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            addNotification({
              title: 'Cloud Data Connected',
              message: `Welcome, ${googleName}! Your cloud data is connected.`,
              type: 'system'
            });
          } else {
            // First time: backup current local state to cloud
            setState((prev) => ({
              ...prev,
              settings: {
                ...prev.settings,
                userName: googleName,
                cloudSyncEnabled: true,
                lastCloudSync: new Date().toISOString()
              }
            }));
            await saveUserDataToCloud(user.uid, {
              ...state,
              settings: {
                ...state.settings,
                userName: googleName,
                cloudSyncEnabled: true,
                lastCloudSync: new Date().toISOString()
              }
            });
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            addNotification({
              title: 'Cloud Backup Active',
              message: `Welcome, ${googleName}! Your data is backed up to Google Cloud.`,
              type: 'system'
            });
          }
        } catch (err) {
          console.error('Error syncing with Firebase Cloud:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Continuous auto-sync when state updates while logged in (debounced by 2.5s)
  useEffect(() => {
    if (!currentUser) return;
    const timer = setTimeout(() => {
      saveUserDataToCloud(currentUser.uid, state)
        .then(() => {
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        })
        .catch((err) => {
          console.warn('Auto cloud sync issue:', err);
        });
    }, 2500);

    return () => clearTimeout(timer);
  }, [state, currentUser]);

  const loginWithGoogle = async () => {
    try {
      setIsCloudSyncing(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      addNotification({
        title: 'Sign In Failed',
        message: err.message || 'Could not complete Google Sign-In. Please check pop-up permissions.',
        type: 'system'
      });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          userName: 'Guest',
          cloudSyncEnabled: false
        }
      }));
      addNotification({
        title: 'Logged Out',
        message: 'You have signed out from Google Cloud. Local data remains safe on this device.',
        type: 'system'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const syncWithCloud = async () => {
    if (!currentUser) {
      await loginWithGoogle();
      return;
    }
    try {
      setIsCloudSyncing(true);
      await saveUserDataToCloud(currentUser.uid, state);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      addNotification({
        title: 'Cloud Sync Complete',
        message: 'All your schedules, prayer logs, finances, and places are safely saved in Google Cloud.',
        type: 'system'
      });
    } catch (err: any) {
      console.error('Manual sync failed:', err);
      addNotification({
        title: 'Cloud Sync Failed',
        message: err.message || 'Failed to sync with cloud. Check internet connection.',
        type: 'system'
      });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedDate,
        setSelectedDate,

        isQuickAddOpen,
        setIsQuickAddOpen,
        isBalancerOpen,
        setIsBalancerOpen,
        isPwaPromptOpen,
        setIsPwaPromptOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,

        state,
        settings: state.settings,
        activities: state.activities,
        plants: state.plants,
        gardeningTasks: state.gardeningTasks,
        workoutPlans: state.workoutPlans,
        workoutLogs: state.workoutLogs,
        workTasks: state.workTasks,
        workSessions: state.workSessions,
        growthGoals: state.growthGoals,
        growthSessions: state.growthSessions,
        dailyHabits: state.dailyHabits,
        weeklyGoals: state.weeklyGoals,
        prayerTimes: state.prayerTimes,
        prayerLogs: state.prayerLogs,
        weeklyReview: state.weeklyReview,
        notifications: state.notifications,
        incomes: state.incomes || [],
        expenses: state.expenses || [],
        debts: state.debts || [],
        explorerPlaces: state.explorerPlaces || [],

        todayActivities,
        todayCompletedCount,
        todayCompletionPercentage,
        nextUpcomingActivity,
        unreadNotificationsCount,

        addActivity,
        updateActivity,
        deleteActivity,
        duplicateActivity,
        toggleActivityComplete,
        applyBalancerFixes,

        addWorkTask,
        toggleWorkTask,
        deleteWorkTask,
        logWorkSession,

        logWorkout,
        updateWorkoutPlan,

        addPlant,
        updatePlant,
        deletePlant,
        waterPlant,
        toggleGardeningTask,
        addGardeningTask,

        togglePrayerCompleted,
        updatePrayerTime,
        setSriLankaCity,
        setMadhab,
        syncPrayerTimes,

        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addDebt,
        updateDebt,
        deleteDebt,
        addDebtPayment,
        deleteDebtPayment,

        addExplorerPlace,
        updateExplorerPlace,
        deleteExplorerPlace,
        addPlacePhoto,
        deletePlacePhoto,

        addGrowthGoal,
        logGrowthSession,

        toggleHabit,
        addHabit,
        deleteHabit,

        updateWeeklyGoal,
        addWeeklyGoal,
        updateWeeklyReview,
        copyPreviousWeekRoutine,

        updateSettings,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        resetToDefaults,
        importState,

        currentUser,
        isCloudSyncing,
        lastSyncedAt,
        loginWithGoogle,
        logout,
        syncWithCloud
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
