import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const users = await userService.getAllUsers(year);
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const adminUserId = req.user!.userId;
      const user = await userService.createUser(year, req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const { id } = req.params;
      const { status } = req.body; // 'ACTIVE' or 'DISABLED'
      const adminUserId = req.user!.userId;

      const user = await userService.updateUserStatus(year, id, status, adminUserId);
      res.json({
        success: true,
        message: `User status updated to ${status}`,
        data: user,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
