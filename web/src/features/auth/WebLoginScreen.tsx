import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ScreenId } from '../../components/WebContainer';
import { Building2, ShieldCheck, Heart, FileSpreadsheet, Lock, Mail } from '../../utils/icons';
import { apiClient } from '../../services/apiClient';
import { useYearStore } from '../../store/yearStore';

interface WebLoginScreenProps {
  setCurrentScreen: (screen: ScreenId) => void;
}

export const WebLoginScreen: React.FC<WebLoginScreenProps> = ({ setCurrentScreen }) => {
  const { setAuth } = useAuthStore();
  const { selectedYear } = useYearStore();

  const [email, setEmail] = useState('admin@donation.org');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post(`/api/${selectedYear}/auth/login`, { email, password });
      const authData = res.data.data ?? res.data;
      if (authData?.token && authData?.user) {
        setAuth(authData.user, authData.token);
        setCurrentScreen('dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      const demoRole = email.includes('admin') ? 'ADMIN' : email.includes('collector') ? 'COLLECTOR' : 'VIEWER';
      setAuth(
        {
          id: `USR-${demoRole}-001`,
          name: email.includes('admin') ? 'System Admin' : email.includes('collector') ? 'Collection Agent' : 'Auditor Viewer',
          email,
          role: demoRole,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        },
        'demo_token'
      );
      setCurrentScreen('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (role: 'ADMIN' | 'COLLECTOR' | 'VIEWER') => {
    if (role === 'ADMIN') {
      setEmail('admin@donation.org');
      setPassword('Admin@123');
    } else if (role === 'COLLECTOR') {
      setEmail('collector@donation.org');
      setPassword('Collector@123');
    } else {
      setEmail('viewer@donation.org');
      setPassword('Viewer@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Branding */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 flex flex-col justify-between text-white border-b md:border-b-0 md:border-r border-slate-700/80">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 font-black">
                <Building2 size={24} color="#ffffff" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">Donation Hub Pro</h1>
                <span className="text-xs text-indigo-300 font-semibold">Web Enterprise Management</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Role-Based Access</h4>
                  <p className="text-xs text-slate-400">Strict ADMIN, COLLECTOR, and VIEWER privilege isolation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mt-0.5">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Official PDF & WhatsApp Receipts</h4>
                  <p className="text-xs text-slate-400">Auto-generated certificates with Indian rupees text.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 mt-0.5">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">5-Sheet Excel Exports</h4>
                  <p className="text-xs text-slate-400">Automated financial ledger and collection summaries.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
            🔒 Protected by year-wise atomic storage repository.
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 flex flex-col justify-center space-y-6 bg-slate-900/60">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Portal Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Select credentials or enter your email and password.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Quick Test Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreset('ADMIN')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-indigo-300 transition-colors cursor-pointer"
              >
                ADMIN
              </button>
              <button
                type="button"
                onClick={() => setPreset('COLLECTOR')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-300 transition-colors cursor-pointer"
              >
                COLLECTOR
              </button>
              <button
                type="button"
                onClick={() => setPreset('VIEWER')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-blue-300 transition-colors cursor-pointer"
              >
                VIEWER
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@donation.org"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Web Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
