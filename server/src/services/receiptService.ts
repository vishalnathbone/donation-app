import path from 'path';
import fs from 'fs';
import { getReceiptRepository, getSettingsRepository } from '../repositories';
import { Receipt, Donation } from '../models/types';
import { IdGenerator } from '../utils/idGenerator';
import { generateReceiptPdf } from '../utils/pdfGenerator';
import { JsonStorageHelper } from '../utils/jsonStorage';
import { AuditService } from './auditService';

export class ReceiptService {
  private receiptRepo = getReceiptRepository();
  private settingsRepo = getSettingsRepository();
  private auditService = new AuditService();

  async generateReceiptForDonation(year: number, donation: Donation, generatedByUserId: string): Promise<Receipt> {
    const existing = await this.receiptRepo.findByDonationId(year, donation.id);
    if (existing) {
      return existing;
    }

    const receiptNo = await IdGenerator.generateReceiptNo(year);
    const fileName = `${receiptNo}.pdf`;
    const yearDir = await JsonStorageHelper.ensureYearDir(year);
    const pdfPath = path.join(yearDir, 'receipts', fileName);

    const settings = (await this.settingsRepo.get(year)) || {
      year,
      orgName: 'Shree Krishna Seva Trust',
      orgAddress: '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
      orgMobile: '+91 98765 43210',
      orgEmail: 'info@krishnaseva.org',
      receiptPrefix: 'REC',
      donationPrefix: 'DON',
      expensePrefix: 'EXP',
    };

    await generateReceiptPdf(donation, receiptNo, settings, pdfPath);

    const newReceipt: Receipt = {
      receiptNo,
      donationId: donation.id,
      year,
      generatedAt: new Date().toISOString(),
      fileName,
      generatedBy: generatedByUserId,
    };

    const saved = await this.receiptRepo.create(year, newReceipt);

    await this.auditService.logAction(
      year,
      'RECEIPT_GENERATED',
      'RECEIPT',
      receiptNo,
      generatedByUserId,
      undefined,
      undefined,
      saved as any
    );

    return saved;
  }

  async getReceiptByNo(year: number, receiptNo: string): Promise<Receipt | null> {
    return this.receiptRepo.findByReceiptNo(year, receiptNo);
  }

  async getReceiptPdfPath(year: number, receiptNo: string): Promise<string> {
    const receipt = await this.getReceiptByNo(year, receiptNo);
    if (!receipt) {
      throw new Error(`Receipt ${receiptNo} not found`);
    }
    const yearDir = await JsonStorageHelper.ensureYearDir(year);
    const pdfPath = path.join(yearDir, 'receipts', `${receiptNo}.pdf`);

    // Always generate/refresh the PDF file using latest Settings & layout images
    const { getDonationRepository } = await import('../repositories');
    const donationRepo = getDonationRepository();
    const donation = await donationRepo.findById(year, receipt.donationId);

    if (donation) {
      const settings = (await this.settingsRepo.get(year)) || {
        year,
        orgName: 'Shree Krishna Seva Trust',
        orgAddress: '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
        orgMobile: '+91 98765 43210',
        orgEmail: 'info@krishnaseva.org',
        receiptPrefix: 'REC',
        donationPrefix: 'DON',
        expensePrefix: 'EXP',
      };
      await generateReceiptPdf(donation, receiptNo, settings, pdfPath);
    } else if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file for receipt ${receiptNo} missing and donation record not found`);
    }

    return pdfPath;
  }
}
