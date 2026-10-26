export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'education'
  | 'personal'
  | 'health'
  | 'entertainment'
  | 'other';

export interface IncomeRecord {
  id: string;
  amount: number; // in LKR
  date: string; // YYYY-MM-DD
  source: string; // e.g. Salary, Freelance, Side Project
  notes?: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  amount: number; // in LKR
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  notes?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'other';
  createdAt: string;
}

export type DebtType = 'i_owe' | 'owed_to_me';
export type DebtStatus = 'pending' | 'partially_paid' | 'settled';

export interface DebtPayment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface DebtRecord {
  id: string;
  type: DebtType;
  personName: string;
  contactInfo?: string;
  originalAmount: number;
  paidAmount: number; // calculated from payments
  date: string; // date debt originated
  dueDate?: string;
  notes?: string;
  status: DebtStatus;
  payments: DebtPayment[];
  createdAt: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  totalIOwe: number;
  totalOwedToMe: number;
}
