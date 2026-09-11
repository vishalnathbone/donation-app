import React, { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '../../hooks/useDonationQueries';
import { Settings } from '../../types';
import { X, Upload, Trash2, CheckCircle2, Image as ImageIcon, Sparkles, Type } from '../../utils/icons';

interface ReceiptSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptSettingsModal: React.FC<ReceiptSettingsModalProps> = ({ isOpen, onClose }) => {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [orgName, setOrgName] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgMobile, setOrgMobile] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [headerImage, setHeaderImage] = useState<string | undefined>('');
  const [footerImage, setFooterImage] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Custom Receipt Text Labels
  const [receiptNoLabel, setReceiptNoLabel] = useState<string>('');
  const [dateLabel, setDateLabel] = useState<string>('');
  const [idLabel, setIdLabel] = useState<string>('');
  const [donorNameLabel, setDonorNameLabel] = useState<string>('');
  const [purposeLabel, setPurposeLabel] = useState<string>('');
  const [paymentModeLabel, setPaymentModeLabel] = useState<string>('');
  const [refLabel, setRefLabel] = useState<string>('');
  const [amountLabel, setAmountLabel] = useState<string>('');
  const [amountInWordsLabel, setAmountInWordsLabel] = useState<string>('');
  const [signatoryLabel, setSignatoryLabel] = useState<string>('');
  const [thanksNotes, setThanksNotes] = useState<string>('');
  const [officialNotice, setOfficialNotice] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setOrgName(settings.orgName || '');
      setOrgAddress(settings.orgAddress || '');
      setOrgMobile(settings.orgMobile || '');
      setOrgEmail(settings.orgEmail || '');
      setHeaderImage(settings.headerImage || '');
      setFooterImage(settings.footerImage || '');

      setReceiptNoLabel(settings.receiptNoLabel || '');
      setDateLabel(settings.dateLabel || '');
      setIdLabel(settings.idLabel || '');
      setDonorNameLabel(settings.donorNameLabel || '');
      setPurposeLabel(settings.purposeLabel || '');
      setPaymentModeLabel(settings.paymentModeLabel || '');
      setRefLabel(settings.refLabel || '');
      setAmountLabel(settings.amountLabel || '');
      setAmountInWordsLabel(settings.amountInWordsLabel || '');
      setSignatoryLabel(settings.signatoryLabel || '');
      setThanksNotes(settings.thanksNotes || '');
      setOfficialNotice(settings.officialNotice || '');
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'header' | 'footer'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Image size must be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'header') setHeaderImage(result);
      else setFooterImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      await updateMutation.mutateAsync({
        orgName,
        orgAddress,
        orgMobile,
        orgEmail,
        headerImage,
        footerImage,
        receiptNoLabel,
        dateLabel,
        idLabel,
        donorNameLabel,
        purposeLabel,
        paymentModeLabel,
        refLabel,
        amountLabel,
        amountInWordsLabel,
        signatoryLabel,
        thanksNotes,
        officialNotice,
      });
      setSuccessMsg('Receipt Header, Footer & Custom Text Label settings saved successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update settings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ImageIcon size={22} color="#818cf8" />
              <span>Receipt Customization & Layout Settings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Receipt Size: <strong className="text-indigo-400 font-extrabold">22.0 × 11.0 cm</strong> | Header: 2.5cm | Body: 6.5cm | Footer: 2.0cm
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dimension Specification Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Receipt Size</span>
            <span className="text-sm font-black text-emerald-400">22.0 × 11.0 cm</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Header Area</span>
            <span className="text-sm font-black text-indigo-400">22.0 × 2.5 cm</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Body (Content) Area</span>
            <span className="text-sm font-black text-blue-400">22.0 × 6.5 cm</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Footer Area</span>
            <span className="text-sm font-black text-purple-400">22.0 × 2.0 cm</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header Image Upload (22 x 2.5 cm) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black text-indigo-300 uppercase tracking-wider">
                  Header Image Upload (22.0 × 2.5 cm)
                </label>
                <p className="text-[11px] text-slate-400">
                  Upload custom organization banner or logo header for top receipt section.
                </p>
              </div>

              {headerImage && (
                <button
                  type="button"
                  onClick={() => setHeaderImage('')}
                  className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-900"
                >
                  <Trash2 size={12} />
                  <span>Remove Header</span>
                </button>
              )}
            </div>

            {headerImage ? (
              <div className="relative rounded-xl overflow-hidden border border-indigo-500/50 bg-slate-950 h-20 flex items-center justify-center">
                <img src={headerImage} alt="Header Banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/60 cursor-pointer transition-colors">
                <Upload size={20} className="text-indigo-400 mb-1" />
                <span className="text-xs font-bold text-slate-300">Click to Select Header Image</span>
                <span className="text-[10px] text-slate-500">Recommended Aspect Ratio: 22 : 2.5 (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'header')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Footer Image Upload (22 x 2.0 cm) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-black text-purple-300 uppercase tracking-wider">
                  Footer Image Upload (22.0 × 2.0 cm)
                </label>
                <p className="text-[11px] text-slate-400">
                  Upload custom footer banner or seal for bottom receipt section.
                </p>
              </div>

              {footerImage && (
                <button
                  type="button"
                  onClick={() => setFooterImage('')}
                  className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-900"
                >
                  <Trash2 size={12} />
                  <span>Remove Footer</span>
                </button>
              )}
            </div>

            {footerImage ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/50 bg-slate-950 h-16 flex items-center justify-center">
                <img src={footerImage} alt="Footer Banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-900/60 cursor-pointer transition-colors">
                <Upload size={20} className="text-purple-400 mb-1" />
                <span className="text-xs font-bold text-slate-300">Click to Select Footer Image</span>
                <span className="text-[10px] text-slate-500">Recommended Aspect Ratio: 22 : 2.0 (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'footer')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Organization Details Fallback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Shree Temple Charitable Trust"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
              <input
                type="text"
                value={orgMobile}
                onChange={(e) => setOrgMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Organization Address</label>
              <input
                type="text"
                value={orgAddress}
                onChange={(e) => setOrgAddress(e.target.value)}
                placeholder="Full registered office address"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Custom Receipt Text Labels Section */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Type size={16} />
              <span>Custom Receipt Text Labels (Side-by-Side Provision)</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Provide custom text labels side-by-side against standard English labels. Left blank, default English labels are printed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">RECEIPT NO</span>
                </div>
                <input
                  type="text"
                  value={receiptNoLabel}
                  onChange={(e) => setReceiptNoLabel(e.target.value)}
                  placeholder="Custom label e.g. RECEIPT NO / RASID KRA"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">DATE</span>
                </div>
                <input
                  type="text"
                  value={dateLabel}
                  onChange={(e) => setDateLabel(e.target.value)}
                  placeholder="Custom label e.g. DATE / DINANK"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Donor Name:</span>
                </div>
                <input
                  type="text"
                  value={donorNameLabel}
                  onChange={(e) => setDonorNameLabel(e.target.value)}
                  placeholder="Custom label e.g. Donor Name / Data Ka Naam:"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Purpose:</span>
                </div>
                <input
                  type="text"
                  value={purposeLabel}
                  onChange={(e) => setPurposeLabel(e.target.value)}
                  placeholder="Custom label e.g. Purpose / Uddeshya:"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Payment Mode:</span>
                </div>
                <input
                  type="text"
                  value={paymentModeLabel}
                  onChange={(e) => setPaymentModeLabel(e.target.value)}
                  placeholder="Custom label e.g. Payment Mode / Bhugtan:"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Amount (Rs.):</span>
                </div>
                <input
                  type="text"
                  value={amountLabel}
                  onChange={(e) => setAmountLabel(e.target.value)}
                  placeholder="Custom label e.g. Amount / Rashi (Rs.):"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Amount in Words:</span>
                </div>
                <input
                  type="text"
                  value={amountInWordsLabel}
                  onChange={(e) => setAmountInWordsLabel(e.target.value)}
                  placeholder="Custom label e.g. Amount in Words / Akshari:"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-bold">Default English:</span>
                  <span className="text-amber-300 font-bold">Authorized Signatory</span>
                </div>
                <input
                  type="text"
                  value={signatoryLabel}
                  onChange={(e) => setSignatoryLabel(e.target.value)}
                  placeholder="Custom label e.g. Authorized Signatory / Swakshtari"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Live Receipt Proportional Preview */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Live 22 × 11 cm Proportional Receipt Preview</span>
            </span>

            <div className="w-full bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-inner flex flex-col font-sans" style={{ aspectRatio: '22 / 11' }}>
              {/* Header 2.5cm */}
              <div className="h-[22.7%] bg-slate-800 flex items-center justify-center overflow-hidden relative">
                {headerImage ? (
                  <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <h4 className="text-xs sm:text-sm font-black text-white uppercase">{orgName || 'ORGANIZATION NAME'}</h4>
                    <p className="text-[10px] text-slate-400">{orgAddress || 'Address details...'}</p>
                  </div>
                )}
              </div>

              {/* Body 6.5cm */}
              <div className="h-[59.1%] bg-slate-900 p-3 sm:p-4 flex flex-col justify-between border-y border-slate-800 text-white">
                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-indigo-400">
                  <span>{receiptNoLabel || 'RECEIPT NO'}: REC-2026-000001</span>
                  <span>{dateLabel || 'DATE'}: 2026-09-09</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-300">
                    {donorNameLabel || 'Donor Name:'} <strong className="text-white font-extrabold">Shree Rajesh Sharma</strong>
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 flex gap-4">
                    <span>{purposeLabel || 'Purpose:'} GENERAL</span>
                    <span>{paymentModeLabel || 'Payment Mode:'} UPI</span>
                  </div>
                </div>

                <div className="bg-emerald-950/80 border border-emerald-800/80 p-1.5 sm:p-2 rounded-xl flex items-center justify-between text-[10px] sm:text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold">{amountLabel || 'Amount (Rs.):'} </span>
                    <strong className="text-emerald-300 font-black text-xs sm:text-sm">Rs. 5,000.00</strong>
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-emerald-200 font-bold truncate max-w-[55%]">
                    {amountInWordsLabel || 'Amount in Words:'} Five Thousand Rupees Only
                  </div>
                </div>
              </div>

              {/* Footer 2.0cm */}
              <div className="h-[18.2%] bg-slate-800 flex items-center justify-center overflow-hidden relative">
                {footerImage ? (
                  <img src={footerImage} alt="Footer" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {officialNotice || 'THIS IS AN OFFICIAL COMPUTER GENERATED DONATION RECEIPT'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Settings & Update PDF Layout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
