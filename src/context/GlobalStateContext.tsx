import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { CaseId, Case, AccountNode, Transaction } from '../data/mockData';

export interface FilterState {
  accountHolder: string;
  phone: string;
  email: string;
  ip: string;
  dateRange: [number, number]; // Timestamps
  amountRange: [number, number];
  crimeType: string;
}

export interface PathTracerState {
  source: string;
  target: string;
  isActive: boolean;
}

export interface GlobalState {
  activeCases: Record<CaseId, boolean>;
  setActiveCase: (id: CaseId, active: boolean) => void;
  
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  
  pathTracer: PathTracerState;
  setPathTracer: (state: Partial<PathTracerState>) => void;
  
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  
  timelineDate: number; // Unix timestamp
  setTimelineDate: (date: number) => void;
  
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  searchQuery: string;
  setSearchQuery: (val: string) => void;

  autoInvestigateState: number; // 0=idle, 1-6=steps
  setAutoInvestigateState: (val: number) => void;

  toastMessage: { text: string; id: number } | null;
  setToastMessage: (msg: { text: string; id: number } | null) => void;

  expandedNodeId: string | null;
  setExpandedNodeId: (val: string | null) => void;

  customCasesData: Record<string, Case>;
  customAccountsData: Record<string, AccountNode>;
  customTransactionsData: Record<string, Transaction>;
  launchCase: (caseData: Case, accountsList: AccountNode[]) => void;
  deleteCase: (caseId: string) => void;
}

let defaultDateRange: [number, number] = [0, 0];
try {
  defaultDateRange = [
    new Date('2023-01-01').getTime(),
    new Date('2024-12-31').getTime()
  ];
} catch (e) {
  console.error("Date initialization error", e);
}

const defaultAmountRange: [number, number] = [0, 25000000]; // 0 to 2.5 Cr

const defaultFilters: FilterState = {
  accountHolder: '',
  phone: '',
  email: '',
  ip: '',
  dateRange: [...defaultDateRange],
  amountRange: [...defaultAmountRange],
  crimeType: 'All',
};

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [activeCases, setActiveCasesState] = useState<Record<CaseId, boolean>>({
    C1: true, C2: true, C3: true, C4: true
  });
  
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [pathTracer, setPathTracerState] = useState<PathTracerState>({ source: '', target: '', isActive: false });
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [timelineDate, setTimelineDate] = useState<number>(defaultDateRange[1]); // Default to end date
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // skip login for dev
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoInvestigateState, setAutoInvestigateState] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<{ text: string; id: number } | null>(null);
  
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [customCasesData, setCustomCasesData] = useState<Record<string, Case>>({});
  const [customAccountsData, setCustomAccountsData] = useState<Record<string, AccountNode>>({});
  const [customTransactionsData, setCustomTransactionsData] = useState<Record<string, Transaction>>({});

  const setActiveCase = (id: CaseId, active: boolean) => {
    setActiveCasesState(prev => ({ ...prev, [id]: active }));
  };

  const launchCase = (caseData: Case, accountsList: AccountNode[]) => {
    setCustomCasesData(prev => ({ ...prev, [caseData.id]: caseData }));
    setActiveCasesState(prev => ({ ...prev, [caseData.id]: true }));
    
    // Save new accounts
    const newAccs: Record<string, AccountNode> = {};
    accountsList.forEach(acc => {
       // if it doesn't already have this case, add it
       if (!acc.cases.includes(caseData.id)) {
           acc.cases = [...acc.cases, caseData.id];
       }
       // If it's a completely new account, we will add it to customAccountsData
       if (acc.id.startsWith('NEW-')) {
          acc.id = `ACC-${Math.floor(Math.random() * 90000) + 10000}`; // Generate real looking ID
          acc.cases = [caseData.id];
          newAccs[acc.id] = acc;
       }
    });
    setCustomAccountsData(prev => ({ ...prev, ...newAccs }));

    // Create random placeholder edges if multiple new accounts
    const newTxs: Record<string, Transaction> = {};
    const accIds = Object.keys(newAccs);
    if (accIds.length > 1) {
       for(let i=0; i < accIds.length - 1; i++) {
          const tId = `TX-${Date.now()}-${i}`;
          newTxs[tId] = {
             id: tId,
             source: accIds[i],
             target: accIds[i+1],
             amount: Math.floor(Math.random() * 5000000) + 500000,
             date: new Date().toISOString().split('T')[0],
             isSuspicious: true
          };
       }
    }
    setCustomTransactionsData(prev => ({ ...prev, ...newTxs }));
    
    // Notify cytoscape
    window.dispatchEvent(new CustomEvent('banktrace-add-case', { detail: { caseData, accountsList: Object.values(newAccs), transactionsList: Object.values(newTxs) } }));
  };

  const deleteCase = (caseId: string) => {
    setCustomCasesData(prev => {
      const next = { ...prev };
      delete next[caseId];
      return next;
    });
    setActiveCasesState(prev => {
      const next = { ...prev };
      delete next[caseId];
      return next;
    });
    
    // Notify cytoscape
    window.dispatchEvent(new CustomEvent('banktrace-delete-case', { detail: caseId }));
  };

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const setPathTracer = (state: Partial<PathTracerState>) => {
    setPathTracerState(prev => ({ ...prev, ...state }));
  };

  return (
    <GlobalStateContext.Provider value={{
      activeCases, setActiveCase,
      filters, setFilter, resetFilters,
      pathTracer, setPathTracer,
      selectedAccountId, setSelectedAccountId,
      timelineDate, setTimelineDate,
      isAuthenticated, setIsAuthenticated,
      searchQuery, setSearchQuery,
      autoInvestigateState, setAutoInvestigateState,
      toastMessage, setToastMessage,
      expandedNodeId, setExpandedNodeId,
      customCasesData, customAccountsData, customTransactionsData, 
      launchCase, deleteCase
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
