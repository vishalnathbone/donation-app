import { getExpenseRepository } from '../repositories';
import { Expense, ExpenseCategory, ExpenseStatus, PaymentMode } from '../models/types';
import { IdGenerator } from '../utils/idGenerator';
import { AuditService } from './auditService';

export class ExpenseService {
  private expenseRepo = getExpenseRepository();
  private auditService = new AuditService();

  async getAllExpenses(
    year: number,
    filters?: {
      status?: ExpenseStatus;
      category?: ExpenseCategory;
      paymentMode?: PaymentMode;
      collectorId?: string;
      fromDate?: string;
      toDate?: string;
      search?: string;
    }
  ): Promise<Expense[]> {
    let list = await this.expenseRepo.findAll(year);

    if (filters) {
      if (filters.status) list = list.filter((e) => e.status === filters.status);
      if (filters.category) list = list.filter((e) => e.category === filters.category);
      if (filters.paymentMode) list = list.filter((e) => e.paymentMode === filters.paymentMode);
      if (filters.collectorId) list = list.filter((e) => e.createdBy === filters.collectorId);
      if (filters.fromDate) list = list.filter((e) => e.date >= filters.fromDate!);
      if (filters.toDate) list = list.filter((e) => e.date <= filters.toDate!);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.id.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            (e.reference && e.reference.toLowerCase().includes(q))
        );
      }
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getExpenseById(year: number, id: string): Promise<Expense | null> {
    return this.expenseRepo.findById(year, id);
  }

  async createExpense(
    year: number,
    data: {
      date?: string;
      category: ExpenseCategory;
      description: string;
      amount: number;
      paymentMode: PaymentMode;
      reference?: string;
      attachment?: string;
      notes?: string;
    },
    userId: string,
    userName: string,
    userRole: string
  ): Promise<Expense> {
    const id = await IdGenerator.generateExpenseId(year);
    const now = new Date().toISOString();
    const todayStr = new Date().toISOString().split('T')[0];

    // If ADMIN creates it, default to APPROVED; if Collector creates, default to PENDING
    const initialStatus: ExpenseStatus = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';

    const newExpense: Expense = {
      id,
      year,
      date: data.date || todayStr,
      category: data.category,
      description: data.description.trim(),
      amount: data.amount,
      paymentMode: data.paymentMode,
      reference: data.reference?.trim(),
      attachment: data.attachment,
      notes: data.notes?.trim(),
      status: initialStatus,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      confirmedBy: userRole === 'ADMIN' ? userId : undefined,
      confirmedByName: userRole === 'ADMIN' ? userName : undefined,
      confirmedAt: userRole === 'ADMIN' ? now : undefined,
    };

    const saved = await this.expenseRepo.create(year, newExpense);

    await this.auditService.logAction(
      year,
      'EXPENSE_CREATED',
      'EXPENSE',
      id,
      userId,
      userName,
      undefined,
      saved as any
    );

    return saved;
  }

  async approveExpense(
    year: number,
    id: string,
    adminUserId: string,
    adminUserName: string
  ): Promise<Expense> {
    const existing = await this.expenseRepo.findById(year, id);
    if (!existing) throw new Error('Expense not found');

    const updated = await this.expenseRepo.update(year, id, {
      status: 'APPROVED',
      confirmedBy: adminUserId,
      confirmedByName: adminUserName,
      confirmedAt: new Date().toISOString(),
    });

    await this.auditService.logAction(
      year,
      'EXPENSE_APPROVED',
      'EXPENSE',
      id,
      adminUserId,
      adminUserName,
      existing as any,
      updated as any
    );

    return updated;
  }

  async rejectExpense(
    year: number,
    id: string,
    adminUserId: string,
    adminUserName: string,
    reason: string
  ): Promise<Expense> {
    const existing = await this.expenseRepo.findById(year, id);
    if (!existing) throw new Error('Expense not found');

    const updated = await this.expenseRepo.update(year, id, {
      status: 'REJECTED',
      rejectionReason: reason,
    });

    await this.auditService.logAction(
      year,
      'EXPENSE_REJECTED',
      'EXPENSE',
      id,
      adminUserId,
      adminUserName,
      existing as any,
      updated as any
    );

    return updated;
  }
}
