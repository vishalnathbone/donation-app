import { Request, Response } from 'express';
import { DonationTypeService } from '../services/donationTypeService';

const typeService = new DonationTypeService();

export class DonationTypeController {
  static async getActiveTypes(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const types = await typeService.getActiveTypes(year);
      res.json({
        success: true,
        count: types.length,
        data: types,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAllTypes(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const types = await typeService.getAllTypes(year);
      res.json({
        success: true,
        count: types.length,
        data: types,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPendingTypes(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const types = await typeService.getPendingTypes(year);
      res.json({
        success: true,
        count: types.length,
        data: types,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createType(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const userId = req.user!.userId;
      const role = req.user!.role;

      const created = await typeService.createType(year, req.body, userId, role);
      res.status(201).json({
        success: true,
        message: role === 'ADMIN' ? 'Donation type created and approved' : 'Donation type submitted for admin review',
        data: created,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async approveType(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const adminUserId = req.user!.userId;

      const approved = await typeService.approveType(year, id, adminUserId);
      res.json({
        success: true,
        message: 'Donation type approved and activated',
        data: approved,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async rejectType(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const adminUserId = req.user!.userId;

      const rejected = await typeService.rejectType(year, id, adminUserId, rejectionReason);
      res.json({
        success: true,
        message: 'Donation type rejected',
        data: rejected,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async patchType(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const { status } = req.body;
      const adminUserId = req.user!.userId;

      const updated = await typeService.updateStatus(year, id, status, adminUserId);
      res.json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
