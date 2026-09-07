import { getDonationRepository, getDonationTypeRepository } from '../repositories';
import { Donation, DonationStatus, PaymentMode } from '../models/types';
import { IdGenerator } from '../utils/idGenerator';
import { AuditService } from './auditService';
import { ReceiptService } from './receiptService';

export class DonationService {
  private donationRepo = getDonationRepository();
  private donationTypeRepo = getDonationTypeRepository();
  private auditService = new AuditService();
  private receiptService = new ReceiptService();

  async getAllDonations(
    year: number,
    filters?: {
      status?: DonationStatus;
      donationTypeId?: string;
      paymentMode?: PaymentMode;
      collectorId?: string;
      fromDate?: string;
      toDate?: string;
      search?: string;
    }
  ): Promise<Donation[]> {
    let list = await this.donationRepo.findAll(year);

    if (filters) {
      if (filters.status) list = list.filter((d) => d.status === filters.status);
      if (filters.donationTypeId) list = list.filter((d) => d.donationTypeId === filters.donationTypeId || d.donationTypeName === filters.donationTypeId);
      if (filters.paymentMode) list = list.filter((d) => d.paymentMode === filters.paymentMode);
      if (filters.collectorId) list = list.filter((d) => d.createdBy === filters.collectorId);
      if (filters.fromDate) list = list.filter((d) => d.donationDate >= filters.fromDate!);
      if (filters.toDate) list = list.filter((d) => d.donationDate <= filters.toDate!);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (d) =>
            d.id.toLowerCase().includes(q) ||
            d.donorName.toLowerCase().includes(q) ||
            (d.mobileNumber && d.mobileNumber.includes(q)) ||
            (d.transactionRef && d.transactionRef.toLowerCase().includes(q)) ||
            (d.receiptNo && d.receiptNo.toLowerCase().includes(q))
        );
      }
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getDonationById(year: number, id: string): Promise<Donation | null> {
    return this.donationRepo.findById(year, id);
  }

  async createDonation(
    year: number,
    data: {
      donorName: string;
      mobileNumber?: string;
      email?: string;
      address?: string;
      donationTypeId: string;
      amount: number;
      paymentMode: PaymentMode;
      transactionRef?: string;
      donationDate?: string;
      notes?: string;
      status?: DonationStatus;
    },
    userId: string,
    userName: string
  ): Promise<Donation> {
    // 1. Verify donation type is active
    const types = await this.donationTypeRepo.findAll(year);
    const selectedType = types.find(
      (t) => (t.id === data.donationTypeId || t.name === data.donationTypeId.toUpperCase()) && t.status === 'APPROVED'
    );

    if (!selectedType) {
      throw new Error('Selected donation type is invalid or not active');
    }

    const id = await IdGenerator.generateDonationId(year);
    const now = new Date().toISOString();
    const todayStr = new Date().toISOString().split('T')[0];

    const initialStatus: DonationStatus = data.status === 'APPROVED' ? 'APPROVED' : 'PENDING';

    const newDonation: Donation = {
      id,
      year,
      donorName: data.donorName.trim(),
      mobileNumber: data.mobileNumber?.trim(),
      email: data.email?.trim(),
      address: data.address?.trim(),
      donationTypeId: selectedType.id,
      donationTypeName: selectedType.name,
      amount: data.amount,
      paymentMode: data.paymentMode,
      transactionRef: data.transactionRef?.trim(),
      donationDate: data.donationDate || todayStr,
      notes: data.notes?.trim(),
      status: initialStatus,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      confirmedBy: initialStatus === 'APPROVED' ? userId : undefined,
      confirmedByName: initialStatus === 'APPROVED' ? userName : undefined,
      confirmedAt: initialStatus === 'APPROVED' ? now : undefined,
    };

    const saved = await this.donationRepo.create(year, newDonation);

    if (initialStatus === 'APPROVED') {
      const receipt = await this.receiptService.generateReceiptForDonation(year, saved, userId);
      saved.receiptNo = receipt.receiptNo;
      await this.donationRepo.update(year, saved.id, { receiptNo: receipt.receiptNo });
    }

    await this.auditService.logAction(
      year,
      'DONATION_CREATED',
      'DONATION',
      id,
      userId,
      userName,
      undefined,
      saved as any
    );

    return saved;
  }

  async approveDonation(
    year: number,
    id: string,
    adminUserId: string,
    adminUserName: string
  ): Promise<Donation> {
    const existing = await this.donationRepo.findById(year, id);
    if (!existing) throw new Error('Donation not found');

    if (existing.status === 'APPROVED') {
      return existing;
    }

    const now = new Date().toISOString();

    // Generate receipt upon approval
    const receipt = await this.receiptService.generateReceiptForDonation(year, existing, adminUserId);

    const updated = await this.donationRepo.update(year, id, {
      status: 'APPROVED',
      confirmedBy: adminUserId,
      confirmedByName: adminUserName,
      confirmedAt: now,
      receiptNo: receipt.receiptNo,
    });

    await this.auditService.logAction(
      year,
      'DONATION_APPROVED',
      'DONATION',
      id,
      adminUserId,
      adminUserName,
      existing as any,
      updated as any
    );

    return updated;
  }

  async rejectDonation(
    year: number,
    id: string,
    adminUserId: string,
    adminUserName: string,
    reason: string
  ): Promise<Donation> {
    const existing = await this.donationRepo.findById(year, id);
    if (!existing) throw new Error('Donation not found');

    const updated = await this.donationRepo.update(year, id, {
      status: 'REJECTED',
      rejectionReason: reason,
    });

    await this.auditService.logAction(
      year,
      'DONATION_REJECTED',
      'DONATION',
      id,
      adminUserId,
      adminUserName,
      existing as any,
      updated as any
    );

    return updated;
  }

  async editDonation(
    year: number,
    id: string,
    data: Partial<Donation>,
    adminUserId: string,
    adminUserName: string
  ): Promise<Donation> {
    const existing = await this.donationRepo.findById(year, id);
    if (!existing) throw new Error('Donation not found');

    const updated = await this.donationRepo.update(year, id, data);

    await this.auditService.logAction(
      year,
      'DONATION_UPDATED',
      'DONATION',
      id,
      adminUserId,
      adminUserName,
      existing as any,
      updated as any
    );

    return updated;
  }
}
