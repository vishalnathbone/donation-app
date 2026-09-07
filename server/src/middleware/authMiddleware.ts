import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/auth';
import { UserRole } from '../models/types';
import { getUserRepository } from '../repositories';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { status?: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication token is missing' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Always fetch latest status from DB to ensure user has not been disabled
    const year = parseInt((req.params.year as string) || '2026', 10);
    const userRepo = getUserRepository();
    const currentUser = await userRepo.findById(year, req.user.userId);

    if (!currentUser || currentUser.status !== 'ACTIVE') {
      res.status(403).json({ success: false, message: 'User account is inactive or disabled' });
      return;
    }

    if (!allowedRoles.includes(currentUser.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${currentUser.role}' does not have required permissions.`,
      });
      return;
    }

    next();
  };
}
