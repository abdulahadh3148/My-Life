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
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportStateAsJSON, validateImportedData } from '../../utils/storage';
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
    addNotification
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
    exportStateAsJSON(state);
    addNotification({
      title: 'Data Exported',
      message: 'Full backup JSON file downloaded to your device.',
      type: 'system'
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validation = validateImportedData(parsed);

        if (validation.valid) {
          importState(parsed);
          addNotification({
            title: 'Backup Restored',
            message: 'Your MyLife OS state was successfully restored from backup.',
            type: 'system'
          });
        } else {
          alert(`Import failed: ${validation.error}`);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Data Portability & Safety
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export Backup JSON</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-500 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Import Backup JSON</span>
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
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

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
