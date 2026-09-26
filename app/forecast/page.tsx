'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { ForecastReport } from '@/lib/treasury/forecast';
import { Treasury, UpcomingObligation } from '@/types';
import { playSound } from '@/lib/sound';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function ForecastPage() {
  const [forecast, setForecast] = useState<ForecastReport | null>(null);
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [simulateLargePayment, setSimulateLargePayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchForecast = async () => {
    try {
      const res = await fetch('/api/treasury');
      const data = await res.json();
      if (data.forecast) setForecast(data.forecast);
      if (data.treasury) setTreasury(data.treasury);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  if (isLoading || !forecast || !treasury) {
    return (
      <AppShell title="Treasury Forecast" subtitle="Predictive liquidity and runway modeling">
        <div className="flex items-center justify-center py-20 text-[#64748B] dark:text-[#8896AB] gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
          <span className="font-mono text-xs">Simulating forward cash flows...</span>
        </div>
      </AppShell>
    );
  }

  // Generate chart data (optionally adjusting for simulated payment)
  const chartData = forecast.points.map((p) => {
    const adj = simulateLargePayment ? 4800 : 0;
    const balance = Math.max(0, p.projectedBalance - adj);
    return {
      day: p.day,
      balance,
      reserve: p.reserveFloor,
      committed: p.committedFunds,
    };
  });

  return (
    <AppShell
      title="Treasury Forecast"
      subtitle="Predictive liquidity, burn modeling, and reserve runway"
      onRefresh={fetchForecast}
    >
      <div className="space-y-8">
        {/* Warning Banner */}
        {forecast.warningAlert && (
          <div className="p-5 rounded-2xl bg-[#FEF3C7] dark:bg-[#F5B942]/10 border border-[#FCD34D] dark:border-[#F5B942]/40 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#FDE68A] dark:bg-[#F5B942]/20 text-[#B45309] dark:text-[#F5B942] shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#B45309] dark:text-[#F5B942] tracking-tight">
                Treasury Reserve Warning
              </h3>
              <p className="text-xs text-[#78350F] dark:text-white/90 mt-1 font-mono leading-relaxed">
                {forecast.warningAlert}
              </p>
            </div>
          </div>
        )}

        {/* Simulation Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
            <span className="font-semibold text-[#101828] dark:text-white">Scenario Simulator:</span>
            <span className="text-[#64748B] dark:text-[#8896AB]">Model the impact of pending transactions on runway</span>
          </div>

          <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white select-none">
            <span>Include pending $4,800 payment</span>
            <input
              type="checkbox"
              checked={simulateLargePayment}
              onChange={(e) => {
                playSound('toggle');
                setSimulateLargePayment(e.target.checked);
              }}
              className="rounded bg-[#F8FAFC] dark:bg-[#08111F] border-[#CBD5E1] dark:border-[#1A2D4C] text-[#00A878] dark:text-[#35E0B2] focus:ring-0 w-4 h-4"
            />
          </label>
        </div>

        {/* Main Forecast Chart */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div>
              <h3 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
                30-Day Forward Balance vs Minimum Reserve Floor
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">
                Evaluated against committed vendor obligations and historic operating burn ($240/day)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00A878] dark:bg-[#35E0B2]" />
                <span className="text-[#101828] dark:text-white font-medium">Projected Treasury</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#DC2626] dark:bg-[#EF5B5B]" />
                <span className="text-[#DC2626] dark:text-[#EF5B5B] font-medium">Min Reserve ($5k)</span>
              </div>
            </div>
          </div>

          <div className="w-full h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A878" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00A878" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] p-3 rounded-xl shadow-lg text-xs space-y-1.5 font-mono">
                          <div className="text-[#64748B] dark:text-[#8896AB] font-semibold">{payload[0].payload.day}</div>
                          <div className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                            Projected Balance: ${payload[0].value?.toLocaleString()} USDC
                          </div>
                          <div className="text-[#DC2626] dark:text-[#EF5B5B] text-[11px]">
                            Protected Floor: ${forecast.reserveFloor.toLocaleString()} USDC
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={forecast.reserveFloor}
                  stroke="#DC2626"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: 'Reserve Floor: $5,000',
                    fill: '#DC2626',
                    fontSize: 11,
                    position: 'insideBottomRight',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#00A878"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#foreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block">STARTING BALANCE</span>
              <span className="text-xl font-bold font-mono text-[#101828] dark:text-white mt-1 block">
                ${treasury.balance.toLocaleString()} USDC
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block">RING-FENCED RESERVED</span>
              <span className="text-xl font-bold font-mono text-[#F59E0B] dark:text-[#F5B942] mt-1 block">
                ${treasury.reserved.toLocaleString()} USDC
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block">DAILY BURN RATE</span>
              <span className="text-xl font-bold font-mono text-[#101828] dark:text-white mt-1 block">
                ${forecast.burnRatePerDay} USDC/day
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block">RUNWAY TO RESERVE FLOOR</span>
              <span className="text-xl font-bold font-mono text-[#F59E0B] dark:text-[#F5B942] mt-1 block">
                {simulateLargePayment ? '4 Days' : `${forecast.daysUntilReserveBreach} Days`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
