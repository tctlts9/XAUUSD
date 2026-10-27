import React, { useState } from 'react';
import { BackcomRecord, BrokerRebateRate } from '../../types/dashboard';
import { X, Coins } from 'lucide-react';

interface AddBackcomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: BackcomRecord) => void;
  brokerRates: BrokerRebateRate[];
}

export const AddBackcomModal: React.FC<AddBackcomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  brokerRates,
}) => {
  const [broker, setBroker] = useState(brokerRates[0]?.broker || 'Exness');
  const [tradingAccountId, setTradingAccountId] = useState('');
  const [symbol, setSymbol] = useState('XAUUSD');
  const [lots, setLots] = useState<number>(5.0);
  const [rebatePerLot, setRebatePerLot] = useState<number>(3.5);
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Pending');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleBrokerChange = (selectedBroker: string) => {
    setBroker(selectedBroker);
    const matched = brokerRates.find((b) => b.broker === selectedBroker);
    if (matched) {
      setRebatePerLot(symbol === 'XAUUSD' ? matched.goldRebatePerLot : matched.fxRebatePerLot);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalRebate = Math.round(lots * rebatePerLot * 100) / 100;
    const today = new Date().toISOString().split('T')[0];

    const newRecord: BackcomRecord = {
      id: `bc-${Date.now()}`,
      date: today,
      broker,
      tradingAccountId: tradingAccountId || 'ACC-882104',
      symbol,
      lots: Number(lots),
      rebatePerLot: Number(rebatePerLot),
      totalRebate,
      status,
      paidDate: status === 'Paid' ? today : undefined,
      notes: notes || undefined,
    };

    onSave(newRecord);
    onClose();
  };

  const calculatedTotal = Math.round(lots * rebatePerLot * 100) / 100;
  const vndEquivalent = Math.round(calculatedTotal * 25400).toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Ghi Nhận Lô Giao Dịch & Backcom</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Sàn Giao Dịch (Broker)</label>
              <select
                value={broker}
                onChange={(e) => handleBrokerChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
              >
                {Array.from(new Set(brokerRates.map((b) => b.broker))).map((bName) => (
                  <option key={bName} value={bName}>
                    {bName}
                  </option>
                ))}
                <option value="Khác">Sàn khác</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Số Tài Khoản MT4/MT5</label>
              <input
                type="text"
                placeholder="VD: EX-918231"
                value={tradingAccountId}
                onChange={(e) => setTradingAccountId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Cặp Giao Dịch</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
              >
                <option value="XAUUSD">XAUUSD (Vàng)</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="BTCUSD">BTCUSD</option>
                <option value="US30">US30 / DJ30</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Khối lượng (Lots)</label>
              <input
                type="number"
                step="0.01"
                value={lots}
                onChange={(e) => setLots(Math.max(Number(e.target.value), 0.01))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Mức Hoàn ($/Lot)</label>
              <input
                type="number"
                step="0.1"
                value={rebatePerLot}
                onChange={(e) => setRebatePerLot(Math.max(Number(e.target.value), 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Trạng thái thanh toán</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('Pending')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  status === 'Pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Chờ Thanh Toán
              </button>
              <button
                type="button"
                onClick={() => setStatus('Paid')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  status === 'Paid'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Đã Nhận Tiền
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Ghi chú (Tùy chọn)</label>
            <input
              type="text"
              placeholder="VD: Scalp phiên Mỹ, Lệnh swing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Result preview */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Số tiền Backcom nhận được:</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                +${calculatedTotal.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Quy đổi ước tính (VNĐ):</span>
              <span className="text-sm font-semibold font-mono text-slate-200 tabular-nums">
                ~{vndEquivalent} đ
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Lưu Giao Dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
