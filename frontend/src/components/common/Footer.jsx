import React from 'react';
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-8 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center border border-purple-500/30">
            <span>🎲</span>
          </div>
          <div>
            <span className="font-bold text-white text-base">DiceRoll</span>
            <p className="text-xs text-slate-500">Virtual Dice Gaming Platform</p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl max-w-xl text-center md:text-left text-xs text-slate-400">
          <ShieldCheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong className="text-slate-200">Entertainment Only:</strong> DiceRoll uses ONLY non-monetary virtual coins with NO real-world financial value. Coins cannot be withdrawn or exchanged for money.
          </span>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500 text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} DiceRoll. All rights reserved.</p>
          <p className="text-purple-400/80 font-mono text-[10px]">Built with React 19 & Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
