import React from 'react';
import { Donation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/StatusBadge';
import { whatsAppService } from '../../services/whatsAppService';
import { Heart, X, MessageCircle, FileText } from '../../utils/icons';

interface DonationDetailsModalProps {
  donation: Donation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({
  donation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !donation) return null;

  const handleWhatsApp = () => {
    whatsAppService.shareReceipt(donation);
  };

  const handleDownloadPdf = () => {
    window.open(`/api/${donation.year}/receipts/${donation.id}/pdf`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart size={20} color="#10b981" />
            <h3 className="text-base font-extrabold text-white">Donation Receipt Certificate</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400">
              {donation.receiptNo || donation.id}
            </span>
            <StatusBadge status={donation.status} />
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Donor Name
            </span>
            <p className="text-lg font-black text-white">{donation.donorName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Amount Received
              </span>
              <p className="text-xl font-black text-emerald-400">{formatCurrency(donation.amount)}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Payment Channel
              </span>
              <p className="text-sm font-extrabold text-slate-200">{donation.paymentMode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Category
              </span>
              <p className="font-bold text-indigo-300">{donation.donationTypeName || 'GENERAL'}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Donation Date
              </span>
              <p className="font-bold text-slate-300">{formatDate(donation.donationDate)}</p>
            </div>
          </div>

          {donation.transactionRef && (
            <div className="border-t border-slate-800/80 pt-3 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Transaction Reference / UTR
              </span>
              <p className="font-mono font-bold text-slate-300">{donation.transactionRef}</p>
            </div>
          )}

          {donation.rejectionReason && (
            <div className="border-t border-slate-800/80 pt-3 text-xs bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Rejection Audit Reason
              </span>
              <p className="font-medium text-rose-300 mt-0.5">{donation.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <FileText size={16} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <MessageCircle size={16} />
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
