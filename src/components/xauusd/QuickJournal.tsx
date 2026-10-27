import React from 'react';
import { TradeOrder } from '../../types/dashboard';
import { BookOpen, CheckCircle2, XCircle, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface QuickJournalProps {
  orders: TradeOrder[];
  currentPrice: number;
  onCloseOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
}

export const QuickJournal: React.FC<QuickJournalProps> = ({
  orders,
  currentPrice,
  onCloseOrder,
  onDeleteOrder,
}) => {
  // Compute floating PnL for open orders
  // For Gold: 1 lot * $1.00 move = $100 ($10 per pip)
  const calculatedOrders = orders.map((ord) => {
    if (ord.status === 'OPEN') {
      const priceDiff = ord.type === 'BUY' ? currentPrice - ord.entryPrice : ord.entryPrice - currentPrice;
      const floatingPnL = Math.round(ord.lot * 100 * priceDiff * 100) / 100;
      return { ...ord, pnl: floatingPnL };
    }
    return ord;
  });

  const totalOpenPnL = calculatedOrders
    .filter((o) => o.status === 'OPEN')
    .reduce((sum, o) => sum + o.pnl, 0);

  const totalRealizedPnL = calculatedOrders
    .filter((o) => o.status === 'CLOSED')
    .reduce((sum, o) => sum + o.pnl, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-white text-sm">Nhật Ký Lệnh Vàng Trực Tiếp</h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 mr-1.5">Floating PnL:</span>
            <span className={`font-bold tabular-nums ${totalOpenPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalOpenPnL >= 0 ? `+$${totalOpenPnL.toFixed(2)}` : `-$${Math.abs(totalOpenPnL).toFixed(2)}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400 mr-1.5">Đã chốt:</span>
            <span className={`font-bold tabular-nums ${totalRealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalRealizedPnL >= 0 ? `+$${totalRealizedPnL.toFixed(2)}` : `-$${Math.abs(totalRealizedPnL).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          Chưa có lệnh nào được ghi nhận. Sử dụng máy tính khối lượng bên trên để lên kế hoạch và lưu lệnh.
        </div>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Lệnh</th>
                <th className="py-2.5 px-3 font-mono text-right">Khối lượng</th>
                <th className="py-2.5 px-3 font-mono text-right">Giá vào</th>
                <th className="py-2.5 px-3 font-mono text-right">Stop Loss</th>
                <th className="py-2.5 px-3 font-mono text-right">Take Profit</th>
                <th className="py-2.5 px-3 font-mono text-right">P&L ($)</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {calculatedOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span
                        className={`font-bold text-xs ${
                          ord.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {ord.type}
                      </span>
                      <span className="text-slate-300 font-medium">{ord.symbol}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{ord.openDate}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-200 tabular-nums">
                    {ord.lot.toFixed(2)} lot
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    ${ord.entryPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 tabular-nums">
                    ${ord.stopLoss.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">
                    ${ord.takeProfit.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    <span
                      className={`font-bold text-sm ${
                        ord.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {ord.pnl >= 0 ? `+$${ord.pnl.toFixed(2)}` : `-$${Math.abs(ord.pnl).toFixed(2)}`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                    {ord.status === 'OPEN' ? (
                      <span className="text-amber-400 font-medium text-[11px]">Đang chạy</span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Đã đóng</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-sans whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {ord.status === 'OPEN' && (
                        <button
                          onClick={() => onCloseOrder(ord.id)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                          title="Đóng lệnh này ở giá hiện tại"
                        >
                          Chốt lệnh
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteOrder(ord.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Xóa lệnh khỏi nhật ký"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
