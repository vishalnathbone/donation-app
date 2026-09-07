import { getDonationRepository, getExpenseRepository } from '../repositories';

export interface DashboardSummary {
  year: number;
  totalCollection: number;
  totalExpenses: number;
  netBalance: number;
  pendingDonationsCount: number;
  pendingExpensesCount: number;
  totalDonationsCount: number;
  approvedDonationsCount: number;
  rejectedDonationsCount: number;
}

export interface CollectionSummaryReport {
  year: number;
  totalDonationsCount: number;
  totalAmount: number;
  paymentModeBreakdown: {
    CASH: number;
    UPI: number;
    BANK_TRANSFER: number;
    CHEQUE: number;
    CARD: number;
    OTHER: number;
  };
  donationTypeBreakdown: Array<{
    typeId: string;
    typeName: string;
    count: number;
    totalAmount: number;
  }>;
}

export interface ExpenseSummaryReport {
  year: number;
  totalExpensesCount: number;
  approvedExpensesAmount: number;
  pendingExpensesAmount: number;
  rejectedExpensesAmount: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    totalAmount: number;
  }>;
  paymentModeBreakdown: Record<string, number>;
}

export class ReportService {
  private donationRepo = getDonationRepository();
  private expenseRepo = getExpenseRepository();

  async getDashboardSummary(year: number): Promise<DashboardSummary> {
    const donations = await this.donationRepo.findAll(year);
    const expenses = await this.expenseRepo.findAll(year);

    const approvedDonations = donations.filter((d) => d.status === 'APPROVED');
    const approvedExpenses = expenses.filter((e) => e.status === 'APPROVED');

    const totalCollection = approvedDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalCollection - totalExpenses;

    const pendingDonationsCount = donations.filter((d) => d.status === 'PENDING').length;
    const pendingExpensesCount = expenses.filter((e) => e.status === 'PENDING').length;

    return {
      year,
      totalCollection,
      totalExpenses,
      netBalance,
      pendingDonationsCount,
      pendingExpensesCount,
      totalDonationsCount: donations.length,
      approvedDonationsCount: approvedDonations.length,
      rejectedDonationsCount: donations.filter((d) => d.status === 'REJECTED').length,
    };
  }

  async getCollectionSummary(year: number, fromDate?: string, toDate?: string): Promise<CollectionSummaryReport> {
    let donations = await this.donationRepo.findAll(year);
    donations = donations.filter((d) => d.status === 'APPROVED');

    if (fromDate) donations = donations.filter((d) => d.donationDate >= fromDate);
    if (toDate) donations = donations.filter((d) => d.donationDate <= toDate);

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    const paymentModeBreakdown = {
      CASH: 0,
      UPI: 0,
      BANK_TRANSFER: 0,
      CHEQUE: 0,
      CARD: 0,
      OTHER: 0,
    };

    const typeMap = new Map<string, { typeName: string; count: number; totalAmount: number }>();

    donations.forEach((d) => {
      paymentModeBreakdown[d.paymentMode] = (paymentModeBreakdown[d.paymentMode] || 0) + d.amount;

      const key = d.donationTypeId;
      const current = typeMap.get(key) || { typeName: d.donationTypeName, count: 0, totalAmount: 0 };
      typeMap.set(key, {
        typeName: d.donationTypeName,
        count: current.count + 1,
        totalAmount: current.totalAmount + d.amount,
      });
    });

    const donationTypeBreakdown = Array.from(typeMap.entries()).map(([typeId, val]) => ({
      typeId,
      typeName: val.typeName,
      count: val.count,
      totalAmount: val.totalAmount,
    }));

    return {
      year,
      totalDonationsCount: donations.length,
      totalAmount,
      paymentModeBreakdown,
      donationTypeBreakdown,
    };
  }

  async getExpenseSummary(year: number, fromDate?: string, toDate?: string): Promise<ExpenseSummaryReport> {
    let expenses = await this.expenseRepo.findAll(year);

    if (fromDate) expenses = expenses.filter((e) => e.date >= fromDate);
    if (toDate) expenses = expenses.filter((e) => e.date <= toDate);

    const approvedExpensesAmount = expenses
      .filter((e) => e.status === 'APPROVED')
      .reduce((sum, e) => sum + e.amount, 0);

    const pendingExpensesAmount = expenses
      .filter((e) => e.status === 'PENDING')
      .reduce((sum, e) => sum + e.amount, 0);

    const rejectedExpensesAmount = expenses
      .filter((e) => e.status === 'REJECTED')
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = new Map<string, { count: number; totalAmount: number }>();
    const paymentModeBreakdown: Record<string, number> = {};

    expenses
      .filter((e) => e.status === 'APPROVED')
      .forEach((e) => {
        const catKey = e.category;
        const catCurrent = categoryMap.get(catKey) || { count: 0, totalAmount: 0 };
        categoryMap.set(catKey, {
          count: catCurrent.count + 1,
          totalAmount: catCurrent.totalAmount + e.amount,
        });

        paymentModeBreakdown[e.paymentMode] = (paymentModeBreakdown[e.paymentMode] || 0) + e.amount;
      });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, val]) => ({
      category,
      count: val.count,
      totalAmount: val.totalAmount,
    }));

    return {
      year,
      totalExpensesCount: expenses.length,
      approvedExpensesAmount,
      pendingExpensesAmount,
      rejectedExpensesAmount,
      categoryBreakdown,
      paymentModeBreakdown,
    };
  }
}
