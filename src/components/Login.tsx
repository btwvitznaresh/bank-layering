import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Eye, EyeOff } from 'lucide-react';

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&family=Orbitron:wght@600;700&display=swap');

        .login-scope *, .login-scope *::before, .login-scope *::after { box-sizing: border-box; }
        
        .login-scope {
          --cyan: #00e5ff;
          --cyan-glow: rgba(0, 229, 255, 0.4);
          --card-bg: rgba(2, 10, 24, 0.75);
          --input-bg: rgba(0, 10, 25, 0.58);
          --border: rgba(0, 229, 255, 0.25);
          width: 100vw; height: 100vh;
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
          position: relative;
          z-index: 50;
        }

        .login-scope .video-wrap {
          position: fixed; inset: 0; z-index: 0;
        }
        .login-scope .video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.55) saturate(1.2);
        }
        .login-scope .video-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 60% 50%, rgba(0,10,30,0.3) 0%, rgba(0,5,18,0.65) 100%);
        }

        .login-scope .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 3px,
            rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
          );
        }

        .login-scope .page {
          position: absolute; inset: 0; z-index: 2;
          display: flex; align-items: center; justify-content: center;
        }

        @keyframes shake-err {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake-err 0.4s ease-in-out; border-color: #ff6b6b !important; }

        .login-scope .card {
          width: 460px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 26px;
          padding: 52px 46px 42px;
          backdrop-filter: blur(28px) saturate(140%);
          -webkit-backdrop-filter: blur(28px) saturate(140%);
          box-shadow:
            0 0 0 1px rgba(0,229,255,0.08) inset,
            0 8px 64px rgba(0,0,0,0.75),
            0 0 80px rgba(0,229,255,0.07);
          animation: cardIn 0.9s cubic-bezier(0.22,1,0.36,1) both;
          position: relative;
        }
        .login-scope .card::before {
          content: ''; position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent);
          border-radius: 26px 26px 0 0;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-scope .logo-area {
          text-align: center; margin-bottom: 32px;
          animation: fadeUp 0.6s 0.1s both;
        }
        .login-scope .shield-wrap {
          width: 54px; height: 54px;
          margin: 0 auto 15px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .login-scope .shield-wrap svg { width: 100%; height: 100%; filter: drop-shadow(0 0 12px var(--cyan)); }
        .login-scope .pulse-ring {
          position: absolute; inset: -10px; border-radius: 50%;
          border: 1px solid rgba(0,229,255,0.5);
          animation: pulse 2.6s ease-out infinite; opacity: 0;
        }
        @keyframes pulse {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        .login-scope .logo-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.95rem; font-weight: 700;
          letter-spacing: 0.06em; color: #ffffff;
          text-shadow: 0 0 30px var(--cyan-glow), 0 2px 4px rgba(0,0,0,0.8);
        }
        .login-scope .logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem; letter-spacing: 0.18em;
          color: rgba(0,229,255,0.7);
          margin-top: 6px; text-transform: uppercase;
        }

        .login-scope .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent);
          margin-bottom: 28px;
        }

        .login-scope .form-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.24em;
          background: linear-gradient(90deg, #f5c842, #ffaa00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          margin-bottom: 18px; display: block;
          animation: fadeUp 0.6s 0.2s both;
          text-shadow: none;
          filter: drop-shadow(0 0 6px rgba(255,180,0,0.5));
        }

        .login-scope .field {
          position: relative; margin-bottom: 14px;
          animation: fadeUp 0.6s 0.28s both;
        }
        .login-scope .field + .field { animation-delay: 0.36s; }

        .login-scope .field input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid rgba(0,229,255,0.22);
          border-radius: 13px;
          padding: 15px 46px 15px 18px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.02rem; font-weight: 600;
          color: #ffffff; outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          letter-spacing: 0.03em;
        }
        .login-scope .field input::placeholder {
          color: rgba(255,255,255,0.36);
          font-weight: 500;
        }
        .login-scope .field input:focus {
          border-color: rgba(0,229,255,0.55);
          background: rgba(0,15,35,0.72);
          box-shadow: 0 0 0 3px rgba(0,229,255,0.1);
        }
        .login-scope .field input.error {
          border-color: #ff6b6b;
        }

        .login-scope .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.4); transition: color 0.2s;
          display: flex; align-items: center;
        }
        .login-scope .eye-btn:hover { color: var(--cyan); }

        .login-scope .clearance-field { animation: fadeUp 0.6s 0.44s both; }
        .login-scope .clearance-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.48);
          text-transform: uppercase;
          display: block; margin-bottom: 8px; margin-top: 4px;
        }
        .login-scope .select-wrap { position: relative; }
        .login-scope .select-wrap select {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid rgba(0,229,255,0.22);
          border-radius: 13px;
          padding: 15px 42px 15px 18px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.02rem; font-weight: 600;
          color: #ffffff; outline: none; -webkit-appearance: none; cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          letter-spacing: 0.03em;
        }
        .login-scope .select-wrap select:focus {
          border-color: rgba(0,229,255,0.55);
          background: rgba(0,15,35,0.72);
          box-shadow: 0 0 0 3px rgba(0,229,255,0.1);
        }
        .login-scope .select-wrap select option { background: #060f22; color: #fff; }
        .login-scope .select-wrap::after {
          content: '▾'; position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          color: var(--cyan); pointer-events: none; font-size: 0.9rem;
        }

        .login-scope .btn {
          width: 100%; margin-top: 24px; padding: 16px;
          background: linear-gradient(135deg, #00cfeb, #0099cc);
          border: 1px solid rgba(0,229,255,0.6);
          border-radius: 13px;
          font-family: 'Orbitron', monospace;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.22em; color: #000d1a;
          cursor: pointer; text-transform: uppercase;
          position: relative; overflow: hidden;
          transition: box-shadow 0.3s, filter 0.2s, transform 0.15s;
          animation: fadeUp 0.6s 0.52s both;
        }
        .login-scope .btn::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transition: left 0.5s;
        }
        .login-scope .btn:hover::before { left: 160%; }
        .login-scope .btn:hover {
          box-shadow: 0 0 28px var(--cyan-glow), 0 0 56px rgba(0,229,255,0.22);
          filter: brightness(1.08);
        }
        .login-scope .btn:active { transform: scaleY(0.97); filter: brightness(0.92); }

        .login-scope .warn {
          margin-top: 20px; text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.67rem; letter-spacing: 0.1em;
          animation: fadeUp 0.6s 0.6s both;
          line-height: 1.5;
        }
        .login-scope .warn-icon {
          color: #f5c842; font-style: normal; text-shadow: 0 0 10px rgba(245,200,66,0.7);
        }
        .login-scope .warn-text {
          color: #ff6b6b; text-shadow: 0 0 12px rgba(255,80,80,0.5); font-weight: 600; letter-spacing: 0.08em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-scope">
        <div className="video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/login-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="scanlines"></div>

        <div className="page">
          <div className={`card ${isShaking ? 'animate-shake' : ''}`}>
            
            <div className="logo-area">
              <div className="shield-wrap">
                <div className="pulse-ring"></div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="logo-name">BankTrace</div>
              <div className="logo-sub">Financial Crime Intelligence</div>
            </div>

            <div className="divider"></div>

            <form onSubmit={handleLogin}>
              <span className="form-label">INVESTIGATOR LOGIN</span>
              
              <div className="field">
                <input 
                  type="text" 
                  placeholder="Badge ID or Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={emptyUserErr || errorStatus === 'invalid' ? 'error' : ''}
                />
              </div>
              
              <div className="field relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Passphrase" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={emptyPassErr || errorStatus === 'invalid' ? 'error' : ''}
                />
                <button 
                  type="button" 
                  className="eye-btn absolute right-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>

              <div className="clearance-field">
                <label className="clearance-label">Clearance Level</label>
                <div className="select-wrap">
                  <select value={clearance} onChange={(e) => setClearance(e.target.value)}>
                    <option value="Inspector">Inspector</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="DSP">DSP</option>
                    <option value="SSP">SSP</option>
                    <option value="DGP">DGP</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn">ACCESS SYSTEM</button>

              {errorStatus === 'invalid' && (
                <div className="warn" style={{ marginTop: '12px' }}>
                  <span className="warn-text">Access denied. Invalid credentials.</span>
                </div>
              )}

              <div className="warn">
                <span className="warn-icon">⚠️</span> 
                <span className="warn-text">UNAUTHORIZED ACCESS IS A CRIMINAL OFFENCE<br/>UNDER IT ACT 2000</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
