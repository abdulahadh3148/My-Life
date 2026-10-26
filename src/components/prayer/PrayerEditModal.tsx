import React, { useState, useEffect } from 'react';
import { Moon, Clock, MapPin, Bell, SlidersHorizontal, RotateCcw } from 'lucide-react';
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
  const [adjustmentMinutes, setAdjustmentMinutes] = useState<number>(0);

  useEffect(() => {
    if (prayer) {
      setTime(prayer.time);
      setBuffer(prayer.mosqueBufferMinutes || 15);
      setReminder(prayer.reminder);
      setAdjustmentMinutes(prayer.manualAdjustmentMinutes || 0);
    }
  }, [prayer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayer) return;

    updatePrayerTime(prayer.name, {
      time,
      mosqueBufferMinutes: Number(buffer) || 15,
      reminder,
      manualAdjustmentMinutes: Number(adjustmentMinutes) || 0
    });

    onClose();
  };

  const handleApplyOffset = (offset: number) => {
    setAdjustmentMinutes((prev) => prev + offset);
    // Adjust time string by offset minutes
    const [h, m] = time.split(':').map(Number);
    let totalMins = h * 60 + m + offset;
    if (totalMins < 0) totalMins += 1440;
    totalMins = totalMins % 1440;
    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;
    setTime(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
  };

  if (!prayer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${prayer.label}`}
      subtitle="Adjust prayer time, mosque travel buffer, and alert preferences"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Adhan / Timetable Time
            </span>
            {adjustmentMinutes !== 0 && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                {adjustmentMinutes > 0 ? `+${adjustmentMinutes}m` : `${adjustmentMinutes}m`} mosque offset
              </span>
            )}
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          {/* Quick Mosque Offset Buttons */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Adjust:</span>
            {[-5, -2, -1, +1, +2, +5].map((offset) => (
              <button
                key={offset}
                type="button"
                onClick={() => handleApplyOffset(offset)}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold transition-colors"
              >
                {offset > 0 ? `+${offset}m` : `${offset}m`}
              </button>
            ))}
          </div>
        </div>

        {prayer.name !== 'sunrise' && (
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
        )}

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

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Timetable
          </button>
        </div>
      </form>
    </Modal>
  );
};
