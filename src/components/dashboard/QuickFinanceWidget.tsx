import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowRight, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickFinanceWidget: React.FC = () => {
  const { incomes = [], expenses = [], debts = [], setActiveView } = useApp();

  const now = new Date();
  const currentMonthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const monthIncome = currentMonthIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const monthExpense = currentMonthExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const netBalance = monthIncome - monthExpense;

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe')
    .reduce((acc, curr) => acc + Math.max(0, curr.originalAmount - (curr.paidAmount || 0)), 0);

  return (
    <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#121824]/70 backdrop-blur-md shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Finance & Cash Flow
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              This Month • LKR / Rs.
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveView('finance')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Income</span>
          <span className="text-xs sm:text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
            Rs. {monthIncome >= 1000 ? `${(monthIncome / 1000).toFixed(0)}k` : monthIncome.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Expenses</span>
          <span className="text-xs sm:text-sm font-black font-mono text-rose-600 dark:text-rose-400">
            Rs. {monthExpense >= 1000 ? `${(monthExpense / 1000).toFixed(0)}k` : monthExpense.toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Net Balance</span>
          <span className={`text-xs sm:text-sm font-black font-mono ${netBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-500'}`}>
            Rs. {Math.abs(netBalance) >= 1000 ? `${(netBalance / 1000).toFixed(0)}k` : netBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {totalIOwe > 0 && (
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-600" /> Outstanding Debt to Pay:
          </span>
          <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
            Rs. {totalIOwe.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};
