import React, { useState, useMemo } from 'react';
import { Candle } from '../../types/dashboard';
import { Play, Pause, BarChart2, TrendingUp, Layers } from 'lucide-react';

interface GoldChartProps {
  candles: Candle[];
  currentPrice: number;
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
}

export const GoldChart: React.FC<GoldChartProps> = ({
  candles,
  currentPrice,
  timeframe,
  onTimeframeChange,
  isSimulating,
  onToggleSimulate,
}) => {
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showEma, setShowEma] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Chart dimensions
  const width = 860;
  const height = 400;
  const padding = { top: 25, right: 65, bottom: 45, left: 15 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const volumeHeight = showVolume ? 60 : 0;
  const priceChartHeight = chartHeight - volumeHeight - 10;

  // Min and max calculations
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (candles.length === 0) return { minPrice: 2700, maxPrice: 2750, maxVolume: 1000 };
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const buffer = (max - min) * 0.1 || 2;
    return {
      minPrice: min - buffer,
      maxPrice: max + buffer,
      maxVolume: maxVol,
    };
  }, [candles]);

  const priceRange = maxPrice - minPrice || 1;

  // Coordinate mappers
  const getY = (price: number) => {
    return padding.top + priceChartHeight - ((price - minPrice) / priceRange) * priceChartHeight;
  };

  const getX = (index: number) => {
    const step = chartWidth / Math.max(candles.length - 1, 1);
    return padding.left + index * step;
  };

  const getVolY = (volume: number) => {
    const ratio = volume / (maxVolume || 1);
    const top = padding.top + priceChartHeight + 10;
    return top + volumeHeight - ratio * volumeHeight;
  };

  // EMA paths
  const ema20Path = useMemo(() => {
    if (!showEma) return '';
    return candles
      .filter((c) => c.ema20)
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.ema20!)}`)
      .join(' ');
  }, [candles, showEma, minPrice, maxPrice]);

  const ema50Path = useMemo(() => {
    if (!showEma) return '';
    return candles
      .filter((c) => c.ema50)
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.ema50!)}`)
      .join(' ');
  }, [candles, showEma, minPrice, maxPrice]);

  // Line path for line chart
  const linePath = useMemo(() => {
    if (chartType !== 'line') return '';
    return candles
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.close)}`)
      .join(' ');
  }, [candles, chartType, minPrice, maxPrice]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Price axis grid lines
  const gridLevels = 5;
  const gridPriceSteps = useMemo(() => {
    const step = priceRange / (gridLevels - 1);
    return Array.from({ length: gridLevels }, (_, i) => minPrice + i * step);
  }, [minPrice, priceRange]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">XAUUSD Spot</span>
          <span className="text-xs text-slate-400 font-mono">Gold / US Dollar</span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-emerald-400 font-mono font-medium tabular-nums">
            Spread: 1.5 pip ($0.15)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            {['M5', 'M15', 'H1', 'H4', 'D1'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1 text-xs rounded transition-colors ${
                chartType === 'candles' ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Biểu đồ Nến Nhật"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1 text-xs rounded transition-colors ${
                chartType === 'line' ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Biểu đồ Đường"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator toggles */}
          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
              showEma
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>EMA 20/50</span>
          </button>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              showVolume
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Vol
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulate}
            className={`px-2.5 py-1 text-xs rounded border flex items-center gap-1.5 transition-colors ${
              isSimulating
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Bật/Tắt cập nhật giá theo thời gian thực"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3 h-3 text-emerald-400" />
                <span className="font-medium">Live Tick</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-400" />
                <span>Tạm dừng</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Crosshair / Candle details ribbon */}
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-xs font-mono bg-slate-950/60 border-b border-slate-800/60 text-slate-400">
          <span className="text-slate-300 font-medium">Thời gian: {activeCandle.time}</span>
          <span>O: <strong className="text-slate-200 tabular-nums">{activeCandle.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-emerald-400 tabular-nums">{activeCandle.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-rose-400 tabular-nums">{activeCandle.low.toFixed(2)}</strong></span>
          <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 tabular-nums' : 'text-rose-400 tabular-nums'}>{activeCandle.close.toFixed(2)}</strong></span>
          <span>Vol: <strong className="text-cyan-400 tabular-nums">{activeCandle.volume.toLocaleString()}</strong></span>
          {showEma && activeCandle.ema20 && (
            <span className="text-amber-400">EMA20: <strong className="tabular-nums">{activeCandle.ema20.toFixed(2)}</strong></span>
          )}
          {showEma && activeCandle.ema50 && (
            <span className="text-sky-400">EMA50: <strong className="tabular-nums">{activeCandle.ema50.toFixed(2)}</strong></span>
          )}
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden select-none bg-slate-950/30">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * width;
            const index = Math.round(((mouseX - padding.left) / chartWidth) * (candles.length - 1));
            if (index >= 0 && index < candles.length) {
              setHoverIndex(index);
            }
          }}
        >
          {/* Horizontal Grid lines & Price Labels */}
          {gridPriceSteps.map((price, idx) => {
            const y = getY(price);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padding.right + 6}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Volume separator */}
          {showVolume && (
            <line
              x1={padding.left}
              y1={padding.top + priceChartHeight + 10}
              x2={width - padding.right}
              y2={padding.top + priceChartHeight + 10}
              stroke="#1e293b"
              strokeWidth="1"
            />
          )}

          {/* Volume Bars */}
          {showVolume &&
            candles.map((c, i) => {
              const x = getX(i);
              const y = getVolY(c.volume);
              const barHeight = padding.top + priceChartHeight + 10 + volumeHeight - y;
              const isUp = c.close >= c.open;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - 2.5}
                  y={y}
                  width={5}
                  height={Math.max(barHeight, 1)}
                  fill={isUp ? '#10b981' : '#f43f5e'}
                  opacity={hoverIndex === i ? 0.9 : 0.35}
                />
              );
            })}

          {/* EMA Lines */}
          {showEma && ema50Path && (
            <path d={ema50Path} fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          )}
          {showEma && ema20Path && (
            <path d={ema20Path} fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.9" />
          )}

          {/* Candlesticks or Line */}
          {chartType === 'line' ? (
            <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2" />
          ) : (
            candles.map((c, i) => {
              const x = getX(i);
              const isBullish = c.close >= c.open;
              const candleColor = isBullish ? '#10b981' : '#f43f5e';
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);
              const candleWidth = Math.max(Math.min(chartWidth / candles.length - 2, 8), 3);

              return (
                <g key={`candle-${i}`}>
                  {/* Upper and Lower Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Current Live Price Line */}
          <line
            x1={padding.left}
            y1={getY(currentPrice)}
            x2={width - padding.right}
            y2={getY(currentPrice)}
            stroke="#f59e0b"
            strokeDasharray="4 2"
            strokeWidth="1"
          />
          {/* Price Tag badge on right axis */}
          <rect
            x={width - padding.right + 2}
            y={getY(currentPrice) - 9}
            width={58}
            height={18}
            fill="#d97706"
            rx="3"
          />
          <text
            x={width - padding.right + 6}
            y={getY(currentPrice) + 4}
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {currentPrice.toFixed(2)}
          </text>

          {/* Crosshair Cursor Hover */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <line
                x1={padding.left}
                y1={getY(activeCandle.close)}
                x2={width - padding.right}
                y2={getY(activeCandle.close)}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
            </g>
          )}

          {/* Time axis labels */}
          {candles
            .filter((_, i) => i % Math.ceil(candles.length / 6) === 0)
            .map((c, i) => {
              const originalIndex = candles.indexOf(c);
              return (
                <text
                  key={`time-${i}`}
                  x={getX(originalIndex)}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono"
                >
                  {c.time}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Legend & Daily Levels Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
            <span>EMA 20</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block"></span>
            <span>EMA 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-emerald-500/70 inline-block rounded-xs"></span>
            <span>Mua / Khối lượng tăng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-rose-500/70 inline-block rounded-xs"></span>
            <span>Bán / Khối lượng giảm</span>
          </div>
        </div>

        {/* Pivot Points quick badges */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>R1: <span className="text-emerald-400 font-semibold">2,745.10</span></span>
          <span>PP: <span className="text-amber-400 font-semibold">2,732.50</span></span>
          <span>S1: <span className="text-rose-400 font-semibold">2,725.80</span></span>
        </div>
      </div>
    </div>
  );
};
