import React, { useState } from 'react';
import {
  useAllDonationTypes,
  usePendingDonationTypes,
  useCreateDonationType,
  useApproveDonationType,
  useRejectDonationType,
} from '../../hooks/useDonationQueries';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { StatusBadge } from '../../components/StatusBadge';
import { RejectionModal } from '../../components/RejectionModal';
import { Layers, Plus, CheckCircle2, XCircle, Tag, Search } from '../../utils/icons';

export const WebCategoryManagementScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeName, setTypeName] = useState('');
  const [typeDesc, setTypeDesc] = useState('');
  const [rejectingTypeId, setRejectingTypeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: allTypes = [], isLoading: isAllLoading } = useAllDonationTypes();
  const { data: pendingTypes = [] } = usePendingDonationTypes();

  const createMutation = useCreateDonationType();
  const approveMutation = useApproveDonationType();
  const rejectMutation = useRejectDonationType();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;
    try {
      await createMutation.mutateAsync({ name: typeName.trim(), description: typeDesc.trim() });
      setTypeName('');
      setTypeDesc('');
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve type');
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingTypeId) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectingTypeId, rejectionReason: reason });
      setRejectingTypeId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject category');
    }
  };

  const filteredTypes = allTypes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Tag size={24} color="#818cf8" />
            <span>{t('donationCategories')}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure purpose categories, manage approval workflows, and tag donor contributions.
          </p>
        </div>

        {user?.role !== 'VIEWER' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>{t('addCategory')}</span>
          </button>
        )}
      </div>

      {/* Pending Category Approvals Queue */}
      {user?.role === 'ADMIN' && pendingTypes && pendingTypes.length > 0 && (
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
            <Layers size={18} />
            <span>Pending Category Approvals ({pendingTypes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingTypes.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-inner"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                  <h4 className="text-sm font-black text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{t.description || 'No description provided'}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleApprove(t.id)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setRejectingTypeId(t.id)}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Categories Grid */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Active Categories Registry</h3>

          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {isAllLoading ? (
          <div className="py-8 text-center text-xs font-bold text-indigo-300 animate-pulse">
            Fetching configured categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTypes.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/80 border border-slate-700/60 hover:border-indigo-500/60 rounded-xl p-4 space-y-2 transition-all shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{t.id}</span>
                  <StatusBadge status={t.status} />
                </div>
                <h4 className="text-base font-extrabold text-white">{t.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {t.description || 'General purpose fund'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Add Category</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="e.g. BUILDING_FUND"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-bold uppercase placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={typeDesc}
                  onChange={(e) => setTypeDesc(e.target.value)}
                  placeholder="Category purpose details..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
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
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
                >
                  {createMutation.isPending ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RejectionModal
        isOpen={!!rejectingTypeId}
        onClose={() => setRejectingTypeId(null)}
        onConfirm={handleConfirmReject}
        title="Reject Category Request"
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
};
