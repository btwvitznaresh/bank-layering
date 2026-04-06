import { useState, useEffect } from 'react';
import { Zone1Navbar } from './components/Zone1Navbar';
import { Zone2Sidebar } from './components/Zone2Sidebar';
import { Zone3Graph } from './components/Zone3Graph';
import { Zone4Inspector } from './components/Zone4Inspector';
import { Zone5Footer } from './components/Zone5Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { LiveTicker } from './components/LiveTicker';
import { useGlobalState } from './context/GlobalStateContext';

function App() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, toastMessage, setToastMessage, setSelectedAccountId, resetFilters } = useGlobalState();

  useEffect(() => {
    // Trigger initial stagger animations on mount or successful auth
    if (isAuthenticated) {
      setMounted(false);
      setTimeout(() => setMounted(true), 50);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 1800);
      return () => clearTimeout(t);
    }
  }, [toastMessage, setToastMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if inside input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;

      switch(e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          document.getElementById('filter-input')?.focus();
          break;
        case 't':
          e.preventDefault();
          document.getElementById('trace-source-input')?.focus();
          break;
        case 'r':
          e.preventDefault();
          resetFilters();
          break;
        case 'g':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('fit-graph'));
          break;
        case 'escape':
          e.preventDefault();
          setSelectedAccountId(null);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetFilters, setSelectedAccountId]);

  if (!isAuthenticated) return <Login />;

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen flex flex-col bg-transparent overflow-hidden">
      {/* Zone 1: Top Navbar */}
      <div 
        className="transition-all duration-700 ease-out z-20"
        style={{ 
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          opacity: mounted ? 1 : 0,
          transitionDelay: '0ms'
        }}
      >
        <Zone1Navbar />
      </div>

      {/* Middle Section: Sidebar + Graph Canvas + Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Zone 2: Left Sidebar */}
        <div 
          className="transition-all duration-700 ease-out z-10"
          style={{ 
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            opacity: mounted ? 1 : 0,
            transitionDelay: '80ms'
          }}
        >
          <Zone2Sidebar />
        </div>

        {/* Zone 3: Main Graph Canvas */}
        <div 
          className="flex-1 transition-all duration-700 ease-out relative z-0"
          style={{ 
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            opacity: mounted ? 1 : 0,
            transitionDelay: '160ms'
          }}
        >
          <Zone3Graph />
        </div>

        {/* Zone 4: Right Inspector */}
        <Zone4Inspector />
      </div>

      <div 
        className="transition-all duration-700 ease-out z-20 flex flex-col"
        style={{ 
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          opacity: mounted ? 1 : 0,
          transitionDelay: '320ms'
        }}
      >
        <LiveTicker />
        <Zone5Footer />
      </div>

      {toastMessage && (
        <div key={toastMessage.id} className="fixed bottom-24 right-8 bg-[rgba(8,16,32,0.95)] border border-[rgba(255,255,255,0.1)] text-white px-5 py-3 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[100] animate-[pop-in_0.3s_ease-out] flex items-center gap-3 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]"></div>
          <span className="font-['DM_Sans'] text-sm">{toastMessage.text}</span>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}

export default App;
