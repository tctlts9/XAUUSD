import React, { useState } from 'react';
import { EconomicEvent } from '../../types/dashboard';
import { Calendar, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events }) => {
  const [impactFilter, setImpactFilter] = useState<'all' | 'high'>('all');

  const filteredEvents = events.filter((e) => {
    if (impactFilter === 'high') return e.impact === 'high';
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-white text-sm">Lịch Kinh Tế Tác Động Vàng (USD Data)</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setImpactFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                impactFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả tin
            </button>
            <button
              onClick={() => setImpactFilter('high')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                impactFilter === 'high'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chỉ tin Đỏ (High)
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              <th className="py-2.5 px-3">Thời gian</th>
              <th className="py-2.5 px-3">Sự kiện kinh tế</th>
              <th className="py-2.5 px-3 text-center">Tác động</th>
              <th className="py-2.5 px-3 font-mono text-right">Dự báo</th>
              <th className="py-2.5 px-3 font-mono text-right">Kỳ trước</th>
              <th className="py-2.5 px-3 font-mono text-right">Thực tế</th>
              <th className="py-2.5 px-3">Xu hướng XAUUSD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvents.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                  <span className="font-semibold text-white">{e.time}</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">{e.date}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-200">{e.event}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{e.description}</div>
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span
                    className={`font-semibold text-[11px] ${
                      e.impact === 'high'
                        ? 'text-rose-400'
                        : e.impact === 'medium'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {e.impact === 'high' ? 'Tin Đỏ' : 'Tin Cam'}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-right text-slate-300 tabular-nums">{e.forecast}</td>
                <td className="py-3 px-3 font-mono text-right text-slate-400 tabular-nums">{e.previous}</td>
                <td className="py-3 px-3 font-mono text-right font-semibold text-emerald-400 tabular-nums">
                  {e.actual || '—'}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {e.goldBias === 'Bullish Gold' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Tăng giá Vàng
                      </span>
                    ) : e.goldBias === 'Bearish Gold' ? (
                      <span className="text-rose-400 flex items-center gap-1 font-medium text-[11px]">
                        <TrendingDown className="w-3.5 h-3.5" />
                        Giảm giá Vàng
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Minus className="w-3.5 h-3.5" />
                        Trung lập / Quét 2 đầu
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
