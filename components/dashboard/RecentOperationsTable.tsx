'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle2, AlertTriangle, Ban, Clock } from 'lucide-react';
import { Invoice } from '@/types';

interface RecentOperationsTableProps {
  invoices: Invoice[];
}

export function RecentOperationsTable({ invoices }: RecentOperationsTableProps) {
  const getStatusBadge = (status: Invoice['status'], aiDecision: Invoice['aiDecision']) => {
    switch (status) {
      case 'AUTONOMOUS_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid Autonomously
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30">
            <CheckCircle2 className="w-3 h-3" />
            Human Approved
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30">
            <AlertTriangle className="w-3 h-3" />
            Approval Required
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#EF5B5B]/10 text-[#EF5B5B] border border-[#EF5B5B]/30">
            <Ban className="w-3 h-3" />
            Blocked
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/20">
            <Clock className="w-3 h-3" />
            Verified (Scheduled)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#5E6E85]/10 text-[#8896AB] border border-[#5E6E85]/30">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D4C] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Recent Invoices & Operations</h3>
          <p className="text-[11px] text-[#8896AB] mt-0.5">Continuous invoice monitoring and policy evaluation</p>
        </div>
        <Link
          href="/invoices"
          className="text-xs text-[#35E0B2] hover:underline flex items-center gap-1"
        >
          <span>All Invoices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#1A2D4C] bg-[#0A1424] text-[#5E6E85] font-mono text-[11px]">
              <th className="py-3 px-5 font-medium">INVOICE</th>
              <th className="py-3 px-5 font-medium">VENDOR</th>
              <th className="py-3 px-5 font-medium">AMOUNT</th>
              <th className="py-3 px-5 font-medium">DUE DATE</th>
              <th className="py-3 px-5 font-medium">AI DECISION</th>
              <th className="py-3 px-5 font-medium text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2D4C]/60 text-white">
            {invoices.slice(0, 5).map((inv) => (
              <tr key={inv.id} className="hover:bg-[#12223B]/60 transition-colors group">
                <td className="py-3.5 px-5 font-mono font-semibold text-white">
                  <Link href={`/invoices/${inv.id}`} className="hover:text-[#35E0B2] transition-colors">
                    {inv.number}
                  </Link>
                </td>
                <td className="py-3.5 px-5 font-medium text-white/90">
                  {inv.vendorName}
                </td>
                <td className="py-3.5 px-5 font-mono font-semibold">
                  ${inv.amount.toLocaleString()} <span className="text-[10px] text-[#8896AB]">USDC</span>
                </td>
                <td className="py-3.5 px-5 text-[#8896AB] font-mono">
                  {inv.dueDate}
                </td>
                <td className="py-3.5 px-5">
                  {getStatusBadge(inv.status, inv.aiDecision)}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#08111F] border border-[#1A2D4C] text-[11px] font-medium text-[#8896AB] group-hover:text-white group-hover:border-[#35E0B2]/40 transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 text-[#35E0B2]" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
