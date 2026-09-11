import React, { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '../../hooks/useDonationQueries';
import { useLanguageStore } from '../../store/languageStore';
import { Image, Upload, Trash2, CheckCircle2, Sparkles, SlidersHorizontal, Type } from '../../utils/icons';

export const WebReceiptSettingsScreen: React.FC = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const { t } = useLanguageStore();

  const [headerImage, setHeaderImage] = useState<string>('');
  const [footerImage, setFooterImage] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [orgAddress, setOrgAddress] = useState<string>('');
  const [orgMobile, setOrgMobile] = useState<string>('');
  const [orgEmail, setOrgEmail] = useState<string>('');
  const [receiptPrefix, setReceiptPrefix] = useState<string>('REC');
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      setHeaderImage(settings.headerImage || '');
      setFooterImage(settings.footerImage || '');
      setOrgName(settings.orgName || 'Shree Krishna Seva Trust');
      setOrgAddress(settings.orgAddress || '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001');
      setOrgMobile(settings.orgMobile || '+91 98765 43210');
      setOrgEmail(settings.orgEmail || 'info@krishnaseva.org');
      setReceiptPrefix(settings.receiptPrefix || 'REC');

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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('File size exceeds 3MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(
      {
        orgName,
        orgAddress,
        orgMobile,
        orgEmail,
        receiptPrefix,
        headerImage: headerImage || undefined,
        footerImage: footerImage || undefined,
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
      },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-indigo-300 animate-pulse">
        Loading receipt layout settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <SlidersHorizontal size={20} />
            </span>
            <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              {t('receiptSettings')}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Configure custom Header and Footer layout images and custom text overrides for receipt labels. All PDF receipts across the entire system are standard <strong className="text-indigo-300">22 × 11 cm</strong> (Header: 22×2.5 cm, Body: 22×6.5 cm, Footer: 22×2.0 cm).
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {updateSettingsMutation.isPending ? (
            <span>Saving...</span>
          ) : (
            <>
              <Sparkles size={16} />
              <span>{t('saveSettings')}</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-4 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>Receipt customization settings and image assets successfully saved to database & folder storage!</span>
        </div>
      )}

      {/* Grid: 2 Image Upload Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header Image Card (22 x 2.5 cm) */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Image size={18} className="text-indigo-400" />
                <span>Header Image (22 × 2.5 cm)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Displays at top of all 22 cm wide receipt PDFs
              </p>
            </div>
            {headerImage && (
              <button
                onClick={() => setHeaderImage('')}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Remove Custom Header"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {headerImage ? (
            <div className="space-y-2">
              <div className="w-full h-24 bg-slate-950 rounded-xl overflow-hidden border border-indigo-500/50 flex items-center justify-center p-1">
                <img
                  src={headerImage}
                  alt="Receipt Header Preview"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Custom header loaded from DB / storage folder
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors">
              <Upload size={28} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-xs font-bold text-slate-200">Upload Header Image</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG or JPG • Recommended size: 2200 × 250 px (22 × 2.5 cm)</p>
              <label className="mt-3 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md">
                <span>Browse File</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => handleImageUpload(e, setHeaderImage)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer Image Card (22 x 2.0 cm) */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Image size={18} className="text-purple-400" />
                <span>Footer Image (22 × 2.0 cm)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Displays at bottom of all 22 cm wide receipt PDFs
              </p>
            </div>
            {footerImage && (
              <button
                onClick={() => setFooterImage('')}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Remove Custom Footer"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {footerImage ? (
            <div className="space-y-2">
              <div className="w-full h-20 bg-slate-950 rounded-xl overflow-hidden border border-purple-500/50 flex items-center justify-center p-1">
                <img
                  src={footerImage}
                  alt="Receipt Footer Preview"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Custom footer loaded from DB / storage folder
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors">
              <Upload size={28} className="mx-auto text-purple-400 mb-2" />
              <p className="text-xs font-bold text-slate-200">Upload Footer Image</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG or JPG • Recommended size: 2200 × 200 px (22 × 2.0 cm)</p>
              <label className="mt-3 inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md">
                <span>Browse File</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => handleImageUpload(e, setFooterImage)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Organization Details Form */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white border-b border-slate-700 pb-3">
          Organization Metadata (Default Text Layout Fallback)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Receipt Number Prefix</label>
            <input
              type="text"
              value={receiptPrefix}
              onChange={(e) => setReceiptPrefix(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Mobile / Phone Contact</label>
            <input
              type="text"
              value={orgMobile}
              onChange={(e) => setOrgMobile(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Email Address</label>
            <input
              type="text"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Registered Address</label>
            <input
              type="text"
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Custom Receipt Text Labels (Side-by-side against standard English text) */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Type size={18} className="text-amber-400" />
              <span>Custom Receipt Text Labels (Side-by-Side Provision)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Specify custom text labels to display on the receipt side-by-side against the default English text. Left empty, the default English text will be printed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Receipt No Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">RECEIPT NO</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={receiptNoLabel}
              onChange={(e) => setReceiptNoLabel(e.target.value)}
              placeholder="e.g. RECEIPT NO / RASID KRA"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Date Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">DATE</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="e.g. DATE / DINANK"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Donor Name Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Donor Name:</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={donorNameLabel}
              onChange={(e) => setDonorNameLabel(e.target.value)}
              placeholder="e.g. Donor Name / Data Ka Naam:"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Purpose Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Purpose:</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={purposeLabel}
              onChange={(e) => setPurposeLabel(e.target.value)}
              placeholder="e.g. Purpose / Uddeshya:"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment Mode Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Payment Mode:</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={paymentModeLabel}
              onChange={(e) => setPaymentModeLabel(e.target.value)}
              placeholder="e.g. Payment Mode / Bhugtan:"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Amount Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Amount (Rs.):</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={amountLabel}
              onChange={(e) => setAmountLabel(e.target.value)}
              placeholder="e.g. Amount / Rashi (Rs.):"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Amount in Words Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Amount in Words:</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={amountInWordsLabel}
              onChange={(e) => setAmountInWordsLabel(e.target.value)}
              placeholder="e.g. Amount in Words / Akshari:"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Authorized Signatory Label */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300">Authorized Signatory</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Provision Text</label>
            <input
              type="text"
              value={signatoryLabel}
              onChange={(e) => setSignatoryLabel(e.target.value)}
              placeholder="e.g. Authorized Signatory / Adhikrut Swakshtari"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Thank You Notes */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-1 md:col-span-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-400">Default English Text:</span>
              <span className="font-black text-amber-300 truncate max-w-md">Thank you for your generous contribution and support!</span>
            </div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase">Custom Thank You Note</label>
            <input
              type="text"
              value={thanksNotes}
              onChange={(e) => setThanksNotes(e.target.value)}
              placeholder="Custom thank you message printed at receipt bottom..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Live Interactive 22 x 11 cm Proportional Preview */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>Live 22 × 11 cm Receipt PDF Preview</span>
          </h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
            Ratio 2:1 (22 cm × 11 cm)
          </span>
        </div>

        <div className="w-full overflow-x-auto p-2 bg-slate-950 rounded-xl flex justify-center">
          <div
            className="w-[660px] h-[330px] bg-white rounded-lg shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-400 relative text-slate-900"
            style={{ fontFamily: 'sans-serif' }}
          >
            {/* Header Portion: 22 x 2.5 cm -> 22.7% of total 11cm height */}
            <div className="h-[75px] w-full bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 border-b border-slate-300">
              {headerImage ? (
                <img src={headerImage} alt="Header" className="w-full h-full object-fill" />
              ) : (
                <div className="text-center text-white px-4">
                  <p className="font-extrabold text-sm uppercase tracking-wider">{orgName || 'SHREE KRISHNA SEVA TRUST'}</p>
                  <p className="text-[10px] text-slate-300">{orgAddress}</p>
                </div>
              )}
            </div>

            {/* Body Portion: 22 x 6.5 cm -> 59.1% of total 11cm height */}
            <div className="flex-1 w-full bg-slate-50 p-3 flex flex-col justify-between text-[11px] space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 border-b pb-1 border-slate-200">
                <span>{receiptNoLabel || 'RECEIPT NO'}: {receiptPrefix}-2026-000001</span>
                <span>{dateLabel || 'DATE'}: 2026-09-10</span>
                <span>{idLabel || 'ID'}: DON-2026-000001</span>
              </div>

              <div className="flex gap-2">
                <span className="font-bold text-slate-600">{donorNameLabel || 'Donor Name:'}</span>
                <span className="font-black text-slate-900">Ramesh Kumar Shah</span>
              </div>

              <div className="flex justify-between text-[10px]">
                <div>
                  <span className="font-bold text-slate-600">{purposeLabel || 'Purpose:'}</span>{' '}
                  <span className="font-bold text-slate-800">GANPATI FESTIVAL</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600">{paymentModeLabel || 'Payment Mode:'}</span>{' '}
                  <span className="font-bold text-slate-800">UPI (Ref: 9876543210)</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded p-1.5 flex justify-between items-center text-[10px]">
                <div>
                  <span className="font-bold text-emerald-800">{amountLabel || 'Amount (Rs.):'} </span>
                  <span className="font-black text-emerald-700 text-xs">Rs. 5,001.00</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-800">{amountInWordsLabel || 'Amount in Words:'} </span>
                  <span className="font-bold text-emerald-900">Rupees Five Thousand One Only</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-1">
                <span className="text-[9px] italic text-slate-500">{thanksNotes || 'Thank you for your generous support!'}</span>
                <div className="text-center border-t border-slate-400 pt-0.5 px-3">
                  <span className="text-[9px] font-bold block">{signatoryLabel || 'Authorized Signatory'}</span>
                </div>
              </div>
            </div>

            {/* Footer Portion: 22 x 2.0 cm -> 18.2% of total 11cm height */}
            <div className="h-[60px] w-full bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 border-t border-slate-300">
              {footerImage ? (
                <img src={footerImage} alt="Footer" className="w-full h-full object-fill" />
              ) : (
                <div className="text-center text-slate-300 px-4 text-[9px]">
                  <p className="font-bold text-white">{officialNotice || 'THIS IS AN OFFICIAL COMPUTER GENERATED DONATION RECEIPT'}</p>
                  <p className="text-slate-400">Subject to realization of payment. Thank you for supporting {orgName}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
