import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DebtRecord, DebtType, DebtPayment } from '../../types/finance';
import { getTodayDateString, formatDisplayDate } from '../../utils/time';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDebt?: DebtRecord | null;
  onSaveDebt: (
    debt: Omit<DebtRecord, 'id' | 'createdAt' | 'paidAmount' | 'status' | 'payments'>,
    id?: string
  ) => void;
  onAddPayment?: (debtId: string, payment: Omit<DebtPayment, 'id'>) => void;
  onDeletePayment?: (debtId: string, paymentId: string) => void;
}

export const DebtModal: React.FC<DebtModalProps> = ({
  isOpen,
  onClose,
  editingDebt,
  onSaveDebt,
  onAddPayment,
  onDeletePayment
}) => {
  const isEditing = Boolean(editingDebt);

  const [type, setType] = useState<DebtType>('owed_to_me');
  const [personName, setPersonName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // Partial Payment State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(getTodayDateString());
  const [paymentNote, setPaymentNote] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);

  useEffect(() => {
    if (editingDebt) {
      setType(editingDebt.type);
      setPersonName(editingDebt.personName);
      setContactInfo(editingDebt.contactInfo || '');
      setOriginalAmount(String(editingDebt.originalAmount));
      setDate(editingDebt.date);
      setDueDate(editingDebt.dueDate || '');
      setNotes(editingDebt.notes || '');
      setShowAddPayment(false);
    } else {
      setType('owed_to_me');
      setPersonName('');
      setContactInfo('');
      setOriginalAmount('');
      setDate(getTodayDateString());
      setDueDate('');
      setNotes('');
      setShowAddPayment(false);
    }
  }, [editingDebt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(originalAmount);
    if (!personName.trim() || isNaN(amount) || amount <= 0) return;

    onSaveDebt(
      {
        type,
        personName: personName.trim(),
        contactInfo: contactInfo.trim() || undefined,
        originalAmount: amount,
        date,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined
      },
      editingDebt?.id
    );

    onClose();
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebt || !onAddPayment) return;
    const pAmt = parseFloat(paymentAmount);
    if (isNaN(pAmt) || pAmt <= 0) return;

    onAddPayment(editingDebt.id, {
      amount: pAmt,
      date: paymentDate,
      note: paymentNote.trim() || undefined
    });

    setPaymentAmount('');
    setPaymentNote('');
    setShowAddPayment(false);
  };

  const totalPaid = editingDebt ? editingDebt.paidAmount : 0;
  const original = editingDebt ? editingDebt.originalAmount : parseFloat(originalAmount) || 0;
  const remaining = Math.max(0, original - totalPaid);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Manage Debt Record` : 'Record New Debt'}
      subtitle="Track money you owe to others or money owed to you in Sri Lankan Rupees"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Type Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setType('owed_to_me')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              type === 'owed_to_me'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Money Owed to Me (Receivable)
          </button>
          <button
            type="button"
            onClick={() => setType('i_owe')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              type === 'i_owe'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Money I Owe (Payable)
          </button>
        </div>

        {/* Existing Debt Summary Card (if editing) */}
        {editingDebt && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Outstanding Balance
              </span>
              <span className={`text-xl font-black font-mono ${remaining === 0 ? 'text-emerald-500' : type === 'owed_to_me' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                Rs. {remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Original: Rs. {original.toLocaleString()} • Paid: Rs. {totalPaid.toLocaleString()}
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              remaining === 0
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : totalPaid > 0
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30'
            }`}>
              {remaining === 0 ? 'Settled' : totalPaid > 0 ? 'Partially Paid' : 'Pending'}
            </span>
          </div>
        )}

        {/* Main Details Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Person's Name *
            </label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. John Doe, Nuwan, Client Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Original Amount (LKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">Rs.</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={originalAmount}
                  onChange={(e) => setOriginalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact (Optional)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="+94 7X XXX XXXX"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Origination Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Notes & Terms (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loan for repair, freelance milestone final..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md"
            >
              {isEditing ? 'Update Details' : 'Save Debt Record'}
            </button>
          </div>
        </form>

        {/* Payment History & Partial Payments Section (Only for existing debts) */}
        {editingDebt && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Payment History ({editingDebt.payments?.length || 0})</span>
              </h4>

              {remaining > 0 && !showAddPayment && (
                <button
                  type="button"
                  onClick={() => setShowAddPayment(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Payment</span>
                </button>
              )}
            </div>

            {/* Log Payment Sub-Form */}
            {showAddPayment && (
              <form onSubmit={handleCreatePayment} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Log Received or Paid Amount
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max={remaining}
                    required
                    placeholder={`Amount (Max: Rs. ${remaining})`}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Payment note / Bank reference..."
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            )}

            {/* Payments List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(!editingDebt.payments || editingDebt.payments.length === 0) ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  No payments logged yet. Outstanding balance is full amount.
                </div>
              ) : (
                editingDebt.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        + Rs. {p.amount.toLocaleString()}
                      </span>
                      <span className="text-slate-400 ml-2">on {formatDisplayDate(p.date)}</span>
                      {p.note && <div className="text-[11px] text-slate-500 mt-0.5">{p.note}</div>}
                    </div>

                    {onDeletePayment && (
                      <button
                        type="button"
                        onClick={() => onDeletePayment(editingDebt.id, p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete payment entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
