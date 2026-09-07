import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';

const expenseService = new ExpenseService();

export class ExpenseController {
  static async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { status, category, paymentMode, collectorId, fromDate, toDate, search } = req.query;

      const expenses = await expenseService.getAllExpenses(year, {
        status: status as any,
        category: category as any,
        paymentMode: paymentMode as any,
        collectorId: collectorId as string,
        fromDate: fromDate as string,
        toDate: toDate as string,
        search: search as string,
      });

      res.json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getExpenseById(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;

      const expense = await expenseService.getExpenseById(year, id);
      if (!expense) {
        res.status(404).json({ success: false, message: 'Expense not found' });
        return;
      }

      res.json({
        success: true,
        data: expense,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const userId = req.user!.userId;
      const userName = req.user!.name;
      const role = req.user!.role;

      const expense = await expenseService.createExpense(year, req.body, userId, userName, role);
      res.status(201).json({
        success: true,
        message: role === 'ADMIN' ? 'Expense created and approved' : 'Expense submitted for admin review',
        data: expense,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async approveExpense(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const adminUserId = req.user!.userId;
      const adminUserName = req.user!.name;

      const approved = await expenseService.approveExpense(year, id, adminUserId, adminUserName);
      res.json({
        success: true,
        message: 'Expense approved successfully',
        data: approved,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async rejectExpense(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const adminUserId = req.user!.userId;
      const adminUserName = req.user!.name;

      const rejected = await expenseService.rejectExpense(year, id, adminUserId, adminUserName, rejectionReason);
      res.json({
        success: true,
        message: 'Expense rejected successfully',
        data: rejected,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
