import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useYearStore } from '../store/yearStore';
import { useLanguageStore } from '../store/languageStore';
import { Language } from '../types';
import {
  LayoutDashboard,
  Heart,
  DollarSign,
  BarChart3,
  Globe,
  LogOut,
  QrCode,
  Bell,
  Users as UsersIcon,
  Tag,
  History,
  Building2,
  ChevronDown,
  BarChart2,
  Menu,
  X,
} from '../utils/icons';

export type ScreenId =
  | 'login'
  | 'dashboard'
  | 'dashboard-charts'
  | 'donations-list'
  | 'add-donation'
  | 'donation-details'
  | 'receipt-preview'
  | 'whatsapp-share'
  | 'expenses-list'
  | 'add-expense'
  | 'reports-collection'
  | 'reports-financial'
  | 'donation-types'
  | 'users'
  | 'audit-logs';

interface WebContainerProps {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  children: React.ReactNode;
  title?: string;
  onOpenQRScanner?: () => void;
}

export const WebContainer: React.FC<WebContainerProps> = ({
  currentScreen,
  setCurrentScreen,
  children,
  title = 'Executive Dashboard',
  onOpenQRScanner,
}) => {
  const { user, logout } = useAuthStore();
  const { selectedYear, setSelectedYear, availableYears } = useYearStore();
  const { language, setLanguage } = useLanguageStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isAuthScreen = currentScreen === 'login';

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roleRequired: null },
    { id: 'dashboard-charts', label: 'Analytics & Charts', icon: BarChart2, roleRequired: null },
    { id: 'donations-list', label: 'Donations Directory', icon: Heart, roleRequired: null },
    { id: 'expenses-list', label: 'Expenses Directory', icon: DollarSign, roleRequired: null },
    { id: 'reports-collection', label: 'Reports & Excel Export', icon: BarChart3, roleRequired: null },
    { id: 'donation-types', label: 'Donation Categories', icon: Tag, roleRequired: null },
    { id: 'users', label: 'User Management', icon: UsersIcon, roleRequired: 'ADMIN' },
    { id: 'audit-logs', label: 'System Audit Ledger', icon: History, roleRequired: 'ADMIN' },
  ];

  const userRole = user?.role || 'VIEWER';

  const handleNavClick = (id: ScreenId) => {
    setCurrentScreen(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 md:px-5 py-2.5 flex items-center justify-between shadow-md">
        {/* Left Branding & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          {!isAuthScreen && (
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black shrink-0">
              <Building2 size={18} color="#ffffff" />
            </div>
            <div>
              <h1 className="text-xs md:text-sm font-extrabold text-white tracking-tight leading-none">
                Donation Hub Pro
              </h1>
              <span className="hidden sm:block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Web Enterprise Portal
              </span>
            </div>
          </div>
        </div>

        {/* Center / Title Badge (Hidden on mobile) */}
        {!isAuthScreen && (
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-4 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">{title}</span>
          </div>
        )}

        {/* Right Header Controls */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Financial Year Selector */}
          <div className="relative inline-flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 md:px-3 py-1.5 text-xs font-bold text-slate-200">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer pr-3 appearance-none text-[11px] md:text-xs"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-slate-800 text-slate-200">
                  FY {y}-{y + 1}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="text-slate-400 pointer-events-none absolute right-1.5" />
          </div>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-200">
            <Globe size={13} className="mr-1 text-indigo-400 hidden sm:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer pr-2 appearance-none text-[11px] md:text-xs"
            >
              <option value="en" className="bg-slate-800">EN</option>
              <option value="hi" className="bg-slate-800">HI</option>
              <option value="gu" className="bg-slate-800">GU</option>
              <option value="mr" className="bg-slate-800">MR</option>
            </select>
          </div>

          {/* QR Scanner Trigger */}
          {onOpenQRScanner && !isAuthScreen && (
            <button
              onClick={onOpenQRScanner}
              className="p-1.5 md:p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
              title="Scan QR Code"
            >
              <QrCode size={16} />
            </button>
          )}

          {/* User Badge & Logout */}
          {user && !isAuthScreen && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-700 border border-indigo-500/50 flex items-center justify-center font-extrabold text-xs text-indigo-300">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">{user.name}</p>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} color="currentColor" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Body Workspace Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Mobile Slide-Over Backdrop */}
        {isSidebarOpen && !isAuthScreen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40"
          />
        )}

        {/* Sidebar Navigation */}
        {!isAuthScreen && (
          <aside
            className={`
              fixed md:static inset-y-0 left-0 z-50 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 shrink-0
              ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
              ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'}
            `}
          >
            {/* Mobile Header in Drawer */}
            <div className="md:hidden p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black text-white">Menu Navigation</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Menu Items */}
            <div className="p-3 space-y-1 overflow-y-auto flex-1">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider hidden md:block">
                {!isSidebarCollapsed && 'Navigation'}
              </div>

              {navigationItems.map((item) => {
                if (item.roleRequired && userRole !== item.roleRequired) return null;

                const isActive = currentScreen === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ScreenId)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                    title={item.label}
                  >
                    <IconComponent
                      size={18}
                      color={isActive ? '#ffffff' : '#94a3b8'}
                    />
                    <span className={`truncate ${isSidebarCollapsed ? 'md:hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Org Info */}
            <div className={`p-4 border-t border-slate-900 bg-slate-950/80 text-slate-400 text-[11px] space-y-1 ${isSidebarCollapsed ? 'md:hidden' : 'block'}`}>
              <p className="font-semibold text-slate-300">Donation Hub Pro v1.0</p>
              <p className="text-[10px]">Connected to Express API</p>
            </div>
          </aside>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-900 p-3 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-5 md:space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
