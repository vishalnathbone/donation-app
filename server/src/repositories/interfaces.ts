import {
  Donation,
  DonationType,
  Expense,
  Receipt,
  User,
  AuditLog,
  Settings,
} from '../models/types';

export interface DonationRepository {
  findAll(year: number): Promise<Donation[]>;
  findById(year: number, id: string): Promise<Donation | null>;
  create(year: number, donation: Donation): Promise<Donation>;
  update(year: number, id: string, data: Partial<Donation>): Promise<Donation>;
  delete(year: number, id: string): Promise<boolean>;
}

export interface DonationTypeRepository {
  findAll(year: number): Promise<DonationType[]>;
  findById(year: number, id: string): Promise<DonationType | null>;
  create(year: number, type: DonationType): Promise<DonationType>;
  update(year: number, id: string, data: Partial<DonationType>): Promise<DonationType>;
}

export interface ExpenseRepository {
  findAll(year: number): Promise<Expense[]>;
  findById(year: number, id: string): Promise<Expense | null>;
  create(year: number, expense: Expense): Promise<Expense>;
  update(year: number, id: string, data: Partial<Expense>): Promise<Expense>;
}

export interface ReceiptRepository {
  findAll(year: number): Promise<Receipt[]>;
  findByReceiptNo(year: number, receiptNo: string): Promise<Receipt | null>;
  findByDonationId(year: number, donationId: string): Promise<Receipt | null>;
  create(year: number, receipt: Receipt): Promise<Receipt>;
}

export interface UserRepository {
  findAll(year: number): Promise<User[]>;
  findById(year: number, id: string): Promise<User | null>;
  findByEmail(year: number, email: string): Promise<User | null>;
  create(year: number, user: User): Promise<User>;
  update(year: number, id: string, data: Partial<User>): Promise<User>;
}

export interface AuditRepository {
  findAll(year: number): Promise<AuditLog[]>;
  create(year: number, log: AuditLog): Promise<AuditLog>;
}

export interface SettingsRepository {
  get(year: number): Promise<Settings | null>;
  update(year: number, settings: Partial<Settings>): Promise<Settings>;
}
