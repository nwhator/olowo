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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30">
            <AlertTriangle className="w-3 h-3" />
            Needs Approval
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#EF5B5B]/10 text-[#EF5B5B] border border-[#EF5B5B]/30">
            <Ban className="w-3 h-3" />
            Blocked
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/20">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#5E6E85]/10 text-[#8896AB] border border-[#1A2D4C]">
            Pending
          </span>
        );
    }
  };

  const getDecisionBadge = (decision: Invoice['aiDecision']) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="font-mono text-xs text-[#35E0B2] font-semibold">
            Autonomous
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="font-mono text-xs text-[#F5B942] font-semibold">
            Approval Required
          </span>
        );
      case 'BLOCK':
        return (
          <span className="font-mono text-xs text-[#EF5B5B] font-semibold">
            Blocked by Policy
          </span>
        );
    }
  };

  return (
    <AppShell title="Invoices" subtitle="Continuous obligation verification and settlement">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5E6E85]" />
            <input
              type="text"
              placeholder="Search by invoice number or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D192C] border border-[#1A2D4C] text-xs text-white placeholder-[#5E6E85] focus:outline-none focus:border-[#35E0B2]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-3.5 h-3.5 text-[#5E6E85]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0D192C] border border-[#1A2D4C] text-xs text-white font-mono focus:outline-none focus:border-[#35E0B2]"
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
        <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A2D4C] bg-[#0A1424] text-[#5E6E85] font-mono text-[11px]">
                  <th className="py-3.5 px-6 font-medium">INVOICE</th>
                  <th className="py-3.5 px-6 font-medium">VENDOR</th>
                  <th className="py-3.5 px-6 font-medium">AMOUNT</th>
                  <th className="py-3.5 px-6 font-medium">DUE</th>
                  <th className="py-3.5 px-6 font-medium">VERIFICATION</th>
                  <th className="py-3.5 px-6 font-medium">AI DECISION</th>
                  <th className="py-3.5 px-6 font-medium">STATUS</th>
                  <th className="py-3.5 px-6 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2D4C]/60 text-white">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#12223B]/60 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      <Link href={`/invoices/${inv.id}`} className="hover:text-[#35E0B2] transition-colors">
                        {inv.number}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-white/90">
                      {inv.vendorName}
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold">
                      ${inv.amount.toLocaleString()} <span className="text-[10px] text-[#8896AB]">USDC</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#8896AB]">
                      {inv.dueDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-[#35E0B2] font-medium">
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
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#08111F] border border-[#1A2D4C] text-[11px] font-medium text-[#8896AB] group-hover:text-white group-hover:border-[#35E0B2]/40 transition-all"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 text-[#35E0B2]" />
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
