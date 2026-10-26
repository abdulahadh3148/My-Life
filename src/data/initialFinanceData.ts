import { IncomeRecord, ExpenseRecord, DebtRecord } from '../types/finance';
import { getTodayDateString } from '../utils/time';

const today = getTodayDateString();

export const INITIAL_INCOMES: IncomeRecord[] = [
  {
    id: 'inc-1',
    amount: 280000,
    date: today,
    source: 'Monthly Tech Salary',
    notes: 'Direct bank transfer for software development.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inc-2',
    amount: 65000,
    date: today,
    source: 'Freelance Frontend Contract',
    notes: 'React web application milestone payment.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    amount: 16800,
    date: today,
    category: 'food',
    paymentMethod: 'card',
    notes: 'Weekly groceries from Keells Super.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-2',
    amount: 5400,
    date: today,
    category: 'bills',
    paymentMethod: 'bank_transfer',
    notes: 'Dialog Home Broadband Fibre connection.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-3',
    amount: 8200,
    date: today,
    category: 'transport',
    paymentMethod: 'cash',
    notes: 'Petrol fuel fill-up.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-4',
    amount: 7500,
    date: today,
    category: 'education',
    paymentMethod: 'card',
    notes: 'Advanced TypeScript & Cloud Systems textbook.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DEBTS: DebtRecord[] = [
  {
    id: 'debt-1',
    type: 'owed_to_me',
    personName: 'Kamal Perera',
    contactInfo: '+94 77 123 4567',
    originalAmount: 45000,
    paidAmount: 15000,
    date: today,
    dueDate: '2026-11-15',
    notes: 'Milestone balance for UI component library design.',
    status: 'partially_paid',
    payments: [
      {
        id: 'pay-1',
        amount: 15000,
        date: today,
        note: 'First partial payment via Commercial Bank.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'debt-2',
    type: 'i_owe',
    personName: 'Mohamed Rizwan',
    contactInfo: '+94 71 987 6543',
    originalAmount: 20000,
    paidAmount: 20000,
    date: today,
    dueDate: today,
    notes: 'Hardware monitor stand purchase repayment.',
    status: 'settled',
    payments: [
      {
        id: 'pay-2',
        amount: 20000,
        date: today,
        note: 'Full settlement transferred.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];
