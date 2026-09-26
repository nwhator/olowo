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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid Autonomously
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#4D7CFE]/10 dark:text-[#4D7CFE] border border-[#2563EB]/30 dark:border-[#4D7CFE]/30">
            <CheckCircle2 className="w-3 h-3" />
            Human Approved
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#D97706]/10 text-[#D97706] dark:bg-[#F5B942]/10 dark:text-[#F5B942] border border-[#D97706]/30 dark:border-[#F5B942]/30">
            <AlertTriangle className="w-3 h-3" />
            Approval Required
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#EF5B5B]/10 dark:text-[#EF5B5B] border border-[#DC2626]/30 dark:border-[#EF5B5B]/30">
            <Ban className="w-3 h-3" />
            Blocked
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/20">
            <Clock className="w-3 h-3" />
            Verified (Scheduled)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 dark:bg-[#5E6E85]/10 dark:text-[#8896AB] border border-slate-200 dark:border-[#5E6E85]/30">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-white dark:bg-[#08111F]">
        <div>
          <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight">Recent Invoices & Operations</h3>
          <p className="text-[11px] text-[#64748B] dark:text-[#8896AB] mt-0.5">Continuous invoice monitoring and policy evaluation</p>
        </div>
        <Link
          href="/invoices"
          className="text-xs text-[#00A878] dark:text-[#35E0B2] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>All Invoices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0A1424] text-[#64748B] dark:text-[#5E6E85] font-mono text-[11px]">
              <th className="py-3 px-5 font-semibold">INVOICE</th>
              <th className="py-3 px-5 font-semibold">VENDOR</th>
              <th className="py-3 px-5 font-semibold">AMOUNT</th>
              <th className="py-3 px-5 font-semibold">DUE DATE</th>
              <th className="py-3 px-5 font-semibold">AI DECISION</th>
              <th className="py-3 px-5 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60 text-[#101828] dark:text-white">
            {invoices.slice(0, 5).map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/60 transition-colors group">
                <td className="py-3.5 px-5 font-mono font-bold text-[#101828] dark:text-white">
                  <Link href={`/invoices/${inv.id}`} className="hover:text-[#00A878] dark:hover:text-[#35E0B2] transition-colors">
                    {inv.number}
                  </Link>
                </td>
                <td className="py-3.5 px-5 font-semibold text-[#101828] dark:text-white/90">
                  {inv.vendorName}
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-[#101828] dark:text-white">
                  ${inv.amount.toLocaleString()} <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">USDC</span>
                </td>
                <td className="py-3.5 px-5 text-[#64748B] dark:text-[#8896AB] font-mono">
                  {inv.dueDate}
                </td>
                <td className="py-3.5 px-5">
                  {getStatusBadge(inv.status, inv.aiDecision)}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-semibold text-[#344054] dark:text-[#8896AB] group-hover:text-[#101828] dark:group-hover:text-white group-hover:border-[#00A878] dark:group-hover:border-[#35E0B2]/40 transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 text-[#00A878] dark:text-[#35E0B2]" />
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
