import React, { useState } from 'react';
import { useCreateDonation, useAllDonationTypes } from '../../hooks/useDonationQueries';
import { PaymentMode, DonationStatus } from '../../types';
import { Heart, X, IndianRupee } from '../../utils/icons';

interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddDonationModal: React.FC<AddDonationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: categories = [] } = useAllDonationTypes();
  const createMutation = useCreateDonation();

  const [donorName, setDonorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [donationTypeId, setDonationTypeId] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [status, setStatus] = useState<DonationStatus>('APPROVED');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !amount) return;

    const selectedCategory = categories.find((c) => c.id === donationTypeId);

    try {
      await createMutation.mutateAsync({
        donorName: donorName.trim(),
        mobileNumber: mobileNumber.trim() || undefined,
        amount: parseFloat(amount),
        donationTypeId: donationTypeId || (categories[0]?.id || 'TYP-001'),
        donationTypeName: selectedCategory?.name || 'GENERAL',
        paymentMode,
        transactionRef: transactionRef.trim() || undefined,
        notes: notes.trim() || undefined,
        status,
        donationDate: new Date().toISOString().split('T')[0],
      });

      setDonorName('');
      setMobileNumber('');
      setAmount('');
      setTransactionRef('');
      setNotes('');
      setStatus('APPROVED');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record donation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
            <Heart size={20} color="#10b981" />
            <span>Record New Donation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Donor Name *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit phone number"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Amount (₹) *</label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-3 text-emerald-400 pointer-events-none" />
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-xs text-emerald-400 font-black focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Donation Category</label>
              <select
                value={donationTypeId}
                onChange={(e) => setDonationTypeId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="">Select Purpose Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Payment Mode *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Donation Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DonationStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="APPROVED" className="text-emerald-400 bg-slate-900 font-bold">
                  APPROVED (Instant Official Receipt)
                </option>
                <option value="PENDING" className="text-amber-400 bg-slate-900 font-bold">
                  PENDING (Requires Admin Approval)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Transaction Ref / UTR</label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="UPI Ref / Cheque No. / Transaction ID"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Remarks / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or address info..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer"
            >
              {createMutation.isPending ? 'Saving...' : 'Save & Record Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
