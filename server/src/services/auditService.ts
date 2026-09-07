import { getAuditRepository } from '../repositories';
import { AuditLog, AuditAction } from '../models/types';
import { IdGenerator } from '../utils/idGenerator';

export class AuditService {
  private auditRepo = getAuditRepository();

  async logAction(
    year: number,
    action: AuditAction,
    entityType: 'DONATION' | 'DONATION_TYPE' | 'EXPENSE' | 'RECEIPT' | 'USER',
    entityId: string,
    performedBy: string,
    performedByName?: string,
    oldValue?: Record<string, any>,
    newValue?: Record<string, any>
  ): Promise<AuditLog> {
    const id = await IdGenerator.generateAuditId(year);
    const log: AuditLog = {
      id,
      year,
      action,
      entityType,
      entityId,
      performedBy,
      performedByName,
      timestamp: new Date().toISOString(),
      oldValue,
      newValue,
    };
    return this.auditRepo.create(year, log);
  }

  async getLogs(year: number): Promise<AuditLog[]> {
    return this.auditRepo.findAll(year);
  }
}
