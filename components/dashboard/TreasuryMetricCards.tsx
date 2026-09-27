'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ShieldCheck, Lock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Treasury } from '@/types';
import { useMarket } from '@/components/market/MarketContext';
import { formatDualCurrencyCompact } from '@/lib/market/language';

interface TreasuryMetricCardsProps {
  treasury: Treasury;
  awaitingApprovalCount: number;
}

export function TreasuryMetricCards({
  treasury,
  awaitingApprovalCount,
}: TreasuryMetricCardsProps) {
  const { t, exchangeRate, language } = useMarket();

  const totalDual = formatDualCurrencyCompact(treasury.balance || 0, exchangeRate);
  const availDual = formatDualCurrencyCompact(treasury.available || 0, exchangeRate);
  const resDual = formatDualCurrencyCompact(treasury.reserved || 0, exchangeRate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Treasury */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] relative overflow-hidden group hover:border-[#CBD5E1] dark:hover:border-[#253E68] transition-all shadow-xs">
        <div className="flex items-center justify-between text-[#64748B] dark:text-[#8896AB] mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">
            {t.treasuryTitle}
          </span>
          <div className="p-2 rounded-xl bg-[#00A878]/10 dark:bg-[#12223B] text-[#00A878] dark:text-[#35E0B2]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#101828] dark:text-white font-mono-numbers tracking-tight">
              {totalDual.usdc}
            </span>
            <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-bold">
              USDC
            </span>
          </div>
          <div className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold">
            {totalDual.ngn} Naira
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] dark:text-[#8896AB] border-t border-[#F1F5F9] dark:border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">{language === 'pidgin' ? 'Arc Network Dollar' : 'Settlement: Arc USDC'}</span>
          <Link
            href="/treasury"
            className="text-[11px] text-[#00A878] dark:text-[#35E0B2] hover:underline flex items-center gap-0.5 font-semibold"
          >
            <span>{language === 'pidgin' ? 'Check details' : 'Manage'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Available Discretionary Funds */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] relative overflow-hidden group hover:border-[#CBD5E1] dark:hover:border-[#253E68] transition-all shadow-xs">
        <div className="flex items-center justify-between text-[#64748B] dark:text-[#8896AB] mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">
            {t.availableTitle}
          </span>
          <div className="p-2 rounded-xl bg-[#2563EB]/10 dark:bg-[#12223B] text-[#2563EB] dark:text-[#4D7CFE]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#101828] dark:text-white font-mono-numbers tracking-tight">
              {availDual.usdc}
            </span>
            <span className="text-xs font-mono text-[#2563EB] dark:text-[#4D7CFE] font-bold">
              USDC
            </span>
          </div>
          <div className="text-xs font-mono text-[#2563EB] dark:text-[#4D7CFE] font-semibold">
            {availDual.ngn} Naira
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] dark:text-[#8896AB] border-t border-[#F1F5F9] dark:border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">{language === 'pidgin' ? 'Money wey free to pay' : 'Uncommitted funds'}</span>
          <span className="text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold">
            {language === 'pidgin' ? 'Ready sharp-sharp' : 'Ready to pay'}
          </span>
        </div>
      </div>

      {/* 3. Reserved Funds (Shop Rent & Ajo Money) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] relative overflow-hidden group hover:border-[#CBD5E1] dark:hover:border-[#253E68] transition-all shadow-xs">
        <div className="flex items-center justify-between text-[#64748B] dark:text-[#8896AB] mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">
            {t.reservedTitle}
          </span>
          <div className="p-2 rounded-xl bg-[#D97706]/10 dark:bg-[#12223B] text-[#D97706] dark:text-[#F5B942]">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#101828] dark:text-white font-mono-numbers tracking-tight">
              {resDual.usdc}
            </span>
            <span className="text-xs font-mono text-[#D97706] dark:text-[#F5B942] font-bold">
              USDC
            </span>
          </div>
          <div className="text-xs font-mono text-[#D97706] dark:text-[#F5B942] font-semibold">
            {resDual.ngn} Naira
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] dark:text-[#8896AB] border-t border-[#F1F5F9] dark:border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">{language === 'pidgin' ? 'Untouchable reserve' : 'Protected floor'}</span>
          <Link
            href="/treasury"
            className="text-[11px] text-[#D97706] dark:text-[#F5B942] hover:underline flex items-center gap-0.5 font-semibold"
          >
            <span>{language === 'pidgin' ? 'View 4 bills' : 'View obligations'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 4. Awaiting Approval */}
      <div
        className={`p-5 rounded-2xl border transition-all shadow-xs ${
          awaitingApprovalCount > 0
            ? 'bg-[#FFFBEB] dark:bg-[#141C2B] border-[#FDE68A] dark:border-[#F5B942]/40'
            : 'bg-white dark:bg-[#0D192C] border-[#E2E8F0] dark:border-[#1A2D4C]'
        }`}
      >
        <div className="flex items-center justify-between text-[#64748B] dark:text-[#8896AB] mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">
            {t.approvalsTitle}
          </span>
          <div
            className={`p-2 rounded-xl ${
              awaitingApprovalCount > 0
                ? 'bg-[#D97706]/15 text-[#D97706] dark:bg-[#F5B942]/10 dark:text-[#F5B942]'
                : 'bg-slate-100 dark:bg-[#12223B] text-slate-500 dark:text-[#8896AB]'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-[#101828] dark:text-white font-mono-numbers tracking-tight">
            {awaitingApprovalCount}
          </span>
          <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB]">
            {language === 'pidgin' ? 'Waybill' : 'Invoices'}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-[#F1F5F9] dark:border-[#1A2D4C]/60 pt-2.5">
          <span
            className={`text-[11px] font-medium ${
              awaitingApprovalCount > 0
                ? 'text-[#D97706] dark:text-[#F5B942]'
                : 'text-[#64748B] dark:text-[#8896AB]'
            }`}
          >
            {awaitingApprovalCount > 0
              ? language === 'pidgin'
                ? 'E pass your daily limit'
                : 'Exceeds autonomous mandate'
              : 'No pending reviews'}
          </span>
          <Link
            href="/approvals"
            className="text-[11px] text-[#2563EB] dark:text-[#4D7CFE] hover:underline flex items-center gap-0.5 font-semibold"
          >
            <span>{language === 'pidgin' ? 'Check am' : 'Review'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
