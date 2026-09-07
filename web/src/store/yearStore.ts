import { create } from 'zustand';

interface YearState {
  selectedYear: number;
  availableYears: number[];
  setSelectedYear: (year: number) => void;
}

export const useYearStore = create<YearState>((set) => ({
  selectedYear: 2026,
  availableYears: [2026, 2027],
  setSelectedYear: (selectedYear) => set({ selectedYear }),
}));
