import React from 'react';
import { Droplets, Sun, MapPin, Edit2, Trash2, Check, Clock } from 'lucide-react';
import { Plant } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, addDays, formatDisplayDate } from '../../utils/time';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string, name: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete }) => {
  const { waterPlant } = useApp();
  const today = getTodayDateString();

  const nextWaterDate = addDays(plant.lastWateredDate, plant.wateringFrequencyDays);
  const isDueToday = nextWaterDate <= today;
  const isWateredToday = plant.lastWateredDate === today;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isDueToday && !isWateredToday
          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
          : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {plant.name}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {plant.type}
            </span>
          </div>

          {plant.scientificName && (
            <p className="text-[11px] italic text-slate-400 truncate">
              {plant.scientificName}
            </p>
          )}

          {/* Location & Sunlight */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{plant.location}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>{plant.sunlight}</span>
            </span>
          </div>

          {/* Notes */}
          {plant.notes && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 leading-relaxed">
              {plant.notes}
            </p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(plant)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit plant"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(plant.id, plant.name)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete plant"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Watering Schedule Footer & Button */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Frequency: Every {plant.wateringFrequencyDays}d</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Last: {formatDisplayDate(plant.lastWateredDate)}
          </div>
        </div>

        {isWateredToday ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Check className="w-3.5 h-3.5" />
            <span>Watered Today</span>
          </span>
        ) : (
          <button
            onClick={() => waterPlant(plant.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95 ${
              isDueToday
                ? 'bg-blue-600 hover:bg-blue-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 fill-current" />
            <span>{isDueToday ? 'Water Due Now' : 'Water Plant'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
