import { config } from '../config';
import {
  DonationRepository,
  DonationTypeRepository,
  ExpenseRepository,
  ReceiptRepository,
  UserRepository,
  AuditRepository,
  SettingsRepository,
} from './interfaces';
import {
  JsonDonationRepository,
  JsonDonationTypeRepository,
  JsonExpenseRepository,
  JsonReceiptRepository,
  JsonUserRepository,
  JsonAuditRepository,
  JsonSettingsRepository,
} from './jsonRepository';
import {
  SupabaseDonationRepository,
  SupabaseDonationTypeRepository,
  SupabaseExpenseRepository,
  SupabaseReceiptRepository,
  SupabaseUserRepository,
  SupabaseAuditRepository,
  SupabaseSettingsRepository,
} from './supabaseRepository';

export * from './interfaces';
export * from './jsonRepository';
export * from './supabaseRepository';

export function getDonationRepository(): DonationRepository {
  return config.useSupabase ? new SupabaseDonationRepository() : new JsonDonationRepository();
}

export function getDonationTypeRepository(): DonationTypeRepository {
  return config.useSupabase ? new SupabaseDonationTypeRepository() : new JsonDonationTypeRepository();
}

export function getExpenseRepository(): ExpenseRepository {
  return config.useSupabase ? new SupabaseExpenseRepository() : new JsonExpenseRepository();
}

export function getReceiptRepository(): ReceiptRepository {
  return config.useSupabase ? new SupabaseReceiptRepository() : new JsonReceiptRepository();
}

export function getUserRepository(): UserRepository {
  return config.useSupabase ? new SupabaseUserRepository() : new JsonUserRepository();
}

export function getAuditRepository(): AuditRepository {
  return config.useSupabase ? new SupabaseAuditRepository() : new JsonAuditRepository();
}

export function getSettingsRepository(): SettingsRepository {
  return config.useSupabase ? new SupabaseSettingsRepository() : new JsonSettingsRepository();
}
