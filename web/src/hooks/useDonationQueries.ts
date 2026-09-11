import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useYearStore } from '../store/yearStore';
import {
  Donation,
  Expense,
  DonationType,
  DashboardSummary,
  CollectionSummaryReport,
  AuditLog,
  User,
  Settings,
} from '../types';

export const useSettings = () => {
  const { selectedYear } = useYearStore();
  return useQuery<Settings>({
    queryKey: ['settings', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/settings`);
      return res.data.data ?? res.data;
    },
  });
};

export const useUpdateSettings = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Settings>) => {
      const res = await apiClient.put(`/api/${selectedYear}/settings`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', selectedYear] });
    },
  });
};

export const useDashboardSummary = () => {
  const { selectedYear } = useYearStore();
  return useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/reports/dashboard`);
      return res.data.data ?? res.data;
    },
  });
};

export const useDonations = (filters?: Record<string, any>) => {
  const { selectedYear } = useYearStore();
  return useQuery<Donation[]>({
    queryKey: ['donations', selectedYear, filters],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/donations`, { params: filters });
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const useExpenses = (filters?: Record<string, any>) => {
  const { selectedYear } = useYearStore();
  return useQuery<Expense[]>({
    queryKey: ['expenses', selectedYear, filters],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/expenses`, { params: filters });
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const useAllDonationTypes = () => {
  const { selectedYear } = useYearStore();
  return useQuery<DonationType[]>({
    queryKey: ['donationTypes', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/donation-types/all`);
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const usePendingDonationTypes = () => {
  const { selectedYear } = useYearStore();
  return useQuery<DonationType[]>({
    queryKey: ['pendingDonationTypes', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/donation-types/pending`);
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const useCollectionSummary = (fromDate?: string, toDate?: string) => {
  const { selectedYear } = useYearStore();
  return useQuery<CollectionSummaryReport>({
    queryKey: ['collectionSummary', selectedYear, fromDate, toDate],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/reports/summary`, {
        params: { fromDate, toDate },
      });
      return res.data.data ?? res.data;
    },
  });
};

export const useFinancialSummary = () => {
  const { selectedYear } = useYearStore();
  return useQuery<DashboardSummary>({
    queryKey: ['financialSummary', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/reports/dashboard`);
      return res.data.data ?? res.data;
    },
  });
};

export const useUsers = () => {
  const { selectedYear } = useYearStore();
  return useQuery<User[]>({
    queryKey: ['users', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/users`);
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const useAuditLogs = () => {
  const { selectedYear } = useYearStore();
  return useQuery<AuditLog[]>({
    queryKey: ['auditLogs', selectedYear],
    queryFn: async () => {
      const res = await apiClient.get(`/api/${selectedYear}/audit-logs`);
      return Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    },
  });
};

// Mutations
export const useCreateDonation = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Donation>) => {
      const res = await apiClient.post(`/api/${selectedYear}/donations`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useApproveDonation = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/api/${selectedYear}/donations/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useRejectDonation = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      const res = await apiClient.post(`/api/${selectedYear}/donations/${id}/reject`, { rejectionReason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useCreateExpense = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Expense>) => {
      const res = await apiClient.post(`/api/${selectedYear}/expenses`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useApproveExpense = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/api/${selectedYear}/expenses/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useRejectExpense = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      const res = await apiClient.post(`/api/${selectedYear}/expenses/${id}/reject`, { rejectionReason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', selectedYear] });
    },
  });
};

export const useCreateDonationType = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const res = await apiClient.post(`/api/${selectedYear}/donation-types`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donationTypes', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['pendingDonationTypes', selectedYear] });
    },
  });
};

export const useApproveDonationType = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/api/${selectedYear}/donation-types/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donationTypes', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['pendingDonationTypes', selectedYear] });
    },
  });
};

export const useRejectDonationType = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      const res = await apiClient.post(`/api/${selectedYear}/donation-types/${id}/reject`, { rejectionReason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donationTypes', selectedYear] });
      queryClient.invalidateQueries({ queryKey: ['pendingDonationTypes', selectedYear] });
    },
  });
};

export const useCreateUser = () => {
  const { selectedYear } = useYearStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post(`/api/${selectedYear}/users`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', selectedYear] });
    },
  });
};
