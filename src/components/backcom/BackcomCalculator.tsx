import React, { useState } from 'react';
import { BrokerRebateRate } from '../../types/dashboard';
import { Calculator, Sparkles, TrendingUp, DollarSign, Wallet } from 'lucide-react';

interface BackcomCalculatorProps {
  brokerRates: BrokerRebateRate[];
}

export const BackcomCalculator: React.FC<BackcomCalculatorProps> = ({ brokerRates }) => {
  const [dailyLots, setDailyLots] = useState<number>(5);
  const [tradingDays, setTradingDays] = useState<number>(20);
  const [selectedBrokerKey, setSelectedBrokerKey] = useState<string>('Exness-Pro Account');
  const [customRebate, setCustomRebate] = useState<number>(3.5);

  const selectedRate = brokerRates.find(
    (b) => `${b.broker}-${b.accountType}` === selectedBrokerKey
  );

  const activeRebateRate = selectedBrokerKey === 'custom' ? customRebate : selectedRate?.goldRebatePerLot || 3.5;

  // Monthly & Yearly projections
  const monthlyLots = dailyLots * tradingDays;
  const monthlyCashbackUSD = monthlyLots * activeRebateRate;
  const monthlyCashbackVND = monthlyCashbackUSD * 25400;

  const yearlyLots = monthlyLots * 12;
  const yearlyCashbackUSD = monthlyCashbackUSD * 12;
  const yearlyCashbackVND = yearlyCashbackUSD * 25400;

  // Spread offset calculation: Average gold spread is ~$15 per standard lot.
  // Rebate / Spread cost:
  const spreadOffsetPercent = Math.min(Math.round((activeRebateRate / 15) * 100), 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white text-base">
            Dự Phóng Thu Nhập Thụ Động Từ Backcom (Rebate Projector)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Tỷ giá quy đổi: 1 USD = 25,400 VNĐ</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Sliders & Controls */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium">Khối lượng giao dịch mỗi ngày</label>
              <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                {dailyLots} Lots / ngày
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.5"
              value={dailyLots}
              onChange={(e) => setDailyLots(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.5 lot (Tập sự)</span>
              <span>5 lots (Scalper chuẩn)</span>
              <span>15+ lots (Day trader chuyên nghiệp)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium">Số ngày giao dịch trong tháng</label>
              <span className="font-mono font-bold text-slate-200 text-sm tabular-nums">
                {tradingDays} ngày
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              step="1"
              value={tradingDays}
              onChange={(e) => setTradingDays(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>10 ngày (Bán thời gian)</span>
              <span>20 ngày (Chuẩn các phiên trong tuần)</span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Chọn Sàn & Loại Tài Khoản</label>
            <select
              value={selectedBrokerKey}
              onChange={(e) => setSelectedBrokerKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
            >
              {brokerRates.map((b) => (
                <option key={`${b.broker}-${b.accountType}`} value={`${b.broker}-${b.accountType}`}>
                  {b.broker} - {b.accountType} (Hoàn ${b.goldRebatePerLot.toFixed(2)}/lot Vàng)
                </option>
              ))}
              <option value="custom">Tự điền mức hoàn tiền...</option>
            </select>
          </div>

          {selectedBrokerKey === 'custom' && (
            <div>
              <label className="text-slate-300 font-medium block mb-1">Mức hoàn tùy chỉnh ($/Lot)</label>
              <input
                type="number"
                step="0.1"
                value={customRebate}
                onChange={(e) => setCustomRebate(Math.max(Number(e.target.value), 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}
        </div>

        {/* Projections Card */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Ước Tính Thu Nhập Mỗi Tháng</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums mt-0.5">
                +${monthlyCashbackUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Quy ra tiền mặt (VNĐ)</span>
              <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
                ~{Math.round(monthlyCashbackVND).toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Tổng Volume Tháng</span>
              <span className="text-base font-bold font-mono text-amber-300 tabular-nums">
                {monthlyLots} Lots
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                Mức hoàn: ${activeRebateRate.toFixed(2)}/lot
              </span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Dự Phóng 1 Năm (12 tháng)</span>
              <span className="text-base font-bold font-mono text-emerald-300 tabular-nums">
                +${yearlyCashbackUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5 font-mono">
                ~{Math.round(yearlyCashbackVND / 1000000).toLocaleString('vi-VN')} Triệu VNĐ
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <Wallet className="w-3.5 h-3.5" />
              <span>Tiết kiệm {spreadOffsetPercent}% chi phí giao dịch</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300">
              Nhiều Day Trader giao dịch hòa vốn (Breakeven) trên tài khoản vẫn có thể mang về lợi nhuận đều đặn
              nhờ khoản hoàn tiền hoa hồng này được trả thẳng về tài khoản ngân hàng hoặc ví USDT!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
