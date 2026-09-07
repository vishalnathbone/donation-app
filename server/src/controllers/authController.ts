import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt((req.body.year || req.query.year || '2026') as string, 10);
      const { email, password } = req.body;

      const result = await authService.login(year, email, password);
      res.json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Login failed' });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt((req.body.year || req.query.year || '2026') as string, 10);
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token is required' });
        return;
      }

      const result = await authService.refreshToken(year, refreshToken);
      res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message || 'Token refresh failed' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt((req.query.year || '2026') as string, 10);
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await authService.getCurrentUser(year, userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
