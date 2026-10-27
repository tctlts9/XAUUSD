import React from 'react';
import { TradingSession } from '../../types/dashboard';
import { Clock, Zap } from 'lucide-react';

interface SessionsWidgetProps {
  sessions: TradingSession[];
}

export const SessionsWidget: React.FC<SessionsWidgetProps> = ({ sessions }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-white text-sm">Phiên Giao Dịch & Killzones (Giờ VN - GMT+7)</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Biến động Vàng cao nhất: 19:30 - 22:30</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {sessions.map((s, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all ${
              s.isActive
                ? 'bg-slate-800/80 border-amber-500/40 shadow-sm shadow-amber-500/5'
                : 'bg-slate-950/40 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{s.name}</span>
              {s.isActive && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Đang mở
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-slate-400">Khung giờ:</span>
              <span className="tabular-nums">{s.openTime} - {s.closeTime}</span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Độ biến động:</span>
              <span
                className={`font-semibold ${
                  s.volatility === 'Rất cao'
                    ? 'text-rose-400'
                    : s.volatility === 'Cao'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {s.volatility}
              </span>
            </div>

            {s.isKillzone && (
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[11px] text-amber-300">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Vùng quét thanh khoản vàng (Killzone)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
