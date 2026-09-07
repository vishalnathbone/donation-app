import { Request, Response } from 'express';
import { AuditService } from '../services/auditService';

const auditService = new AuditService();

export class AuditController {
  static async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const logs = await auditService.getLogs(year);
      res.json({
        success: true,
        count: logs.length,
        data: logs,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
