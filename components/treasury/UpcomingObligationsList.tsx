'use client';

import React, { useState } from 'react';
import { UpcomingObligation } from '@/types';
import { Lock, Unlock, Clock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

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
    try {
      const res = await fetch('/api/treasury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_reserve', obligationId: id }),
      });
      if (onObligationToggled) onObligationToggled();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1A2D4C] flex items-center justify-between bg-[#08111F]">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Upcoming Obligations</h3>
          <p className="text-[11px] text-[#8896AB] mt-0.5">
            Committed liabilities ring-fenced to prevent liquidity shortfalls
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#4D7CFE] bg-[#4D7CFE]/10 border border-[#4D7CFE]/30 px-2 py-0.5 rounded">
          {obligations.filter((o) => o.isReserved).length} RESERVED
        </span>
      </div>

      <div className="divide-y divide-[#1A2D4C]/60">
        {obligations.map((item) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#12223B]/40 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  item.isReserved
                    ? 'bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30'
                    : 'bg-[#12223B] text-[#8896AB] border border-[#1A2D4C]'
                }`}
              >
                {item.isReserved ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.vendorName}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      item.priority === 'CRITICAL'
                        ? 'bg-[#EF5B5B]/10 text-[#EF5B5B] border-[#EF5B5B]/30 font-semibold'
                        : item.priority === 'HIGH'
                        ? 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/30'
                        : 'bg-[#5E6E85]/10 text-[#8896AB] border-[#1A2D4C]'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-[#8896AB] mt-0.5">{item.title}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#5E6E85] font-mono mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Due in {item.daysUntilDue} days ({item.dueDate})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">
                  ${item.amount.toLocaleString()} <span className="text-xs text-[#8896AB]">USDC</span>
                </div>
                <div className="text-[11px] font-mono">
                  {item.isReserved ? (
                    <span className="text-[#4D7CFE]">Liquidity Reserved</span>
                  ) : (
                    <span className="text-[#8896AB]">Unreserved</span>
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
