import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { X, Search } from 'lucide-react';
import { accounts } from '../data/mockData';

export const NewCaseWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { launchCase, setToastMessage } = useGlobalState();
  const [step, setStep] = useState(1);
  const [caseData, setCaseData] = useState({
    name: '',
    code: `OP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
    officer: '',
    type: 'Hawala',
    priority: 'HIGH',
    color: '#00F5FF',
    description: ''
  });

  const [activeTab, setActiveTab] = useState<'existing'|'new'>('new');
  const [addedAccounts, setAddedAccounts] = useState<any[]>([]);
  
  // New account form state
  const [newAcc, setNewAcc] = useState<any>({
    name: '', id: '', bank: 'SBI', ifsc: '', balance: 0, phone: '', email: '', ip: '', isVpn: false, isSuspicious: false, riskScore: 50
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // Existing account search
  const [searchEx, setSearchEx] = useState('');

  const renderStepIndicators = () => (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1,2,3].map(s => (
        <React.Fragment key={s}>
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= s ? 'bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]' : 'bg-white/20'}`}></div>
          {s < 3 && <div className={`w-12 h-[1px] ${step > s ? 'bg-[var(--accent-cyan)]' : 'bg-white/10'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  const handleAddExisting = (acc: any) => {
    if (addedAccounts.find(a => a.id === acc.id)) return;
    setAddedAccounts([...addedAccounts, { ...acc }]);
    setSearchEx('');
  };

  const handleAddNew = () => {
    const newErrors: Record<string, boolean> = {};
    if (!newAcc.name) newErrors.name = true;
    if (!newAcc.id) newErrors.id = true;
    if (newAcc.balance === undefined || newAcc.balance === null) newErrors.balance = true;
    if (!newAcc.phone) newErrors.phone = true;
    if (!newAcc.email) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const built: any = {
      ...newAcc,
      id: `NEW-${Date.now()}`,
      cases: [] 
    };

    setAddedAccounts([...addedAccounts, built]);
    setNewAcc({ name: '', id: '', bank: 'SBI', ifsc: '', balance: 0, phone: '', email: '', ip: '', isVpn: false, isSuspicious: false, riskScore: 50 });
    setErrors({});
    
    // Tiny green flash handled by just CSS locally or generic
    const btn = document.getElementById('add-acc-btn');
    if (btn) {
      btn.style.backgroundColor = '#00FF00';
      btn.style.color = '#000';
      btn.innerText = '✓ Account Added';
      setTimeout(() => {
        btn.style.backgroundColor = 'rgba(0,245,255,0.1)';
        btn.style.color = 'var(--accent-cyan)';
        btn.innerText = 'Add Account';
      }, 1000);
    }
  };

  const isCompleteStep1 = caseData.name.trim() !== '';

  const handleLaunch = () => {
    launchCase(
       { id: caseData.code, name: caseData.name, color: caseData.color },
       addedAccounts
    );
    setToastMessage({ text: `✓ ${caseData.name} launched — ${addedAccounts.length} accounts added to network`, id: Date.now() });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(8,16,32,0.95)] backdrop-blur-[20px] z-[200] flex items-center justify-center font-['DM_Sans']">
      <div className="bg-[#0A1628] border border-[rgba(0,245,255,0.2)] rounded-lg p-6 w-[680px] max-h-[85vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,245,255,0.1)] flex flex-col relative transition-transform">
        
        {renderStepIndicators()}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-[pop-in_0.3s_ease-out]">
            <h2 className="text-lg font-bold font-['Rajdhani'] text-[var(--accent-cyan)] tracking-widest uppercase border-b border-[rgba(0,245,255,0.2)] pb-3 mb-5">
              CREATE NEW INVESTIGATION CASE — Step 1 of 3
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Case Name *</label>
                <input type="text" value={caseData.name} onChange={e => setCaseData({...caseData, name: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]" placeholder="e.g. Operation Viper" />
              </div>
              <div className="flex gap-4">
                 <div className="flex flex-col gap-1 flex-1">
                   <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Case Code</label>
                   <input type="text" value={caseData.code} onChange={e => setCaseData({...caseData, code: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 text-sm text-[var(--text-primary)] font-['JetBrains_Mono'] focus:outline-none focus:border-[var(--accent-cyan)]" />
                 </div>
                 <div className="flex flex-col gap-1 flex-1">
                   <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Assigned Officer</label>
                   <input type="text" value={caseData.officer} onChange={e => setCaseData({...caseData, officer: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)]" placeholder="Badge ID or Name" />
                 </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Crime Type</label>
                  <select value={caseData.type} onChange={e => setCaseData({...caseData, type: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)]">
                    <option>Hawala</option><option>Shell Company</option><option>Crypto Laundering</option><option>Ghost Transactions</option><option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Priority</label>
                  <div className="flex items-center gap-2 h-full">
                    {[
                      { l: 'LOW', c: '#00FF88' }, 
                      { l: 'MEDIUM', c: '#FFD700' }, 
                      { l: 'HIGH', c: '#FF9900' }, 
                      { l: 'CRITICAL', c: '#FF3B3B' }
                    ].map(({l, c}) => (
                       <button key={l} onClick={() => setCaseData({...caseData, priority: l})} className="text-[10px] px-2 py-1 rounded-full border border-transparent font-bold transition-all" style={{ backgroundColor: caseData.priority === l ? c : 'rgba(255,255,255,0.05)', color: caseData.priority === l ? '#000' : c }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Case Color</label>
                 <div className="flex items-center gap-3 bg-[#050810] p-3 rounded border border-[rgba(0,245,255,0.2)]">
                   {['#00F5FF', '#FFD700', '#9B5DE5', '#FF3B3B', '#00FF88', '#FF69B4'].map(c => (
                      <button key={c} onClick={() => setCaseData({...caseData, color: c})} className="w-8 h-8 rounded-full border-2 transition-transform" style={{ backgroundColor: c, borderColor: caseData.color === c ? 'white' : 'transparent', transform: caseData.color === c ? 'scale(1.2)' : 'scale(1)' }}></button>
                   ))}
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
                <textarea rows={2} value={caseData.description} onChange={e => setCaseData({...caseData, description: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]" placeholder="Brief case description..."></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-[rgba(0,245,255,0.2)] pt-5">
                <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white px-4 py-2 text-sm tracking-wide transition-colors">Cancel</button>
                <button disabled={!isCompleteStep1} onClick={() => setStep(2)} className="bg-[var(--accent-cyan)] text-black px-6 py-2 rounded text-sm font-['Rajdhani'] font-bold tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next: Add Accounts →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-[pop-in_0.3s_ease-out]">
            <h2 className="text-lg font-bold font-['Rajdhani'] text-[var(--accent-cyan)] tracking-widest uppercase border-b border-[rgba(0,245,255,0.2)] pb-3 mb-5">
              ADD ACCOUNTS TO CASE — Step 2 of 3
            </h2>

            <div className="flex mb-4 border-b border-[rgba(255,255,255,0.1)]">
              <button className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'new' ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('new')}>Add New Account</button>
              <button className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'existing' ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('existing')}>Add Existing Account</button>
            </div>

            {activeTab === 'new' ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <input type="text" placeholder="Account Holder Name *" value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})} className={`bg-[#050810] border ${errors.name ? 'border-red-500' : 'border-[rgba(0,245,255,0.2)]'} rounded px-3 py-1.5 text-sm text-white focus:outline-none`} />
                  {errors.name && <span className="text-[10px] text-red-500">Name is required</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="text" placeholder="Account Number (XXXX-XXXX-XXXX) *" value={newAcc.id} onChange={e => {
                      let val = e.target.value.replace(/\D/g, '').substring(0,12);
                      val = val.replace(/(.{4})/g, '$1-').replace(/-$/, '');
                      setNewAcc({...newAcc, id: val});
                    }} className={`bg-[#050810] border ${errors.id ? 'border-red-500' : 'border-[rgba(0,245,255,0.2)]'} rounded px-3 py-1.5 text-sm text-white font-['JetBrains_Mono'] focus:outline-none`} />
                  {errors.id && <span className="text-[10px] text-red-500">Account Number is required</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <select value={newAcc.bank} onChange={e => setNewAcc({...newAcc, bank: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                    <option>SBI</option><option>HDFC</option><option>ICICI</option><option>Axis</option><option>PNB</option><option>Kotak</option><option>Canara</option><option>Yes Bank</option><option>BOI</option><option>UCO</option><option>Federal</option><option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <input type="text" placeholder="IFSC Code" value={newAcc.ifsc} onChange={e => setNewAcc({...newAcc, ifsc: e.target.value})} className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-1.5 text-sm text-white font-['JetBrains_Mono'] focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">₹</span>
                     <input type="number" placeholder="Current Balance *" value={newAcc.balance || ''} onChange={e => setNewAcc({...newAcc, balance: Number(e.target.value)})} className={`w-full pl-6 bg-[#050810] border ${errors.balance ? 'border-red-500' : 'border-[rgba(0,245,255,0.2)]'} rounded px-3 py-1.5 text-sm text-white font-['JetBrains_Mono'] focus:outline-none`} />
                  </div>
                  {errors.balance && <span className="text-[10px] text-red-500">Balance is required</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="text" placeholder="Phone Number (10 digits) *" value={newAcc.phone} onChange={e => setNewAcc({...newAcc, phone: e.target.value.replace(/\D/g, '').substring(0,10)})} className={`bg-[#050810] border ${errors.phone ? 'border-red-500' : 'border-[rgba(0,245,255,0.2)]'} rounded px-3 py-1.5 text-sm text-white font-['JetBrains_Mono'] focus:outline-none`} />
                  {errors.phone && <span className="text-[10px] text-red-500">Phone is required</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="email" placeholder="Email Address *" value={newAcc.email} onChange={e => setNewAcc({...newAcc, email: e.target.value})} className={`bg-[#050810] border ${errors.email ? 'border-red-500' : 'border-[rgba(0,245,255,0.2)]'} rounded px-3 py-1.5 text-sm text-white focus:outline-none`} />
                  {errors.email && <span className="text-[10px] text-red-500">Email is required</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative line-clamp-1">
                    <input type="text" placeholder="IP Address" value={newAcc.ip} onChange={e => setNewAcc({...newAcc, ip: e.target.value, isVpn: e.target.value.startsWith('185.') || e.target.value.startsWith('45.142.')})} className="w-full bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-1.5 text-sm text-white focus:outline-none" />
                    {newAcc.isVpn && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-red-500 font-bold">⚠ Possible VPN</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <select className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                    <option>Savings</option><option>Current</option><option>NRI</option><option>Joint</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 h-full pl-2">
                  <label className="text-sm text-[var(--text-secondary)]">Flag Suspicious:</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={newAcc.isSuspicious} onChange={e => setNewAcc({...newAcc, isSuspicious: e.target.checked})} />
                    <div className="w-9 h-5 bg-black/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent-red)]"></div>
                  </label>
                </div>
                <div className="col-span-2">
                   <button id="add-acc-btn" onClick={handleAddNew} className="w-full py-2 bg-[rgba(0,245,255,0.1)] border border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-black transition-all rounded text-sm font-bold tracking-widest uppercase">Add Account</button>
                </div>
              </div>
            ) : (
               <div className="flex flex-col gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Search by name or ID..." value={searchEx} onChange={e => setSearchEx(e.target.value)} className="w-full bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded px-3 py-2 pl-9 text-sm text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
                  </div>
                  <div className="max-h-[160px] overflow-y-auto custom-scrollbar border border-[rgba(255,255,255,0.1)] roundedbg-[#050810]">
                     {accounts.filter(a => a.name.toLowerCase().includes(searchEx.toLowerCase()) || a.id.toLowerCase().includes(searchEx.toLowerCase())).slice(0, 20).map(a => (
                        <div key={a.id} className="flex items-center justify-between p-2 border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5">
                           <div>
                             <div className="text-sm text-white font-medium">{a.name}</div>
                             <div className="text-xs text-[var(--text-muted)] font-['JetBrains_Mono']">{a.id} · {a.bank}</div>
                           </div>
                           <button onClick={() => handleAddExisting(a)} disabled={addedAccounts.some(x => x.id === a.id)} className="px-3 py-1 text-xs bg-[var(--accent-cyan)] text-black rounded font-bold disabled:opacity-30">Add</button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="border border-[rgba(0,245,255,0.2)] rounded bg-[#0A1628] max-h-[180px] overflow-y-auto custom-scrollbar">
               <table className="w-full text-left text-[11px]">
                 <thead className="bg-[#050810] sticky top-0 uppercase tracking-wider text-[var(--text-muted)] border-b border-[rgba(0,245,255,0.2)]">
                   <tr>
                     <th className="p-2">#</th>
                     <th className="p-2">Name</th>
                     <th className="p-2">Account No</th>
                     <th className="p-2">Bank</th>
                     <th className="p-2">Balance</th>
                     <th className="p-2">Suspicious</th>
                     <th className="p-2"></th>
                   </tr>
                 </thead>
                 <tbody>
                    {addedAccounts.map((a, i) => (
                      <tr key={a.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5">
                        <td className="p-2 text-[var(--text-muted)]">{i+1}</td>
                        <td className="p-2 font-medium text-white">{a.name}</td>
                        <td className="p-2 font-['JetBrains_Mono']">{a.id}</td>
                        <td className="p-2 text-[var(--text-secondary)]">{a.bank}</td>
                        <td className="p-2 font-['JetBrains_Mono']">₹{((a.balance||0)/100000).toFixed(1)}L</td>
                        <td className="p-2 pl-4">{a.isSuspicious && <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>}</td>
                        <td className="p-2 right-0">
                          <button onClick={() => setAddedAccounts(addedAccounts.filter(x => x.id !== a.id))} className="text-[var(--text-muted)] hover:text-red-500 p-1"><X className="w-3 h-3" /></button>
                        </td>
                      </tr>
                    ))}
                    {addedAccounts.length === 0 && (
                      <tr><td colSpan={7} className="p-6 text-center text-[var(--text-muted)] border-0">No accounts added yet. Minimum 1 required.</td></tr>
                    )}
                 </tbody>
               </table>
            </div>

            <div className="flex justify-between items-center mt-4 border-t border-[rgba(0,245,255,0.2)] pt-5">
              <button onClick={() => setStep(1)} className="text-[var(--text-secondary)] hover:text-white px-4 py-2 text-sm tracking-wide transition-colors">← Back</button>
              <div className="flex items-center gap-4">
                 <span className="text-xs text-[var(--accent-cyan)] px-2 py-1 bg-[rgba(0,245,255,0.1)] rounded border border-[rgba(0,245,255,0.2)] font-bold">{addedAccounts.length} Accounts Added</span>
                 <button disabled={addedAccounts.length === 0} onClick={() => setStep(3)} className="bg-[var(--accent-cyan)] text-black px-6 py-2 rounded text-sm font-['Rajdhani'] font-bold tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next: Review →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-[pop-in_0.3s_ease-out]">
            <h2 className="text-lg font-bold font-['Rajdhani'] text-[var(--accent-cyan)] tracking-widest uppercase border-b border-[rgba(0,245,255,0.2)] pb-3 mb-5">
              REVIEW CASE — Step 3 of 3
            </h2>

            <div className="bg-[#050810] border border-[rgba(0,245,255,0.2)] rounded p-4 mb-5">
               <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.1)]">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full" style={{ backgroundColor: caseData.color }}></div>
                   <h3 className="text-lg text-white font-medium">{caseData.name} <span className="text-[var(--text-muted)] text-sm font-['JetBrains_Mono'] ml-2">({caseData.code})</span></h3>
                 </div>
                 <span className="text-[10px] px-2 py-1 rounded font-bold border border-[rgba(255,255,255,0.1)]">{caseData.priority} PRIORITY</span>
               </div>
               
               <div className="grid grid-cols-4 gap-4 text-xs">
                 <div className="flex flex-col gap-1"><span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Officer</span><span className="text-white">{caseData.officer || 'Unassigned'}</span></div>
                 <div className="flex flex-col gap-1"><span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Crime Type</span><span className="text-white">{caseData.type}</span></div>
                 <div className="flex flex-col gap-1"><span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Total Accounts</span><span className="text-white font-['JetBrains_Mono']">{addedAccounts.length}</span></div>
                 <div className="flex flex-col gap-1"><span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Total Balance</span><span className="text-[var(--accent-cyan)] font-bold font-['JetBrains_Mono']">₹{(addedAccounts.reduce((sum, a) => sum + (a.balance||0), 0) / 100000).toFixed(1)}L</span></div>
               </div>
            </div>

            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 border-b border-[rgba(255,255,255,0.1)] pb-1">Included Entities</h4>
            <div className="border border-[rgba(255,255,255,0.1)] rounded bg-[#0A1628] max-h-[160px] overflow-y-auto mb-6 custom-scrollbar">
               <table className="w-full text-left text-[11px]">
                 <thead className="bg-[#050810] sticky top-0 uppercase tracking-wider text-[var(--text-muted)]">
                   <tr>
                     <th className="p-2 border-b border-[rgba(255,255,255,0.1)]">Name</th>
                     <th className="p-2 border-b border-[rgba(255,255,255,0.1)]">Account No</th>
                     <th className="p-2 border-b border-[rgba(255,255,255,0.1)]">Bank</th>
                     <th className="p-2 border-b border-[rgba(255,255,255,0.1)]">Flagged</th>
                   </tr>
                 </thead>
                 <tbody>
                    {addedAccounts.map(a => (
                      <tr key={a.id} className="border-b border-[rgba(255,255,255,0.05)] text-white">
                        <td className="p-2 font-medium">{a.name}</td>
                        <td className="p-2 font-['JetBrains_Mono'] text-[var(--text-muted)]">{a.id}</td>
                        <td className="p-2">{a.bank}</td>
                        <td className="p-2">{a.isSuspicious ? 'YES' : 'NO'}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-[rgba(0,245,255,0.2)] pt-5">
              <button onClick={() => setStep(2)} className="text-[var(--text-secondary)] hover:text-white px-4 py-2 text-sm tracking-wide transition-colors">← Back</button>
              <button onClick={handleLaunch} className="bg-[var(--accent-cyan)] text-black flex-1 ml-4 py-3 rounded text-base font-['Rajdhani'] font-bold tracking-widest uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all">Launch Investigation</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
