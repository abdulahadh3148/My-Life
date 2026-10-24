import React, { useState } from 'react';
import { GraduationCap, Clock, Palette } from 'lucide-react';
import { Modal } from '../common/Modal';
import { GrowthGoal } from '../../types';
import { useApp } from '../../context/AppContext';

interface GrowthGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrowthGoalModal: React.FC<GrowthGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGrowthGoal } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GrowthGoal['category']>('coding');
  const [targetHours, setTargetHours] = useState<number>(5);
  const [color, setColor] = useState('#06B6D4');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGrowthGoal({
      title: title.trim(),
      category,
      weeklyTargetMinutes: Math.round(Number(targetHours) * 60) || 300,
      color,
      icon: 'BookOpen',
      description: description.trim()
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Personal Growth Goal"
      subtitle="Track coding, HNDIT coursework, English fluency, or reading targets"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Goal Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Flutter & React Native, IELTS Speaking..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Stream / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="coding">Coding Practice</option>
              <option value="hndit">HNDIT Study</option>
              <option value="english">English Fluency</option>
              <option value="reading">Reading</option>
              <option value="personal_projects">Personal Project</option>
              <option value="other">Other Goal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Weekly Target (Hours)
            </label>
            <input
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              min={1}
              max={40}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Objectives & Milestones
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specific syllabus topics or modules covered..."
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
            Save Goal
          </button>
        </div>
      </form>
    </Modal>
  );
};
