import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

const reportService = new ReportService();

export class ReportController {
  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const summary = await reportService.getDashboardSummary(year);
      res.json({
        success: true,
        data: summary,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCollectionSummary(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { fromDate, toDate } = req.query;

      const summary = await reportService.getCollectionSummary(year, fromDate as string, toDate as string);
      res.json({
        success: true,
        data: summary,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getExpenseSummary(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { fromDate, toDate } = req.query;

      const summary = await reportService.getExpenseSummary(year, fromDate as string, toDate as string);
      res.json({
        success: true,
        data: summary,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
