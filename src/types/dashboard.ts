export type TabType = 'xauusd' | 'propfirm' | 'backcom';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  currency: 'USD' | 'EUR' | 'GBP';
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  goldBias: 'Bullish Gold' | 'Bearish Gold' | 'Neutral';
  description: string;
}

export interface TradingSession {
  name: string;
  city: string;
  openTime: string; // Vietnam time (GMT+7)
  closeTime: string;
  isActive: boolean;
  isKillzone: boolean;
  volatility: 'Thấp' | 'Trung bình' | 'Cao' | 'Rất cao';
}

export interface TradeOrder {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lot: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  pnl: number;
  status: 'OPEN' | 'CLOSED';
  openDate: string;
  closeDate?: string;
  riskAmount: number;
  rewardAmount: number;
  notes?: string;
}

export interface PropFirmAccount {
  id: string;
  firmName: string; // e.g. FTMO, Funding Pips, FundedNext
  accountNumber: string;
  accountType: 'Phase 1' | 'Phase 2' | 'Funded' | 'Instant';
  initialBalance: number;
  currentBalance: number;
  currentEquity: number;
  dailyLossLimitPercent: number; // e.g. 5%
  maxDrawdownPercent: number; // e.g. 10%
  profitTargetPercent: number; // e.g. 10% for phase 1, 5% for phase 2, 0% for funded
  dailyStartingEquity: number; // Snapshot at 00:00 server time
  tradingDaysPassed: number;
  minTradingDays: number;
  profitSplit: number; // e.g. 80% or 90%
  drawdownType: 'Balance-based' | 'Equity-based Trailing';
  status: 'Active' | 'Passed' | 'Violated' | 'Payout Ready';
  lastUpdated: string;
}

export interface PropFirmRulePreset {
  name: string;
  dailyLoss: number;
  maxLoss: number;
  phase1Target: number;
  phase2Target: number;
  profitSplit: number;
  minDays: number;
  newsAllowed: boolean;
  weekendAllowed: boolean;
  payoutCycle: string;
  trustScore: string;
}

export interface BrokerRebateRate {
  broker: string;
  accountType: string;
  goldRebatePerLot: number; // $ per lot
  fxRebatePerLot: number;
  cryptoRebatePerLot: number;
  payoutSchedule: string;
  minPayout: number;
  note: string;
}

export interface BackcomRecord {
  id: string;
  date: string;
  broker: string;
  tradingAccountId: string;
  symbol: string;
  lots: number;
  rebatePerLot: number;
  totalRebate: number;
  status: 'Paid' | 'Pending';
  paidDate?: string;
  notes?: string;
}
