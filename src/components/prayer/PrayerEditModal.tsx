import React, { useState, useEffect } from 'react';
import { Moon, Clock, MapPin, Bell } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrayerTime } from '../../types';
import { useApp } from '../../context/AppContext';

interface PrayerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: PrayerTime | null;
}

export const PrayerEditModal: React.FC<PrayerEditModalProps> = ({ isOpen, onClose, prayer }) => {
  const { updatePrayerTime } = useApp();

  const [time, setTime] = useState('12:15');
  const [buffer, setBuffer] = useState<number>(15);
  const [reminder, setReminder] = useState(true);

  useEffect(() => {
    if (prayer) {
      setTime(prayer.time);
      setBuffer(prayer.mosqueBufferMinutes || 15);
      setReminder(prayer.reminder);
    }
  }, [prayer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayer) return;

    updatePrayerTime(prayer.name, {
      time,
      mosqueBufferMinutes: Number(buffer) || 15,
      reminder
    });

    onClose();
  };

  if (!prayer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${prayer.label} Prayer`}
      subtitle="Adjust prayer time, mosque travel buffer, and alert preferences"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Adhan / Prayer Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Mosque Travel & Preparation Buffer (Minutes)
          </label>
          <input
            type="number"
            value={buffer}
            onChange={(e) => setBuffer(Number(e.target.value))}
            min={0}
            max={60}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Reserves travel and wudu buffer in your schedule timeline.
          </p>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span>Enable Reminder Alert Before Adhan</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            Save Time
          </button>
        </div>
      </form>
    </Modal>
  );
};
