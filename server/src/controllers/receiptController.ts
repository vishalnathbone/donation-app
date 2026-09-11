import { Request, Response } from 'express';
import { ReceiptService } from '../services/receiptService';
import { AuditService } from '../services/auditService';

const receiptService = new ReceiptService();
const auditService = new AuditService();

export class ReceiptController {
  static async getReceipt(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params; // Receipt No or Donation ID

      let receipt = await receiptService.getReceiptByNo(year, id);
      if (!receipt) {
        const { getReceiptRepository } = await import('../repositories');
        const repo = getReceiptRepository();
        receipt = await repo.findByDonationId(year, id);
      }

      if (!receipt) {
        res.status(404).json({ success: false, message: 'Receipt not found' });
        return;
      }

      res.json({
        success: true,
        data: receipt,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async downloadReceiptPdf(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params; // Receipt No or Donation ID

      let receiptNo = id;
      let receipt = await receiptService.getReceiptByNo(year, id);
      if (!receipt) {
        const { getReceiptRepository } = await import('../repositories');
        const repo = getReceiptRepository();
        receipt = await repo.findByDonationId(year, id);
        if (receipt) receiptNo = receipt.receiptNo;
      }

      // If receipt record is not found, check if `id` is a Donation ID
      if (!receipt) {
        const { DonationService } = await import('../services/donationService');
        const donationService = new DonationService();
        const donation = await donationService.getDonationById(year, id);

        if (donation) {
          if (donation.status === 'APPROVED') {
            receipt = await receiptService.generateReceiptForDonation(year, donation, req.user?.userId || 'SYSTEM');
            receiptNo = receipt.receiptNo;
          } else {
            res.status(400).json({
              success: false,
              message: `Donation ${id} is currently ${donation.status}. Receipts can only be generated for APPROVED donations.`,
            });
            return;
          }
        }
      }

      if (!receipt) {
        res.status(404).json({
          success: false,
          message: `Receipt not found for '${id}'. Please verify the Receipt Number or Donation ID.`,
        });
        return;
      }

      const pdfPath = await receiptService.getReceiptPdfPath(year, receiptNo);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${receipt.fileName}"`);
      res.sendFile(pdfPath);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async logWhatsAppShare(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { receiptNo, mobileNumber } = req.body;
      const userId = req.user!.userId;
      const userName = req.user!.name;

      await auditService.logAction(
        year,
        'WHATSAPP_RECEIPT_SENT',
        'RECEIPT',
        receiptNo,
        userId,
        userName,
        undefined,
        { receiptNo, mobileNumber }
      );

      res.json({
        success: true,
        message: 'WhatsApp share audit recorded',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
