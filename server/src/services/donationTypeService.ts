import { getDonationTypeRepository } from '../repositories';
import { DonationType, DonationTypeStatus } from '../models/types';
import { IdGenerator } from '../utils/idGenerator';
import { AuditService } from './auditService';

export class DonationTypeService {
  private typeRepo = getDonationTypeRepository();
  private auditService = new AuditService();

  async getAllTypes(year: number): Promise<DonationType[]> {
    return this.typeRepo.findAll(year);
  }

  async getActiveTypes(year: number): Promise<DonationType[]> {
    const list = await this.typeRepo.findAll(year);
    return list.filter((t) => t.status === 'APPROVED');
  }

  async getPendingTypes(year: number): Promise<DonationType[]> {
    const list = await this.typeRepo.findAll(year);
    return list.filter((t) => t.status === 'PENDING');
  }

  async createType(
    year: number,
    data: { name: string; description?: string },
    createdByUserId: string,
    createdByRole: string
  ): Promise<DonationType> {
    const id = await IdGenerator.generateDonationTypeId(year);
    const now = new Date().toISOString();

    // If Admin creates it, auto-approve; if collector creates it, set PENDING
    const initialStatus: DonationTypeStatus = createdByRole === 'ADMIN' ? 'APPROVED' : 'PENDING';

    const newType: DonationType = {
      id,
      year,
      name: data.name.toUpperCase().trim(),
      description: data.description,
      status: initialStatus,
      createdBy: createdByUserId,
      createdAt: now,
      approvedBy: createdByRole === 'ADMIN' ? createdByUserId : undefined,
      approvedAt: createdByRole === 'ADMIN' ? now : undefined,
    };

    const created = await this.typeRepo.create(year, newType);

    await this.auditService.logAction(
      year,
      'DONATION_TYPE_CREATED',
      'DONATION_TYPE',
      id,
      createdByUserId,
      undefined,
      undefined,
      created as any
    );

    return created;
  }

  async approveType(year: number, id: string, adminUserId: string): Promise<DonationType> {
    const existing = await this.typeRepo.findById(year, id);
    if (!existing) throw new Error('Donation Type not found');

    const updated = await this.typeRepo.update(year, id, {
      status: 'APPROVED',
      approvedBy: adminUserId,
      approvedAt: new Date().toISOString(),
    });

    await this.auditService.logAction(
      year,
      'DONATION_TYPE_APPROVED',
      'DONATION_TYPE',
      id,
      adminUserId,
      undefined,
      existing as any,
      updated as any
    );

    return updated;
  }

  async rejectType(year: number, id: string, adminUserId: string, reason: string): Promise<DonationType> {
    const existing = await this.typeRepo.findById(year, id);
    if (!existing) throw new Error('Donation Type not found');

    const updated = await this.typeRepo.update(year, id, {
      status: 'REJECTED',
      rejectionReason: reason,
    });

    await this.auditService.logAction(
      year,
      'DONATION_TYPE_REJECTED',
      'DONATION_TYPE',
      id,
      adminUserId,
      undefined,
      existing as any,
      updated as any
    );

    return updated;
  }

  async updateStatus(year: number, id: string, status: DonationTypeStatus, adminUserId: string): Promise<DonationType> {
    const existing = await this.typeRepo.findById(year, id);
    if (!existing) throw new Error('Donation Type not found');

    const updated = await this.typeRepo.update(year, id, { status });

    await this.auditService.logAction(
      year,
      'DONATION_TYPE_UPDATED',
      'DONATION_TYPE',
      id,
      adminUserId,
      undefined,
      existing as any,
      updated as any
    );

    return updated;
  }
}
