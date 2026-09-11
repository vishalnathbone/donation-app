import React, { useState } from 'react';
import {
  useCollectionSummary,
  useFinancialSummary,
  useAllDonationTypes,
} from '../../hooks/useDonationQueries';
import { useYearStore } from '../../store/yearStore';
import { formatCurrency } from '../../utils/formatters';
import {
  FileSpreadsheet,
  Download,
  BarChart3,
  CreditCard,
  Tag,
  TrendingUp,
  TrendingDown,
  Wallet,
} from '../../utils/icons';

import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

export const WebReportsScreen: React.FC = () => {
  const { selectedYear } = useYearStore();
  const { t } = useLanguageStore();
  const { data: collectionReport, isLoading: isCollLoading } = useCollectionSummary();
  const { data: financialReport, isLoading: isFinLoading } = useFinancialSummary();
  const { data: donationTypes = [] } = useAllDonationTypes();

  const [activeTab, setActiveTab] = useState<'COLLECTION' | 'FINANCIAL'>('COLLECTION');
  const [exportType, setExportType] = useState<string>('ALL');

  const handleExportExcel = () => {
    let baseUrl = `/api/${selectedYear}/export/full`;
    const params = new URLSearchParams();
    if (exportType && exportType !== 'ALL') {
      baseUrl = `/api/${selectedYear}/export/donations`;
      params.append('donationType', exportType);
    }
    const token = useAuthStore.getState().token;
    if (token) {
      params.append('token', token);
    }
    const queryString = params.toString();
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    window.open(finalUrl, '_blank');
  };

  const totalCollAmount = collectionReport?.totalAmount || 0;
  const totalCollCount = collectionReport?.totalDonationsCount || 0;

  const getModeColor = (mode: string) => {
    switch (mode.toUpperCase()) {
      case 'CASH':
        return 'bg-emerald-500 text-emerald-400';
      case 'UPI':
        return 'bg-blue-500 text-blue-400';
      case 'BANK_TRANSFER':
      case 'BANK':
        return 'bg-indigo-500 text-indigo-400';
      case 'CHEQUE':
        return 'bg-amber-500 text-amber-400';
      default:
        return 'bg-slate-500 text-slate-400';
    }
  };

  const paymentModes = Object.entries(collectionReport?.paymentModeBreakdown || {}).map(
    ([mode, data]: [string, any]) => {
      const amt = typeof data === 'object' && data !== null ? data.amount : Number(data);
      const pct = totalCollAmount > 0 ? ((amt / totalCollAmount) * 100).toFixed(1) : '0';
      return {
        mode,
        amount: amt,
        percentage: pct,
        colorClass: getModeColor(mode),
      };
    }
  );

  const netBalance = financialReport?.netBalance || 0;
  const approvedColl = financialReport?.totalCollection || 0;
  const approvedExp = financialReport?.totalExpenses || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            {t('financialYear')} {selectedYear} - {selectedYear + 1}
          </span>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            <BarChart3 size={24} color="#818cf8" />
            <span>{t('reportsExcel')}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Collection analytics, payment mode breakdowns, expense audits, and 5-sheet official Excel exports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Purpose Categories (Full 5+ Sheets)</option>
            {donationTypes.map((t) => (
              <option key={t.id} value={t.name}>
                Category: {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
          >
            <FileSpreadsheet size={18} />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('COLLECTION')}
          className={`pb-3 text-xs font-extrabold cursor-pointer border-b-2 transition-all ${
            activeTab === 'COLLECTION'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Collection Summary Report
        </button>
        <button
          onClick={() => setActiveTab('FINANCIAL')}
          className={`pb-3 text-xs font-extrabold cursor-pointer border-b-2 transition-all ${
            activeTab === 'FINANCIAL'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Financial Income & Expense Statement
        </button>
      </div>

      {activeTab === 'COLLECTION' ? (
        <div className="space-y-6">
          {/* Top Collection Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
                Total Approved Collection
              </span>
              <h3 className="text-3xl font-black text-white mt-2">
                {formatCurrency(totalCollAmount)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2">
                Total Donors Count: <strong className="text-slate-200">{totalCollCount}</strong>
              </p>
            </div>

            <div className="bg-slate-800/80 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">
                Payment Channel Diversity
              </span>
              <h3 className="text-3xl font-black text-white mt-2">
                {paymentModes.length} Channels
              </h3>
              <p className="text-[11px] text-slate-400 mt-2">
                UPI, Cash, Direct Bank Transfer, Cheques
              </p>
            </div>
          </div>

          {/* Payment Mode Breakdown Cards */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard size={18} color="#818cf8" />
              <span>Collection Breakdown by Payment Mode</span>
            </h3>

            {isCollLoading ? (
              <div className="py-6 text-center text-xs font-bold text-indigo-300 animate-pulse">
                Calculating payment statistics...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentModes.map((pm) => (
                  <div
                    key={pm.mode}
                    className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-200 uppercase">
                        {pm.mode}
                      </span>
                      <span className="text-xs font-bold text-indigo-400">{pm.percentage}%</span>
                    </div>

                    <p className="text-xl font-black text-white">{formatCurrency(pm.amount)}</p>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pm.colorClass.split(' ')[0]}`}
                        style={{ width: `${pm.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Financial Overview Formula Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} />
                <span>Total Collection (A)</span>
              </span>
              <h3 className="text-3xl font-black text-white mt-2">
                {formatCurrency(approvedColl)}
              </h3>
            </div>

            <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <TrendingDown size={16} />
                <span>Total Expenses (B)</span>
              </span>
              <h3 className="text-3xl font-black text-white mt-2">
                {formatCurrency(approvedExp)}
              </h3>
            </div>

            <div className="bg-slate-800/80 border border-indigo-500/40 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Wallet size={16} />
                <span>Net Available Balance (A - B)</span>
              </span>
              <h3 className="text-3xl font-black text-indigo-300 mt-2">
                {formatCurrency(netBalance)}
              </h3>
            </div>
          </div>

          <div className="bg-indigo-950/60 border border-indigo-700/50 rounded-2xl p-4 text-xs text-indigo-200 font-medium leading-relaxed">
            💡 <strong>Strict Accounting Compliance Rule:</strong> PENDING and REJECTED donations/expenses are strictly excluded from the Net Available Balance calculations. Official Excel reports include separate sheets for itemized validation.
          </div>
        </div>
      )}
    </div>
  );
};
