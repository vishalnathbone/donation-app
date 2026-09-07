import React, { useState } from 'react';
import { ScreenId } from '../../components/WebContainer';
import { useExpenses, useApproveExpense, useRejectExpense } from '../../hooks/useDonationQueries';
import { useAuthStore } from '../../store/authStore';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/StatusBadge';
import { RejectionModal } from '../../components/RejectionModal';
import { AddExpenseModal } from './AddExpenseModal';
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Paperclip,
  DollarSign,
  Filter,
} from '../../utils/icons';

interface WebExpensesScreenProps {
  setCurrentScreen: (screen: ScreenId) => void;
}

export const WebExpensesScreen: React.FC<WebExpensesScreenProps> = () => {
  const { user } = useAuthStore();
  const { data: expenses = [], isLoading } = useExpenses();
  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [rejectingItem, setRejectingItem] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.reference && item.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (exp: Expense) => {
    if (confirm(`Approve expense "${exp.description}" for ${formatCurrency(exp.amount)}?`)) {
      approveMutation.mutate(exp.id);
    }
  };

  const handleRejectConfirm = (reason: string) => {
    if (rejectingItem) {
      rejectMutation.mutate({ id: rejectingItem.id, rejectionReason: reason });
      setRejectingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <DollarSign size={24} color="#f43f5e" />
            <span>Expenses Management</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Submit expense claims, review category budgets, attach receipts, and handle ADMIN approvals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Submit Expense Claim</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search expense title, reference, or expense ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-slate-400 hidden sm:block" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING Only</option>
            <option value="APPROVED">APPROVED Only</option>
            <option value="REJECTED">REJECTED Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-rose-300 animate-pulse">
            Loading expenses ledger...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Expense ID</th>
                  <th className="py-3 px-4">Title / Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-semibold">
                      No expense records found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-300">{exp.id}</td>

                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {exp.description}
                        {exp.attachment && (
                          <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800">
                            <Paperclip size={10} />
                            <span>Receipt</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 uppercase">
                          {exp.category || 'GENERAL'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">{exp.reference || '-'}</td>

                      <td className="py-3.5 px-4 font-black text-rose-400 text-sm">
                        {formatCurrency(exp.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">{formatDate(exp.date)}</td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">{exp.createdByName || exp.createdBy}</td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={exp.status} />
                        {exp.rejectionReason && (
                          <span className="block text-[10px] text-rose-400 mt-1">
                            Reason: {exp.rejectionReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isAdmin && exp.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApprove(exp)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Approve Expense"
                            >
                              <CheckCircle2 size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectingItem(exp)}
                              className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject Expense"
                            >
                              <XCircle size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {rejectingItem && (
        <RejectionModal
          isOpen={!!rejectingItem}
          onClose={() => setRejectingItem(null)}
          onConfirm={handleRejectConfirm}
          title={`Reject Expense "${rejectingItem.description}"`}
        />
      )}
    </div>
  );
};
