import { create } from 'zustand';
import { Language } from '../types';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'DONATION HUB PRO',
    appTagline: 'Enterprise Donation Management & Audit Ledger',
    dashboard: 'Dashboard',
    donations: 'Donations',
    expenses: 'Expenses',
    reports: 'Reports',
    categories: 'Categories',
    users: 'User Accounts',
    auditLogs: 'Audit Trail',
    logout: 'Logout',
  },
  hi: {
    appName: 'डोनेशन हब प्रो',
    appTagline: 'पारदर्शिता के साथ दान प्रबंधन',
    dashboard: 'डैशबोर्ड',
    donations: 'दान संग्रह',
    expenses: 'खर्च',
    reports: 'रिपोर्ट',
    categories: 'श्रेणियां',
    users: 'उपयोगकर्ता',
    auditLogs: 'ऑडिट लॉग',
    logout: 'लॉग आउट',
  },
  gu: {
    appName: 'ડોનેશન હબ પ્રો',
    appTagline: 'પારદર્શિતા સાથે દાન સંચાલન',
    dashboard: 'ડેશબોર્ડ',
    donations: 'દાન સંગ્રહ',
    expenses: 'ખર્ચ',
    reports: 'અહેવાલો',
    categories: 'શ્રેણીઓ',
    users: 'વપરાશકર્તાઓ',
    auditLogs: 'ઓડિટ લોગ',
    logout: 'લોગ આઉટ',
  },
  mr: {
    appName: 'डोनेशन हब प्रो',
    appTagline: 'पारदर्शकतेसह देणगी व्यवस्थापन',
    dashboard: 'डॅशबोर्ड',
    donations: 'देणगी संग्रह',
    expenses: 'खर्च',
    reports: 'अहवाल',
    categories: 'वर्ग',
    users: 'वापरकर्ते',
    auditLogs: 'ऑडिट नोंदणी',
    logout: 'लॉग आउट',
  },
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  t: (key) => {
    const lang = get().language;
    return translations[lang]?.[key] || translations.en[key] || key;
  },
}));
