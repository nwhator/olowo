'use client';

import React, { useState } from 'react';
import { UpcomingObligation } from '@/types';
import { Lock, Unlock, Clock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { playClickSound, playPaymentSuccessSound } from '@/lib/sound';

interface UpcomingObligationsListProps {
  obligations: UpcomingObligation[];
  onObligationToggled?: () => void;
}

export function UpcomingObligationsList({
  obligations,
  onObligationToggled,
}: UpcomingObligationsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggleReserve(id: string) {
    setLoadingId(id);
    playClickSound();
    try {
      const res = await fetch('/api/treasury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_reserve', obligationId: id }),
      });
      playPaymentSuccessSound();
      if (onObligationToggled) onObligationToggled();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs transition-colors">
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-white dark:bg-[#08111F]">
        <div>
          <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight">Upcoming Obligations</h3>
          <p className="text-[11px] text-[#64748B] dark:text-[#8896AB] mt-0.5">
            Committed liabilities ring-fenced to prevent liquidity shortfalls
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#2563EB] dark:text-[#4D7CFE] bg-[#EFF6FF] dark:bg-[#4D7CFE]/10 border border-[#BFDBFE] dark:border-[#4D7CFE]/30 px-2.5 py-0.5 rounded-lg">
          {obligations.filter((o) => o.isReserved).length} RESERVED
        </span>
      </div>

      <div className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60">
        {obligations.map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/40 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                  item.isReserved
                    ? 'bg-[#EFF6FF] dark:bg-[#4D7CFE]/10 text-[#2563EB] dark:text-[#4D7CFE] border border-[#BFDBFE] dark:border-[#4D7CFE]/30'
                    : 'bg-[#F8FAFC] dark:bg-[#12223B] text-[#64748B] dark:text-[#8896AB] border border-[#E2E8F0] dark:border-[#1A2D4C]'
                }`}
              >
                {item.isReserved ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#101828] dark:text-white">{item.vendorName}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                      item.priority === 'CRITICAL'
                        ? 'bg-[#FEF2F2] dark:bg-[#EF5B5B]/10 text-[#DC2626] dark:text-[#EF5B5B] border-[#FCA5A5] dark:border-[#EF5B5B]/30'
                        : item.priority === 'HIGH'
                        ? 'bg-[#FFFBEB] dark:bg-[#F5B942]/10 text-[#D97706] dark:text-[#F5B942] border-[#FDE68A] dark:border-[#F5B942]/30'
                        : 'bg-slate-100 dark:bg-[#5E6E85]/10 text-slate-700 dark:text-[#8896AB] border-slate-200 dark:border-[#1A2D4C]'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">{item.title}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] dark:text-[#5E6E85] font-mono mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Due in {item.daysUntilDue} days ({item.dueDate})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <div className="text-base font-bold font-mono text-[#101828] dark:text-white">
                  ${item.amount.toLocaleString()} <span className="text-xs text-[#64748B] dark:text-[#8896AB]">USDC</span>
                </div>
                <div className="text-[11px] font-mono font-medium">
                  {item.isReserved ? (
                    <span className="text-[#2563EB] dark:text-[#4D7CFE]">Liquidity Ring-fenced</span>
                  ) : (
                    <span className="text-[#64748B] dark:text-[#8896AB]">Unreserved</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
