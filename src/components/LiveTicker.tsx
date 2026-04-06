import React from 'react';

export const LiveTicker: React.FC = () => {
  return (
    <div className="h-[32px] bg-[rgba(8,16,32,0.95)] border-t border-[rgba(0,245,255,0.1)] flex items-center overflow-hidden relative z-10 w-full shrink-0">
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-[rgba(8,16,32,1)] z-20 flex items-center border-r border-[rgba(0,245,255,0.1)] shadow-[10px_0_15px_rgba(8,16,32,0.95)]">
        <span className="text-[10px] font-['DM_Sans'] font-bold text-[var(--accent-cyan)] tracking-widest uppercase">
          ● LIVE FEED
        </span>
      </div>
      <div className="flex whitespace-nowrap overflow-hidden w-full font-['JetBrains_Mono'] text-[11px] h-full items-center ml-[120px]">
        <div className="inline-block animate-marquee pl-[100%] h-full flex items-center gap-16">
          <span className="flex items-center gap-2 text-[var(--accent-red)]">
            <span className="text-[8px] animate-pulse">●</span> ACC003 → ACC008 · ₹18,50,000 · FLAGGED · 2m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-gold)]">
            <span className="text-[8px] animate-pulse">●</span> ACC012 → ACC017 · ₹45,00,000 · MONITORED · 7m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-green)]">
            <span className="text-[8px] animate-pulse">●</span> ACC001 → ACC007 · ₹12,40,000 · NORMAL · 11m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-red)]">
            <span className="text-[8px] animate-pulse">●</span> ACC019 → ACC024 · ₹78,90,000 · VPN DETECTED · 13m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-gold)]">
            <span className="text-[8px] animate-pulse">●</span> ACC007 → ACC012 · ₹1,24,00,000 · INTER-CASE · 18m ago
          </span>
          
          {/* Duplicate for seamless scrolling */}
          <span className="flex items-center gap-2 text-[var(--accent-red)]">
            <span className="text-[8px] animate-pulse">●</span> ACC003 → ACC008 · ₹18,50,000 · FLAGGED · 2m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-gold)]">
            <span className="text-[8px] animate-pulse">●</span> ACC012 → ACC017 · ₹45,00,000 · MONITORED · 7m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-green)]">
            <span className="text-[8px] animate-pulse">●</span> ACC001 → ACC007 · ₹12,40,000 · NORMAL · 11m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-red)]">
            <span className="text-[8px] animate-pulse">●</span> ACC019 → ACC024 · ₹78,90,000 · VPN DETECTED · 13m ago
          </span>
          <span className="flex items-center gap-2 text-[var(--accent-gold)]">
            <span className="text-[8px] animate-pulse">●</span> ACC007 → ACC012 · ₹1,24,00,000 · INTER-CASE · 18m ago
          </span>
        </div>
      </div>
    </div>
  );
};
