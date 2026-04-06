import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Shield, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { setIsAuthenticated } = useGlobalState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clearance, setClearance] = useState('Inspector');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'idle' | 'empty' | 'invalid'>('idle');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorStatus('empty');
      triggerShake();
      return;
    }

    if (username === 'admin' && password === 'banktrace123') {
      setErrorStatus('idle');
      // Adding a slight delay to allow the fade out animation to look smooth.
      // In this specific implementation, state toggle immediately flips App rendering.
      // We will let App handle the fade-in stagger directly via the global toggle.
      setIsAuthenticated(true);
    } else {
      setErrorStatus('invalid');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const emptyUserErr = errorStatus === 'empty' && !username.trim();
  const emptyPassErr = errorStatus === 'empty' && !password.trim();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative z-50">
      <style>{`
        @keyframes shake-err {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake-err 0.4s ease-in-out; }
        .login-card-bg {
          backdrop-filter: blur(20px);
          background: rgba(8, 16, 32, 0.85);
          border: 1px solid rgba(0, 245, 255, 0.15);
        }
      `}</style>

      <div 
        className={`login-card-bg w-[420px] p-[40px] rounded-[16px] flex flex-col items-center shadow-[0_0_40px_rgba(0,245,255,0.05)] transition-all ${isShaking ? 'animate-shake' : ''}`}
      >
        <Shield className="w-10 h-10 text-[var(--accent-cyan)] mb-3" />
        <h1 className="font-['Rajdhani'] font-bold text-[28px] text-[var(--text-primary)] leading-tight">BankTrace</h1>
        <p className="text-[13px] text-[var(--text-muted)] font-['Oxanium'] mb-6">Financial Crime Intelligence Platform</p>
        
        <div className="w-full h-[1px] bg-[rgba(0,245,255,0.1)] mb-6"></div>

        <span className="font-['Oxanium'] font-bold text-[11px] text-[var(--accent-cyan)] tracking-[2px] uppercase mb-4 w-full text-left">
          INVESTIGATOR LOGIN
        </span>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col w-full relative">
            <input 
              type="text" 
              placeholder="Badge ID or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-[rgba(0,0,0,0.4)] border rounded p-3 text-[14px] font-['Oxanium'] text-white focus:outline-none transition-colors 
                ${emptyUserErr || errorStatus === 'invalid' ? 'border-[var(--accent-red)]' : 'border-[rgba(0,245,255,0.15)] focus:border-[var(--accent-cyan)]'}`}
            />
          </div>

          <div className="flex flex-col w-full relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter passphrase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-[rgba(0,0,0,0.4)] border rounded p-3 pr-10 text-[14px] font-['Oxanium'] text-white focus:outline-none transition-colors 
                ${emptyPassErr || errorStatus === 'invalid' ? 'border-[var(--accent-red)]' : 'border-[rgba(0,245,255,0.15)] focus:border-[var(--accent-cyan)]'}`}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[50%] translate-y-[-50%] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-[11px] text-[var(--text-muted)] font-['Oxanium'] uppercase tracking-wider mb-1.5">
              Clearance Level
            </label>
            <select 
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(0,245,255,0.15)] rounded p-3 text-[14px] font-['Oxanium'] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)] appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300F5FF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px top 50%', backgroundSize: '10px auto' }}
            >
              <option value="Inspector">Inspector</option>
              <option value="Sub-Inspector">Sub-Inspector</option>
              <option value="DSP">DSP</option>
              <option value="SSP">SSP</option>
              <option value="DGP">DGP</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-[var(--accent-cyan)] text-black font-['Rajdhani'] font-bold text-[15px] p-3 rounded mt-2 hover:bg-white transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] cursor-pointer"
          >
            ACCESS SYSTEM
          </button>

          {errorStatus === 'invalid' && (
            <p className="text-[var(--accent-red)] text-[12px] font-medium font-['Oxanium'] text-center mt-1 animate-[fade-in_0.2s_ease-out]">
              Access denied. Invalid credentials.
            </p>
          )}
        </form>

        <p className="text-[var(--accent-red)] text-[11px] font-medium font-['Oxanium'] text-center mt-6 w-full opacity-80">
          Unauthorized access is a criminal offence under IT Act 2000
        </p>
      </div>
    </div>
  );
};
