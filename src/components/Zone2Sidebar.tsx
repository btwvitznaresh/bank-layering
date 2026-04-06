import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useGlobalState } from '../context/GlobalStateContext';
import { activeCases, accounts } from '../data/mockData';
import { Eye, EyeOff, RotateCcw, Trash2 } from 'lucide-react';

import { twMerge } from 'tailwind-merge';

// Helper for formatting ₹ X.XX Cr
const formatAmount = (val: number) => {
  if (val === 0) return '₹0';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

export const Zone2Sidebar: React.FC = () => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    activeCases: globalCases,
    setActiveCase,
    filters,
    setFilter,
    resetFilters,
    pathTracer,
    setPathTracer,
    customCasesData,
    setToastMessage,
    deleteCase
  } = useGlobalState();
  
  const allCases: Record<string, any> = { ...activeCases, ...customCasesData };

  const handleTrace = () => {
    setPathTracer({ isActive: true });
  };

  const handleClearTrace = () => {
    setPathTracer({ isActive: false, source: '', target: '' });
  };

  return (
    <div className="w-[310px] h-full border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col z-10 backdrop-blur-md overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* SECTION 1: CASE LAYERS */}
      <div className="p-5 border-b border-[var(--border-subtle)]">
        <h3 className="text-[10px] text-[var(--text-muted)] font-['DM_Sans'] font-semibold tracking-widest uppercase mb-4">Case Layers</h3>
        <div className="flex flex-col gap-3">
          {Object.keys(allCases).map(id => {
            const caseData = allCases[id];
            const isVisible = globalCases[id];
            const caseAccounts = accounts.filter(a => a.cases.includes(id));
            const accCount = caseAccounts.length;
            const avgRisk = accCount ? Math.round(caseAccounts.reduce((sum, a) => sum + (a.riskScore || 0), 0) / accCount) : 0;
            let riskTheme = 'text-[var(--accent-green)] border-[var(--accent-green)] shadow-[0_0_8px_rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]';
            let extraAnim = '';
            if (avgRisk > 70) {
                 riskTheme = 'text-[var(--accent-red)] border-[var(--accent-red)] shadow-[0_0_10px_rgba(255,59,59,0.4)] bg-[rgba(255,59,59,0.1)]';
                 extraAnim = 'animate-pulse';
            } else if (avgRisk >= 40) {
                 riskTheme = 'text-[var(--accent-gold)] border-[var(--accent-gold)] shadow-[0_0_8px_rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]';
            }
            
            const isCore = ['C1', 'C2', 'C3', 'C4'].includes(id);

            return (
              <div key={id} className="relative group">
                <div className={twMerge("flex items-center justify-between p-2 rounded-md transition-colors", isVisible ? "bg-white/5" : "bg-transparent opacity-50")}>
                  <div className="flex items-center gap-2 min-w-0 pr-2" title={caseData.name}>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: caseData.color }}></div>
                    <span className="text-xs font-medium break-words leading-tight flex-1" style={{ color: id.startsWith('OP-') ? 'white' : 'inherit' }}>{caseData.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border border-opacity-50 font-['JetBrains_Mono'] ${riskTheme} ${extraAnim}`}>
                      Risk: {avgRisk}
                    </span>
                    <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-['JetBrains_Mono'] text-[var(--text-muted)]" title="Accounts">
                      {accCount}
                    </span>
                    <button 
                      onClick={() => setActiveCase(id as any, !isVisible)}
                      className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer ml-1"
                      title={isVisible ? "Hide Case" : "Show Case"}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      className="p-1 hover:bg-red-500/20 rounded transition-colors text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        if (isCore) {
                           setToastMessage({ text: "⚠ Cannot delete core investigation cases", id: Date.now() });
                        } else {
                           setDeleteConfirmId(id);
                        }
                      }}
                      title="Delete Case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {deleteConfirmId === id && (
                  <div className="absolute top-full right-0 mt-1 z-50 bg-[rgba(20,5,5,0.95)] border border-red-500/30 backdrop-blur-md p-3 rounded shadow-[0_4px_20px_rgba(255,0,0,0.2)] w-64 animate-[pop-in_0.2s_ease-out]">
                    <p className="text-[11px] text-white/90 mb-3 leading-tight">
                      Delete <strong className="text-white">{caseData.name}</strong>? This will remove all associated nodes from the graph.
                    </p>
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 text-[10px] text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer">Cancel</button>
                       <button onClick={() => {
                          deleteCase(id);
                          setToastMessage({ text: `Case ${caseData.name} deleted`, id: Date.now() });
                          setDeleteConfirmId(null);
                       }} className="px-3 py-1 text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30 rounded hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,0,0.2)] cursor-pointer">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: FILTERS */}
      <div className="p-5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] text-[var(--text-muted)] font-['DM_Sans'] font-semibold tracking-widest uppercase">Filters</h3>
          <button 
            onClick={resetFilters}
            className="text-[10px] text-[var(--accent-cyan)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--text-secondary)] font-medium">Account Holder</label>
            <input 
              id="filter-input"
              type="text" 
              value={filters.accountHolder}
              onChange={e => setFilter('accountHolder', e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(0,245,255,0.1)] rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] transition-colors font-['DM_Sans']"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--text-secondary)] font-medium">Phone Number</label>
            <input 
              type="text" 
              value={filters.phone}
              onChange={e => setFilter('phone', e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(0,245,255,0.1)] rounded px-2.5 py-1.5 text-sm md:text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] transition-colors font-['JetBrains_Mono']"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--text-secondary)] font-medium">Email / IP Address</label>
            <input 
              type="text" 
              value={filters.email || filters.ip} // Simplification for UI space: combine them visually or just use one
              onChange={e => {
                const val = e.target.value;
                if (/[\d\.]/.test(val) && val.split('.').length > 2) {
                  setFilter('ip', val);
                  setFilter('email', '');
                } else {
                  setFilter('email', val);
                  setFilter('ip', '');
                }
              }}
              placeholder="Email or IP..."
              className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(0,245,255,0.1)] rounded px-2.5 py-1.5 text-sm md:text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] transition-colors font-['JetBrains_Mono']"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--text-secondary)] font-medium">Amount Range</label>
              <span className="text-[10px] text-[var(--accent-cyan)] font-['JetBrains_Mono']">
                {formatAmount(filters.amountRange[0])} - {formatAmount(filters.amountRange[1])}
              </span>
            </div>
            <div className="px-1 py-2">
              <Slider 
                range 
                min={0} 
                max={25000000} 
                step={100000} 
                value={filters.amountRange}
                onChange={(val) => setFilter('amountRange', val as [number, number])}
                styles={{
                  track: { backgroundColor: 'var(--accent-cyan)' },
                  handle: { 
                    backgroundColor: '#000', 
                    borderColor: 'var(--accent-cyan)',
                    opacity: 1,
                    boxShadow: '0 0 5px rgba(0,245,255,0.5)'
                  },
                  rail: { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs text-[var(--text-secondary)] font-medium">Crime Type</label>
            <select 
              value={filters.crimeType}
              onChange={e => setFilter('crimeType', e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(0,245,255,0.1)] text-white text-sm rounded px-2.5 py-1.5 appearance-none focus:outline-none focus:border-[var(--accent-cyan)] transition-colors cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300F5FF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px top 50%', backgroundSize: '10px auto' }}
            >
              <option value="All">All Types</option>
              <option value="Hawala">Hawala</option>
              <option value="Shell Company">Shell Company</option>
              <option value="Crypto Laundering">Crypto Laundering</option>
              <option value="Ghost Transactions">Ghost Transactions</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: PATH TRACER */}
      <div className="p-5 flex-1 bg-gradient-to-b from-transparent to-black/20">
        <h3 className="text-[10px] text-[var(--accent-cyan)] font-['DM_Sans'] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full animate-pulse"></div>
          Path Tracer
        </h3>
        
        <div className="flex flex-col gap-3">
          <select 
            id="trace-source-input"
            value={pathTracer.source}
            onChange={e => setPathTracer({ source: e.target.value })}
            className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-white text-xs rounded px-2.5 py-2 font-['JetBrains_Mono'] focus:outline-none focus:border-[var(--accent-cyan)]"
          >
            <option value="">-- Source Account --</option>
            {accounts.map(a => (
              <option key={`src-${a.id}`} value={a.id}>{a.id} - {a.name.split(' ')[0]}</option>
            ))}
          </select>
          
          <div className="flex justify-center -my-1 relative z-10">
            <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--text-muted)] text-[10px]">
              ↓
            </div>
          </div>
          
          <select 
            value={pathTracer.target}
            onChange={e => setPathTracer({ target: e.target.value })}
            className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] text-white text-xs rounded px-2.5 py-2 font-['JetBrains_Mono'] focus:outline-none focus:border-[var(--accent-cyan)]"
          >
            <option value="">-- Destination Account --</option>
            {accounts.map(a => (
              <option key={`dst-${a.id}`} value={a.id}>{a.id} - {a.name.split(' ')[0]}</option>
            ))}
          </select>
          
          <button 
            onClick={handleTrace}
            disabled={!pathTracer.source || !pathTracer.target || pathTracer.source === pathTracer.target}
            className="w-full mt-2 bg-[var(--accent-cyan)] text-black font-['Rajdhani'] font-bold text-sm tracking-widest py-2 rounded uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-[0_0_15px_rgba(0,245,255,0.6)] transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            ▶ Trace Path
          </button>
          
          {pathTracer.isActive && (
            <button 
              onClick={handleClearTrace}
              className="text-[11px] text-[var(--text-muted)] hover:text-white text-center mt-2 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Clear Trace
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};
