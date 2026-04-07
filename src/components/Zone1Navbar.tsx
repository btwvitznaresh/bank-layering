import { Shield, Bell, Plus, Search, LogOut, X, ChevronRight, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { NewCaseWizard } from './NewCaseWizard';

export const Zone1Navbar: React.FC = () => {
  const { setIsAuthenticated, searchQuery, setSearchQuery, setAutoInvestigateState, setSelectedAccountId, addToast, activeCases, setActiveCase } = useGlobalState();
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'alerts' | 'profile'>('none');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showSlideIn, setShowSlideIn] = useState<'none' | 'alerts' | 'audit'>('none');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'PROFILE' | 'PREFERENCES' | 'SECURITY'>('PROFILE');

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'tx', target: 'ACC008', dot: '#ff4444', text: 'ACC003 → ACC008 · ₹18,50,000 · FLAGGED', time: '2m ago', read: false },
    { id: 2, type: 'tx', target: 'ACC017', dot: '#f5c842', text: 'ACC012 → ACC017 · ₹45,00,000 · MONITORED', time: '7m ago', read: false },
    { id: 3, type: 'sys', target: 'none', dot: '#ff4444', text: 'SYS_ERR_09 · DB Connection Timeout', time: '14m ago', read: false },
    { id: 4, type: 'sys', target: 'none', dot: '#00E5FF', text: 'Auto-investigation completed for ACC089', time: '1h ago', read: false },
    { id: 5, type: 'sys', target: 'none', dot: '#f5c842', text: 'Login from new IP address detected', time: '2h ago', read: false }
  ]);

  const unreadCount = alerts.filter(a => !a.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (type: 'alerts' | 'profile') => {
    setActiveDropdown(prev => prev === type ? 'none' : type);
  };

  const handleAlertClick = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    if (!alert.read) {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true, dot: '#4a6070' } : a));
    }

    if (alert.type === 'tx') {
      setSelectedAccountId(alert.target);
      addToast(`Highlighting node ${alert.target} in investigation graph`, 'info');
    } else {
      addToast('Alert acknowledged and logged', 'success');
    }
    setActiveDropdown('none');
  };

  const handleMyCasesClick = () => {
    setActiveDropdown('none');
    Object.keys(activeCases).forEach(caseId => {
      setActiveCase(caseId as any, true);
    });
    addToast("Showing 4 active cases", "info");
  };

  return (
    <>
      <div className="h-[56px] border-b border-[var(--border-subtle)] flex items-center justify-between px-6 bg-[rgba(5,8,16,0.5)] backdrop-blur-sm relative z-40" style={{boxShadow: '0 1px 0 rgba(0,245,255,0.1)'}}>
        <style>{`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fadeInDown 150ms ease-out forwards;
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
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

        <div className="flex items-center gap-5" ref={dropdownRef}>
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
          
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('alerts')}
              className={`relative transition-colors cursor-pointer ${activeDropdown === 'alerts' ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--accent-red)] rounded-full border border-[var(--bg-primary)] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white leading-none pb-[1px]">{unreadCount}</span>
                </div>
              )}
            </button>

            {activeDropdown === 'alerts' && (
              <div className="absolute right-0 top-[40px] w-[320px] bg-[#0A0E1A] border border-[rgba(0,229,255,0.2)] rounded-lg shadow-2xl animate-fade-in-down overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,229,255,0.1)] bg-[rgba(0,229,255,0.03)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
                    <span className="text-[11px] font-bold font-['Rajdhani'] text-white tracking-widest uppercase">Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[rgba(0,229,255,0.1)] text-[#00E5FF] px-1.5 py-0.5 rounded font-['Oxanium'] font-bold">{unreadCount} NEW</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      onClick={() => handleAlertClick(alert.id)}
                      className={`px-4 py-3 border-b border-[rgba(0,229,255,0.05)] hover:bg-[rgba(0,229,255,0.08)] cursor-pointer transition-colors flex items-start gap-3 ${alert.read ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: alert.dot, boxShadow: alert.read ? 'none' : `0 0 5px ${alert.dot}` }}></div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[12px] font-['Oxanium'] text-[#e0e0e0] leading-snug">{alert.text}</p>
                        <span className="text-[10px] font-['Rajdhani'] font-medium tracking-wider text-[#4a6070] uppercase">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[rgba(0,229,255,0.1)] bg-[rgba(0,229,255,0.02)]">
                  <button 
                    onClick={() => { setActiveDropdown('none'); setShowSlideIn('alerts'); }}
                    className="w-full py-1.5 text-[11px] text-[#00E5FF] hover:text-black hover:bg-[#00E5FF] rounded transition-all font-['Rajdhani'] font-bold tracking-wider cursor-pointer"
                  >
                    VIEW ALL ALERTS →
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('profile')}
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bg-panel)] to-[var(--bg-secondary)] border ${activeDropdown === 'profile' ? 'border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'border-[rgba(0,245,255,0.3)]'} flex items-center justify-center cursor-pointer transition-all`}
            >
              <span className="font-['Rajdhani'] font-bold text-xs text-[var(--accent-cyan)]">IO</span>
            </div>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 top-[48px] w-[320px] bg-[#0A0E1A] border border-[rgba(0,229,255,0.2)] rounded-lg shadow-2xl animate-fade-in-down overflow-hidden z-50">
                <div className="p-4 flex items-center gap-4 border-b border-[rgba(0,229,255,0.1)] bg-[rgba(0,229,255,0.03)] relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#00E5FF] opacity-5 blur-2xl rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-[#00E5FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] relative z-10 shrink-0">
                    <span className="font-['Rajdhani'] font-bold text-xl text-[#0A0E1A]">IO</span>
                  </div>
                  <div className="flex flex-col relative z-10">
                    <span className="text-[15px] font-bold font-['Rajdhani'] text-[#e0e0e0] uppercase tracking-wide leading-tight">Admin Officer</span>
                    <span className="text-[12px] font-['Oxanium'] text-[#4a6070] mb-2">Badge ID: admin</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] border border-[#00E5FF] text-[#00E5FF] px-1.5 py-0.5 rounded font-bold tracking-wider">INSPECTOR</span>
                      <div className="flex items-center gap-1.5 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_5px_#00ff9d]"></div>
                        <span className="text-[9px] font-['Rajdhani'] font-bold tracking-wider uppercase text-[#4a6070]">Active Session</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button onClick={handleMyCasesClick} className="w-full text-left px-5 py-2.5 text-[13px] font-['Oxanium'] text-[#e0e0e0] hover:bg-[rgba(0,229,255,0.08)] hover:text-[#00E5FF] transition-colors flex items-center gap-3 cursor-pointer">
                    <span className="opacity-70"><Layers className="w-4 h-4"/></span> My Cases
                  </button>
                  <button onClick={() => { setActiveDropdown('none'); setShowSettingsModal(true); }} className="w-full text-left px-5 py-2.5 text-[13px] font-['Oxanium'] text-[#e0e0e0] hover:bg-[rgba(0,229,255,0.08)] hover:text-[#00E5FF] transition-colors flex items-center gap-3 cursor-pointer">
                    <span className="opacity-70"><RefreshCw className="w-4 h-4"/></span> Settings
                  </button>
                  <button onClick={() => { setActiveDropdown('none'); setShowSlideIn('audit'); }} className="w-full text-left px-5 py-2.5 text-[13px] font-['Oxanium'] text-[#e0e0e0] hover:bg-[rgba(0,229,255,0.08)] hover:text-[#00E5FF] transition-colors flex items-center gap-3 cursor-pointer">
                    <span className="opacity-70"><CheckCircle2 className="w-4 h-4"/></span> Audit Log
                  </button>
                </div>
                <div className="border-t border-[rgba(0,229,255,0.1)] py-2">
                  <button 
                    onClick={() => { setActiveDropdown('none'); setShowSignOutModal(true); }}
                    className="w-full text-left px-5 py-2.5 text-[13px] font-['Oxanium'] text-[#ff4444] hover:bg-[rgba(255,68,68,0.1)] transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 opacity-70" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSignOutModal(true)}
            className="hidden md:block text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors cursor-pointer p-1"
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
      </div>

      {showCaseModal && <NewCaseWizard onClose={() => setShowCaseModal(false)} />}

      {/* --- SLIDE IN PANELS --- */}
      {showSlideIn !== 'none' && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" 
            style={{ top: '56px', height: 'calc(100vh - 56px)' }}
            onClick={() => setShowSlideIn('none')} 
          />
          <div 
            className="fixed w-[420px] bg-[#0A0E1A] border-l-[2px] border-[#00E5FF] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] animate-slide-in-right flex flex-col z-30"
            style={{ top: '56px', right: 0, height: 'calc(100vh - 56px)' }}
          >
            <div className="p-5 border-b border-[rgba(0,229,255,0.2)] flex items-center justify-between">
              <h2 className="text-[#e0e0e0] font-['Orbitron'] font-bold tracking-widest text-lg">
                {showSlideIn === 'alerts' ? 'ALERT CENTRE' : 'AUDIT LOG'}
              </h2>
              <button onClick={() => setShowSlideIn('none')} className="text-[#e0e0e0] hover:text-[#00E5FF] cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {showSlideIn === 'alerts' && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 border-b border-[rgba(0,229,255,0.2)] pb-2">
                    {['ALL', 'FLAGGED', 'MONITORED', 'SYSTEM'].map(tab => (
                      <button key={tab} className={`text-[10px] font-['Rajdhani'] uppercase font-bold tracking-wider px-2 py-1 rounded cursor-pointer transition-colors ${tab === 'ALL' ? 'bg-[#00E5FF] text-black' : 'text-[#4a6070] hover:text-white'}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {alerts.map((a, i) => (
                      <div key={i} className="bg-[rgba(0,229,255,0.02)] border border-[rgba(0,229,255,0.1)] rounded p-4 hover:border-[#00E5FF] transition-all cursor-pointer group">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.dot, boxShadow: `0 0 8px ${a.dot}` }}></div>
                          <span className="text-[11px] font-['Rajdhani'] text-[#e0e0e0] font-bold">{a.text.split('·')[0]}</span>
                          <span className="ml-auto text-[10px] text-[#4a6070]">{a.time}</span>
                        </div>
                        <p className="text-[13px] font-['Oxanium'] text-[#4a6070] group-hover:text-[#e0e0e0] transition-colors">{a.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {showSlideIn === 'audit' && (
                <div className="flex flex-col gap-2">
                  <table className="w-full text-left" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="bg-[rgba(0,229,255,0.1)] text-[10px] font-['Rajdhani'] font-bold text-[#00E5FF] tracking-wider uppercase">
                        <th className="px-3 py-2" style={{ width: '60px' }}>Time</th>
                        <th className="px-3 py-2" style={{ width: '100px' }}>Action</th>
                        <th className="px-3 py-2">Target</th>
                        <th className="px-3 py-2" style={{ width: '70px' }}>Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { time: '08:41', action: 'Viewed case', target: 'Operation Hawala', officer: 'admin' },
                        { time: '08:39', action: 'Traced path', target: 'ACC002 → ACC014', officer: 'admin' },
                        { time: '08:30', action: 'Login', target: 'System access', officer: 'admin' },
                        { time: '08:15', action: 'Flagged account', target: 'ACC003', officer: 'admin' },
                        { time: '07:55', action: 'Created case', target: 'Operation Ghost', officer: 'admin' }
                      ].map((log, i) => (
                        <tr key={i} className="border-b border-[rgba(255,255,255,0.05)] text-[12px] font-['Oxanium'] text-[#e0e0e0] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                          <td className="px-3 py-3 text-[#4a6070] font-['JetBrains_Mono'] text-[10px] truncate overflow-hidden whitespace-nowrap min-w-0" style={{ maxWidth: 0 }}>{log.time}</td>
                          <td className="px-3 py-3 text-[#00ff9d] truncate overflow-hidden whitespace-nowrap min-w-0" style={{ maxWidth: 0 }}>{log.action}</td>
                          <td className="px-3 py-3 truncate overflow-hidden whitespace-nowrap min-w-0" style={{ maxWidth: 0 }}>{log.target}</td>
                          <td className="px-3 py-3 text-[#f5c842] truncate overflow-hidden whitespace-nowrap min-w-0" style={{ maxWidth: 0 }}>{log.officer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- MODALS --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)}></div>
          <div className="relative w-[480px] bg-[#0A0E1A] border border-[rgba(0,229,255,0.2)] rounded-lg shadow-[0_0_40px_rgba(0,229,255,0.1)] flex flex-col overflow-hidden animate-[pop-in_0.2s_ease-out]">
            <div className="flex border-b border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.02)]">
              {['PROFILE', 'PREFERENCES', 'SECURITY'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setSettingsTab(tab as any)}
                  className={`flex-1 py-4 text-[12px] font-['Rajdhani'] tracking-widest font-bold transition-all cursor-pointer ${settingsTab === tab ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] bg-[rgba(0,229,255,0.05)]' : 'text-[#4a6070] hover:text-[#e0e0e0]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {settingsTab === 'PROFILE' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-['Oxanium'] text-[#4a6070] uppercase">Badge ID</label>
                    <input type="text" defaultValue="admin" readOnly className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] rounded p-2.5 text-[#e0e0e0] font-['JetBrains_Mono'] text-[13px] opacity-60 cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-['Oxanium'] text-[#4a6070] uppercase">Officer Name</label>
                    <input type="text" defaultValue="Admin Officer" className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(0,245,255,0.2)] rounded p-2.5 text-white font-['Oxanium'] text-[14px] focus:outline-none focus:border-[#00E5FF]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-['Oxanium'] text-[#4a6070] uppercase">Clearance Level</label>
                    <select disabled className="w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] rounded p-2.5 text-[#e0e0e0] font-['Oxanium'] text-[14px] opacity-60 cursor-not-allowed appearance-none">
                      <option>Inspector</option>
                    </select>
                  </div>
                  <button onClick={() => { addToast('Profile details updated', 'success'); setShowSettingsModal(false); }} className="mt-2 w-full py-3 bg-[#00E5FF] text-black font-['Rajdhani'] font-bold text-[14px] rounded hover:bg-white transition-all cursor-pointer">
                    SAVE CHANGES
                  </button>
                </div>
              )}
              {settingsTab !== 'PROFILE' && (
                <div className="flex items-center justify-center p-10 text-[#4a6070] font-['Oxanium'] text-sm">
                  Nothing to configure here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSignOutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative w-[380px] bg-[#0A0E1A] border border-[rgba(255,68,68,0.3)] rounded-lg p-6 shadow-[0_0_50px_rgba(255,68,68,0.15)] animate-[pop-in_0.2s_ease-out] text-center">
            <div className="w-12 h-12 rounded-full bg-[rgba(255,68,68,0.1)] border border-[rgba(255,68,68,0.3)] flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-[#ff4444]" />
            </div>
            <h3 className="text-lg font-['Orbitron'] font-bold text-white mb-2">END SESSION?</h3>
            <p className="text-[13px] font-['Oxanium'] text-[#4a6070] mb-6 leading-relaxed">
              Are you sure you want to end your active investigation session? Unsaved visual arrangements will not be retained.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSignOutModal(false)} className="flex-1 py-2.5 rounded border border-[rgba(255,255,255,0.2)] text-[#e0e0e0] font-['Rajdhani'] font-bold hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer">
                CANCEL
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="flex-1 py-2.5 rounded bg-[#ff4444] text-white font-['Rajdhani'] font-bold hover:bg-red-500 shadow-[0_0_15px_rgba(255,68,68,0.4)] transition-all cursor-pointer">
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
