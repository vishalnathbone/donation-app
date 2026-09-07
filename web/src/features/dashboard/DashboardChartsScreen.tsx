import React from 'react';
import { useDashboardSummary, useCollectionSummary } from '../../hooks/useDonationQueries';
import { useYearStore } from '../../store/yearStore';
import { formatCurrency } from '../../utils/formatters';
import { BarChart2, TrendingUp, TrendingDown, Wallet, CreditCard, Tag } from '../../utils/icons';

export const DashboardChartsScreen: React.FC = () => {
  const { selectedYear } = useYearStore();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: collectionReport, isLoading: isReportLoading } = useCollectionSummary();

  const totalCollection = summary?.totalCollection || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const netBalance = summary?.netBalance || 0;

  const paymentModes = Object.entries(collectionReport?.paymentModeBreakdown || {}).map(
    ([mode, data]: [string, any]) => {
      const amt = typeof data === 'object' && data !== null ? data.amount : Number(data);
      const pct = totalCollection > 0 ? ((amt / totalCollection) * 100).toFixed(1) : '0';
      return { mode, amount: amt, percentage: pct };
    }
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Financial Year {selectedYear} - {selectedYear + 1}
          </span>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            <BarChart2 size={24} color="#818cf8" />
            <span>Visual Analytics & Financial Charts</span>
          </h2>
        </div>
      </div>

      {/* Side-by-Side Visual Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Visual Container */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} color="#10b981" />
            <span>Financial Ratio (Collection vs Expenses)</span>
          </h3>

          <div className="space-y-4">
            {/* Total Collection Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400">Total Collection (APPROVED)</span>
                <span className="text-white">{formatCurrency(totalCollection)}</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Total Expenses Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-400">Total Expenses (APPROVED)</span>
                <span className="text-white">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${totalCollection > 0 ? Math.min(100, Math.round((totalExpenses / totalCollection) * 100)) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Net Available Balance Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-400">Net Available Balance</span>
                <span className="text-white">{formatCurrency(netBalance)}</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${totalCollection > 0 ? Math.max(0, Math.round((netBalance / totalCollection) * 100)) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Channels Distribution */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard size={20} color="#818cf8" />
            <span>Collection Channel Distribution</span>
          </h3>

          <div className="space-y-4">
            {paymentModes.map((pm) => (
              <div key={pm.mode} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-200 uppercase">{pm.mode}</span>
                  <span className="text-indigo-300">
                    {formatCurrency(pm.amount)} ({pm.percentage}%)
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${pm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
