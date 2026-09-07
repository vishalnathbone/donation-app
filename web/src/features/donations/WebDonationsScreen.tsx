import React, { useState } from 'react';
import { ScreenId } from '../../components/WebContainer';
import { useDonations, useApproveDonation, useRejectDonation } from '../../hooks/useDonationQueries';
import { useAuthStore } from '../../store/authStore';
import { Donation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/StatusBadge';
import { RejectionModal } from '../../components/RejectionModal';
import { AddDonationModal } from './AddDonationModal';
import { DonationDetailsModal } from './DonationDetailsModal';
import {
  Search,
  Plus,
  Eye,
  FileText,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Filter,
} from '../../utils/icons';
import { whatsAppService } from '../../services/whatsAppService';

interface WebDonationsScreenProps {
  setCurrentScreen: (screen: ScreenId, item?: Donation) => void;
}

export const WebDonationsScreen: React.FC<WebDonationsScreenProps> = () => {
  const { user } = useAuthStore();
  const { data: donations = [], isLoading } = useDonations();
  const approveMutation = useApproveDonation();
  const rejectMutation = useRejectDonation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('ALL');
  const [rejectingItem, setRejectingItem] = useState<Donation | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  const filteredDonations = donations.filter((item) => {
    const matchesSearch =
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.receiptNo && item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.transactionRef && item.transactionRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesMode = selectedPaymentMode === 'ALL' || item.paymentMode === selectedPaymentMode;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const handleApprove = (item: Donation) => {
    if (confirm(`Approve donation from ${item.donorName} for ${formatCurrency(item.amount)}?`)) {
      approveMutation.mutate(item.id);
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
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
            Donations Directory
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Search, filter, approve collections, generate official PDF receipts, and share via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Record New Donation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search donor name, receipt number, ID, or transaction ref..."
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

          <select
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Payment Modes</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>
      </div>

      {/* Main Desktop Data Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-indigo-300 animate-pulse">
            Loading donations directory...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Receipt / ID</th>
                  <th className="py-3 px-4">Donor Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold">
                      No matching donation records found.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                        {item.receiptNo || item.id}
                        {item.transactionRef && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Ref: {item.transactionRef}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {item.donorName}
                        {item.mobileNumber && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            📞 {item.mobileNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 uppercase">
                          {item.donationTypeName || 'GENERAL'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-300">
                        {item.paymentMode}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {formatDate(item.donationDate)}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                        {item.rejectionReason && (
                          <span className="block text-[10px] text-rose-400 mt-1">
                            Reason: {item.rejectionReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedDonation(item)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => window.open(`/api/${item.year}/receipts/${item.id}/pdf`, '_blank')}
                            className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 transition-colors cursor-pointer"
                            title="View PDF Receipt"
                          >
                            <FileText size={14} />
                          </button>

                          <button
                            onClick={() => whatsAppService.shareReceipt(item)}
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 transition-colors cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>

                          {isAdmin && item.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(item)}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                                title="Approve Donation"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                              <button
                                onClick={() => setRejectingItem(item)}
                                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                                title="Reject Donation"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddDonationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <DonationDetailsModal
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />

      {rejectingItem && (
        <RejectionModal
          isOpen={!!rejectingItem}
          onClose={() => setRejectingItem(null)}
          onConfirm={handleRejectConfirm}
          title={`Reject Donation ${rejectingItem.receiptNo || rejectingItem.id}`}
        />
      )}
    </div>
  );
};
