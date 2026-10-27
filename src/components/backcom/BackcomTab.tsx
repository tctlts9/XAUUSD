import React from 'react';
import { Coins } from 'lucide-react';

export const BackcomTab: React.FC = () => {
  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
        <Coins className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Backcom Tab</h2>
      <p className="text-sm text-slate-400 max-w-md">
        This tab is ready. You can add your broker cashback commissions, rebate tracking, or volume calculation tools here.
      </p>
    </div>
  );
};
