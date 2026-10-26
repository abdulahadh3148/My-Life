import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  DollarSign,
  UserCheck,
  UserX,
  CreditCard,
  Edit2,
  Trash2,
  Clock,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionModal } from './TransactionModal';
import { DebtModal } from './DebtModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { IncomeRecord, ExpenseRecord, DebtRecord, ExpenseCategory, DebtPayment } from '../../types/finance';
import { formatDisplayDate, getTodayDateString } from '../../utils/time';

export const FinanceView: React.FC = () => {
  const {
    incomes = [],
    expenses = [],
    debts = [],
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addDebt,
    updateDebt,
    deleteDebt,
    addDebtPayment,
    deleteDebtPayment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses' | 'debts'>('overview');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week' | 'today'>('month');

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState<IncomeRecord | ExpenseRecord | null>(null);

  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtRecord | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'income' | 'expense' | 'debt'; id: string; name: string } | null>(null);

  const today = getTodayDateString();

  // Filter transactions by time window
  const isInTimeWindow = (dateStr: string) => {
    if (timeFilter === 'all') return true;
    if (timeFilter === 'today') return dateStr === today;

    const d = new Date(dateStr);
    const now = new Date();

    if (timeFilter === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }

    if (timeFilter === 'week') {
      const diffTime = Math.abs(now.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    return true;
  };

  const filteredIncomes = useMemo(() => incomes.filter((i) => isInTimeWindow(i.date)), [incomes, timeFilter]);
  const filteredExpenses = useMemo(() => expenses.filter((e) => isInTimeWindow(e.date)), [expenses, timeFilter]);

  // Aggregate stats from real saved data
  const totalIncome = filteredIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const remainingBalance = totalIncome - totalExpense;

  // Debts totals
  const totalIOweRemaining = debts
    .filter((d) => d.type === 'i_owe')
    .reduce((acc, curr) => acc + Math.max(0, curr.originalAmount - (curr.paidAmount || 0)), 0);

  const totalOwedToMeRemaining = debts
    .filter((d) => d.type === 'owed_to_me')
    .reduce((acc, curr) => acc + Math.max(0, curr.originalAmount - (curr.paidAmount || 0)), 0);

  // Category breakdown for expenses
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  const handleOpenAddIncome = () => {
    setTransactionType('income');
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenAddExpense = () => {
    setTransactionType('expense');
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (record: IncomeRecord | ExpenseRecord, type: 'income' | 'expense') => {
    setTransactionType(type);
    setEditingTransaction(record);
    setIsTransactionModalOpen(true);
  };

  const handleOpenAddDebt = () => {
    setEditingDebt(null);
    setIsDebtModalOpen(true);
  };

  const handleOpenEditDebt = (debt: DebtRecord) => {
    setEditingDebt(debt);
    setIsDebtModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'income') deleteIncome(deleteTarget.id);
    if (deleteTarget.type === 'expense') deleteExpense(deleteTarget.id);
    if (deleteTarget.type === 'debt') deleteDebt(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5 pb-safe-nav animate-in fade-in">
      {/* Finance Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-[#0E1620] dark:via-[#111927] dark:to-[#0B1019] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Personal Finance Manager
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Track income streams, categorize daily expenses, and manage debts in Sri Lankan Rupees (LKR / Rs.). Stored securely and private.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
            <button
              onClick={handleOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
            <button
              onClick={handleOpenAddDebt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Scale className="w-4 h-4" />
              <span>Record Debt</span>
            </button>
          </div>
        </div>

        {/* Time Window Filter Pills */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                  timeFilter === filter
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {filter === 'month' ? 'This Month' : filter === 'week' ? 'This Week' : filter === 'today' ? 'Today' : 'All Time'}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono font-medium text-slate-400">
            Currency: Sri Lankan Rupees (Rs. / LKR)
          </span>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Income Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Income
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            Rs. {totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {filteredIncomes.length} recorded inflows
          </div>
        </div>

        {/* Expenses Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            Rs. {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {filteredExpenses.length} recorded outflows
          </div>
        </div>

        {/* Net Balance Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Net Balance
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${remainingBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-500'}`}>
            Rs. {remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {remainingBalance >= 0 ? 'Surplus funds' : 'Deficit in period'}
          </div>
        </div>

        {/* Debt Standing Card */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Outstanding Debts
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 mt-1 font-mono text-xs font-bold">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="font-sans font-medium text-[11px]">Owed to Me:</span>
              <span>Rs. {totalOwedToMeRemaining.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
              <span className="font-sans font-medium text-[11px]">I Owe:</span>
              <span>Rs. {totalIOweRemaining.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Overview & Recent
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'income'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Income ({filteredIncomes.length})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'expenses'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Expenses ({filteredExpenses.length})
        </button>

        <button
          onClick={() => setActiveTab('debts')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'debts'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Debt Manager ({debts.length})
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Incomes and Expenses List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Combined Transactions ({filteredIncomes.length + filteredExpenses.length})</span>
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {[...filteredIncomes.map((i) => ({ ...i, txType: 'income' as const })),
                ...filteredExpenses.map((e) => ({ ...e, txType: 'expense' as const }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] flex items-center justify-between text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          item.txType === 'income'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.txType === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.txType === 'income' ? (item as IncomeRecord).source : (item as ExpenseRecord).category.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {formatDisplayDate(item.date)} {item.notes ? `• ${item.notes}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-sm font-black ${
                          item.txType === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.txType === 'income' ? '+' : '-'} Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>

                      <button
                        onClick={() => handleOpenEditTransaction(item, item.txType)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: item.txType,
                            id: item.id,
                            name: item.txType === 'income' ? (item as IncomeRecord).source : (item as ExpenseRecord).category
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

              {filteredIncomes.length === 0 && filteredExpenses.length === 0 && (
                <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  No income or expense records found for this period. Click Add Income or Add Expense to log your first record.
                </div>
              )}
            </div>
          </div>

          {/* Expense Categories Breakdown Bar Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-500" />
              <span>Category Breakdown</span>
            </h3>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-sm space-y-3">
              {categoryTotals.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No expense records to analyze.
                </div>
              ) : (
                categoryTotals.map(([cat, amount]) => {
                  const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="capitalize text-slate-700 dark:text-slate-300">{cat}</span>
                        <span className="font-mono text-slate-900 dark:text-white">
                          Rs. {amount.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Incomes List */}
      {activeTab === 'income' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Income Streams ({filteredIncomes.length})
            </h3>
            <button
              onClick={handleOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Income</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredIncomes.map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{inc.source}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Income
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDisplayDate(inc.date)} {inc.notes ? `• ${inc.notes}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                    + Rs. {inc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => handleOpenEditTransaction(inc, 'income')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'income', id: inc.id, name: inc.source })}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Expenses List */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Categorized Expenses ({filteredExpenses.length})
            </h3>
            <button
              onClick={handleOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Expense</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="capitalize">{exp.category}</span>
                    {exp.paymentMethod && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                        {exp.paymentMethod.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDisplayDate(exp.date)} {exp.notes ? `• ${exp.notes}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-rose-600 dark:text-rose-400">
                    - Rs. {exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => handleOpenEditTransaction(exp, 'expense')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'expense', id: exp.id, name: exp.category })}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Debt Manager */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personal Debt Ledger & Settlements
              </h3>
              <p className="text-xs text-slate-400">
                Track money you owe to others and receivables owed to you. Outstanding balances calculated automatically.
              </p>
            </div>
            <button
              onClick={handleOpenAddDebt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Debt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {debts.map((debt) => {
              const paid = debt.paidAmount || 0;
              const remaining = Math.max(0, debt.originalAmount - paid);
              const isSettled = remaining === 0;

              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSettled
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : debt.type === 'owed_to_me'
                      ? 'bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {debt.personName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            debt.type === 'owed_to_me'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {debt.type === 'owed_to_me' ? 'Owed to Me' : 'I Owe'}
                        </span>
                      </div>
                      {debt.contactInfo && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{debt.contactInfo}</div>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSettled
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : paid > 0
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isSettled ? 'Settled' : paid > 0 ? 'Partially Paid' : 'Pending'}
                    </span>
                  </div>

                  {/* Amounts breakdown */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 my-2 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Original Amount:</span>
                      <span>Rs. {debt.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Amount Repaid:</span>
                      <span>Rs. {paid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-sm">
                      <span>Outstanding Balance:</span>
                      <span className={debt.type === 'owed_to_me' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        Rs. {remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3">
                    <span>Originated: {formatDisplayDate(debt.date)}</span>
                    {debt.dueDate && <span>Due by: {formatDisplayDate(debt.dueDate)}</span>}
                  </div>

                  {debt.notes && (
                    <div className="text-xs text-slate-500 italic mb-3">"{debt.notes}"</div>
                  )}

                  {/* Debt Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {debt.payments?.length || 0} payments logged
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditDebt(debt)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                      >
                        Manage & Log Payment
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'debt', id: debt.id, name: debt.personName })}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {debts.length === 0 && (
              <div className="col-span-2 text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No debts currently on file. Click Record Debt to track loans, borrow amounts, or receivables.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Add / Edit Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        type={transactionType}
        editingRecord={editingTransaction}
        onSaveIncome={(data, id) => {
          if (id) updateIncome(id, data);
          else addIncome(data);
        }}
        onSaveExpense={(data, id) => {
          if (id) updateExpense(id, data);
          else addExpense(data);
        }}
      />

      {/* Debt Add / Edit Modal */}
      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        editingDebt={editingDebt}
        onSaveDebt={(data, id) => {
          if (id) updateDebt(id, data);
          else addDebt(data);
        }}
        onAddPayment={addDebtPayment}
        onDeletePayment={deleteDebtPayment}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type}?`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Record"
        isDestructive
      />
    </div>
  );
};
