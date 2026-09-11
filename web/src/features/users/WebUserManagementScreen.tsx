import React, { useState } from 'react';
import { useUsers, useCreateUser } from '../../hooks/useDonationQueries';
import { useYearStore } from '../../store/yearStore';
import { useLanguageStore } from '../../store/languageStore';
import { apiClient } from '../../services/apiClient';
import { StatusBadge } from '../../components/StatusBadge';
import { UserPlus, ShieldCheck, UserCheck, Eye, Power, Users as UsersIcon, Search } from '../../utils/icons';
import { useQueryClient } from '@tanstack/react-query';

export const WebUserManagementScreen: React.FC = () => {
  const { selectedYear } = useYearStore();
  const { t } = useLanguageStore();
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useUsers();
  const createUserMutation = useCreateUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'COLLECTOR' | 'VIEWER'>('COLLECTOR');
  const [mobile, setMobile] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createUserMutation.mutateAsync({ name, email, password, role, mobile });
      setName('');
      setEmail('');
      setPassword('');
      setMobile('');
      setShowAddModal(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await apiClient.patch(`/api/${selectedYear}/users/${userId}/status`, { status: nextStatus });
      queryClient.invalidateQueries({ queryKey: ['users', selectedYear] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const getRoleBadge = (r: string) => {
    if (r === 'ADMIN')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-black uppercase">
          <ShieldCheck size={12} />
          ADMIN
        </span>
      );
    if (r === 'COLLECTOR')
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-black uppercase">
          <UserCheck size={12} />
          COLLECTOR
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-black uppercase">
        <Eye size={12} />
        VIEWER
      </span>
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.mobile && u.mobile.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <UsersIcon size={24} color="#818cf8" />
            <span>{t('userManagement')}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage system administrators, donation collectors, and read-only financial auditors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
        >
          <UserPlus size={16} />
          <span>{t('addUser')}</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Authorized Users List ({users.length})</h3>

          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user name, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-indigo-300 animate-pulse">
            Loading user profiles...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">{u.id}</td>

                      <td className="py-3.5 px-4 font-bold text-slate-200">{u.name}</td>

                      <td className="py-3.5 px-4 text-slate-300">{u.email}</td>

                      <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>

                      <td className="py-3.5 px-4 text-slate-400">{u.mobile || '-'}</td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={u.status} />
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 mx-auto transition-all cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          <Power size={12} />
                          <span>{u.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Create Authorized User</h3>

            {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@donation.org"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ADMIN">ADMIN (Full Control)</option>
                  <option value="COLLECTOR">COLLECTOR (Collect & Share Receipts)</option>
                  <option value="VIEWER">VIEWER (Read-only Audit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit phone"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
