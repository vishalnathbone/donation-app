import {
  getDonationRepository,
  getReceiptRepository,
  getExpenseRepository,
  getAuditRepository,
  getDonationTypeRepository,
} from '../repositories';

export class IdGenerator {
  static async generateDonationId(year: number): Promise<string> {
    const repo = getDonationRepository();
    const donations = await repo.findAll(year);
    const count = donations.length + 1;
    const seq = count.toString().padStart(6, '0');
    return `DON-${year}-${seq}`;
  }

  static async generateReceiptNo(year: number): Promise<string> {
    const repo = getReceiptRepository();
    const receipts = await repo.findAll(year);
    const count = receipts.length + 1;
    const seq = count.toString().padStart(6, '0');
    return `REC-${year}-${seq}`;
  }

  static async generateExpenseId(year: number): Promise<string> {
    const repo = getExpenseRepository();
    const expenses = await repo.findAll(year);
    const count = expenses.length + 1;
    const seq = count.toString().padStart(6, '0');
    return `EXP-${year}-${seq}`;
  }

  static async generateAuditId(year: number): Promise<string> {
    const repo = getAuditRepository();
    const logs = await repo.findAll(year);
    const count = logs.length + 1;
    const seq = count.toString().padStart(6, '0');
    return `AUD-${year}-${seq}`;
  }

  static async generateDonationTypeId(year: number): Promise<string> {
    const repo = getDonationTypeRepository();
    const types = await repo.findAll(year);
    const count = types.length + 1;
    const seq = count.toString().padStart(3, '0');
    return `TYP-${year}-${seq}`;
  }
}
