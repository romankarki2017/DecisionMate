import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
  onToggleFrame: () => void;
  title?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  showFrame,
  onToggleFrame,
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showFrame) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Floating Toggle Controls on Desktop */}
        <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300 shadow-lg">
          <button
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            title="Switch to Android Phone View"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phone Frame</span>
          </button>
        </div>
        <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Top Floating Utility Bar for Preview Controls */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-sm mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span className="font-medium text-slate-300">DecisionMate Android Shell</span>
        </div>
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
        >
          <Maximize2 className="w-3 h-3 text-indigo-400" />
          <span>Expand View</span>
        </button>
      </div>

      {/* Android Device Mockup Container */}
      <div className="relative w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] bg-slate-950 text-slate-100 sm:rounded-[44px] shadow-2xl sm:shadow-indigo-950/50 sm:border-[8px] sm:border-slate-800/90 overflow-hidden flex flex-col ring-1 ring-slate-700/40">
        {/* Android Punch Hole Camera */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-1 ring-slate-800"></div>

        {/* Android System Status Bar */}
        <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-xs font-medium text-slate-300 select-none z-40 bg-slate-950/80 backdrop-blur-sm shrink-0">
          <span className="font-semibold text-[13px] tracking-tight">{currentTime}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] tabular-nums text-slate-300">98%</span>
              <Battery className="w-4 h-4 text-slate-300 fill-slate-300" />
            </div>
          </div>
        </div>

        {/* Mobile Viewport Scrollable Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="w-full h-5 flex items-center justify-center bg-slate-950 shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-600 rounded-full opacity-70"></div>
        </div>
      </div>
    </div>
  );
};
