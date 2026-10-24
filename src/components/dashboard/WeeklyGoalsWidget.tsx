import React from 'react';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeeklyGoalsWidget: React.FC = () => {
  const { weeklyGoals, updateWeeklyGoal, setActiveView } = useApp();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Key Outcomes
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Progress toward weekly milestones
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('weekly')}
          className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center gap-1 group"
        >
          <span>Planner</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {weeklyGoals.slice(0, 3).map((goal) => {
          const percent = Math.min(
            100,
            Math.round((goal.currentValue / goal.targetValue) * 100)
          );

          return (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold text-slate-800 dark:text-slate-200 truncate ${
                    goal.completed ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {goal.title}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    goal.completed ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
