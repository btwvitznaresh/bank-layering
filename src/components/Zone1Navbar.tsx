import { Shield, Bell, Plus, Search, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { NewCaseWizard } from './NewCaseWizard';

export const Zone1Navbar: React.FC = () => {
  const { setIsAuthenticated, searchQuery, setSearchQuery, setAutoInvestigateState } = useGlobalState();
  const [showCaseModal, setShowCaseModal] = useState(false);

  return (
    <div className="h-[56px] border-b border-[var(--border-subtle)] flex items-center justify-between px-6 bg-[rgba(5,8,16,0.5)] backdrop-blur-sm relative z-10" style={{boxShadow: '0 1px 0 rgba(0,245,255,0.1)'}}>
      <div className="flex items-center gap-3">
        <Shield className="text-[var(--accent-cyan)] w-6 h-6" />
        <div className="flex flex-col">
          <span className="font-['Rajdhani'] font-bold text-xl leading-none text-white tracking-wide">BankTrace</span>
          <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">Financial Crime Intelligence</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search account holder, phone, email, IP..." 
          className="w-full bg-[rgba(8,16,32,0.6)] border border-[rgba(0,245,255,0.1)] rounded-md py-1.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all font-['Oxanium'] backdrop-blur-md"
        />
        <div className="absolute top-0 right-0 h-full flex items-center pr-2">
          <span className="bg-black/30 border border-white/10 text-[var(--text-muted)] text-[10px] px-1.5 py-0.5 rounded flex items-center">F</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)] px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-[var(--accent-gold)] rounded-full animate-pulse shadow-[0_0_5px_var(--accent-gold)]"></div>
            <span className="text-[11px] font-medium text-[var(--accent-gold)]">4 Active Cases</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5">
            <div className="w-2 h-2 bg-[var(--accent-red)] rounded-full shadow-[0_0_8px_var(--accent-red)]" style={{ animation: 'pulse-live 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1)' }}></div>
            <span className="text-[11px] font-bold font-['JetBrains_Mono'] text-[var(--accent-red)] tracking-widest">LIVE</span>
          </div>
        </div>
        
        <button className="relative text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--accent-red)] rounded-full border border-[var(--bg-primary)]"></div>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bg-panel)] to-[var(--bg-secondary)] border border-[rgba(0,245,255,0.3)] flex items-center justify-center cursor-pointer">
          <span className="font-['Rajdhani'] font-bold text-xs text-[var(--accent-cyan)]">IO</span>
        </div>

        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer p-1"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
        
        <button 
          onClick={() => setAutoInvestigateState(1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--accent-cyan)] text-[var(--bg-secondary)] bg-[var(--accent-cyan)] hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] transition-all text-sm font-bold tracking-wider font-['Rajdhani'] cursor-pointer uppercase"
        >
          ▶ Auto Investigate
        </button>
        <button 
          onClick={() => setShowCaseModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-black transition-all text-sm font-medium font-['Rajdhani'] cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>
      
      {/* Bottom cyan glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.3)] to-transparent"></div>
      
      {showCaseModal && <NewCaseWizard onClose={() => setShowCaseModal(false)} />}
    </div>
  );
};
