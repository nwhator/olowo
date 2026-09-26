'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { UpcomingObligationsList } from '@/components/treasury/UpcomingObligationsList';
import { Treasury, UpcomingObligation, Policy } from '@/types';
import { ForecastReport } from '@/lib/treasury/forecast';
import { playSound } from '@/lib/sound';
import {
  Wallet,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Loader2,
} from 'lucide-react';

export default function TreasuryPage() {
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [obligations, setObligations] = useState<UpcomingObligation[]>([]);
  const [forecast, setForecast] = useState<ForecastReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState<number>(2000);
  const [isDepositing, setIsDepositing] = useState(false);

  const fetchTreasuryData = async () => {
    try {
      const res = await fetch('/api/treasury');
      const data = await res.json();
      if (data.treasury) setTreasury(data.treasury);
      if (data.obligations) setObligations(data.obligations);
      if (data.forecast) setForecast(data.forecast);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuryData();
  }, []);

  const handleDeposit = async () => {
    setIsDepositing(true);
    playSound('click');
    try {
      await fetch('/api/treasury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deposit', amount: depositAmount }),
      });
      playSound('success');
      await fetchTreasuryData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDepositing(false);
    }
  };

  if (isLoading || !treasury) {
    return (
      <AppShell title="Treasury" subtitle="Capital allocation and reserve protection">
        <div className="flex items-center justify-center py-20 text-[#64748B] dark:text-[#8896AB] gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
          <span className="font-mono text-xs">Loading treasury state...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="OLOWO Treasury"
      subtitle="Corporate liquidity, reserved obligations, and protected capital floor"
      onRefresh={fetchTreasuryData}
    >
      <div className="space-y-8">
        {/* Section 33: Total Treasury & Balance Breakdown */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB] uppercase tracking-wider">
                TOTAL CIRCLE TREASURY
              </span>
              <div className="text-3xl md:text-4xl font-bold font-mono text-[#101828] dark:text-white mt-1">
                ${treasury.balance.toLocaleString()}{' '}
                <span className="text-base text-[#00A878] dark:text-[#35E0B2] font-semibold">{treasury.currency}</span>
              </div>
            </div>

            {/* Quick deposit testnet simulation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeposit}
                disabled={isDepositing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#12223B] dark:hover:bg-[#1A2D4C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-mono text-[#101828] dark:text-white transition-all disabled:opacity-50"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
                <span>+ $2,000 Inbound (Testnet)</span>
              </button>
            </div>
          </div>

          {/* Allocation Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Reserved */}
            <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#8896AB]">
                <span className="font-mono font-medium">RESERVED LIQUIDITY</span>
                <Lock className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#F5B942]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white">
                ${treasury.reserved.toLocaleString()} <span className="text-xs text-[#F59E0B] dark:text-[#F5B942]">USDC</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB] leading-relaxed">
                Committed to approved upcoming liabilities (AWS, Contractor retainers). Ring-fenced from discretionary spending.
              </p>
            </div>

            {/* 2. Minimum Operating Reserve */}
            <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#FCA5A5] dark:border-[#EF5B5B]/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#DC2626] dark:text-[#EF5B5B]">
                <span className="font-mono font-medium">PROTECTED OPERATING FLOOR</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white">
                ${treasury.operatingReserve.toLocaleString()} <span className="text-xs text-[#DC2626] dark:text-[#EF5B5B]">USDC</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB] leading-relaxed">
                Emergency balance threshold set in your mandate. Autonomous payments that would breach this floor are strictly blocked.
              </p>
            </div>

            {/* 3. Available Discretionary */}
            <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#A7F3D0] dark:border-[#35E0B2]/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#00A878] dark:text-[#35E0B2]">
                <span className="font-mono font-medium">DISCRETIONARY AVAILABLE</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white">
                ${treasury.available.toLocaleString()} <span className="text-xs text-[#00A878] dark:text-[#35E0B2]">USDC</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB] leading-relaxed">
                Uncommitted funds available for autonomous vendor settlements (Total Balance minus Reserved).
              </p>
            </div>
          </div>
        </div>

        {/* Section 35: Treasury Intelligence Card */}
        <div className="p-6 rounded-2xl bg-[#F0FDF4] dark:bg-[#12223B]/60 border border-[#BBF7D0] dark:border-[#35E0B2]/30 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#101828] dark:text-white uppercase font-mono tracking-tight">
              OLOWO Treasury Intelligence
            </h3>
          </div>

          <div className="space-y-2 text-xs text-[#334155] dark:text-white/90 leading-relaxed font-mono">
            <p className="text-[#00A878] dark:text-[#35E0B2] font-semibold">
              ● Your current treasury is healthy.
            </p>
            <p>
              • ${treasury.reserved.toLocaleString()} USDC is committed to upcoming verified obligations.
            </p>
            <p>
              • ${treasury.operatingReserve.toLocaleString()} USDC is protected as your minimum operating reserve floor.
            </p>
            <p>
              • ${treasury.available.toLocaleString()} USDC is currently discretionary and safe for operations.
            </p>
          </div>

          {forecast?.warningAlert && (
            <div className="p-3 rounded-lg bg-[#FEF3C7] dark:bg-[#F5B942]/10 border border-[#FCD34D] dark:border-[#F5B942]/30 text-xs text-[#B45309] dark:text-[#F5B942] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{forecast.warningAlert}</span>
            </div>
          )}
        </div>

        {/* Section 34: Upcoming Obligations */}
        <UpcomingObligationsList
          obligations={obligations}
          onObligationToggled={fetchTreasuryData}
        />
      </div>
    </AppShell>
  );
}
