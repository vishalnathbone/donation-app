import { Request, Response } from 'express';
import { DonationService } from '../services/donationService';

const donationService = new DonationService();

export class DonationController {
  static async getDonations(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { status, donationTypeId, paymentMode, collectorId, fromDate, toDate, search } = req.query;

      // Collector restriction: Collector can only view own donations
      let effectiveCollectorId = collectorId as string;
      if (req.user?.role === 'COLLECTOR') {
        effectiveCollectorId = req.user.userId;
      }

      const donations = await donationService.getAllDonations(year, {
        status: status as any,
        donationTypeId: donationTypeId as string,
        paymentMode: paymentMode as any,
        collectorId: effectiveCollectorId,
        fromDate: fromDate as string,
        toDate: toDate as string,
        search: search as string,
      });

      res.json({
        success: true,
        count: donations.length,
        data: donations,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDonationById(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;

      const donation = await donationService.getDonationById(year, id);
      if (!donation) {
        res.status(404).json({ success: false, message: 'Donation not found' });
        return;
      }

      // Authorization check for collectors
      if (req.user?.role === 'COLLECTOR' && donation.createdBy !== req.user.userId) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }

      res.json({
        success: true,
        data: donation,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createDonation(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const userId = req.user!.userId;
      const userName = req.user!.name;

      const donation = await donationService.createDonation(year, req.body, userId, userName);
      res.status(201).json({
        success: true,
        message: `Donation created successfully. Status set to ${donation.status}.`,
        data: donation,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async approveDonation(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const adminUserId = req.user!.userId;
      const adminUserName = req.user!.name;

      const approved = await donationService.approveDonation(year, id, adminUserId, adminUserName);
      res.json({
        success: true,
        message: 'Donation approved successfully. Official receipt generated.',
        data: approved,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async rejectDonation(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const adminUserId = req.user!.userId;
      const adminUserName = req.user!.name;

      const rejected = await donationService.rejectDonation(year, id, adminUserId, adminUserName, rejectionReason);
      res.json({
        success: true,
        message: 'Donation rejected successfully.',
        data: rejected,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async editDonation(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const adminUserId = req.user!.userId;
      const adminUserName = req.user!.name;

      const updated = await donationService.editDonation(year, id, req.body, adminUserId, adminUserName);
      res.json({
        success: true,
        message: 'Donation updated successfully.',
        data: updated,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
