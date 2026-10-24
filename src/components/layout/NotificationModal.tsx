import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  NotificationStatus
} from '../../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    settings,
    updateSettings
  } = useApp();

  const [permStatus, setPermStatus] = useState<NotificationStatus>({
    supported: true,
    permission: 'default'
  });

  useEffect(() => {
    if (isOpen) {
      setPermStatus(getNotificationPermissionStatus());
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermStatus(getNotificationPermissionStatus());
    if (result === 'granted') {
      updateSettings({ notificationsEnabled: true });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Center & Reminders"
      subtitle="In-app alerts and operating system notification controls"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* System Permission Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Browser Permission:{' '}
                <span className="font-mono uppercase text-emerald-600 dark:text-emerald-400">
                  {permStatus.permission}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {permStatus.permission === 'granted'
                  ? 'System alerts are authorized. Operating systems and browser battery optimization may still throttle exact background firing.'
                  : permStatus.permission === 'denied'
                  ? 'Notifications are blocked in browser preferences. In-app fallbacks remain fully active here.'
                  : 'Enable notifications to receive alerts for work focus breaks, upcoming prayers, and schedule timings.'}
              </p>
              {permStatus.permission === 'default' && permStatus.supported && (
                <button
                  onClick={handleRequestPermission}
                  className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Enable Browser Notifications
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {notifications.length} Logged Reminders
          </span>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
              No recent notifications. You are all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white/40 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                    : 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                    {n.title}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
