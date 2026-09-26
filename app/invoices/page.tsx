'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Invoice } from '@/types';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (data.invoices) setInvoices(data.invoices);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && inv.status === filterStatus;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'AUTONOMOUS_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#4D7CFE]/10 dark:text-[#4D7CFE] border border-[#2563EB]/30 dark:border-[#4D7CFE]/30">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#D97706]/10 text-[#D97706] dark:bg-[#F5B942]/10 dark:text-[#F5B942] border border-[#D97706]/30 dark:border-[#F5B942]/30">
            <AlertTriangle className="w-3 h-3" />
            Needs Approval
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#EF5B5B]/10 dark:text-[#EF5B5B] border border-[#DC2626]/30 dark:border-[#EF5B5B]/30">
            <Ban className="w-3 h-3" />
            Blocked
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/20">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-[#5E6E85]/10 dark:text-[#8896AB] border border-slate-200 dark:border-[#1A2D4C]">
            Pending
          </span>
        );
    }
  };

  const getDecisionBadge = (decision: Invoice['aiDecision']) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="font-mono text-xs text-[#00A878] dark:text-[#35E0B2] font-bold">
            Autonomous
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="font-mono text-xs text-[#D97706] dark:text-[#F5B942] font-bold">
            Approval Required
          </span>
        );
      case 'BLOCK':
        return (
          <span className="font-mono text-xs text-[#DC2626] dark:text-[#EF5B5B] font-bold">
            Blocked by Policy
          </span>
        );
    }
  };

  return (
    <AppShell
      title="Invoices"
      subtitle="Continuous obligation verification and settlement"
      onRefresh={fetchInvoices}
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#94A3B8] dark:text-[#5E6E85]" />
            <input
              type="text"
              placeholder="Search by invoice number or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#5E6E85] focus:outline-none focus:border-[#00A878] dark:focus:border-[#35E0B2] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#5E6E85]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white font-mono font-semibold focus:outline-none focus:border-[#00A878] dark:focus:border-[#35E0B2] shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="AUTONOMOUS_PAID">Autonomous Paid</option>
              <option value="APPROVAL_REQUIRED">Approval Required</option>
              <option value="VERIFIED">Verified / Scheduled</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0A1424] text-[#64748B] dark:text-[#5E6E85] font-mono text-[11px]">
                  <th className="py-3.5 px-6 font-semibold">INVOICE</th>
                  <th className="py-3.5 px-6 font-semibold">VENDOR</th>
                  <th className="py-3.5 px-6 font-semibold">AMOUNT</th>
                  <th className="py-3.5 px-6 font-semibold">DUE</th>
                  <th className="py-3.5 px-6 font-semibold">VERIFICATION</th>
                  <th className="py-3.5 px-6 font-semibold">AI DECISION</th>
                  <th className="py-3.5 px-6 font-semibold">STATUS</th>
                  <th className="py-3.5 px-6 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60 text-[#101828] dark:text-white">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/60 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-[#101828] dark:text-white">
                      <Link href={`/invoices/${inv.id}`} className="hover:text-[#00A878] dark:hover:text-[#35E0B2] transition-colors">
                        {inv.number}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#101828] dark:text-white/90">
                      {inv.vendorName}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#101828] dark:text-white">
                      ${inv.amount.toLocaleString()} <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">USDC</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#64748B] dark:text-[#8896AB]">
                      {inv.dueDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-[#00A878] dark:text-[#35E0B2] font-semibold">
                        {inv.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getDecisionBadge(inv.aiDecision)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-semibold text-[#344054] dark:text-[#8896AB] group-hover:text-[#101828] dark:group-hover:text-white group-hover:border-[#00A878] dark:group-hover:border-[#35E0B2]/40 transition-all"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 text-[#00A878] dark:text-[#35E0B2]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
