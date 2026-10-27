import React, { useState } from 'react';
import { PropFirmAccount } from '../../types/dashboard';
import { X, ShieldCheck, DollarSign } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: PropFirmAccount) => void;
  initialAccount?: PropFirmAccount | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAccount,
}) => {
  const [firmName, setFirmName] = useState(initialAccount?.firmName || 'FTMO');
  const [accountNumber, setAccountNumber] = useState(initialAccount?.accountNumber || '');
  const [accountType, setAccountType] = useState<PropFirmAccount['accountType']>(
    initialAccount?.accountType || 'Phase 1'
  );
  const [initialBalance, setInitialBalance] = useState(initialAccount?.initialBalance || 100000);
  const [currentBalance, setCurrentBalance] = useState(initialAccount?.currentBalance || 100000);
  const [currentEquity, setCurrentEquity] = useState(initialAccount?.currentEquity || 100000);
  const [dailyLossLimitPercent, setDailyLossLimitPercent] = useState(
    initialAccount?.dailyLossLimitPercent || 5
  );
  const [maxDrawdownPercent, setMaxDrawdownPercent] = useState(
    initialAccount?.maxDrawdownPercent || 10
  );
  const [profitTargetPercent, setProfitTargetPercent] = useState(
    initialAccount?.profitTargetPercent ?? 10
  );
  const [profitSplit, setProfitSplit] = useState(initialAccount?.profitSplit || 80);
  const [minTradingDays, setMinTradingDays] = useState(initialAccount?.minTradingDays || 4);
  const [tradingDaysPassed, setTradingDaysPassed] = useState(
    initialAccount?.tradingDaysPassed || 1
  );
  const [drawdownType, setDrawdownType] = useState<PropFirmAccount['drawdownType']>(
    initialAccount?.drawdownType || 'Balance-based'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: PropFirmAccount = {
      id: initialAccount?.id || `prop-${Date.now()}`,
      firmName,
      accountNumber: accountNumber || `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
      accountType,
      initialBalance: Number(initialBalance),
      currentBalance: Number(currentBalance),
      currentEquity: Number(currentEquity),
      dailyLossLimitPercent: Number(dailyLossLimitPercent),
      maxDrawdownPercent: Number(maxDrawdownPercent),
      profitTargetPercent: Number(profitTargetPercent),
      dailyStartingEquity: Number(currentBalance), // snapshot today
      tradingDaysPassed: Number(tradingDaysPassed),
      minTradingDays: Number(minTradingDays),
      profitSplit: Number(profitSplit),
      drawdownType,
      status: accountType === 'Funded' ? 'Active' : 'Active',
      lastUpdated: 'Vừa xong',
    };
    onSave(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              {initialAccount ? 'Chỉnh Sửa Tài Khoản Quỹ' : 'Thêm Tài Khoản Quỹ Cấp Vốn Mới'}
            </h3>
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
              <label className="text-slate-400 block mb-1">Tên Quỹ (Prop Firm)</label>
              <select
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="FTMO">FTMO</option>
                <option value="Funding Pips">Funding Pips</option>
                <option value="FundedNext">FundedNext</option>
                <option value="Alpha Capital Group">Alpha Capital Group</option>
                <option value="The5ers">The5ers</option>
                <option value="Khác">Khác / Custom</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Số Tài Khoản MT4/MT5</label>
              <input
                type="text"
                placeholder="VD: 219842"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Giai đoạn (Phase)</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as PropFirmAccount['accountType'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="Phase 1">Vòng 1 (Challenge)</option>
                <option value="Phase 2">Vòng 2 (Verification)</option>
                <option value="Funded">Tài Khoản Live (Funded)</option>
                <option value="Instant">Cấp Vốn Ngay (Instant)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Loại Drawdown</label>
              <select
                value={drawdownType}
                onChange={(e) => setDrawdownType(e.target.value as PropFirmAccount['drawdownType'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="Balance-based">Balance-based (Theo số dư ngày)</option>
                <option value="Equity-based Trailing">Equity Trailing (Bám theo vốn)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Vốn ban đầu ($)</label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Balance hiện tại ($)</label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Equity hiện tại ($)</label>
              <input
                type="number"
                value={currentEquity}
                onChange={(e) => setCurrentEquity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Lỗ tối đa ngày (%)</label>
              <input
                type="number"
                value={dailyLossLimitPercent}
                onChange={(e) => setDailyLossLimitPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Max Drawdown (%)</label>
              <input
                type="number"
                value={maxDrawdownPercent}
                onChange={(e) => setMaxDrawdownPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Mục tiêu lãi (%)</label>
              <input
                type="number"
                value={profitTargetPercent}
                onChange={(e) => setProfitTargetPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Tỷ lệ ăn chia (%)</label>
              <input
                type="number"
                value={profitSplit}
                onChange={(e) => setProfitSplit(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Số ngày đã trade</label>
              <input
                type="number"
                value={tradingDaysPassed}
                onChange={(e) => setTradingDaysPassed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Số ngày tối thiểu</label>
              <input
                type="number"
                value={minTradingDays}
                onChange={(e) => setMinTradingDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {initialAccount ? 'Lưu Thay Đổi' : 'Thêm Tài Khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
