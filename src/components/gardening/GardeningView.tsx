import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Droplets,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Scissors
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlantCard } from './PlantCard';
import { PlantModal } from './PlantModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { Plant, GardeningTask } from '../../types';
import { getTodayDateString, addDays } from '../../utils/time';

export const GardeningView: React.FC = () => {
  const {
    plants,
    gardeningTasks,
    toggleGardeningTask,
    addGardeningTask,
    deletePlant,
    waterPlant,
    selectedDate
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; name: string } | null>(null);

  // New gardening task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState<number>(15);

  const today = getTodayDateString();

  const duePlants = plants.filter((p) => {
    if (!p.lastWateredDate) return true;
    const nextWaterDate = addDays(p.lastWateredDate, p.wateringFrequencyDays);
    return nextWaterDate <= today;
  });

  const handleOpenAdd = () => {
    setEditingPlant(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingTarget) {
      deletePlant(deletingTarget.id);
      setDeletingTarget(null);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addGardeningTask({
      title: newTaskTitle.trim(),
      type: 'general',
      durationMinutes: Number(newTaskDuration) || 15,
      date: selectedDate,
      completed: false
    });

    setNewTaskTitle('');
  };

  const dayTasks = gardeningTasks.filter((t) => t.date === selectedDate);

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Gardening Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-green-50/20 to-white dark:from-[#0F1A14] dark:via-[#111C16] dark:to-[#0B1310] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <Sprout className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Gardening & Plant Care
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Maintain healthy herbs, vegetables, and ornamental flora. Smart cycle watering ensures no root rot or underwatering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {duePlants.length > 0 && (
              <button
                onClick={() => duePlants.forEach((p) => waterPlant(p.id))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Water All Due ({duePlants.length})</span>
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plant</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
              {plants.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Total Plants
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400">
              {duePlants.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Watering Due
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-center">
            <div className="text-lg sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {plants.length - duePlants.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Hydrated
            </div>
          </div>
        </div>
      </div>

      {/* Plant Inventory Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Plant Directory ({plants.length})
          </h3>
        </div>

        {plants.length === 0 ? (
          <EmptyState
            icon={Sprout}
            title="No Plants in Garden"
            description="Add your herbs, potted vegetables, or houseplants to configure personalized watering cycles."
            actionLabel="Add First Plant"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={handleOpenEdit}
                onDelete={(id, name) => setDeletingTarget({ id, name })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Gardening Tasks & Care Schedule */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Care & Maintenance Tasks
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Pruning, composting, pest checks, and harvesting
              </p>
            </div>
          </div>
        </div>

        {/* Add Gardening Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Prune dead leaves on tomato bed, check aphids..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
            placeholder="Min"
            className="w-16 px-2 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
            title="Estimated minutes"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Add Task
          </button>
        </form>

        {/* Task Items */}
        <div className="space-y-2">
          {dayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleGardeningTask(task.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                  : 'bg-white dark:bg-[#151C2A] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="text-slate-300 dark:text-slate-600 hover:text-green-500"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <span
                    className={`text-xs font-medium text-slate-800 dark:text-slate-200 ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.plantName && (
                    <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                      {task.plantName}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {task.durationMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Plant Modal */}
      <PlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlant={editingPlant}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTarget}
        onClose={() => setDeletingTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Plant"
        message={`Are you sure you want to remove "${deletingTarget?.name}" from your garden directory?`}
        confirmLabel="Remove"
        isDestructive={true}
      />
    </div>
  );
};
