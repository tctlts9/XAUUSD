import React, { useState, useEffect } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { TradeOrder } from '../../types/dashboard';

interface RiskCalculatorProps {
  currentPrice: number;
  onAddOrder: (order: Omit<TradeOrder, 'id' | 'openDate' | 'status'>) => void;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  currentPrice,
  onAddOrder,
}) => {
  const [balance, setBalance] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState<number>(currentPrice);
  const [slPips, setSlPips] = useState<number>(30); // 30 pips = $3.00 on Gold
  const [tpPips, setTpPips] = useState<number>(60); // 60 pips = $6.00 on Gold
  const [leverage, setLeverage] = useState<number>(100);
  const [isLogged, setIsLogged] = useState(false);

  // Sync entry price when currentPrice changes if user hasn't heavily modified it
  useEffect(() => {
    if (Math.abs(entryPrice - currentPrice) > 10) {
      setEntryPrice(currentPrice);
    }
  }, [currentPrice]);

  // Derived calculations:
  // For Gold (XAUUSD): 1 Standard Lot = 100 troy ounces.
  // 1 pip in Gold = $0.10 price move.
  // 1 standard lot (1.00 lot) * $0.10 move = $10 / pip.
  // Risk in $ = Balance * (RiskPercent / 100)
  // Loss per lot for SL pips = slPips * 10
  // Lot size = Risk Amount / (slPips * 10)
  const riskAmount = (balance * riskPercent) / 100;
  const rawLot = slPips > 0 ? riskAmount / (slPips * 10) : 0;
  const lotSize = Math.max(Math.round(rawLot * 100) / 100, 0.01);

  // Exact Stop Loss and Take Profit prices
  const slPrice =
    tradeType === 'BUY'
      ? Math.round((entryPrice - slPips * 0.1) * 100) / 100
      : Math.round((entryPrice + slPips * 0.1) * 100) / 100;

  const tpPrice =
    tradeType === 'BUY'
      ? Math.round((entryPrice + tpPips * 0.1) * 100) / 100
      : Math.round((entryPrice - tpPips * 0.1) * 100) / 100;

  const rewardAmount = lotSize * (tpPips * 10);
  const rrRatio = slPips > 0 ? (tpPips / slPips).toFixed(2) : '0';

  // Margin Required = (Lot * 100 oz * Entry Price) / Leverage
  const requiredMargin = Math.round(((lotSize * 100 * entryPrice) / leverage) * 100) / 100;
  const marginLevelPercent = requiredMargin > 0 ? ((balance / requiredMargin) * 100).toFixed(0) : '0';

  const handleLogTrade = () => {
    onAddOrder({
      symbol: 'XAUUSD',
      type: tradeType,
      lot: lotSize,
      entryPrice,
      stopLoss: slPrice,
      takeProfit: tpPrice,
      pnl: 0,
      riskAmount: Math.round(riskAmount),
      rewardAmount: Math.round(rewardAmount),
      notes: `R:R 1:${rrRatio} · SL ${slPips} pips · Ký quỹ $${requiredMargin}`,
    });
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-base">Máy Tính Khối Lượng Vàng (XAUUSD)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">1 Lot = 100 oz · $10/pip</span>
        </div>

        {/* Trade Type Selection */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setTradeType('BUY')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tradeType === 'BUY'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            MUA / LONG VÀNG
          </button>
          <button
            onClick={() => setTradeType('SELL')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tradeType === 'SELL'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 ring-1 ring-rose-400'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            BÁN / SHORT VÀNG
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Số dư tài khoản ($)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Math.max(Number(e.target.value), 100))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Rủi ro mỗi lệnh (%)</label>
            <div className="flex items-center gap-1.5">
              {[0.5, 1.0, 2.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setRiskPercent(pct)}
                  className={`px-2 py-1.5 rounded text-[11px] font-semibold transition-colors ${
                    riskPercent === pct
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <input
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Math.max(Number(e.target.value), 0.1))}
                className="w-16 bg-slate-950 border border-slate-700/80 rounded px-2 py-1.5 text-white font-mono text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Giá vào lệnh (Entry $)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => setEntryPrice(currentPrice)}
                className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 rounded whitespace-nowrap"
                title="Lấy giá hiện tại"
              >
                Giá live
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Đòn bẩy sàn</label>
            <select
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-amber-400"
            >
              <option value={100}>1:100 (Chuẩn Prop Firm)</option>
              <option value={200}>1:200</option>
              <option value={500}>1:500 (Exness / IC)</option>
              <option value={1000}>1:1000</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400">Stop Loss (Pip)</label>
              <span className="text-rose-400 font-mono text-[11px]">${slPrice.toFixed(2)}</span>
            </div>
            <input
              type="number"
              value={slPips}
              onChange={(e) => setSlPips(Math.max(Number(e.target.value), 5))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400">Take Profit (Pip)</label>
              <span className="text-emerald-400 font-mono text-[11px]">${tpPrice.toFixed(2)}</span>
            </div>
            <input
              type="number"
              value={tpPips}
              onChange={(e) => setTpPips(Math.max(Number(e.target.value), 10))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono font-medium focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Calculation Result Hero Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Khối Lượng Khuyên Dùng</span>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {lotSize.toFixed(2)} <span className="text-sm font-normal text-slate-300">Lots</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Tỷ lệ Risk : Reward</span>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                1 : {rrRatio}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Rủi ro mất ($)</span>
              <span className="font-mono font-semibold text-rose-400 tabular-nums">-${riskAmount.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Lợi nhuận mục tiêu</span>
              <span className="font-mono font-semibold text-emerald-400 tabular-nums">+${rewardAmount.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Ký quỹ cần (Margin)</span>
              <span className="font-mono font-semibold text-sky-400 tabular-nums">${requiredMargin.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          onClick={handleLogTrade}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isLogged
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
        >
          {isLogged ? (
            <>
              <Check className="w-4 h-4" />
              <span>Đã lưu vào Nhật Ký Lệnh</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Ghi Nhận Lệnh Quản Trị Rủi Ro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
