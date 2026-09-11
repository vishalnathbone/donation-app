import React, { useState } from 'react';
import { ScreenId } from '../../components/WebContainer';
import { useDashboardSummary, useDonations, useExpenses } from '../../hooks/useDonationQueries';
import { useYearStore } from '../../store/yearStore';
import { useLanguageStore } from '../../store/languageStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Heart,
  DollarSign,
  BarChart2,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Eye,
} from '../../utils/icons';
import { Donation } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { AddDonationModal } from '../donations/AddDonationModal';
import { AddExpenseModal } from '../expenses/AddExpenseModal';
import { DonationDetailsModal } from '../donations/DonationDetailsModal';

interface WebDashboardScreenProps {
  setCurrentScreen: (screen: ScreenId, item?: Donation) => void;
}

export const WebDashboardScreen: React.FC<WebDashboardScreenProps> = ({ setCurrentScreen }) => {
  const { selectedYear } = useYearStore();
  const { t } = useLanguageStore();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: donations = [] } = useDonations();
  const { data: expenses = [] } = useExpenses();

  const [isAddDonationOpen, setIsAddDonationOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const totalCollection = summary?.totalCollection || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const netBalance = summary?.netBalance || 0;
  const pendingDonations = summary?.pendingDonationsCount || 0;
  const pendingExpenses = summary?.pendingExpensesCount || 0;
  const monthCollection = summary?.thisMonthCollection || 0;
  const monthExpenses = summary?.thisMonthExpenses || 0;

  const recentDonations = Array.isArray(donations) ? donations.slice(0, 5) : [];
  const recentExpenses = Array.isArray(expenses) ? expenses.slice(0, 5) : [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 border border-indigo-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-indigo-300">
            Financial Year Overview ({selectedYear} - {selectedYear + 1})
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-0.5">
            Executive Financial Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time donation tracking, expense approvals, net balance formula, and official receipt compliance.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsAddDonationOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Record Donation</span>
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {isSummaryLoading && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center text-xs font-bold text-indigo-300 animate-pulse">
          Refreshing Financial Figures...
        </div>
      )}

      {/* 4 Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Collection */}
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp size={24} color="#10b981" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            {t('totalCollection')} (APPROVED)
          </span>
          <h3 className="text-2xl lg:text-3xl font-black text-white mt-2">
            {formatCurrency(totalCollection)}
          </h3>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-700/60">
            <span>This Month:</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(monthCollection)}</span>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-slate-800/90 border border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-500 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown size={24} color="#f43f5e" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
            {t('totalExpenses')} (APPROVED)
          </span>
          <h3 className="text-2xl lg:text-3xl font-black text-white mt-2">
            {formatCurrency(totalExpenses)}
          </h3>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-700/60">
            <span>This Month:</span>
            <span className="text-rose-400 font-bold">{formatCurrency(monthExpenses)}</span>
          </div>
        </div>

        {/* Card 3: Net Available Balance */}
        <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wallet size={24} color="#6366f1" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
            {t('netBalance')}
          </span>
          <h3 className="text-2xl lg:text-3xl font-black text-white mt-2">
            {formatCurrency(netBalance)}
          </h3>
          <p className="mt-3 text-[10px] font-medium text-slate-400 pt-3 border-t border-slate-700/60">
            Formula: Collections - Approved Expenses
          </p>
        </div>

        {/* Card 4: Pending Items */}
        <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500 transition-all">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock size={24} color="#f59e0b" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Pending Approvals
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-black text-amber-400">{pendingDonations} Don.</span>
            <span className="text-slate-500 font-bold">|</span>
            <span className="text-2xl font-black text-purple-400">{pendingExpenses} Exp.</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold pt-3 border-t border-slate-700/60">
            <button
              onClick={() => setCurrentScreen('donations-list')}
              className="text-amber-400 hover:underline cursor-pointer font-bold"
            >
              Review Pending →
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Shortcuts Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} color="#818cf8" />
              <h3 className="text-base font-bold text-white">Visual Analytics & Summary</h3>
            </div>
            <button
              onClick={() => setCurrentScreen('dashboard-charts')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-semibold block">Total Collections Count</span>
              <span className="text-base font-black text-emerald-400">{donations.length} Record(s)</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-semibold block">Total Expenses Count</span>
              <span className="text-base font-black text-rose-400">{expenses.length} Record(s)</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-semibold block">Approval Ratio</span>
              <span className="text-base font-black text-indigo-400">
                {donations.length > 0
                  ? Math.round(
                      (donations.filter((d) => d.status === 'APPROVED').length / donations.length) * 100
                    )
                  : 100}
                %
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 font-semibold block">Excel Reports</span>
              <span className="text-base font-black text-purple-400">5-Sheet XLSX</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">
              Need detailed breakdown reports with official receipts?
            </span>
            <button
              onClick={() => setCurrentScreen('reports-collection')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>Export Reports</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-slate-700/80 pb-2">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setIsAddDonationOpen(true)}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/70 border border-slate-700/50 text-left flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Heart size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white">Record New Donation</p>
                  <p className="text-[10px] text-slate-400">Add donor details & payment info</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/70 border border-slate-700/50 text-left flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white">Submit Expense Claim</p>
                  <p className="text-[10px] text-slate-400">Approve or Reject Submissions</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => setCurrentScreen('donation-types')}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/70 border border-slate-700/50 text-left flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <BarChart2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white">Donation Categories</p>
                  <p className="text-[10px] text-slate-400">General, Trust, Project Funds</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Side by Side Tables: Recent Donations & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart size={18} color="#10b981" />
              <span>Recent Donations</span>
            </h3>
            <button
              onClick={() => setCurrentScreen('donations-list')}
              className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              View All ({donations.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2">Donor Name</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-2">Mode</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {recentDonations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400">
                      No recent donations found.
                    </td>
                  </tr>
                ) : (
                  recentDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-200">
                        {item.donorName}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {item.receiptNo || item.id}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-extrabold text-emerald-400">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-300">
                        {item.paymentMode}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setSelectedDonation(item)}
                          className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Expenses Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign size={18} color="#f43f5e" />
              <span>Recent Expenses</span>
            </h3>
            <button
              onClick={() => setCurrentScreen('expenses-list')}
              className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              View All ({expenses.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2">Title / Category</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-2">Date</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {recentExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No recent expenses submitted.
                    </td>
                  </tr>
                ) : (
                  recentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-200">
                        {exp.description}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {exp.category || 'GENERAL'}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-extrabold text-rose-400">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-300">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={exp.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDonationModal
        isOpen={isAddDonationOpen}
        onClose={() => setIsAddDonationOpen(false)}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <DonationDetailsModal
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />
    </div>
  );
};
