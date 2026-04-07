import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RiskBadgeProps {
  score: number;
  factors: { name: string; impact: number }[];
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, factors, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  let riskTheme = 'text-[var(--accent-green)] border-[var(--accent-green)] shadow-[0_0_8px_rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]';
  let extraAnim = '';
  if (score > 70) {
       riskTheme = 'text-[var(--accent-red)] border-[var(--accent-red)] shadow-[0_0_10px_rgba(255,59,59,0.4)] bg-[rgba(255,59,59,0.1)]';
       extraAnim = 'animate-pulse';
  } else if (score >= 40) {
       riskTheme = 'text-[var(--accent-gold)] border-[var(--accent-gold)] shadow-[0_0_8px_rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]';
  }

  const renderBlocks = (impact: number) => {
    // 1 block = ~2 impact points, max 10 blocks
    const totalBlocks = 10;
    const filled = Math.min(totalBlocks, Math.ceil(impact / 2));
    const empty = totalBlocks - filled;
    
    return (
      <div className="flex gap-[1px]">
        {Array.from({ length: filled }).map((_, i) => (
          <div key={`filled-${i}`} className="w-[4px] h-[10px] bg-gradient-to-t from-[var(--accent-red)] to-[var(--accent-gold)] rounded-[1px]"></div>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <div key={`empty-${i}`} className="w-[4px] h-[10px] bg-white/10 rounded-[1px]"></div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="relative group cursor-pointer inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={twMerge(`text-[9px] px-1.5 py-0.5 rounded border border-opacity-50 font-['JetBrains_Mono'] ${riskTheme} ${extraAnim}`, className)}>
        Risk: {score}
      </span>

      {isOpen && (
        <div className="absolute top-full my-2 right-0 md:left-1/2 md:-translate-x-1/2 z-50 bg-[rgba(10,14,26,0.95)] border border-[rgba(0,229,255,0.2)] backdrop-blur-md p-3 rounded shadow-[0_4px_25px_rgba(0,0,0,0.8)] w-60 animate-[pop-in_0.2s_ease-out]">
          <h4 className="text-[10px] text-[var(--accent-cyan)] font-['DM_Sans'] font-bold tracking-widest uppercase mb-3 border-b border-[rgba(0,229,255,0.1)] pb-1">Risk Breakdown</h4>
          <div className="flex flex-col gap-2">
            {factors.map((f, i) => (
               <div key={i} className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
                 <span className="text-[var(--text-secondary)] whitespace-nowrap overflow-hidden text-ellipsis w-24" title={f.name}>{f.name}</span>
                 <div className="flex items-center gap-2">
                    {renderBlocks(f.impact)}
                    <span className="text-[var(--accent-red)] w-6 text-right font-medium">+{f.impact}</span>
                 </div>
               </div>
            ))}
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[11px] font-bold mt-1 pt-2 border-t border-[rgba(255,255,255,0.1)]">
              <span className="text-white">Total Score:</span>
              <span className={score > 70 ? 'text-[var(--accent-red)]' : score >= 40 ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-green)]'}>{score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
