export type CaseId = string;

export interface Case {
  id: CaseId;
  name: string;
  color: string;
}

export const activeCases: Record<CaseId, Case> = {
  C1: { id: 'C1', name: 'Operation Hawala', color: '#00F5FF' },
  C2: { id: 'C2', name: 'Operation Shell', color: '#FFD700' },
  C3: { id: 'C3', name: 'Operation Crypto', color: '#9B5DE5' },
  C4: { id: 'C4', name: 'Operation Ghost', color: '#FF3B3B' },
};

export interface AccountNode {
  id: string; // ACC001, etc.
  name: string;
  bank: string;
  balance: number;
  phone: string;
  email: string;
  ip: string;
  cases: CaseId[]; // Can belong to multiple
  isCircular?: boolean;
  isInterCase?: boolean;
  isVpn?: boolean;
  vpnNote?: string;
  sharedPhoneWith?: string[];
  riskScore: number;
}

export const accounts: AccountNode[] = [
  { id: 'ACC001', name: 'Rajesh Kumar Sharma', bank: 'SBI', balance: 1240000, phone: '9876543210', email: 'rajesh.sharma@gmail.com', ip: '103.45.67.89', cases: ['C1'] , riskScore: 19 },
  { id: 'ACC002', name: 'Priya Nair', bank: 'HDFC', balance: 875000, phone: '9845123456', email: 'priya.nair@yahoo.com', ip: '106.78.23.45', cases: ['C1'] , riskScore: 52 },
  { id: 'ACC003', name: 'Mohammad Iqbal Sheikh', bank: 'Axis', balance: 4520000, phone: '9912345678', email: 'm.iqbal@hotmail.com', ip: '49.36.89.12', cases: ['C1'], isCircular: true , riskScore: 57 },
  { id: 'ACC004', name: 'Sunita Devi Pandey', bank: 'PNB', balance: 315000, phone: '9823456789', email: 'sunita.pandey@gmail.com', ip: '117.96.45.23', cases: ['C1'] , riskScore: 44 },
  { id: 'ACC005', name: 'Vikram Singh Rathore', bank: 'ICICI', balance: 6780000, phone: '9934567890', email: 'vikram.rathore@gmail.com', ip: '103.21.56.78', cases: ['C2'] , riskScore: 49 },
  { id: 'ACC006', name: 'Anita Menon', bank: 'Kotak', balance: 2240000, phone: '9745678901', email: 'anita.menon@gmail.com', ip: '106.54.32.11', cases: ['C2'] , riskScore: 34 },
  { id: 'ACC007', name: 'Deepak Joshi Agarwal', bank: 'Yes Bank', balance: 12400000, phone: '9856789012', email: 'deepak.joshi@gmail.com', ip: '49.204.78.34', cases: ['C1', 'C2'], isInterCase: true , riskScore: 32 },
  { id: 'ACC008', name: 'Kavitha Subramaniam', bank: 'Canara', balance: 1890000, phone: '9767890123', email: 'kavitha.s@gmail.com', ip: '117.45.67.89', cases: ['C1'], isCircular: true , riskScore: 48 },
  { id: 'ACC009', name: 'Ravi Shankar Gupta', bank: 'BOI', balance: 930000, phone: '9878901234', email: 'ravi.gupta@gmail.com', ip: '103.67.89.12', cases: ['C2'], sharedPhoneWith: ['ACC021'] , riskScore: 45 },
  { id: 'ACC010', name: 'Meera Krishnamurthy', bank: 'UCO', balance: 560000, phone: '9989012345', email: 'meera.k@hotmail.com', ip: '106.23.45.67', cases: ['C2'], sharedPhoneWith: ['ACC020'] , riskScore: 37 },
  { id: 'ACC011', name: 'Arjun Malhotra', bank: 'Federal', balance: 8870000, phone: '9890123456', email: 'arjun.malhotra@gmail.com', ip: '49.36.12.78', cases: ['C3'] , riskScore: 29 },
  { id: 'ACC012', name: 'Fatima Begum Siddiqui', bank: 'HDFC', balance: 24000000, phone: '9901234567', email: 'fatima.siddiqui@gmail.com', ip: '117.78.90.23', cases: ['C1', 'C2', 'C3', 'C4'], isInterCase: true , riskScore: 42 },
  { id: 'ACC013', name: 'Suresh Babu Reddy', bank: 'SBI', balance: 1420000, phone: '9812345678', email: 'suresh.reddy@gmail.com', ip: '103.89.12.45', cases: ['C3'] , riskScore: 34 },
  { id: 'ACC014', name: 'Pooja Sharma Verma', bank: 'Axis', balance: 3150000, phone: '9923456789', email: 'pooja.verma@gmail.com', ip: '106.12.34.56', cases: ['C3'] , riskScore: 52 },
  { id: 'ACC015', name: 'Naresh Kumar Yadav', bank: 'PNB', balance: 2780000, phone: '9734567890', email: 'naresh.yadav@gmail.com', ip: '49.204.56.89', cases: ['C1'], isCircular: true , riskScore: 74 },
  { id: 'ACC016', name: 'Latha Venkataraman', bank: 'ICICI', balance: 1940000, phone: '9845678901', email: 'latha.v@gmail.com', ip: '117.23.45.67', cases: ['C3'] , riskScore: 25 },
  { id: 'ACC017', name: 'Arun Chandrasekhar', bank: 'Kotak', balance: 5230000, phone: '9956789012', email: 'arun.cs@gmail.com', ip: '103.45.23.89', cases: ['C4'] , riskScore: 36 },
  { id: 'ACC018', name: 'Rekha Pillai Nambiar', bank: 'Canara', balance: 1170000, phone: '9867890123', email: 'rekha.pillai@gmail.com', ip: '106.89.67.34', cases: ['C4'] , riskScore: 21 },
  { id: 'ACC019', name: 'Zaid Hussain Khan', bank: 'Yes Bank', balance: 7890000, phone: '9778901234', email: 'zaid.khan@protonmail.com', ip: '185.220.101.45', cases: ['C4'], isVpn: true, vpnNote: 'ProtonVPN exit node' , riskScore: 73 },
  { id: 'ACC020', name: 'Geetha Lakshmi Iyer', bank: 'BOI', balance: 680000, phone: '9989012345', email: 'geetha.iyer@gmail.com', ip: '49.36.78.12', cases: ['C4'], sharedPhoneWith: ['ACC010'] , riskScore: 11 },
  { id: 'ACC021', name: 'Santosh Kumar Tiwari', bank: 'UCO', balance: 2310000, phone: '9878901234', email: 'santosh.tiwari@gmail.com', ip: '117.56.34.89', cases: ['C4'], sharedPhoneWith: ['ACC009'] , riskScore: 19 },
  { id: 'ACC022', name: 'Hema Malini Desai', bank: 'Federal', balance: 4460000, phone: '9901234567', email: 'hema.desai@gmail.com', ip: '103.23.67.45', cases: ['C2'] , riskScore: 45 },
  { id: 'ACC023', name: 'Prakash Narayan Jha', bank: 'SBI', balance: 1630000, phone: '9812345679', email: 'prakash.jha@gmail.com', ip: '106.45.89.23', cases: ['C3'] , riskScore: 35 },
  { id: 'ACC024', name: 'Champa Devi Mishra', bank: 'HDFC', balance: 790000, phone: '9923456780', email: 'champa.mishra@gmail.com', ip: '49.204.34.67', cases: ['C4'] , riskScore: 41 },
  { id: 'ACC025', name: 'Venkat Ramaiah Pillai', bank: 'Axis', balance: 3340000, phone: '9734567891', email: 'venkat.pillai@gmail.com', ip: '117.89.12.56', cases: ['C2'] , riskScore: 17 },
  { id: 'ACC026', name: 'Durga Prasad Singh', bank: 'PNB', balance: 9120000, phone: '9845678902', email: 'durga.singh@gmail.com', ip: '103.67.45.12', cases: ['C3'] , riskScore: 53 },
  { id: 'ACC027', name: 'Bindu Madhavi Rao', bank: 'ICICI', balance: 2850000, phone: '9956789013', email: 'bindu.rao@gmail.com', ip: '106.34.56.78', cases: ['C4'] , riskScore: 24 },
];

export interface Transaction {
  id: string;
  source: string;
  target: string;
  amount: number;
  date: string; // ISO 8601 YYYY-MM-DD
  isSuspicious?: boolean;
}

export const transactions: Transaction[] = [
  // Circular loop
  { id: 'TX001', source: 'ACC003', target: 'ACC008', amount: 1850000, date: '2023-04-12', isSuspicious: true },
  { id: 'TX002', source: 'ACC008', target: 'ACC015', amount: 1780000, date: '2023-04-14', isSuspicious: true },
  { id: 'TX003', source: 'ACC015', target: 'ACC003', amount: 1690000, date: '2023-04-15', isSuspicious: true },

  // C1 normal
  { id: 'TX004', source: 'ACC001', target: 'ACC002', amount: 250000, date: '2023-02-10' },
  { id: 'TX005', source: 'ACC002', target: 'ACC004', amount: 120000, date: '2023-03-21' },
  
  // Intercase through ACC007
  { id: 'TX006', source: 'ACC001', target: 'ACC007', amount: 4500000, date: '2023-05-11' },
  { id: 'TX007', source: 'ACC007', target: 'ACC005', amount: 4300000, date: '2023-05-14' },
  { id: 'TX008', source: 'ACC007', target: 'ACC009', amount: 800000, date: '2023-06-22' },

  // Massive hub ACC012 transactions
  { id: 'TX009', source: 'ACC012', target: 'ACC004', amount: 1560000, date: '2023-08-01' },
  { id: 'TX010', source: 'ACC006', target: 'ACC012', amount: 2100000, date: '2023-08-05' },
  { id: 'TX011', source: 'ACC012', target: 'ACC011', amount: 3400000, date: '2023-08-10' },
  { id: 'TX012', source: 'ACC017', target: 'ACC012', amount: 1890000, date: '2023-08-15' },
  { id: 'TX013', source: 'ACC012', target: 'ACC024', amount: 2200000, date: '2023-09-02' },
  { id: 'TX014', source: 'ACC026', target: 'ACC012', amount: 1150000, date: '2023-10-18' },

  // C2 normal
  { id: 'TX015', source: 'ACC005', target: 'ACC006', amount: 750000, date: '2023-07-04' },
  { id: 'TX016', source: 'ACC009', target: 'ACC010', amount: 320000, date: '2023-07-21' },
  { id: 'TX017', source: 'ACC022', target: 'ACC025', amount: 1100000, date: '2023-11-11' },
  { id: 'TX018', source: 'ACC025', target: 'ACC005', amount: 950000, date: '2023-12-05' },

  // C3 normal
  { id: 'TX019', source: 'ACC011', target: 'ACC013', amount: 2800000, date: '2023-01-22' },
  { id: 'TX020', source: 'ACC013', target: 'ACC014', amount: 1650000, date: '2023-02-15' },
  { id: 'TX021', source: 'ACC014', target: 'ACC016', amount: 1250000, date: '2023-03-30' },
  { id: 'TX022', source: 'ACC016', target: 'ACC023', amount: 800000, date: '2024-01-14' },
  { id: 'TX023', source: 'ACC023', target: 'ACC026', amount: 1400000, date: '2024-02-19' },

  // C4 normal & suspicious
  { id: 'TX024', source: 'ACC017', target: 'ACC018', amount: 900000, date: '2023-06-18' },
  { id: 'TX025', source: 'ACC018', target: 'ACC019', amount: 850000, date: '2023-06-25', isSuspicious: true }, // To VPN node
  { id: 'TX026', source: 'ACC019', target: 'ACC020', amount: 780000, date: '2023-07-01', isSuspicious: true },
  { id: 'TX027', source: 'ACC020', target: 'ACC021', amount: 450000, date: '2023-07-15' },
  { id: 'TX028', source: 'ACC021', target: 'ACC024', amount: 320000, date: '2023-08-22' },
  { id: 'TX029', source: 'ACC024', target: 'ACC027', amount: 650000, date: '2023-09-30' },
  { id: 'TX030', source: 'ACC027', target: 'ACC017', amount: 500000, date: '2023-11-05' },

  // Add more random edges to make graph dense and realistic
  { id: 'TX031', source: 'ACC002', target: 'ACC003', amount: 150000, date: '2024-03-01' },
  { id: 'TX032', source: 'ACC004', target: 'ACC015', amount: 280000, date: '2024-03-12' },
  { id: 'TX033', source: 'ACC010', target: 'ACC007', amount: 650000, date: '2024-04-05' },
  { id: 'TX034', source: 'ACC013', target: 'ACC012', amount: 1800000, date: '2024-04-18' },
  { id: 'TX035', source: 'ACC018', target: 'ACC012', amount: 1200000, date: '2024-05-22' },
  { id: 'TX036', source: 'ACC019', target: 'ACC027', amount: 950000, date: '2024-06-11' },
  { id: 'TX037', source: 'ACC022', target: 'ACC007', amount: 800000, date: '2024-07-02' },
  { id: 'TX038', source: 'ACC026', target: 'ACC016', amount: 1100000, date: '2024-08-15' },
  { id: 'TX039', source: 'ACC011', target: 'ACC023', amount: 500000, date: '2024-09-20' },
  { id: 'TX040', source: 'ACC001', target: 'ACC008', amount: 770000, date: '2024-10-10' },
  { id: 'TX041', source: 'ACC025', target: 'ACC009', amount: 430000, date: '2024-11-05' },
];

export const globalStats = {
  totalAccounts: 27,
  transactionVolume: 184000000, // 18.4 Cr
  flaggedAccounts: 6,
  activeCases: 4,
  suspiciousPatterns: 3
};
