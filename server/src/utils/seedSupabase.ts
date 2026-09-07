import { config } from '../config';
import { JsonStorageHelper } from './jsonStorage';
import {
  SupabaseDonationRepository,
  SupabaseDonationTypeRepository,
  SupabaseExpenseRepository,
  SupabaseReceiptRepository,
  SupabaseUserRepository,
  SupabaseAuditRepository,
  SupabaseSettingsRepository,
} from '../repositories/supabaseRepository';
import {
  Donation,
  DonationType,
  Expense,
  Receipt,
  User,
  AuditLog,
  Settings,
} from '../models/types';

export async function seedSupabaseFromJSON(year: number = 2026): Promise<void> {
  if (!config.useSupabase) return;

  try {
    console.log(`[SeedSupabase] Checking Supabase database tables for year ${year}...`);

    const userRepo = new SupabaseUserRepository();
    const existingUsers = await userRepo.findAll(year);

    if (existingUsers.length === 0) {
      console.log(`[SeedSupabase] Seeding users from local JSON...`);
      const localUsers = await JsonStorageHelper.readJson<User>(year, 'users.json');
      for (const u of localUsers) {
        try {
          await userRepo.create(year, u);
        } catch (err) {
          console.warn(`User ${u.id} seed skipped:`, (err as Error).message);
        }
      }
    }

    const typeRepo = new SupabaseDonationTypeRepository();
    const existingTypes = await typeRepo.findAll(year);
    if (existingTypes.length === 0) {
      console.log(`[SeedSupabase] Seeding donation types from local JSON...`);
      const localTypes = await JsonStorageHelper.readJson<DonationType>(year, 'donation-types.json');
      for (const t of localTypes) {
        try {
          await typeRepo.create(year, t);
        } catch (err) {
          console.warn(`DonationType ${t.id} seed skipped:`, (err as Error).message);
        }
      }
    }

    const donationRepo = new SupabaseDonationRepository();
    const existingDonations = await donationRepo.findAll(year);
    if (existingDonations.length === 0) {
      console.log(`[SeedSupabase] Seeding donations from local JSON...`);
      const localDonations = await JsonStorageHelper.readJson<Donation>(year, 'donations.json');
      for (const d of localDonations) {
        try {
          await donationRepo.create(year, d);
        } catch (err) {
          console.warn(`Donation ${d.id} seed skipped:`, (err as Error).message);
        }
      }
    }

    const expenseRepo = new SupabaseExpenseRepository();
    const existingExpenses = await expenseRepo.findAll(year);
    if (existingExpenses.length === 0) {
      console.log(`[SeedSupabase] Seeding expenses from local JSON...`);
      const localExpenses = await JsonStorageHelper.readJson<Expense>(year, 'expenses.json');
      for (const e of localExpenses) {
        try {
          await expenseRepo.create(year, e);
        } catch (err) {
          console.warn(`Expense ${e.id} seed skipped:`, (err as Error).message);
        }
      }
    }

    const settingsRepo = new SupabaseSettingsRepository();
    const currentSettings = await settingsRepo.get(year);
    if (!currentSettings) {
      console.log(`[SeedSupabase] Seeding settings from local JSON...`);
      const localSettings = await JsonStorageHelper.readJson<Settings>(year, 'settings.json');
      if (localSettings[0]) {
        await settingsRepo.update(year, localSettings[0]);
      }
    }

    console.log(`[SeedSupabase] Seed check complete for year ${year}.`);
  } catch (error) {
    console.error('[SeedSupabase] Error during seed check:', error);
  }
}
