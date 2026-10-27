import React from 'react';
import { Activity } from 'lucide-react';

export const XauusdTab: React.FC = () => {
  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
        <Activity className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">XAUUSD Tab</h2>
      <p className="text-sm text-slate-400 max-w-md">
        This tab is ready. You can add your XAUUSD market analysis, tools, or charts here.
      </p>
    </div>
  );
};
