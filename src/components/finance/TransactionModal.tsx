import React, { useState, useEffect } from 'react';
import { Plus, Edit2, DollarSign, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';
import { Modal } from '../common/Modal';
import { IncomeRecord, ExpenseRecord, ExpenseCategory } from '../../types/finance';
import { getTodayDateString } from '../../utils/time';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  editingRecord?: IncomeRecord | ExpenseRecord | null;
  onSaveIncome: (data: Omit<IncomeRecord, 'id' | 'createdAt'>, id?: string) => void;
  onSaveExpense: (data: Omit<ExpenseRecord, 'id' | 'createdAt'>, id?: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  type,
  editingRecord,
  onSaveIncome,
  onSaveExpense
}) => {
  const isEditing = Boolean(editingRecord);

  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [source, setSource] = useState<string>('Salary');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'other'>('cash');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editingRecord) {
      setAmount(String(editingRecord.amount));
      setDate(editingRecord.date);
      setNotes(editingRecord.notes || '');

      if (type === 'income') {
        setSource((editingRecord as IncomeRecord).source || 'Salary');
      } else {
        const exp = editingRecord as ExpenseRecord;
        setCategory(exp.category || 'food');
        setPaymentMethod(exp.paymentMethod || 'cash');
      }
    } else {
      setAmount('');
      setDate(getTodayDateString());
      setSource('Salary');
      setCategory('food');
      setPaymentMethod('cash');
      setNotes('');
    }
  }, [editingRecord, type, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (type === 'income') {
      onSaveIncome(
        {
          amount: numAmount,
          date,
          source: source.trim() || 'General Income',
          notes: notes.trim() || undefined
        },
        editingRecord?.id
      );
    } else {
      onSaveExpense(
        {
          amount: numAmount,
          date,
          category,
          paymentMethod,
          notes: notes.trim() || undefined
        },
        editingRecord?.id
      );
    }

    onClose();
  };

  const categories: { id: ExpenseCategory; label: string }[] = [
    { id: 'food', label: 'Food & Groceries' },
    { id: 'transport', label: 'Transport & Fuel' },
    { id: 'bills', label: 'Bills & Utilities' },
    { id: 'shopping', label: 'Shopping & Goods' },
    { id: 'education', label: 'Education & Courses' },
    { id: 'personal', label: 'Personal & Grooming' },
    { id: 'health', label: 'Health & Medical' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'other', label: 'Other Expense' }
  ];

  const incomeSources = ['Salary', 'Freelance', 'Contract', 'Business', 'Investment', 'Gift', 'Side Project', 'Other'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : `Add New ${type === 'income' ? 'Income' : 'Expense'}`}
      subtitle="Amounts recorded in Sri Lankan Rupees (Rs. / LKR)"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Amount (LKR / Rs.) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">Rs.</span>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Transaction Date *
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Income Source vs Expense Category */}
        {type === 'income' ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Income Source *
            </label>
            <input
              type="text"
              required
              list="income-sources-list"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Salary, Client Contract, Dividend"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <datalist id="income-sources-list">
              {incomeSources.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Expense Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Method (for expenses) */}
        {type === 'expense' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="cash">Cash (LKR)</option>
              <option value="card">Debit / Credit Card</option>
              <option value="bank_transfer">Online Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add relevant context or receipt reference..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
              type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            {isEditing ? 'Save Changes' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
