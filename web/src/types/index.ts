export type Language = 'en' | 'hi' | 'gu' | 'mr';

export type UserRole = 'ADMIN' | 'COLLECTOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'DISABLED';
  mobile?: string;
  createdAt: string;
}

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD' | 'OTHER';

export type DonationStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED';

export interface Donation {
  id: string;
  receiptNo?: string;
  year: number;
  donorName: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
  donationTypeId: string;
  donationTypeName: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  donationDate: string;
  notes?: string;
  status: DonationStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  confirmedBy?: string;
  confirmedByName?: string;
  confirmedAt?: string;
  rejectionReason?: string;
}

export type DonationTypeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';

export interface DonationType {
  id: string;
  year: number;
  name: string;
  description?: string;
  status: DonationTypeStatus;
  createdBy: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'FOOD'
  | 'TRANSPORT'
  | 'DECORATION'
  | 'ELECTRICITY'
  | 'MAINTENANCE'
  | 'SALARY'
  | 'OFFICE'
  | 'EVENT'
  | 'OTHER';

export type ExpenseStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED';

export interface Expense {
  id: string;
  year: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMode: PaymentMode;
  reference?: string;
  attachment?: string;
  notes?: string;
  status: ExpenseStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  confirmedBy?: string;
  confirmedByName?: string;
  confirmedAt?: string;
  rejectionReason?: string;
}

export interface DashboardSummary {
  year: number;
  totalCollection: number;
  totalExpenses: number;
  netBalance: number;
  pendingDonationsCount: number;
  pendingExpensesCount: number;
  thisMonthCollection: number;
  thisMonthExpenses: number;
  totalDonationsCount: number;
  approvedDonationsCount: number;
  rejectedDonationsCount: number;
}

export interface CollectionSummaryReport {
  year: number;
  totalDonationsCount: number;
  totalAmount: number;
  paymentModeBreakdown: Record<string, { amount: number; percentage: number }>;
  donationTypeBreakdown: Array<{
    typeId: string;
    typeName: string;
    count: number;
    totalAmount: number;
    percentage: number;
  }>;
}

export interface ExpenseSummaryReport {
  year: number;
  totalExpensesCount: number;
  approvedExpensesAmount: number;
  pendingExpensesAmount: number;
  rejectedExpensesAmount: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    totalAmount: number;
  }>;
  paymentModeBreakdown: Record<string, number>;
}

export interface AuditLog {
  id: string;
  year: number;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  performedByName?: string;
  timestamp: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
}

export interface Settings {
  year: number;
  orgName: string;
  orgAddress: string;
  orgMobile: string;
  orgEmail: string;
  receiptPrefix: string;
  donationPrefix: string;
  expensePrefix: string;
  headerImage?: string;
  footerImage?: string;
  // Custom Receipt Text Labels (side-by-side against standard English text)
  receiptNoLabel?: string;
  dateLabel?: string;
  idLabel?: string;
  donorNameLabel?: string;
  purposeLabel?: string;
  paymentModeLabel?: string;
  refLabel?: string;
  amountLabel?: string;
  amountInWordsLabel?: string;
  signatoryLabel?: string;
  thanksNotes?: string;
  officialNotice?: string;
}
