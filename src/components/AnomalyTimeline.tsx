import React, { useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { transactions } from '../data/mockData';

interface AnomalyTimelineProps {
  timelineVal: number;
  setTimelineVal: (val: number) => void;
  formattedDate: string;
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({ timelineVal, setTimelineVal, formattedDate }) => {
  const minDate = new Date('2023-01-01').getTime();
  const maxDate = new Date('2024-12-31').getTime();
  const step = 86400000 * 7; // Group by week for markers

  const { severeMarks, monitoredMarks } = useMemo(() => {
    const numBins = Math.ceil((maxDate - minDate) / step);
    const b = Array(numBins).fill(null).map((_, i) => ({
      time: minDate + (i * step),
      volume: 0,
      flags: 0
    }));

    transactions.forEach(tx => {
      const t = new Date(tx.date).getTime();
      const binIdx = Math.floor((t - minDate) / step);
      if (binIdx >= 0 && binIdx < numBins) {
        b[binIdx].volume += 1;
        if (tx.isSuspicious) b[binIdx].flags += 1;
      }
    });

    const severe: number[] = [];
    const monitored: number[] = [];

    b.forEach(x => {
      if (x.flags > 0) severe.push(x.time);
      else if (x.volume > 2) monitored.push(x.time);
    });

    return { severeMarks: severe, monitoredMarks: monitored };
  }, [minDate, maxDate, step]);

  return (
    <div className="absolute top-4 left-6 right-6 z-10 glass-panel rounded-lg px-6 flex flex-col max-w-3xl mx-auto shadow-[0_4px_20px_rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.1)] py-2 bg-black/60 backdrop-blur-md h-[48px] justify-center">
      <div className="flex justify-between items-center w-full relative">
        <span className="text-[10px] font-['DM_Sans'] font-bold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5 w-[140px] flex-shrink-0">
          <div className="w-1.5 h-1.5 bg-[#FF6B00] shadow-[0_0_5px_rgba(255,107,0,0.8)] rounded-full animate-pulse"></div>
          Anomaly Timeline
        </span>

        <div className="flex-1 px-4 relative flex items-center h-full">
          {/* Custom tick marks container */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1.5 pointer-events-none z-10">
            {severeMarks.map(time => (
              <div 
                key={`sev-${time}`} 
                className="absolute top-0 bottom-0 w-[2px] bg-[var(--accent-red)] shadow-[0_0_5px_rgba(255,59,59,0.8)]" 
                style={{ left: `${((time - minDate) / (maxDate - minDate)) * 100}%` }}
              />
            ))}
            {monitoredMarks.map(time => (
              <div 
                key={`mon-${time}`} 
                className="absolute top-0 bottom-0 w-[2px] bg-[var(--accent-gold)] shadow-[0_0_4px_rgba(255,215,0,0.5)]" 
                style={{ left: `${((time - minDate) / (maxDate - minDate)) * 100}%` }}
              />
            ))}
          </div>
          
          <div className="w-full">
            <Slider 
              min={minDate} 
              max={maxDate} 
              step={86400000} // 1 day
              value={timelineVal}
              onChange={(val) => setTimelineVal(val as number)}
              styles={{
                track: { backgroundColor: '#FF6B00', height: 4 },
                handle: { 
                  backgroundColor: '#FF6B00', 
                  borderColor: '#fff', 
                  borderWidth: 2,
                  boxShadow: '0 0 10px rgba(255,107,0,0.8)', 
                  marginTop: -5, 
                  width: 14, 
                  height: 14,
                  opacity: 1
                },
                rail: { backgroundColor: '#1e2a38', height: 4 }
              }}
            />
          </div>
        </div>

        <span className="text-[11px] font-['JetBrains_Mono'] text-white bg-black/50 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)] w-[90px] text-center flex-shrink-0">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
