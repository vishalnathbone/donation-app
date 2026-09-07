import { Request, Response } from 'express';
import { getDonationRepository, getExpenseRepository, getDonationTypeRepository } from '../repositories';
import { generateExcelWorkbook } from '../utils/excelGenerator';

const donationRepo = getDonationRepository();
const expenseRepo = getExpenseRepository();
const typeRepo = getDonationTypeRepository();

export class ExcelController {
  static async exportFullReport(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { fromDate, toDate, donationType, paymentMode, collector, status } = req.query;

      const donations = await donationRepo.findAll(year);
      const expenses = await expenseRepo.findAll(year);
      const types = await typeRepo.findAll(year);

      const buffer = await generateExcelWorkbook(year, donations, expenses, types, {
        fromDate: fromDate as string,
        toDate: toDate as string,
        donationType: donationType as string,
        paymentMode: paymentMode as string,
        collector: collector as string,
        status: status as string,
      });

      const filename = `Financial_Report_${year}_${Date.now()}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async exportDonations(req: Request, res: Response): Promise<void> {
    return ExcelController.exportFullReport(req, res);
  }

  static async exportExpenses(req: Request, res: Response): Promise<void> {
    return ExcelController.exportFullReport(req, res);
  }

  static async exportSummary(req: Request, res: Response): Promise<void> {
    return ExcelController.exportFullReport(req, res);
  }
}
