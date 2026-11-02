import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none">
      <div className="w-full flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/50"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/25 border border-indigo-500/30 ring-4 ring-indigo-500/10">
            <img
              src="/src/assets/images/decisionmate_app_icon_1793603384138.jpg"
              alt="DecisionMate Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 rounded-3xl border border-indigo-400/20 pointer-events-none"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-white mb-2"
        >
          DecisionMate
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-sm font-medium text-indigo-300 tracking-wide"
        >
          Think Clearly. Choose Confidently.
        </motion.p>
      </div>

      {/* Bottom Loading Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full flex flex-col items-center pb-6 gap-3"
      >
        <div className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>
        <span className="text-[11px] text-slate-500">AI-Powered Decision Assistant</span>
      </motion.div>
    </div>
  );
};
