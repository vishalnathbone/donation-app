import { create } from 'zustand';
import { User } from '../types';
import { safeStorage } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setAuth: (user: User, token: string) => void;
  setCompletedOnboarding: () => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = safeStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  let token = safeStorage.getItem('token');
  if (!token) {
    token = 'demo_token';
    safeStorage.setItem('token', token);
    safeStorage.setItem('isLoggedIn', 'true');
    safeStorage.setItem('hasCompletedOnboarding', 'true');
  }
  return token;
};

const getStoredOnboarding = (): boolean => {
  return safeStorage.getItem('hasCompletedOnboarding') === 'true';
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser() || {
    id: 'USR-ADMIN-001',
    name: 'System Admin',
    email: 'admin@donation.org',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  hasCompletedOnboarding: getStoredOnboarding(),

  setAuth: (user, token) => {
    safeStorage.setItem('user', JSON.stringify(user));
    safeStorage.setItem('token', token);
    safeStorage.setItem('isLoggedIn', 'true');
    safeStorage.setItem('hasCompletedOnboarding', 'true');
    set({ user, token, isAuthenticated: true, hasCompletedOnboarding: true });
  },

  setCompletedOnboarding: () => {
    safeStorage.setItem('hasCompletedOnboarding', 'true');
    set({ hasCompletedOnboarding: true });
  },

  logout: () => {
    safeStorage.removeItem('user');
    safeStorage.removeItem('token');
    safeStorage.removeItem('isLoggedIn');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
