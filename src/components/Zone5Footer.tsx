import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { globalStats } from '../data/mockData';

interface AnimatedCountProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCount: React.FC<AnimatedCountProps> = ({ 
  endValue, prefix = '', suffix = '', decimals = 0, duration = 1.5 
}) => {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (countRef.current) {
      const countUp = new CountUp(countRef.current, endValue, {
        duration,
        prefix,
        suffix,
        decimalPlaces: decimals,
        useEasing: true,
        smartEasingThreshold: 999,
        smartEasingAmount: 333,
        // Since we specify easeOutExpo essentially, default easing of countup.js is easeOutExpo
      });
      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
  }, [endValue, duration, prefix, suffix, decimals]);

  return <span ref={countRef} className="font-['Rajdhani'] font-bold text-[var(--accent-cyan)] px-1" />;
};

export const Zone5Footer: React.FC = () => {
  return (
    <div className="h-[48px] border-t border-[var(--border-subtle)] bg-[rgba(5,8,16,0.9)] flex items-center justify-between px-6 z-10 backdrop-blur-md relative" style={{boxShadow: '0 -1px 0 rgba(0,245,255,0.1)'}}>
      {/* Keyboard Shortcuts Hint Bar on the left */}
      <div className="flex items-center gap-4 text-[11px] font-['DM_Sans'] text-[var(--text-muted)] opacity-70">
        <div className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] border border-white/5">F</span> Filter</div>
        <div className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] border border-white/5">T</span> Trace</div>
        <div className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] border border-white/5">R</span> Reset</div>
        <div className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] border border-white/5">G</span> Fit</div>
        <div className="flex items-center gap-1.5"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] border border-white/5">ESC</span> Close</div>
      </div>

      {/* Stats */}
      <div className="flex items-center h-full">
        <div className="flex items-center px-4 border-r border-[var(--border-subtle)] h-full">
          <span className="text-base mr-2">📊</span>
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1 uppercase font-['Rajdhani']">Total Accounts:</span>
          <AnimatedCount endValue={globalStats.totalAccounts} />
        </div>
        
        <div className="flex items-center px-4 border-r border-[var(--border-subtle)] h-full">
          <span className="text-base mr-2">💰</span>
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1 uppercase font-['Rajdhani']">Volume:</span>
          <AnimatedCount endValue={18.4} prefix="₹" suffix=" Cr" decimals={1} />
        </div>
        
        <div className="flex items-center px-4 border-r border-[var(--border-subtle)] h-full">
          <span className="text-base mr-2">🚩</span>
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1 uppercase font-['Rajdhani']">Flagged Accounts:</span>
          <AnimatedCount endValue={globalStats.flaggedAccounts} />
        </div>
        
        <div className="flex items-center px-4 border-r border-[var(--border-subtle)] h-full">
          <span className="text-base mr-2">📁</span>
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1 uppercase font-['Rajdhani']">Active Cases:</span>
          <AnimatedCount endValue={globalStats.activeCases} />
        </div>
        
        <div className="flex items-center px-4 h-full">
          <span className="text-base mr-2 text-[var(--accent-red)]">⚠</span>
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1 uppercase font-['Rajdhani']">Suspicious Patterns:</span>
          <AnimatedCount endValue={globalStats.suspiciousPatterns} />
        </div>
      </div>
      
      {/* Top cyan glow line */}
      <div className="absolute top-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-[rgba(0,245,255,0.3)] to-transparent"></div>
    </div>
  );
};
