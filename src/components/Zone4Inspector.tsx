import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { accounts, transactions, activeCases } from '../data/mockData';
import { Shield, Copy, Phone, Mail, Globe, Download, Network, X, BrainCircuit, Sparkles, Plus } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { twMerge } from 'tailwind-merge';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
};

export const Zone4Inspector: React.FC = () => {
  const { selectedAccountId, setSelectedAccountId, setExpandedNodeId, setToastMessage } = useGlobalState();
  const [flaggedOverride, setFlaggedOverride] = useState<Record<string, boolean>>({});

  const [aiState, setAiState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [aiText, setAiText] = useState('');

  // Reset AI state when selected account changes
  React.useEffect(() => {
    setAiState('idle');
    setAiText('');
  }, [selectedAccountId]);

  const account = accounts.find(a => a.id === selectedAccountId);

  // Get transactions involving this account
  const accountTxps = account 
    ? transactions.filter(t => t.source === account.id || t.target === account.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8)
    : [];

  const handleExport = () => {
    if (!account) return;
    
    // Generate HTML report
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BankTrace CONFIDENTIAL Report - ${account.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Rajdhani', sans-serif; color: #000; background: #FFF; padding: 40px; line-height: 1.5; max-width: 800px; margin: 0 auto; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(200, 200, 200, 0.2); z-index: -1; pointer-events: none; white-space: nowrap; font-weight: bold; }
          .header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #0055AA; padding-bottom: 10px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #0055AA; font-size: 28px; }
          .header .date { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
          h2 { color: #0055AA; border-bottom: 1px solid #DDD; padding-bottom: 5px; margin-top: 30px; }
          table { w-full; border-collapse: collapse; margin-top: 15px; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
          th, td { border: 1px solid #DDD; padding: 8px; text-align: left; }
          th { background: #F5F5F5; color: #333; font-family: 'Rajdhani', sans-serif; font-size: 14px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .label { font-size: 11px; color: #666; text-transform: uppercase; }
          .value { font-size: 16px; font-weight: bold; }
          .mono { font-family: 'JetBrains Mono', monospace; }
          .risk-high { color: #D32F2F; }
          .risk-med { color: #F57C00; }
          .btn-print { display: block; margin-bottom: 20px; padding: 10px 20px; background: #0055AA; color: #FFF; border: none; cursor: pointer; border-radius: 4px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="watermark">CONFIDENTIAL</div>
        <button class="btn-print" onclick="window.print()">Print Report</button>
        <div class="header">
          <h1>BankTrace Intelligence Report</h1>
          <div class="date">Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        <h2>Target Entity: ${account.name}</h2>
        <div class="grid">
          <div>
            <div class="label">Account Number</div>
            <div class="value mono">${account.id}</div>
          </div>
          <div>
            <div class="label">Bank</div>
            <div class="value">${account.bank}</div>
          </div>
          <div>
            <div class="label">Contact</div>
            <div class="value mono">${account.phone}<br>${account.email}</div>
          </div>
          <div>
            <div class="label">Current Balance</div>
            <div class="value">₹${(account.balance / 100000).toFixed(2)}L</div>
          </div>
        </div>

        <h2>Risk Assessment</h2>
        <p><strong>Risk Score:</strong> <span class="value ${account.riskScore > 60 ? 'risk-high' : 'risk-med'}">${account.riskScore}/100</span></p>
        <p><strong>Linked Operations:</strong> ${account.cases.map((c: any) => activeCases[c as keyof typeof activeCases]?.name).join(', ')}</p>
        <div>
          <strong>Suspicion Summary:</strong> 
          <ul>
            ${account.isCircular ? '<li>Automated circular transaction looping detected.</li>' : ''}
            ${account.isVpn ? `<li>Hidden network activity via VPN exit node (${account.ip}).</li>` : `<li>Resolved IP: ${account.ip}</li>`}
            ${account.isInterCase ? '<li>Central hub node linking multiple distinct illicit operations.</li>' : ''}
            ${account.riskScore > 70 ? '<li>Highly suspicious transaction volumes compared to baseline.</li>' : ''}
          </ul>
        </div>

        <h2>Transaction History (Last 8)</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Counterparty</th>
              <th>Details</th>
              <th>Flagged</th>
            </tr>
          </thead>
          <tbody>
            ${accountTxps.map(tx => `
              <tr>
                <td>${tx.date}</td>
                <td>${tx.source === account.id ? tx.target : tx.source}</td>
                <td style="color: ${tx.source === account.id ? '#D32F2F' : '#388E3C'}">
                   ${tx.source === account.id ? 'Sent' : 'Received'} ₹${(tx.amount/100000).toFixed(2)}L
                </td>
                <td>${tx.isSuspicious ? 'YES' : 'NO'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
  };

  const getRiskFactors = (acc: any) => {
    const factors = [];
    if (acc.isCircular) factors.push({ name: 'Circular Transfers', impact: 9 });
    if (acc.isVpn) factors.push({ name: 'VPN Usage', impact: 14 });
    if (acc.isInterCase) factors.push({ name: 'Cross-Case Links', impact: 12 });
    if (acc.balance > 10000000) factors.push({ name: 'High Volume', impact: 18 });
    if (acc.sharedPhoneWith?.length > 0) factors.push({ name: 'Shared Identity', impact: 8 });
    // Base factor
    factors.push({ name: 'Baseline Vector', impact: Math.max(0, acc.riskScore - factors.reduce((sum, f) => sum + f.impact, 0)) });
    return factors.sort((a, b) => b.impact - a.impact);
  };

  const generateAIReport = () => {
    if (!account) return;
    setAiState('generating');
    setAiText('');
    
    // Simulate thinking delay
    setTimeout(() => {
      const vpnStr = account.isVpn ? `Multiple transfers were VPN-masked acting primarily on ${account.ip}, ` : '';
      const circStr = account.isCircular ? `Automated circular transaction loops were detected, ` : '';
      const flagStr = flaggedOverride[account.id] ? `Manual flags correspond with unusual timing. ` : '';
      const txCount = accountTxps.length;
      
      const fullText = `${account.name.split(' ')[0]} (${account.id}) routed ₹${(account.balance / 100000).toFixed(1)}L across connected entities. ${vpnStr}${circStr}${flagStr}Analysis of ${txCount} recent transfers suggests potential layering behavior mirroring established typologies. Risk Score: ${account.riskScore}. Recommended action: Freeze and escalate for immediate manual review.`;
      
      const words = fullText.split(' ');
      let index = 0;
      
      const streamTimer = setInterval(() => {
        if (index < words.length) {
          setAiText(prev => prev + (prev ? ' ' : '') + words[index]);
          index++;
        } else {
          clearInterval(streamTimer);
          setAiState('done');
        }
      }, 50); // fast stream effect
    }, 600);
  };

  return (
    <>
      <div 
        className={twMerge(
          "w-[320px] h-full border-l border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col z-10 backdrop-blur-md absolute right-0 top-0 bottom-0 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto custom-scrollbar",
          selectedAccountId ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!account ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[var(--text-muted)]">
            <Shield className="w-16 h-16 mb-4 opacity-20" />
            <p>Select an account node to inspect</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header / Top */}
            <div className="p-5 flex flex-col items-center relative border-b border-[var(--border-subtle)] bg-black/20">
              <button 
                onClick={() => setSelectedAccountId(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-['Rajdhani'] mb-3 border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ 
                  backgroundColor: `${activeCases[account.cases[0]].color}20`,
                  borderColor: activeCases[account.cases[0]].color,
                  color: activeCases[account.cases[0]].color,
                }}
              >
                {getInitials(account.name)}
              </div>
              
              <h2 className="text-lg font-['Rajdhani'] font-bold text-white text-center leading-tight mb-1">{account.name}</h2>
              
              <div className="flex items-center gap-2 mt-1">
                {flaggedOverride[account.id] || account.isCircular || account.isVpn ? (
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[var(--accent-red)] text-black px-2 py-0.5 rounded flex items-center gap-1">
                    🚩 FLAGGED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[var(--accent-green)] text-black px-2 py-0.5 rounded flex items-center gap-1">
                    ACTIVE
                  </span>
                )}
                <RiskBadge score={account.riskScore} factors={getRiskFactors(account)} />
              </div>
            </div>

            {/* Core Details */}
            <div className="p-5 flex flex-col gap-4 border-b border-[var(--border-subtle)]">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Account No</span>
                  <div className="flex items-center gap-2 text-[var(--accent-cyan)] font-['JetBrains_Mono'] text-sm">
                    {account.id}
                    <button className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Bank</span>
                  <span className="text-sm font-medium">{account.bank}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Current Balance</span>
                <span className={twMerge("text-2xl font-['Rajdhani'] font-bold tracking-widest", account.balance >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]")}>
                  ₹{(account.balance / 100000).toFixed(2)}L
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-5 flex flex-col gap-3 border-b border-[var(--border-subtle)] bg-black/10 text-sm font-['JetBrains_Mono']">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{account.phone}</span>
                </div>
                {account.sharedPhoneWith && account.sharedPhoneWith.length > 0 && (
                  <span className="text-[10px] bg-[rgba(255,215,0,0.15)] text-[var(--accent-gold)] px-1.5 py-0.5 rounded flex items-center gap-1 font-['DM_Sans']">
                    ⚠ Shared
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{account.email}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{account.ip}</span>
                </div>
                {account.isVpn && (
                  <span className="text-[10px] bg-[rgba(255,59,59,0.15)] text-[var(--accent-red)] px-1.5 py-0.5 rounded font-['DM_Sans'] font-medium whitespace-nowrap">
                    VPN DETECTED
                  </span>
                )}
              </div>
            </div>

            {/* Linked Cases */}
            <div className="p-5 border-b border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-['DM_Sans']">Linked Cases</span>
              <div className="flex flex-wrap gap-2">
                {account.cases.map(caseId => (
                  <div 
                    key={caseId} 
                    className="flex items-center gap-1.5 px-2 py-1 rounded border bg-black/30 text-xs font-medium"
                    style={{ borderColor: `${activeCases[caseId].color}40`, color: 'white' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeCases[caseId].color }}></div>
                    {activeCases[caseId].name}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Narrative Section */}
            <div className="p-5 border-b border-[var(--border-subtle)] bg-[rgba(0,229,255,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[var(--accent-cyan)] uppercase tracking-wider font-['DM_Sans'] flex items-center gap-1.5 font-bold">
                  <BrainCircuit className="w-3.5 h-3.5" /> AI Intelligence Brief
                </span>
              </div>
              
              {aiState === 'idle' ? (
                <button 
                  onClick={generateAIReport}
                  className="w-full flex justify-center items-center gap-2 text-sm bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.3)] text-[var(--accent-cyan)] hover:bg-[rgba(0,245,255,0.15)] hover:border-[var(--accent-cyan)] font-medium py-2 rounded transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Generate Report
                </button>
              ) : (
                <div className="bg-black/30 border border-[rgba(0,245,255,0.15)] rounded p-3 text-xs leading-relaxed text-white/90 font-['DM_Sans'] shadow-inner">
                  <p className="min-h-[60px]">
                    {aiText}
                    {aiState === 'generating' && <span className="inline-block w-1.5 h-3 bg-[var(--accent-cyan)] ml-1 animate-pulse align-middle"></span>}
                  </p>
                  
                  {aiState === 'done' && (
                    <button 
                      onClick={() => setToastMessage({ text: 'Added node to active investigation framework', id: Date.now() })}
                      className="mt-3 w-full flex justify-center items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] bg-[var(--accent-cyan)] text-black font-bold py-1.5 rounded hover:bg-white hover:shadow-[0_0_10px_rgba(0,245,255,0.5)] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Case
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="p-5 border-b border-[var(--border-subtle)] flex-1 overflow-hidden flex flex-col">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-['DM_Sans']">Transaction History</span>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <table className="w-full text-left text-xs font-['JetBrains_Mono'] border-collapse">
                  <thead className="sticky top-0 bg-[var(--bg-panel)] z-10 text-[10px] text-[var(--text-secondary)] uppercase">
                    <tr>
                      <th className="py-2 px-1 font-normal opacity-70">Date</th>
                      <th className="py-2 px-1 font-normal opacity-70">Counterparty</th>
                      <th className="py-2 px-1 font-normal opacity-70 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountTxps.map(tx => {
                      const isCredit = tx.target === account.id;
                      const counterparty = isCredit ? tx.source : tx.target;
                      
                      return (
                        <tr key={tx.id} className={twMerge("border-b border-[#ffffff0a] transition-colors hover:bg-white/5", tx.isSuspicious ? "border-l-2 border-l-[var(--accent-red)]" : "")}>
                          <td className="py-2 px-1 text-[10px] text-[var(--text-muted)]">{tx.date.substring(2)}</td>
                          <td className="py-2 px-1 text-[var(--text-primary)]">{counterparty}</td>
                          <td className={twMerge("py-2 px-1 text-right font-medium flex justify-end gap-1 items-center", isCredit ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]")}>
                            {isCredit ? '↓' : '↑'} {tx.amount >= 100000 ? `${(tx.amount/100000).toFixed(1)}L` : tx.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded px-3 py-2 cursor-pointer transition-colors hover:bg-white/5" onClick={() => setFlaggedOverride(prev => ({...prev, [account.id]: !prev[account.id]}))}>
                <span className="text-sm font-medium">Flag as Suspicious</span>
                <div className={twMerge("w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-200", flaggedOverride[account.id] ? "bg-[var(--accent-red)] justify-end" : "bg-white/20 justify-start")}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <button 
                onClick={handleExport}
                className="w-full flex justify-center items-center gap-2 text-sm bg-transparent border border-[var(--text-secondary)] text-[var(--text-primary)] hover:border-white hover:bg-white/10 py-2 rounded transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Node Report
              </button>
              
              <button 
                onClick={() => {
                   const count = new Set(accountTxps.map(tx => tx.source === account.id ? tx.target : tx.source)).size;
                   setExpandedNodeId(account.id);
                   setToastMessage({ text: `Showing direct network of ${account.name} — ${count} connected accounts`, id: Date.now() });
                }}
                className="w-full flex justify-center items-center gap-2 text-sm bg-[rgba(0,245,255,0.1)] border border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-black font-medium py-2 rounded transition-all cursor-pointer"
              >
                <Network className="w-4 h-4" /> Expand Network
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
