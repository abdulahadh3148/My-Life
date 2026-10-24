import React, { useState, useEffect } from 'react';
import { Sprout, Sun, Droplets, MapPin } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Plant } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlant?: Plant | null;
}

export const PlantModal: React.FC<PlantModalProps> = ({ isOpen, onClose, initialPlant }) => {
  const { addPlant, updatePlant } = useApp();

  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [type, setType] = useState<Plant['type']>('vegetable');
  const [location, setLocation] = useState('');
  const [wateringFrequencyDays, setWateringFrequencyDays] = useState<number>(2);
  const [sunlight, setSunlight] = useState<Plant['sunlight']>('Full Sun');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialPlant) {
      setName(initialPlant.name);
      setScientificName(initialPlant.scientificName || '');
      setType(initialPlant.type);
      setLocation(initialPlant.location);
      setWateringFrequencyDays(initialPlant.wateringFrequencyDays);
      setSunlight(initialPlant.sunlight);
      setNotes(initialPlant.notes || '');
    } else {
      setName('');
      setScientificName('');
      setType('vegetable');
      setLocation('');
      setWateringFrequencyDays(2);
      setSunlight('Full Sun');
      setNotes('');
    }
  }, [initialPlant, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialPlant) {
      updatePlant(initialPlant.id, {
        name: name.trim(),
        scientificName: scientificName.trim() || undefined,
        type,
        location: location.trim() || 'Garden',
        wateringFrequencyDays: Number(wateringFrequencyDays) || 2,
        sunlight,
        notes: notes.trim() || undefined
      });
    } else {
      addPlant({
        name: name.trim(),
        scientificName: scientificName.trim() || undefined,
        type,
        location: location.trim() || 'Garden',
        wateringFrequencyDays: Number(wateringFrequencyDays) || 2,
        lastWateredDate: getTodayDateString(),
        sunlight,
        notes: notes.trim() || undefined
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPlant ? 'Edit Plant' : 'Add New Plant'}
      subtitle="Configure watering frequency, sunlight, and location"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Plant Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Curry Leaves, Roma Tomatoes, Mint"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="vegetable">Vegetable</option>
              <option value="herb">Herb</option>
              <option value="flowering">Flowering</option>
              <option value="indoor">Indoor Houseplant</option>
              <option value="fruit">Fruit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" /> Watering Cycle
            </label>
            <select
              value={wateringFrequencyDays}
              onChange={(e) => setWateringFrequencyDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>Every Day (Daily)</option>
              <option value={2}>Every 2 Days</option>
              <option value={3}>Twice a Week (Every 3d)</option>
              <option value={5}>Every 5 Days</option>
              <option value={7}>Weekly (Every 7d)</option>
              <option value={14}>Bi-Weekly (Every 14d)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Balcony Stand, Pot #2"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Sunlight Needs
            </label>
            <select
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Full Sun">Full Sun (6+ hrs)</option>
              <option value="Partial Shade">Partial Shade</option>
              <option value="Indirect Light">Bright Indirect Light</option>
              <option value="Deep Shade">Deep Shade</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Care Notes & Fertilizing Schedule
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Soil mix, pruning advice, pest management..."
            rows={2}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
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
            {initialPlant ? 'Save Plant' : 'Add to Garden'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
