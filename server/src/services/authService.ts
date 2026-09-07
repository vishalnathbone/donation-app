import bcrypt from 'bcryptjs';
import { getUserRepository } from '../repositories';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';
import { User } from '../models/types';

export class AuthService {
  private userRepo = getUserRepository();

  async login(year: number, email: string, password: string) {
    const user = await this.userRepo.findByEmail(year, email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('User account is inactive or disabled');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refreshToken(year: number, token: string) {
    const payload = verifyRefreshToken(token);
    const user = await this.userRepo.findById(year, payload.userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new Error('User account disabled or not found');
    }

    const newPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const newToken = generateToken(newPayload);
    return { token: newToken };
  }

  async getCurrentUser(year: number, userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.findById(year, userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
