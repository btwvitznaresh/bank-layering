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
  const { isAuthenticated, toasts, setSelectedAccountId, resetFilters } = useGlobalState();

  useEffect(() => {
    // Trigger initial stagger animations on mount or successful auth
    if (isAuthenticated) {
      setMounted(false);
      setTimeout(() => setMounted(true), 50);
    }
  }, [isAuthenticated]);



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

      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100]">
        {toasts.map(toast => {
          let borderColor = '#00E5FF';
          if (toast.type === 'error') borderColor = '#ff4444';
          if (toast.type === 'warning') borderColor = '#f5c842';
          
          return (
            <div key={toast.id} className="bg-[#0A0E1A] border-l-[3px] text-[#e0e0e0] px-4 py-3 rounded shadow-2xl animate-[pop-in_0.3s_ease-out] flex items-center min-w-[280px]" style={{ borderLeftColor: borderColor }}>
              <span className="font-['JetBrains_Mono'] text-xs font-medium tracking-wide">{toast.text}</span>
            </div>
          );
        })}
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;
