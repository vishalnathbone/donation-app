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
  Donation,
  DonationType,
  Expense,
  Receipt,
  User,
  AuditLog,
  Settings,
} from '../models/types';
import { JsonStorageHelper } from '../utils/jsonStorage';

export class JsonDonationRepository implements DonationRepository {
  async findAll(year: number): Promise<Donation[]> {
    return JsonStorageHelper.readJson<Donation>(year, 'donations.json');
  }

  async findById(year: number, id: string): Promise<Donation | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.id === id) || null;
  }

  async create(year: number, donation: Donation): Promise<Donation> {
    const list = await this.findAll(year);
    list.push(donation);
    await JsonStorageHelper.writeJson(year, 'donations.json', list);
    return donation;
  }

  async update(year: number, id: string, data: Partial<Donation>): Promise<Donation> {
    const list = await this.findAll(year);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Donation with ID ${id} not found in year ${year}`);
    }
    const updated = { ...list[index], ...data };
    list[index] = updated;
    await JsonStorageHelper.writeJson(year, 'donations.json', list);
    return updated;
  }

  async delete(year: number, id: string): Promise<boolean> {
    const list = await this.findAll(year);
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;
    await JsonStorageHelper.writeJson(year, 'donations.json', filtered);
    return true;
  }
}

export class JsonDonationTypeRepository implements DonationTypeRepository {
  async findAll(year: number): Promise<DonationType[]> {
    return JsonStorageHelper.readJson<DonationType>(year, 'donation-types.json');
  }

  async findById(year: number, id: string): Promise<DonationType | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.id === id) || null;
  }

  async create(year: number, type: DonationType): Promise<DonationType> {
    const list = await this.findAll(year);
    list.push(type);
    await JsonStorageHelper.writeJson(year, 'donation-types.json', list);
    return type;
  }

  async update(year: number, id: string, data: Partial<DonationType>): Promise<DonationType> {
    const list = await this.findAll(year);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`DonationType with ID ${id} not found in year ${year}`);
    }
    const updated = { ...list[index], ...data };
    list[index] = updated;
    await JsonStorageHelper.writeJson(year, 'donation-types.json', list);
    return updated;
  }
}

export class JsonExpenseRepository implements ExpenseRepository {
  async findAll(year: number): Promise<Expense[]> {
    return JsonStorageHelper.readJson<Expense>(year, 'expenses.json');
  }

  async findById(year: number, id: string): Promise<Expense | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.id === id) || null;
  }

  async create(year: number, expense: Expense): Promise<Expense> {
    const list = await this.findAll(year);
    list.push(expense);
    await JsonStorageHelper.writeJson(year, 'expenses.json', list);
    return expense;
  }

  async update(year: number, id: string, data: Partial<Expense>): Promise<Expense> {
    const list = await this.findAll(year);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Expense with ID ${id} not found in year ${year}`);
    }
    const updated = { ...list[index], ...data };
    list[index] = updated;
    await JsonStorageHelper.writeJson(year, 'expenses.json', list);
    return updated;
  }
}

export class JsonReceiptRepository implements ReceiptRepository {
  async findAll(year: number): Promise<Receipt[]> {
    return JsonStorageHelper.readJson<Receipt>(year, 'receipts.json');
  }

  async findByReceiptNo(year: number, receiptNo: string): Promise<Receipt | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.receiptNo === receiptNo) || null;
  }

  async findByDonationId(year: number, donationId: string): Promise<Receipt | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.donationId === donationId) || null;
  }

  async create(year: number, receipt: Receipt): Promise<Receipt> {
    const list = await this.findAll(year);
    list.push(receipt);
    await JsonStorageHelper.writeJson(year, 'receipts.json', list);
    return receipt;
  }
}

export class JsonUserRepository implements UserRepository {
  async findAll(year: number): Promise<User[]> {
    return JsonStorageHelper.readJson<User>(year, 'users.json');
  }

  async findById(year: number, id: string): Promise<User | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.id === id) || null;
  }

  async findByEmail(year: number, email: string): Promise<User | null> {
    const list = await this.findAll(year);
    return list.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async create(year: number, user: User): Promise<User> {
    const list = await this.findAll(year);
    list.push(user);
    await JsonStorageHelper.writeJson(year, 'users.json', list);
    return user;
  }

  async update(year: number, id: string, data: Partial<User>): Promise<User> {
    const list = await this.findAll(year);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found in year ${year}`);
    }
    const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() };
    list[index] = updated;
    await JsonStorageHelper.writeJson(year, 'users.json', list);
    return updated;
  }
}

export class JsonAuditRepository implements AuditRepository {
  async findAll(year: number): Promise<AuditLog[]> {
    return JsonStorageHelper.readJson<AuditLog>(year, 'audit-log.json');
  }

  async create(year: number, log: AuditLog): Promise<AuditLog> {
    const list = await this.findAll(year);
    list.unshift(log); // newest first
    await JsonStorageHelper.writeJson(year, 'audit-log.json', list);
    return log;
  }
}

export class JsonSettingsRepository implements SettingsRepository {
  async get(year: number): Promise<Settings | null> {
    const list = await JsonStorageHelper.readJson<Settings>(year, 'settings.json');
    return list[0] || null;
  }

  async update(year: number, settings: Partial<Settings>): Promise<Settings> {
    const current = (await this.get(year)) || {
      year,
      orgName: 'Shree Krishna Seva Trust',
      orgAddress: '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
      orgMobile: '+91 98765 43210',
      orgEmail: 'info@krishnaseva.org',
      receiptPrefix: 'REC',
      donationPrefix: 'DON',
      expensePrefix: 'EXP',
    };
    const updated = { ...current, ...settings, year };
    await JsonStorageHelper.writeJson(year, 'settings.json', [updated]);
    return updated;
  }
}
