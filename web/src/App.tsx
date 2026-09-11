import React, { useState, useEffect } from 'react';
import { WebContainer, ScreenId } from './components/WebContainer';
import { WebLoginScreen } from './features/auth/WebLoginScreen';
import { WebDashboardScreen } from './features/dashboard/WebDashboardScreen';
import { DashboardChartsScreen } from './features/dashboard/DashboardChartsScreen';
import { WebDonationsScreen } from './features/donations/WebDonationsScreen';
import { WebExpensesScreen } from './features/expenses/WebExpensesScreen';
import { WebReportsScreen } from './features/reports/WebReportsScreen';
import { WebCategoryManagementScreen } from './features/categories/WebCategoryManagementScreen';
import { WebReceiptSettingsScreen } from './features/settings/WebReceiptSettingsScreen';
import { WebUserManagementScreen } from './features/users/WebUserManagementScreen';
import { WebAuditLogsScreen } from './features/audit/WebAuditLogsScreen';
import { QRCodeScannerModal } from './components/QRCodeScannerModal';
import { useAuthStore } from './store/authStore';
import { Donation } from './types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppContent: React.FC = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const getInitialScreen = (): ScreenId => {
    if (isAuthenticated) return 'dashboard';
    return 'login';
  };

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(getInitialScreen);

  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'login') {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  const getScreenConfig = (
    screen: ScreenId
  ): { title: string } => {
    switch (screen) {
      case 'login':
        return { title: 'Portal Sign In' };
      case 'dashboard':
        return { title: 'Executive Dashboard' };
      case 'dashboard-charts':
        return { title: 'Analytics & Visual Charts' };
      case 'donations-list':
        return { title: 'Donations Directory' };
      case 'expenses-list':
        return { title: 'Expenses Directory' };
      case 'reports-collection':
      case 'reports-financial':
        return { title: 'Reports & Financial Statements' };
      case 'donation-types':
        return { title: 'Donation Purpose Categories' };
      case 'receipt-settings':
        return { title: 'Receipt Customization & Layout Settings' };
      case 'users':
        return { title: 'User Account Management' };
      case 'audit-logs':
        return { title: 'System Audit Ledger' };
      default:
        return { title: 'Dashboard' };
    }
  };

  const config = getScreenConfig(currentScreen);

  const handleScanSuccess = (text: string) => {
    alert(`QR Code Scanned: ${text}`);
    setSelectedDonation({
      id: text.startsWith('REC-') || text.startsWith('DON-') ? text : 'DON-2026-000001',
      year: 2026,
      donorName: 'Scanned Donor',
      donationTypeName: 'GENERAL',
      amount: 5000,
      paymentMode: 'UPI',
      donationDate: new Date().toISOString().split('T')[0],
      status: 'APPROVED',
      createdBy: 'USR-ADMIN-001',
      createdByName: 'System Admin',
      createdAt: new Date().toISOString(),
      receiptNo: text.startsWith('REC-') ? text : 'REC-2026-000001',
      transactionRef: text,
      donationTypeId: 'TYP-001',
    });
    setCurrentScreen('donations-list');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <WebLoginScreen setCurrentScreen={setCurrentScreen} />;

      case 'dashboard':
        return (
          <WebDashboardScreen
            setCurrentScreen={(screen: ScreenId, item?: Donation) => {
              if (item) setSelectedDonation(item);
              setCurrentScreen(screen);
            }}
          />
        );

      case 'dashboard-charts':
        return <DashboardChartsScreen />;

      case 'donations-list':
        return (
          <WebDonationsScreen
            setCurrentScreen={(screen: ScreenId, item?: Donation) => {
              if (item) setSelectedDonation(item);
              setCurrentScreen(screen);
            }}
          />
        );

      case 'expenses-list':
        return <WebExpensesScreen setCurrentScreen={setCurrentScreen} />;

      case 'reports-collection':
      case 'reports-financial':
        return <WebReportsScreen />;

      case 'donation-types':
        return <WebCategoryManagementScreen />;

      case 'receipt-settings':
        return <WebReceiptSettingsScreen />;

      case 'users':
        return <WebUserManagementScreen />;

      case 'audit-logs':
        return <WebAuditLogsScreen />;

      default:
        return (
          <WebDashboardScreen
            setCurrentScreen={(screen: ScreenId, item?: Donation) => {
              if (item) setSelectedDonation(item);
              setCurrentScreen(screen);
            }}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <WebLoginScreen setCurrentScreen={setCurrentScreen} />;
  }

  return (
    <>
      <WebContainer
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        title={config.title}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      >
        {renderScreen()}
      </WebContainer>

      <QRCodeScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
