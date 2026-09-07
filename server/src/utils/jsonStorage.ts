import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { User, DonationType, Settings } from '../models/types';

class LockManager {
  private locks: Map<string, Promise<void>> = new Map();

  async acquire<T>(key: string, fn: () => Promise<T>): Promise<T> {
    while (this.locks.has(key)) {
      await this.locks.get(key);
    }

    let resolver: () => void = () => {};
    const lockPromise = new Promise<void>((resolve) => {
      resolver = resolve;
    });

    this.locks.set(key, lockPromise);

    try {
      return await fn();
    } finally {
      this.locks.delete(key);
      resolver();
    }
  }
}

const lockManager = new LockManager();

export class JsonStorageHelper {
  static getYearDir(year: number): string {
    return path.join(config.dataDir, year.toString());
  }

  static getBackupYearDir(year: number): string {
    return path.join(config.backupDir, year.toString());
  }

  static async ensureYearDir(year: number): Promise<string> {
    const dataYearDir = this.getYearDir(year);
    const backupYearDir = this.getBackupYearDir(year);

    if (!fs.existsSync(dataYearDir)) {
      fs.mkdirSync(dataYearDir, { recursive: true });
    }

    if (!fs.existsSync(backupYearDir)) {
      fs.mkdirSync(backupYearDir, { recursive: true });
    }

    const receiptsDir = path.join(dataYearDir, 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    await this.seedDefaults(year);

    return dataYearDir;
  }

  static async readJson<T>(year: number, filename: string): Promise<T[]> {
    const yearDir = await this.ensureYearDir(year);
    const filePath = path.join(yearDir, filename);

    if (!fs.existsSync(filePath)) {
      await this.writeJson<T>(year, filename, []);
      return [];
    }

    const fileKey = `${year}:${filename}`;
    return lockManager.acquire(fileKey, async () => {
      try {
        const raw = await fs.promises.readFile(filePath, 'utf-8');
        if (!raw.trim()) return [];
        return JSON.parse(raw) as T[];
      } catch (err) {
        console.error(`[JsonStorageHelper] Error reading ${filePath}:`, err);
        return [];
      }
    });
  }

  static async writeJson<T>(year: number, filename: string, data: T[]): Promise<void> {
    const yearDir = await this.ensureYearDir(year);
    const filePath = path.join(yearDir, filename);
    const backupDir = this.getBackupYearDir(year);
    const backupPath = path.join(backupDir, filename);
    const tempPath = `${filePath}.tmp.${Date.now()}`;

    const fileKey = `${year}:${filename}`;
    await lockManager.acquire(fileKey, async () => {
      // 1. Backup if file exists
      if (fs.existsSync(filePath)) {
        try {
          await fs.promises.copyFile(filePath, backupPath);
        } catch (backupErr) {
          console.warn(`[JsonStorageHelper] Backup failed for ${filePath}:`, backupErr);
        }
      }

      // 2. Atomic write: write to temp file then rename
      const payload = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(tempPath, payload, 'utf-8');
      await fs.promises.rename(tempPath, filePath);
    });
  }

  static async seedDefaults(year: number): Promise<void> {
    const yearDir = path.join(config.dataDir, year.toString());

    // 1. Seed users.json
    const usersPath = path.join(yearDir, 'users.json');
    if (!fs.existsSync(usersPath) || (await fs.promises.readFile(usersPath, 'utf-8')).trim() === '[]') {
      const now = new Date().toISOString();
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const collectorPassword = await bcrypt.hash('Collector@123', 10);
      const viewerPassword = await bcrypt.hash('Viewer@123', 10);

      const defaultUsers: User[] = [
        {
          id: 'USR-ADMIN-001',
          name: 'System Admin',
          email: 'admin@donation.org',
          passwordHash: adminPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          mobile: '9876543210',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'USR-COLL-001',
          name: 'Rajesh Sharma',
          email: 'collector@donation.org',
          passwordHash: collectorPassword,
          role: 'COLLECTOR',
          status: 'ACTIVE',
          mobile: '9876543211',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'USR-VIEW-001',
          name: 'Auditor Viewer',
          email: 'viewer@donation.org',
          passwordHash: viewerPassword,
          role: 'VIEWER',
          status: 'ACTIVE',
          mobile: '9876543212',
          createdAt: now,
          updatedAt: now,
        },
      ];

      await fs.promises.writeFile(usersPath, JSON.stringify(defaultUsers, null, 2), 'utf-8');
    }

    // 2. Seed donation-types.json
    const typesPath = path.join(yearDir, 'donation-types.json');
    if (!fs.existsSync(typesPath) || (await fs.promises.readFile(typesPath, 'utf-8')).trim() === '[]') {
      const now = new Date().toISOString();
      const defaultTypes: DonationType[] = [
        { id: 'TYP-001', year, name: 'GENERAL', description: 'General Charitable Trust Donation', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-002', year, name: 'FESTIVAL', description: 'Festival & Cultural Celebration Fund', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-003', year, name: 'EDUCATION', description: 'Child Education & Student Sponsorship', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-004', year, name: 'MEDICAL', description: 'Medical Emergency & Healthcare Assistance', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-005', year, name: 'FOOD', description: 'Annadan & Community Meals Service', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-006', year, name: 'BUILDING', description: 'Infrastructure & Temple Construction', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-007', year, name: 'ANNADAN', description: 'Special Annadan Seva Drive', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
        { id: 'TYP-008', year, name: 'OTHER', description: 'Miscellaneous Support', status: 'APPROVED', createdBy: 'USR-ADMIN-001', createdAt: now, approvedBy: 'USR-ADMIN-001', approvedAt: now },
      ];

      await fs.promises.writeFile(typesPath, JSON.stringify(defaultTypes, null, 2), 'utf-8');
    }

    // 3. Seed settings.json
    const settingsPath = path.join(yearDir, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      const defaultSettings: Settings = {
        year,
        orgName: config.organization.name,
        orgAddress: config.organization.address,
        orgMobile: config.organization.mobile,
        orgEmail: config.organization.email,
        receiptPrefix: 'REC',
        donationPrefix: 'DON',
        expensePrefix: 'EXP',
      };
      await fs.promises.writeFile(settingsPath, JSON.stringify([defaultSettings], null, 2), 'utf-8');
    }

    // 4. Ensure other JSON files exist as empty arrays
    const files = ['donations.json', 'expenses.json', 'receipts.json', 'audit-log.json'];
    for (const f of files) {
      const p = path.join(yearDir, f);
      if (!fs.existsSync(p)) {
        await fs.promises.writeFile(p, '[]', 'utf-8');
      }
    }
  }
}
