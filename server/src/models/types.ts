export type UserRole = 'ADMIN' | 'COLLECTOR' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DISABLED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  mobile?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD' | 'OTHER';

export type DonationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Donation {
  id: string; // DON-2026-000001
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
  receiptNo?: string;
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
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
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

export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Expense {
  id: string; // EXP-2026-000001
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

export interface Receipt {
  receiptNo: string; // REC-2026-000001
  donationId: string;
  year: number;
  generatedAt: string;
  fileName: string;
  generatedBy: string;
}

export type AuditAction =
  | 'DONATION_CREATED'
  | 'DONATION_UPDATED'
  | 'DONATION_APPROVED'
  | 'DONATION_REJECTED'
  | 'DONATION_CANCELLED'
  | 'DONATION_TYPE_CREATED'
  | 'DONATION_TYPE_APPROVED'
  | 'DONATION_TYPE_REJECTED'
  | 'DONATION_TYPE_UPDATED'
  | 'EXPENSE_CREATED'
  | 'EXPENSE_UPDATED'
  | 'EXPENSE_APPROVED'
  | 'EXPENSE_REJECTED'
  | 'RECEIPT_GENERATED'
  | 'WHATSAPP_RECEIPT_SENT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DISABLED';

export interface AuditLog {
  id: string; // AUD-2026-000001
  year: number;
  action: AuditAction;
  entityType: 'DONATION' | 'DONATION_TYPE' | 'EXPENSE' | 'RECEIPT' | 'USER';
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
}
