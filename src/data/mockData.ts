import {
  Candle,
  EconomicEvent,
  TradingSession,
  TradeOrder,
  PropFirmAccount,
  PropFirmRulePreset,
  BrokerRebateRate,
  BackcomRecord,
} from '../types/dashboard';

// Generate realistic XAUUSD historical candles
export function generateInitialGoldCandles(count = 40): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = 2724.5;
  const now = Date.now();
  const stepMs = 15 * 60 * 1000; // 15-minute bars

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * stepMs;
    const dateObj = new Date(timestamp);
    const time = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
    
    // Slight random walk with gold volatility
    const change = (Math.random() - 0.48) * 3.8;
    const open = Math.round(currentPrice * 100) / 100;
    const close = Math.round((open + change) * 100) / 100;
    const high = Math.round((Math.max(open, close) + Math.random() * 2.2) * 100) / 100;
    const low = Math.round((Math.min(open, close) - Math.random() * 2.2) * 100) / 100;
    const volume = Math.floor(800 + Math.random() * 3200);

    candles.push({
      time,
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
    currentPrice = close;
  }

  // Calculate EMA 20 and EMA 50
  let ema20 = candles[0].close;
  const k20 = 2 / (20 + 1);
  let ema50 = candles[0].close;
  const k50 = 2 / (50 + 1);

  candles.forEach((c) => {
    ema20 = c.close * k20 + ema20 * (1 - k20);
    ema50 = c.close * k50 + ema50 * (1 - k50);
    c.ema20 = Math.round(ema20 * 100) / 100;
    c.ema50 = Math.round(ema50 * 100) / 100;
  });

  return candles;
}

export const INITIAL_GOLD_SESSIONS: TradingSession[] = [
  {
    name: 'Phiên Á (Sydney / Tokyo)',
    city: 'Tokyo',
    openTime: '06:00',
    closeTime: '14:00',
    isActive: false,
    isKillzone: false,
    volatility: 'Thấp',
  },
  {
    name: 'Phiên Âu (London)',
    city: 'London',
    openTime: '14:00',
    closeTime: '22:30',
    isActive: true,
    isKillzone: true,
    volatility: 'Cao',
  },
  {
    name: 'Phiên Mỹ (New York)',
    city: 'New York',
    openTime: '19:30',
    closeTime: '04:00',
    isActive: true,
    isKillzone: true,
    volatility: 'Rất cao',
  },
  {
    name: 'London - NY Overlap (Giờ Vàng)',
    city: 'London + NY',
    openTime: '19:30',
    closeTime: '22:30',
    isActive: true,
    isKillzone: true,
    volatility: 'Rất cao',
  },
];

export const INITIAL_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '19:30',
    date: 'Hôm nay',
    currency: 'USD',
    event: 'Core CPI m/m (Chỉ số giá tiêu dùng cốt lõi)',
    impact: 'high',
    forecast: '0.3%',
    previous: '0.3%',
    actual: '0.2%',
    goldBias: 'Bullish Gold',
    description: 'Lạm phát thấp hơn dự kiến làm giảm lợi suất Trái phiếu Mỹ và suy yếu DXY, hỗ trợ Vàng bứt phá tăng.',
  },
  {
    id: 'eco-2',
    time: '21:00',
    date: 'Hôm nay',
    currency: 'USD',
    event: 'US Flash Manufacturing & Services PMI',
    impact: 'medium',
    forecast: '51.5',
    previous: '50.9',
    goldBias: 'Neutral',
    description: 'Chỉ số đo lường sức khỏe ngành sản xuất và dịch vụ Mỹ. Biến động biên độ trung bình 40-70 pip.',
  },
  {
    id: 'eco-3',
    time: '19:30',
    date: 'Ngày mai',
    currency: 'USD',
    event: 'Initial Jobless Claims (Đơn xin trợ cấp thất nghiệp)',
    impact: 'high',
    forecast: '218K',
    previous: '224K',
    goldBias: 'Bearish Gold',
    description: 'Nếu thị trường lao động Mỹ vững mạnh, kỳ vọng hạ lãi suất Fed chậm lại, áp lực điều chỉnh cho XAUUSD.',
  },
  {
    id: 'eco-4',
    time: '01:00',
    date: 'Thứ 6',
    currency: 'USD',
    event: 'FOMC Meeting Minutes (Biên bản họp Fed)',
    impact: 'high',
    forecast: '-',
    previous: '-',
    goldBias: 'Neutral',
    description: 'Manh mối quan trọng về lộ trình lãi suất của Chủ tịch Powell. Rủi ro quét thanh khoản 2 đầu rất mạnh.',
  },
];

export const INITIAL_PROP_ACCOUNTS: PropFirmAccount[] = [
  {
    id: 'prop-1',
    firmName: 'FTMO',
    accountNumber: '21098452',
    accountType: 'Phase 1',
    initialBalance: 100000,
    currentBalance: 105420,
    currentEquity: 105680,
    dailyLossLimitPercent: 5,
    maxDrawdownPercent: 10,
    profitTargetPercent: 10,
    dailyStartingEquity: 104800,
    tradingDaysPassed: 8,
    minTradingDays: 4,
    profitSplit: 80,
    drawdownType: 'Balance-based',
    status: 'Active',
    lastUpdated: '10 phút trước',
  },
  {
    id: 'prop-2',
    firmName: 'Funding Pips',
    accountNumber: '5841029',
    accountType: 'Funded',
    initialBalance: 50000,
    currentBalance: 52890,
    currentEquity: 52890,
    dailyLossLimitPercent: 5,
    maxDrawdownPercent: 10,
    profitTargetPercent: 0,
    dailyStartingEquity: 52400,
    tradingDaysPassed: 14,
    minTradingDays: 0,
    profitSplit: 85,
    drawdownType: 'Balance-based',
    status: 'Payout Ready',
    lastUpdated: '3 phút trước',
  },
  {
    id: 'prop-3',
    firmName: 'FundedNext',
    accountNumber: 'FN-99381',
    accountType: 'Phase 2',
    initialBalance: 100000,
    currentBalance: 103250,
    currentEquity: 102900,
    dailyLossLimitPercent: 5,
    maxDrawdownPercent: 10,
    profitTargetPercent: 5,
    dailyStartingEquity: 103500,
    tradingDaysPassed: 6,
    minTradingDays: 5,
    profitSplit: 90,
    drawdownType: 'Balance-based',
    status: 'Active',
    lastUpdated: '25 phút trước',
  },
];

export const PROP_FIRM_PRESETS: PropFirmRulePreset[] = [
  {
    name: 'FTMO Standard',
    dailyLoss: 5,
    maxLoss: 10,
    phase1Target: 10,
    phase2Target: 5,
    profitSplit: 80,
    minDays: 4,
    newsAllowed: true,
    weekendAllowed: true,
    payoutCycle: '14 ngày',
    trustScore: '9.8/10 (Top 1 uy tín)',
  },
  {
    name: 'Funding Pips (2-Step)',
    dailyLoss: 5,
    maxLoss: 10,
    phase1Target: 8,
    phase2Target: 5,
    profitSplit: 85,
    minDays: 0,
    newsAllowed: true,
    weekendAllowed: false,
    payoutCycle: 'Mỗi 5 ngày làm việc',
    trustScore: '9.4/10 (Phí thi rẻ nhất)',
  },
  {
    name: 'FundedNext Stellar',
    dailyLoss: 5,
    maxLoss: 10,
    phase1Target: 8,
    phase2Target: 5,
    profitSplit: 90,
    minDays: 5,
    newsAllowed: true,
    weekendAllowed: true,
    payoutCycle: '14 ngày + 15% chia sẻ vòng thi',
    trustScore: '9.2/10 (Hỗ trợ nạp rút VNĐ)',
  },
  {
    name: 'Alpha Capital Group',
    dailyLoss: 4,
    maxLoss: 8,
    phase1Target: 8,
    phase2Target: 4,
    profitSplit: 80,
    minDays: 0,
    newsAllowed: true,
    weekendAllowed: true,
    payoutCycle: '7-14 ngày',
    trustScore: '9.0/10 (Miễn phí đòn bẩy)',
  },
];

export const BROKER_REBATE_RATES: BrokerRebateRate[] = [
  {
    broker: 'Exness',
    accountType: 'Pro Account',
    goldRebatePerLot: 3.5,
    fxRebatePerLot: 2.5,
    cryptoRebatePerLot: 1.5,
    payoutSchedule: 'Hàng ngày (Instant qua Ví nội bộ)',
    minPayout: 5,
    note: 'Khớp lệnh tức thời, hoàn trực tiếp vào tài khoản MT4/MT5',
  },
  {
    broker: 'Exness',
    accountType: 'Standard Account',
    goldRebatePerLot: 6.0,
    fxRebatePerLot: 4.0,
    cryptoRebatePerLot: 2.0,
    payoutSchedule: 'Hàng ngày',
    minPayout: 5,
    note: 'Spread thả nổi cao hơn, mức hoàn tiền hấp dẫn nhất cho Scalper',
  },
  {
    broker: 'Exness',
    accountType: 'Raw Spread',
    goldRebatePerLot: 2.2,
    fxRebatePerLot: 1.8,
    cryptoRebatePerLot: 1.0,
    payoutSchedule: 'Hàng ngày',
    minPayout: 5,
    note: 'Spread 0.0 pip, hoàn trên phí hoa hồng thực trả',
  },
  {
    broker: 'IC Markets',
    accountType: 'Raw Spread (ECN)',
    goldRebatePerLot: 1.8,
    fxRebatePerLot: 1.5,
    cryptoRebatePerLot: 1.0,
    payoutSchedule: 'Thứ 2 hàng tuần qua USDT/Bank',
    minPayout: 20,
    note: 'Khớp lệnh cTrader/MT5 trượt giá cực thấp, uy tín toàn cầu',
  },
  {
    broker: 'XM Global',
    accountType: 'Standard / Micro',
    goldRebatePerLot: 6.5,
    fxRebatePerLot: 4.5,
    cryptoRebatePerLot: 2.0,
    payoutSchedule: 'Thứ 3 và Thứ 5 hàng tuần',
    minPayout: 10,
    note: 'Tặng kèm điểm thưởng Loyalty point song song cùng Backcom',
  },
  {
    broker: 'Vantage Markets',
    accountType: 'Raw ECN',
    goldRebatePerLot: 2.5,
    fxRebatePerLot: 2.0,
    cryptoRebatePerLot: 1.5,
    payoutSchedule: 'Hàng tuần',
    minPayout: 20,
    note: 'Hỗ trợ nạp rút cổng nội địa Việt Nam tốc độ cao',
  },
];

export const INITIAL_BACKCOM_RECORDS: BackcomRecord[] = [
  {
    id: 'bc-1',
    date: '2026-10-21',
    broker: 'Exness',
    tradingAccountId: 'EX-918231',
    symbol: 'XAUUSD',
    lots: 8.5,
    rebatePerLot: 3.5,
    totalRebate: 29.75,
    status: 'Pending',
    notes: 'Scalping phiên Âu London breakout',
  },
  {
    id: 'bc-2',
    date: '2026-10-20',
    broker: 'Exness',
    tradingAccountId: 'EX-918231',
    symbol: 'XAUUSD',
    lots: 14.0,
    rebatePerLot: 3.5,
    totalRebate: 49.0,
    status: 'Paid',
    paidDate: '2026-10-21',
    notes: 'Giao dịch theo tin tức Core CPI',
  },
  {
    id: 'bc-3',
    date: '2026-10-19',
    broker: 'IC Markets',
    tradingAccountId: 'IC-440192',
    symbol: 'XAUUSD',
    lots: 12.0,
    rebatePerLot: 1.8,
    totalRebate: 21.6,
    status: 'Paid',
    paidDate: '2026-10-20',
    notes: 'Swing trade hỗ trợ khung H4',
  },
  {
    id: 'bc-4',
    date: '2026-10-18',
    broker: 'Exness',
    tradingAccountId: 'EX-554109',
    symbol: 'XAUUSD',
    lots: 22.5,
    rebatePerLot: 6.0,
    totalRebate: 135.0,
    status: 'Paid',
    paidDate: '2026-10-19',
    notes: 'Tài khoản Standard lướt sóng vàng',
  },
  {
    id: 'bc-5',
    date: '2026-10-17',
    broker: 'XM Global',
    tradingAccountId: 'XM-810923',
    symbol: 'XAUUSD',
    lots: 10.0,
    rebatePerLot: 6.5,
    totalRebate: 65.0,
    status: 'Paid',
    paidDate: '2026-10-18',
    notes: 'Giao dịch phiên Mỹ',
  },
  {
    id: 'bc-6',
    date: '2026-10-16',
    broker: 'Exness',
    tradingAccountId: 'EX-918231',
    symbol: 'XAUUSD',
    lots: 16.5,
    rebatePerLot: 3.5,
    totalRebate: 57.75,
    status: 'Paid',
    paidDate: '2026-10-17',
    notes: 'Scalp cản 2740',
  },
  {
    id: 'bc-7',
    date: '2026-10-15',
    broker: 'Vantage Markets',
    tradingAccountId: 'VT-330198',
    symbol: 'XAUUSD',
    lots: 8.0,
    rebatePerLot: 2.5,
    totalRebate: 20.0,
    status: 'Paid',
    paidDate: '2026-10-16',
    notes: 'Phiên London',
  },
];

export const INITIAL_ORDERS: TradeOrder[] = [
  {
    id: 'ord-101',
    symbol: 'XAUUSD',
    type: 'BUY',
    lot: 0.5,
    entryPrice: 2728.4,
    stopLoss: 2723.4,
    takeProfit: 2743.4,
    pnl: 520.0,
    status: 'OPEN',
    openDate: 'Hôm nay, 15:30',
    riskAmount: 250,
    rewardAmount: 750,
    notes: 'Test cản S1 Pivot + Retest EMA 20',
  },
  {
    id: 'ord-100',
    symbol: 'XAUUSD',
    type: 'SELL',
    lot: 0.8,
    entryPrice: 2742.0,
    stopLoss: 2746.5,
    takeProfit: 2731.0,
    pnl: 880.0,
    status: 'CLOSED',
    openDate: 'Hôm qua, 19:45',
    closeDate: 'Hôm qua, 21:10',
    riskAmount: 360,
    rewardAmount: 880,
    notes: 'Reject vùng kháng cự R1 sau tin CPI',
  },
  {
    id: 'ord-99',
    symbol: 'XAUUSD',
    type: 'BUY',
    lot: 0.6,
    entryPrice: 2719.5,
    stopLoss: 2715.0,
    takeProfit: 2730.0,
    pnl: 630.0,
    status: 'CLOSED',
    openDate: '20/10, 14:15',
    closeDate: '20/10, 16:30',
    riskAmount: 270,
    rewardAmount: 630,
    notes: 'Bắt đáy phiên London, breakout trendline M15',
  },
];
