import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Clock,
  Calendar,
  Globe,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  MapPin,
  Compass,
  FileCheck,
  FileText,
  AlertCircle,
  Database,
  Info,
  Cloud,
  LogIn,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Modal } from '../common/Modal';
import {
  exportStateAsJSON,
  validateImportedData,
  createSafetyBackupSnapshot,
  computeRecordCounts,
  ValidationResult
} from '../../utils/storage';
import { SRI_LANKA_CITIES } from '../../utils/prayerEngine';
import {
  requestNotificationPermission,
  getNotificationPermissionStatus
} from '../../utils/notifications';

export const SettingsView: React.FC = () => {
  const {
    state,
    settings,
    updateSettings,
    resetToDefaults,
    importState,
    addNotification,
    setSriLankaCity,
    setMadhab,
    currentUser,
    isCloudSyncing,
    lastSyncedAt,
    loginWithGoogle,
    logout,
    syncWithCloud
  } = useApp();

  const [userName, setUserName] = useState(settings.userName);
  const [bio, setBio] = useState(settings.bio || '');
  const [dailyWorkTarget, setDailyWorkTarget] = useState(
    Math.round((settings.dailyWorkTargetMinutes || 180) / 60)
  );
  const [workStart, setWorkStart] = useState(settings.workWindowStart || '09:00');
  const [workEnd, setWorkEnd] = useState(settings.workWindowEnd || '11:30');
  const [wakeTime, setWakeTime] = useState(settings.wakeTime || '05:00');
  const [sleepTime, setSleepTime] = useState(settings.sleepTime || '22:30');
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Colombo');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  // Safe Backup & Recovery states
  const [pendingBackup, setPendingBackup] = useState<{
    validation: ValidationResult;
    fileName: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim(),
      bio: bio.trim(),
      dailyWorkTargetMinutes: Number(dailyWorkTarget) * 60,
      workWindowStart: workStart,
      workWindowEnd: workEnd,
      wakeTime,
      sleepTime,
      timezone
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    addNotification({
      title: 'Preferences Updated',
      message: 'Your personal settings and schedule targets were saved.',
      type: 'system'
    });
  };

  const handleExport = () => {
    try {
      exportStateAsJSON(state);
      addNotification({
        title: 'Backup Downloaded',
        message: 'A complete MyLife OS backup envelope (JSON) was saved to your device.',
        type: 'system'
      });
    } catch (err) {
      alert('Failed to export backup JSON.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validation = validateImportedData(parsed);

        if (validation.valid && validation.validatedState) {
          setPendingBackup({
            validation,
            fileName: file.name
          });
        } else {
          setValidationError(validation.error || 'The uploaded file is not a valid MyLife OS backup.');
        }
      } catch (err) {
        setValidationError('Invalid JSON syntax: Could not parse file as JSON.');
      }
    };
    reader.onerror = () => {
      setValidationError('Failed to read the selected file from disk.');
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmRestore = () => {
    if (!pendingBackup?.validation.validatedState) return;

    // 1. Download safety snapshot of current state before replacing
    createSafetyBackupSnapshot(state);

    // 2. Safely apply validated backup state
    importState(pendingBackup.validation.validatedState);

    const counts = pendingBackup.validation.recordCounts;
    const totalRecords = counts
      ? counts.activities + counts.incomes + counts.expenses + counts.debts + counts.explorerPlaces
      : 0;

    addNotification({
      title: 'Backup Restored Successfully',
      message: `State restored from "${pendingBackup.fileName}" (${totalRecords} items). An emergency safety snapshot of your previous data was saved to downloads.`,
      type: 'system'
    });

    setPendingBackup(null);
  };

  const handleRequestNotif = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      updateSettings({ notificationsEnabled: true });
    }
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in max-w-4xl">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-white dark:from-[#111728] dark:via-[#13192B] dark:to-[#0E131E] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Settings & Configuration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your profile, daily time targets, notifications, themes, and backup data.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Account & Realtime Sync Card */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/30 dark:via-[#121824] dark:to-[#0B0F17] p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Google Cloud Sync & Backup
                </h3>
                {currentUser ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Cloud Synced
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Local Device Only
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {currentUser
                  ? `Signed in as ${currentUser.displayName || currentUser.email}. All schedules, prayer logs, finances, and places are continuously backed up to your private Google Cloud account.`
                  : 'Connect your Google account to automatically synchronize all data, photos, and routines across your phone, tablet, and laptop for free.'}
              </p>
              {lastSyncedAt && currentUser && (
                <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  <span>Last synced with cloud: {lastSyncedAt}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={syncWithCloud}
                  disabled={isCloudSyncing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-all"
                  title="Sign out from Google Cloud"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={isCloudSyncing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isCloudSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <User className="w-4 h-4" /> Profile Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Focus Bio / Tagline
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Display & Time Preferences */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Schedule, Clock & Timezone
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="dark">Dark Theme (Obsidian)</option>
                <option value="light">Light Theme (Paper)</option>
                <option value="system">System Preference</option>
              </select>
            </div>

            {/* Clock Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Clock Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) => updateSettings({ timeFormat: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="12h">12-Hour (10:30 PM)</option>
                <option value="24h">24-Hour (22:30)</option>
              </select>
            </div>

            {/* Week Starts On */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Week Starts On
              </label>
              <select
                value={settings.weekStartsOn}
                onChange={(e) => updateSettings({ weekStartsOn: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Timezone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Asia/Colombo">Asia/Colombo (Sri Lanka / GMT+5:30)</option>
                <option value="Asia/Dubai">Asia/Dubai (UAE / GMT+4)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (Saudi Arabia / GMT+3)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (India / GMT+5:30)</option>
                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                <option value="Europe/London">Europe/London (UK / GMT+0)</option>
                <option value="America/New_York">America/New_York (US Eastern / GMT-5)</option>
              </select>
            </div>

            {/* Daily Work Target */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Work Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={dailyWorkTarget}
                onChange={(e) => setDailyWorkTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Sri Lanka Prayer Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Sri Lanka Prayer City
              </label>
              <select
                value={settings.sriLankaCity || 'Colombo'}
                onChange={(e) => {
                  const city = SRI_LANKA_CITIES.find(c => c.name === e.target.value);
                  if (city && setSriLankaCity) {
                    setSriLankaCity(city);
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SRI_LANKA_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.district} District)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-500" /> Asr Juristic Madhab
              </label>
              <select
                value={settings.madhab || 'shafii'}
                onChange={(e) => {
                  if (setMadhab) {
                    setMadhab(e.target.value as 'shafii' | 'hanafi');
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="shafii">Shafi‘i (Standard in Sri Lanka • 1x shadow)</option>
                <option value="hanafi">Hanafi (Later Asr • 2x shadow)</option>
              </select>
            </div>
          </div>

          {/* Preferred Work Window & Sleep / Wake times */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Work Window Start
              </label>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Work Window End
              </label>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Wake Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Bedtime
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Data Backup & Reset Actions */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-500" /> Local Data Portability & Safety
          </h3>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Envelope v1 • LocalStorage Verified
          </span>
        </div>

        {/* Current State Live Breakdown */}
        {(() => {
          const c = computeRecordCounts(state);
          return (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs">
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Current Local Records on This Device:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-slate-900 dark:text-white">{c.activities}</span> Schedule Items
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-slate-900 dark:text-white">{c.incomes + c.expenses}</span> Transactions
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-slate-900 dark:text-white">{c.debts}</span> Debts ({c.debtPayments} Payments)
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-slate-900 dark:text-white">{c.explorerPlaces}</span> Places ({c.explorerPhotos} Photos)
                </div>
              </div>
            </div>
          );
        })()}

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Backup Import Rejected</p>
              <p className="mt-0.5 text-rose-700 dark:text-rose-300">{validationError}</p>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Envelope JSON</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-sm cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Restore From Backup</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </label>

          {/* Reset All */}
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Restore Confirmation & Review Modal */}
      {pendingBackup && (
        <Modal
          isOpen={Boolean(pendingBackup)}
          onClose={() => setPendingBackup(null)}
          title="Review & Confirm Backup Restore"
          subtitle={`Selected file: ${pendingBackup.fileName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 p-1 text-slate-800 dark:text-slate-200">
            {/* Format Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {pendingBackup.validation.isLegacy ? 'Legacy Backup Format' : 'Versioned Envelope v1'}
                </span>
              </div>
              {pendingBackup.validation.exportedAt && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {new Date(pendingBackup.validation.exportedAt).toLocaleDateString()} {new Date(pendingBackup.validation.exportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Warnings if any */}
            {pendingBackup.validation.warnings && pendingBackup.validation.warnings.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Notices:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {pendingBackup.validation.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Counts Breakdown Grid */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Verified Records to be Restored:
              </p>
              {(() => {
                const c = pendingBackup.validation.recordCounts;
                if (!c) return null;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Schedule</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{c.activities} Items</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Finance</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {c.incomes + c.expenses} Records
                      </p>
                      <p className="text-[10px] text-slate-500">({c.incomes} inc, {c.expenses} exp)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Debts</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{c.debts} Ledgers</p>
                      <p className="text-[10px] text-slate-500">({c.debtPayments} payments)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Explorer</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{c.explorerPlaces} Places</p>
                      <p className="text-[10px] text-slate-500">({c.explorerPhotos} photos)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Gardening</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{c.plants} Plants</p>
                      <p className="text-[10px] text-slate-500">({c.gardeningTasks} tasks)</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Fitness & Growth</p>
                      <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{c.workoutPlans + c.growthGoals} Routines</p>
                      <p className="text-[10px] text-slate-500">({c.dailyHabits} habits)</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Safety Guarantee Callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-bold">Zero-Risk Safety Guarantee</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Before replacing your current state, an emergency safety snapshot of your active records will be automatically downloaded to your device. You can revert anytime.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPendingBackup(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Snapshot & Confirm Restore</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToDefaults}
        title="Reset Application Data"
        message="This will restore all schedule routines, prayers, plants, workouts, and work targets to default clean sample data. Any custom activities you added will be overwritten."
        confirmLabel="Reset State"
        isDestructive={true}
      />
    </div>
  );
};
