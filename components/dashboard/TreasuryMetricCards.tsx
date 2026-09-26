'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ShieldCheck, Lock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Treasury } from '@/types';

interface TreasuryMetricCardsProps {
  treasury: Treasury;
  awaitingApprovalCount: number;
}

export function TreasuryMetricCards({
  treasury,
  awaitingApprovalCount,
}: TreasuryMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Treasury */}
      <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C] relative overflow-hidden group hover:border-[#253E68] transition-all">
        <div className="flex items-center justify-between text-[#8896AB] mb-3">
          <span className="text-xs font-medium uppercase tracking-wider font-mono">
            Treasury
          </span>
          <div className="p-1.5 rounded-lg bg-[#12223B] text-[#35E0B2]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers tracking-tight">
            ${treasury.balance?.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-[#35E0B2] font-semibold">
            {treasury.currency}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#8896AB] border-t border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">Settlement: Arc USDC</span>
          <Link
            href="/treasury"
            className="text-[11px] text-[#35E0B2] hover:underline flex items-center gap-0.5"
          >
            <span>Manage</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Available Discretionary Funds */}
      <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C] relative overflow-hidden group hover:border-[#253E68] transition-all">
        <div className="flex items-center justify-between text-[#8896AB] mb-3">
          <span className="text-xs font-medium uppercase tracking-wider font-mono">
            Available
          </span>
          <div className="p-1.5 rounded-lg bg-[#12223B] text-[#4D7CFE]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers tracking-tight">
            ${treasury.available?.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-[#4D7CFE] font-semibold">
            {treasury.currency}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#8896AB] border-t border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">Uncommitted Discretionary</span>
          <span className="text-[11px] font-mono text-[#35E0B2]">Ready to pay</span>
        </div>
      </div>

      {/* 3. Reserved Funds */}
      <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C] relative overflow-hidden group hover:border-[#253E68] transition-all">
        <div className="flex items-center justify-between text-[#8896AB] mb-3">
          <span className="text-xs font-medium uppercase tracking-wider font-mono">
            Reserved
          </span>
          <div className="p-1.5 rounded-lg bg-[#12223B] text-[#F5B942]">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers tracking-tight">
            ${treasury.reserved?.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-[#F5B942] font-semibold">
            {treasury.currency}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#8896AB] border-t border-[#1A2D4C]/60 pt-2.5">
          <span className="text-[11px]">Committed to obligations</span>
          <Link
            href="/treasury"
            className="text-[11px] text-[#F5B942] hover:underline flex items-center gap-0.5"
          >
            <span>View 4 items</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 4. Awaiting Approval */}
      <div className={`p-5 rounded-xl border transition-all ${
        awaitingApprovalCount > 0
          ? 'bg-[#141C2B] border-[#F5B942]/40 shadow-[0_0_20px_rgba(245,185,66,0.06)]'
          : 'bg-[#0D192C] border-[#1A2D4C]'
      }`}>
        <div className="flex items-center justify-between text-[#8896AB] mb-3">
          <span className="text-xs font-medium uppercase tracking-wider font-mono">
            Awaiting Approval
          </span>
          <div className={`p-1.5 rounded-lg ${
            awaitingApprovalCount > 0 ? 'bg-[#F5B942]/10 text-[#F5B942]' : 'bg-[#12223B] text-[#8896AB]'
          }`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold text-white font-mono-numbers tracking-tight">
            {awaitingApprovalCount}
          </span>
          <span className="text-xs font-mono text-[#8896AB]">
            Invoices
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-[#1A2D4C]/60 pt-2.5">
          <span className={`text-[11px] ${awaitingApprovalCount > 0 ? 'text-[#F5B942]' : 'text-[#8896AB]'}`}>
            {awaitingApprovalCount > 0 ? 'Exceeds autonomous mandate' : 'No pending reviews'}
          </span>
          <Link
            href="/approvals"
            className="text-[11px] text-[#4D7CFE] hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>Review</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
