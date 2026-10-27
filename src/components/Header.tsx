import React from 'react';
import { TabType } from '../types/dashboard';
import { Activity, ShieldCheck, Coins } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'xauusd':
        return 'XAUUSD';
      case 'propfirm':
        return 'Prop Firm';
      case 'backcom':
        return 'Backcom';
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-8 h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-[11px] sm:text-xs tracking-wider shrink-0">
              XAU
            </div>
            <a
              href="#"
              className="text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
            >
              XAUUSD <span className="text-amber-400 font-normal">TRADING</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('xauusd')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'xauusd'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>XAUUSD</span>
            </button>

            <button
              onClick={() => onTabChange('propfirm')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'propfirm'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Prop Firm</span>
            </button>

            <button
              onClick={() => onTabChange('backcom')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'backcom'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Backcom</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Active Tab Indicator */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* Active Tab Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                activeTab === 'xauusd'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : activeTab === 'propfirm'
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {activeTab === 'xauusd' && <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
              {activeTab === 'propfirm' && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
              {activeTab === 'backcom' && <Coins className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="tracking-tight">{getTabLabel(activeTab)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
