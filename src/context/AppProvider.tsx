import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AllergenCategory } from '../utils/allergenDictionary';

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  productName: string;
  verdict: 'SAFE' | 'WARNING' | 'CRITICAL';
  prideTriggered: boolean;
  triggers: string[];
}

interface AppContextType {
  activeAllergens: AllergenCategory[];
  toggleAllergen: (category: AllergenCategory) => void;
  customAllergens: string[];
  addCustomAllergen: (allergen: string) => void;
  removeCustomAllergen: (allergen: string) => void;
  scanHistory: ScanHistoryItem[];
  addScanToHistory: (scan: Omit<ScanHistoryItem, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const MOCK_HISTORY: ScanHistoryItem[] = [
  { id: '1', timestamp: new Date(Date.now() - 10000000).toISOString(), productName: 'Artisan Bread', verdict: 'CRITICAL', prideTriggered: false, triggers: ['wheat', 'gluten'] },
  { id: '2', timestamp: new Date(Date.now() - 50000000).toISOString(), productName: 'Organic Trail Mix', verdict: 'WARNING', prideTriggered: false, triggers: ['may contain peanuts'] },
  { id: '3', timestamp: new Date(Date.now() - 90000000).toISOString(), productName: 'Safe Water', verdict: 'SAFE', prideTriggered: false, triggers: [] },
  { id: '4', timestamp: new Date(Date.now() - 120000000).toISOString(), productName: 'Imported Maize Snack', verdict: 'CRITICAL', prideTriggered: true, triggers: ['aflatoxin'] },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeAllergens, setActiveAllergens] = useState<AllergenCategory[]>(() => {
    const saved = localStorage.getItem('allerguard_allergens');
    return saved ? JSON.parse(saved) : [];
  });

  const [customAllergens, setCustomAllergens] = useState<string[]>(() => {
    const saved = localStorage.getItem('allerguard_custom_allergens');
    return saved ? JSON.parse(saved) : [];
  });

  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('allerguard_history');
    return saved ? JSON.parse(saved) : MOCK_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem('allerguard_allergens', JSON.stringify(activeAllergens));
  }, [activeAllergens]);

  useEffect(() => {
    localStorage.setItem('allerguard_custom_allergens', JSON.stringify(customAllergens));
  }, [customAllergens]);

  useEffect(() => {
    localStorage.setItem('allerguard_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const toggleAllergen = (category: AllergenCategory) => {
    setActiveAllergens(prev => 
      prev.includes(category) ? prev.filter(a => a !== category) : [...prev, category]
    );
  };

  const addCustomAllergen = (allergen: string) => {
    if (!customAllergens.includes(allergen)) {
      setCustomAllergens(prev => [...prev, allergen]);
    }
  };

  const removeCustomAllergen = (allergen: string) => {
    setCustomAllergens(prev => prev.filter(a => a !== allergen));
  };

  const addScanToHistory = (scan: Omit<ScanHistoryItem, 'id'>) => {
    const newItem: ScanHistoryItem = { ...scan, id: crypto.randomUUID() };
    setScanHistory(prev => [newItem, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      activeAllergens, toggleAllergen,
      customAllergens, addCustomAllergen, removeCustomAllergen,
      scanHistory, addScanToHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
