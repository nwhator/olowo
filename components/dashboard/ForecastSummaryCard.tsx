'use client';

import React from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle, TrendingDown, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { ForecastReport } from '@/lib/treasury/forecast';

interface ForecastSummaryCardProps {
  forecast: ForecastReport;
}

export function ForecastSummaryCard({ forecast }: ForecastSummaryCardProps) {
  // Chart data
  const data = forecast.points.map((p) => ({
    name: p.day,
    balance: p.projectedBalance,
    reserve: p.reserveFloor,
    discretionary: p.discretionaryRemaining,
  }));

  return (
    <div className="rounded-xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D4C] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Treasury Forecast</h3>
          <p className="text-[11px] text-[#8896AB] mt-0.5">30-day projected operating runway</p>
        </div>
        <Link
          href="/forecast"
          className="text-xs text-[#35E0B2] hover:underline flex items-center gap-1"
        >
          <span>Detailed Model</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Warning Alert Banner */}
      {forecast.warningAlert && (
        <div className="mx-5 mt-4 p-3 rounded-lg bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#F5B942] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-[#F5B942] block">Treasury attention</span>
            <span className="text-[#8896AB] text-[11px] leading-relaxed">
              {forecast.warningAlert}
            </span>
          </div>
        </div>
      )}

      {/* Recharts Area Chart */}
      <div className="p-5 flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#35E0B2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#35E0B2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#5E6E85"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1A2D4C' }}
            />
            <YAxis
              stroke="#5E6E85"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1A2D4C' }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#08111F] border border-[#1A2D4C] p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-mono">
                      <div className="text-[#8896AB]">{payload[0].payload.name}</div>
                      <div className="text-[#35E0B2] font-semibold">
                        Balance: ${payload[0].value?.toLocaleString()} USDC
                      </div>
                      <div className="text-[#EF5B5B] text-[10px]">
                        Reserve Floor: ${forecast.reserveFloor.toLocaleString()} USDC
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={forecast.reserveFloor}
              stroke="#EF5B5B"
              strokeDasharray="3 3"
              label={{
                value: 'Min Reserve $5k',
                fill: '#EF5B5B',
                fontSize: 10,
                position: 'right',
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#35E0B2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#balanceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="px-5 py-3 border-t border-[#1A2D4C] bg-[#0A1424] grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-[10px] text-[#5E6E85] font-mono block">RUNWAY TO FLOOR</span>
          <span className="font-mono font-semibold text-[#F5B942]">
            {forecast.daysUntilReserveBreach ? `${forecast.daysUntilReserveBreach} Days` : '30+ Days'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#5E6E85] font-mono block">DAILY BURN</span>
          <span className="font-mono font-semibold text-white">
            ${forecast.burnRatePerDay}/day
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#5E6E85] font-mono block">RESERVE FLOOR</span>
          <span className="font-mono font-semibold text-[#35E0B2]">
            ${forecast.reserveFloor.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
