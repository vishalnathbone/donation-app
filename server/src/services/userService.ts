import bcrypt from 'bcryptjs';
import { getUserRepository } from '../repositories';
import { User, UserRole } from '../models/types';
import { AuditService } from './auditService';

export class UserService {
  private userRepo = getUserRepository();
  private auditService = new AuditService();

  async getAllUsers(year: number): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepo.findAll(year);
    return users.map(({ passwordHash, ...u }) => u);
  }

  async createUser(
    year: number,
    data: { name: string; email: string; password: string; role: UserRole; mobile?: string },
    adminUserId: string
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepo.findByEmail(year, data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();
    const count = (await this.userRepo.findAll(year)).length + 1;

    const newUser: User = {
      id: `USR-${data.role.slice(0, 4)}-${count.toString().padStart(3, '0')}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash,
      role: data.role,
      status: 'ACTIVE',
      mobile: data.mobile?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    const saved = await this.userRepo.create(year, newUser);

    await this.auditService.logAction(
      year,
      'USER_CREATED',
      'USER',
      saved.id,
      adminUserId,
      undefined,
      undefined,
      { id: saved.id, email: saved.email, role: saved.role }
    );

    const { passwordHash: _, ...safeUser } = saved;
    return safeUser;
  }

  async updateUserStatus(year: number, userId: string, status: 'ACTIVE' | 'DISABLED', adminUserId: string) {
    const existing = await this.userRepo.findById(year, userId);
    if (!existing) throw new Error('User not found');

    const updated = await this.userRepo.update(year, userId, { status });

    await this.auditService.logAction(
      year,
      status === 'DISABLED' ? 'USER_DISABLED' : 'USER_UPDATED',
      'USER',
      userId,
      adminUserId,
      undefined,
      { status: existing.status },
      { status: updated.status }
    );

    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }
}
