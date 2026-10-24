import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/time';

export const WorkTaskChecklist: React.FC = () => {
  const { workTasks, addWorkTask, toggleWorkTask, deleteWorkTask, selectedDate } = useApp();
  const [taskTitle, setTaskTitle] = useState('');
  const [estMinutes, setEstMinutes] = useState<number>(30);

  const dayTasks = workTasks.filter((t) => t.date === selectedDate);
  const completedCount = dayTasks.filter((t) => t.completed).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addWorkTask(taskTitle.trim(), Number(estMinutes) || undefined);
    setTaskTitle('');
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Work Sprint Tasks
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {completedCount} of {dayTasks.length} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New work deliverable or task..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={estMinutes}
          onChange={(e) => setEstMinutes(Number(e.target.value))}
          placeholder="Min"
          className="w-16 px-2 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
          title="Estimated minutes"
        />
        <button
          type="submit"
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          Add
        </button>
      </form>

      {/* Task items list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {dayTasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No work deliverables added for this date.
          </div>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                  : 'bg-white dark:bg-[#151C2A] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleWorkTask(task.id)}
                  className="text-slate-300 dark:text-slate-600 hover:text-indigo-500 shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-xs font-medium text-slate-800 dark:text-slate-200 truncate ${
                    task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.estimatedMinutes && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {task.estimatedMinutes}m
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteWorkTask(task.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
